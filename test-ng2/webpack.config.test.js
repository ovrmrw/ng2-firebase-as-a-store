'use strict';

const webpack = require('webpack');


module.exports = {
  entry: {
    vendor: './config/vendor.testing.ts',
    main: './test-ng2/main.ts',
  },
  output: {
    path: '.dest-test-ng2',
    filename: 'webpack.bundle.spec.[name].js'
  },
  resolve: {
    extensions: ['', '.ts', '.js']
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor' })
  ],
  module: {
    loaders: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        loaders: [
          'awesome-typescript-loader?tsconfig=config/tsconfig.test-ng2.json',
          'angular2-template-loader'
        ],
      },
      {
        test: /\.json$/,
        loader: "json-loader"
      },
      {
        test: /\.html$/,
        loader: "raw-loader"
      },
      {
        test: /\.css$/,
        loader: 'raw-loader'
      },
      {
        test: /\.scss$/,
        loaders: ['raw-loader', 'sass-loader']
      }
    ]
  },
  devtool: 'inline-source-map',
};