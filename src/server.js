'use strict';
import fs from 'fs';
import express from 'express';
import './api/test';
const PORT = 3000;
const app = express();
import { createServer } from 'http';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter, Switch, Route } from 'react-router';
import { matchPath } from 'react-router-dom';
import { Provider } from 'react-redux';
import routes from './react/routes';
import AppRouter from './react/serverRouter';
import createStore from './redux/store';
import stats from '../dist/stats.generated';
import webpackConfig from '../webpack.config';
import webpack from 'webpack';
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const compiler = webpack(webpackConfig);

app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: webpackConfig.output.publicPath,
  //hot: true,
  //hotOnly: true,
  disableHostCheck: true,
  headers: { 'Access-Control-Allow-Origin': '*' },
  //historyApiFallback: true,
}));

app.use(webpackHotMiddleware(compiler, {
  log: console.log,
  path: '/__webpack_hmr',
  heartbeat: 10 * 1000
}));


app.use('/static', express.static('dist'))
// app.use('/static', (req, res, next) => void(0));

app.use('/', async function(req, res, next) {
  const store = createStore();
  const promises = [];
  const componentNames = [];
  routes.some(route => {
    const match = matchPath(req.path, route);
    if (match) {
      let component = require('./react/' + route.componentName);
      if (component.default) {
        component = component.default;
      }
      componentNames.push(route.componentName);
      if (typeof component.getInitialProps == 'function') {
        promises.push(component.getInitialProps({req, res, next, match, store}));
      }
    }
    return match;
  })

  Promise.all(promises).then(data => {
    const context = {data};
    const html = ReactDOMServer.renderToString(
      <Provider store={store}>
        <StaticRouter location={req.url} context={context}>
          <AppRouter/>
        </StaticRouter>
      </Provider>
    )

    if (context.url) {
      res.writeHead(301, {
        Location: context.url
      })
      res.end()
    } else {
      res.write(`
        <!doctype html>
        <script>
         // WARNING: See the following for security issues around embedding JSON in HTML:
         // http://redux.js.org/docs/recipes/ServerRendering.html#security-considerations
         window.__PRELOADED_STATE__ = ${JSON.stringify(store.getState()).replace(/</g, '\\u003c')}
        </script>
        <div id="app">${html}</div>
        <script src='/static/${stats.common}'></script>
        ${componentNames.map(componentName =>
            `<script src='/static/${stats[componentName]}'></script>`
        )}
      `)
      res.end()
    }
  })
});

const httpServer = app.listen(PORT, () => {
  console.log(`Listening at ${PORT}`);
});

module.exports = httpServer;
