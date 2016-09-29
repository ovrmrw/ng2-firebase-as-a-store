import { Injectable, Inject, Optional } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Dispatcher, Action } from '../store';
import { IncrementAction, DecrementAction, ResetAction, ErrorAction, CancelAction, TimeUpdateAction } from '../store';


/*
  ComponentクラスにDispatcherとかActionとかを露出させたくないのでServiceクラスに切り出す。
*/
@Injectable()
export class Page1Service {
  constructor(
    private dispatcher$: Dispatcher<Action>,
    @Inject(Http) @Optional()
    private http: Http | null, /* TestingでHttpモジュールをフェイクするのがめんどくさかったのでこうした。 */
  ) { }


  increment(): void {
    this.dispatcher$.next(new IncrementAction());
  }

  decrement(): void {
    this.dispatcher$.next(new DecrementAction());

    /* DecrementActionのときだけTimeUpdateActionを続けてキックする。 */
    this.timeUpdate();
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

  timeUpdate(): void {
    if (this.http) {
      const timestampAsObservable$: Observable<number> = this.http
        .get('https://ntp-a1.nict.go.jp/cgi-bin/json')
        .map<number>(res => +(res.json().st) * 1000); /* 1475038877.688 のような値が得られるのでx1000する。 */
      this.dispatcher$.next(new TimeUpdateAction(timestampAsObservable$));
    }
  }

}