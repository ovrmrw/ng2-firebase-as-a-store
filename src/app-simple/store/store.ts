import { Injectable, Inject, Optional } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';
// import lodash from 'lodash';

import { Dispatcher, Provider, ReducerContainer, InitialState, promisify } from '../../../packages/angular-rxjs-redux';
import { Action } from './actions';
import { IncrementState, AppState, ResolvedAppState } from './types';
import { incrementStateReducer } from './reducers';


@Injectable()
export class Store {
  readonly provider$: Provider<AppState>;

  constructor(
    private dispatcher$: Dispatcher<Action>,
    @Inject(InitialState)
    private initialState: AppState,
  ) {
    /* function createStore() { */
    this.provider$ = new BehaviorSubject(initialState);
    this.combineReducers();
    this.applyEffectors();
    /* } */
  }
 

  combineReducers(): void {
    ReducerContainer /* = Observable */
      .zip<AppState>(...[
        incrementStateReducer(promisify(this.initialState.increment), this.dispatcher$), /* as Observable<Promise<IncrementState>> */

        (increment): AppState => { /* projection */
          return Object.assign<{}, AppState, {}>({}, this.initialState, { increment });
        }
      ])
      .subscribe(newState => {
        this.provider$.next(newState); /* ProviderをnextしてStateクラスにストリームを流す。 */
        this.effectAfterReduced(newState);
      }, err => {
        console.error('Error from ReducerContainer:', err);
      });
  }


  effectAfterReduced(newState: AppState): void {
    /* Do something after reduced. */
    console.log('newState:', newState);
    // promisify(newState, true).then((resolvedState: ResolvedAppState) => console.log('resolvedState:', resolvedState));
  }


  applyEffectors(): void {
    /* Do something with Side-Effectors. */
  }

}