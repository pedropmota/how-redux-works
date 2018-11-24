import { ADD_ACTION, EDIT_ACTION, DELETE_ACTION, SET_ACTION_ERROR } from '../actions';
import { validateAction } from "../parsing/actionParser";
import { newUuid } from "../utils";

export function actions(state = [], action) {
  switch (action.type) {
    case ADD_ACTION:
      return [
        ...state,
        {
          id: newUuid(),
          name: action.name,
          definition: action.definition,
          errorMessage: validateAction(action.definition) || validateDuplicatedName(state, action)
        }
      ]
    
    case EDIT_ACTION: {
      return state.map(item => { 
        if (item.id !== action.id)
          return item

        return {
          ...item,
          name: action.name,
          definition: action.definition,
          errorMessage: validateAction(action.definition) || validateDuplicatedName(state, action)
        }
      })
    }

    case DELETE_ACTION: {
      return state.filter((item) => item.id !== action.id)
    }

    default:
      return state;
  }
}


export function validateDuplicatedName(allActions, current) {
  if (allActions.some(a => a.name === current.name && a.id !== current.id))
    return `Another action creator already has the same name`
  
  return null;
}
