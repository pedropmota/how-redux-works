

/**
 * The store is saved on the localStorage by version.
 */
const storeVersion = '1.1';
const storeKey = `current-store-v${storeVersion}`;

export const getStoredState = function() {
  const value = localStorage.getItem(storeKey);
  return value ? JSON.parse(value) : null
}

export const storeState = function(state) {
  const toStore = {
    actions: state.actions,
    reducers: state.reducers
  }

  localStorage.setItem(storeKey, JSON.stringify(toStore))
}