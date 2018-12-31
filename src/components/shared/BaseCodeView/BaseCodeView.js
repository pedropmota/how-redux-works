import React from 'react';
import Highlight from 'react-highlight';
import 'highlight.js/styles/atelier-sulphurpool-light.css';

const BaseCodeView = ({ code, language = 'javascript' }) =>
  <Highlight language={language}>
    {code}
  </Highlight>


export default BaseCodeView;