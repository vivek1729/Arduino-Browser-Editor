import * as command from './actions'


let dummycode = `var Cylon = require('cylon');\n\nCylon.start();`

const deafaultState = {
	is_compiling : false,
	code : dummycode,
	compiled : false,
	snippet_one : `'use strict';`,
	snippet_two : `console.log('hello world');`,
	combined_code : null
}

const codeReducer = (state=deafaultState,action) => {

	switch (action.type) {
	    case command.BUTTON_PRESSED:{
	    	/* Here I am just concatenating the strings 
	    	* but I will have to get snippet_one and snippet_two from the localstorage
	    	* and then I need to compile and set results to combined_code and set flags acccordingly
	    	*/
	    	console.log('Button pressed dispatched to reducer with action',action);
	    	return {
	    		...state, 
	    		is_compiling:false,
	    		compiled: true,
	    		combined_code : state.snippet_one + state.code + state.snippet_two
	    	}
	    	
	    }
	    case command.COMPILE_START:{
	    	console.log('Update code in state',action);
	    	return {...state, is_compiling: true, code: action.code}
	    }
	    default:
	      return state
  }

}

export default codeReducer