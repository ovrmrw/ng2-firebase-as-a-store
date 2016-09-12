import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { routing } from './app.routing';

import { AppComponent } from './app.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { HeroesComponent } from '../hero-list/heroes.component';
import { HeroDetailComponent } from '../hero-detail/hero-detail.component';
import { HeroSearchComponent } from '../hero-search/hero-search.component';

import { HeroSearchService } from '../hero-search/hero-search.service';
import { HeroService } from '../webapi/hero.service';

import { XHRBackend, HttpModule } from '@angular/http';
import { InMemoryBackendService, SEED_DATA } from 'angular2-in-memory-web-api';
import { InMemoryDataService } from '../webapi/in-memory-data.service';


@NgModule({
  imports: [BrowserModule, HttpModule, FormsModule, routing],
  declarations: [HeroSearchComponent, DashboardComponent, HeroesComponent, HeroDetailComponent, AppComponent],
  providers: [HeroSearchService, HeroService,
    { provide: XHRBackend, useClass: InMemoryBackendService }, // in-mem server
    { provide: SEED_DATA, useClass: InMemoryDataService }      // in-mem server data
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }