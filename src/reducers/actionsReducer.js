import { ADD_ACTION, EDIT_ACTION, DELETE_ACTION } from '../actions';
import { newUuid } from "../utils";

export function actions(state = [], action) {
  switch (action.type) {
    case ADD_ACTION:
      return [
        ...state,
        {
          id: newUuid(),
          name: action.name,
          definition: action.definition
        }
      ]
    
    case EDIT_ACTION: {
      return state.map((item) => { 
        if (item.id !== action.id)
          return item

        return {
          ...item,
          name: action.name,
          definition: action.definition
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