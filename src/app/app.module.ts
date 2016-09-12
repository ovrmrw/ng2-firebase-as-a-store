import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './root/app.component';
import { Page1Component } from './page1/page1.component';
import { Page2Component } from './page2/page2.component';

import { Page1Service } from './page1/page1.service';

import { Store, Dispatcher, State, FirebaseController } from '../store';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/page1',
    pathMatch: 'full'
  },
  { path: 'page1', component: Page1Component },
  { path: 'page2', component: Page2Component }
];

@NgModule({
  imports: [BrowserModule, RouterModule.forRoot(appRoutes)],
  declarations: [AppComponent, Page1Component, Page2Component],
  providers: [Dispatcher, FirebaseController, Store, State, Page1Service],
  bootstrap: [AppComponent]
})
export class AppModule { }