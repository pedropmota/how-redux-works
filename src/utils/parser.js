import * as esprima from 'esprima'


export const parseAction = function(actionString) {

  try {

    const script = esprima.parseScript(actionString);

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
  

  } catch(e) {

    throw new Error(`Line ${e.lineNumber}: ${e.description}`)

  }

}



export const parseReducer = function(reducerString, actionDefinitionStrings) {

  try {

    const script = esprima.parseScript(reducerString);

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
  

  } catch(e) {

    throw new Error(`Line ${e.lineNumber}: ${e.description}`)

  }

}
