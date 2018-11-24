import React from "react";
import AceEditor from "react-ace"

const BaseCodeEditor = ({ name, value, onChange, isReadOnly, style }) => 
  <div style={{ height: '300px' }}>
    <AceEditor
      mode="javascript"
      theme="monokai"
      name={name}
      onChange={onChange} //function param: onChange(newValue, event)
      fontSize={14}
      height="100%"
      showPrintMargin={true}
      showGutter={!isReadOnly}
      highlightActiveLine={true}
      value={value}
      readOnly={isReadOnly}
      setOptions={{
        enableBasicAutocompletion: false,
        enableLiveAutocompletion: false,
        enableSnippets: false,
        showLineNumbers: true,
        tabSize: 2
      }}
      onLoad={ editor => {
        editor.session.$worker.send('changeOptions', [{ asi: true }]) //Allows no semicolon 
        editor.$blockScrolling = Infinity 
      }}/>
  </div>
    
export default BaseCodeEditor;
