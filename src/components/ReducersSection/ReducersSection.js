import React from "react";
import Case from 'case';
import { Dropdown } from "semantic-ui-react";
import Select from "react-select";
import makeAnimated from "react-select/lib/animated";

import { parseReducer } from "../../utils/parser";



import { predefinedReducers } from "../../constants/predefinedItems";

const styles = {
  formInput: { display: 'block', margin: 'auto' }
}

export default class ReducersSection extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      name: '',//props.name || '',
      definition: '',//props.definition || '',
      selectedActions: [],//props.actions || ['addPerson', 'editPerson'],
      selectedEntity: [] //props.entity || 'people'
    }
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


  handleInputChange(e) {
    const inputName = e.target.name;
    const value = e.target.value;


    if(inputName === 'name') {
      this.updateAutomaticDefinition(value, this.state.selectedActions)
    }

    this.setState({
      [inputName]: value
    })

  }

  updateAutomaticDefinition(entity, actions) {
    if (!this.state.definition || 
      this.state.definition === this.getAutomaticDefinition(this.state.name, this.state.selectedActions)) {
      
      this.setState({
        definition: this.getAutomaticDefinition(entity, actions)
      })
    }
  }


  handleActionsChange(actionIds) {
    const actions = this.props.actions.filter(a => actionIds.includes(a.id));

    this.updateAutomaticDefinition(this.state.name, actions)

    this.setState({
      selectedActions: actions
    })
  }


  handleSave() {
    if (!this.state.name)
      return;

    this.props.onAddReducer({
      name: this.state.name,
      definition: this.state.definition,
      actions: this.state.selectedActions
    })
    
    
    const test = parseReducer(this.state.definition, null);

    //const test = esprima.parseScript(this.state.definition);


    this.setState({
      name: '',
      definition: '',
      selectedActions: []
    })
  }

  handleDelete(id) {
    this.props.onDeleteReducer(id);
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

        {this.props.reducers.map((reducer) => (
          <div key={reducer.id}>
            <span className="reducerName">{reducer.name}</span>
            
            <button
              onClick={() => this.handleDelete(reducer.id)}>
             X 
            </button>
          </div>
        ))}

        <input 
          type="text"
          style={styles.formInput}
          value={this.state.name}
          name="name"
          onChange={(e) => this.handleInputChange(e)}
          placeholder="Reducer Name"
          />

        <textarea
          type="text"
          style={{...styles.formInput, height: '100px', width: '200px'}}
          value={this.state.definition}
          name="definition"
          onChange={(e) => this.handleInputChange(e)}
          placeholder="Reducer Definition"
          ></textarea>
        

        <button
          style={styles.formInput}
          onClick={() => this.handleSave()}
        >
          Add
        </button>
      </div>
    )
  }

}