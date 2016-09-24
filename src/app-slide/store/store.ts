import { Injectable, Inject, Optional } from '@angular/core';
import { Observable, Subject, BehaviorSubject, Subscription } from 'rxjs/Rx';
import lodash from 'lodash';

import { Dispatcher, Provider, ReducerContainer, InitialState } from '../redux-like';
import { Action } from './actions';
import { IncrementState, AppState } from './types';
import { incrementReducer } from './reducers';


@Injectable()
export class Store {
  readonly provider$: Provider<AppState>;

  constructor(
    private dispatcher$: Dispatcher<Action>,
    @Inject(InitialState)
    private initialState: AppState,
  ) {
    /* >>> createStore */
    this.provider$ = new BehaviorSubject(initialState);
    this.applyReducers().applyEffectors();
    /* <<< createStore */
  }


  applyReducers(): this {
    ReducerContainer
      .zip<AppState>(...[
        incrementReducer(this.initialState.increment, this.dispatcher$), // as Observable<Promise<IncrementState>>
        (increment): AppState => { // projection
          return Object.assign<{}, AppState, {}>({}, this.initialState, { increment });
        }
      ])
      .subscribe(newState => {
        console.log('newState:', newState);
        this.provider$.next(newState); // ProviderをnextしてStateクラスにストリームを流す。
        this.effectAfterReduced(newState);
      }, err => {
        console.error('Error from ReducerContainer:', err);
      });
    return this;
  }


  effectAfterReduced(newState: AppState): void {
    // Do something.
  }


  applyEffectors(): void {
    // Do something.
  }

}