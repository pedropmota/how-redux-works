import React from "react";
import PropTypes from "prop-types";
import './BaseItemsList.scss';
  

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
        
        <span className="title">{title}</span>

        {!items.length ?
          <div>
            (Your items will be listed here.)
          </div> : null}

        {items.map((item) => {
          const isSelected = item.id === selectedId
          return (
            <div
              key={item.id}
              className={`items-list-item ${isSelected ? 'selected' : ''}`}>
              
              <span
                className={`items-list-name`}
                onClick={e => onItemSelection(item)}>
                {item.name || '(unnamed)'}
                {isSelected ? '(editing)' : null}
              </span>
              
              {item.errorMessage ?
                <span
                  className='items-list-error'
                  title={item.errorMessage}
                  >(error)</span>
                : null
              }

              <button
                className="items-list-delete"
                onClick={e => onItemDeletion(item)}>
              Delete 
              </button>
            </div>
          )}
        )}
      </div>
    )
  }
}

export default BaseItemsList;