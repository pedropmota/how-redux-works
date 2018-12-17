import React from "react";
import PropTypes from "prop-types";
import './BaseButton.scss';

const clickedAnimationTime = 500;

export default class BaseButton extends React.Component {

  static propTypes = {
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    disabled: PropTypes.bool
  }

  state = {
    clicked: false
  }

  constructor(props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    this.props.onClick();

    this.setState({ clicked: true })
    setTimeout(() => {
      this.setState({ clicked: false })
    }, clickedAnimationTime)
  }

  render() {

    const { text, onClick, disabled, ...props } = this.props

    return (
      <button
        className={`base-button ${this.state.clicked ? 'clicked' : ''}`}
        onClick={this.handleClick}
        disabled={disabled ? 'disabled' : ''}
        {...props}>
        
        { text }

      </button>
    )
  }
}
