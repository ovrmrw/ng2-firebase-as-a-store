import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { InitialState, Dispatcher, promisify, BaseReducer } from '../../redux-like-core';
import { AppState, IncrementState, TimeState } from './types';
import { Action, IncrementAction, DecrementAction, ResetAction, RestoreAction, TimeUpdateAction } from './actions';


@Injectable()
export class Reducer extends BaseReducer<AppState> {
  constructor(
    private http$: Http,
    private dispatcher$: Dispatcher<Action>,
    @Inject(InitialState)
    private initialState: AppState,
  ) {
    super();

    this.addReducers();
    this.setNewStateStructure(() => {
      return (increment, restore, time) => {
        return Object.assign({}, this.initialState, { increment, restore, time }); // 型を曖昧にしているのでテストでカバーする。
      }
    });
  }


  addReducers() {
    this.addReducer<Promise<IncrementState>>(() => {
      return this.dispatcher$.scan<Promise<IncrementState>>((state, action) => { // Dispatcherをnextする度にここが発火する。
        /*  */ if (action instanceof IncrementAction) {
          return new Promise<IncrementState>(resolve => {
            setTimeout(() => {
              state.then(s => resolve({ counter: s.counter + 1 }));
            }, 500);
          });
        } else if (action instanceof DecrementAction) {
          return new Promise<IncrementState>(resolve => {
            setTimeout(() => {
              state.then(s => resolve({ counter: s.counter - 1 }));
            }, 500);
          });
        } else if (action instanceof RestoreAction) {
          return promisify(action.stateFromOuterworld.increment);
        } else if (action instanceof ResetAction) {
          return promisify(this.initialState.increment);
        } else {
          return state;
        }
      }, promisify(this.initialState.increment));
    });

    this.addReducer<boolean>(() => {
      return this.dispatcher$.scan<boolean>((state, action) => { // Dispatcherをnextする度にここが発火する。
        if (action instanceof RestoreAction) {
          return true;
        } else {
          return false;
        }
      }, this.initialState.restore);
    })

    this.addReducer<Promise<TimeState>>(() => {
      return this.dispatcher$.scan<Promise<TimeState>>((state, action) => {
        /*  */ if (action instanceof TimeUpdateAction) {
          return this.http$.get('https://ntp-a1.nict.go.jp/cgi-bin/json')
            .delay(500) // わざと500ms余計に遅らせる。
            .map(res => res.json())
            .map(data => ({ serial: +data.st * 1000 } as TimeState))
            .toPromise();
        } else if (action instanceof RestoreAction) {
          return promisify(action.stateFromOuterworld.time);
        } else {
          return state;
        }
      }, promisify(this.initialState.time));
    });
  }

}