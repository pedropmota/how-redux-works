import React from "react";
import PropTypes from "prop-types";

import BaseCodeEditor from "../../shared/BaseCodeEditor/BaseCodeEditor";
import BaseButton from "../../shared/BaseButton/BaseButton";
import BaseDropdownMulti from "../../shared/BaseDropdownMulti/BaseDropdownMulti";
import BaseDropdownGrouped from "../../shared/BaseDropdownGrouped/BaseDropdownGrouped";
import FormInputController from "../../shared/FormInputController/FormInputController"

import { getAutoDefinition } from "../../../utils/parsing/reducerParser";

import { predefinedReducers } from "../../../constants/predefinedItems";



export default class ReducersForm extends React.Component {

  static propTypes = {
    actions: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string
    })).isRequired,

    selectedReducer: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      definition: PropTypes.string,
      actions: PropTypes.array
    }).isRequired,

    onSave: PropTypes.func.isRequired,

    onClear: PropTypes.func.isRequired,

    onPredefinedSelected: PropTypes.func
  }

  state = {
    nameInput: '',
    definitionInput: '',
    predefinedSelected: null,
    selectedActions: []
  }

  constructor(props) {
    super(props);

    this.textInputRef = React.createRef()

    this.handleSave = this.handleSave.bind(this)
    this.handleNameInputChange = this.handleNameInputChange.bind(this)
    this.handleDefinitionInputChange = this.handleDefinitionInputChange.bind(this)
    this.handleActionsChange = this.handleActionsChange.bind(this)
    this.handleClear = this.handleClear.bind(this)
    this.handleInputKeyPress = this.handleInputKeyPress.bind(this)
    this.handlePredefinedSelection = this.handlePredefinedSelection.bind(this)
  }

  componentDidUpdate(prevProps) {
    const hasNewReducerSelected = this.props.selectedReducer && this.props.selectedReducer !== prevProps.selectedReducer
    if (hasNewReducerSelected) 
      this.fillFormWithSelectedReducer()
  }

  fillFormWithSelectedReducer() {
    const selectedReducer = this.props.selectedReducer

    this.setState({
      nameInput: selectedReducer.name,
      definitionInput: selectedReducer.definition,
      selectedActions: this.props.actions.filter(a => selectedReducer.actions.some(s => s === a.id)),
      predefinedSelected: null
    })
  }
  tryUpdatingDefinition(newName, newActions) {
    const currentDefinition = this.state.definitionInput;

    if (currentDefinition && currentDefinition !== getAutoDefinition(this.state.nameInput, this.state.selectedActions))
      return currentDefinition;

    return getAutoDefinition(newName, newActions)
  }

  handleActionsChange(selectedItems) {
    const ids = selectedItems.map(i => i.value)
    const actions = this.props.actions.filter(a => ids.includes(a.id));
    const definition = this.tryUpdatingDefinition(this.state.nameInput, actions);

    this.setState({
      selectedActions: actions,
      definitionInput: definition
    })
  }

  handleNameInputChange(e) {
    const value = e.target.value;
    const definition = this.tryUpdatingDefinition(value, this.state.selectedActions)

    this.setState({
      nameInput: value,
      definitionInput: definition
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

  handleSave(name, definition, actions, id) {
    const reducer = {
      name: name || this.state.nameInput,
      definition: definition || this.state.definitionInput,
      actions: actions || this.state.selectedActions,
      id: id !== undefined ? id : this.props.selectedReducer ? this.props.selectedReducer.id : null,
    }
    
    this.props.onSave(reducer);
  }

  handleClear() {
    this.setState({
      nameInput: '',
      definitionInput: '',
      selectedActions: [],
      predefinedSelected: null
    })

    this.props.onClear()
  }

  handlePredefinedSelection({ label, value }) {
    const selected = predefinedReducers.filter(a => a.name === value)[0]

    if (selected) {
      this.handleSave(
        selected.name,
        selected.definition,
        this.props.actions.filter(a => selected.actions.includes(a.name)),
        null, //Id null to force new item
      )

      this.props.onPredefinedSelected(selected)
    }
    
    this.textInputRef.current.focus()
  }

  render() {

    const { nameInput, definitionInput, selectedActions, predefinedSelected } = this.state 
    
    const groupedOptions = [{
      label: 'Predefined Reducers',
      options: predefinedReducers.map(r => ({ label: r.name, value: r.name }))
    }, {
      label: 'Create your own',
      options: [{ label: 'Create your own reducers', value: '' }]
    }]
    
    const selectedActionsToDisplay = !predefinedSelected ? 
      selectedActions : 
      this.props.actions.filter(a => predefinedSelected.actions.includes(a.name))
    
    return (
      <fieldset className="form">
        <legend>{this.props.selectedReducer ? 'Edit your reducer' : 'Add new reducers'}</legend>

        <FormInputController
          formValues={[ nameInput, definitionInput, ...selectedActions.map(a => a.id) ]}
          itemKeyBeingEdited={this.props.selectedReducer ? this.props.selectedReducer.id : null}
          onEdit={this.handleSave} />

        <BaseDropdownGrouped
          value={predefinedSelected ? { label: predefinedSelected.name, value: predefinedSelected.name } : null}
          placeholder="Reducer examples"
          groupedOptions={groupedOptions}
          onChange={this.handlePredefinedSelection} />

         <div style={{ display: 'flex' }}>
          <input
            type="text"
            name="nameInput"
            ref={this.textInputRef}
            value={nameInput}
            onChange={this.handleNameInputChange}
            onKeyPress={this.handleInputKeyPress}
            placeholder={`Reducer Name`} />

          <BaseButton
            text={'Ok'}
            onClick={this.handleClear} />
        </div>

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


        
      </fieldset>
    )
  }


}