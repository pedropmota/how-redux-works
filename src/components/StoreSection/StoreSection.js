import React from "react";
import Case from 'case';
import beautify from "json-beautify";

import Select from "react-select";
import makeAnimated from "react-select/lib/animated";
import BaseCodeEditor from "../BaseCodeEditor/BaseCodeEditor";

const styles = {
  formInput: { display: 'block', margin: 'auto' }
}


export default class StoreContainer extends React.Component {
  
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
    const stateJson = this.props.currentState ? beautify(this.props.currentState, null, 2, 70) : null
    
    return (
      <div>
        <h3>Store</h3>

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
          />

        {/* <div 
          className="currentState"
          style={{ border: '1px solid gray' }}
          >{
              
          }</div> */}

      </div>
    )
  }

}
