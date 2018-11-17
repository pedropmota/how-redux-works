import React from "react";
import Case from 'case';
import { Dropdown } from "semantic-ui-react";
import Select from "react-select";
import makeAnimated from "react-select/lib/animated";

import BaseItemsList from "../BaseItemsList/BaseItemsList";
import BaseForm from "../BaseForm/BaseForm";

import { parseReducer } from "../../utils/parser";



import { predefinedReducers } from "../../constants/predefinedItems";

const styles = {
  formInput: { display: 'block', margin: 'auto' }
}

export default class ReducersSection extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      selectedReducer: null,
      selectedActions: [],//props.actions || ['addPerson', 'editPerson'],
      selectedEntity: [] //props.entity || 'people'
    }

    this.handleSave = this.handleSave.bind(this);
  }

  getAutomaticDefinition(entity, actions) {
    if (!entity)
      return '';

    return `
function ${Case.camel(entity)}(state = [], action) {
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



  handleActionsChange(actionIds) {
    const actions = this.props.actions.filter(a => actionIds.includes(a.id));

    this.updateAutomaticDefinition(this.state.name, actions)

    this.setState({
      selectedActions: actions
    })
  }

  handleItemSelection(item) {
    this.setState({
      selectedReducer: this.props.reducer.filter(r => r.id === item.id)[0]
    })
  }


  handleSave(reducer) {
    //const test = parseReducer(this.state.definition, null);
    
    if (!reducer.id)
      this.props.onAddReducer(reducer)
    else
      this.props.onEditReducer(reducer)

    this.setState({
      selectedReducer: null,
      selectedActions: []
    })
  }

  handleDelete(reducer) {
    this.props.onDeleteReducer(reducer.id);
  }

  render() {
    const actionOptions = this.props.actions.map(action => ({
      //key: action.name,
      label: action.name,
      value: action.id
    }))

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

    const groupStyles = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    };
    const groupBadgeStyles = {
      backgroundColor: '#EBECF0',
      borderRadius: '2em',
      color: '#172B4D',
      display: 'inline-block',
      fontSize: 12,
      fontWeight: 'normal',
      lineHeight: '1',
      minWidth: 1,
      padding: '0.16666666666667em 0.5em',
      textAlign: 'center',
    };
    const formatGroupLabel = data => (
      <div style={groupStyles}>
        <span>{data.label}</span>
        <span style={groupBadgeStyles}>{data.options.length}</span>
      </div>
    );


    return (
      <div>
        <h2>Reducers</h2>

        <Select
          placeholder="Predefined Reducers"
          options={groupedOptions}
          formatGroupLabel={formatGroupLabel}
          onChange={({ label, value }) => {  } }
          />

        <Select 
          placeholder="Pick some actions"
          isMulti
          closeMenuOnSelect={false}
          component={makeAnimated()}
          options={actionOptions}
          onChange={(values) => this.handleActionsChange(values.map(v => v.value)) } />

        <BaseItemsList
          items={this.props.reducers}
          getId={reducer => reducer.id}
          getName={reducer => reducer.name}
          getIsSelected={reducer => this.state.selectedReducer && this.state.selectedReducer.id === reducer.id}
          handleItemSelection={reducer => this.handleItemSelection(reducer)}
          handleItemDeletion={reducer => this.handleDelete(reducer)} />


        <BaseForm
          idToEdit={this.state.selectedReducer ? this.state.selectedReducer.id : null}
          nameToEdit={this.state.selectedReducer ? this.state.selectedReducer.name : null}
          definitionToEdit={this.state.selectedReducer ? this.state.selectedReducer.definition : null}
          getAutomaticDefinition={this.getAutomaticDefinition}
          handleSave={this.handleSave}
          namePlaceholder={`Reducer Name`}
          definitionPlaceholder={`Reducer Definition`} />

      </div>
    )
  }

}