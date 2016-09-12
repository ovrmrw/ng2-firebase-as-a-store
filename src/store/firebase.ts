import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Rx';
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

  uploadToCloud(path: string, obj: {}) {
    firebase.database().ref(path).update(obj, err => {
      if (err) { console.error(err); }
    });
  }

  connectFromCloud<T>(path: string): Subject<T> {
    const subject = new Subject<T>();
    firebase.database().ref(path).on('value', snapshot => {
      if (snapshot) {
        const val = snapshot.val();
        subject.next(val);
      }
    });
    return subject;
  }
}