import React from "react";
import './BaseItemsList.scss';
  
export default function BaseItemsList({ items, getId, getName, getError, getIsSelected, handleItemSelection, handleItemDeletion }) {
  return (
    <div className="items-list">
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
              {name}
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
    </div>
  )
}