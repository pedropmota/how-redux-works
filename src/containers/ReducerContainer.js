import { connect } from "react-redux";
import { addReducer, deleteReducer } from "../actions";
import ReducersSection from "../components/ReducersSection/ReducersSection";

const mapStateToProps = state => ({
  reducers: state.reducers,
  actions: state.actions
})

const mapDispatchToProps = dispatch => ({
  onAddReducer: ({ name, definition, actions }) => {
    dispatch(addReducer(name, definition, actions))
  },
  onDeleteReducer: (id) => {
    dispatch(deleteReducer(id))
  }
})

const ReducerContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReducersSection)

export default ReducerContainer