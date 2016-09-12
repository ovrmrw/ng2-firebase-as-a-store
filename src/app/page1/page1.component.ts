import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { ParentComponent } from '../shared/parent.component';
import { Page1Service } from './page1.service';
import { State } from '../../store';


@Component({
  selector: 'my-page1',
  template: `
    <p>Page1Component</p>
    <p>{{counter | async}}</p>
    <button (click)="increment()">+</button>
    <button (click)="decrement()">-</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Page1Component extends ParentComponent implements OnInit, OnDestroy {
  constructor(
    private service: Page1Service,
    private state: State,
  ) {
    super();
  }

  ngOnInit() {

  }

  ngOnDestroy() {

  }

  increment() {
    this.service.increment();
  }

  decrement() {
    this.service.decrement();
  }

  get counter() { return this.state.incrementState$.map(state => state.counter); }
}