import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Store } from './store';
import { IncrementState } from './types';


@Injectable()
export class State {
  constructor(
    private store: Store
  ) { }
  

  get incrementState$(): Observable<IncrementState> {
    return this.store.appState$
      .map(state => state.increment)
      .mergeMap<IncrementState>(stateAsPromise => Observable.fromPromise(stateAsPromise));
  }
}