import { connect } from "react-redux";
import { addAction, editAction, deleteAction, setSelectedAction } from "../actions";
import ActionsSection from "../components/views/ActionsSection/ActionsSection";

const mapStateToProps = state => ({
  actions: state.actions,
  selectedActionId: state.selectedItems.action
})

const mapDispatchToProps = dispatch => ({
  addAction: ({ name, definition }) => {
    dispatch(addAction(name, definition))
  },
  editAction: ({ id, name, definition }) => {
    dispatch(editAction(id, name, definition))
  },
  deleteAction: (id) => {
    dispatch(deleteAction(id))
  },
  setSelectedAction: (id) => {
    dispatch(setSelectedAction(id))
  }
})

const ActionContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ActionsSection)

export default ActionContainer