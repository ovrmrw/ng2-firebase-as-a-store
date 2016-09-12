import { Injectable } from '@angular/core';

import { Store } from './store';


@Injectable()
export class State {
  constructor(
    private store: Store
  ) { }

  get incrementState$() { return this.store.appState$.map(state => state.increment); }

  get historyState$() { return this.store.appState$.map(state => state.history); }
}