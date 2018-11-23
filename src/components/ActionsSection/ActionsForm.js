import React from "react";
import Case from 'case';

import BaseInputText from "../BaseInputText/BaseInputText";
import BaseCodeEditor from "../BaseCodeEditor/BaseCodeEditor";
import BaseButton from "../BaseButton/BaseButton";

//import { predefinedActions } from "../../constants/predefinedItems";



export default class ActionsForm extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      nameInput: '',
      definitionInput: '',
      selectedActionReference: null
    }

    this.handleSave = this.handleSave.bind(this)
    this.handleNameInputChange = this.handleNameInputChange.bind(this)
    this.handleDefinitionInputChange = this.handleDefinitionInputChange.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }
  
  static getDerivedStateFromProps(props, state) {
    
    if (state.selectedActionReference === props.selectedAction)
      return state;

    const { name, definition } = props.selectedAction || { }
    
    return {
      ...state,
      nameInput: name || '',
      definitionInput: definition || '',
      selectedActionReference: props.selectedAction
    }
  }



  getAutoDefinition(name) {
    if (!name)
      return '';

    const camelName = Case.camel(name);
    const constantName = Case.constant(name)
    
    return `
      const ${constantName} = '${constantName}'

      function ${camelName}(param1, param2) {
        return { type: ${constantName}, param1, param2 }
      }`
      .trim()

  }

  tryRefreshingDefinition(newName) {
    const currentDefinition = this.state.definitionInput;

    if (currentDefinition && currentDefinition !== this.getAutoDefinition(this.state.nameInput))
      return;

    this.setState({
      definitionInput: this.getAutoDefinition(newName)
    })
  }


  handleNameInputChange(e) {
    const value = e.target.value;

    this.tryRefreshingDefinition(value)

    this.setState({
      nameInput: value
    })
  }


  handleDefinitionInputChange(newValue) {
    this.setState({
      definitionInput: newValue
    })
  }


  handleSave() {
    const action = {
      name: this.state.nameInput,
      definition: this.state.definitionInput,
      id: this.props.selectedAction ? this.props.selectedAction.id : null
    }

    this.props.onSave(action);

    this.setState({
      nameInput: '',
      definitionInput: ''
    })
  }

  handleCancel() {
    this.props.onCancel()
  }


  render() {
    return (
      <div style={{ height: '300px' }}>
      
        <BaseInputText
          name="nameInput"
          value={this.state.nameInput}
          onChange={this.handleNameInputChange}
          placeholder={`Type your action name to auto-generate it`} />

        <BaseCodeEditor
          name="definitionInput"
          value={this.state.definitionInput}
          onChange={this.handleDefinitionInputChange} />

        <BaseButton
          text={this.props.selectedAction ? 'Save' : 'Add'}
          style={{}}
          onClick={this.handleSave} />

        {this.props.selectedAction ?
          <BaseButton
            text={'Cancel'}
            onClick={this.handleCancel} />
          : null
        }

        
      </div>
    )
  }


}