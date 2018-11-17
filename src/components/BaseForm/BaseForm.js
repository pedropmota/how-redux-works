import React from "react";
import Case from "case";

import BaseItemsList from "../BaseItemsList/BaseItemsList";
import { parseAction } from "../../utils/parser";

import "./ActionsSection.scss";

const styles = {
  formInput: { display: 'block', margin: 'auto' }
}


//Create ActionForm component
export default class BaseForm extends React.Component {

  state = {
    name,
    definition
  }

  constructor(props) {
    super(props) 
  }

  getDerivedStateFromProps(props, state) {
    return {
      ...state,
      name: props.name || '',
      definition: props.definition || ''
    }
  }


  handleInputChange(e) {
    const inputName = e.target.name;
    const value = e.target.value;


    if(inputName === 'name') {
      if (!this.state.definition || 
           this.state.definition === this.props.getAutomaticDefinition(this.state.name)) {
        this.setState({
          definition: this.props.getAutomaticDefinition(value)
        })
      }
    }

    this.setState({
      [inputName]: value
    })

  }

  handleSave() {
    this.props.handleSave({
      name: this.state.name,
      definition: this.state.definition,
      selectedId: this.props.selectedId
    })
  }


  render() {
    return (
      <div>
        <input 
          type="text"
          style={styles.formInput}
          value={this.state.name}
          name="name"
          onChange={(e) => this.handleInputChange(e)}
          placeholder={this.props.namePlaceholder}
          />

        <textarea
          type="text"
          style={{...styles.formInput, height: '100px', width: '200px'}}
          value={this.state.definition}
          name="definition"
          onChange={(e) => this.handleInputChange(e)}
          placeholder={this.props.definitionPlaceholder}
          ></textarea>
        

        <button
          style={styles.formInput}
          onClick={() => this.handleSave()}
        >
          {this.props.selectedId ? 'Save' : 'Add'}
        </button>
      </div>
    )
  }
}