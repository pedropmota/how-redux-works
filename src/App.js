import React, { Component } from 'react';
import logo from './logo.svg';
import './App.scss';
import ActionContainer from './containers/ActionContainer';
import ReducerContainer from "./containers/ReducerContainer";
import StoreContainer from "./containers/StoreContainer";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          {/* <img src={logo} className="App-logo" alt="logo" /> */}
          <h2>HOW_REDUX_WORKS</h2>
          <h4>An interactive tutorial of Redux and the Flux pattern.</h4>
        </header>

        <div className="App-main-container">

          <ActionContainer />
          
          <ReducerContainer />
          
          <StoreContainer />
        
        </div>

        <footer className="App-footer">
          Footer content
        </footer>
      </div>
    );
  }
}

export default App;
