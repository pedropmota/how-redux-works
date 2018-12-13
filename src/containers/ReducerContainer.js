import { connect } from "react-redux";
import { addReducer, editReducer, deleteReducer, addAction, setSelectedReducer } from "../actions";
import ReducersSection from "../components/views/ReducersSection/ReducersSection";

const mapStateToProps = state => ({
  reducers: state.reducers,
  actions: state.actions,
  selectedReducerId: state.selectedItems.reducer
})

const mapDispatchToProps = dispatch => ({
  addReducer: ({ name, definition, actions }) => {
    dispatch(addReducer(name, definition, actions))
  },
  editReducer: ({ id, name, definition, actions }) => {
    dispatch(editReducer(id, name, definition, actions))
  },
  deleteReducer: (id) => {
    dispatch(deleteReducer(id))
  },
  addAction: ({ name, definition }) => {
    dispatch(addAction(name, definition))
  },
  setSelectedReducer: (id) => {
    dispatch(setSelectedReducer(id))
  }
})

const ReducerContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReducersSection)

export default ReducerContainer