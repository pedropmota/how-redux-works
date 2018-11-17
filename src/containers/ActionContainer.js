import { connect } from "react-redux";
import { addAction, editAction, deleteAction } from "../actions";
import ActionsSection from "../components/ActionsSection/ActionsSection";

const mapStateToProps = state => ({
  actions: state.actions
})

const mapDispatchToProps = dispatch => ({
  onAddAction: ({ name, definition }) => {
    dispatch(addAction(name, definition))
  },
  onEditAction: ({ id, name, definition }) => {
    dispatch(editAction(id, name, definition))
  },
  onDeleteAction: (id) => {
    dispatch(deleteAction(id))
  }
})

const ActionContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ActionsSection)

export default ActionContainer