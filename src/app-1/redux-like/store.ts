import { Injectable, Inject, Optional } from '@angular/core';
import { Observable, Subject, BehaviorSubject, Subscription } from 'rxjs/Rx';
import lodash from 'lodash';

import { Disposer } from '../shared/disposer';
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
export class Store extends Disposer {
  readonly provider$: Provider<AppState>;
  private canceler$ = new Subject<undefined>();

  constructor(
    private dispatcher$: Dispatcher<Action>,
    @Inject(InitialState)
    private initialState: AppState,
    @Inject(FirebaseEffector) @Optional()
    private firebase: FirebaseEffector | null, // DIできない場合はnullになる。テスト時はnullにする。
  ) {
    super();

    /* >>> createStore */
    this.provider$ = new BehaviorSubject(initialState);
    this.applyReducers().applyEffectors();
    /* <<< createStore */
  }


  applyReducers(): this {
    this.disposable = ReducerContainer
      .zip<AppState>(...[ // わざわざ配列にした上でSpreadしているのは、VSCodeのオートインデントが有効になるから。
        incrementReducer(this.initialState.increment, this.dispatcher$), // as Observable<Promise<IncrementState>>
        restoreReducer(this.initialState.restore, this.dispatcher$), // as Observable<boolean>
        cancelReducer(this.dispatcher$), // as Observable<boolean>
        invokeErrorReducer(null, this.dispatcher$),
        (increment, restore, cancel): AppState => {
          this.cancelReducers(cancel);
          return Object.assign<{}, AppState, {}>({}, this.initialState, { increment, restore }); // 型を曖昧にしているのでテストでカバーする。
        }
      ])
      .takeUntil(this.canceler$)
      .subscribe(newState => {
        console.log('newState:', newState);
        this.provider$.next(newState); // ProviderをnextしてStateクラスにストリームを流す。
        this.effectAfterReduced(newState);
      });
    return this;
  }


  effectAfterReduced(newState: AppState): void {
    promisify(newState, true)
      .then(resolvedState => { // このとき全てのPromiseは解決している。
        // console.log('resolvedState:', resolvedState);
        if (this.firebase && !resolvedState.restore) { // RestoreActionではない場合のみFirebaseに書き込みする。
          this.firebase.saveCurrentState('firebase/ref/path', resolvedState);
        }
      })
      .catch(err => console.error(err));
  }


  applyEffectors(): this {
    if (this.firebase) {
      this.disposable = this.firebase.connect$<AppState>('firebase/ref/path')
        .takeUntil(this.canceler$)
        .subscribe(cloudState => {
          if (cloudState && cloudState.uuid !== this.initialState.uuid) { // 自分以外の誰かがFirebaseを更新した場合は、その値をDispatcherにnextする。
            this.dispatcher$.next(new RestoreAction(cloudState));
          }
        });
    }
    return this;
  }


  cancelReducers(isCancel: boolean): void {
    if (isCancel && this.subscriptionsCount) {
      this.canceler$.next();
      const message = 'CancelAction is dispatched.';
      console.warn(message);
      alert(message);
    }
  }

}
