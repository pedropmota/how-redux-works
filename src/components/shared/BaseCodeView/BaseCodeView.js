import React from 'react';
import Highlight from 'react-highlight';
import 'highlight.js/styles/atelier-sulphurpool-light.css';
import './BaseCodeView.scss';

const BaseCodeView = ({ code, language = 'javascript', ...props }) =>
  <div 
    className={`base-code-view ${props.className}`}
    {...props}>
    <Highlight 
      language={language}>
      {code}
    </Highlight>
  </div>


export default BaseCodeView;