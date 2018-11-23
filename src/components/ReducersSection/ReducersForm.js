import React from "react";
import Case from 'case';

import BaseInputText from "../BaseInputText/BaseInputText";
import BaseCodeEditor from "../BaseCodeEditor/BaseCodeEditor";
import BaseButton from "../BaseButton/BaseButton";
import BaseDropdownMulti from "../BaseDropdownMulti/BaseDropdownMulti";
import BaseDropdownGrouped from "../BaseDropdownGrouped/BaseDropdownGrouped";

import { parseReducer } from "../../utils/parser";

import { predefinedReducers } from "../../constants/predefinedItems";



export default class ReducersForm extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      nameInput: '',
      definitionInput: '',
      selectedActions: [],
      selectedReducerReference: null
    }

    this.handleSave = this.handleSave.bind(this)
    this.handleNameInputChange = this.handleNameInputChange.bind(this)
    this.handleDefinitionInputChange = this.handleDefinitionInputChange.bind(this)
    this.handleActionsChange = this.handleActionsChange.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }
  
  static getDerivedStateFromProps(props, state) {
    
    if (state.selectedReducerReference === props.selectedReducer)
      return state;

    const { name, definition, actions } = props.selectedReducer || { }
    
    return {
      ...state,
      nameInput: name || '',
      definitionInput: definition || '',
      selectedActions: props.actions.filter(a => (actions || []).some(s => s === a.id)),
      selectedReducerReference: props.selectedReducer
    }
  }



  getAutoDefinition(name, actions) {
    if (!name)
      return '';

    return `
function ${Case.camel(name)}(state = [], action) {
  switch (action.type) {
    ${actions.map(action =>
    `case ${Case.constant(action.name)}:
      //(modify it here to return a "reduced" (modified) version of the state, to fulfil the action:
      return [...state]
    
    `).join('')}
    default:
      return state;
  }
}`.trim()

  }

  tryRefreshingDefinition(newName, newActions) {
    const currentDefinition = this.state.definitionInput;

    if (currentDefinition && currentDefinition !== this.getAutoDefinition(this.state.nameInput, this.state.selectedActions))
      return;

    this.setState({
      definitionInput: this.getAutoDefinition(newName, newActions)
    })
  }


  handleActionsChange(selectedItems) {
    const ids = selectedItems.map(i => i.value)
    const actions = this.props.actions.filter(a => ids.includes(a.id));

    this.tryRefreshingDefinition(this.state.nameInput, actions);

    this.setState({
      selectedActions: actions
    })
  }

  handleNameInputChange(e) {
    const value = e.target.value;

    this.tryRefreshingDefinition(value, this.state.selectedActions)

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
    //const test = parseReducer(this.state.definition, null);
    
    const reducer = {
      name: this.state.nameInput,
      definition: this.state.definitionInput,
      id: this.props.selectedReducer ? this.props.selectedReducer.id : null,
      actions: this.state.selectedActions
    }

    this.props.onSave(reducer);

    this.setState({
      nameInput: '',
      definitionInput: '',
      selectedActions: []
    })
  }

  handleCancel() {
    this.props.onCancel()
  }


  render() {
    const groupedOptions = [
      {
        label: 'Predefined Reducers',
        options: predefinedReducers.map(r => ({ label: r.entity, value: r.entity }))
      },
      {
        label: 'Add Your Own',
        options: [{ label: 'Add Your Own Reducers', value: '' }]
      }
    ]
    
    return (
      <div style={{ height: '300px' }}>
        

        {this.props.children}

        <BaseDropdownGrouped
          placeholder="Predefined Reducers"
          groupedOptions={groupedOptions}
          onChange={() => {}} />
          

        <BaseInputText
          name="nameInput"
          value={this.state.nameInput}
          onChange={this.handleNameInputChange}
          placeholder={`Reducer Name`} />

        <BaseDropdownMulti
          options={this.props.actions.map(a => ({ label: a.name, value: a.id }))}
          value={this.state.selectedActions.map(a => ({ value: a.id, label: a.name }))}
          onChange={this.handleActionsChange}
          placeholder="Pick some actions" />

        <BaseCodeEditor
          name="definitionInput"
          value={this.state.definitionInput}
          onChange={this.handleDefinitionInputChange} />

        <BaseButton
          text={this.props.selectedReducer ? 'Save' : 'Add'}
          style={{}}
          onClick={this.handleSave} />

        {this.props.selectedReducer ?
          <BaseButton
            text={'Cancel'}
            onClick={this.handleCancel} />
          : null
        }

        
      </div>
    )
  }


}