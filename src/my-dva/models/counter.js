export default {
  namespace: 'counter',
  state: 0,
  reducers: {
    increase(state) {
      console.log('increase')
      return state + 1
    },
    decrease(state) {
      return state - 1
    },
    add(state, action) {
      return state + Number(action.payload);
    }
  },
  effects: {
    * asyncIncrease(action, { call, put }) {
      console.log('asyncIncrease')
      yield call(delay, 2000)
      yield put({
        type: 'increase'
      })
    }
  },
  // 在dva启动时执行，近执行一次。
  subscriptions: {
    resize({ dispatch }) {
      window.onresize = () => {
        dispatch({
          type: 'increase'
        })
      }
    },
    routeChange({ history }) {
      history.listen((location, action) => {
        console.log(location)
        console.log(action)
      })
    }
  }
}

function delay(duration) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, duration) 
  })
}
