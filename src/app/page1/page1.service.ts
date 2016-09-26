import { Injectable } from '@angular/core';

import { Dispatcher, Action } from '../store';
import { IncrementAction, DecrementAction, ResetAction, ErrorAction, CancelAction } from '../store';


/*
  ComponentクラスにDispatcherとかActionとかを露出させたくないのでServiceクラスに切り出す。
*/
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

  invokeError(): void {
    this.dispatcher$.next(new ErrorAction());
  }

  cancel(): void {
    this.dispatcher$.next(new CancelAction());
  }
  
}