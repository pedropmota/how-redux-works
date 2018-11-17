import uuidv1 from "uuid/v1";


/**
 * Discontinuing this logic. Ids would go back to "1" if we remove all items from the array (could cause bugs)
 * Gets the next (auto-increment) id to be stored.
 * @param {Array} storeItems 
 * @param {string} idPropName - The "id" property name to look into.
 */
export const getNextId = function (storeItems, idPropName = 'id') {
  if (!storeItems || !storeItems.length)
    return '1';

  const existingIds = storeItems.map(item => {
    if (!item)
      throw new Error(`Item in the array can't be null or undefined`);

    const id = parseInt(item[idPropName])

    if (isNaN(id))
      throw new Error(`Item ${idPropName} is not a number: ${id}`);

    return id;
  });

  return (Math.max.apply(null, existingIds) + 1).toString();
}

export const newUuid = function() {
  return uuidv1();
}