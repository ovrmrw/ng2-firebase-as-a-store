import { Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Hero } from '../types';
import { HeroService } from '../webapi/hero.service';

@Component({
  // moduleId: module.id,
  selector: 'my-hero-detail',
  templateUrl: 'hero-detail.component.html',
  styleUrls: ['hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit, OnDestroy {
  @Input() hero: Hero;
  @Output() close = new EventEmitter<Hero | null>();
  error: any;
  navigated = false; // true if navigated here

  constructor(
    private heroService: HeroService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    /*
      Observable.forEach()は公式チュートリアルで使われている書き方ではあるが、
      メモリーリークの原因となるので非推奨。
    */
    this.route.params.forEach((params: RouteParams) => {
      if (params.id !== undefined) {
        const id = +params.id;
        this.navigated = true;
        this.heroService
          .getHeroAsPromise(id)
          .then(hero => this.hero = hero);
      } else {
        this.navigated = false;
        this.hero = new Hero();
      }
    });
  }

  ngOnDestroy() { }

  save(): void {
    this.heroService
      .save(this.hero)
      .then(hero => {
        this.hero = hero; // saved hero, w/ id if new
        this.goBack(hero);
      })
      .catch(error => this.error = error); // TODO: Display error message
  }

  goBack(savedHero: Hero | null = null): void {
    this.close.emit(savedHero);
    if (this.navigated) { window.history.back(); }
  }
}


interface RouteParams {
  id: string;
}


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/