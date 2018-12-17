import React from "react";
import PropTypes from "prop-types";
import beautify from "json-beautify";

import BaseCodeEditor from "../../shared/BaseCodeEditor/BaseCodeEditor";
import { Container } from "semantic-ui-react";
import BaseButton from "../../shared/BaseButton/BaseButton";
import storeTutorialPages from "./storeTutorials"
import TutorialModal from "../../shared/TutorialModal/TutorialModal";

const styles = {
  formInput: { display: 'block', margin: 'auto' }
}


export default class StoreContainer extends React.Component {
  
  static propTypes = {
    currentState: PropTypes.object, 
    dispatchedActions: PropTypes.arrayOf(PropTypes.object),

    onDispatch: PropTypes.func.isRequired,
    onClearStore: PropTypes.func.isRequired
  }

  state = {
    dispatchInput: ''
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

    if (!input || !this.props.currentState)
      return

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
        <h2>
          Store
          <TutorialModal
            pages={storeTutorialPages} />
        </h2>

        <div className="form">

          <div className="input">

            <label>Dispatch an action</label>

            <div style={{ display: 'flex' }}>
              
              <input
                type="text"
                value={this.state.dispatchInput}
                name="dispatchInput"
                onChange={this.handleInputChange}
                placeholder="Dispatch an action"
                />

              <BaseButton 
                text={'Dispatch'}
                onClick={this.handleDispatch} />
            </div>
          </div>

          {/* <button
            style={styles.formInput}
            onClick={this.handleClear}>
            Clear Store
          </button> */}


          <div className="input code-container">
            <label>Your current store's state</label>

            <BaseCodeEditor
              value={stateJson}
              isReadOnly={true} />

          </div>

          <div className="input code-container">
            <label>Actions dispatched by you</label>

            <BaseCodeEditor
              value={actionsJson}
              isReadOnly={true} />
            </div>
        </div>
      </Container>
    )
  }

}
