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
          <img src={logo} className="App-logo" alt="logo" />
        </header>

        <div style={{display: 'flex'}}>

          <ActionContainer />
          
          <ReducerContainer />
          
          <StoreContainer />
        
        </div>
      </div>
    );
  }
}

export default App;
