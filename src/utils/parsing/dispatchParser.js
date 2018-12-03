
/**
 * Evaluates the dispatch input, by also considering all the action definitions.
 * Returns the object returned by the evaluation.
 * (Throws an error if eval fails.)
 * @param {string} inputString 
 * @param {Action[]} actions 
 */
export const evaluateDispatch = function (inputString, actions) {
  const actionDefinitions = (actions || []).filter(a => !a.errorMessage).map(a => a.definition).join('')
  
  return (new Function(
    `${actionDefinitions}
     return ${inputString.trim()}`
  )).call(null)

  //return eval(`${actionDefinitions} \n${inputString}`)
}