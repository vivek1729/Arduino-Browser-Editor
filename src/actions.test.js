import * as actions from './actions';

describe('Action creator tests', () => {
  it('should create a button press action', () => {
    const text = 'foo bar'
    const expectedAction = {
      type: actions.BUTTON_PRESSED,
      text
    }
    expect(actions.buttonPressed(text)).toEqual(expectedAction)
  });

  it('should create a compile code action', () => {
    const code = 'foo bar'
    const expectedAction = {
      type: actions.COMPILE_START,
      code
    }
    expect(actions.compileStart(code)).toEqual(expectedAction)
  });
});