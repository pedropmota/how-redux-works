import React from "react";
import AceEditor from "react-ace"
import Case from "case";

import BaseItemsList from "../BaseItemsList/BaseItemsList";
import { parseAction } from "../../utils/parser";

import 'brace/mode/javascript';
import 'brace/theme/monokai';

import "./BaseForm.scss";



const styles = {
  formInput: { display: 'block', margin: 'auto' }
}


//Create ActionForm component
export default class BaseForm extends React.Component {

  state = {
    id: null,
    name: '',
    definition: '',
    isEditingInternally: false
  }

  constructor(props) {
    super(props)
  }



  static getDerivedStateFromProps(props, state) {

    console.log('gettingState', props)

    if (state.isEditingInternally)// || (!props.isToEdit && !props.nameToEdit && !props.definitionToEdit))
      return state;

    return {
      ...state,
      id: props.idToEdit || '',
      name: props.nameToEdit || '',
      definition: props.definitionToEdit || '',
      isEditingInternally: false
    }
  }



  handleInputChange(e) {
    const inputName = e.target.name;
    const value = e.target.value;


    if(inputName === 'name') {
      if (!this.state.definition || 
           this.state.definition === this.props.getAutomaticDefinition(this.state.name)) {
        
        this.setState({
          definition: this.props.getAutomaticDefinition(value)
        })
      }
    }
console.log('input change', value)
    this.setState({
      [inputName]: value,
      isEditingInternally: true
    })

  }

  handleSave() {
    this.props.handleSave({
      name: this.state.name,
      definition: this.state.definition,
      id: this.state.id
    })

    this.setState({
      name: '',
      definition: '',
      id: null,
      isEditingInternally: false
    })
  }


  render() {
    return (
      <div style={{ height: '300px'}}>
        <input 
          type="text"
          style={styles.formInput}
          value={this.state.name}
          name="name"
          onChange={(e) => this.handleInputChange(e)}
          placeholder={this.props.namePlaceholder}
          />

        {/* <textarea
          type="text"
          style={{...styles.formInput, height: '100px', width: '200px'}}
          value={this.state.definition}
          name="definition"
          onChange={(e) => this.handleInputChange(e)}
          placeholder={this.props.definitionPlaceholder}
          ></textarea> */}

        <AceEditor
          mode="javascript"
          theme="monokai"
          name="definition"
          OnChange={e => this.handleInputChange(e)}
          fontSize={14}
          height="100%"
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
          value={this.state.definition}
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
        
        

        <button
          style={styles.formInput}
          onClick={() => this.handleSave()}
        >
          {this.state.id ? 'Save' : 'Add'}
        </button>
      </div>
    )
  }
}