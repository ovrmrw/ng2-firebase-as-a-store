import { Injectable, Inject, Optional } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';

import { Dispatcher, Provider, ReducerContainer, InitialState, promisify } from './common';
import { Action, RestoreAction } from './actions';
import { IncrementState, AppState } from './types';
import { incrementReducer, restoreReducer } from './reducers';
import { FirebaseMiddleware } from './firebase';


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

  constructor(
    private dispatcher$: Dispatcher<Action>,
    @Inject(InitialState)
    private initialState: AppState,
    @Inject(FirebaseMiddleware) @Optional()
    private firebase: FirebaseMiddleware | null, // DIできない場合はnullになる。テスト時はnullにする。
  ) {
    /* >>> createStore */
    this.provider$ = new BehaviorSubject(initialState);
    this.applyReducers(initialState);
    this.applyMiddlewares(initialState);
    /* <<< createStore */
  }


  applyReducers(initialState: AppState): void {
    ReducerContainer
      .zip<AppState>(...[ // わざわざ配列にした上でSpreadしているのは、VSCodeのオートインデントが有効になるから。
        incrementReducer(initialState.increment, this.dispatcher$), // as Observable<Promise<IncrementState>>
        restoreReducer(initialState.restore, this.dispatcher$), // as Observable<boolean>
        (increment, restore): AppState => {
          return Object.assign({}, initialState, { increment, restore }); // 型を曖昧にしているのでテストでカバーする。
        }
      ])
      .subscribe(newState => {
        console.log('newState:', newState);
        this.provider$.next(newState); // ProviderをnextしてStateクラスにストリームを流す。
        this.effectAfterReduced(newState);
      });
  }

  effectAfterReduced(newState: AppState): void {
    promisify(newState, true)
      .then(resolvedState => { // このとき全てのPromiseは解決している。
        console.log('resolvedState:', resolvedState);
        if (this.firebase && !resolvedState.restore) { // RestoreActionではない場合のみFirebaseに書き込みする。
          this.firebase.saveCurrentState('firebase/ref/path', resolvedState);
        }
      });
  }


  applyMiddlewares(initialState: AppState): void {
    if (this.firebase) {
      this.firebase.connect$<AppState>('firebase/ref/path')
        .subscribe(cloudState => {
          if (cloudState && cloudState.uuid !== initialState.uuid) { // 自分以外の誰かがFirebaseを更新した場合は、その値をDispatcherにnextする。
            this.dispatcher$.next(new RestoreAction(cloudState));
          }
        });
    }
  }

}
