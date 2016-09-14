import { Injectable } from '@angular/core';
// import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import lodash from 'lodash';

import { Action, IncrementAction, DecrementAction, ReplaceAction, ResetAction } from './actions';
import { IncrementState, AppState, ResolvedAppState } from './types';
import { FirebaseController } from './firebase';


const initialState: AppState = {
  increment: Promise.resolve({
    counter: 0
  }),
  replace: false,
  timestamp: 0
}


export class Dispatcher<T> extends Subject<T> {
  constructor() { super(); }
}


@Injectable()
export class Store {
  private stateSubject$: Subject<AppState>;
  private currentState: AppState;

  constructor(
    private dispatcher$: Dispatcher<Action>,
    private fc: FirebaseController,
  ) {
    this.currentState = initialState;
    this.stateSubject$ = new BehaviorSubject<AppState>(initialState);

    Observable
      .zip<AppState>(
      incrementReducer(initialState.increment, dispatcher$),
      replaceReducer(initialState.replace, dispatcher$),
      (increment, replace) => {
        return { increment, replace, timestamp: new Date().valueOf() } as AppState
      })
      .subscribe(newState => {
        console.log(newState);
        this.currentState = newState;
        this.stateSubject$.next(newState);
        if (!newState.replace) { // Only not ReplaceAction, write to Firebase.
          this.fc.uploadAfterResolve('firebase/ref/path', newState);
        }
      });

    this.fc.connect$<ResolvedAppState>('firebase/ref/path')
      .subscribe(cloudState => {
        if (cloudState && cloudState.timestamp > this.currentState.timestamp + 100) { // +100がないと複数ブラウザで開いたときに永久ループが始まる。          
          this.dispatcher$.next(new ReplaceAction(cloudState));
        }
      });
  }

  get appState$() { return this.stateSubject$.asObservable(); }
}


function incrementReducer(initState: Promise<IncrementState>, dispatcher$: Dispatcher<Action>): Observable<Promise<IncrementState>> {
  return dispatcher$.scan<typeof initState>((state, action) => {
    /****/ if (action instanceof IncrementAction) {
      return new Promise<IncrementState>(resolve => {
        setTimeout(() => {
          state.then(s => resolve({ counter: ++s.counter }));
        }, 500);
      });
    } else if (action instanceof DecrementAction) {
      return new Promise<IncrementState>(resolve => {
        setTimeout(() => {
          state.then(s => resolve({ counter: --s.counter }));
        }, 500);
      });
    } else if (action instanceof ReplaceAction) { // ReplaceActionのときは強制的に値を置き換える。
      const _action = action as ReplaceAction; // tscの識別エラー対応
      return Promise.resolve(_action.stateFromOutside.increment);
    } else if (action instanceof ResetAction) {
      return lodash.cloneDeep(initialState.increment);
    } else {
      return state;
    }
  }, initState);
}

function replaceReducer(initState: boolean, dispatcher$: Dispatcher<Action>): Observable<boolean> {
  return dispatcher$.scan<typeof initState>((state, action) => {
    if (action instanceof ReplaceAction) {
      return true;
    } else {
      return false;
    }
  }, initState);
}