import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

// import { ParentComponent } from '../shared/parent.component';
import { Page1Service } from './page1.service';
import { State } from '../redux-like';


@Component({
  selector: 'my-page1',
  template: `
    <h4>Counter (mergeMap)</h4>
    <p id="counter">{{counter | asyncState:false}}</p>    
    <div>    
      <button (click)="increment()" class="btn btn-primary" id="increment-btn">INCREMENT</button>
      <button (click)="decrement()" class="btn btn-primary" id="decrement-btn">DECREMENT</button>
      <button (click)="reset()" class="btn btn-warning" id="reset-btn">RESET</button>
    </div>
    <hr />
    <h4>Time (switchMap)</h4>
    <p>{{timeSerial | asyncState | date:'medium'}}</p>
    <div>
      <button (click)="timeUpdate()" class="btn btn-primary" id="time-btn">TIME UPDATE</button>
    </div>
    <hr />
    <h4>Restore Flag</h4>
    <p>{{restore | asyncState | json}}</p>
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

  timeUpdate(): void {
    this.service.timeUpdate();
  }

  get counter() { return this.state.incrementState$.map(s => s.counter); }
  get timeSerial() { return this.state.timeState$.map(s => s.serial); }
  get restore() { return this.state.restoreState$; }


  ///////////////////////////////////////////////////////////////////////////////////////////////
  // For Testing
  _$counter: number;
  _$timeSerial: number;
  _$restore: boolean;

  forTesing() { // call this function before unit testing.
    this.counter.subscribe(v => this._$counter = v);
    this.timeSerial.subscribe(v => this._$timeSerial = v);
    this.restore.subscribe(v => this._$restore = v);
  }
}