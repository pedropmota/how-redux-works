//TODO: Test function-to-string in all browsers

export const predefinedReducers = [{ 
  entity: 'people',
  actions: ['addPerson', 'editPerson'],
  definition: `
function people(state = [], action) {
  switch (action.type) {
    case ADD_PERSON:
      return [...state, {
        firstName: action.firstName,
        lastName: action.lastName
      }]
    
    case EDIT_PERSON:
      return state.map((item, index) => { 
        if (index !== action.index)
          return item

        return {
          ...item,
          fistName: action.firstName,
          lastName: action.lastName
        }
      })

    default:
      return state;
  }
}`

}, {
  entity: 'devices',
  actions: ['addDevice', 'removeDevice'],
  definition: `
    function devices(state = [], action) {
      switch (action.type) {
        case ADD_DEVICE:
          return [...state, {
            name: action.name
          }]
        
        case REMOVE_DEVICE:
          return state.filter((item, index) => index !== action.index)

        default:
          return state;
      }
    }
 }`
}]