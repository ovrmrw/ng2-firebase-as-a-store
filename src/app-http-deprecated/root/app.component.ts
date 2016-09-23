import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'my-app',
  template: `
    <h3>{{title}}</h3>
    <nav class="navbar navbar-light bg-faded">
      <ul class="nav navbar-nav">
        <li class="nav-item" routerLinkActive="active">
          <a class="nav-link" [routerLink]="['/page1']">Page1</a>
        </li>
      </ul>
    </nav>
    <hr />
    <router-outlet></router-outlet>
    <hr />
    <p>"INCREMENT"ボタンを押すとカウントアップします。"DECREMENT"ボタンを押すとカウントダウンします。</p>
    <p>"INCREMENT"と"DECREMENT"はわざと500msの遅延が発生するようにしています。</p>
    <p>ブラウザーをリロードしてみてください。直近の状態をFirebaseから取得して復元します。</p>
    <p>"TIME UPDATE"ボタンを押すとntp.nict.jpから現在の時刻を取得します。これもわざと追加で500ms遅延するようにしています。</p>
    <p>mergeMapとswitchMapは、mergeMapが全てのイベントが実行されるのに対し、switchMapはイベントが発生すると前のイベントをキャンセルするという違いがあります。ちなみにObservableの話です。</p>
    <p><a href="https://github.com/ovrmrw/ng2-firebase-as-a-store">GitHub</a></p> 
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'Demo App';
}