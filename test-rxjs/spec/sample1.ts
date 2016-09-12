/* >>> boilerplate */
import { Observable, Subject, TestScheduler } from 'rxjs/Rx';
import assert from 'assert';
/* <<< boilerplate */


describe('TEST: rxjs5 basics', () => {
  /* >>> boilerplate */
  let ts: TestScheduler;
  let hot: typeof TestScheduler.prototype.createHotObservable;
  let cold: typeof TestScheduler.prototype.createColdObservable;

  beforeEach(() => {
    ts = new TestScheduler(assert.deepEqual);
    hot = ts.createHotObservable.bind(ts);
    cold = ts.createColdObservable.bind(ts);
  });
  /* <<< boilerplate */


  it('should return correct observable', () => {
    const source$ = cold<number>('-a-b-c', { a: 1, b: 2, c: 3 });
    const marbles = '---B-C';
    const values = { A: 10, B: 20, C: 30 };
    const test$ = mapFilterTest(source$);
    ts.expectObservable(test$).toBe(marbles, values);
    ts.flush();
  });


  it('should pass', () => {
    assert(1 + 1 === 2);
  });

});


function mapFilterTest(observable: Observable<number>): Observable<number> {
  return observable
    .map(value => value * 10)
    .filter(value => value > 10);
}