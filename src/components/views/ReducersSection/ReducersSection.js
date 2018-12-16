import React from "react";
import PropTypes from "prop-types";
import BaseItemsList from "../../shared/BaseItemsList/BaseItemsList";

import { predefinedActions } from "../../../constants/predefinedItems";
import { Container } from "semantic-ui-react";
import "./ReducersSection.scss"
import SharedForm from "../../shared/SharedForm/SharedForm";

//TODO: 
export default class ReducersSection extends React.Component {

  static propTypes = {
    reducers: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      definition: PropTypes.definition,
      actions: PropTypes.arrayOf(PropTypes.string)
    })).isRequired,

    selectedReducerId: PropTypes.string,

    actions: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      definition: PropTypes.definition
    })).isRequired,

    addReducer: PropTypes.func.isRequired,

    editReducer: PropTypes.func.isRequired,

    deleteReducer: PropTypes.func.isRequired,

    addAction: PropTypes.func,

    setSelectedReducer: PropTypes.func.isRequired
  }

  state = { }

  constructor(props) {
    super(props);

    this.handleSave = this.handleSave.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleItemSelection = this.handleItemSelection.bind(this);
    this.handleCancelSelection = this.handleCancelSelection.bind(this);   
  }
  
  handleItemSelection(item) {
    this.props.setSelectedReducer(item.id)
  }

  handleSave(reducer) {
    if (!reducer.id)
      this.props.addReducer(reducer)
    else {
      this.props.editReducer(reducer)
      this.props.setSelectedReducer(null)
    }
  }

  handleDelete(reducer) {
    this.props.deleteReducer(reducer.id)

    if (this.props.selectedReducerId === reducer.id)
      this.props.setSelectedReducer(null)
  }

  handleCancelSelection() {
    this.props.setSelectedReducer(null)
  }

  render() {
  
    return (
      <Container className="reducers-section">
        <h2>Reducers</h2>

        <BaseItemsList
          items={this.props.reducers}
          title="Your reducers"
          selectedId={this.props.selectedReducerId}
          onItemSelection={this.handleItemSelection}
          onItemDeletion={this.handleDelete} />

          <SharedForm
            formOf={'Reducers'}
            selectedItem={this.props.reducers.filter(r => r.id === this.props.selectedReducerId)[0] || null}
            actions={this.props.actions}
            onSave={this.handleSave}
            onClear={this.handleCancelSelection} />

      </Container>
    )
  }

}