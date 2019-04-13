import React from "react";
import AceEditor from "react-ace"
import 'brace/mode/javascript';
import 'brace/theme/monokai'
import './BaseCodeEditor.scss'

const flexStyles = { display: 'flex', flexGrow: 1, flexDirection: 'column' }

const BaseCodeEditor = ({ name, value, onChange, isReadOnly, customJsonStyles = false, ...props }) => 
   <div 
    style={{...flexStyles, overflow: 'auto', position: 'relative' }}//backgroundColor: '#272822' }} 
    className={customJsonStyles ? 'custom-json-class' : ''}>
    
    <AceEditor
      mode="javascript"
      theme="monokai"
      name={name}
      onChange={onChange} //function param: onChange(newValue, event)
      fontSize={14}
      minLines={16}
      maxLines={Infinity}
      width="100%"
      style={{ position: 'absolute', top: 0 }}
      showPrintMargin={true}
      showGutter={!isReadOnly}
      highlightActiveLine={true}
      value={value || ''}
      readOnly={isReadOnly}
      setOptions={{
        enableBasicAutocompletion: false,
        enableLiveAutocompletion: false,
        enableSnippets: false,
        showLineNumbers: true,
        tabSize: 2
      }}
      onLoad={ editor => {
        editor.session.$worker && editor.session.$worker.send('changeOptions', [{ asi: true }]) //Allows no semicolon 
        editor.$blockScrolling = Infinity 
      }}
      {...props}
      />

   </div>


// const BaseCodeEditor = ({ value, name, onChange }) =>
//   <CodeMirror
//     name={name}
//     value={value}
//     onChange={onChange}
//     options={{
//       mode: 'javascript',
//     }} />
  
    
export default BaseCodeEditor;
