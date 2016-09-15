// declare var Error: any;
// Error.stackTraceLimit = Infinity;

/* >>> boilerplate */
import 'zone.js/dist/zone';
import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/proxy'; // rc.6から必要
import 'zone.js/dist/sync-test';
import 'zone.js/dist/async-test'; // asyncテストに必要
import 'zone.js/dist/fake-async-test'; // fakeAsyncテストに必要
import 'zone.js/dist/jasmine-patch';
import 'reflect-metadata';

import { TestBed } from '@angular/core/testing';

import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

import '../src/specs.ref'; // テストしたいTSファイル
/* <<< boilerplate */
