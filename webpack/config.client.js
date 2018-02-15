const webpack = require('webpack');
const path = require('path');
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
const nodeEnv = process.env.NODE_ENV || 'development';
const isDevelopment = nodeEnv === 'development';
const routes = require('../src/react/routes');
const hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000';
const entry = {};

for (let i = 0; i < routes.length; i++) {
  entry[routes[i].componentName] = [
    '../src/client.js',
    `../src/react/${routes[i].componentName}.js`,
  ];
  if (isDevelopment) {
    entry[routes[i].componentName].unshift(hotMiddlewareScript);
  }
}

module.exports = {
  name: 'client',
  target: 'web',
  cache: isDevelopment,
  devtool: isDevelopment ? 'cheap-module-source-map' : 'hidden-source-map',
  context: __dirname,
  entry,
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: isDevelopment ? '/static/' : '/static/',
    filename: isDevelopment ? '[name].bundle.js' : '[name].[hash].bundle.js',
    chunkFilename: isDevelopment ? '[name].bundle.js' : '[name].[hash].bundle.js',
  },
  module: {
    rules: [ {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      options: {
        cacheDirectory: isDevelopment,
        babelrc: false,
        presets: [
          'es2015',
          'es2017',
          'react',
          'stage-0',
          'stage-3',
        ],
        plugins: [
          'transform-runtime',
          'syntax-dynamic-import',
        ].concat(isDevelopment ? [
          ['react-transform', {
            'transforms': [ {
              'transform': 'react-transform-hmr',
              'imports': [ 'react', ],
              'locals': [ 'module', ],
            }, ],
          }, ],
        ] : [
        ]
        ),
      },
    }, ],
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin(),
    function StatsPlugin() {
      this.plugin('done', (stats) =>
        require('fs').writeFileSync(path.join(__dirname, '../dist', 'stats.generated.js'), // eslint-disable-line no-sync
          `module.exports=${JSON.stringify(stats.toJson().assetsByChunkName)};\n`)
      );
    },
  ].concat(isDevelopment ? [
  ] : [
    new CommonsChunkPlugin({
      name: 'common',
      minChunks: 2,
    }),
  ]),
};