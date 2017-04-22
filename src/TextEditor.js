import React, { Component } from 'react';
import CodeMirror from 'react-codemirror'
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css'
import './material.css';
import { compileStart } from './actions';

class TextEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {code: 'Hello world'};
  }

  updateCode = (newCode) => {
    //Dispatch event for newCode, update state and stuff

    this.props.dispatch(compileStart(newCode));
  }

  render() {
    const options = {
        lineNumbers: true,
        mode: 'javascript',
        theme: 'material'
    };

    return (
      <div>
        <CodeMirror value={this.props.code} onChange={this.updateCode} options={options} />
      </div>
    );
  }
}

export default TextEditor;
