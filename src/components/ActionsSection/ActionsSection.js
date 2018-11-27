import React from "react";
import Case from "case";
import debounce from "debounce-promise";
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

export default class ActionSection extends React.Component {

  state = {
    //Reference of the action to be edited.
    selectedAction: null,

    //Last action id added. When a new one is added, it automatically becomes the one being edited.
    lastActionIdAdded: null,

    //Becomes true the first time an action is added using the form.
    didChangeInput: false
  }

  constructor(props) {
    super(props)

    this.itemsPanelRef = React.createRef()

    this.handleSave = this.handleSave.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleItemSelection = this.handleItemSelection.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  static getDerivedStateFromProps(props, state) {
    const lastAction = props.actions.length ? props.actions[props.actions.length - 1] : null

    if (!state.didChangeInput || !lastAction || state.lastActionIdAdded === lastAction.id)
      return state
    
    return {
      ...state,
      lastActionIdAdded: lastAction.id,
      selectedAction: lastAction
    }
  }


  saveAction = debounce((action) => {
    if (!action.id) {
      this.props.onAddAction(action)
    
      const itemsPanel = this.itemsPanelRef.current
      itemsPanel.scrollTop = itemsPanel.scrollHeight
    }
    else
      this.props.onEditAction(action)

    if (!this.state.didChangeInput) {
      this.setState({ didChangeInput: true })
    }
  }, 800)


  handleItemSelection(item) {
    this.setState({
      selectedAction: this.props.actions.filter(a => a.id === item.id)[0]
    })
  }


  async handleSave(action) {
    await this.saveAction(action);
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
          title="Your action creators"
          idProp={'id'}
          nameProp={'name'}
          errorProp={'errorMessage'}
          selectedId={this.state.selectedAction ? this.state.selectedAction.id : null}
          listRef={this.itemsPanelRef}
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