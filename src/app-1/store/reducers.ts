import { Observable } from 'rxjs/Rx';

import { Dispatcher, StateReducer, NonStateReducer, promisify } from '../redux-like';
import { Action, IncrementAction, DecrementAction, ResetAction, RestoreAction, ErrorAction, CancelAction } from './actions';
import { IncrementState } from './types';


export const incrementReducer: StateReducer<IncrementState | Promise<IncrementState>> =
  (initState: IncrementState | Promise<IncrementState>, dispatcher$: Dispatcher<Action>): Observable<Promise<IncrementState>> =>
    dispatcher$.scan<Promise<IncrementState>>((state, action) => {
      if (action instanceof IncrementAction) {
        return new Promise<IncrementState>(resolve => {
          setTimeout(() => {
            state.then(s => resolve({ counter: s.counter + 1 }));
          }, 500);
        });
      } else if (action instanceof DecrementAction) {
        return new Promise<IncrementState>(resolve => {
          setTimeout(() => {
            state.then(s => resolve({ counter: s.counter - 1 }))
          }, 500);
        });
      } else if (action instanceof RestoreAction) {
        if (action.stateFromOuterWorld && action.stateFromOuterWorld.increment) { // Validation
          return promisify(action.stateFromOuterWorld.increment);
        } else {
          return promisify(initState);
        }
      } else if (action instanceof ResetAction) {
        return promisify(initState);
      } else {
        return state;
      }
    }, promisify(initState));


export const restoreReducer: StateReducer<boolean> =
  (initState: boolean, dispatcher$: Dispatcher<Action>): Observable<boolean> =>
    dispatcher$.scan<boolean>((state, action) => {
      if (action instanceof RestoreAction) {
        return true;
      } else {
        return false;
      }
    }, initState);


export const invokeErrorReducer: NonStateReducer<void | never> =
  (dispatcher$: Dispatcher<Action>): Observable<void | never> =>
    dispatcher$.map<void | never>(action => {
      if (action instanceof ErrorAction) {
        const message = 'ErrorAction is dispatched.';
        alert(message);
        throw new Error(message);
      } else {
        return;
      }
    });


export const cancelReducer: NonStateReducer<boolean> =
  (dispatcher$: Dispatcher<Action>): Observable<boolean> =>
    dispatcher$.map<boolean>(action => action instanceof CancelAction);
