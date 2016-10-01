import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './root/app.component';
import { Page1Component } from './page1/page1.component';

import { Page1Service } from './page1/page1.service';

import { Dispatcher, AsyncStatePipe, InitialState } from '../../packages/angular-rxjs-redux';
import { Store, State, FirebaseEffector, defaultAppState } from './store';


const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/page1',
    pathMatch: 'full'
  },
  { path: 'page1', component: Page1Component }
];


@NgModule({
  imports: [BrowserModule, RouterModule.forRoot(appRoutes), FormsModule, HttpModule],
  declarations: [AppComponent, Page1Component, AsyncStatePipe],
  providers: [
    Dispatcher, Store, State, Page1Service,
    FirebaseEffector,
    { provide: InitialState, useValue: defaultAppState },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }