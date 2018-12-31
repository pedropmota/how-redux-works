import * as acorn from "acorn";
import Case from "case";

/**
 * Evaluates the reducer function definition, by also considering the valid action creator definitions.
 * Returns a regular Js function with the reducer (+actions) code.
 * (Throws an error if reducer code can't be evaluated.)
 * @param {string} reducer 
 * @param {Action[]} actions 
 */
export function evaluateReducer(reducerDefinition, actions) {
  const validActions = getValidActions(actions);

  reducerDefinition = tryAttachingActionDefinitions(reducerDefinition, validActions)

  //Inserts the action definition inside the reducer's body, to evaluate the action types
  const reducerFunction = (new Function(
    `return ${reducerDefinition.trim()}`
  ))()

  //Runs the function to test it out (or throws exception):
  reducerFunction.call(null, null, { type: null })

  return reducerFunction;
}



export function validateReducer(reducerDefinition, actions) {
  if (!reducerDefinition)
    return `Reducer definition can't be empty.`

  try {
    debugger;
    parseReducer(reducerDefinition, actions)

    evaluateReducer(reducerDefinition, actions)

  } catch (error) {
    console.log('Error parsing reducer', error)
    return error.message;
  }

  return null;
}



export function parseReducer(reducerString, actions) {

  const validActions = getValidActions(actions);

  
  reducerString = tryAttachingActionDefinitions(reducerString, validActions);

  const script = acorn.parse(reducerString.trim(), { ecmaVersion: 9 });

  if (script.body.length !== 1)
    throw new Error(`Keep your reducer definition as a single function statement.`)

  const reducer = script.body[0];

  if (reducer.type !== 'FunctionDeclaration')
    throw new Error(`Keep your reducer definition as a single function statement.`)

  if (reducer.params.length !== 2)
    throw new Error(`Your reducer function needs to receive two arguments: store and action`)
  
  //TODO: Validate actions?

  return {
    name: reducer.id.name,
    params: reducer.params.map(p => p.name)
  }

}


export function getAutoDefinition(name) {
  if (!name)
    return '';

  return `
function ${Case.camel(name)}(state = [], action) {
  switch (action.type) {
    //(Check your actions here, and return the new state based on each action.)

    default:
      return state;
  }
}`.trim()

}

/**
 * TODO: Unit tests!
 */
function tryAttachingActionDefinitions(reducerString, actions) {
  try {
    const actionDefinitions = actions ? actions.map(a => a.definition).join('') : null

    if (!actionDefinitions) 
      return reducerString

    const bodyStartIndex = getIndexOfFunctionBodyStart(reducerString)
    
    if (bodyStartIndex === -1)
      return reducerString

    //Inserts the action definition inside the reducer's body, to evaluate the action types
    reducerString = `${reducerString.slice(0, bodyStartIndex)}
                      ${actionDefinitions}
                      ${reducerString.slice(bodyStartIndex)}`;

  } finally {
    return reducerString;
  }  
}


function getValidActions(actions) {
  return actions.filter(a => !a.errorMessage)
}


/**
 * Finds the index of the body start of the function.
 * Searches by ")" followed by "{", which represents the end of param declaration and start of the function body.
 * Returns -1 if it's not a function declaration.
 * TODO: Unit tests!
 * @param {string} functionString 
 */
function getIndexOfFunctionBodyStart(functionString) {
  //Parses function and checks if it's a regular function declaration:
  try {
    const script = acorn.parse(functionString.trim(), { ecmaVersion: 9 });

    const isFunctionDeclaraction = script.body.length === 1 && script.body[0].type === 'FunctionDeclaration';

    if (!isFunctionDeclaraction)
      throw new Error()

  } catch {
    return -1;
  }


  //Iterates through the string, looking for a ')' followed by '{' (spaces between then is acceptable)

  let currentString = functionString;
  let indexOfCloseParantesys = 0;
  let bodyStartIsNext = false;

  while (!bodyStartIsNext && indexOfCloseParantesys !== -1) {
    let indexOfCloseParantesys = currentString.indexOf(')')

    let bodyStartIsNext = currentString.slice(indexOfCloseParantesys + 1).trim().startsWith('{');

    if (bodyStartIsNext) {
      return functionString.indexOf('{', indexOfCloseParantesys) + 1
    }

    currentString = currentString.slice(indexOfCloseParantesys)

  }

  return -1;
}

