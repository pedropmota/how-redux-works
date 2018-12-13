import { SET_SELECTED_ACTION, SET_SELECTED_REDUCER } from "../actions";


export function selectedItems(state = {}, action) {
  switch (action.type) {
    case SET_SELECTED_ACTION:
      return {...state, action: action.id }
    
    case SET_SELECTED_REDUCER:
      return {...state, reducer: action.id }
    
    default:
      return state
  }
}