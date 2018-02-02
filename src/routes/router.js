import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Loadable from 'react-loadable'

const Loading = () => <h1>Loading....</h1>

const Index = Loadable({
  loader: () => import('./Index'),
  loading: Loading
})

const UserHome = Loadable({
  loader: () => import('./UserHome'),
  loading: Loading
})

const Router = () => (
  <Switch>
    <Route exact path={'/'} component={Index} />
    <Route exact path={'/user/home'} component={UserHome} />
  </Switch>
)

export default Router