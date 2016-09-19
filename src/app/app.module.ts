import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './root/app.component';
import { Page1Component } from './page1/page1.component';

import { Page1Service } from './page1/page1.service';

import { Store, Dispatcher, State, FirebaseMiddleware, AsyncStatePipe, InitialState, DefaultAppState } from './redux-like';


const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/page1',
    pathMatch: 'full'
  },
  { path: 'page1', component: Page1Component }
];


@NgModule({
  imports: [BrowserModule, RouterModule.forRoot(appRoutes), FormsModule],
  declarations: [AppComponent, Page1Component, AsyncStatePipe],
  providers: [
    Dispatcher, Store, State, Page1Service,
    FirebaseMiddleware,
    { provide: InitialState, useClass: DefaultAppState },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }