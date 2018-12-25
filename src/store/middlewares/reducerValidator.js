import { select, put, takeEvery } from "redux-saga/effects";
import { ADD_ACTION, EDIT_ACTION, DELETE_ACTION, ADD_REDUCER, EDIT_REDUCER, revalidateReducers, validateAllReducers, validateReducer, DELETE_REDUCER } from "../../actions";


export const reducerValidator = function* () {
  yield [
    takeEvery(ADD_ACTION, runValidateAllReducers),
    takeEvery(EDIT_ACTION, runValidateAllReducers),
    takeEvery(DELETE_ACTION, runValidateAllReducers),
    
    takeEvery(ADD_REDUCER, runValidateNewReducer),
    takeEvery(EDIT_REDUCER, runValidateCurrentReducer),
    takeEvery(DELETE_REDUCER, runValidateAllReducers)
  ]
}

function* runValidateNewReducer(action) {
  const newReducer = yield select(store => store.reducers[store.reducers.length - 1])
  const allActions = yield select(store => store.actions)
  yield put(validateReducer(newReducer.id, allActions))
}

function* runValidateCurrentReducer(action) {
  const allActions = yield select(store => store.actions)
  yield put(validateReducer(action.id, allActions))
}

function* runValidateAllReducers(action) {
  const allActions = yield select(store => store.actions)
  yield put(validateAllReducers(allActions))
}

// function* runRevalidateReducers(action) {
//   const affectedActionId = action.id;
//   const allActions = yield select(store => store.actions)

//   yield put(revalidateReducers(affectedActionId, allActions))
// }






// export const entityValidatorMiddlewareOld = store => next => action => {

//   let result = next(action)

//   const state = store.getState();
  
//   switch (action.type) {

//     case ADD_ACTION: {
//       const newAction = state.actions[state.actions.length - 1]
//       updateActionError(store, newAction)

//       break;
//     }

//     case EDIT_ACTION:
//     case DELETE_ACTION: {
//       const updatedAction = state.actions.filter(a => a.id === action.id)[0];

//       if (action.type === EDIT_ACTION) {
//         updateActionError(store, updatedAction)
//       }

//       const reducersAffected = state.reducers.filter(r => r.actions.some(a => a.id === action.id))

//       reducersAffected.forEach(reducer => {
//         updateReducerError(store, reducer)
//       })
    
//       break;
//     }
      
//     case ADD_REDUCER: {
//       const newReducer = store.reducers[state.reducers.length -1]
//       updateReducerError(store, newReducer)

//       break;
//     }

//     case EDIT_REDUCER: {
//       const updatedReducer = state.reducers.filter(r => r.id === action.id)[0];
//       updateReducerError(store, updatedReducer)

//       break;
//     }
    
//   }

//   return result;
// }