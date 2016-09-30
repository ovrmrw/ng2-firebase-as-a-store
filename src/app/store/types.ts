export interface IncrementState {
  counter: number;
}

export interface TimeState {
  serial: number;
}

export interface MathState {
  addition: number | Promise<number>;
  subtraction: number | Promise<number>;
  multiplication: number | Promise<number>;
}

export interface ResolvedMathState {
  addition: number;
  subtraction: number;
  multiplication: number;
}


/* StoreではincrementとtimeをPromiseとして扱う。 */
export interface AppState {
  increment: IncrementState | Promise<IncrementState>;
  restore: boolean;
  uuid: string;
  time: TimeState | Promise<TimeState>;
  actionName: string;
  math: MathState;
  nest?: {};
}

/* ComponentではincrementとtimeをStableとして扱う。 */
export interface ResolvedAppState {
  increment: IncrementState;
  restore: boolean;
  uuid: string;
  time: TimeState;
  actionName: string;
  math: ResolvedMathState;
  nest?: {};
}