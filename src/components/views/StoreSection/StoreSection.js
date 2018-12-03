import React from "react";
import PropTypes from "prop-types";
import beautify from "json-beautify";

import BaseCodeEditor from "../../shared/BaseCodeEditor/BaseCodeEditor";
import { Container } from "semantic-ui-react";

const styles = {
  formInput: { display: 'block', margin: 'auto' }
}


export default class StoreContainer extends React.Component {
  
  static propTypes = {
    currentState: PropTypes.object.isRequired, 
    dispatchedActions: PropTypes.arrayOf(PropTypes.object).isRequired,

    onDispatch: PropTypes.func.isRequired,
    onClearStore: PropTypes.func.isRequired
  }

  state = {
    dispatchInput: '',
    currentState: null
  }

  constructor(props) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleDispatch = this.handleDispatch.bind(this)
    this.handleClear = this.handleClear.bind(this)
  }

  handleInputChange(e) {
    const inputName = e.target.name;
    const value = e.target.value;

    this.setState({
      [inputName]: value
    })
  }

  handleDispatch() {
    const input = this.state.dispatchInput

    this.props.onDispatch({
      input, 
      currentActions: this.props.currentActions
    });
  }

  handleClear() {
    this.props.onClearStore();
  }


  render() {
    const { currentState, dispatchedActions } = this.props;

    const stateJson = currentState ? beautify(currentState, null, 2, 70) : null
    const actionsJson = dispatchedActions ? dispatchedActions.map(action => beautify(action)).join('\n') : null

    return (
      <Container>
        <h2>Store</h2>

        <input
          type="text"
          value={styles.formInput}
          value={this.state.dispatchInput}
          name="dispatchInput"
          onChange={this.handleInputChange}
          placeholder="Dispatch an action"
          />

        <button
          style={styles.formInput}
          onClick={this.handleDispatch}>
          Dispatch
        </button>

        <button
          style={styles.formInput}
          onClick={this.handleClear}>
          Clear Store
        </button>

        <BaseCodeEditor
          value={stateJson}
          isReadOnly={true}
          style={{ marginBottom: '10px' }} />

        <BaseCodeEditor
          value={actionsJson}
          isReadOnly={true} />

      </Container>
    )
  }

}
