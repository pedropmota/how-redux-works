import React from "react";
import Case from 'case';

import BaseInputText from "../BaseInputText/BaseInputText";
import BaseCodeEditor from "../BaseCodeEditor/BaseCodeEditor";
import BaseButton from "../BaseButton/BaseButton";
import BaseDropdownGrouped from "../BaseDropdownGrouped/BaseDropdownGrouped";
import { getAutoDefinition } from "../../parsing/actionParser";
import { predefinedActions } from "../../constants/predefinedItems";



export default class ActionsForm extends React.Component {

  state = {
    nameInput: '',
    definitionInput: '',
    predefinedSelected: null,

    selectedActionReference: null
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

    this.handleSave(value, definition)
  }


  handleDefinitionInputChange(newValue) {
    this.setState({
      definitionInput: newValue
    })
    
    this.handleSave(this.state.nameInput, newValue)
  }


  handleSave(name, definition, forceNew) {
    const action = {
      name: name,
      definition: definition,
      id: this.props.selectedAction && !forceNew ? this.props.selectedAction.id : null
    }

    this.props.onSave(action);
  }

  handleClear() {
    this.setState({
      nameInput: '',
      definitionInput: '',
      predefinedSelected: null
    })

    this.props.onCancel()
  }

  handleInputKeyPress(e) {
    if (e.key === 'Enter' && e.target.value)
      this.handleSave()
  }

  handlePredefinedSelection({ label, value }) {
    const selected = predefinedActions.filter(a => a.name === value)[0]

    this.setState((prevState, props) =>
      selected ? ({
        nameInput: selected.name,
        definitionInput: selected.definition,
        predefinedSelected: selected
      }) : ({
        predefinedSelected: null
      })
    )
    
    if (selected)
      this.handleSave(selected.name, selected.definition, true)
    
    this.textInputRef.current.focus()
  }

  
  getHasInputChanges() {
    const { nameInput, definitionInput } = this.state;
    const { selectedAction } = this.props;

    if (!selectedAction)
      return nameInput || definitionInput;
    else
      return selectedAction.name !== nameInput || selectedAction.definition !== definitionInput
  }



  render() {
    const { nameInput, definitionInput, predefinedSelected } = this.state;
    const hasChanges = this.getHasInputChanges();

    const groupedOptions = [
      {
        label: 'Action creator examples',
        options: predefinedActions.map(r => ({ label: r.name, value: r.name }))
      },
      {
        label: 'Create your own',
        options: [{ label: 'Create your own action creators', value: '' }]
      }
    ]

    return (
      <div className="form">
      
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