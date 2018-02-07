import express from 'express';
import './api/test';
const PORT = 3000;
const app = express();
import { createServer } from 'http'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter, Switch, Route } from 'react-router'
import { matchPath } from 'react-router-dom'
import routes from './react/routes';
import AppRouter from './react/router'
import createStore from './redux/store';
import {userActions} from './redux/actions';

app.use(async function(req, res, next) {
  const store = createStore();
  console.log(userActions);
  let action
  await store.dispatchAsync(userActions.login({name: 'Joe'}));
  console.log(store.getState())
  const promises = []
  routes.some(route => {
    const match = matchPath(req.path, route);
    if (match && typeof route.component.getInitialProps == 'function') {
      promises.push(route.component.getInitialProps({req, res, next, match}));
    }
    return match;
  })

  Promise.all(promises).then(data => {
    const context = {data};
    const html = ReactDOMServer.renderToString(
      <StaticRouter location={req.url} context={context}>
        <AppRouter/>
      </StaticRouter>
    )

    if (context.url) {
      res.writeHead(301, {
        Location: context.url
      })
      res.end()
    } else {
      res.write(`
        <!doctype html>
        <div id="app">${html}</div>
      `)
      res.end()
    }
  })
});

const httpServer = app.listen(PORT, () => {
  console.log(`Listening at ${PORT}`);
});

module.exports = httpServer;
