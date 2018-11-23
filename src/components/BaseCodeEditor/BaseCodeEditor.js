import React from "react";
import AceEditor from "react-ace"

const BaseCodeEditor = ({ name, value, onChange, style }) => 
  <div style={{ height: '300px' }}>
    <AceEditor
      mode="javascript"
      theme="monokai"
      name={name}
      onChange={onChange} //function param: onChange(newValue, event)
      fontSize={14}
      height="100%"
      showPrintMargin={true}
      showGutter={true}
      highlightActiveLine={true}
      value={value}
      setOptions={{
        enableBasicAutocompletion: false,
        enableLiveAutocompletion: false,
        enableSnippets: false,
        showLineNumbers: true,
        tabSize: 2
      }}
      onLoad={ editor => {
        editor.session.$worker.send('changeOptions', [{ asi: true }]) //Allows no semicolon 
      }}/>
  </div>
    
export default BaseCodeEditor;
