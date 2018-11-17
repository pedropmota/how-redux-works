import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ActionContainer from './containers/ActionContainer';
import ReducerContainer from "./containers/ReducerContainer";
import StoreContainer from "./containers/StoreContainer";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>

        <div style={{display: 'flex'}}>

          <div>
            <ActionContainer />
          </div>
          <div>
            <ReducerContainer />
          </div>
            <StoreContainer />
        </div>
      </div>
    );
  }
}

export default App;
