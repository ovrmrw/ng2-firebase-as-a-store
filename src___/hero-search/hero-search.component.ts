import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs/Rx';

import { HeroSearchService } from './hero-search.service';
import { Hero } from '../types';

@Component({
  // moduleId: module.id,
  selector: 'hero-search',
  templateUrl: 'hero-search.component.html',
})
export class HeroSearchComponent implements OnInit {
  heroes: Observable<Hero[]>;
  searchSubject = new Subject<string>();

  constructor(
    private heroSearchService: HeroSearchService,
    private router: Router
  ) { }

  ngOnInit() {
    this.heroes = this.searchSubject
      .asObservable()           // cast as Observable
      .debounceTime(300)        // wait for 300ms pause in events
      .distinctUntilChanged()   // ignore if next search term is same as previous
      .switchMap<Hero[]>(term => term   // switch to new observable each time
        // return the http search observable
        ? this.heroSearchService.search(term)
        // or the observable of empty heroes if no search term
        : Observable.of<Hero[]>([]))

      .catch(error => {
        // Todo: real error handling
        console.log(error);
        return Observable.of<Hero[]>([]);
      });
  }

  // Push a search term into the observable stream.
  search(term: string) { this.searchSubject.next(term); }

  gotoDetail(hero: Hero) {
    let link = ['/detail', hero.id];
    this.router.navigate(link);
  }
}


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/