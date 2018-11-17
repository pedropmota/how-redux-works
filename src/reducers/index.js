import { combineReducers } from 'redux';
import { actions } from './actionsReducer';
import { reducers } from './reducersReducer'
import { store } from './storeReducer';

export default combineReducers({
  actions,
  reducers,
  store
})