import React from 'react';
import PropTypes from 'prop-types';
import { Transition, Spring, config } from 'react-spring';


//HOC as an alternative:
export const withMessageHandler = (Component) => 
  (props) => 
    <MessageHandler {...props}>
      <Component />
    </MessageHandler>
  

const messageTimeouts = {
  success: 1500,
  error: 2200
};

const getTimeoutTime = (messageType) =>
  messageType === 'success' ? messageTimeouts.success : messageTimeouts.error

export default class MessageHandler extends React.Component {

  static propTypes = {
    children: PropTypes.element
  }
  
  state = {
    message: null,
    messageType: null,
    isDisplaying: false,
    timeoutRef: null,
  }

  constructor(props) {
    super(props)

    this.addMessage = this.addMessage.bind(this)
    this.renderMessage = this.renderMessage.bind(this)
    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
  }


  addMessage(message, type = 'success') {
    if (!['success', 'error'].includes(type))
      throw new Error(`Type "${type}" is invalid for the addMessage call`);

    this.setState({
      message: message,
      messageType: type,
      isDisplaying: true,
      timeoutRef: this.startMessageTimeout(getTimeoutTime(type))
    })
  }

  startMessageTimeout(time) {
    time = time || getTimeoutTime(this.state.messageType)

    clearTimeout(this.state.timeoutRef)

    return setTimeout(() => {
      this.setState({
        isDisplaying: false,
      })
    }, time)
  }


  handleMouseEnter() {
    clearTimeout(this.state.timeoutRef)
  }

  handleMouseLeave() {
    this.startMessageTimeout()
  }

  renderMessage() {
    return (
      <Transition
        items={this.state.message && this.state.isDisplaying}
        from={{ opacity: 0 }}
        enter={{ opacity: 1 }}
        leave={{ opacity: 0 }}>
        
        {show => 
          !show ? null :
          (springProps =>
            <div
              onMouseEnter={this.handleMouseEnter}
              onMouseLeave={this.handleMouseLeave}
              className={`message-handler-message ${this.state.messageType}`}
              style={springProps}
              >
              {this.state.message}
            </div>
          )
        }

      </Transition>
    )
  }


  render() {
    const component = this.props.children;

    const propsToPass = {
      ...this.props,
      addMessageToHandler: this.addMessage, 
      renderMessageFromHandler: this.renderMessage,
    }

    return (
      <>
        {React.cloneElement(component, propsToPass)}
      </>
    )
  }
}