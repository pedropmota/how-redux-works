import { createStore, combineReducers } from "redux";
import { UPDATE_STORE, DISPATCH_ACTION } from "../actions";

export function store(state = null, action) {

  switch(action.type) {
    case UPDATE_STORE:
      
      const reducers = evalateUserReducers(action.reducers, action.actions)

      if (!reducers)
        return state;
      
      if (!state)
        return { 
          ...state,
          store: createStore(reducers)
        }

      //TODO Validate if reducers have changed

      return { 
        ...state,
        store: createStore(reducers)
      }
      
      //TODO The immutable logic to create new store every time needs to run all actions previously executed, to maintain state.
      //Or, we can maintain the history of the user's state in the state, in a separate prop.

    case DISPATCH_ACTION:
      
      if (!state || !state.store)
        throw Error(`Action cannot be dispatched if the store's store is null`)
      
      const evaluatedInput = evaluateDispatchInput(action.input, action.currentActions)

      state.store.dispatch(evaluatedInput);

      return {
        ...state,
        dispatchedActions: [...(state.dispatchedActions || []), evaluatedInput]
      }

    default:
      return state;
  }


}


function evalateUserReducers(reducers, actions) {
  if (!reducers || !reducers.length || !actions)
    return null;
  
  //Reducers need to keep a reference of each action used. Look at normalizr first.
  
  
  //TODO Add reducer eval errors to store, if any:

  const userReducers = reducers.map(reducer => {

    const actionDefinitions = actions.filter(a => reducer.actions.includes(a.id)).map(a => a.definition).join('');

    const bodyStartIndex = reducer.definition.indexOf('{') + 1;

    //Inserts the action definition inside the reducer's body, to evaluate the action types
    const reducerFunction = (new Function(
      ` return ${reducer.definition.slice(0, bodyStartIndex)}
        ${actionDefinitions}
        ${reducer.definition.slice(bodyStartIndex)}
       `
    ))()

    return {
      name: reducerFunction.name,
      func: reducerFunction
    };
  }).reduce((aggregator, item, i) => {
    aggregator[item.name] = item.func
    return aggregator;
  }, {});
  
  return combineReducers(userReducers)
}

function evaluateDispatchInput(inputString, actions) {
  const actionDefinitions = actions.map(a => a.definition).join('');

  const evaluatedInput = eval(`${actionDefinitions} \n${inputString}`)

  return evaluatedInput;
}



/*

//What I have:

"const PEDRO = 'PEDRO'

function pedro(param1, param2) {
  return { type: PEDRO, param1, param2 }
}"


"function test(state = [], action) {
  switch (action.type) {
    case PEDRO:
      //(modify it here to return a "reduced" (modified) version of the state, to fulfil the action:
      return [...state]
    
    
    default:
      return state;
  }
}"

//What I need:

"function test(state = [], action) {

  //___From actions: _____
  const PEDRO = 'PEDRO'

  function pedro(param1, param2) {
    return { type: PEDRO, param1, param2 }
  }
  //________

  switch (action.type) {
    case PEDRO:
      //(modify it here to return a "reduced" (modified) version of the state, to fulfil the action:
      return [...state]
    
    
    default:
      return state;
  }
}"





*/