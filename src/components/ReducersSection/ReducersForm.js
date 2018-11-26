import React from "react";
import Case from 'case';

import BaseInputText from "../BaseInputText/BaseInputText";
import BaseCodeEditor from "../BaseCodeEditor/BaseCodeEditor";
import BaseButton from "../BaseButton/BaseButton";
import BaseDropdownMulti from "../BaseDropdownMulti/BaseDropdownMulti";
import BaseDropdownGrouped from "../BaseDropdownGrouped/BaseDropdownGrouped";

import { parseReducer } from "../../utils/parser";

import { predefinedReducers, predefinedActions } from "../../constants/predefinedItems";



export default class ReducersForm extends React.Component {

  state = {
    nameInput: '',
    definitionInput: '',
    predefinedSelected: null,
    selectedActions: [],
    selectedReducerReference: null
  }

  constructor(props) {
    super(props);

    this.textInputRef = React.createRef()

    this.handleSave = this.handleSave.bind(this)
    this.handleNameInputChange = this.handleNameInputChange.bind(this)
    this.handleDefinitionInputChange = this.handleDefinitionInputChange.bind(this)
    this.handleActionsChange = this.handleActionsChange.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleClear = this.handleClear.bind(this)
    this.handleInputKeyPress = this.handleInputKeyPress.bind(this)
    this.handlePredefinedSelection = this.handlePredefinedSelection.bind(this)
  }
  
  static getDerivedStateFromProps(props, state) {

    if (state.selectedReducerReference === props.selectedReducer)
      return state;

    if (!props.selectedReducer)
      return { ...state, selectedReducerReference: null }

    const { name, definition, actions } = props.selectedReducer;
    
    return {
      ...state,
      nameInput: name,
      definitionInput: definition,
      selectedActions: props.actions.filter(a => actions.some(s => s === a.id)),
      selectedReducerReference: props.selectedReducer,
      predefinedSelected: null
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

  handleInputKeyPress(e) {
    if (e.key === 'Enter' && e.target.value)
      this.handleSave()
  }

  handleSave() {
    const reducer = {
      name: this.state.nameInput,
      definition: this.state.definitionInput,
      id: this.props.selectedReducer ? this.props.selectedReducer.id : null,
      actions: !this.state.predefinedSelected ? this.state.selectedActions : this.props.actions.filter(a => this.state.predefinedSelected.actions.includes(a.name))
    }

    this.props.onSave(reducer);

    this.handleClear();
  }

  handleCancel() {
    this.handleClear();
    this.props.onCancel()
  }

  handleClear() {
    this.setState({
      nameInput: '',
      definitionInput: '',
      selectedActions: [],
      predefinedSelected: null
    })
  }

  handlePredefinedSelection({ label, value }) {
    const selected = predefinedReducers.filter(a => a.name === value)[0]

    if (selected) {
      this.props.onCancel()
      this.props.onPredefinedSelected(selected)
    }

    this.setState((prevState, props) =>
      selected ? ({
        nameInput: selected.name,
        definitionInput: selected.definition,
        predefinedSelected: selected
      }) : ({
        predefinedSelected: null
      })
    )
    
    this.textInputRef.current.focus()
  }

  getHasInputChanges() {
    const { nameInput, definitionInput, selectedActions } = this.state;
    const { selectedReducer } = this.props;

    if (!selectedReducer)
      return nameInput || definitionInput || selectedActions.length;
    else
      return selectedReducer.name !== nameInput || 
             selectedReducer.definition !== definitionInput || 
             selectedReducer.actions.join('') !== selectedActions.join('')
  }



  render() {

    const { nameInput, definitionInput, selectedActions, predefinedSelected } = this.state 
    const hasChanges = this.getHasInputChanges();

    const groupedOptions = [{
      label: 'Predefined Reducers',
      options: predefinedReducers.map(r => ({ label: r.name, value: r.name }))
    },
    {
      label: 'Create your own',
      options: [{ label: 'Create your own reducers', value: '' }]
    }]
    
    const selectedActionsToDisplay = !predefinedSelected ? 
      selectedActions : 
      this.props.actions.filter(a => predefinedSelected.actions.includes(a.name))
    
    return (
      <fieldset className="form">
        <legend>{this.props.selectedReducer ? 'Edit your reducer' : 'Add new reducers'}</legend>

        <BaseDropdownGrouped
          value={predefinedSelected ? { label: predefinedSelected.name, value: predefinedSelected.name } : null}
          placeholder="Reducer examples"
          groupedOptions={groupedOptions}
          onChange={this.handlePredefinedSelection} />

        <input
          type="text"
          name="nameInput"
          ref={this.textInputRef}
          value={nameInput}
          onChange={this.handleNameInputChange}
          onKeyPress={this.handleInputKeyPress}
          placeholder={`Reducer Name`} />

        <BaseDropdownMulti
          options={this.props.actions.map(a => ({ label: a.name, value: a.id }))}
          value={selectedActionsToDisplay.map(a => ({ label: a.name, value: a.id }))}
          disabled={predefinedSelected ? true : false }
          onChange={this.handleActionsChange}
          placeholder="Pick some actions" />


        <BaseCodeEditor
          name="definitionInput"
          value={definitionInput}
          onChange={this.handleDefinitionInputChange} />

        <BaseButton
          text={this.props.selectedReducer ? 'Save' : 'Add'}
          disabled={!hasChanges}
          onClick={this.handleSave} />

        {this.props.selectedReducer ?
          <BaseButton
            text={'Cancel'}
            onClick={this.handleCancel} />
          : 
          <BaseButton
            text={'Clear'}
            disabled={!hasChanges}
            onClick={this.handleClear} />
        }

        
      </fieldset>
    )
  }


}