
export class IncrementAction {
  constructor() { }
}

export class DecrementAction {
  constructor() { }
}


export type Action = IncrementAction | DecrementAction;