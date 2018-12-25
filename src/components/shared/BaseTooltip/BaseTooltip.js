import React from 'react'
import { Tooltip } from 'react-tippy'
import { Transition } from 'react-spring';
import 'react-tippy/dist/tippy.css'

const BaseTooltip = ({ children, content, ...props }) =>
  <Tooltip
    title={content}
    theme="light"
    {...props }>
    {children}
  </Tooltip>

export default BaseTooltip
