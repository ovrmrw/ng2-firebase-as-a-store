import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { Page1Service } from './page1.service';
import { State } from '../store';


@Component({
  selector: 'my-page1',
  template: `
    <h4>Counter</h4>
    <p>{{counter | async}}</p>
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

  increment() {
    this.service.increment();
  }

  decrement() {
    this.service.decrement();
  }

  get counter() { return this.state.incrementState$.map(state => state.counter); }
}