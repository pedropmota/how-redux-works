import React from "react";
import Case from "case";
import { Container } from "semantic-ui-react";


import BaseItemsList from "../BaseItemsList/BaseItemsList";
import BaseInputText from "../BaseInputText/BaseInputText";
import BaseCodeEditor from "../BaseCodeEditor/BaseCodeEditor";
import BaseForm from "../BaseForm/BaseForm";
import { parseAction } from "../../utils/parser";

import "./ActionsSection.scss";
import ActionsForm from "./ActionsForm";

const styles = {
  formInput: { display: 'block', margin: 'auto' }
}


//Create ActionForm component
export default class ActionSection extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      selectedAction: null,
      lastActionIdAdded: null
    }

    this.handleSave = this.handleSave.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleItemSelection = this.handleItemSelection.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  static getDerivedStateFromProps(props, state) {
    const lastAction = props.actions.length ? props.actions[props.actions.length - 1] : null

    if (!lastAction || state.lastActionIdAdded === lastAction.id)
      return state
    
    return {
      ...state,
      lastActionIdAdded: lastAction.id,
      selectedAction: lastAction
    }
  }



  handleItemSelection(item) {
    this.setState({
      selectedAction: this.props.actions.filter(a => a.id === item.id)[0]
    })
  }


  handleSave(action) {
    if (!action.id)
      this.props.onAddAction(action)
    else
      this.props.onEditAction(action)

    this.setState({
      selectedAction: null
    })
  }

  handleDelete(action) {
    this.props.onDeleteAction(action.id);
  }

  handleCancel() {
    this.setState({
      selectedAction: null
    })
  }


  render() {
    return (
      <Container className="actions-section">
        <h2>Action Creators</h2>

        <BaseItemsList
          items={this.props.actions}
          getId={action => action.id}
          getName={action => action.name}
          getError={action => action.errorMessage}
          getIsSelected={action => this.state.selectedAction && this.state.selectedAction.id === action.id}
          handleItemSelection={this.handleItemSelection}
          handleItemDeletion={this.handleDelete} />


        <ActionsForm
          selectedAction={this.state.selectedAction}
          onSave={this.handleSave}
          onCancel={this.handleCancel} />

      </Container>
    )
  }

}