import React from "react";
import AceEditor from "react-ace"

export default BaseCodeEditor = ({ name, value, onChange, style }) => 
  <AceEditor
    mode="javascript"
    theme="monokai"
    name={name}
    OnChange={onChange}
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