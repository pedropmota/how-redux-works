import React from "react";

const BaseInputText = ({ name, value, placeholder, onChange, style }) =>
  <input
    type="text"
    style={style}
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    />

export default BaseInputText;