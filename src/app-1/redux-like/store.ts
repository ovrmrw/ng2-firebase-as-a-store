import { Injectable, Inject, Optional } from '@angular/core';
import { Observable, Subject, BehaviorSubject, Subscription } from 'rxjs/Rx';
import lodash from 'lodash';

import { Dispatcher, Provider, ReducerContainer, InitialState, promisify } from './common';
import { Action, RestoreAction } from './actions';
import { IncrementState, AppState } from './types';
import { incrementReducer, restoreReducer, invokeErrorReducer, cancelReducer } from './reducers';
import { FirebaseEffector } from './firebase';


/////////////////////////////////////////////////////////////////////////////////////////
// Store
/*
  ServiceクラスでDispatcherにActionをセットしてnextすると、
  applyReducers関数内で定義されている各Reducer関数に前以て埋め込まれているDispatcherが発火し、
  scanオペレーターが走る。そしてzipオペレーターで纏めてsubscribeして、その中で
  Providerをnextして最終的にComponentクラスにStateが届く。
*/
@Injectable()
export class Store {
  readonly provider$: Provider<AppState>;
  private canceller$ = new Subject<undefined>();
  private firebaseEffectTrigger$ = new Subject<AppState>();

  constructor(
    private dispatcher$: Dispatcher<Action>,
    @Inject(InitialState)
    private initialState: AppState,
    @Inject(FirebaseEffector) @Optional()
    private firebase: FirebaseEffector | null, // DIできない場合はnullになる。テスト時はnullにする。
  ) {
    /* >>> createStore */
    this.provider$ = new BehaviorSubject(initialState);
    this.applyReducers().applyEffectors();
    /* <<< createStore */
  }


  applyReducers(): this {
    ReducerContainer
      .zip<AppState>(...[ // わざわざ配列にした上でSpreadしているのは、VSCodeのオートインデントが有効になるから。
        incrementReducer(this.initialState.increment, this.dispatcher$), // as Observable<Promise<IncrementState>>
        restoreReducer(this.initialState.restore, this.dispatcher$), // as Observable<boolean>
        cancelReducer(this.dispatcher$), // as Observable<boolean>
        invokeErrorReducer(this.dispatcher$), // as Observable<void | never>
        (increment, restore, cancel): AppState => { // projection
          this.cancelReducersAndEffectors(cancel);
          return Object.assign<{}, AppState, {}>({}, this.initialState, { increment, restore }); // 型を曖昧にしているのでテストでカバーする。
        }
      ])
      .takeUntil(this.canceller$)
      .subscribe(newState => {
        console.log('newState:', newState);
        this.provider$.next(newState); // ProviderをnextしてStateクラスにストリームを流す。
        this.effectAfterReduced(newState);
      });
    return this;
  }


  effectAfterReduced(newState: AppState): void {
    this.firebaseEffectTrigger$.next(newState);
  }


  applyEffectors(): this {
    if (this.firebase) {
      // Firebase Inbound
      this.firebase.connect$<AppState>('firebase/ref/path')
        .takeUntil(this.canceller$)
        .subscribe(cloudState => {
          if (cloudState && cloudState.uuid !== this.initialState.uuid) { // 自分以外の誰かがFirebaseを更新した場合は、その値をDispatcherにnextする。
            this.dispatcher$.next(new RestoreAction(cloudState));
          }
        });

      // Firebase Outbound
      this.firebaseEffectTrigger$
        .switchMap<AppState>(state => Observable.fromPromise(promisify(state, true))) // cancellation
        .takeUntil(this.canceller$)
        .subscribe(resolvedState => {
          if (this.firebase && !resolvedState.restore) { // RestoreActionではない場合のみFirebaseに書き込みする。
            this.firebase.saveCurrentState('firebase/ref/path', resolvedState);
          }
        });
    }
    return this;
  }


  cancelReducersAndEffectors(doCancel: boolean): void {
    if (doCancel) {
      this.canceller$.next();
      const message = 'CancelAction is dispatched.';
      console.warn(message);
      alert(message);
    }
  }

}
