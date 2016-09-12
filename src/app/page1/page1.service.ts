import { Injectable } from '@angular/core';

import { Store, Dispatcher, Action, IncrementAction, DecrementAction } from '../../store';

@Injectable()
export class Page1Service {
  constructor(
    private store: Store,
    private dispatcher$: Dispatcher<Action>
  ) { }

  increment() {
    this.dispatcher$.next(new IncrementAction());
  }

  decrement() {
    this.dispatcher$.next(new DecrementAction());
  }
}