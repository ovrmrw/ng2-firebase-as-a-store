import { Subject } from 'rxjs/Subject';


// 主にServiceクラスからActionをnextし、Storeクラス内のReducersを発火させるために用いられる。
// 簡潔に言うと往路のSubject。
export class Dispatcher<T> extends Subject<T> {
  constructor() { super(); }
}

// Storeクラス内のReducers処理後に新しい状態をnextし、ComponentクラスのViewを更新するために用いられる。
// 簡潔に言うと復路のSubject。
export class Provider<T> extends Subject<T> {
  constructor() { super(); }
}