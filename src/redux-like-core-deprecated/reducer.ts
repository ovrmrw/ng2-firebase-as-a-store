import { Observable } from 'rxjs/Rx';

import { Dispatcher } from './common';


// export function createReducer<U, V>(fn: (initState: U, action: V) => U, initialState: U, dispatcher$: Dispatcher<V>): Observable<U> {
//   return dispatcher$.scan<U>(fn, initialState);
// }

export abstract class BaseReducer<T> {
  reducers: Observable<any>[] = [];
  stateStructure: (...args: any[]) => T;

  addReducer<U>(fn: () => Observable<U>) {
    this.reducers.push(fn());
  }

  setNewStateStructure(fnInFn: () => (...args: any[]) => T) {
    this.stateStructure = fnInFn();
  }
}