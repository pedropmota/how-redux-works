import * as acorn from "acorn";
import Case from 'case';

/**
 * Validates an action, returning an error message if any, or null if there's no error
 * @param {String} actionDefinition
 */
export function validateAction(actionDefinition) {

  if (!actionDefinition)
    return `Action definition can't be empty`

  try {
    parseAction(actionDefinition)
  } catch (error) {
    console.log('Error parsing action', error)
    return error.message;
  }

  return null;
}

/**
 * TODO: Try redux-thunk. What would I need to make it work?
 * 1: dispatch method is passing to the action creator. It allows actions to dispatch another actions.
 * (most likely not worth it)
 * @param {*} actionString 
 */
export function parseAction(actionString) {

  const script = acorn.parse(actionString)

  const functionDeclarations = script.body.filter(b => b.type === 'FunctionDeclaration')

  if (!functionDeclarations.length)
    throw new Error(`An action creator needs to consist of one main function declaration.`)

  if (functionDeclarations.length > 1)
    throw new Error(`The action creator needs to consist of only one main function declaration.`) 
}

export function parseAction_restrict(actionString) {

  const script = acorn.parse(actionString);

  if (script.body.length !== 2)
    throw new Error(`Let's make sure we have a constant declaration and the action function.`)

  const constantDeclaration = script.body[0];
  const functionDeclaration = script.body[1];

  if (constantDeclaration.type !== 'VariableDeclaration')
    throw new Error(`Let's make sure the first statement is a variable declaration for our constant.`)

  if (functionDeclaration.type !== 'FunctionDeclaration')
    throw new Error(`Check the second statement. Let's have it be a function declaration for our action.`)

  const lastFuncStatement = functionDeclaration.body.body.reverse()[0];
  
  if (lastFuncStatement.type !== 'ReturnStatement' || 
      !lastFuncStatement.argument ||
      lastFuncStatement.argument.type !== 'ObjectExpression')
    throw new Error(`The function needs to return an object as its last statement.`)

  if (!lastFuncStatement.argument.properties.some(p => p.key.name === 'type'))
    throw new Error(`The action needs to return an object with a 'type' property.`)

  return {
    name: functionDeclaration.id.name,
    params: functionDeclaration.params.map(p => p.name)
  }
}


/**
 * Returns an automatic "default" action creator, based on a name and params.
 * @param {string} name - The action creator name
 * @param {string[]} paramNames - List of parameters that the action creator receives
 */
export function getAutoDefinition(name, paramNames = ['param1', 'param2']) {
  if (!name)
    return '';

  const camelName = Case.camel(name);
  const constantName = Case.constant(name)
  const params = paramNames.join(', ')

  return `
const ${constantName} = '${constantName}'

function ${camelName}(${params}) {
  return { type: ${constantName}, ${params} }
}`
    .trim()

}