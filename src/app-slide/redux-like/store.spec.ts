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
import { Dispatcher, Provider, InitialState } from './common';
import { defaultAppState } from './initial-state';
import { AppState, IncrementState } from './types';
import { Action, IncrementAction, DecrementAction, ResetAction } from './actions';
import { Observable } from 'rxjs/Rx';


////////////////////////////////////////////////////////////////////////
// mocks


////////////////////////////////////////////////////////////////////////
// tests
describe('TEST: Store Class Isolated Test', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Store, Dispatcher,
        { provide: InitialState, useValue: defaultAppState }
      ]
    });
  });


  it('can create', inject([Store], (store: Store) => {
    assert(!!store);
  }));

});