import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { ParentComponent } from '../shared/parent.component';
import { Page1Service } from './page1.service';
import { State } from '../redux-like';


@Component({
  selector: 'my-page1',
  template: `
    <h4>Counter (mergeMap)</h4>
    <p id="counter">{{_$counter}}</p>    
    <div>    
      <button (click)="increment()" class="btn btn-primary" id="increment-btn">INCREMENT</button>
      <button (click)="decrement()" class="btn btn-primary" id="decrement-btn">DECREMENT</button>
      <button (click)="reset()" class="btn btn-warning" id="reset-btn">RESET</button>
    </div>
    <hr />
    <h4>Time (switchMap)</h4>
    <p>{{_$timeSerial | date:'medium'}}</p>
    <div>
      <button (click)="time()" class="btn btn-primary" id="time-btn">TIME UPDATE</button>
    </div>
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

    this.disposable = this.state.timeState$
      .subscribe(state => {
        this._$timeSerial = state.serial;
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

  timeUpdate(): void {
    this.service.timeUpdate();
  }

  _$counter: number;
  _$timeSerial: number;
}