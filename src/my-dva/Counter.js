import React from 'react'
import { useRef } from 'react';
import { connect } from './lib/index';

export function Counter(props) {
  const numberRef = useRef()

  return (
    <div>
      <h3>{ props.number }</h3>
      <div>
        <button onClick={() => {
          props.onIncrease()
        }}>+</button>
        <button onClick={() => {
          props.onDecrease()
        }}>-</button>
        <button onClick={() => {
          props.onAsyncIncrease()
        }}>AsyncIncrease</button>
      </div>
      <div>
        <input type="number" ref={numberRef} />
        <button onClick={() => {
          props.onAdd(numberRef.current.value)
        }}>Click</button>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  number: state.counter
})

const mapDispatchToProps = dispatch => ({
  onIncrease() {
    dispatch({
      type: 'counter/increase'
    })
  },
  onDecrease() {
    dispatch({
      type: 'counter/decrease'
    })
  },
  onAdd(value) {
    dispatch({
      type: 'counter/add',
      payload: value
    })
  },
  onAsyncIncrease() {
    dispatch({
      type: 'counter/asyncIncrease'
    })
  } 
})

export default connect(mapStateToProps, mapDispatchToProps)(Counter)
