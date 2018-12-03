import React from "react";
import PropTypes from "prop-types";
import debounce from "debounce-promise";

const defaultDebounceTime = 800;

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
    
    const isSameItemKey = prevProps.itemKeyBeingEdited === this.props.itemKeyBeingEdited

    if (didInputChange && isSameItemKey) {
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