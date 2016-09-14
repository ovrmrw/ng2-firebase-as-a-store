export interface IncrementState {
  counter: number
}

export interface AppState {
  increment: Promise<IncrementState>
  replace: boolean
  timestamp: number
}

export interface ResolvedAppState {
  increment: IncrementState
  replace: boolean
  timestamp: number
}