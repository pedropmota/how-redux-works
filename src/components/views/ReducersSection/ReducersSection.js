import React from "react";
import PropTypes from "prop-types";
import BaseItemsList from "../../shared/BaseItemsList/BaseItemsList";

import { predefinedActions } from "../../../constants/predefinedItems";
import ReducersForm from "./ReducersForm";
import { Container } from "semantic-ui-react";
import "./ReducersSection.scss"

//TODO: 
export default class ReducersSection extends React.Component {

  static propTypes = {
    reducers: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      definition: PropTypes.definition,
      actions: PropTypes.arrayOf(PropTypes.string)
    })).isRequired,

    actions: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      definition: PropTypes.definition
    })).isRequired,

    onAddReducer: PropTypes.func.isRequired,

    onEditReducer: PropTypes.func.isRequired,

    onDeleteReducer: PropTypes.func.isRequired,

    onAddAction: PropTypes.func
  }

  state = {
    selectedReducer: null
  }

  constructor(props) {
    super(props);

    this.handleSave = this.handleSave.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleItemSelection = this.handleItemSelection.bind(this);
    this.handleCancelSelection = this.handleCancelSelection.bind(this);
    this.handlePredefinedSelected = this.handlePredefinedSelected.bind(this);
  }

  //TODO: Handle actions added for a predefined reducer
  componentDidUpdate(prevProps) {
    const hasNewItem = this.props.reducers.length > prevProps.reducers.length

    if (hasNewItem) {
      const newItem = this.props.reducers[this.props.reducers.length - 1]
      this.setState({
        selectedReducer: newItem
      })
    }
  }
  handlePredefinedSelected(predefinedReducer) {
    const existingActions = this.props.actions;
    const actionsToAdd = predefinedActions.filter(p => 
      predefinedReducer.actions.includes(p.name) && !existingActions.some(a => a.name === p.name))

    actionsToAdd.forEach(action =>
      this.props.onAddAction(action))
  }
  
  handleItemSelection(item) {
    this.setState({
      selectedReducer: this.props.reducers.filter(r => r.id === item.id)[0]
    })
  }

  handleSave(reducer) {
    if (!reducer.id)
      this.props.onAddReducer(reducer)
    else
      this.props.onEditReducer(reducer);
  }

  handleDelete(reducer) {
    this.props.onDeleteReducer(reducer.id);
  }

  handleCancelSelection() {
    this.setState({
      selectedReducer: null
    })
  }

  render() {
  
    return (
      <Container className="reducers-section">
        <h2>Reducers</h2>

        <BaseItemsList
          items={this.props.reducers}
          title="Your reducers"
          selectedId={this.state.selectedReducer ? this.state.selectedReducer.id : null}
          onItemSelection={this.handleItemSelection}
          onItemDeletion={this.handleDelete} />

        <ReducersForm
          actions={this.props.actions}
          selectedReducer={this.state.selectedReducer}
          onSave={this.handleSave}
          onClear={this.handleCancelSelection}
          onPredefinedSelected={this.handlePredefinedSelected} />

      </Container>
    )
  }

}