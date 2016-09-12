import { Injectable } from '@angular/core';

import { Store, Dispatcher, Action, IncrementAction, DecrementAction, PushHistoryAction, ResetAction } from '../../store';

@Injectable()
export class Page1Service {
  constructor(
    private store: Store,
    private dispatcher$: Dispatcher<Action>
  ) { }

  increment() {
    this.dispatcher$.next(new IncrementAction());
    this.dispatcher$.next(new PushHistoryAction('Increment'));
  }

  decrement() {
    this.dispatcher$.next(new DecrementAction());
    this.dispatcher$.next(new PushHistoryAction('Decrement'));
  }

  reset() {
    this.dispatcher$.next(new ResetAction());
  }
}