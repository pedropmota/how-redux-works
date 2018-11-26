import React from "react";
import './BaseItemsList.scss';
  
export default function BaseItemsList({ items, getId, getName, getError, getIsSelected, handleItemSelection, handleItemDeletion }) {
  
  const isEmpty = !items.length

  return (
    <fieldset className={`items-list ${isEmpty ? 'empty' : ''}`}>
      <legend>Your reducers</legend>

      {items.map((item) => {
        const id = getId(item)
        const name = getName(item)
        const error = getError(item)
        const isSelected = getIsSelected(item);

        return (
          <div
            key={id}
            className={`items-list-item ${isSelected ? 'selected' : ''}`}>
            
            <span
              className='items-list-name'
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