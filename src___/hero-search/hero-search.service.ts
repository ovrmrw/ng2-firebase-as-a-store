import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Hero } from '../types';

@Injectable()
export class HeroSearchService {

  constructor(
    private http: Http
  ) { }

  search(term: string): Observable<Hero[]> {
    return this.http
      .get(`app/heroes/?name=${term}+`)
      .map(res => res.json().data as Hero[]);
  }
}


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/