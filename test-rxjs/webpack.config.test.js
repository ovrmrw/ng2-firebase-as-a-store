'use strict';

const webpack = require('webpack');


module.exports = {
  entry: ['./test-rxjs/main.js'],
  output: {
    path: '.dest-test-rxjs',
    filename: 'webpack.bundle.spec.rxjs.js',
  },
  resolve: {
    extensions: ['', '.ts', '.js']
  },
  plugins: [],
  module: {
    loaders: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        loaders: ['awesome-typescript-loader?tsconfig=config/tsconfig.test-rxjs.json'],
      },
    ]
  },
  devtool: 'inline-source-map',
};