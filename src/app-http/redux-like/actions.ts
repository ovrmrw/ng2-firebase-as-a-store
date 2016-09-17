import { AppState } from './types';


export class IncrementAction {
  constructor() { }
}

export class DecrementAction {
  constructor() { }
}

export class RestoreAction {
  constructor(public stateFromOuterworld: AppState) { }
}

export class ResetAction {
  constructor() { }
}

export class TimeAction {
  constructor() { }
}


export type Action = IncrementAction | DecrementAction | RestoreAction | ResetAction | TimeAction;