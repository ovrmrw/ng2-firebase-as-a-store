import { Injectable } from '@angular/core';

import { Dispatcher, Action, IncrementAction, DecrementAction, ResetAction, TimeAction } from '../redux-like';


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

  time(): void {
    this.dispatcher$.next(new TimeAction());
  }
}