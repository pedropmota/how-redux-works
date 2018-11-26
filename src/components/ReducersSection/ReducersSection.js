import React from "react";

import BaseItemsList from "../BaseItemsList/BaseItemsList";

import { predefinedReducers, predefinedActions } from "../../constants/predefinedItems";
import ReducersForm from "./ReducersForm";
import { Container } from "semantic-ui-react";
import "./ReducersSection.scss"

export default class ReducersSection extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      selectedReducer: null
    }

    this.handleSave = this.handleSave.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleItemSelection = this.handleItemSelection.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handlePredefinedSelected = this.handlePredefinedSelected.bind(this);
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

  handleSave(reducer, predefinedSelected) {
    if (!reducer.id) {
      this.props.onAddReducer(reducer)
    } else {
      this.props.onEditReducer(reducer);

      this.setState({
        selectedReducer: null
      })
    }

    //this.addPredefinedItemActions(predefinedSelected)
  }

  handleDelete(reducer) {
    this.props.onDeleteReducer(reducer.id);
  }

  handleCancel() {
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
          getId={reducer => reducer.id}
          getName={reducer => reducer.name}
          getError={reducer => reducer.errorMessage}
          getIsSelected={reducer => this.state.selectedReducer && this.state.selectedReducer.id === reducer.id}
          handleItemSelection={this.handleItemSelection}
          handleItemDeletion={this.handleDelete} />

        <ReducersForm
          actions={this.props.actions}
          selectedReducer={this.state.selectedReducer}
          onSave={this.handleSave}
          onCancel={this.handleCancel}
          onPredefinedSelected={this.handlePredefinedSelected}>

        </ReducersForm>

      </Container>
    )
  }

}