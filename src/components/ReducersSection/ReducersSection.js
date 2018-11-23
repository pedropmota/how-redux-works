import React from "react";

import BaseItemsList from "../BaseItemsList/BaseItemsList";

import { predefinedReducers } from "../../constants/predefinedItems";
import ReducersForm from "./ReducersForm";

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
  }

  handleItemSelection(item) {
    this.setState({
      selectedReducer: this.props.reducers.filter(r => r.id === item.id)[0]
    })
  }

  handleSave(reducer) {
    if (!reducer.id) {
      this.props.onAddReducer(reducer)
    } else {
      this.props.onEditReducer(reducer);

      this.setState({
        selectedReducer: null
      })
    }
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
      <div>
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
          onCancel={this.handleCancel}>
      
          

        </ReducersForm>

      </div>
    )
  }

}