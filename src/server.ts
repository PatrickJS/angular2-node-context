console.time('script');
import * as path from 'path';

var webpackRequire = require('webpack-require');
var webpack = require('webpack');
import 'angular2-universal/polyfills';


var _global: any = {
  Reflect: Reflect,
  console: console,
  Map: Map,
  Set: Set,
  WeakMap: WeakMap,
  RegExp: RegExp,
  setTimeout: setTimeout,
  setInterval: setInterval,
  Math: Math
};

_global.global = _global;
webpackRequire(
  {
    target: 'node',
    resolve: {
      extensions: ['', '.ts', '.js', '.json']
    },
    module: {
      loaders: [
        // TypeScript
        { test: /\.ts$/, loader: 'ts-loader' },
        { test: /\.json$/, loader: 'json-loader' }
      ]
    },
    plugins: [
      new webpack.optimize.OccurenceOrderPlugin(true)
    ],
    node: {
      global: true,
      __dirname: true,
      __filename: true,
      setTimeout: true,
      setInterval: true,
      process: true,
      Buffer: true
    }
  },
  path.resolve(path.join(__dirname, './universal-context.ts')),
  [
    'url',
    'http',
    'https',
    'fs'
  ],
  _global,
  function(err, factory, stats, fs) {
    if (err) {
      console.error(err);
    }

    // Invoke factory() to actually get an instance of your module.
    // You can call it multiple times to get multiple independent copies
    // of your module (useful for multiple requests in a single process).
    // Note that this is fairly performant, since the file is only parsed
    // once even if you call factory() multiple times.
    var context = factory();
    console.time('testing');
    context.main(`
      <!doctype html>
      <html lang="en">
        <head>
          <title>Universal</title>
        </head>
        <body>
          <app>
            Loading...
          <app>
        </body>
      </html>
    `)
    .then(html => {
      console.timeEnd('testing');
      console.log('html', html);
    });

    // You can inspect the build process by looking at the stats object

    // fs can be used to read static assets from the bundle. They are mounted
    // in the root directory. This is useful for extracting a static CSS
    // stylesheet with ExtractTextPlugin by doing: fs.readFileSync('/style.css')
  }
);

console.timeEnd('script');
