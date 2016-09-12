import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'my-app',
  template: `
    <p>AppComponent</p>
    <nav>
      <a [routerLink]="['/page1']" routerLinkActive="active">Page1</a>
      <a [routerLink]="['/page2']" routerLinkActive="active">Page2</a>
    </nav>
    <router-outlet></router-outlet>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent { }