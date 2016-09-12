'use strict';

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';


module.exports = {
  entry: {
    vendor: './config/vendor.ts',
    main: './src/main.ts',
  },
  output: {
    path: '.dest',
    filename: 'webpack.bundle.[name].min.[hash].js',
    chunkFilename: 'chunks.[id].min.[hash].js'
  },
  resolve: {
    extensions: ['', '.ts', '.js']
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor' }),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      mangle: { screw_ie8: true, keep_fnames: true },
      compress: { screw_ie8: true },
      comments: false
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(ENV)
      }
    }),
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
        loader: "raw-loader",
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
  externals: {
    'firebase': 'firebase'
  }
};