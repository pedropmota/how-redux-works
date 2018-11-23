import * as acorn from "acorn";
import { evaluateReducer } from "./evaluateReducer";

export function validateReducer(reducerDefinition, actionsInReducer) {
  if (!reducerDefinition)
    return `Reducer definition can't be empty.`

  if (actionsInReducer.filter(a => a.errorMessage).length)
    return `There is an error in one of the reducer's actions.`

  try {
    
    parseReducer(reducerDefinition, actionsInReducer)

    evaluateReducer(reducerDefinition, actionsInReducer)

  } catch (error) {
    console.log('Error parsing reducer', error)
    debugger;
    return error.message;
  }

  return null;
}





function parseReducer(reducerString, actionsInReducer) {

  const actionDefinitions = actionsInReducer.map(a => a.definition).join('')

  if (actionDefinitions) {
    const bodyStartIndex = reducerString.indexOf('{') + 1;
    //Inserts the action definition inside the reducer's body, to evaluate the action types
    reducerString = `${reducerString.slice(0, bodyStartIndex)}
                     ${actionDefinitions}
                     ${reducerString.slice(bodyStartIndex)}`;
  }

  const script = acorn.parse(reducerString, { ecmaVersion: 9 });

  if (script.body.length !== 1)
    throw new Error(`Keep your reducer definition as a single function statement.`)

  const reducer = script.body[0];

  if (reducer.type !== 'FunctionDeclaration')
    throw new Error(`Keep your reducer definition as a single function statement.`)

  if (reducer.params.length !== 2)
    throw new Error(`Your reducer function needs to receive two arguments: store and action`)
  
  //TODO: Validate actions

  return {
    name: reducer.id.name,
    params: reducer.params.map(p => p.name)
  }

}
