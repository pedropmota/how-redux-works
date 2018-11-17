/**
 * action types
 */

export const ADD_ACTION = 'ADD_ACTION'
export const EDIT_ACTION = 'EDIT_ACTION'
export const DELETE_ACTION = 'DELETE_ACTION'

export const ADD_REDUCER = 'ADD_REDUCER'
export const EDIT_REDUCER = 'EDIT_REDUCER'
export const DELETE_REDUCER = 'DELETE_REDUCER'

export const UPDATE_STORE = 'UPDATE_STORE'
export const DISPATCH_ACTION = 'DISPATCH_ACTION'

/**
 * action creators
 */

export function addAction(name, definition) {
  return { type: ADD_ACTION, name, definition }
}

export function editAction(id, name, definition) {
  return { type: EDIT_ACTION, id, name, definition }
}

export function deleteAction(id) {
  return { type: DELETE_ACTION, id }
}



export function addReducer(name, definition, actions) {
  return { type: ADD_REDUCER, name, definition, actions }
}

export function editReducer(id, name, definition) {
  return { type: EDIT_REDUCER, id, name, definition }
}

export function deleteReducer(id) {
  return { type: DELETE_REDUCER, id }
}

export function updateStore(reducers, actions) {
  return { type: UPDATE_STORE, reducers, actions }
}


export function dispatchAction(input, currentActions) {
  return { type: DISPATCH_ACTION, input, currentActions }
}