import React from 'react'

import Counter from './Counter';

import { Route, NavLink, routerRedux, Switch } from 'dva/router'

function Home() {
  return (<div>
    Home Page.
  </div>)
}

function Layout() {
  return (<>
    <div>
      <NavLink to="/home">Home</NavLink>
      <NavLink to="/counter" style={{
        marginLeft: '10px'
      }}>Counter</NavLink>
    </div>
    <Switch>
      <Route path="/home" component={Home} />
      <Route path="/counter" component={Counter} />
    </Switch>
  </>)
}

export default function App(props) {
  // console.log('props: %o', props)

  return (
    <routerRedux.ConnectedRouter history={props.history}>
      <Layout />
    </routerRedux.ConnectedRouter>
  )
}
