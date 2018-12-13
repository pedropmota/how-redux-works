import React from "react";

import Select from "react-select";
import makeAnimated from "react-select/lib/animated";

const dropdownStyles = {
  control: style => ({
    ...style,
    fontSize: '16px'
  }),
  menu: style => ({
    ...style,
    fontSize: '14px',
    zIndex: 99999
  })
}


const groupStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};
const groupBadgeStyles = {
  backgroundColor: '#EBECF0',
  borderRadius: '2em',
  color: '#172B4D',
  display: 'inline-block',
  fontSize: 12,
  fontWeight: 'normal',
  lineHeight: '1',
  minWidth: 1,
  padding: '0.16666666666667em 0.5em',
  textAlign: 'center',
};

const formatGroupLabel = data => (
  <div style={groupStyles}>
    <span>{data.label}</span>
    {/* <span style={groupBadgeStyles}>{data.options.length}</span> */}
  </div>
);


class BaseDropdownGrouped extends React.Component {

  render() {

    const { groupedOptions, onChange, placeholder } = this.props;

    return(
      <Select
        placeholder={placeholder}
        options={groupedOptions}
        formatGroupLabel={formatGroupLabel}
        onChange={onChange} //function param: onChange({ label, value })
        styles={dropdownStyles}
        {...this.props}
        />
    )
  }
}


export default BaseDropdownGrouped;