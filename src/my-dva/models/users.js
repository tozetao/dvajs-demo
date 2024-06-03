export default {
  namespace: 'users',
  state: {
    list: []
  },
  reducers: {
    add(state, action) {
      return {
        list: [...state.list, action.payload]
      }
    }
  }
}