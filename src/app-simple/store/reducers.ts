import { Observable } from 'rxjs/Rx';

import { Dispatcher, StateReducer, NonStateReducer, promisify } from '../../../packages/angular-rxjs-redux';
import { Action, IncrementAction, DecrementAction } from './actions';
import { IncrementState } from './types';


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
      } else {
        return state;
      }
    }, initState);


/* 型が書いてあると読みにくいかもしれないので、型を全て消したのがこちら↓ */
// export const incrementReducer =
//   (initState, dispatcher$) =>
//     dispatcher$.scan((state, action) => {
//       if (action instanceof IncrementAction) {
//         return new Promise(resolve => {
//           setTimeout(() => state.then(s => resolve({ counter: s.counter + 1 })), 500);
//         });
//       } else if (action instanceof DecrementAction) {
//         return new Promise(resolve => {
//           setTimeout(() => state.then(s => resolve({ counter: s.counter - 1 })), 500);
//         });
//       } else {
//         return state;
//       }
//     }, initState);
