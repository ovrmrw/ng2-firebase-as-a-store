import { AppState } from './types';


export class IncrementAction {
  constructor(public counter?: number) { }
}

export class DecrementAction {
  constructor() { }
}

export class RestoreAction {
  constructor(public stateFromOuterWorld: AppState) { }
}

export class ResetAction {
  constructor() { }
}


export type Action = IncrementAction | DecrementAction | RestoreAction | ResetAction;