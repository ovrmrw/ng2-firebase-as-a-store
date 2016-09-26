import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { Page1Service } from './page1.service';
import { State } from '../store';


@Component({
  selector: 'my-page1',
  template: `
    <h4>Counter (mergeMap)</h4>
    <h5>{{counterEvery | asyncState}}</h5>
    <h4>Counter (switchMap)</h4>
    <h5>{{counterLatest | asyncState}}</h5>
    <h4>Time (switchMap)</h4>
    <h5>{{timeSerial | asyncState | date:"medium"}}</h5>
    <button (click)="increment()" class="btn btn-primary" id="increment-btn">+</button>
    <button (click)="decrement()" class="btn btn-primary" id="decrement-btn">-</button>
    <button (click)="reset()" class="btn btn-warning" id="reset-btn">RESET</button>
    <button (click)="invokeError()" class="btn btn-danger" id="error-btn">invoke error</button>
    <button (click)="cancel()" class="btn btn-warning" id="cancel-btn">cancel</button>    
    <div>Latest Action: {{actionName | asyncState}}</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Page1Component {
  constructor(
    private service: Page1Service,
    private state: State,
  ) { }


  increment(): void {
    this.service.increment();
  }

  decrement(): void {
    this.service.decrement();
  }

  reset(): void {
    this.service.reset();
  }

  invokeError(): void {
    this.service.invokeError();
  }

  cancel(): void {
    this.service.cancel();
  }

  get counterEvery(): Observable<number> { return this.state.incrementStateEvery$.map(s => s.counter); }
  get counterLatest(): Observable<number> { return this.state.incrementStateLatest$.map(s => s.counter); }
  get timeSerial(): Observable<number> { return this.state.timeStateLatest$.map(s => s.serial); }
  get actionName(): Observable<string> { return this.state.getState().map(s => s.actionName); }
  
}