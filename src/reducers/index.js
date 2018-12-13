import { combineReducers } from 'redux';
import { actions } from './actionsReducer';
import { reducers } from './reducersReducer';
import { selectedItems } from './selectedItemsReducer';
import { store } from './storeReducer';

export default combineReducers({
  actions,
  reducers,
  selectedItems,
  store
})