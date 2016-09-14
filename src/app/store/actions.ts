import { ResolvedAppState } from './types';


export class IncrementAction {
  constructor() { }
}

export class DecrementAction {
  constructor() { }
}

export class ReplaceAction {
  constructor(public stateFromOutside: ResolvedAppState) { }
}

export class ResetAction {
  constructor() { }
}


export type Action = IncrementAction | DecrementAction | ReplaceAction | ResetAction;