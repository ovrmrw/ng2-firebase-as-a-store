import { Injectable, Inject, Optional } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import lodash from 'lodash';
import uuid from 'node-uuid';
import bluebird from 'bluebird';

import { Dispatcher, Provider, InitialState, BaseStore, promisify } from './common';
import { Action, IncrementAction, DecrementAction, RestoreAction, ResetAction } from './actions';
import { IncrementState, AppState } from './types';
import { FirebaseMiddleware } from './firebase';


/////////////////////////////////////////////////////////////////////////////////////////
// State
class DefaultAppState implements AppState {
  increment = Promise.resolve({
    counter: 0
  });
  restore = false;
  uuid = uuid.v4();
  canSaveToFirebase = () => !this.restore; // Stateに関数を含めることもできる。
}
const defaultAppState: AppState = new DefaultAppState();


/////////////////////////////////////////////////////////////////////////////////////////
// Store
/*
  ServiceクラスでDispatcherにActionをセットしてnextすると、
  applyReducers関数内で定義されている各Reducer関数に前以て埋め込まれているDispatcherが発火し、
  scanオペレーターが走る。そしてzipオペレーターで纏めてsubscribeして、その中で
  Providerをnextして最終的にComponentクラスにStateが届く。
*/
@Injectable()
export class Store extends BaseStore {
  readonly provider$: Provider<AppState>;

  constructor(
    private dispatcher$: Dispatcher<Action>,
    @Inject(InitialState) @Optional()
    private initialState: AppState | null, // DIできない場合はnullになる。
    @Inject(FirebaseMiddleware) @Optional()
    private firebase: FirebaseMiddleware | null, // DIできない場合はnullになる。テスト時はnullにする。
  ) {
    super();
    const _initialState: AppState = initialState || defaultAppState; // initialStateがnullならデフォルト値がセットされる。

    /* >>> createStore */
    this.provider$ = new BehaviorSubject(_initialState);
    this.applyReducers(_initialState);
    this.applyMiddlewares(_initialState);
    /* <<< createStore */
  }


  applyReducers(initialState: AppState): void {
    Observable
      .zip<AppState>(...[ // わざわざ配列にした上でSpreadしているのは、VSCodeのオートインデントが有効になるから。
        incrementReducer(initialState.increment, this.dispatcher$), // as Observable<Promise<IncrementState>>
        restoreReducer(initialState.restore, this.dispatcher$), // as Observable<boolean>
        (increment, restore): AppState => {
          return Object.assign(initialState, { increment, restore }); // 型を曖昧にしているのでテストでカバーする。
        }
      ])
      .subscribe((newState: AppState) => { // 本来は型指定不要
        console.log('newState:', newState);
        this.provider$.next(newState); // ProviderをnextしてStateクラスにストリームを流す。
        this.effectAfterReduced(newState);
      });
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
        if (this.firebase && resolvedState.canSaveToFirebase()) { // RestoreActionではない場合のみFirebaseに書き込みする。
          this.firebase.saveCurrentState('firebase/ref/path', resolvedState);
        }
      });
  }
}


/////////////////////////////////////////////////////////////////////////////////////////
// Reducers
function incrementReducer(initState: Promise<IncrementState> | IncrementState, dispatcher$: Dispatcher<Action>): Observable<Promise<IncrementState>> {
  return dispatcher$.scan<Promise<IncrementState>>((state, action) => { // Dispatcherをnextする度にここが発火する。
    /****/ if (action instanceof IncrementAction) {
      return new Promise<IncrementState>(resolve => {
        setTimeout(() => {
          state.then(s => resolve({ counter: s.counter + 1 }));
        }, 500);
      });
    } else if (action instanceof DecrementAction) {
      return new Promise<IncrementState>(resolve => {
        setTimeout(() => {
          state.then(s => resolve({ counter: s.counter - 1 }));
        }, 500);
      });
    } else if (action instanceof RestoreAction) {
      return promisify(action.stateFromOuterworld.increment);
    } else if (action instanceof ResetAction) {
      return promisify(initState);
    } else {
      return state;
    }
  }, promisify(initState));
}

function restoreReducer(initState: boolean, dispatcher$: Dispatcher<Action>): Observable<boolean> {
  return dispatcher$.scan<typeof initState>((state, action) => { // Dispatcherをnextする度にここが発火する。
    if (action instanceof RestoreAction) {
      return true;
    } else {
      return false;
    }
  }, initState);
}