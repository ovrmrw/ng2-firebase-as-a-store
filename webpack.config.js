'use strict';

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    vendor: './config/vendor.ts',
    main: './src/main.ts',
  },
  output: {
    path: '.dest',
    filename: 'webpack.bundle.[name].js',
    chunkFilename: 'chunks.[id].js'
  },
  resolve: {
    extensions: ['', '.ts', '.js']
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor' }),
    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
  ],
  module: {
    loaders: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        loaders: [
          'awesome-typescript-loader?tsconfig=config/tsconfig.bundle.json',
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
  devtool: 'source-map',
};