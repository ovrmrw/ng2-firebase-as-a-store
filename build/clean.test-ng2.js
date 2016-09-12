const fs = require('fs-extra');

// 一時フォルダを削除する。
fs.removeSync('./.dest-test-ng2');
fs.ensureDirSync('./.awcache');
// fs.removeSync('./.awcache-test-ng2');
