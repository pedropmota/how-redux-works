import React from "react";
import AceEditor from "react-ace"
import 'brace/mode/javascript';
import 'brace/theme/monokai'

const BaseCodeEditor = ({ name, value, onChange, isReadOnly, ...props }) => 
  <AceEditor
    mode="javascript"
    theme="monokai"
    name={name}
    onChange={onChange} //function param: onChange(newValue, event)
    fontSize={14}
    minLines={8}
    //maxLines={200}
    //height={'100%'}
    width={'100%'}
    style={{ display: 'flex', flexGrow: 1, flexPosition: 'column', ...props.style }}
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
    {...props}/>
  
    
export default BaseCodeEditor;
