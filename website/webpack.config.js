// Copyright (c) 2023 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

const {resolve, join} = require('path');
const webpack = require('webpack');

const KeplerPackage = require('../package');

const rootDir = join(__dirname, '..');
const libSources = join(rootDir, 'src');

const console = require('global/console');

const BABEL_CONFIG = {
  presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
  plugins: [
    ['@babel/plugin-transform-typescript', {isTSX: true, allowDeclareFields: true}],
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-optional-chaining',
    [
      'search-and-replace',
      {
        rules: [
          {
            search: '__PACKAGE_VERSION__',
            replace: KeplerPackage.version
          }
        ]
      }
    ]
  ]
};

const COMMON_CONFIG = {
  entry: ['./src/main'],
  output: {
    path: resolve(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/'
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    modules: ['node_modules', libSources],
    alias: {
      'kepler.gl/dist': libSources,
      // Imports the kepler.gl library from the src directory in this repo
      'kepler.gl': libSources,
      react: resolve(rootDir, './node_modules/react'),
      'react-dom': resolve(rootDir, './node_modules/react-dom'),
      'styled-components': resolve(rootDir, './node_modules/styled-components'),
      'react-redux': resolve(rootDir, './node_modules/react-redux'),
      'react-palm': resolve(rootDir, './node_modules/react-palm'),
      'react-intl': resolve(rootDir, './node_modules/react-intl')
    }
  },

  module: {
    rules: [
      {
        // Compile ES2015 using bable
        test: /\.(js|jsx|ts|tsx)$/,
        loader: 'babel-loader',
        options: BABEL_CONFIG,
        exclude: [/node_modules/]
      },
      {
        test: /\.(eot|svg|ico|ttf|woff|woff2|gif|jpe?g|png)$/,
        loader: 'url-loader'
      },
      {
        test: /\.(svg|ico|gif|jpe?g|png)$/,
        loader: 'file-loader?name=[name].[ext]'
      }
    ]
  },

  node: {
    fs: 'empty'
  },

  // to support browser history api and remove the '#' sign
  devServer: {
    historyApiFallback: true
  },

  // Optional: Enables reading mapbox token from environment variable
  plugins: [
    // Provide default values to suppress warnings
    new webpack.EnvironmentPlugin({
      MapboxAccessToken: undefined,
      DropboxClientId: null,
      CartoClientId: null,
      GoogleDriveClientId: null,
      MapboxExportToken: null
    })
  ],

  // Required to avoid deck.gl undefined module when code is minified
  optimization: {
    concatenateModules: false,
    providedExports: false,
    usedExports: false
  }
};

const addDevConfig = config => {
  config.module.rules.push({
    // Unfortunately, webpack doesn't import library sourcemaps on its own...
    test: /\.js$/,
    use: ['source-map-loader'],
    enforce: 'pre',
    exclude: [/node_modules\/react-palm/, /node_modules\/react-data-grid/]
  });

  return Object.assign(config, {
    devtool: 'source-maps',

    plugins: config.plugins.concat([
      // new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    ])
  });
};

const addProdConfig = config => {
  return Object.assign(config, {
    output: {
      path: resolve(__dirname, './dist'),
      filename: 'bundle.js'
    }
  });
};

function logError(msg) {
  console.log('\x1b[31m%s\x1b[0m', msg);
}

function logInstruction(msg) {
  console.log('\x1b[36m%s\x1b[0m', msg);
}

module.exports = env => {
  env = env || {};

  let config = COMMON_CONFIG;

  if (env.local) {
    config = addDevConfig(config);
  }

  if (env.prod) {
    if (!process.env.MapboxAccessToken) {
      logError('Error! MapboxAccessToken is not defined');
      logInstruction(
        `Make sure to run "export MapboxAccessToken=<token>" before deploy the website`
      );
      logInstruction(
        'You can get the token at https://www.mapbox.com/help/how-access-tokens-work/'
      );
      throw new Error('Missing Mapbox Access token');
    }
    if (!process.env.DropboxClientId) {
      logError('Error! DropboxClientId is not defined');
      logInstruction(`Make sure to run "export DropboxClientId=<token>" before deploy the website`);
      logInstruction('You can get the token at https://www.dropbox.com/developers');
      throw new Error('Missing Export DropboxClientId Access token');
    }
    if (!process.env.MapboxExportToken) {
      logError('Error! MapboxExportToken is not defined');
      logInstruction(
        `Make sure to run "export MapboxExportToken=<token>" before deploy the website`
      );
      logInstruction(
        'You can get the token at https://www.mapbox.com/help/how-access-tokens-work/'
      );
      throw new Error('Missing Export Mapbox Access token, used to generate the single map file');
    }
    config = addProdConfig(config);
  }

  return config;
};
