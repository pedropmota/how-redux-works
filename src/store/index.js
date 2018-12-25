import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from "redux-saga";
import reducers from '../reducers';
import { userStoreUpdater } from "./middlewares/userStoreUpdater";
import { reducerValidator } from "./middlewares/reducerValidator";
import { predefinedItemsAutoFiller } from './middlewares/predefinedItemsAutoFiller';
import { newItemsAutoSelector } from './middlewares/newItemsAutoSelector';
import { getStoredState, storeState } from "./storeStorage";



const sagaMiddleware = createSagaMiddleware();

const storedState = getStoredState();

const actionLogger = store => next => action => {
  console.log('Running action: ', action.type, action)
  return next(action);
}


const middlewares = applyMiddleware(sagaMiddleware, actionLogger);

const store = storedState ?
  createStore(reducers, storedState, middlewares) :
  createStore(reducers, middlewares);

//sagaMiddleware.run(newItemsAutoSelector)
sagaMiddleware.run(predefinedItemsAutoFiller)
sagaMiddleware.run(reducerValidator)
sagaMiddleware.run(userStoreUpdater)

const unsubscribe = store.subscribe((info) => {
  const state = store.getState();
  console.log(`Current state:`, state)

  if (state)
    storeState(state);

  const userStore = state.store ? state.store.userStore : null;
  console.log(`User's store:`, userStore ? userStore.getState() : null)
})

console.log(`Initial state:`, store.getState())

//store.dispatch(addReducer('Add Character', ['name', 'powerLevel']))
//store.dispatch(addReducer('Add NPC', ['name', 'job']))

//unsubscribe();


export default store;