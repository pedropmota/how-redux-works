import * as acorn from "acorn";
import Case from "case";

/**
 * Evaluates the reducer function definition, by also considering its action definitions.
 * Returns a regular Js function with the reducer (+actions) code.
 * (Throws an error if reducer code can't be evaluated.)
 * @param {string} reducer 
 * @param {Action[]} actionsInReducer 
 */
export function evaluateReducer(reducerDefinition, actionsInReducer) {

  reducerDefinition = tryAttachingActionDefinitions(reducerDefinition, actionsInReducer)

  //Inserts the action definition inside the reducer's body, to evaluate the action types
  const reducerFunction = (new Function(
    `return ${reducerDefinition.trim()}`
  ))()

  //Runs the function to test it out (or throws exception):
  reducerFunction.call(null, null, { type: null })

  return reducerFunction;
}



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
    return error.message;
  }

  return null;
}



export function parseReducer(reducerString, actionsInReducer) {

  reducerString = tryAttachingActionDefinitions(reducerString, actionsInReducer);

  const script = acorn.parse(reducerString.trim(), { ecmaVersion: 9 });

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


export function getAutoDefinition(name, actions) {
  if (!name)
    return '';

  return `
function ${Case.camel(name)}(state = [], action) {
switch (action.type) {
  ${actions.map(action =>
  `case ${Case.constant(action.name)}:
    //(modify it here to return a "reduced" (modified) version of the state, to fulfil the action:
    return [...state]
  
  `).join('')}
  default:
    return state;
}
}`.trim()

}


function tryAttachingActionDefinitions(reducerString, actions) {
  try {
    const actionDefinitions = actions ? actions.map(a => a.definition).join('') : null

    const script = acorn.parse(reducerString.trim(), { ecmaVersion: 9 });

    const isValidReducer = script.body.length === 1 && script.body[0].type === 'FunctionDeclaration';

    if (!actionDefinitions || !isValidReducer) 
      return reducerString;

    const bodyStartIndex = reducerString.indexOf('{') + 1;
    
    //Inserts the action definition inside the reducer's body, to evaluate the action types
    reducerString = `${reducerString.slice(0, bodyStartIndex)}
                      ${actionDefinitions}
                      ${reducerString.slice(bodyStartIndex)}`;

  } finally {
    return reducerString;
  }
}