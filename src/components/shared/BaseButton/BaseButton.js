import React from "react";

const BaseButton = ({ text, onClick, disabled, ...props }) => 
  <button
    onClick={onClick}
    disabled={disabled ? 'disabled' : ''}
    {...props}
    >
    
    { text }

  </button>


export default BaseButton;