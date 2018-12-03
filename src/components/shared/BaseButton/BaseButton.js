import React from "react";

const BaseButton = ({ text, onClick, ...props }) => 
  <button
    onClick={onClick}
    {...props}
    >
    
    { text }

  </button>


export default BaseButton;