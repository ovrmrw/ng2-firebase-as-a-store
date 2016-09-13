import { AppState } from './store';


export class IncrementAction {
  constructor() { }
}

export class DecrementAction {
  constructor() { }
}

export class ReplaceAction {
  constructor(public cloudState: AppState) { }
}


export type Action = IncrementAction | DecrementAction | ReplaceAction;