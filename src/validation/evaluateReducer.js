/**
 * Evaluates the reducer function definition, by also considering its action definitions.
 * Returns a regular Js function with the reducer (+actions) code.
 * (Throws an error if reducer code can't be evaluated.)
 * @param {string} reducer 
 * @param {Action[]} actionsInReducer 
 */
export function evaluateReducer(reducerDefinition, actionsInReducer) {

  const bodyStartIndex = reducerDefinition.indexOf('{') + 1

  //Inserts the action definition inside the reducer's body, to evaluate the action types
  const reducerFunction = (new Function(
    ` return ${reducerDefinition.slice(0, bodyStartIndex)}
      ${actionsInReducer.map(a => a.definition).join('')}
      ${reducerDefinition.slice(bodyStartIndex)}
      `
  ))()

  //Runs the function to test it out:
  reducerFunction.call(null, null, { type: null })

  return reducerFunction;
}
