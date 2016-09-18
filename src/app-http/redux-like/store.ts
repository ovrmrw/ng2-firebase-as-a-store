import { Injectable, Inject, Optional } from '@angular/core';
import { Http } from '@angular/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';
import lodash from 'lodash';
import uuid from 'node-uuid';
import bluebird from 'bluebird';

import { Dispatcher, Provider, ReducerContainer, InitialState, BaseStore, promisify } from './common';
import { Action, IncrementAction, DecrementAction, RestoreAction, ResetAction, TimeUpdateAction } from './actions';
import { IncrementState, TimeState, AppState } from './types';
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
  time = Promise.resolve({
    serial: 0
  });
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
    private http$: Http,
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
    ReducerContainer
      .zip<AppState>(...[ // わざわざ配列にした上でSpreadしているのは、VSCodeのオートインデントが有効になるから。
        incrementReducer(initialState.increment, this.dispatcher$), // as Observable<Promise<IncrementState>>
        restoreReducer(initialState.restore, this.dispatcher$), // as Observable<boolean>
        timeUpdateReducer(initialState.time, this.dispatcher$, this.http$), // as Observable<Promise<TimeState>>
        (increment, restore, time): AppState => {
          return Object.assign(initialState, { increment, restore, time }); // 型を曖昧にしているのでテストでカバーする。
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
    /*  */ if (action instanceof IncrementAction) {
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

function timeUpdateReducer(initState: Promise<TimeState> | TimeState, dispatcher$: Dispatcher<Action>, http$: Http): Observable<Promise<TimeState>> {
  return dispatcher$.scan<Promise<TimeState>>((state, action) => {
    /*  */ if (action instanceof TimeUpdateAction) {
      return http$.get('https://ntp-a1.nict.go.jp/cgi-bin/json')
        .delay(500) // わざと500ms余計に遅らせる。
        .map(res => res.json())
        .map(data => ({ serial: +data.st * 1000 } as TimeState))
        .toPromise();
    } else if (action instanceof RestoreAction) {
      return promisify(action.stateFromOuterworld.time);
    } else {
      return state;
    }
  }, promisify(initState));
}
