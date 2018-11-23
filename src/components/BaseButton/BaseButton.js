import React from "react";

const BaseButton = ({ text, onClick, style }) => 
  <button
    style={style}
    onClick={onClick}>

    { text }

  </button>


export default BaseButton;