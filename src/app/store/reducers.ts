import { Observable } from 'rxjs/Rx';
import { Http } from '@angular/http';

import { Dispatcher, StateReducer, NonStateReducer, promisify } from '../redux-like';
import { Action, IncrementAction, DecrementAction, ResetAction, RestoreAction, ErrorAction, CancelAction, TimeUpdateAction } from './actions';
import { IncrementState, TimeState } from './types';


export const incrementReducer: StateReducer<Promise<IncrementState>> =
  (initState: Promise<IncrementState>, dispatcher$: Dispatcher<Action>): Observable<Promise<IncrementState>> =>
    dispatcher$.scan<Promise<IncrementState>>((state, action) => {
      if (action instanceof IncrementAction) {
        return new Promise<IncrementState>(resolve => {
          setTimeout(() => state.then(s => resolve({ counter: s.counter + 1 })), 500);
        });
      } else if (action instanceof DecrementAction) {
        dispatcher$.next(new TimeUpdateAction()); // DecrementActionのときだけTimeUpdateActionをキックする。
        return new Promise<IncrementState>(resolve => {
          setTimeout(() => state.then(s => resolve({ counter: s.counter - 1 })), 500);
        });
        // return Observable.of(state)
        //   .delay(500)
        //   .mergeMap<IncrementState>(() => Observable.fromPromise(state.then(s => ({ counter: s.counter - 1 }))))
        //   .toPromise();        
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


export const timeUpdateReducer: StateReducer<Promise<TimeState>> =
  (initState: Promise<TimeState>, dispatcher$: Dispatcher<Action>, http$: Http | null): Observable<Promise<TimeState>> =>
    dispatcher$.scan<Promise<TimeState>>((state, action) => {
      if (action instanceof TimeUpdateAction) {
        if (http$) {
          return http$.get('https://ntp-a1.nict.go.jp/cgi-bin/json')
            .map<number>(res => res.json().st)
            .map<TimeState>(st => ({ serial: st * 1000 }))
            .toPromise();
        } else {
          return state;
        }
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