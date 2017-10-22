const path = require('path');
const webpack = require('webpack');
const fs = require('fs')

const demos = fs.readdirSync(path.resolve(__dirname, 'demos'))
const entries = {}
demos.map(key => entries[key] = './demos/' + key + '/index.js')
entries.out = './src/main.js'

module.exports = {
   entry: entries,
   output: {
     path: path.resolve(__dirname, 'dist'),
     filename: '[name].js'
   },
   
   module: {
     loaders: [
       {
         test: /\.js$/,
         loader: 'babel-loader',
         query: {
           presets: ['es2015'],
           plugins: ['transform-class-properties']
         }
       }
     ]
   },
   stats: {
     colors: true
   },
   devtool: 'source-map'
   
};