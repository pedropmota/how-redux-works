import React from 'react';
import PropTypes from 'prop-types';
import './JsonView.scss';

const specialCharClass = 'special-character'

const JsonView = function({ json }) {

  if (!json)
    return null;

  const formattedJsonString = replaceSpecialCharsWithSpans(json, ['{', '}', '[', ']', ':'])

  return (
    <pre
      className="JsonView-container"
      dangerouslySetInnerHTML={{ __html: formattedJsonString }}>
    </pre>
  )


  function replaceSpecialCharsWithSpans(json, specialChars) {
    let newJson = json;
    specialChars.forEach(char => {
      newJson = newJson.split(char).join(renderSpecialChar(char)) 
    })
    return newJson;
  }

  function renderSpecialChar(char) {
    return `<span class="${specialCharClass}">${char}</span>`
  }

}

JsonView.propTypes = {
  json: PropTypes.string
}

export default JsonView;


// const PADDING_LEFT = '5px';

// export default function JsonView({ json }) {
//   return renderItem(json, true)


//   function renderItem(current, isRoot = false) {
//     const padding = PADDING_LEFT//isRoot ? PADDING_LEFT : 0;

//     return (
//       <>  
//         {
//           Array.isArray(current) ? 
//             <>
//               <span>{`[`}</span>
//               <div style={{ paddingLeft: padding }}>
//                 {renderArrayItems(current)}
//               </div>
//               <span>{`]`}</span>
//             </> :

//           typeof current === 'object' ?
//             <>
//               <span>{`{`}</span>
//               <div style={{ paddingLeft: padding }}>
//                 {renderObjectValues(current) }
//               </div>
//               <span>{`}`}</span>
//             </>
//             :

//             <>
//               {renderPropertyValue(current)}
//             </>
            
//         }    
//       </>
//     )
//   }

//   function renderObjectValues(object) {
//     return Object.keys(object).map((key, i) => 
//       <React.Fragment key={i}>
//         <span>"{key}"</span>
//         <span>:&nbsp;</span>
//         <span>{renderItem(object[key])}</span>
//       </React.Fragment>)
//   }

//   function renderArrayItems(array) {
//     return array.map((item, i) =>
//       <React.Fragment key={i}>
//         <span>{i}</span>
//         <span>:&nbsp;</span>
//         <span>{renderItem(item)}</span>
//       </React.Fragment>
//     )
//   }

//   function renderPropertyValue(value) {
//     const isString = typeof(value) === 'string'

//     return (
//       <span>
//         {isString ? '"' : null}
//         {value}
//         {isString ? '"' : null}
//       </span>
//     )
//   }
// }