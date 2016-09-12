import { AppState } from './store';


export class IncrementAction {
  constructor() { }
}

export class DecrementAction {
  constructor() { }
}

export class PushHistoryAction {
  constructor(public description: string) { }
}

export class ReplaceAction {
  constructor(public replacer: AppState) { }
}

export class ResetAction {
  constructor() { }
}


export type Action = IncrementAction | DecrementAction | PushHistoryAction | ReplaceAction | ResetAction;