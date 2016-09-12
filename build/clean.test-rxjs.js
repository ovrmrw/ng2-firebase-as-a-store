const fs = require('fs-extra');

// 一時フォルダを削除する。
fs.removeSync('./.dest-test-rxjs');
fs.ensureDirSync('./.awcache');
// fs.removeSync('./.awcache-test-rxjs');
