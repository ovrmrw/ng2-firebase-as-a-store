/* >>> boilerplate */
import assert from 'power-assert';
import lodash from 'lodash';
import { inject, async, fakeAsync, tick, TestBed, ComponentFixture } from '@angular/core/testing';
import { setTimeoutPromise, elements, elementText, elementValue } from '../../../test-ng2/testing.helper';
/* <<< boilerplate */


////////////////////////////////////////////////////////////////////////
// modules
import { State } from './state';
import { Store } from './store';
import { Dispatcher, Provider } from './common';
import { AppState, IncrementState } from './types';
import { Action, IncrementAction, DecrementAction, ResetAction } from './actions';
import { Observable } from 'rxjs/Rx';


////////////////////////////////////////////////////////////////////////
// mocks
class Mock { }


////////////////////////////////////////////////////////////////////////
// tests
describe('TEST: State Class Isolated Test', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [State, { provide: Store, useClass: Mock }]
    });
  });


  it('can create', inject([State], (state: State) => {
    assert(!!state);
  }));

});


describe('TEST: (Dispatcher -> Store -> State) Half Integration Test', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [State, Store, Dispatcher]
    });
  });


  it('can increment and decrement', fakeAsync(inject([State, Dispatcher], (state: State, dispatcher$: Dispatcher<Action>) => {
    let incrementState: IncrementState | undefined;
    state.incrementState$
      .subscribe(s => {
        incrementState = s;
        // console.log('counter:', s.counter);
      });

    assert.deepEqual(incrementState, undefined);
    tick();
    assert.deepEqual(incrementState, { counter: 0 });
    dispatcher$.next(new IncrementAction()); // 0 -> 1
    tick(499);
    assert.deepEqual(incrementState, { counter: 0 });
    tick(1);
    assert.deepEqual(incrementState, { counter: 1 });
    dispatcher$.next(new IncrementAction()); // 1 -> 2
    dispatcher$.next(new IncrementAction()); // 2 -> 3
    tick(500);
    assert.deepEqual(incrementState, { counter: 3 });
    dispatcher$.next(new DecrementAction()); // 3 -> 2
    tick(500);
    assert.deepEqual(incrementState, { counter: 2 });
    dispatcher$.next(new ResetAction()); // 2 -> 0
    tick();
    assert.deepEqual(incrementState, { counter: 0 });
    for (let i = 0; i < 100; i++) { // 0 -> 100
      dispatcher$.next(new IncrementAction());
    }
    tick(500);
    assert.deepEqual(incrementState, { counter: 100 });
    dispatcher$.next(new ResetAction()); // 100 -> 0
    tick();
    assert.deepEqual(incrementState, { counter: 0 });
  })));

});
