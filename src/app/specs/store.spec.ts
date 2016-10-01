/* >>> boilerplate */
import assert from 'power-assert';
import lodash from 'lodash';
import { inject, async, fakeAsync, tick, TestBed, ComponentFixture } from '@angular/core/testing';
import { setTimeoutPromise, elements, elementText, elementValue } from '../../../test-ng2/testing.helper';
/* <<< boilerplate */


////////////////////////////////////////////////////////////////////////
// modules
import { Dispatcher, Provider, InitialState } from '../../../packages/angular-rxjs-redux';
import { Store, State, defaultAppState, AppState, IncrementState, Action, IncrementAction, DecrementAction, ResetAction } from '../store';
import { Observable } from 'rxjs/Rx';


////////////////////////////////////////////////////////////////////////
// mocks


////////////////////////////////////////////////////////////////////////
// tests
describe('TEST: Store Class Isolated Test', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Store, Dispatcher, { provide: InitialState, useValue: defaultAppState }]
    });
  });


  it('can create', inject([Store], (store: Store) => {
    assert(!!store);
  }));

});