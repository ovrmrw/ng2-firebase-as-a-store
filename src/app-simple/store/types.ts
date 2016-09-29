export interface IncrementState {
  counter: number;
}


/* StoreではPromiseとして扱う。 */
export interface AppState {
  increment: IncrementState | Promise<IncrementState>;
}

/* ComponentではStableとして扱う。 */
export interface ResolvedAppState {
  increment: IncrementState;
}