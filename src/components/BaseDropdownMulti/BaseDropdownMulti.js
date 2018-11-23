import React from "react";
import Select from "react-select";
import makeAnimated from "react-select/lib/animated";
import PropTypes from "prop-types";

const whiteBackground = { backgroundColor: 'yellow' }

const dropdownStyles = {

  control: styles => ({ 
    ...styles, 
    //...whiteBackground 
  }),

  options: (styles, { data, isDisabled, isFocused, isSelected }) => {
    
    return {
      ...styles,
      //...whiteBackground
    }
  },

  multiValue: (styles, { data }) => {
    return {
      ...styles,
      //...whiteBackground
    };
  },

  // multiValueLabel: (styles, { data }) => ({
  //   ...styles,
  //   color: data.color,
  // }),

  // multiValueRemove: (styles, { data }) => ({
  //   ...styles,
  //   color: data.color,
  //   ':hover': {
  //     backgroundColor: data.color,
  //     color: 'white',
  //   },
  // }),

  menu:  (styles, { data }) => ({
      ...styles,
      zIndex: 99999
    
  }),

  menuList:  (styles, { data }) => ({
    ...styles,
    //...whiteBackground
  
}),

menuValue:  (styles, { data }) => ({
  ...styles,
  //...whiteBackground

}),

}


const BaseDropdownMulti = ({ options, value, placeholder, onChange }) =>
  <Select 
    placeholder={placeholder}
    isMulti
    closeMenuOnSelect={false}
    component={makeAnimated()}
    options={options}
    value={value}
    styles={dropdownStyles}
    onChange={onChange} //function param: onChange([{ label, value }])
    className='react-select-container' 
    classNamePrefix="react-select"

    //menuIsOpen={true}
    />


const itemsListPropType = PropTypes.arrayOf(PropTypes.shape({ 
  value: PropTypes.string,
  label: PropTypes.string
}))

BaseDropdownMulti.propTypes = {
  options: itemsListPropType.isRequired,
  value: itemsListPropType,
  onChange: PropTypes.func.isRequired
}

export default BaseDropdownMulti;
