const path = require('path');
const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CommonsChunkPlugin = new webpack.optimize.CommonsChunkPlugin({
  name: 'vendor',
  minChunks: function (module) {
    return module.context && module.context.indexOf('node_modules') !== -1;
  }
});

const PROD = (process.env.NODE_ENV === 'production');
const SRC_PATH = path.resolve(__dirname, 'web', 'src');
const PUBLIC_PATH = path.resolve(__dirname, 'web', 'public');

module.exports = {
  entry: {
    app: ['babel-polyfill', path.resolve(SRC_PATH, 'app.jsx')]
  },
  output: {
    filename: '[name].js',
    path: PUBLIC_PATH
  },
  module: {
    rules: [
      { test: /\.(js|jsx)$/, exclude: path.resolve(__dirname, 'node_modules'), use: 'babel-loader' },
      {
        test: /\.css$/,
        use: PROD ? ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader']
        }) : [ 'style-loader', 'css-loader' ]
      },
      { test: /\.(png|jpg)$/, use: 'url-loader?limit=10000&name=/images/[hash].[ext]' },
      {
        test: /.\/tests\/.js$/,
        use: 'mocha-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: PROD ? [
    CommonsChunkPlugin,
    new ExtractTextPlugin('app.css')
  ] : [ CommonsChunkPlugin ],
  resolve: {
    alias: {
      images: path.resolve(SRC_PATH, 'images'),
      services: path.resolve(SRC_PATH, 'services'),
      components: path.resolve(SRC_PATH, 'components'),
      controllers: path.resolve(SRC_PATH, 'controllers'),
      util: path.resolve(SRC_PATH, 'util')
    },
    mainFiles: ['index'],
    extensions: ['*', '.js', '.jsx']
  },
  devtool: PROD ? 'source-map' : 'cheap-module-eval-source-map',
  devServer: {
    contentBase: PUBLIC_PATH,
    historyApiFallback: true,
    port: 9000,
    proxy: {
      '/api': 'http://localhost:5000/'
    }
  }
};
