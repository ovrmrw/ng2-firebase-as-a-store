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
    <hr />
    <h4>Time (switchMap)</h4>
    <h5>{{timeSerial | asyncState | date:"medium"}}</h5>
    <h4>Math (mergeMap) without Firebase sync</h4>
    <h5>addition: {{addition | asyncState}}, subtraction: {{subtraction | asyncState}}, multiplication: {{multiplication | asyncState}}</h5>
    <hr />
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


  /* 下記のように状態取得の記述を全て.getState()で書くと、View更新が"一番解決の遅いPromiseに引きずられる"ことになる。 */
  // get counterEvery(): Observable<number> { return this.state.getState().map(s => s.increment.counter); }
  // get counterLatest(): Observable<number> { return this.state.getState().map(s => s.increment.counter); }
  // get timeSerial(): Observable<number> { return this.state.getState().map(s => s.time.serial); }
  // get addition(): Observable<number> { return this.state.getState().map(s => s.math.addition); }
  // get subtraction(): Observable<number> { return this.state.getState().map(s => s.math.subtraction); }
  // get multiplication(): Observable<number> { return this.state.getState().map(s => s.math.multiplication); }
  // get actionName(): Observable<string> { return this.state.getState().map(s => s.actionName); }

  /* 下記のように書くと、counterとtimeSerialは"それぞれのPromiseが解決したタイミングで"Viewが更新される。 */
  get counterEvery(): Observable<number> { return this.state.incrementStateEvery$.map(s => s.counter); }
  get counterLatest(): Observable<number> { return this.state.incrementStateLatest$.map(s => s.counter); }
  get timeSerial(): Observable<number> { return this.state.timeStateLatest$.map(s => s.serial); }
  get addition(): Observable<number> { return this.state.mathStateEvery$.map(s => s.addition); }
  get subtraction(): Observable<number> { return this.state.mathStateEvery$.map(s => s.subtraction); }
  get multiplication(): Observable<number> { return this.state.mathStateEvery$.map(s => s.multiplication); }
  get actionName(): Observable<string> { return this.state.getState().map(s => s.actionName); }

}