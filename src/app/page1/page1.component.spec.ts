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
import { State, IncrementState, Store, Dispatcher, Action, IncrementAction, DecrementAction } from '../store';
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
describe('TEST: Page1 Component Isolated Test', () => {
  /* >>> boilerplate */
  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [Page1Component],
      providers: [
        { provide: Page1Service, useClass: Mock },
        { provide: State, useClass: MockState },
      ]
    });
    TestBed.compileComponents();
    tick();
  }));
  /* <<< boilerplate */


  it('can create', fakeAsync(() => {
    const fixture = TestBed.createComponent(Page1Component);
    assert(!!fixture);
  }));


  it('should have counter', fakeAsync(() => {
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


describe('TEST: (Page1 Component -> Service -> Dispatcher -> Store -> State -> Component) Full Integration Test', () => {
  /* >>> boilerplate */
  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [Page1Component],
      providers: [
        Page1Service, Store, State, Dispatcher,
      ]
    });
    TestBed.compileComponents();
    tick();
  }));
  /* <<< boilerplate */


  it('should have incremented counter on the view when users click buttons', fakeAsync(() => {
    const fixture = TestBed.createComponent(Page1Component);
    const el = fixture.debugElement.nativeElement as HTMLElement;
    const component = fixture.componentRef.instance;
    const incrementButton = el.querySelector('#increment-btn') as HTMLButtonElement;
    const decrementButton = el.querySelector('#decrement-btn') as HTMLButtonElement;
    const resetButton = el.querySelector('#reset-btn') as HTMLButtonElement;

    component.ngOnInit();
    tick();
    assert(component._$counter === 0);
    incrementButton.click(); // 0 -> 1
    tick(499);
    assert(component._$counter === 0);
    tick(1);
    assert(component._$counter === 1);
    incrementButton.click(); // 1 -> 2
    incrementButton.click(); // 2 -> 3
    tick(500);
    assert(component._$counter === 3);
    assert(elementText(el, '#counter') === '');
    fixture.detectChanges();
    assert(elementText(el, '#counter') === '3');
    decrementButton.click(); // 3 -> 2
    tick(500);
    assert(component._$counter === 2);
    fixture.detectChanges();
    assert(elementText(el, '#counter') === '2');
    resetButton.click(); // 2 -> 0
    tick();
    assert(component._$counter === 0);
    fixture.detectChanges();
    assert(elementText(el, '#counter') === '0');    
    for (let i = 0; i < 100; i++) { // 0 -> 100
      incrementButton.click();
    }
    tick(500);
    assert(component._$counter === 100);
    fixture.detectChanges();
    assert(elementText(el, '#counter') === '100');
    resetButton.click(); // 100 -> 0
    tick();
    assert(component._$counter === 0);
    fixture.detectChanges();
    assert(elementText(el, '#counter') === '0');
  }));

});
