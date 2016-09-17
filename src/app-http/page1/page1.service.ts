import { Injectable } from '@angular/core';

import { Dispatcher, Action, IncrementAction, DecrementAction, ResetAction, TimeUpdateAction } from '../redux-like';


@Injectable()
export class Page1Service {
  constructor(
    private dispatcher$: Dispatcher<Action>
  ) { }


  increment(): void {
    this.dispatcher$.next(new IncrementAction());
  }

  decrement(): void {
    this.dispatcher$.next(new DecrementAction());
  }

  reset(): void {
    this.dispatcher$.next(new ResetAction());
  }

  timeUpdate(): void {
    this.dispatcher$.next(new TimeUpdateAction());
  }
}