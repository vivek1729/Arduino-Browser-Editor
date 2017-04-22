import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import TextEditor from './TextEditor';
import { buttonPressed } from './actions';
import { connect } from 'react-redux';


const mapStateToProps = (state) => {
  return state;
};

class App extends Component {
  compileCode = () => {
    //This function should dispatch an event to TextEditor, get its content and combine scripts
    console.log('Button was clicked, with this context as:', this);
    this.props.dispatch(buttonPressed(this.props.code));
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <TextEditor code={this.props.code} dispatch={this.props.dispatch}/>
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

export default connect(mapStateToProps)(App);
