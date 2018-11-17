import { ADD_REDUCER, EDIT_REDUCER, DELETE_REDUCER } from '../actions';
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
          actions: action.actions.map(a => a.id)
        }
      ]
    
    case EDIT_REDUCER: {
      return state.map((item) => { 
        if (item.id !== action.id)
          return item

        return {
          ...item,
          name: action.name,
          definition: action.definition,
          actions: action.actions.map(a => a.id)
        }
      })
    }

    case DELETE_REDUCER: {
      return state.filter((item) => item.id !== action.id)
    }

    default:
      return state;
  }


}