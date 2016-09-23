import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { ParentComponent } from '../shared/parent.component';
import { Page1Service } from './page1.service';
import { State, notPromise } from '../redux-like';


@Component({
  selector: 'my-page1',
  template: `
    <h4>Counter</h4>
    <h3 id="counter">{{counter | asyncState}}</h3>
    <div>
      ManualCounter: <input type="number" [(ngModel)]="manualCounter" name="manual-counter" />
      RefCounter: <input type="number" [(ngModel)]="refCounter" name="ref-counter" />
    <div>
    <button (click)="increment()" class="btn btn-primary" id="increment-btn">+</button>
    <button (click)="decrement()" class="btn btn-primary" id="decrement-btn">-</button>
    <button (click)="reset()" class="btn btn-warning" id="reset-btn">RESET</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Page1Component extends ParentComponent implements OnInit, OnDestroy {
  manualCounter: number | null;
  refCounter: number | null;

  constructor(
    private service: Page1Service,
    private state: State,
    // private cd: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit() {
    this.disposable = this.counter.subscribe(counter => this.refCounter = counter);
    this.disposable = this.state.appState$.do(s => console.log('resolved appState:', s)).subscribe();
  }

  ngOnDestroy() {
    this.disposeSubscriptions();
  }


  increment(): void {
    this.service.increment(this.manualCounter | 0);
    this.manualCounter = null;
  }

  decrement(): void {
    this.service.decrement();
  }

  reset(): void {
    this.service.reset();
  }

  get counter() { return this.state.incrementState$.map(s => s.counter); }


  ////////////////////////////////////////////////////////////////////////////////////////////
  // For Testing
  _$counter: number;

  forTesing() { // call this function before unit testing.
    this.counter.subscribe(counter => this._$counter = counter);
  }
}