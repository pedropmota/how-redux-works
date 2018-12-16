import { select, put, takeEvery } from "redux-saga/effects";
import { ADD_ACTION, EDIT_ACTION, DELETE_ACTION, ADD_REDUCER, EDIT_REDUCER, revalidateReducers } from "../../actions";


/**
 * TODO:
 * If decided to move actions away from reducers, this middleware will need refactoring.
 * And it'll probably be best to have all reducers' validations coming from here.
 */


export const reducerRevalidator = function* () {
  yield [
    takeEvery(EDIT_ACTION, runRevalidateReducers),
    takeEvery(DELETE_ACTION, runRevalidateReducers)
  ]
}

function* runRevalidateReducers(action) {
  const affectedActionId = action.id;
  const allActions = yield select(store => store.actions)

  yield put(revalidateReducers(affectedActionId, allActions))
}






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