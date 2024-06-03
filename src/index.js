import dva from './my-dva/lib/dva';
import App from './my-dva/App';

import counter from './my-dva/models/counter';
import users from './my-dva/models/users';

import { createBrowserHistory } from 'history'

const app = dva({
  history: createBrowserHistory(),
  // initialState: {
  //   counter: 100
  // },
  // model的effect action出错时的处理。
  onError(error, dispatch) {
    console.log(error, dispatch)
  },
  // 附加中间件，值可以是一个中间件或者中间件数组。
  onAction() {},
  // 当reducer改变state时进行的处理。
  onStateChange(state) {},
  onReducer(reducer) {
    return (state, action) => {
      return reducer(state, action)
    }
  },
  // 可以对所有model的effect action进行再次封装。
  onEffect(effect, sagaEffects, model, actionType) {
    return function*(action) {
      yield effect(action)
    }
  }
})

app.model(counter)
app.model(users)

app.router(App)

app.start('#root')

// compose函数的组合
// const extraReducers = [
//   function(createStore) {
//     return function(...args) {
//       return createStore(...args)
//     }
//   },
//   function(createStore) {
//     return function(...args) {
//       return createStore(...args)
//     }
//   }
// ]
// const createStore = function() {}

// extraReducers.reduce((fn1, fn2) => {
//   return fn2(fn1)
// }, createStore)