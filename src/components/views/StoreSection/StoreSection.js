import React from "react";
import PropTypes from "prop-types";
import beautify from "json-beautify";

import BaseCodeEditor from "../../shared/BaseCodeEditor/BaseCodeEditor";
import { Container } from "semantic-ui-react";
import BaseButton from "../../shared/BaseButton/BaseButton";
import storeTutorialPages from "./storeTutorials"
import TutorialModal from "../../shared/TutorialModal/TutorialModal";

import ReactJson from 'react-json-view';
import JsonView from "../../shared/JsonView/JsonView";
import BaseCodeView from "../../shared/BaseCodeView/BaseCodeView";
import CodeMirror from 'react-codemirror'
import './StoreSection.scss'

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

    const stateJson = currentState ? beautify(currentState, null, 2, 50) : null
    const actionsJson = dispatchedActions ? dispatchedActions.map(action => beautify(action)).join('\n') : null
    
    return (
      <Container className="store-section">
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

          {
            stateJson ?
            <>
              <div className="output" style={{ overflow: 'auto'}}>
                <label>Your current store's state</label>

                <BaseCodeView code={stateJson} language="json" />
              </div>

              <div className="output" style={{ overflow: 'auto'}}>
                <label>Actions dispatched by you</label>

                {actionsJson ?
                  <BaseCodeView code={actionsJson} language="json" />
                  :
                  <p className="message">No actions dispatched yet.</p>
                }
              </div>
            </>
            :
            <p className="message">
              Your state will be displayed here when you add valid reducers.
            </p>
          }


          
        </div>
      </Container>
    )
  }

}
