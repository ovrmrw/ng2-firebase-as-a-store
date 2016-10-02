import { Injectable, Inject, Optional } from '@angular/core';
import { Observable, Subject, BehaviorSubject, Subscription } from 'rxjs/Rx';
// import lodash from 'lodash';

import { Dispatcher, Provider, ReducerContainer, InitialState, promisify } from '../../../angular-rxjs-redux';
import { Action, RestoreAction } from './actions';
import { IncrementState, AppState, ResolvedAppState } from './types';
import { incrementStateReducer, restoreReducer, invokeErrorMapper, cancelMapper, timeStateReducer, actionNameMapper, mathStateZipper } from './reducers';
import { FirebaseEffector } from './firebase-effector';


@Injectable()
export class Store {
  readonly provider$: Provider<AppState>;
  private canceller$ = new Subject<undefined>();
  private firebaseEffectorTrigger$ = new Subject<AppState>();

  constructor(
    private dispatcher$: Dispatcher<Action>,
    @Inject(InitialState)
    private initialState: AppState,
    @Inject(FirebaseEffector) @Optional()
    private firebaseEffector: FirebaseEffector | null, /* DIできない場合はnullになる。テスト時はnullにする。 */
  ) {
    /* function createStore() { */
    this.provider$ = new BehaviorSubject(initialState);
    this.combineReducers();
    this.applyEffectors();
    /* } */
  }


  combineReducers(): void {
    ReducerContainer /* = Observable */
      .zip<AppState>(...[ /* わざわざ配列にした上でSpreadしているのは、VSCodeのオートインデントが有効になるから。 */
        incrementStateReducer(promisify(this.initialState.increment), this.dispatcher$), /* as Observable<Promise<IncrementState>> */
        timeStateReducer(promisify(this.initialState.time), this.dispatcher$), /* as Observable<Promise<TimeState>> */
        mathStateZipper(this.initialState.math, this.dispatcher$), /* as Observable<MathState> */
        restoreReducer(this.initialState.restore, this.dispatcher$), /* as Observable<boolean> */
        cancelMapper(this.dispatcher$), /* as Observable<boolean> */
        actionNameMapper(this.dispatcher$), /* as Observable<string> */
        invokeErrorMapper(this.dispatcher$), /* as Observable<void | never> */

        (increment, time, math, restore, cancel, actionName): AppState => { /* projection */
          this.cancelStateLoop(cancel);
          return Object.assign<{}, AppState, {}>({}, this.initialState, { increment, time, math, restore, actionName }); /* 型を曖昧にしているのでテストでカバーする。 */
        }
      ])
      .takeUntil(this.canceller$)
      .subscribe(newState => {
        this.provider$.next(newState); /* ProviderをnextしてStateクラスにストリームを流す。 */
        this.effectAfterReduced(newState);
      }, err => {
        console.error('Error from ReducerContainer:', err);
      });
  }


  effectAfterReduced(newState: AppState): void {
    console.log('newState:', newState);
    // promisify(newState, true).then((resolvedState: ResolvedAppState) => console.log('resolvedState:', resolvedState));

    this.firebaseEffectorTrigger$.next(newState);
  }


  applyEffectors(): void {
    if (this.firebaseEffector) {
      /* Firebase Inbound */
      this.firebaseEffector.connect$<AppState>('firebase/ref/path')
        .takeUntil(this.canceller$)
        .subscribe(cloudState => {
          if (cloudState && cloudState.uuid !== this.initialState.uuid) { /* 自分以外の誰かがFirebaseを更新した場合は、その値をDispatcherにnextする。 */
            this.dispatcher$.next(new RestoreAction(cloudState));
          }
        }, err => {
          console.error('Error from Inbound of FirebaseEffector:', err);
        });

      /* Firebase Outbound */
      this.firebaseEffectorTrigger$
        .switchMap<ResolvedAppState>(appState => Observable.fromPromise(promisify(appState, true))) /* cancellation */
        .takeUntil(this.canceller$)
        .subscribe(resolvedState => {
          if (this.firebaseEffector && !resolvedState.restore) { /* RestoreActionではない場合のみFirebaseに書き込みする。 */
            this.firebaseEffector.saveCurrentState('firebase/ref/path', resolvedState);
          }
        }, err => {
          console.error('Error from Outbound of FirebaseEffector:', err);
        });
    }
  }


  cancelStateLoop(doCancel: boolean): void {
    if (doCancel) {
      this.canceller$.next();
      const message = 'CancelAction is dispatched.';
      console.warn(message);
      alert(message);
    }
  }

}
