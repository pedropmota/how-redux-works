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

    selectedItem: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      definition: PropTypes.string
    }),

    onSave: PropTypes.func.isRequired,

    onClear: PropTypes.func.isRequired,

    onPredefinedSelected: PropTypes.func,
  }

  state = {
    nameInput: '',
    definitionInput: '',
    predefinedSelected: null
  }

  constructor(props) {
    super(props);

    this.textInputRef = React.createRef()

    this.handleSave = this.handleSave.bind(this)
    this.handleNameInputChange = this.handleNameInputChange.bind(this)
    this.handleDefinitionInputChange = this.handleDefinitionInputChange.bind(this)
    this.handleNameInputKeyPress = this.handleNameInputKeyPress.bind(this)
    this.handlePredefinedSelection = this.handlePredefinedSelection.bind(this)
    this.hasChangesToSave = this.hasChangesToSave.bind(this)
  }

  get isReducersForm() {
    return this.props.formOf === 'Reducers'
  }
  get predefinedItems() {
    return this.isReducersForm ? predefinedReducers : predefinedActions
  }
  get parser() {
    return this.isReducersForm ? reducerParser : actionParser
  }
  get labels() {
    return this.isReducersForm ? labels.reducers : labels.actions
  }
  get title() {
    return !this.props.selectedItem ? this.labels.formTitleAdd : this.labels.formTitleEdit
  }
  

  componentDidUpdate(prevProps) {
    const hasNewItemSelected = this.props.selectedItem && this.props.selectedItem.id !== (prevProps.selectedItem && prevProps.selectedItem.id)
    
    if (hasNewItemSelected) 
      this.fillFormWithSelectedItem()
  }

  fillFormWithSelectedItem() {
    const selectedItem = this.props.selectedItem || { }

    this.setState({
      nameInput: selectedItem.name || '',
      definitionInput: selectedItem.definition || '',
      predefinedSelected: null
    })
  }
  tryUpdatingDefinition(newName) {
    const currentDefinition = this.state.definitionInput;

    if (currentDefinition && currentDefinition !== this.parser.getAutoDefinition(this.state.nameInput))
      return currentDefinition;
    
    return this.parser.getAutoDefinition(newName)
  }

  handleNameInputChange(e) {
    const value = e.target.value;
    const definition = this.tryUpdatingDefinition(value)

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
    if (!this.state.nameInput && !this.state.definitionInput)
      return

    if (e.key === 'Enter' && e.target.value)
      this.handleSave()
    
  }

  handleSave({ name, definition, id } = { }) {
    const item = {
      name: name || this.state.nameInput,
      definition: definition || this.state.definitionInput,
      id: id !== undefined ? id : this.props.selectedItem ? this.props.selectedItem.id : null,
    }
    
    this.props.onSave(item);

    this.clearInput()
  }

  clearInput() {
    if (!this.state.nameInput && !this.state.definitionInput)
      return

    this.setState({
      nameInput: '',
      definitionInput: '',
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

  render() {

    const { nameInput, definitionInput, predefinedSelected } = this.state
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
        <div className="form-title">{this.title}</div>

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
              text={selectedItem && !this.hasChangesToSave() ? 'Cancel' : 'Save'}
              secondary={selectedItem && !this.hasChangesToSave()}
              disabled={!selectedItem && !this.hasChangesToSave()}
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