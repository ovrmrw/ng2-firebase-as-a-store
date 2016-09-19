import { Injectable, Inject } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import firebase from 'firebase';


const config = {
  apiKey: 'AIzaSyDxLTkVE8aBriHxWARPbzszGE0uAVFYOPo',
  authDomain: 'fir-as-a-store.firebaseapp.com',
  databaseURL: 'https://fir-as-a-store.firebaseio.com',
  storageBucket: 'fir-as-a-store.appspot.com',
};


@Injectable()
export class FirebaseMiddleware {
  constructor() {
    firebase.initializeApp(config);
  }


  saveCurrentState<T>(refPath: string, stateHasResolvedPromises: T, deletePropNames: string[] = []): void {
    const firebaseWritableObject = this.getFirebaseWritableObject(stateHasResolvedPromises, deletePropNames);
    const timeStr = '(' + new Date().valueOf() + ') Firebase Write Response';
    console.time(timeStr);
    firebase.database().ref(refPath).update(firebaseWritableObject, err => {
      if (err) { console.error(err); }
      console.timeEnd(timeStr); // Watching passed time to write data to Firebase.
    });
  }

  connect$<T>(refPath: string): Observable<T> {
    const subject = new Subject<T>();
    firebase.database().ref(refPath).on('value', snapshot => {
      if (snapshot) {
        const val = snapshot.val() as T;
        subject.next(val);
      }
    });
    return subject.asObservable();
  }


  // オブジェクトに含まれるプリミティブではない値を落とす。(Function等)
  private getFirebaseWritableObject(state: {}, deletePropNames: string[]): {} {
    deletePropNames.forEach(propName => {
      delete state[propName];
    });
    const json: string = JSON.stringify(state);
    const shapedObject = JSON.parse(json);
    // console.log('shapedObject:', shapedObject);
    return shapedObject;
  }
}