import { Injectable } from '@angular/core';
// import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import lodash from 'lodash';

import { Action, IncrementAction, DecrementAction, ReplaceAction } from './actions';
import { FirebaseController } from './firebase';


export class Dispatcher<T> extends Subject<T> {
  constructor() { super(); }
}


interface IncrementState {
  counter: number
}
export interface AppState {
  increment: IncrementState
  replace: boolean
  timestamp: number
}

const initialState: AppState = {
  increment: {
    counter: 0
  },
  replace: false,
  timestamp: 0
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
          this.fc.upload('firebase/ref/path', newState);
        }
      });

    this.fc.connect$<AppState>('firebase/ref/path')
      .subscribe(cloudState => {
        if (cloudState && cloudState.timestamp > this.currentState.timestamp + 100) { // +100がないと複数ブラウザで開いたときに永久ループが始まる。          
          this.dispatcher$.next(new ReplaceAction(cloudState));
        }
      });
  }

  get appState$() { return this.stateSubject$.asObservable(); }
}


function incrementReducer(initState: IncrementState, dispatcher$: Dispatcher<Action>): Observable<IncrementState> {
  return dispatcher$.scan<typeof initState>((state, action) => {
    if (action instanceof IncrementAction) {
      state.counter++;
    } else if (action instanceof DecrementAction) {
      state.counter--;
    }
    if (action instanceof ReplaceAction) { // ReplaceActionのときは強制的に値を置き換える。
      state = action.cloudState.increment;
    }
    return state;
  }, initState);
}

function replaceReducer(initState: boolean, dispatcher$: Dispatcher<Action>): Observable<boolean> {
  return dispatcher$.scan<typeof initState>((state, action) => {
    if (action instanceof ReplaceAction) {
      state = true;
    } else {
      state = false;
    }
    return state;
  }, initState);
}