var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'smoke_signal/react/static/scripts/jsx');
var APP_DIR = path.resolve(__dirname, 'smoke_signal/react/static/scripts');

var config = {
  entry: BUILD_DIR + '/feed_page.jsx',
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
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  ]
};

module.exports = config;
