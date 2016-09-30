import { Observable } from 'rxjs/Rx';

import { Dispatcher, StateReducer, NonStateReducer, promisify } from '../../../src-rxjs-redux';
import { Action, AddAction, SubtractAction, MultiplyAction } from './actions';
import { ResolvedMathState } from './types';


export const additionReducer: StateReducer<Promise<number>> =
  (initState: Promise<number>, dispatcher$: Dispatcher<Action>): Observable<Promise<number>> =>
    dispatcher$.scan<Promise<number>>((state, action) => {
      if (action instanceof AddAction) {
        return new Promise<number>(resolve => {
          setTimeout(() => {
            state.then(s => resolve(s + action.num));
          }, 300);
        });
      } else {
        return state;
      }
    }, initState);


export const subtractionReducer: StateReducer<Promise<number>> =
  (initState: Promise<number>, dispatcher$: Dispatcher<Action>): Observable<Promise<number>> =>
    dispatcher$.scan<Promise<number>>((state, action) => {
      if (action instanceof AddAction) {
        return new Promise<number>(resolve => {
          setTimeout(() => {
            state.then(s => resolve(s - action.num));
          }, 600);
        });
      } else {
        return state;
      }
    }, initState);


export const multiplicationReducer: StateReducer<Promise<number>> =
  (initState: Promise<number>, dispatcher$: Dispatcher<Action>): Observable<Promise<number>> =>
    dispatcher$.scan<Promise<number>>((state, action) => {
      if (action instanceof AddAction) {
        return new Promise<number>(resolve => {
          setTimeout(() => {
            state.then(s => resolve(s * action.num));
          }, 900);
        });
      } else {
        return state;
      }
    }, initState);