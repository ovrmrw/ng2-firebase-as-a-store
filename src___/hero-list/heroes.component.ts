import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Hero } from '../types';
import { HeroService } from '../webapi/hero.service';

@Component({
  // moduleId: module.id,
  selector: 'my-heroes',
  templateUrl: 'heroes.component.html',
  styleUrls: ['heroes.component.css'],
})
export class HeroesComponent implements OnInit {
  heroes: Hero[];
  selectedHero: Hero | null;
  addingHero = false;
  error: any;

  constructor(
    private router: Router,
    private heroService: HeroService
  ) { }

  ngOnInit() {
    this.getHeroes();
  }

  getHeroes() {
    this.heroService
      .getHeroesAsPromise()
      .then(heroes => this.heroes = heroes)
      .catch(error => this.error = error);
  }

  addHero() {
    this.addingHero = true;
    this.selectedHero = null;
  }

  close(savedHero: Hero) {
    this.addingHero = false;
    if (savedHero) { this.getHeroes(); }
  }

  deleteHero(hero: Hero, event: any) {
    event.stopPropagation();
    this.heroService
      .delete(hero)
      .then(res => {
        this.heroes = this.heroes.filter(h => h !== hero);
        if (this.selectedHero === hero) { this.selectedHero = null; }
      })
      .catch(error => this.error = error);
  }

  onSelect(hero: Hero) {
    this.selectedHero = hero;
    this.addingHero = false;
  }

  gotoDetail() {
    if (this.selectedHero) {
      this.router.navigate(['/detail', this.selectedHero.id]);
    }
  }
}


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/