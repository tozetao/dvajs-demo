import dva from 'dva';
import App from './App';

import counter from './models/counter'

import { createBrowserHistory } from 'history'

// const logger = store => next => action => {
//   console.log('before state: %o', store.getState())
//   next(action)
//   console.log('after state: %o', store.getState())
// }

const app = dva({
  history: createBrowserHistory(),
  onEffect(oldEffect, saga, store, actionType) {
    return function *(action) {
      console.log('before yield')
      yield oldEffect(action)
      console.log('after yield')
    }
  }
})

// 在启动之前定义模型。
app.model(counter)

app.model({
  namespace: 'users',
  state: {
    list: [],
    total: 0
  }
})

app.router(App)

app.start('#root')

// ReactDOM.render(<App />, document.getElementById('root'));