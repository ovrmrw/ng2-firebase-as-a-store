import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { ParentComponent } from '../shared/parent.component';
import { Page1Service } from './page1.service';
import { State } from '../redux-like';


@Component({
  selector: 'my-page1',
  template: `
    <h4>Counter</h4>
    <!-- <p id="counter">{{counter | async}}</p> これはなぜかブラウザがフリーズする -->
    <p id="counter">{{_$counter}}</p>    
    <button (click)="increment()" class="btn btn-primary" id="increment-btn">+</button>
    <button (click)="decrement()" class="btn btn-primary" id="decrement-btn">-</button>
    <button (click)="reset()" class="btn btn-warning" id="reset-btn">RESET</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Page1Component extends ParentComponent implements OnInit, OnDestroy {
  constructor(
    private service: Page1Service,
    private state: State,
    private cd: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit() {
    this.disposable = this.state.incrementState$
      .subscribe(state => {
        this._$counter = state.counter;
        this.cd.markForCheck();
      });
  }

  ngOnDestroy() {
    this.disposeSubscriptions();
  }


  increment(): void {
    this.service.increment();
  }

  decrement(): void {
    this.service.decrement();
  }

  reset(): void {
    this.service.reset();
  }

  _$counter: number;


  get counter() { return this.state.incrementState$.map(state => state.counter); }
}