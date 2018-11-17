import React from "react";
import Case from "case";

import BaseItemsList from "../BaseItemsList/BaseItemsList";
import BaseInputText from "../BaseInputText/BaseInputText";
import BaseCodeEditor from "../BaseCodeEditor/BaseCodeEditor";
import BaseForm from "../BaseForm/BaseForm";
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
      selectedAction: null,
      nameInput: '',
      definitionInput: ''
    }

    this.handleSave = this.handleSave.bind(this);
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

  handleItemSelection(item) {
    this.setState({
      selectedAction: this.props.actions.filter(a => a.id === item.id)[0]
    })
  }


  handleSave(action) {
    const actionData = parseAction(action.definition)

    const actionToSave = {
      ...action,
      name: actionData.name
    }

    if (!actionToSave.id)
      this.props.onAddAction(actionToSave)
    else
      this.props.onEditAction(actionToSave)

    this.setState({
      selectedAction: null
    })
  }

  handleDelete(action) {
    this.props.onDeleteAction(action.id);
  }

  render() {
    return (
      <div className="actionsSection">
        <h2>Actions</h2>

        <BaseItemsList
          items={this.props.actions}
          getId={action => action.id}
          getName={action => action.name}
          getIsSelected={action => this.state.selectedAction && this.state.selectedAction.id === action.id}
          handleItemSelection={action => this.handleItemSelection(action)}
          handleItemDeletion={action => this.handleDelete(action)} />

        
        <BaseForm
          idToEdit={this.state.selectedAction ? this.state.selectedAction.id : null}
          nameToEdit={this.state.selectedAction ? this.state.selectedAction.name : null}
          definitionToEdit={this.state.selectedAction ? this.state.selectedAction.definition : null}
          getAutomaticDefinition={this.getAutomaticDefinition}
          handleSave={this.handleSave}
          namePlaceholder={`Type your action name to auto-generate it`}
          definitionPlaceholder={`Or add/edit the definition directly`} />

      </div>
    )
  }

}