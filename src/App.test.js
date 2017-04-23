import React from 'react';
import { shallow }  from 'enzyme';
import { App } from './App'


function setup() {

  const enzymeWrapper = shallow(<App />)

  return {
    enzymeWrapper
  }
}

it('App component renders without crashing', () => {
  const { enzymeWrapper } = setup()
  expect(enzymeWrapper).toHaveLength(1);
});
