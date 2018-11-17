import { connect } from "react-redux";
import { dispatchAction } from "../actions";
import StoreSection from "../components/StoreSection/StoreSection";

const mapStateToProps = state => {
  const userStore = state.store ? state.store.store : null
  return {
    currentState: userStore ? userStore.getState() : null,
    currentActions: state.actions
  }
}

const mapDispatchToProps = dispatch => ({
  onDispatch: ({ input, currentActions }) => {
    dispatch(dispatchAction(input, currentActions))
  }
})

const StoreContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(StoreSection)

export default StoreContainer