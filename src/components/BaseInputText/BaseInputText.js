import React from "react";

export default BaseInputText = ({ name, value, placeholder, onChange }) =>
  <input
    type="text"
    style={style}
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    />