import { Injectable } from '@angular/core';
// import { Subject } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import firebase from 'firebase';


const config = {
  apiKey: "AIzaSyDxLTkVE8aBriHxWARPbzszGE0uAVFYOPo",
  authDomain: "fir-as-a-store.firebaseapp.com",
  databaseURL: "https://fir-as-a-store.firebaseio.com",
  storageBucket: "fir-as-a-store.appspot.com",
};


@Injectable()
export class FirebaseController {
  constructor() {
    firebase.initializeApp(config);
  }

  upload(refPath: string, obj: {}): void {
    firebase.database().ref(refPath).update(obj, err => {
      if (err) { console.error(err); }
    });
  }

  connect$<T>(refPath: string): Subject<T> {
    const subject = new Subject<T>();
    firebase.database().ref(refPath).on('value', snapshot => {
      if (snapshot) {
        const val = snapshot.val() as T;
        subject.next(val);
      }
    });
    return subject;
  }
}