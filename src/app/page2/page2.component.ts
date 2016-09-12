import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'my-page2',
  template: `
    <p>Page2Component</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Page2Component { }