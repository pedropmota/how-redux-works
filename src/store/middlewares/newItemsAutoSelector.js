import { takeEvery, select, put } from "redux-saga/effects";
import { ADD_REDUCER, addAction, editReducer, setSelectedAction, setSelectedReducer, ADD_ACTION } from "../../actions";


/**
 * When a new action or reducer is created, this middleware will automatically set it as selected.
 */
export const newItemsAutoSelector = function*() {
  yield [
      takeEvery(ADD_ACTION, setActionAsSelected),
      takeEvery(ADD_REDUCER, setReducerAsSelected)
  ]
}

function* setActionAsSelected(action) {
  const actionAdded = yield select(store => store.actions[store.actions.length - 1])
  yield put(setSelectedAction(actionAdded.id))
}

function* setReducerAsSelected(action) {
  const reducerAdded = yield select(store => store.reducers[store.reducers.length - 1])
  yield put(setSelectedReducer(reducerAdded.id))
}