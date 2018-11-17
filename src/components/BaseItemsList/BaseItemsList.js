import React from "react";
import './BaseItemsList.scss';
  
export default function BaseItemsList({ items, getId, getName, getIsSelected, handleItemSelection, handleItemDeletion }) {
  return (
    <div className="items-list">
      {items.map((item) => {
        const id = getId(item)
        const name = getName(item)
        const isSelected = getIsSelected(item);

        return (
          <div
            key={id}
            className={`items-list-item ${isSelected ? 'selected' : ''}`}>
            
            <span
              className={`items-list-name`}
              onClick={e => handleItemSelection(item)}>
              {name}</span>
            
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