import React from 'react'
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';

import { createHashHistory } from 'history';

import createSagaMiddleware  from 'redux-saga';
import * as sagaEffects from './saga';

import { connectRouter, routerMiddleware } from 'connected-react-router'

export default function(opts = {}) {
  let sagaMiddleware = null

  const app = {
    model,
    router,
    start,
    _models: [],
    _routerFn: null
  }

  opts = getOptions(opts)

  return app

  function getOptions(opts = {}) {
    const defaultOptions = {
      history: createHashHistory(),
      initialState: {},
      onReducer: reducer => (state, action) => {
        return reducer(state, action)
      },
      ...opts,
    }
    
    return defaultOptions
  }

  /**
   * 添加model
   */
  function model(obj) {
    app._models.push(obj)
  }

  // 设置创建路由组件的函数。
  function router(fn) {
    app._routerFn = fn
  }

  function start(selector) {
    render(selector)
  }

  /*
    {
      counter: counterReducer,
      users: usersReducer
    }
  */
  function getStore() {
    // 根据model创建reducer
    let rootReducers = {}
    for (const model of app._models) {
      const modelReducer = getModelReducer(model)
      rootReducers[modelReducer.name] = modelReducer.reducer
    }
    rootReducers = combineReducers({
      ...rootReducers,
      ...getExtraReducers()
    })

    rootReducers = opts.onReducer(rootReducers)

    return createStore(
      rootReducers,
      opts.initialState,
      getMiddlewares()
    )
  }

  function getMiddlewares() {
    sagaMiddleware = createSagaMiddleware()
    
    return applyMiddleware(routerMiddleware(opts.history), sagaMiddleware)
  }

  function getExtraReducers() {
    return {
      router: connectRouter(opts.history),
      // eslint-disable-next-line
      ['@@dva'](state = 0, action) {
        return state
      }
    }
  }

  function getModelReducer(model) {
    const actionHandlers = []
    for (const actionName of Object.keys(model.reducers)) {
      actionHandlers.push({
        type: `${model.namespace}/${actionName}`,
        handle: model.reducers[actionName]
      })
    }

    return {
      name: model.namespace,
      reducer: (state = model.state, action) => {
        // console.log('触发reducer')
        const actionHandler = actionHandlers.find(item => (item.type === action.type))
        if (actionHandler) {
          return actionHandler.handle(state, action)
        }
        return state
      }
    }
  }

  function getNewAction(model, action) {
    if (action.type.indexOf('/') === -1) {
      return {
        ...action,
        type: `${model.namespace}/${action.type}`
      }
    }
    return action
  }

  // 运行saga中间件
  function runSaga() {
    // 1. 获取所有model要监听的effect action

    const effectActions = []
    for (const model of app._models) {
      if (model.effects) {
        let put = (action) => {
          action = getNewAction(model, action)
          return sagaEffects.put(action)
        }

        for (const actionName of Object.keys(model.effects)) {
          effectActions.push({
            type: `${model.namespace}/${actionName}`,
            generateFn: model.effects[actionName],
            put,
            model
          })
        }
      }
    }

    let rootSaga = function*() {
      // 2. 遍历所有的effect action  
      for (const effectAction of effectActions) {
        let fn = function*(action) {
          yield effectAction.generateFn(action, {...sagaEffects, put: effectAction.put})
        }

        // let newFn = opts.onEffect ? opts.onEffect(fn, sagaMiddleware, effectAction.model, effectAction.type) : fn
        if (opts.onEffect) {
          fn = opts.onEffect(fn, sagaEffects, effectAction.model, effectAction.type)
        }

        yield sagaEffects.takeEvery(effectAction.type, fn)
      }
    }
    
    sagaMiddleware.run(rootSaga)
  }

  function runSubscriptions(dispatch) {
    for (const model of app._models) {
      if (model.subscriptions) {
        const newDispatch = (action) => {
          action = getNewAction(model, action)
          dispatch(action)
        }

        for (const attribute in model.subscriptions) {
          const fn = model.subscriptions[attribute]
          fn({
            dispatch: newDispatch,
            history: opts.history
          })
        }
      }
    }
  }

  function render(selector) {
    const routerConfig = app._routerFn({
      history: opts.history
    })
    
    const store = getStore()
    
    runSaga()

    runSubscriptions(store.dispatch, opts.history)

    window.store = store

    ReactDOM.render(<Provider store={store}>
      {routerConfig}
    </Provider>, document.querySelector(selector))
  }
}