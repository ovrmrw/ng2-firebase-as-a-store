import { Injectable } from '@angular/core';

import { Dispatcher, Action } from '../store';
import { IncrementAction, DecrementAction } from '../store';


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
  
}