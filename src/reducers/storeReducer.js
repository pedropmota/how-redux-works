import { createStore, combineReducers } from "redux";
import { UPDATE_STORE, DISPATCH_ACTION } from "../actions";
import { evaluateReducer, evaluateDispatch } from "../validation";


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
      
      const evaluatedInput = evaluateDispatch(action.input, action.currentActions)

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

  const validReducers = reducers.filter(r => !r.errorMessage)

  const evaluatedReducers = validReducers.map(reducer => {
    const actionsInReducer = actions.filter(a => reducer.actions.includes(a.id))
    try {
      return evaluateReducer(reducer.definition, actionsInReducer)
    } catch { }
  }).filter(r => r)

  if (!evaluatedReducers.length)
    return null;

  const reducersObject = evaluatedReducers.reduce((aggregator, func) => 
    ({...aggregator, [func.name]: func })
  , { })

  return combineReducers(reducersObject)
}

//   const userReducers = reducers.filter(reducer => !reducer.error).map(reducer => {

//     const actionsInReducer = actions.filter(a => reducer.actions.includes(a.id));
//     const actionDefinitions = actionsInReducer.map(a => a.definition).join('');

//     //TODO new Function needs to be evaluated safely (the reducer validation needs to be 100%)

//     const bodyStartIndex = reducer.definition.indexOf('{') + 1;
//     //Inserts the action definition inside the reducer's body, to evaluate the action types
//     const reducerFunction = (new Function(
//       ` return ${reducer.definition.slice(0, bodyStartIndex)}
//         ${actionDefinitions}
//         ${reducer.definition.slice(bodyStartIndex)}
//        `
//     ))()

//     return {
//       name: reducerFunction.name,
//       func: reducerFunction
//     };
//   }).reduce((aggregator, item, i) => {
//     aggregator[item.name] = item.func
//     return aggregator;
//   }, {});
  
//   return combineReducers(userReducers)
// }

