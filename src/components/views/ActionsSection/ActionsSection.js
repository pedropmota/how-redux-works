import React from "react";
import PropTypes from "prop-types";
import { Container } from "semantic-ui-react";
import BaseItemsList from "../../shared/BaseItemsList/BaseItemsList";
import SharedForm from "../../shared/SharedForm/SharedForm";
import "./ActionsSection.scss";
import TutorialModal from "../../shared/TutorialModal/TutorialModal";
import actionTutorialPages from "./actionTutorials";

export default class ActionSection extends React.Component {

  static propTypes = {
    actions: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      definition: PropTypes.definition
    })).isRequired,

    selectedActionId: PropTypes.string,

    addAction: PropTypes.func.isRequired,

    editAction: PropTypes.func.isRequired,

    deleteAction: PropTypes.func.isRequired,

    setSelectedAction: PropTypes.func.isRequired
  }

  state = { }

  constructor(props) {
    super(props)

    this.handleSave = this.handleSave.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleItemSelection = this.handleItemSelection.bind(this)
    this.handleClearSelection = this.handleClearSelection.bind(this)
  }

  handleSave(action) {
    if (!action.id) 
      this.props.addAction(action)
    
    else
      this.props.editAction(action)
  }

  handleItemSelection(item) {
    this.props.setSelectedAction(item.id)
  }

  handleDelete(action) {
    this.props.deleteAction(action.id);

    if (this.props.selectedActionId === action.id)
      this.props.setSelectedAction(null)
  }

  handleClearSelection() {
    this.props.setSelectedAction(null)
  }


  render() {
    return (
      <Container className="actions-section">
        <h2>
          Action Creators
          <TutorialModal
            pages={actionTutorialPages}
            />
        </h2>

        <BaseItemsList
          items={this.props.actions}
          title="Your action creators"
          selectedId={this.props.selectedActionId}
          onItemSelection={this.handleItemSelection}
          onItemDeletion={this.handleDelete} />

        <SharedForm
          formOf={'Actions'}
          selectedItem={this.props.actions.filter(a => a.id === this.props.selectedActionId)[0] || null}
          onSave={this.handleSave}
          onClear={this.handleClearSelection} />

      </Container>
    )
  }

}