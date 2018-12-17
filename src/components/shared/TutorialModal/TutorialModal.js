import React from "react";
import PropTypes from "prop-types";
import { Header, Modal, TransitionablePortal, List } from "semantic-ui-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import { Transition } from 'react-spring';
import './TutorialModal.scss'
import BaseTooltip from "../BaseTooltip/BaseTooltip";

const pageTransitions = {
  duration: {
    enter: 350,
    exit: 0
  },
  defaultStyle: {
    transitionProperty: 'opacity',
    transitionTimingFunction: 'ease'
  },

  transitionStyles: {
    entering: { opacity: 0 },
    entered: { opacity: 1 }
  }
}



export default class TutorialModal extends React.Component {

  static propTypes = {
    pages: PropTypes.array.isRequired
  }

  state = { 
    isOpen: false,
    currentChildIndex: 0,
    transitionDirection: 'left'
  }

  constructor(props) {
    super(props)

    this.attachKeyPressEvent = this.attachKeyPressEvent.bind(this)
    this.removeKeyPressEvent = this.removeKeyPressEvent.bind(this)
    this.toggleOpen = this.toggleOpen.bind(this)
    this.goToNext = this.goToNext.bind(this)
    this.goToPrevious = this.goToPrevious.bind(this)
    this.handleKeyPressNav = this.handleKeyPressNav.bind(this)
  }

  hasPrevious() { 
    return this.state.currentChildIndex > 0
  }
  hasNext() {
    return this.state.currentChildIndex < this.props.pages.length - 1
  }

  attachKeyPressEvent() {
    window.addEventListener('keydown', this.handleKeyPressNav)
  }

  removeKeyPressEvent() {
    window.removeEventListener('keydown', this.handleKeyPressNav)
  }

  handleKeyPressNav(event) {
    const keyName = event.key;
    
    if (keyName === 'ArrowLeft' || keyName === 'ArrowUp')
      this.goToPrevious()

    if (keyName === 'ArrowRight' || keyName === 'ArrowDown')
      this.goToNext()
  }

  componentWillUpdate(prevProps, prevState) {
    const prevIndex = prevState.currentChildIndex
    const currentIndex = this.state.currentChildIndex

    if (prevIndex === currentIndex)
      return

    this.setState({
      transitionDirection: currentIndex > prevIndex ? 'left' : 'right'
    })
  }

  toggleOpen() {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  goToNext() {
    if (this.hasNext())
      this.setState({ currentChildIndex: this.state.currentChildIndex + 1 })
  }

  goToPrevious() {
    if (this.hasPrevious())
      this.setState({ currentChildIndex: this.state.currentChildIndex - 1 })
  }

  render() {
    const { isOpen, currentChildIndex, transitionDirection } = this.state

    

    return (
      <div className="tutorialModal main">
        <div class="button-container">
          <BaseTooltip
            content="Tutorial">
            <button onClick={this.toggleOpen} className="tutorial-button">
              <FontAwesomeIcon icon={faQuestionCircle} className="question-icon" />
            </button>
          </BaseTooltip>
        </div>
        <TransitionablePortal 
          open={isOpen} 
          transition={{ animation:'scale', duration: 300 }}
          onOpen={this.attachKeyPressEvent}
          onClose={this.removeKeyPressEvent}
          >          
          <Modal 
            open={true}
            className="tutorialModal modal"
            onClose={this.toggleOpen}
            closeOnDimmerClick={true}
            closeIcon>
            <Modal.Header>Tutorial</Modal.Header>
            <Modal.Content>
            <div>
              <div className="pages-container">
                
                <Transition 
                  items={this.props.pages.map((page, i) => ({ page, i })).filter(item => item.i === currentChildIndex)} 
                  
                  keys={(item) => item.i}
                  from={{ opacity: 0 }}
                  enter={{ opacity: 1 }}
                  leave={{ opacity: 0 }}>

                  {item => props =>
                    <div style={{...props, position: 'absolute' }}>{item.page}</div>
                  }
                </Transition>

                {/* Dummy: occupies the space since the elements being displayed are absolute positioned: */}
                <div style={{ opacity: 0, visibility: 'hidden' }}>
                  {this.props.pages[currentChildIndex]}                
                </div>


             
              </div>
              </div>   
              <div className="nav-buttons">
                {<a 
                  className={`nav button ${!this.hasPrevious() ? 'disabled' : ''}`}
                  onClick={() => {  }}>
                  Previous </a>}
                  
                  {this.props.pages.map((page, i) =>
                    <a
                     className={`nav page ${i === currentChildIndex ? 'disabled' : ''}`}
                     onClick={() => { this.setState({ currentChildIndex: i })}}
                     >
                     {i === currentChildIndex ? '●' : '○'}
                     </a>
                  )}

                {<a 
                  className={`nav button ${!this.hasNext() ? 'disabled' : ''}`}
                  onClick={() => { this.setState({ currentChildIndex: currentChildIndex + 1 }) }}>
                  Next </a>}
              </div>

            </Modal.Content>
          </Modal>
        </TransitionablePortal>
      </div>
    )
  }



}