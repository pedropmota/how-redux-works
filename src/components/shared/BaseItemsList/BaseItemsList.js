import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faQuestionCircle, faExclamationCircle, faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import './BaseItemsList.scss';
import BaseTooltip from "../BaseTooltip/BaseTooltip";
import { Transition } from "react-spring";
  

class BaseItemsList extends React.Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      errorMessage: PropTypes.string
    })).isRequired,

    selectedId: PropTypes.string,

    onItemSelection: PropTypes.func.isRequired,

    onItemDeletion: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)

    this.panelRef = React.createRef()
  }

  componentDidUpdate(prevProps) {
    const hasNewItem = this.props.items.length > prevProps.items.length

    if (hasNewItem) {
      this.scrollToBottom()
    }
  }

  scrollToBottom() {
    const panel = this.panelRef.current
    panel.scrollTop = panel.scrollHeight
  }

  render() {
    const { items, title, selectedId, onItemSelection, onItemDeletion, ...props } = this.props

    return (
      <div
        className={`items-list ${!items.length ? 'empty' : ''}`}
        ref={this.panelRef}
        {...props}>
        
        { items.length ?
          <span className="title">{title}</span>
          : null}

        {/* {!items.length ?
          <div>
            (Your items will be listed here.)
          </div> : null} */}

        <div className="items-list-container">
          <Transition 
            items={items}
            keys={(item) => item.id}
            from={{ opacity: 0, transform: 'translate3d(0, 30px, 0)' }}
            enter={{ opacity: 1, transform: 'translate3d(0, 0px, 0)' }}
            leave={{ opacity: 0 }}
            initial={null}>

            {item => transitionProps => {

              const isSelected = item.id === selectedId
              return (
                <div
                  //key={item.id}
                  style={transitionProps}
                  className={`items-list-item ${isSelected ? 'selected' : ''}`}>
                  
                  <span
                    className={`items-list-name`}
                    onClick={e => onItemSelection(item)}>
                    {item.name || '(unnamed)'}

                    <BaseTooltip
                      style={{ opacity: isSelected ? 1 : 0 }}
                      content={'Editing'}>
                      <FontAwesomeIcon icon={faPencilAlt} className="pencil-icon" />
                    </BaseTooltip>
                  </span>
                  
                  {item.errorMessage ?
                    <BaseTooltip
                      content={`Error: ` + item.errorMessage}>
                        <span
                          className='items-list-error'
                          //title={item.errorMessage}
                          >
                            <FontAwesomeIcon icon={faExclamationCircle} className="error-icon" />
                        </span>
                      </BaseTooltip>
                    : null
                  }

                  {/* <BaseTooltip
                    content={'Delete'}> */}
                    <button
                      title="Delete"
                      className="items-list-delete"
                      onClick={e => onItemDeletion(item)}>
                        <FontAwesomeIcon icon={faTrashAlt} className="delete-icon" />
                    </button>
                  {/* </BaseTooltip> */}
                </div>
              )}

            }


              {/* <div style={{...props, position: 'absolute' }}>{item.page}</div> */}
            
          </Transition>
        </div>
        
      </div>
    )
  }
}

export default BaseItemsList;