import { createStore, applyMiddleware } from 'redux'
import reducers from '../reducers';
import { addReducer, editAction, deleteReducer, updateStore, UPDATE_STORE, DISPATCH_ACTION } from "../actions";



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



const store = createStore(reducers, applyMiddleware(storeUpdater));

const unsubscribe = store.subscribe(() => { 
  const state = store.getState();
  console.log(`Current state:`, state)
  const userStore = state.store && state.store.store ? state.store.store : null;
  console.log(`User's store:`, userStore ? userStore.getState() : null)
})

console.log(`Initial state:`, store.getState())

//store.dispatch(addReducer('Add Character', ['name', 'powerLevel']))
//store.dispatch(addReducer('Add NPC', ['name', 'job']))

//unsubscribe();


export default store;