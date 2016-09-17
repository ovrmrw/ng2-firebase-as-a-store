import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

import { AppComponent } from './root/app.component';
import { Page1Component } from './page1/page1.component';

import { Page1Service } from './page1/page1.service';

import { Store, Dispatcher, State, FirebaseMiddleware } from './redux-like';


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
  declarations: [AppComponent, Page1Component],
  providers: [
    Dispatcher, Store, State, Page1Service,
    FirebaseMiddleware,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }