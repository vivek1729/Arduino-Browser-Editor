import React from 'react';
import { shallow }  from 'enzyme';
import ReactDOM from 'react-dom';
import connectedApp, { App } from './App'


function setup() {

  const appWrapper = shallow(<App />)
  const connectedAppWrapper = shallow(<connectedApp />)

  return {
    appWrapper,
    connectedAppWrapper
  }
}

describe('App smoke tests', () => {
	let { appWrapper, connectedAppWrapper } = setup()
	it('App component renders without crashing', () => {  
	  expect(appWrapper).toHaveLength(1);
	});

});
