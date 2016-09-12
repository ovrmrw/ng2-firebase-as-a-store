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
        <li class="nav-item" routerLinkActive="active">
          <a class="nav-link" [routerLink]="['/page2']">History</a>
        </li>
      </ul>
    </nav>
    <hr />
    <router-outlet></router-outlet>
    <hr />
    <p>Push '+' or '-' button several times, then reload your browser. The values will be retrieved from Firebase backend.</p>
    <p><a href="https://github.com/ovrmrw/ng2-firebase-as-a-store">GitHub</a></p> 
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'Increment Demo App on Angular2 way with Firebase backend';
}