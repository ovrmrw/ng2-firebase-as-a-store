import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

// import { ParentComponent } from '../shared/parent.component';
import { Page1Service } from './page1.service';
import { State, notPromise } from '../redux-like';


@Component({
  selector: 'my-page1',
  template: `
    <h4>Counter (mergeMap)</h4>
    <h5>{{counterMergeMap | asyncState}}</h5>
    <h4>Counter (switchMap)</h4>
    <h5>{{counterSwitchMap | asyncState:true}}</h5>
    <button (click)="increment()" class="btn btn-primary" id="increment-btn">+</button>
    <button (click)="decrement()" class="btn btn-primary" id="decrement-btn">-</button>
    <button (click)="reset()" class="btn btn-warning" id="reset-btn">RESET</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Page1Component {
  constructor(
    private service: Page1Service,
    private state: State,
    // private cd: ChangeDetectorRef,
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

  get counterMergeMap() { return this.state.incrementStateByMergeMap$.map(s => s.counter); }
  get counterSwitchMap() { return this.state.incrementStateBySwitchMap$.map(s => s.counter); }


  ////////////////////////////////////////////////////////////////////////////////////////////
  // For Testing
  _$counter: number;

  forTesing() { // call this function before unit testing.
    this.counterMergeMap.subscribe(counter => this._$counter = counter);
  }
}