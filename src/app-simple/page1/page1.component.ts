import { Component, ChangeDetectionStrategy } from '@angular/core';
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
    <button (click)="increment()" class="btn btn-primary">+</button>
    <button (click)="decrement()" class="btn btn-primary">-</button>
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

  get counterEvery(): Observable<number> { return this.state.incrementStateEvery$.map(s => s.counter); }
  get counterLatest(): Observable<number> { return this.state.incrementStateLatest$.map(s => s.counter); }

}