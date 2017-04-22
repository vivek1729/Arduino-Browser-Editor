import { createStore } from 'redux'
import codeReducer from './reducers'

const store = createStore(codeReducer)

export default store
