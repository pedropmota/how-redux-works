import React from "react";
import PropTypes from "prop-types";
import beautify from "json-beautify";

import BaseCodeEditor from "../../shared/BaseCodeEditor/BaseCodeEditor";
import { Container } from "semantic-ui-react";
import BaseButton from "../../shared/BaseButton/BaseButton";
import storeTutorialPages from "./storeTutorials"
import TutorialModal from "../../shared/TutorialModal/TutorialModal";

import BaseCodeView from "../../shared/BaseCodeView/BaseCodeView";
import './StoreSection.scss'
import { withMessageHandler } from './MessageHandler';



export default withMessageHandler(
  class StoreSection extends React.Component {
    
    static propTypes = {
      addMessageToHandler: PropTypes.func,
      renderMessageFromHandler: PropTypes.func,
      
      currentState: PropTypes.object, 
      dispatchedActions: PropTypes.arrayOf(PropTypes.object),

      onDispatch: PropTypes.func,
      onClearStore: PropTypes.func
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

      try {

        this.props.onDispatch({
          input, 
          currentActions: this.props.currentActions
        });
        
        this.props.addMessageToHandler('Action successfully dispatched!')

      } catch (error) {
        this.props.addMessageToHandler('Error while dispatching your action! ' + error.message, 'error')
      }
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

          <div className="form" style={{ height: '100%' }}>

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
                  disabled={!this.state.dispatchInput || !currentState}
                  onClick={this.handleDispatch} />
              </div>

              <div className="message-container">
                <div className="no-space-container">
                  {this.props.renderMessageFromHandler()}
                </div>
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
                <div className="output current-state">
                  <label>Your current store's state</label>

                  <BaseCodeView 
                    code={stateJson} 
                    language="json" 
                    style={{ overflow: 'auto' }} />
                </div>

                <div className="output actions-dispatched" style={{ marginTop: '16px' }}>
                  <label>Actions dispatched by you</label>

                  {actionsJson ?
                    <BaseCodeView 
                      code={actionsJson} 
                      language="json"
                      style={{ overflow: 'auto' }}  />
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
)