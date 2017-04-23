import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import TextEditor from './TextEditor';
import { buttonPressed, compileStart } from './actions';
import { connect } from 'react-redux';


const mapStateToProps = (state) => {
  return state;
};

const mapDispatchToProps = (dispatch) => {
  return {
    codeChange: (newCode) => {
      dispatch(compileStart(newCode))
    },
    buttonPress: (text) => {
      dispatch(buttonPressed(text))
    }
  }
}

export class App extends Component {
  compileCode = () => {
    //This function should dispatch an event to TextEditor, get its content and combine scripts
    console.log('Button was clicked, with this context as:', this);
    this.props.buttonPress(this.props.code);
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <TextEditor code={this.props.code} codeChange={this.props.codeChange}/>
        <button onClick={this.compileCode}>
          Flash to Arduino
        </button>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(App);
