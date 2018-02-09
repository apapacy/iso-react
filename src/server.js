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
import AppRouter from './react/router';
import createStore from './redux/store';
import stats from '../dist/stats.generated';

app.use('/static', express.static('dist'))

app.use(async function(req, res, next) {
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
        <script src='/static/${stats[componentNames[0]]}'></script>
      `)
      res.end()
    }
  })
});

const httpServer = app.listen(PORT, () => {
  console.log(`Listening at ${PORT}`);
});

module.exports = httpServer;
