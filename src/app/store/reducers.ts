import { Observable } from 'rxjs/Rx';

import { Dispatcher, ReducerContainer, StateReducer, NonStateReducer, promisify } from '../../../angular-rxjs-redux';
import { Action, IncrementAction, DecrementAction, ResetAction, RestoreAction, ErrorAction, CancelAction, TimeUpdateAction } from './actions';
import { IncrementState, TimeState, MathState } from './types';
import { additionReducer, subtractionReducer, multiplicationReducer } from './reducers.math';


export const incrementStateReducer: StateReducer<Promise<IncrementState>> =
  (initState: Promise<IncrementState>, dispatcher$: Dispatcher<Action>): Observable<Promise<IncrementState>> =>
    dispatcher$.scan<Promise<IncrementState>>((state, action) => {
      if (action instanceof IncrementAction) {
        return new Promise<IncrementState>(resolve => {
          setTimeout(() => state.then(s => resolve({ counter: s.counter + 1 })), 500);
        });
      } else if (action instanceof DecrementAction) {
        return new Promise<IncrementState>(resolve => {
          setTimeout(() => state.then(s => resolve({ counter: s.counter - 1 })), 500);
        });
      } else if (action instanceof RestoreAction) {
        if (action.restoreState && action.restoreState.increment) { // Validation
          return promisify(action.restoreState.increment);
        } else {
          return initState;
        }
      } else if (action instanceof ResetAction) {
        return initState;
      } else {
        return state;
      }
    }, initState);


export const restoreReducer: StateReducer<boolean> =
  (initState: boolean, dispatcher$: Dispatcher<Action>): Observable<boolean> =>
    dispatcher$.scan<boolean>((state, action) => {
      if (action instanceof RestoreAction) {
        return true;
      } else {
        return false;
      }
    }, initState);


export const invokeErrorMapper: NonStateReducer<void | never> =
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


export const cancelMapper: NonStateReducer<boolean> =
  (dispatcher$: Dispatcher<Action>): Observable<boolean> =>
    dispatcher$.map<boolean>(action => action instanceof CancelAction);


export const timeStateReducer: StateReducer<Promise<TimeState>> =
  (initState: Promise<TimeState>, dispatcher$: Dispatcher<Action>): Observable<Promise<TimeState>> =>
    dispatcher$.scan<Promise<TimeState>>((state, action) => {
      if (action instanceof TimeUpdateAction) {
        /*
          action.timestampAsObservable$ の型はObservable<number>。
          Observable<number>からPromise<TimeState>を生成して返す。
        */
        return action.timestampAsObservable$
          .map<TimeState>(timestamp => ({ serial: timestamp }))
          .toPromise();
      } else if (action instanceof RestoreAction) {
        if (action.restoreState && action.restoreState.time) { // Validation
          return promisify(action.restoreState.time);
        } else {
          return state;
        }
      } else if (action instanceof ResetAction) {
        return initState;
      } else {
        return state;
      }
    }, initState);


export const actionNameMapper: NonStateReducer<string> =
  (dispatcher$: Dispatcher<Action>): Observable<string> =>
    dispatcher$.map<string>(action => action.constructor.name);



/* この程度でここまでするのは冗長だけど、Reducerの中にReducerContainerを持つ例を書きたかった。 */
export const mathStateZipper: StateReducer<MathState> =
  (initState: MathState, dispatcher$: Dispatcher<Action>): Observable<MathState> =>
    ReducerContainer
      .zip<MathState>(...[
        additionReducer(promisify(initState.addition), dispatcher$),
        subtractionReducer(promisify(initState.subtraction), dispatcher$),
        multiplicationReducer(promisify(initState.multiplication), dispatcher$),

        (addition, subtraction, multiplication) => {
          return Object.assign<{}, MathState, MathState>({}, initState, { addition, subtraction, multiplication });
        }
      ]);