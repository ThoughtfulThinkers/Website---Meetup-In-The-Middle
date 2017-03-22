import React from 'react'
import { Route, IndexRoute } from 'react-router'
// import { BrowserRouter as Router } from 'react-router-dom';

//Route File Paths
import App from './components/app'
import Home from './components/home'

// export default (
//   <Route path="/" component={App} >
//     <IndexRoute component={Home} />
//   </ Route>
// )

export default (
  <Route exact path="/" component={App}>
    <IndexRoute component={Home} />
  </Route>
)
