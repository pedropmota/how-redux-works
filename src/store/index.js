import { createStore, applyMiddleware } from 'redux'
import reducers from '../reducers';
import { addReducer, editAction, deleteReducer, updateStore, UPDATE_STORE, DISPATCH_ACTION } from "../actions";

/**
 * The store is saved on the localStorage by version.
 */
const storeVersion = '1.1';
const storeKey = `current-store-v${storeVersion}`;

const getStoredState = () => {
  const value = localStorage.getItem(storeKey);
  return value ? JSON.parse(value) : null
}
const setStoredState = (state) => {
  const toStore = {
    actions: state.actions,
    reducers: state.reducers
  }

  localStorage.setItem(storeKey, JSON.stringify(toStore))
}



const storeUpdater = store => next => action => {
  //console.log('dispatching', action)
  let result = next(action)

  //If needed, change this to only update the store when specific actions are called:
  if (action.type !== UPDATE_STORE &&
      action.type !== DISPATCH_ACTION) {
    const userReducers = store.getState().reducers;
    const userActions = store.getState().actions;
    store.dispatch(updateStore(userReducers, userActions));
  }

  //console.log('next state', store.getState())
  return result
}


const storedState = getStoredState();

const store = storedState ?
  createStore(reducers, storedState, applyMiddleware(storeUpdater)) :
  createStore(reducers, applyMiddleware(storeUpdater));

const unsubscribe = store.subscribe(() => { 
  const state = store.getState();
  console.log(`Current state:`, state)

  if (state)
    setStoredState(state);


  const userStore = state.store && state.store.store ? state.store.store : null;
  console.log(`User's store:`, userStore ? userStore.getState() : null)
})

console.log(`Initial state:`, store.getState())

//store.dispatch(addReducer('Add Character', ['name', 'powerLevel']))
//store.dispatch(addReducer('Add NPC', ['name', 'job']))

//unsubscribe();


export default store;