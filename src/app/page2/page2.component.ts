import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { State } from '../../store';


@Component({
  selector: 'my-page2',
  template: `
    <h4>Action History</h4>
    <ul>
      <li *ngFor="let action of actions | async">{{action}}</li>
    </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Page2Component {
  constructor(
    private state: State
  ) { }

  get actions() { return this.state.historyState$.map(state => state.actions); }

}