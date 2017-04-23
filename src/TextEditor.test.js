import React from 'react';
import ReactDOM from 'react-dom';
import TextEditor from './TextEditor';

describe('TextEditor Setup', () => {
	it('renders without crashing', () => {
	  const div = document.createElement('div');
	  ReactDOM.render(<TextEditor />, div);
	});

	it('checks initial state', () => {
	  const div = document.createElement('div');
	  //const element = (<TextEditor />);
	  const element = ReactDOM.render(<TextEditor />, div);
	  const init_options = element.state;
	  expect(init_options).toHaveProperty('code');
  	  expect(init_options).toHaveProperty('code', 'Hello world');
	});
});
