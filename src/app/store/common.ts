import { Subject } from 'rxjs/Subject';


// 主にServiceクラスからActionをnextし、Storeクラス内のReducersを発火させるために用いられる。
export class Dispatcher<T> extends Subject<T> {
  constructor() { super(); }
}

// Storeクラス内のReducers処理後に新しい状態をnextし、ComponentクラスのViewを更新するために用いられる。
export class Courier<T> extends Subject<T> {
  constructor() { super(); }
}