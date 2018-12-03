import React from "react";
import PropTypes from "prop-types";
import { Container } from "semantic-ui-react";
import BaseItemsList from "../../shared/BaseItemsList/BaseItemsList";

import ActionsForm from "./ActionsForm";
import "./ActionsSection.scss";

export default class ActionSection extends React.Component {

  static propTypes = {
    actions: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      definition: PropTypes.definition
    })).isRequired,

    onAddAction: PropTypes.func.isRequired,

    onEditAction: PropTypes.func.isRequired,

    onDeleteAction: PropTypes.func.isRequired
  }

  state = {
    //Reference of the action to be edited.
    selectedAction: null
  }

  constructor(props) {
    super(props)

    this.handleSave = this.handleSave.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleItemSelection = this.handleItemSelection.bind(this)
    this.handleClearSelection = this.handleClearSelection.bind(this)
  }

  componentDidUpdate(prevProps) {
    const hasNewItem = this.props.actions.length > prevProps.actions.length

    if (hasNewItem) {
      const newItem = this.props.actions[this.props.actions.length - 1]
      this.setState({
        selectedAction: newItem
      })
    }
  }

  handleSave(action) {
    if (!action.id) 
      this.props.onAddAction(action)
    
    else
      this.props.onEditAction(action)
  }


  handleItemSelection(item) {
    this.setState({
      selectedAction: this.props.actions.filter(a => a.id === item.id)[0]
    })
  }

  handleDelete(action) {
    this.props.onDeleteAction(action.id);
  }

  handleClearSelection() {
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
          selectedId={this.state.selectedAction ? this.state.selectedAction.id : null}
          onItemSelection={this.handleItemSelection}
          onItemDeletion={this.handleDelete} />


        <ActionsForm
          selectedAction={this.state.selectedAction}
          onSave={this.handleSave}
          onClear={this.handleClearSelection} />

      </Container>
    )
  }

}