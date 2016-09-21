import { Observable } from 'rxjs/Rx';

import { Dispatcher, Reducer, promisify } from './common';
import { Action, IncrementAction, DecrementAction, ResetAction, RestoreAction } from './actions';
import { IncrementState } from './types';


export const incrementReducer: Reducer<Promise<IncrementState> | IncrementState>
  = (initState: Promise<IncrementState> | IncrementState, dispatcher$: Dispatcher<Action>): Observable<Promise<IncrementState>> => {
    return dispatcher$.scan<Promise<IncrementState>>((state, action) => { // Dispatcherをnextする度にここが発火する。
      /*  */ if (action instanceof IncrementAction) {
        return new Promise<IncrementState>(resolve => {
          setTimeout(() => {
            state.then(s => resolve({ counter: s.counter + 1 }));
          }, 500);
        });
      } else if (action instanceof DecrementAction) {
        return new Promise<IncrementState>((resolve, reject) => {
          setTimeout(() => {
            // state.then(s => resolve({ counter: s.counter - 1 }));
            reject();
          }, 500);
        });
      } else if (action instanceof RestoreAction) {
        if (action.stateFromOuterWorld.increment) { // OuterWorldからのデータは信用できない。
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
  };

export const restoreReducer: Reducer<boolean>
  = (initState: boolean, dispatcher$: Dispatcher<Action>): Observable<boolean> => {
    return dispatcher$.scan<boolean>((state, action) => { // Dispatcherをnextする度にここが発火する。
      if (action instanceof RestoreAction) {
        return true;
      } else {
        return false;
      }
    }, initState);
  };