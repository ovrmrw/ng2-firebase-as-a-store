import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

import { AppComponent } from './root/app.component';
import { Page1Component } from './page1/page1.component';

import { Page1Service } from './page1/page1.service';

import { Dispatcher, InitialState, FirebaseMiddleware, AsyncStatePipe } from '../redux-like-core';
import { Store, State, Reducer, defaultAppState } from './redux-like';


const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/page1',
    pathMatch: 'full'
  },
  { path: 'page1', component: Page1Component }
];


@NgModule({
  imports: [BrowserModule, HttpModule, RouterModule.forRoot(appRoutes)],
  declarations: [AppComponent, Page1Component, AsyncStatePipe],
  providers: [
    Dispatcher, Store, State, Page1Service, Reducer,
    FirebaseMiddleware,
    { provide: InitialState, useValue: defaultAppState },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }