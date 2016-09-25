import { AppState } from './types';


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

export class TimeUpdateAction {
  constructor() { }
}


export type Action =
  IncrementAction |
  DecrementAction |
  ResetAction |
  RestoreAction |
  ErrorAction |
  CancelAction |
  TimeUpdateAction
  ;