import jsdom from 'jsdom';

global.navigator = 'gecko';
global.document = jsdom.jsdom();
global.window = global.document.defaultView;

global.document.body.createTextRange = () => {
	return {
		setEnd : jest.fn(),
		setStart : jest.fn(),
		getBoundingClientRect : () => {right : 0},
		getClientRects : () => []
	};
}