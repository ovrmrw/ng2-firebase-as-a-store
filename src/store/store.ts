import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';

import { Action, IncrementAction, DecrementAction, PushHistoryAction, ReplaceAction, ResetAction } from './actions';
import { FirebaseController } from './firebase';


export class Dispatcher<T> extends Subject<T> {
  constructor() { super(); }
}


interface IncrementState {
  counter: number
}
interface HistoryState {
  actions: string[]
}
export interface AppState {
  increment: IncrementState
  history: HistoryState
  replace: boolean
  timestamp: number
}

const appState: AppState = {
  increment: {
    counter: 0
  },
  history: {
    actions: []
  },
  replace: false,
  timestamp: 0
};


@Injectable()
export class Store {
  private stateSubject$: Subject<AppState>;
  private currentState: AppState;

  constructor(
    private dispatcher$: Dispatcher<Action>,
    private fc: FirebaseController,
  ) {
    this.currentState = appState;
    this.stateSubject$ = new BehaviorSubject<AppState>(appState);

    Observable
      .zip<AppState>(
      incrementReducer(appState.increment, dispatcher$),
      historyReducer(appState.history, dispatcher$),
      replaceReducer(appState.replace, dispatcher$),
      (increment, history, replace) => {
        return { increment, history, replace, timestamp: new Date().valueOf() } as AppState
      })
      .subscribe(newState => {
        console.log(newState);
        this.currentState = newState;
        this.stateSubject$.next(newState);
        if (!newState.replace) { // Only not ReplaceAction, write to Firebase.
          this.fc.upload('appState/ovrmrw', newState);
        }
      });

    this.fc.connect$<AppState>('appState/ovrmrw')
      .subscribe(cloudState => {
        if (cloudState && cloudState.timestamp > this.currentState.timestamp + 100) { // +100がないと複数ブラウザで開いたときに永久ループが始まる。
          if (cloudState.history) { // Validation
            console.log('REPLACE');
            this.dispatcher$.next(new ReplaceAction(cloudState));
          }
        }
      });
  }

  get appState$() { return this.stateSubject$.asObservable(); }
}


function incrementReducer(initState: IncrementState, dispatcher$: Dispatcher<Action>): Observable<IncrementState> {
  return dispatcher$.scan<typeof initState>((state, action) => {
    if (action instanceof IncrementAction) {
      state.counter = state.counter + 1;
    } else if (action instanceof DecrementAction) {
      state.counter = state.counter - 1;
    }
    if (action instanceof ReplaceAction) { // ReplaceActionのときは強制的に値を置き換える。
      state = action.replacer.increment;
    } else if (action instanceof ResetAction) { // ResetActionのときは強制的にリセットする。
      state = Object.assign({}, appState.increment);
    }
    return state;
  }, initState);
}

function historyReducer(initState: HistoryState, dispatcher$: Dispatcher<Action>): Observable<HistoryState> {
  return dispatcher$.scan<typeof initState>((state, action) => {
    if (action instanceof PushHistoryAction) {
      state.actions.push(action.description);
    }
    if (action instanceof ReplaceAction) { // ReplaceActionのときは強制的に値を置き換える。
      state = action.replacer.history;
    } else if (action instanceof ResetAction) { // ResetActionのときは強制的にリセットする。
      state = Object.assign({}, appState.history);
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