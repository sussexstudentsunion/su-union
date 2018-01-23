const path = require('path');
const webpack = require('webpack');
const { generateConfig } = require('./webpack.base.config.js');

const config = generateConfig();

config.devServer = {
  historyApiFallback: true,
  hot: true,
  https: true,
};

config.entry.vendor.push('webpack-hot-middleware/client');
config.entry.main.push('webpack-hot-middleware/client');

config.output = {
  path: path.resolve('./build'),
  publicPath: '/assets/',
  filename: '[name].js',
  chunkFilename: '[id].chunk.js',
};

config.devtool = 'inline-source-map';

config.plugins = config.plugins.concat([
  new webpack.DefinePlugin({
    'process.env': {
      HYDROLEAF_MODE: JSON.stringify('RENDER_COMPONENT'),
      COMP_NODE: '0',
    },
  }),
  new webpack.NamedModulesPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
]);

config.module.rules = config.module.rules.concat([
  {
    test: /\.js?$/,
    loaders: ['babel-loader?cacheDirectory&forceEnv=bundle'],
    exclude: /node_modules/,
  },
  {
    test: /\.css$/,
    // fallback: 'style-loader',
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          importLoaders: 1,
        },
      },
      'postcss-loader',
    ],
  },
]);

module.exports = config;
