import React from 'react'
import { Popup } from 'semantic-ui-react'
import { Transition } from 'react-spring';

const BaseTooltip = ({ children, content, ...props }) =>
  <Popup
    basic //Doesn't display the "arrow"
    trigger={children}
    content={content}
    {...props } />

export default BaseTooltip
