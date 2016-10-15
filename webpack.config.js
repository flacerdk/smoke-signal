var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'smoke_signal/static/scripts/jsx');
var APP_DIR = BUILD_DIR;

var config = {
  entry: APP_DIR + '/feed_page.jsx',
  output: {
    path: BUILD_DIR,
    filename: 'feed_page.js'
  },
  module: {
    loaders: [
      {
        test : /\.jsx?/,
        include : APP_DIR,
        loader : 'babel'
      }
    ]
  }
};

module.exports = config;
