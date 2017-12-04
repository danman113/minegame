const path = require('path');
const webpack = require('webpack');
const fs = require('fs')

const demos = fs.readdirSync(path.resolve(__dirname, 'demos'))
for (let i = demos.length - 1; i >= 0; i--) {
  let filename = demos[i]
  if (filename.charAt(0) === '.') {
    demos.splice(i, 1)
  }
}
const entries = {}
demos.map(key => entries[key] = './demos/' + key + '/index.js')
entries.out = './src/main.js'

module.exports = {
  entry: entries,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js'],
    modules: [
      path.resolve('./src/'),
      path.resolve('./node_modules')
    ]
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-0'],
          plugins: [
            ['transform-runtime', {
              helpers: false,
              polyfill: false,
              regenerator: true
            }]
          ]
        }
      }
    ]
  },
  stats: {
    colors: true
  },
  devtool: 'source-map'
}
