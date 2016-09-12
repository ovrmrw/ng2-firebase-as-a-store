import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';

import { Action, IncrementAction, DecrementAction } from './actions';


export class Dispatcher<T> extends Subject<T> {
  constructor() {
    super();
  }
}


interface IncrementState {
  counter: number
}
interface AppState {
  increment: IncrementState
}


@Injectable()
export class Store {
  private stateSubject$: Subject<AppState>;

  constructor(
    private dispatcher$: Dispatcher<Action>
  ) {
    const initState: AppState = {
      increment: {
        counter: 0
      }
    };
    this.stateSubject$ = new BehaviorSubject<AppState>(initState);

    Observable
      .zip<AppState>(
      incrementReducer(initState.increment, dispatcher$),
      (incrementState) => {
        return { increment: incrementState }
      }
      )
      .subscribe(newState => {
        this.stateSubject$.next(newState);
      });
  }

  get appState$() { return this.stateSubject$.asObservable(); }
}


function incrementReducer(initState: IncrementState, dispatcher$: Dispatcher<Action>) {
  return dispatcher$.scan<typeof initState>((state, action) => {
    if (action instanceof IncrementAction) {
      state.counter = state.counter + 1;
    } else if (action instanceof DecrementAction) {
      state.counter = state.counter - 1;
    }
    return state;
  }, initState);
}