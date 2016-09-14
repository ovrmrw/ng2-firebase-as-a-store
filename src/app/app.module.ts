import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './root/app.component';
import { Page1Component } from './page1/page1.component';

import { Page1Service } from './page1/page1.service';

import { Store, Dispatcher, State, FirebaseController, InitialState } from './store';


const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/page1',
    pathMatch: 'full'
  },
  { path: 'page1', component: Page1Component }
];


@NgModule({
  imports: [BrowserModule, RouterModule.forRoot(appRoutes)],
  declarations: [AppComponent, Page1Component],
  providers: [
    Dispatcher, Store, State, Page1Service,
    { provide: InitialState, useValue: null },
    FirebaseController,
    // { provide: FirebaseController, useValue: null },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }