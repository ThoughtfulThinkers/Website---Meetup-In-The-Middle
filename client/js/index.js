import 'babel-polyfill';
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router, browserHistory } from 'react-router'

import store from './store'
import routes from './routes'


console.log(`Client running in ${process.env.NODE_ENV} mode`);

ReactDOM.render(
  <Provider store={store} >
    <Router history={browserHistory} routes={routes} />
  </Provider>,
  document.getElementById('app')
)
