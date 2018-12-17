import { takeEvery, select, put } from "redux-saga/effects";
import { ADD_REDUCER, addAction, editReducer } from "../../actions";
import { predefinedActions, predefinedReducers } from "../../constants/predefinedItems";


/**
 * When a predefined reducer is added as a new reducer, this middleware will
 * automatically add its actions to the list of actions, and then attach them to the reducer.
 */
export const predefinedItemsAutoFiller = function*() {
  yield takeEvery(ADD_REDUCER, runPredefinedItemsAutoFiller)
}

function* runPredefinedItemsAutoFiller(action) {
  const reducerAdded = yield select(store => store.reducers[store.reducers.length - 1])

  const predefinedReducerUsed = predefinedReducers
    .filter(r => r.name === reducerAdded.name && r.definition === reducerAdded.definition)[0]

  if (predefinedReducerUsed) {
    yield addActionsNeededByReducer(predefinedReducerUsed)

    //yield setActionsToReducer(reducerAdded, predefinedReducerUsed)
  }
}


function* addActionsNeededByReducer(predefinedReducer) {
  const currentActions = yield select(store => store.actions)

  const predefinedActionsOfReducer = predefinedActions.filter(a => predefinedReducer.actions.includes(a.name))

  const actionsNeeded = predefinedActionsOfReducer
    .filter(a => !currentActions.some(c => c.name === a.name && c.definition === a.definition))

  for (const action of actionsNeeded)
    yield put(addAction(action.name, action.definition))
}

function* setActionsToReducer(reducerAdded, predefinedReducer) {
  const actionsNeeded = yield select(state => state.actions
      .filter(a => predefinedReducer.actions.includes(a.name))
      .filter(distinctActions));

  if (!actionsNeeded.length)
    return

  yield put(editReducer(reducerAdded.id, reducerAdded.name, reducerAdded.definition, actionsNeeded))
}


function distinctActions(current, index, actions) {
  //(Distincts by prioritizing the last ones found)
  return actions.map(a => a.name).lastIndexOf(current.name) === index 
}

