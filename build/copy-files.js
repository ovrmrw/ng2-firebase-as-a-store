const fs = require('fs-extra');

// 一時フォルダを削除する。
fs.removeSync('./.dest');
// fs.removeSync('./.awcache');

// publicフォルダにあるファイルを.destフォルダにコピーする。
fs.copy('./public', './.dest');

// srcフォルダにある『末尾が'.ts'か'.tsx'ではない』ファイルを.destフォルダにコピーする。
fs.copy('./src', './.dest/src', { filter: /^(?!.*\.ts(x|)$)/ }); // systemjs用

// polyfillを.destフォルダにコピーする。
// fs.copy('./node_modules/core-js/client/shim.min.js', './.dest/shim.min.js');
fs.copy('./node_modules/babel-polyfill/dist/polyfill.min.js', './.dest/polyfill.min.js');

fs.copy('./node_modules/firebase/firebase.js', './.dest/firebase.js');
