import { ADD_REDUCER, EDIT_REDUCER, DELETE_REDUCER, REVALIDATE_REDUCERS } from '../actions';
import { validateReducer } from "../parsing/reducerParser";
import { newUuid } from "../utils";

export function reducers(state = [], action) {
  switch (action.type) {
    case ADD_REDUCER:
      return [
        ...state,
        {
          id: newUuid(),
          name: action.name,
          definition: action.definition,
          actions: action.actions.map(a => a.id),
          errorMessage: validateReducer(action.definition, action.actions) || validateDuplicatedName(state, action)
        }
      ]
    
    case EDIT_REDUCER: {
      return state.map(item => { 
        if (item.id !== action.id)
          return item

        return {
          ...item,
          name: action.name,
          definition: action.definition,
          actions: action.actions.map(a => a.id),
          errorMessage: validateReducer(action.definition, action.actions) || validateDuplicatedName(state, action)
        }
      })
    }

    case DELETE_REDUCER: {
      return state.filter((item) => item.id !== action.id)
    }

    case REVALIDATE_REDUCERS: {
      return state.map(item => { 
        if (!item.actions.includes(action.affectedActionId))
          return item

        const reducerActions = action.allActions.filter(a => item.actions.includes(a.id))
        return {
          ...item,
          errorMessage: validateReducer(item.definition, reducerActions)
        }
      })
    }

    default:
      return state;
  }
}


export function validateDuplicatedName(allReducers, current) {
  if (allReducers.some(a => a.name === current.name && a.id !== current.id))
    return `Another reducer already has the same name`
  
  return null;
}
