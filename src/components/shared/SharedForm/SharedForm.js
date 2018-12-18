import React from "react";
import PropTypes from "prop-types";

import BaseCodeEditor from "../../shared/BaseCodeEditor/BaseCodeEditor";
import BaseButton from "../../shared/BaseButton/BaseButton";
import BaseDropdownMulti from "../../shared/BaseDropdownMulti/BaseDropdownMulti";
import BaseDropdownGrouped from "../../shared/BaseDropdownGrouped/BaseDropdownGrouped";
import FormInputController from "../../shared/FormInputController/FormInputController"

import * as actionParser from "../../../utils/parsing/actionParser";
import * as reducerParser from "../../../utils/parsing/reducerParser";

import { predefinedActions, predefinedReducers } from "../../../constants/predefinedItems";

const labels = {
  actions: {
    formTitleAdd: 'Add new action creators',
    formTitleEdit: 'Edit your action creator',
    examplesPlaceholder: 'Action creator examples',
    examplesCreateNew: 'Create your own action creators',
    nameLabel: 'Action creator name',
    namePlaceholderEmpty: 'Type your action name to auto-generate it',
    namePlaceholderEdited: 'Action name'
  },
  reducers: {
    formTitleAdd: 'Add new reducers',
    formTitleEdit: 'Edit your reducer',
    examplesPlaceholder: 'Reducer examples',
    examplesCreateNew: 'Create your own reducers',
    nameLabel: 'Reducer name',
    namePlaceholderEmpty: 'Reducer name',
    namePlaceholderEdited: 'Reducer name',
    actionsLabel: 'Pick some actions'
  }
}



export default class SharedForm extends React.Component {

