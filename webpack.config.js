var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'js');
var APP_DIR = path.resolve(__dirname, 'smoke_signal/react/static/scripts');

var config = {
  entry: BUILD_DIR + '/app.jsx',
  output: {
    path: APP_DIR,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test : /\.jsx?/,
        include : BUILD_DIR,
        loader : 'babel'
      }
    ]
  }
};

module.exports = config;
