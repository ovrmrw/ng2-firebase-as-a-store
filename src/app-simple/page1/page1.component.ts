import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { Page1Service } from './page1.service';
import { State } from '../store';


@Component({
  selector: 'my-page1',
  template: `
    <h4>Counter</h4>
    <h5>{{counter | asyncState}}</h5>
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


  get counter(): Observable<number> { return this.state.getState().map(s => s.increment.counter); }

}