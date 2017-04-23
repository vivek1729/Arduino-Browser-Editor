import codeReducer from './reducers.js';
import * as actions from './actions';


let dummycode = `var Cylon = require('cylon');\n\nCylon.start();`

const deafaultState = {
	is_compiling : false,
	code : dummycode,
	compiled : false,
	snippet_one : `'use strict';`,
	snippet_two : `console.log('hello world');`,
	combined_code : null
}

describe('Code reducer', () => {

  it('should return the initial state', () => {
    expect(
      codeReducer(undefined, {})
    ).toEqual(deafaultState)
  });

  it('should handle button pressed action', () => {
    expect(
      codeReducer(undefined, {
      	type : actions.BUTTON_PRESSED
      })
    ).toMatchObject({
    	is_compiling:false,
	    compiled: true
    });
  });

  it('should handle compile code action', () => {
    expect(
      codeReducer(undefined, {
      	type : actions.COMPILE_START,
      	code : 'foo'
      })
    ).toMatchObject({
    	is_compiling:true,
	    code: 'foo'
    });
  });

});