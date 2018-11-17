import React from "react";
import Case from "case";

import BaseItemsList from "../BaseItemsList/BaseItemsList";
import { parseAction } from "../../utils/parser";

import "./ActionsSection.scss";

const styles = {
  formInput: { display: 'block', margin: 'auto' }
}


//Create ActionForm component
export default class ActionSection extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      name: props.name || '',
      definition: props.definition || '',
      selectedActionId: null
    }
  }

  getAutomaticDefinition(name) {
    if (!name)
      return '';

    const camelName = Case.camel(name);
    const constantName = Case.constant(name)
    
    return `
const ${constantName} = '${constantName}'

function ${camelName}(param1, param2) {
  return { type: ${constantName}, param1, param2 }
}`.trim()

  }


  handleInputChange(e) {
    const inputName = e.target.name;
    const value = e.target.value;


    if(inputName === 'name') {
      if (!this.state.definition || 
           this.state.definition === this.getAutomaticDefinition(this.state.name)) {
        this.setState({
          definition: this.getAutomaticDefinition(value)
        })
      }
    }

    this.setState({
      [inputName]: value
    })

  }

  handleItemSelection(action) {
    this.setState({
      selectedActionId: action.id,
      name: action.name,
      definition: action.definition
    })
  }


  handleSave() {
    if (!this.state.name)
      return;

    const actionData = parseAction(this.state.definition)

    const action = ({
      id: this.state.selectedActionId,
      name: actionData.name,
      definition: this.state.definition
    })

    if (!this.state.selectedActionId)
      this.props.onAddAction(action)
    else
      this.props.onEditAction(action)

    this.setState({
      name: '',
      definition: '',
      selectedActionId: null
    })
  }

  handleDelete(id) {
    this.props.onDeleteAction(id);
  }

  render() {
    return (
      <div className="actionsSection">
        <h2>Actions</h2>

        <BaseItemsList
          items={this.props.actions}
          getId={action => action.id}
          getName={action => action.name}
          selectedId={this.state.selectedActionId}
          handleItemSelection={(action) => this.handleItemSelection(action)}
          handleItemDeletion={(action) => this.handleDelete(action)} />

        <input 
          type="text"
          style={styles.formInput}
          value={this.state.name}
          name="name"
          onChange={(e) => this.handleInputChange(e)}
          placeholder="Type your action name to auto-generate it"
          />

        <textarea
          type="text"
          style={{...styles.formInput, height: '100px', width: '200px'}}
          value={this.state.definition}
          name="definition"
          onChange={(e) => this.handleInputChange(e)}
          placeholder="Or add the definition directly"
          ></textarea>
        

        <button
          style={styles.formInput}
          onClick={() => this.handleSave()}
        >
          {this.state.selectedActionId ? 'Save' : 'Add'}
        </button>
      </div>
    )
  }

}