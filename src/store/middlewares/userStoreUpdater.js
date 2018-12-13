import { updateStore, ADD_ACTION, EDIT_ACTION, DELETE_ACTION, ADD_REDUCER, EDIT_REDUCER, DELETE_REDUCER, REVALIDATE_REDUCERS } from "../../actions";
import { takeEvery, put, select } from "redux-saga/effects";

export const userStoreUpdater = function* () {
  //Initial call, if data is pulled from localstorage on startup:
  yield runStoreUpdate();

  yield [
    takeEvery(ADD_ACTION, runStoreUpdate),
    takeEvery(EDIT_ACTION, runStoreUpdate),
    takeEvery(DELETE_ACTION, runStoreUpdate),

    takeEvery(ADD_REDUCER, runStoreUpdate),
    takeEvery(EDIT_REDUCER, runStoreUpdate),
    takeEvery(DELETE_REDUCER, runStoreUpdate),
    //takeEvery(REVALIDATE_REDUCERS, runStoreUpdate),
  ]
}

function* runStoreUpdate() {
  const { actions, reducers } = yield select(store => ({ 
    actions: store.actions, 
    reducers: store.reducers 
  }))

  yield put(updateStore(reducers, actions))

}