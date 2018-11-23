import * as acorn from "acorn";

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



function parseAction(actionString) {

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