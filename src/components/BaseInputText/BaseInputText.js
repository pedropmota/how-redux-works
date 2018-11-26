import React from "react";

const BaseInputText = ({ name, value, placeholder, onChange, ...props }) =>
  <input
    type="text"
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    {...props}
    />

export default BaseInputText;