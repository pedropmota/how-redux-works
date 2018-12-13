import React from "react";
import PropTypes from "prop-types";
import debounce from "debounce-promise";

const defaultDebounceTime = 800;

/**
 * Form Input Controller. 
 * This component fires the "onEdit" prop when formValues change. 
 * Uses debounce to prevent multiple consecutive calls.
 */
class FormInputController extends React.Component {
  static propTypes = {
    formValues: PropTypes.arrayOf(PropTypes.string).isRequired,
    itemKeyBeingEdited: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onEdit: PropTypes.func,
    debounceTime: PropTypes.number
  }

  constructor (props) {
    super(props)
  }

  componentDidUpdate(prevProps) {
    const values = prevProps.formValues
    const newValues = this.props.formValues
    const didInputChange = values.length !== newValues.length || values.some((v, i) => v !== newValues[i])
    const isAllValuesEmpty = newValues.every(value => !value) 
    
    const isSameItemKey = prevProps.itemKeyBeingEdited === this.props.itemKeyBeingEdited


    if (didInputChange && isSameItemKey && !isAllValuesEmpty) {
      this.handleEdit()
    }
  }


  handleEdit = debounce(() => {
    this.props.onEdit && this.props.onEdit();
  }, this.props.debounceTime || defaultDebounceTime)


  render() {
    return this.props.children || null;
  }
}


export default FormInputController