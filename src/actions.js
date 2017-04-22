/*
 * action types
 */

export const BUTTON_PRESSED = 'BUTTON_PRESSED'
export const COMPILE_START = 'COMPILE_START'
// export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER'

/*
 * other constants
 */
/*
 * action creators
 */

export const buttonPressed = (text) => {
  return { type: BUTTON_PRESSED, text }
}


export const compileStart = (code) => {
  return { type: COMPILE_START, code }
}
