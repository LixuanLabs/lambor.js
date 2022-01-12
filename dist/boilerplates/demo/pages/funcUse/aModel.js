module.exports = {
    namespace: 'index',
    state: {
        test: 1
    },
    reducers: {
        updateReducer(state, {payload}) {
            return {
                ...state,
                ...payload
            }
        }
    }
}