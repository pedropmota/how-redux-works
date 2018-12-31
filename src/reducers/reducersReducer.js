import { ADD_REDUCER, EDIT_REDUCER, DELETE_REDUCER, VALIDATE_REDUCER, VALIDATE_ALL_REDUCERS } from '../actions';
import { validateReducer } from "../utils/parsing/reducerParser";
import { newUuid } from "../utils/uuid";

export function reducers(state = [], action) {
  switch (action.type) {
    case ADD_REDUCER:
      return [
        ...state,
        {
          id: newUuid(),
          name: action.name,
          definition: action.definition
        }
      ]
    
    case EDIT_REDUCER: {
      return state.map(item => { 
        if (item.id !== action.id)
          return item

        return {
          ...item,
          name: action.name,
          definition: action.definition
        }
      })
    }

    case DELETE_REDUCER: {
      return state.filter((item) => item.id !== action.id)
    }

    case VALIDATE_REDUCER: {
      return state.map(item => {
        if (item.id !== action.id)
          return item

        return {
          ...item,
          errorMessage: validateReducer(item.definition, action.actions) || validateDuplicatedName(state, item)
        }
      })
    }

    case VALIDATE_ALL_REDUCERS: {
      return state.map(item => ({
        ...item,
        errorMessage: validateReducer(item.definition, action.actions) || validateDuplicatedName(state, item)
      }))
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
