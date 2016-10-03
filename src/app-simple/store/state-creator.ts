import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { connect, takeLatest, takeEvery } from '../../../angular-rxjs-redux';
import { Store } from './store';
import { AppState, ResolvedAppState } from './types';


@Injectable()
export class State {
  private appState$: Observable<AppState>;

  constructor(
    private store: Store
  ) {
    this.appState$ = this.store.provider$;
  }


  /* Observable<AppState> --(mutation)--> Observable<ResolvedAppState> */
  /* AppStateからResolvedAppStateへの変換はtype-errorにならない。 */
  getState(): Observable<ResolvedAppState> {
    return connect(takeLatest<AppState>(this.appState$, true)) as Observable<ResolvedAppState>;
  }

}