import React from "react";
import Case from 'case';

import Select from "react-select";
import makeAnimated from "react-select/lib/animated";

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


  render() {
    return (
      <div>
        <h3>Store</h3>

        <input
          type="text"
          value={styles.formInput}
          value={this.state.dispatchInput}
          name="dispatchInput"
          onChange={(e) => this.handleInputChange(e)}
          placeholder="Store Definition"
          />

        <button
          style={styles.formInput}
          onClick={e => this.handleDispatch(e)}>

        </button>

        <div 
          className="currentState"
          style={{ border: '1px solid gray' }}
          >{
              this.props.currentState ? JSON.stringify(this.props.currentState) : null
          }</div>

      </div>
    )
  }

}
