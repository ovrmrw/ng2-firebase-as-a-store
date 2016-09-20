import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'my-app',
  template: `
    <h3>{{title}}</h3>
    <nav class="navbar navbar-light bg-faded">
      <ul class="nav navbar-nav">
        <li class="nav-item" routerLinkActive="active">
          <a class="nav-link" [routerLink]="['/page1']">Counter</a>
        </li>
      </ul>
    </nav>
    <hr />
    <router-outlet></router-outlet>
    <hr />
    <p><a href="https://github.com/ovrmrw/ng2-firebase-as-a-store">GitHub</a></p> 
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'Demo App';
}