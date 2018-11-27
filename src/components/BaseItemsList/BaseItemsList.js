import React from "react";
import './BaseItemsList.scss';
  

class BaseItemsList extends React.Component {

  constructor(props) {
    super(props)
  }

  //Turned into class component just to use ref and control the fieldset:
  render() {

    const { items, title, idProp, nameProp, errorProp, selectedId, handleItemSelection, handleItemDeletion, listRef, ...props } = this.props

    return (
      <fieldset 
        className={`items-list ${!items.length ? 'empty' : ''}`}
        ref={listRef}
        {...props}>
        
        <legend>{title}</legend>

        {items.map((item) => {
          const id = item[idProp]
          const name = item[nameProp]
          const error = item[errorProp]
          const isSelected = selectedId === id

          return (
            <div
              key={id}
              className={`items-list-item ${isSelected ? 'selected' : ''}`}>
              
              <span
                className={`items-list-name`}
                onClick={e => handleItemSelection(item)}>
                {name || '(unnamed)'}
                {isSelected ? '(editing)' : null}
              </span>
              
              {error ?
                <span
                  className='items-list-error'
                  title={error}
                  >(error)</span>
                : null
              }

              <button
                className="items-list-delete"
                onClick={e => handleItemDeletion(item)}>
              Delete 
              </button>
            </div>
          )}
        )}
      </fieldset>
    )
  }
}

export default BaseItemsList;