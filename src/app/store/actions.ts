import { ResolvedAppState } from './types';


export class IncrementAction {
  constructor() { }
}

export class DecrementAction {
  constructor() { }
}

export class RestoreAction {
  constructor(public stateFromOutworld: ResolvedAppState) { }
}

export class ResetAction {
  constructor() { }
}


export type Action = IncrementAction | DecrementAction | RestoreAction | ResetAction;