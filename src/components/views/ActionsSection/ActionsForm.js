import React from "react";
import PropTypes from "prop-types";

import FormInputController from "../../shared/FormInputController/FormInputController";
import BaseCodeEditor from "../../shared/BaseCodeEditor/BaseCodeEditor";
import BaseButton from "../../shared/BaseButton/BaseButton";
import BaseDropdownGrouped from "../../shared/BaseDropdownGrouped/BaseDropdownGrouped";
import { getAutoDefinition } from "../../../utils/parsing/actionParser";
import { predefinedActions } from "../../../constants/predefinedItems";

export default class ActionsForm extends React.Component {

  static propTypes = {
    selectedAction: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      definition: PropTypes.string
    }).isRequired,

    onSave: PropTypes.func.isRequired,

    onClear: PropTypes.func.isRequired
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
    this.handleClear = this.handleClear.bind(this)
    this.handleInputKeyPress = this.handleInputKeyPress.bind(this)
    this.handlePredefinedSelection = this.handlePredefinedSelection.bind(this)
  }
  
  componentDidUpdate(prevProps) {
    const hasNewActionSelected = this.props.selectedAction && this.props.selectedAction !== prevProps.selectedAction
    if (hasNewActionSelected) 
      this.fillFormWithSelectedAction()
  }

  fillFormWithSelectedAction() {
    const selectedAction = this.props.selectedAction
    this.setState({
      nameInput: selectedAction.name,
      definitionInput: selectedAction.definition,
      predefinedSelected: null
    })
  }

  tryUpdatingDefinition(newName) {
    const currentDefinition = this.state.definitionInput;

    if (currentDefinition && currentDefinition !== getAutoDefinition(this.state.nameInput))
      return currentDefinition;

    return getAutoDefinition(newName)
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


  handleSave(name, definition, id) {
    const action = {
      name: name || this.state.nameInput,
      definition: definition || this.state.definitionInput,
      id: id !== undefined ? id : this.props.selectedAction ? this.props.selectedAction.id : null
    }

    this.props.onSave(action);
  }

  handleClear() {
    this.setState({
      nameInput: '',
      definitionInput: '',
      predefinedSelected: null
    })

    this.props.onClear()
  }

  handleInputKeyPress(e) {
    if (e.key === 'Enter' && e.target.value)
      this.handleSave()
  }

  handlePredefinedSelection({ label, value }) {
    const selected = predefinedActions.filter(a => a.name === value)[0]

    if (selected) {
      this.handleSave(
        selected.name,
        selected.definition,
        null //Id null to force new item
      )
    }

    this.textInputRef.current.focus()
  }

  
  getHasInputChanges() {
    const { selectedAction } = this.props;

    if (!selectedAction)
      return this.state.nameInput || this.state.definitionInput;
    else
      return selectedAction.name !== this.state.nameInput || selectedAction.definition !== this.state.definitionInput
  }


  render() {
    const { nameInput, definitionInput, predefinedSelected } = this.state;
    const hasChanges = this.getHasInputChanges();

    const groupedOptions = [{
      label: 'Action creator examples',
      options: predefinedActions.map(r => ({ label: r.name, value: r.name }))
    }, {
      label: 'Create your own',
      options: [{ label: 'Create your own action creators', value: '' }]
    }]

    return (
      <div className="form">
      
        <FormInputController
          formValues={[ nameInput, definitionInput ]}
          itemKeyBeingEdited={this.props.selectedAction ? this.props.selectedAction.id : null}
          onEdit={this.handleSave} />

        <BaseDropdownGrouped
          value={predefinedSelected ? { label: predefinedSelected.name, value: predefinedSelected.name } : null}
          placeholder="Action creator examples"
          groupedOptions={groupedOptions}
          onChange={this.handlePredefinedSelection} />

        <div style={{ display: 'flex' }}>
          <input
            type="text"
            name="nameInput"
            value={nameInput}
            ref={this.textInputRef}
            onChange={this.handleNameInputChange}
            onKeyPress={this.handleInputKeyPress}
            placeholder={!hasChanges ? `Type your action name to auto-generate it` : `Action name`}
            style={{ flexGrow: 1 }} />

          <BaseButton
            text={'Ok'}
            onClick={this.handleClear} />
        </div>

        <BaseCodeEditor
          name="definitionInput"
          value={definitionInput}
          onChange={this.handleDefinitionInputChange} />
        
      </div>
    )
  }


}