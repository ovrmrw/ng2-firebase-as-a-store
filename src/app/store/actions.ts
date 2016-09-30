import { AppState } from './types';
import { Observable } from 'rxjs/Rx';


export class IncrementAction {
  constructor() { }
}

export class DecrementAction {
  constructor() { }
}

export class ResetAction {
  constructor() { }
}

export class RestoreAction {
  constructor(public restoreState: AppState | null) { }
}

export class ErrorAction {
  constructor() { }
}

export class CancelAction {
  constructor() { }
}

/* Actionの引数に非同期型(Promise,Observable)を与えることもできる。 */
export class TimeUpdateAction {
  constructor(public timestampAsObservable$: Observable<number>) { }
}

export class AddAction {
  constructor(public num: number) { }
}

export class SubtractAction {
  constructor(public num: number) { }
}

export class MultiplyAction {
  constructor(public num: number) { }
}


export type Action =
  IncrementAction |
  DecrementAction |
  ResetAction |
  RestoreAction |
  ErrorAction |
  CancelAction |
  TimeUpdateAction |
  AddAction | SubtractAction | MultiplyAction
  ;