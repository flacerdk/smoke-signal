var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var BUILD_DIR = path.resolve(__dirname, 'js');
var APP_DIR = path.resolve(__dirname, 'server/main/static');

var config = {
  entry: BUILD_DIR + '/app.jsx',
  output: {
    path: APP_DIR,
    filename: 'scripts/bundle.js'
  },
  module: {
    loaders: [
      {
        test : /\.jsx?/,
        include : BUILD_DIR,
        loader : 'babel'
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('css!sass'),
      },
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    modulesDirectories: ['node_modules', 'js']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new ExtractTextPlugin('css/style.css', {
      allChunks: true
    })
  ]
};

module.exports = config;
