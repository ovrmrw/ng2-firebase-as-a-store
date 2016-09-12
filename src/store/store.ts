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
  timestamp: number
}

const initialState: AppState = {
  increment: {
    counter: 0
  },
  history: {
    actions: []
  },
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
    this.stateSubject$ = new BehaviorSubject<AppState>(initialState);
    this.currentState = initialState;

    Observable
      .zip<AppState>(
      incrementReducer(initialState.increment, dispatcher$),
      historyReducer(initialState.history, dispatcher$),
      (increment, history) => {
        return { increment, history, timestamp: new Date().valueOf() } as AppState
      })
      .subscribe(newState => {
        console.log(newState);
        this.stateSubject$.next(newState);
        this.currentState = newState;
        this.fc.uploadToCloud('appState/ovrmrw', newState);
      });

    this.fc.connectFromCloud<AppState>('appState/ovrmrw')
      .subscribe(appState => {
        if (appState && appState.timestamp > this.currentState.timestamp + 1000) { // +1000がないと複数ブラウザで開いたときに永久ループが始まる。
          if (appState.history) { // Validation
            console.log('REPLACE');
            this.dispatcher$.next(new ReplaceAction(appState));
          }
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
      state = action.replacer.increment;
    } else if (action instanceof ResetAction) { // ResetActionのときは強制的にリセットする。
      state = { counter: 0 };
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
      state = { actions: [] };
    }
    return state;
  }, initState);
}