import React from "react";
import './BaseItemsList.scss';
  
export default function BaseItemsList({ items, getId, getName, selectedId, handleItemSelection, handleItemDeletion }) {
  return (
    <div className="items-list">
      {items.map((item) => {
        const id = getId(item)
        const name = getName(item)

        return (
          <div
            key={id}
            className={`items-list-item ${selectedId === id ? 'selected' : ''}`}>
            <span
              onClick={e => handleItemSelection(item)}>
              {name}</span>
            
            <button
              onClick={e => handleItemDeletion(item)}>
            Delete 
            </button>
          </div>
        )}
      )}
    </div>
  )
}