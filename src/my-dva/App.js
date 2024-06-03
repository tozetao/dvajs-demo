import React from 'react'

import { routerRedux, Route, Switch, Link } from './lib/router'
import { connect } from './lib/index'

import Counter from './Counter';

function Home(props) {
  console.log(props)
  
  return (<div>
    <h3>Home Page.</h3>
    <div>

    </div>
  </div>)
}


const mapStateToProps = state => ({
  users: state.list
})
const HomeWrapper = connect(mapStateToProps)(Home)


export default function App(props) {
  return (
    <routerRedux.ConnectedRouter history={props.history}>
      <div>
        <div>
          <Link to="/home">
            Home
          </Link>
          <Link to="/counter" style={{
            marginLeft: '20px'
          }}>
            Counter
          </Link>
        </div>
        <div>
          <Switch>
            <Route path="/counter" component={Counter} />
            <Route path="/home" component={HomeWrapper} />
          </Switch>
        </div>
      </div>
    </routerRedux.ConnectedRouter>
  )
}
