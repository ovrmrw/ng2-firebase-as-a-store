/* >>> boilerplate */
import assert from 'power-assert';
import lodash from 'lodash';
import { inject, async, fakeAsync, tick, TestBed, ComponentFixture } from '@angular/core/testing';
import { setTimeoutPromise, elements, elementText, elementValue } from '../../../test-ng2/testing.helper';
/* <<< boilerplate */


////////////////////////////////////////////////////////////////////////
// modules
import { Page1Component } from './page1.component';
import { Page1Service } from './page1.service';
import { State, IncrementState } from '../store';
import { ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Rx';


////////////////////////////////////////////////////////////////////////
// mocks
class Mock { }

class MockState {
  get incrementState$(): Observable<IncrementState> {
    return Observable.of({ counter: 100 });
  }
}


////////////////////////////////////////////////////////////////////////
// tests
describe('TEST: Page1 Component', () => {
  /* >>> boilerplate */
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Page1Component],
      providers: [
        { provide: Page1Service, useClass: Mock },
        { provide: State, useClass: MockState },
        { provide: ChangeDetectorRef, useClass: Mock }
      ]
    });
  });
  /* <<< boilerplate */


  it('can create', fakeAsync(() => {
    TestBed.compileComponents();
    tick();
    const fixture = TestBed.createComponent(Page1Component);
    assert(!!fixture);
  }));


  it('should have counter', fakeAsync(() => {
    TestBed.compileComponents();
    tick();
    const fixture = TestBed.createComponent(Page1Component);
    const el = fixture.debugElement.nativeElement as HTMLElement;
    const component = fixture.componentRef.instance;    
    assert(elementText(el, '#counter') === '');
    assert(component._$counter === undefined);
    fixture.detectChanges();
    assert(elementText(el, '#counter') === '100');
    assert(component._$counter === 100);
  }));

});
