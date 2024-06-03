export default {
  namespace: 'counter',
  state: 0,
  reducers: {
    increase(state) {
      return state + 1
    },
    decrease(state) {
      return state - 1
    },
    add(state, action) {
      console.log(state)
      console.log(action)
      return state + 10;
    }
  },
  effects: {
    * asyncIncrease(action, { call, put }) {
      yield call(delay, 2000)
      yield put({
        type: 'increase'
      })
    }
  }
  // subscriptions: {
  //   routeChange({ history }) {
  //     history.listen((location, action) => {
  //       console.log(location)
  //       console.log(action)
  //     })
  //   }
  // }
}

function delay(duration) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, duration) 
  })
}
