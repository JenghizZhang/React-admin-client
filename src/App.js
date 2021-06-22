import React, { Component, Fragment } from 'react'
import { Route, Switch } from 'react-router-dom'
import './App.less'
import Login from './pages/login/login'
import Admin from './pages/admin/admin'

export default class App extends Component {

  render() {
    return (
      <Fragment>
        <Switch>
          <Route path="/login" component={Login}></Route>
          <Route path="/" component={Admin}></Route>
        </Switch>
      </Fragment>
    )
  }
}
