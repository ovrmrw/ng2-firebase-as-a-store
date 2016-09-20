import { Injectable, Inject, Optional } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';
import bluebird from 'bluebird';

import { Dispatcher, Provider, InitialState, BaseStore, FirebaseMiddleware } from '../../redux-like-core';
import { Action, RestoreAction } from './actions';
import { AppState } from './types';
import { Reducer } from './reducer';


/////////////////////////////////////////////////////////////////////////////////////////
// Store
/*
  ServiceクラスでDispatcherにActionをセットしてnextすると、
  applyReducers関数内で定義されている各Reducer関数に前以て埋め込まれているDispatcherが発火し、
  scanオペレーターが走る。そしてzipオペレーターで纏めてsubscribeして、その中で
  Providerをnextして最終的にComponentクラスにStateが届く。
*/
@Injectable()
export class Store extends BaseStore<AppState> {
  constructor(
    private dispatcher$: Dispatcher<Action>,
    private reducer: Reducer,
    @Inject(InitialState)
    private initialState: AppState,
    @Inject(FirebaseMiddleware) @Optional()
    private firebase: FirebaseMiddleware | null, // DIできない場合はnullになる。テスト時はnullにする。
  ) {
    super(initialState, reducer);
    this.applyMiddlewares(initialState);
  }


  applyMiddlewares(initialState: AppState): void {
    if (this.firebase) {
      this.firebase.connect$<AppState>('firebase/ref/path')
        .subscribe((cloudState: AppState) => { // 本来はコールバックの型指定不要
          if (cloudState && cloudState.uuid !== initialState.uuid) { // 自分以外の誰かがFirebaseを更新した場合は、その値をDispatcherにnextする。
            this.dispatcher$.next(new RestoreAction(cloudState));
          }
        });
    }
  }

  effectAfterReduced(newState: AppState): void {
    bluebird.props(newState)
      .then((resolvedState: AppState) => { // このとき全てのPromiseは解決している。
        if (this.firebase && !resolvedState.restore) { // RestoreActionではない場合のみFirebaseに書き込みする。
          this.firebase.saveCurrentState('firebase/ref/path', resolvedState);
        }
      });
  }
}