  static propTypes = {
    formOf: PropTypes.oneOf(['Actions', 'Reducers']).isRequired,

    actions: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string
    })),

    selectedItem: PropTypes.oneOfType([PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      definition: PropTypes.string,
      actions: PropTypes.arrayOf(PropTypes.string)
    }), PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      definition: PropTypes.string
    })]),

    onSave: PropTypes.func.isRequired,

    onClear: PropTypes.func.isRequired,

    onPredefinedSelected: PropTypes.func,
  }

  state = {
    nameInput: '',
    definitionInput: '',

    predefinedSelected: null,
    
    selectedActions: []
  }

  constructor(props) {
    super(props);

    this.isReducersForm = props.formOf === 'Reducers'
    this.predefinedItems = this.isReducersForm ? predefinedReducers : predefinedActions
    this.parser = this.isReducersForm ? reducerParser : actionParser
    this.labels = this.isReducersForm ? labels.reducers : labels.actions

    this.textInputRef = React.createRef()

    this.handleSave = this.handleSave.bind(this)
    this.handleNameInputChange = this.handleNameInputChange.bind(this)
    this.handleDefinitionInputChange = this.handleDefinitionInputChange.bind(this)
    this.handleActionsChange = this.handleActionsChange.bind(this)
    //this.handleClear = this.handleClear.bind(this)
    this.handleNameInputKeyPress = this.handleNameInputKeyPress.bind(this)
    this.handlePredefinedSelection = this.handlePredefinedSelection.bind(this)
    this.hasChangesToSave = this.hasChangesToSave.bind(this)
  }

  

  componentDidUpdate(prevProps) {
    const hasNewItemSelected = this.props.selectedItem && this.props.selectedItem.id !== (prevProps.selectedItem && prevProps.selectedItem.id)
    //const hasNewItemSelected = (this.props.selectedItem && this.props.selectedItem.id) !== (prevProps.selectedItem && prevProps.selectedItem.id)

    if (hasNewItemSelected) 
      this.fillFormWithSelectedItem()
  }

  fillFormWithSelectedItem() {
    const selectedItem = this.props.selectedItem || { }

    this.setState({
      nameInput: selectedItem.name || '',
      definitionInput: selectedItem.definition || '',
      selectedActions: this.isReducersForm && selectedItem.actions ? this.props.actions.filter(a => selectedItem.actions.some(s => s === a.id)) : [],
      predefinedSelected: null
    })
  }
  tryUpdatingDefinition(newName, newActions) {
    const currentDefinition = this.state.definitionInput;

    if (currentDefinition && currentDefinition !== this.parser.getAutoDefinition(this.state.nameInput, this.state.selectedActions))
      return currentDefinition;
    
    return this.parser.getAutoDefinition(newName, newActions)
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

  handleNameInputKeyPress(e) {
    if (!this.state.nameInput && !this.state.definitionInput && !this.state.selectedActions.length)
      return

    if (e.key === 'Enter' && e.target.value)
      this.handleSave()
    
  }

  handleSave({ name, definition, actions, id } = { }) {
    const item = {
      name: name || this.state.nameInput,
      definition: definition || this.state.definitionInput,
      actions: actions || this.state.selectedActions,
      id: id !== undefined ? id : this.props.selectedItem ? this.props.selectedItem.id : null,
    }
    
    this.props.onSave(item);

    this.clearInput()
  }

  clearInput() {
    if (!this.state.nameInput && !this.state.definitionInput && !this.state.selectedActions.length)
      return

    this.setState({
      nameInput: '',
      definitionInput: '',
      selectedActions: [],
      predefinedSelected: null
    })
  }

  handlePredefinedSelection({ label, value }) {
    const selected = this.predefinedItems.filter(a => a.name === value)[0]

    if (selected) {
      this.setState({
        predefinedSelected: selected, //Keeps the selected item displayed in the dropdown

        nameInput: selected.name,
        definitionInput: selected.definition,
        selectedActions: this.isReducersForm ? this.props.actions.filter(a => selected.actions.includes(a.name)) : []
      })

      this.props.onPredefinedSelected && this.props.onPredefinedSelected(selected)
    }
    
    this.textInputRef.current.focus()
  }

  hasChangesToSave() {
    const { nameInput, definitionInput } = this.state
    const { selectedItem } = this.props

    if (!selectedItem) {
      return nameInput || definitionInput
    } else {
      return nameInput !== selectedItem.name || definitionInput !== selectedItem.definition
    }
  }

  renderActionsDropdown() {
    if (!this.isReducersForm)
      return null

    const predefinedReducerSelected = this.state.predefinedSelected
    
    const selectedActionsToDisplay = !predefinedReducerSelected ? 
      this.state.selectedActions : 
      this.props.actions.filter(a => predefinedReducerSelected.actions.includes(a.name))

    return (
      <div className="input">
        <label>Actions</label>
        <BaseDropdownMulti
          options={this.props.actions.map(a => ({ label: a.name, value: a.id }))}
          value={selectedActionsToDisplay.map(a => ({ label: a.name, value: a.id }))}
          disabled={!!predefinedReducerSelected}
          onChange={this.handleActionsChange}
          placeholder={this.labels.actionsLabel} />
      </div>
    )
  }

  render() {

    const { nameInput, definitionInput, predefinedSelected, selectedActions } = this.state
    const { selectedItem } = this.props

    const isInputEmpty = !nameInput && !definitionInput

    const groupedOptions = [{
      label: this.labels.examplesPlaceholder,
      options: this.predefinedItems.map(r => ({ label: r.name, value: r.name }))
    }, //{
    //   label: 'Create your own',
    //   options: [{ label: this.labels.examplesCreateNew, value: '' }]
    // }
  ]
    
    
    
    return (
      <div className="form">
        {/* <span>{this.props.selectedItem ? this.labels.formTitleEdit : this.labels.formTitleAdd }</span> */}

        {/* <FormInputController
          formValues={[ nameInput, definitionInput, ...selectedActions.map(a => a.id) ]}
          itemKeyBeingEdited={selectedItem ? selectedItem.id : null}
          onEdit={this.handleSave} /> */}


        <div className="input">
          <label>Examples</label>

          <BaseDropdownGrouped
            value={predefinedSelected ? { label: predefinedSelected.name, value: predefinedSelected.name } : null}
            placeholder={this.labels.examplesPlaceholder}
            groupedOptions={groupedOptions}
            onChange={this.handlePredefinedSelection} />
        </div>

        <div className="input">

          <label htmlFor="nameInput">{this.labels.nameLabel}</label>
          
          <div style={{ display: 'flex' }}>
            <input
              type="text"
              name="nameInput"
              ref={this.textInputRef}
              value={nameInput}
              onChange={this.handleNameInputChange}
              onKeyPress={this.handleNameInputKeyPress}
              placeholder={isInputEmpty ? this.labels.namePlaceholderEmpty : this.labels.namePlaceholderEdited} />
            

            <BaseButton
              text={'Save'}
              disabled={!this.hasChangesToSave()}
              onClick={this.handleSave} />
          </div>
        </div>

        {/* {this.isReducersForm ? 
          this.renderActionsDropdown() : 
          null} */}
       
       <div className="input code-container">
          <label>Code</label>

          <BaseCodeEditor
            name="definitionInput"
            value={definitionInput}
            onChange={this.handleDefinitionInputChange} />
      </div>
        

        
      </div>
    )
  }


}