export interface IncrementState {
  counter: number
}

export interface AppState {
  increment: Promise<IncrementState>
  replace: boolean
  uuid: string
}

export interface ResolvedAppState {
  increment: IncrementState
  replace: boolean
  uuid: string
}