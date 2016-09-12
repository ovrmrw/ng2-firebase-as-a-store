/* >>> boilerplate */
import assert from 'power-assert';
import lodash from 'lodash';
import { inject, async, fakeAsync, tick, TestBed, ComponentFixture } from '@angular/core/testing';
import { setTimeoutPromise, elements, elementText, elementValue } from '../../test-ng2/testing.helper';
/* <<< boilerplate */


////////////////////////////////////////////////////////////////////////
// modules
import { DashboardComponent } from '../../src/dashboard/dashboard.component';
import { HeroService } from '../../src/webapi/hero.service';
import { Hero } from '../../src/types';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';


////////////////////////////////////////////////////////////////////////
// mocks
class MockHeroService {
  private heroes: Hero[] = [
    { id: 11, name: 'Mr. Nice' },
    { id: 12, name: 'Narco' },
    { id: 13, name: 'Bombasto' },
    { id: 14, name: 'Celeritas' },
    { id: 15, name: 'Magneta' },
    { id: 16, name: 'RubberMan' },
    { id: 17, name: 'Dynama' },
    { id: 18, name: 'Dr IQ' },
    { id: 19, name: 'Magma' },
    { id: 20, name: 'Tornado' }
  ];
  getHeroesAsPromise(): Promise<Hero[]> {
    return Promise.resolve(this.heroes);
  }
}
class Mock { }


////////////////////////////////////////////////////////////////////////
// tests
describe('TEST: Dashboard Component', () => {
  /* >>> boilerplate */
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      providers: [
        { provide: HeroService, useClass: MockHeroService },
        { provide: Router, useClass: Mock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
  });
  /* <<< boilerplate */


  it('can create, should have title, should have 4 heroes', async(async () => { // 2つ目のasyncは async/await のasync。
    await TestBed.compileComponents();
    const fixture = TestBed.createComponent(DashboardComponent);
    assert(!!fixture);
    const el = fixture.debugElement.nativeElement as HTMLElement;
    const component = fixture.componentRef.instance;

    assert(elementText(el, 'h3') === 'Top Heroes');
    assert(component.heroes.length === 0);
    assert(elements(el, 'div.grid div.col-1-4').length === 0);

    component.ngOnInit();
    await fixture.whenStable();
    assert(component.heroes.length === 4);
    fixture.detectChanges();

    assert(elements(el, 'div.grid div.col-1-4').length === 4);
    assert(elementText(el, 'div.hero', 0).trim() === 'Narco');
    assert(elementText(el, 'div.hero', 1).trim() === 'Bombasto');
    assert(elementText(el, 'div.hero', 2).trim() === 'Celeritas');
    assert(elementText(el, 'div.hero', 3).trim() === 'Magneta');
    assert(el.querySelectorAll('div.hero')[4] === undefined);
    
  }));


  it('can create, should have title, should have 4 heroes (fakeAsync ver.)', fakeAsync(() => {
    TestBed.compileComponents();
    tick();
    const fixture = TestBed.createComponent(DashboardComponent);
    assert(!!fixture);
    const el = fixture.debugElement.nativeElement as HTMLElement;
    const component = fixture.componentRef.instance;

    assert(elementText(el, 'h3') === 'Top Heroes');
    assert(component.heroes.length === 0);
    assert(elements(el, 'div.grid div.col-1-4').length === 0);

    component.ngOnInit();
    tick();
    assert(component.heroes.length === 4);
    fixture.detectChanges();

    assert(elements(el, 'div.grid div.col-1-4').length === 4);
    assert(elementText(el, 'div.hero', 0).trim() === 'Narco');
    assert(elementText(el, 'div.hero', 1).trim() === 'Bombasto');
    assert(elementText(el, 'div.hero', 2).trim() === 'Celeritas');
    assert(elementText(el, 'div.hero', 3).trim() === 'Magneta');
    assert(el.querySelectorAll('div.hero')[4] === undefined);
  }));

});
