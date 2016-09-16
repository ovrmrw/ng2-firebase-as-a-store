import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import firebase from 'firebase';
import bluebird from 'bluebird';

import { AppState } from './types';


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


  uploadAfterResolve<T>(refPath: string, stateWillHavePromises: T): void {
    bluebird.props(stateWillHavePromises) // オブジェクト中のPromiseを全てresolveした後のオブジェクトを返す。
      .then(stateHasResolvedPromises => {
        const timeStr = '(' + new Date().valueOf() + ') Firebase Write Response';
        console.time(timeStr);
        // console.log('after bluebird.props()', resolvedState);
        firebase.database().ref(refPath).update(stateHasResolvedPromises, err => {
          if (err) { console.error(err); }
          console.timeEnd(timeStr); // Watching passed time to write data to Firebase.
        });
      })
      .catch(err => console.error(err));
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
}