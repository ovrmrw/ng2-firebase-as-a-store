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
  constructor(public stateFromOuterWorld: AppState) { }
}

export class ErrorAction {
  constructor() { }
}


export type Action = IncrementAction | DecrementAction | ResetAction | RestoreAction | ErrorAction;