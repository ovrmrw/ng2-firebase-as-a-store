/* >>> boilerplate */
import assert from 'power-assert';
import lodash from 'lodash';
import { inject, async, fakeAsync, tick, TestBed, ComponentFixture } from '@angular/core/testing';
import { setTimeoutPromise, elements, elementText, elementValue } from '../../test-ng2/testing.helper';
/* <<< boilerplate */


////////////////////////////////////////////////////////////////////////
// modules
import { AppComponent } from '../../src/app/app.component';
import { Directive } from '@angular/core';
// import { APP_BASE_HREF } from '@angular/common';
// import { ActivatedRoute, Router, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs/Rx';


////////////////////////////////////////////////////////////////////////
// mocks
// class Mock { }
// class MockRouter {
//   createUrlTree() { }
// }

// @Directive({ selector: '[routerLinkActive]' })
// class MockRouterLinkActiveDirective { }

const mockTemplate = `
  <h1>{{title}}</h1>
  <nav>
    <a>Dashboard</a>
    <a>Heroes</a>
  </nav>
`;


////////////////////////////////////////////////////////////////////////
// tests
describe('TEST: App Component', () => {
  /* >>> boilerplate */
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: []
    });
  });
  /* <<< boilerplate */


  it('can create, should have title', async(async () => { // 2つ目のasyncは async/await のasync。
    await TestBed
      .overrideComponent(AppComponent, { set: { template: mockTemplate } })
      .compileComponents();
    const fixture = TestBed.createComponent(AppComponent);
    assert(!!fixture);

    const el = fixture.debugElement.nativeElement as HTMLElement;
    const component = fixture.componentRef.instance;
    assert(elementText(el, 'nav a', 0) === 'Dashboard');
    assert(elementText(el, 'nav a', 1) === 'Heroes');
    assert(component.title === 'Tour of Heroes');
    assert(elementText(el, 'h1') === '');
    fixture.detectChanges();
    assert(elementText(el, 'h1') === 'Tour of Heroes');
  }));


  it('can create, should have title (fakeAsync ver.)', fakeAsync(() => {
    TestBed
      .overrideComponent(AppComponent, { set: { template: mockTemplate } })
      .compileComponents();
    tick();
    const fixture = TestBed.createComponent(AppComponent);
    assert(!!fixture);

    const el = fixture.debugElement.nativeElement as HTMLElement;
    const component = fixture.componentRef.instance;
    assert(elementText(el, 'nav a', 0) === 'Dashboard');
    assert(elementText(el, 'nav a', 1) === 'Heroes');
    assert(component.title === 'Tour of Heroes');
    assert(elementText(el, 'h1') === '');
    fixture.detectChanges();
    assert(elementText(el, 'h1') === 'Tour of Heroes');
  }));

});
