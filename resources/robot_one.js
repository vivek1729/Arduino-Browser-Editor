require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function(element) {
  function logHTML(arr) {
    var div = document.createElement("div"),
        text = document.createTextNode(arr.join(""));

    div.appendChild(text);
    element.appendChild(div);
  }

  var Logger = {
    log: function() {
      var args = [].slice.call(arguments, 0);
      logHTML(args);
    }
  };

  ['debug', 'info', 'warn', 'error', 'fatal'].forEach(function(type) {
    Logger[type] = Logger.log;
  });

  return Logger;
};

},{}],2:[function(require,module,exports){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)
	var PLUS_URL_SAFE = '-'.charCodeAt(0)
	var SLASH_URL_SAFE = '_'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS ||
		    code === PLUS_URL_SAFE)
			return 62 // '+'
		if (code === SLASH ||
		    code === SLASH_URL_SAFE)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

},{}],3:[function(require,module,exports){
(function (process,__filename){

/**
 * Module dependencies.
 */

var fs = require('fs')
  , path = require('path')
  , join = path.join
  , dirname = path.dirname
  , exists = fs.existsSync || path.existsSync
  , defaults = {
        arrow: process.env.NODE_BINDINGS_ARROW || ' → '
      , compiled: process.env.NODE_BINDINGS_COMPILED_DIR || 'compiled'
      , platform: process.platform
      , arch: process.arch
      , version: process.versions.node
      , bindings: 'bindings.node'
      , try: [
          // node-gyp's linked version in the "build" dir
          [ 'module_root', 'build', 'bindings' ]
          // node-waf and gyp_addon (a.k.a node-gyp)
        , [ 'module_root', 'build', 'Debug', 'bindings' ]
        , [ 'module_root', 'build', 'Release', 'bindings' ]
          // Debug files, for development (legacy behavior, remove for node v0.9)
        , [ 'module_root', 'out', 'Debug', 'bindings' ]
        , [ 'module_root', 'Debug', 'bindings' ]
          // Release files, but manually compiled (legacy behavior, remove for node v0.9)
        , [ 'module_root', 'out', 'Release', 'bindings' ]
        , [ 'module_root', 'Release', 'bindings' ]
          // Legacy from node-waf, node <= 0.4.x
        , [ 'module_root', 'build', 'default', 'bindings' ]
          // Production "Release" buildtype binary (meh...)
        , [ 'module_root', 'compiled', 'version', 'platform', 'arch', 'bindings' ]
        ]
    }

/**
 * The main `bindings()` function loads the compiled bindings for a given module.
 * It uses V8's Error API to determine the parent filename that this function is
 * being invoked from, which is then used to find the root directory.
 */

function bindings (opts) {

  // Argument surgery
  if (typeof opts == 'string') {
    opts = { bindings: opts }
  } else if (!opts) {
    opts = {}
  }
  opts.__proto__ = defaults

  // Get the module root
  if (!opts.module_root) {
    opts.module_root = exports.getRoot(exports.getFileName())
  }

  // Ensure the given bindings name ends with .node
  if (path.extname(opts.bindings) != '.node') {
    opts.bindings += '.node'
  }

  var tries = []
    , i = 0
    , l = opts.try.length
    , n
    , b
    , err

  for (; i<l; i++) {
    n = join.apply(null, opts.try[i].map(function (p) {
      return opts[p] || p
    }))
    tries.push(n)
    try {
      b = opts.path ? require.resolve(n) : require(n)
      if (!opts.path) {
        b.path = n
      }
      return b
    } catch (e) {
      if (!/not find/i.test(e.message)) {
        throw e
      }
    }
  }

  err = new Error('Could not locate the bindings file. Tried:\n'
    + tries.map(function (a) { return opts.arrow + a }).join('\n'))
  err.tries = tries
  throw err
}
module.exports = exports = bindings


/**
 * Gets the filename of the JavaScript file that invokes this function.
 * Used to help find the root directory of a module.
 * Optionally accepts an filename argument to skip when searching for the invoking filename
 */

exports.getFileName = function getFileName (calling_file) {
  var origPST = Error.prepareStackTrace
    , origSTL = Error.stackTraceLimit
    , dummy = {}
    , fileName

  Error.stackTraceLimit = 10

  Error.prepareStackTrace = function (e, st) {
    for (var i=0, l=st.length; i<l; i++) {
      fileName = st[i].getFileName()
      if (fileName !== __filename) {
        if (calling_file) {
            if (fileName !== calling_file) {
              return
            }
        } else {
          return
        }
      }
    }
  }

  // run the 'prepareStackTrace' function above
  Error.captureStackTrace(dummy)
  dummy.stack

  // cleanup
  Error.prepareStackTrace = origPST
  Error.stackTraceLimit = origSTL

  return fileName
}

/**
 * Gets the root directory of a module, given an arbitrary filename
 * somewhere in the module tree. The "root directory" is the directory
 * containing the `package.json` file.
 *
 *   In:  /home/nate/node-native-module/lib/index.js
 *   Out: /home/nate/node-native-module
 */

exports.getRoot = function getRoot (file) {
  var dir = dirname(file)
    , prev
  while (true) {
    if (dir === '.') {
      // Avoids an infinite loop in rare cases, like the REPL
      dir = process.cwd()
    }
    if (exists(join(dir, 'package.json')) || exists(join(dir, 'node_modules'))) {
      // Found the 'package.json' file or 'node_modules' dir; we're done
      return dir
    }
    if (prev === dir) {
      // Got to the top
      throw new Error('Could not find module root given file: "' + file
                    + '". Do you have a `package.json` file? ')
    }
    // Try the parent dir next
    prev = dir
    dir = join(dir, '..')
  }
}

}).call(this,require('_process'),"/node_modules/bindings/bindings.js")
},{"_process":63,"fs":6,"path":62}],4:[function(require,module,exports){

},{}],5:[function(require,module,exports){
(function (process,Buffer){
'use strict';

var EE = require('events').EventEmitter;
var util = require('util');

var DATABITS = [7, 8];
var STOPBITS = [1, 2];
var PARITY = ['none', 'even', 'mark', 'odd', 'space'];
var FLOWCONTROLS = ['RTSCTS'];

var _options = {
  baudrate: 9600,
  parity: 'none',
  rtscts: false,
  databits: 8,
  stopbits: 1,
  buffersize: 256
};

function convertOptions(options){
  switch (options.dataBits) {
    case 7:
      options.dataBits = 'seven';
      break;
    case 8:
      options.dataBits = 'eight';
      break;
  }

  switch (options.stopBits) {
    case 1:
      options.stopBits = 'one';
      break;
    case 2:
      options.stopBits = 'two';
      break;
  }

  switch (options.parity) {
    case 'none':
      options.parity = 'no';
      break;
  }

  return options;
}

function SerialPort(path, options, openImmediately, callback) {

  EE.call(this);

  var self = this;

  var args = Array.prototype.slice.call(arguments);
  callback = args.pop();
  if (typeof(callback) !== 'function') {
    callback = null;
  }

  options = (typeof options !== 'function') && options || {};

  openImmediately = (openImmediately === undefined || openImmediately === null) ? true : openImmediately;

  callback = callback || function (err) {
    if (err) {
      self.emit('error', err);
    }
  };

  var err;

  options.baudRate = options.baudRate || options.baudrate || _options.baudrate;

  options.dataBits = options.dataBits || options.databits || _options.databits;
  if (DATABITS.indexOf(options.dataBits) === -1) {
    err = new Error('Invalid "databits": ' + options.dataBits);
    callback(err);
    return;
  }

  options.stopBits = options.stopBits || options.stopbits || _options.stopbits;
  if (STOPBITS.indexOf(options.stopBits) === -1) {
    err = new Error('Invalid "stopbits": ' + options.stopbits);
    callback(err);
    return;
  }

  options.parity = options.parity || _options.parity;
  if (PARITY.indexOf(options.parity) === -1) {
    err = new Error('Invalid "parity": ' + options.parity);
    callback(err);
    return;
  }

  if (!path) {
    err = new Error('Invalid port specified: ' + path);
    callback(err);
    return;
  }

  options.rtscts = _options.rtscts;

  if (options.flowControl || options.flowcontrol) {
    var fc = options.flowControl || options.flowcontrol;

    if (typeof fc === 'boolean') {
      options.rtscts = true;
    } else {
      var clean = fc.every(function (flowControl) {
        var fcup = flowControl.toUpperCase();
        var idx = FLOWCONTROLS.indexOf(fcup);
        if (idx < 0) {
          var err = new Error('Invalid "flowControl": ' + fcup + '. Valid options: ' + FLOWCONTROLS.join(', '));
          callback(err);
          return false;
        } else {

          // "XON", "XOFF", "XANY", "DTRDTS", "RTSCTS"
          switch (idx) {
            case 0: options.rtscts = true; break;
          }
          return true;
        }
      });
      if(!clean){
        return;
      }
    }
  }

  options.bufferSize = options.bufferSize || options.buffersize || _options.buffersize;

  // defaults to chrome.serial if no options.serial passed
  // inlined instead of on _options to allow mocking global chrome.serial for optional options test
  options.serial = options.serial || (typeof chrome !== 'undefined' && chrome.serial);

  if (!options.serial) {
    throw new Error('No access to serial ports. Try loading as a Chrome Application.');
  }

  this.options = convertOptions(options);

  this.options.serial.onReceiveError.addListener(function(info){

    switch (info.error) {

      case 'disconnected':
      case 'device_lost':
      case 'system_error':
        err = new Error('Disconnected');
        // send notification of disconnect
        if (self.options.disconnectedCallback) {
          self.options.disconnectedCallback(err);
        } else {
          self.emit('disconnect', err);
        }
        if(self.connectionId >= 0){
          self.close();
        }
        break;
      case 'timeout':
        break;
    }

  });

  this.path = path;

  if (openImmediately) {
    process.nextTick(function () {
      self.open(callback);
    });
  }
}

util.inherits(SerialPort, EE);

SerialPort.prototype.connectionId = -1;

SerialPort.prototype.open = function (callback) {
  var options = {
    bitrate: parseInt(this.options.baudRate, 10),
    dataBits: this.options.dataBits,
    parityBit: this.options.parity,
    stopBits: this.options.stopBits,
    ctsFlowControl: this.options.rtscts
  };

  this.options.serial.connect(this.path, options, this.proxy('onOpen', callback));
};

SerialPort.prototype.onOpen = function (callback, openInfo) {
  if(chrome.runtime.lastError){
    if(typeof callback === 'function'){
      callback(chrome.runtime.lastError);
    }else{
      this.emit('error', chrome.runtime.lastError);
    }
    return;
  }

  this.connectionId = openInfo.connectionId;

  if (this.connectionId === -1) {
    this.emit('error', new Error('Could not open port.'));
    return;
  }

  this.emit('open', openInfo);

  this._reader = this.proxy('onRead');

  this.options.serial.onReceive.addListener(this._reader);

  if(typeof callback === 'function'){
    callback(chrome.runtime.lastError, openInfo);
  }
};

SerialPort.prototype.onRead = function (readInfo) {
  if (readInfo && this.connectionId === readInfo.connectionId) {

    if (this.options.dataCallback) {
      this.options.dataCallback(toBuffer(readInfo.data));
    } else {
      this.emit('data', toBuffer(readInfo.data));
    }

  }
};

SerialPort.prototype.write = function (buffer, callback) {
  if (this.connectionId < 0) {
    var err = new Error('Serialport not open.');
    if(typeof callback === 'function'){
      callback(err);
    }else{
      this.emit('error', err);
    }
    return;
  }

  if (typeof buffer === 'string') {
    buffer = str2ab(buffer);
  }

  //Make sure its not a browserify faux Buffer.
  if (buffer instanceof ArrayBuffer === false) {
    buffer = buffer2ArrayBuffer(buffer);
  }

  this.options.serial.send(this.connectionId, buffer, function(info) {
    if (typeof callback === 'function') {
      callback(chrome.runtime.lastError, info);
    }
  });
};


SerialPort.prototype.close = function (callback) {
  if (this.connectionId < 0) {
    var err = new Error('Serialport not open.');
    if(typeof callback === 'function'){
      callback(err);
    }else{
      this.emit('error', err);
    }
    return;
  }

  this.options.serial.disconnect(this.connectionId, this.proxy('onClose', callback));
};

SerialPort.prototype.onClose = function (callback, result) {
  this.connectionId = -1;
  this.emit('close');

  this.removeAllListeners();
  if(this._reader){
    this.options.serial.onReceive.removeListener(this._reader);
    this._reader = null;
  }

  if (typeof callback === 'function') {
    callback(chrome.runtime.lastError, result);
  }
};

SerialPort.prototype.flush = function (callback) {
  if (this.connectionId < 0) {
    var err = new Error('Serialport not open.');
    if(typeof callback === 'function'){
      callback(err);
    }else{
      this.emit('error', err);
    }
    return;
  }

  var self = this;

  this.options.serial.flush(this.connectionId, function(result) {
    if (chrome.runtime.lastError) {
      if (typeof callback === 'function') {
        callback(chrome.runtime.lastError, result);
      } else {
        self.emit('error', chrome.runtime.lastError);
      }
      return;
    } else {
      callback(null, result);
    }
  });
};

SerialPort.prototype.drain = function (callback) {
  if (this.connectionId < 0) {
    var err = new Error('Serialport not open.');
    if(typeof callback === 'function'){
      callback(err);
    }else{
      this.emit('error', err);
    }
    return;
  }

  if (typeof callback === 'function') {
    callback();
  }
};


SerialPort.prototype.proxy = function () {
  var self = this;
  var proxyArgs = [];

  //arguments isnt actually an array.
  for (var i = 0; i < arguments.length; i++) {
      proxyArgs[i] = arguments[i];
  }

  var functionName = proxyArgs.splice(0, 1)[0];

  var func = function() {
    var funcArgs = [];
    for (var i = 0; i < arguments.length; i++) {
        funcArgs[i] = arguments[i];
    }
    var allArgs = proxyArgs.concat(funcArgs);

    self[functionName].apply(self, allArgs);
  };

  return func;
};

SerialPort.prototype.set = function (options, callback) {
  this.options.serial.setControlSignals(this.connectionId, options, function(result){
    callback(chrome.runtime.lastError, result);
  });
};

SerialPort.prototype.isOpen = function () {
  return this.connectionId > -1;
};

function SerialPortList(callback) {
  if (typeof chrome != 'undefined' && chrome.serial) {
    chrome.serial.getDevices(function(ports) {
      var portObjects = new Array(ports.length);
      for (var i = 0; i < ports.length; i++) {
        portObjects[i] = {
          comName: ports[i].path,
          manufacturer: ports[i].displayName,
          serialNumber: '',
          pnpId: '',
          locationId:'',
          vendorId: '0x' + (ports[i].vendorId||0).toString(16),
          productId: '0x' + (ports[i].productId||0).toString(16)
        };
      }
      callback(chrome.runtime.lastError, portObjects);
    });
  } else {
    callback(new Error('No access to serial ports. Try loading as a Chrome Application.'), null);
  }
}

// Convert string to ArrayBuffer
function str2ab(str) {
  var buf = new ArrayBuffer(str.length);
  var bufView = new Uint8Array(buf);
  for (var i = 0; i < str.length; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

// Convert buffer to ArrayBuffer
function buffer2ArrayBuffer(buffer) {
  var buf = new ArrayBuffer(buffer.length);
  var bufView = new Uint8Array(buf);
  for (var i = 0; i < buffer.length; i++) {
    bufView[i] = buffer[i];
  }
  return buf;
}

function toBuffer(ab) {
  var buffer = new Buffer(ab.byteLength);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buffer.length; ++i) {
      buffer[i] = view[i];
  }
  return buffer;
}

module.exports = {
  SerialPort: SerialPort,
  list: SerialPortList,
  buffer2ArrayBuffer: buffer2ArrayBuffer,
  used: [] //TODO: Populate this somewhere.
};

}).call(this,require('_process'),require("buffer").Buffer)
},{"_process":63,"buffer":7,"events":39,"util":82}],6:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"dup":4}],7:[function(require,module,exports){
(function (global){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192 // not used by this implementation

var rootParent = {}

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Safari 5-7 lacks support for changing the `Object.prototype.constructor` property
 *     on objects.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

function typedArraySupport () {
  function Bar () {}
  try {
    var arr = new Uint8Array(1)
    arr.foo = function () { return 42 }
    arr.constructor = Bar
    return arr.foo() === 42 && // typed array instances can be augmented
        arr.constructor === Bar && // constructor can be set
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (arg) {
  if (!(this instanceof Buffer)) {
    // Avoid going through an ArgumentsAdaptorTrampoline in the common case.
    if (arguments.length > 1) return new Buffer(arg, arguments[1])
    return new Buffer(arg)
  }

  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    this.length = 0
    this.parent = undefined
  }

  // Common case.
  if (typeof arg === 'number') {
    return fromNumber(this, arg)
  }

  // Slightly less common case.
  if (typeof arg === 'string') {
    return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8')
  }

  // Unusual.
  return fromObject(this, arg)
}

function fromNumber (that, length) {
  that = allocate(that, length < 0 ? 0 : checked(length) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < length; i++) {
      that[i] = 0
    }
  }
  return that
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8'

  // Assumption: byteLength() return value is always < kMaxLength.
  var length = byteLength(string, encoding) | 0
  that = allocate(that, length)

  that.write(string, encoding)
  return that
}

function fromObject (that, object) {
  if (Buffer.isBuffer(object)) return fromBuffer(that, object)

  if (isArray(object)) return fromArray(that, object)

  if (object == null) {
    throw new TypeError('must start with number, buffer, array or string')
  }

  if (typeof ArrayBuffer !== 'undefined') {
    if (object.buffer instanceof ArrayBuffer) {
      return fromTypedArray(that, object)
    }
    if (object instanceof ArrayBuffer) {
      return fromArrayBuffer(that, object)
    }
  }

  if (object.length) return fromArrayLike(that, object)

  return fromJsonObject(that, object)
}

function fromBuffer (that, buffer) {
  var length = checked(buffer.length) | 0
  that = allocate(that, length)
  buffer.copy(that, 0, 0, length)
  return that
}

function fromArray (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

// Duplicate of fromArray() to keep fromArray() monomorphic.
function fromTypedArray (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  // Truncating the elements is probably not what people expect from typed
  // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior
  // of the old Buffer constructor.
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array) {
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    array.byteLength
    that = Buffer._augment(new Uint8Array(array))
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromTypedArray(that, new Uint8Array(array))
  }
  return that
}

function fromArrayLike (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

// Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.
// Returns a zero-length buffer for inputs that don't conform to the spec.
function fromJsonObject (that, object) {
  var array
  var length = 0

  if (object.type === 'Buffer' && isArray(object.data)) {
    array = object.data
    length = checked(array.length) | 0
  }
  that = allocate(that, length)

  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
} else {
  // pre-set for values that may exist in the future
  Buffer.prototype.length = undefined
  Buffer.prototype.parent = undefined
}

function allocate (that, length) {
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = Buffer._augment(new Uint8Array(length))
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that.length = length
    that._isBuffer = true
  }

  var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1
  if (fromPool) that.parent = rootParent

  return that
}

function checked (length) {
  // Note: cannot use `length < kMaxLength` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (subject, encoding) {
  if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding)

  var buf = new Buffer(subject, encoding)
  delete buf.parent
  return buf
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  var i = 0
  var len = Math.min(x, y)
  while (i < len) {
    if (a[i] !== b[i]) break

    ++i
  }

  if (i !== len) {
    x = a[i]
    y = b[i]
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.')

  if (list.length === 0) {
    return new Buffer(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; i++) {
      length += list[i].length
    }
  }

  var buf = new Buffer(length)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

function byteLength (string, encoding) {
  if (typeof string !== 'string') string = '' + string

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'binary':
      // Deprecated
      case 'raw':
      case 'raws':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  start = start | 0
  end = end === undefined || end === Infinity ? this.length : end | 0

  if (!encoding) encoding = 'utf8'
  if (start < 0) start = 0
  if (end > this.length) end = this.length
  if (end <= start) return ''

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'binary':
        return binarySlice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return 0
  return Buffer.compare(this, b)
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset) {
  if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff
  else if (byteOffset < -0x80000000) byteOffset = -0x80000000
  byteOffset >>= 0

  if (this.length === 0) return -1
  if (byteOffset >= this.length) return -1

  // Negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

  if (typeof val === 'string') {
    if (val.length === 0) return -1 // special case: looking for empty string always fails
    return String.prototype.indexOf.call(this, val, byteOffset)
  }
  if (Buffer.isBuffer(val)) {
    return arrayIndexOf(this, val, byteOffset)
  }
  if (typeof val === 'number') {
    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
    }
    return arrayIndexOf(this, [ val ], byteOffset)
  }

  function arrayIndexOf (arr, val, byteOffset) {
    var foundIndex = -1
    for (var i = 0; byteOffset + i < arr.length; i++) {
      if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex
      } else {
        foundIndex = -1
      }
    }
    return -1
  }

  throw new TypeError('val must be string, number or Buffer')
}

// `get` is deprecated
Buffer.prototype.get = function get (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` is deprecated
Buffer.prototype.set = function set (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) throw new Error('Invalid hex string')
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function binaryWrite (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    var swap = encoding
    encoding = offset
    offset = length | 0
    length = swap
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'binary':
        return binaryWrite(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function binarySlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
  }

  if (newBuf.length) newBuf.parent = this.parent || this

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('value is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = value < 0 ? 1 : 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = value < 0 ? 1 : 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (value > max || value < min) throw new RangeError('value is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('index out of range')
  if (offset < 0) throw new RangeError('index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; i--) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; i++) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    target._set(this.subarray(start, start + len), targetStart)
  }

  return len
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function fill (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (end < start) throw new RangeError('end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  if (start < 0 || start >= this.length) throw new RangeError('start out of bounds')
  if (end < 0 || end > this.length) throw new RangeError('end out of bounds')

  var i
  if (typeof value === 'number') {
    for (i = start; i < end; i++) {
      this[i] = value
    }
  } else {
    var bytes = utf8ToBytes(value.toString())
    var len = bytes.length
    for (i = start; i < end; i++) {
      this[i] = bytes[i % len]
    }
  }

  return this
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function toArrayBuffer () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1) {
        buf[i] = this[i]
      }
      return buf.buffer
    }
  } else {
    throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function _augment (arr) {
  arr.constructor = Buffer
  arr._isBuffer = true

  // save reference to original Uint8Array set method before overwriting
  arr._set = arr.set

  // deprecated
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.equals = BP.equals
  arr.compare = BP.compare
  arr.indexOf = BP.indexOf
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUIntLE = BP.readUIntLE
  arr.readUIntBE = BP.readUIntBE
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readIntLE = BP.readIntLE
  arr.readIntBE = BP.readIntBE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUIntLE = BP.writeUIntLE
  arr.writeUIntBE = BP.writeUIntBE
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeIntLE = BP.writeIntLE
  arr.writeIntBE = BP.writeIntBE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; i++) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"base64-js":2,"ieee754":47,"isarray":8}],8:[function(require,module,exports){
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],9:[function(require,module,exports){
(function (Buffer){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.

function isArray(arg) {
  if (Array.isArray) {
    return Array.isArray(arg);
  }
  return objectToString(arg) === '[object Array]';
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = Buffer.isBuffer;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

}).call(this,{"isBuffer":require("../../is-buffer/index.js")})
},{"../../is-buffer/index.js":50}],10:[function(require,module,exports){
/*
 * Cylonjs Adaptor adaptor
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Firmata = require("firmata");
var Cylon = require("cylon");

/**
 * A Firmata adaptor
 *
 * @constructor firmata
 *
 * @param {Object} opts options
 * @param {String} opts.port the serial port to connect to the board over
 */
var Adaptor = module.exports = function Adaptor() {
  Adaptor.__super__.constructor.apply(this, arguments);

  this.board = "";
  this.i2cReady = false;

  if (this.port == null) {
    throw new Error("No port specified for Firmata adaptor. Cannot proceed");
  }
};

Cylon.Utils.subclass(Adaptor, Cylon.Adaptor);

/**
 * Connects to the Firmata-compatible board
 *
 * @param {Function} callback to be triggered when connected
 * @return {void}
 */
Adaptor.prototype.connect = function(callback) {
  this.board = new Firmata.Board(this.port, function(err) {
    if (err) { return callback(err); }
    this.respond("connect", callback);
  }.bind(this));
};

/**
 * Disconnects from the Firmata-compatible board
 *
 * @param {Function} callback to be triggered when disconnected
 * @return {void}
 */
Adaptor.prototype.disconnect = function(callback) {
  this.board.reset();
  this.respond("disconnect", callback);
};

/**
 * Reads a value from a digital pin
 *
 * @param {Number} pin which pin to read from
 * @param {Function} callback triggered when the value has been read from the
 * pin
 * @return {void}
 * @publish
 */
Adaptor.prototype.digitalRead = function(pin, callback) {
  this.pinMode(pin, "input");

  this.board.digitalRead(pin, function(value) {
    this.respond("digitalRead", callback, null, value, pin);
  }.bind(this));
};

/**
 * Writes a value to a digital pin
 *
 * @param {Number} pin which pin to write to
 * @param {Number} value the value to write to the pin
 * @param {Function} callback function to be invoked when write is complete
 * @return {void}
 * @publish
 */
Adaptor.prototype.digitalWrite = function(pin, value, callback) {
  this.pinMode(pin, "output");
  this.board.digitalWrite(pin, value);
  this.respond("digitalWrite", callback, null, value, pin);
};

/**
 * Reads a value from an analog pin
 *
 * @param {Number} pin which pin to read from
 * @param {Function} callback triggered when the value has been read from the
 * pin
 * @return {void}
 * @publish
 */
Adaptor.prototype.analogRead = function(pin, callback) {
  this.board.analogRead(pin, function(value) {
    this.respond("analogRead", callback, null, value, pin);
  }.bind(this));
};

/**
 * Writes a value to an analog pin
 *
 * @param {Number} pin which pin to write to
 * @param {Number} value the analog value to write to the pin
 * @param {Function} callback function to be invoked when write is complete
 * @return {void}
 * @publish
 */
Adaptor.prototype.analogWrite = function(pin, value, callback) {
  value = (value).toScale(0, 255);
  this.pinMode(this.board.analogPins[pin], "analog");
  this.board.analogWrite(this.board.analogPins[pin], value);
  this.respond("analogWrite", callback, null, value, pin);
};

/**
 * Writes a PWM value to a pin
 *
 * @param {Number} pin which pin to write a value to
 * @param {Number} value 0..1 value to write to the pin
 * @param {Function} callback function to be invoked when write is complete
 * @return {void}
 * @publish
 */
Adaptor.prototype.pwmWrite = function(pin, value, callback) {
  value = (value).toScale(0, 255);
  this.pinMode(pin, "pwm");
  this.board.analogWrite(pin, value);
  this.respond("pwmWrite", callback, null, value, pin);
};

/**
 * Writes a servo value to a pin
 *
 * @param {Number} pin pin to write a value to
 * @param {Number} value servo value to write, from 0..1
 * @param {Function} callback function to be invoked when write is complete
 * @return {void}
 * @publish
 */
Adaptor.prototype.servoWrite = function(pin, value, callback) {
  value = (value).toScale(0, 180);
  this.pinMode(pin, "servo");
  this.board.servoWrite(pin, value);
  this.respond("servoWrite", callback, null, value, pin);
};

/**
 * Writes an I2C value to the board.
 *
 * @param {Number} address I2C address to write to
 * @param {Number} cmd I2C command to write
 * @param {Array} buff buffered data to write
 * @param {Function} callback function to be invoked when write is complete
 * @return {void}
 * @publish
 */
Adaptor.prototype.i2cWrite = function(address, cmd, buff, callback) {
  if (!this.i2cReady) { this.i2cConfig(2000); }
  cmd = (Array.isArray(cmd)) ? cmd : [cmd];
  this.board.sendI2CWriteRequest(address, cmd.concat(buff));
  this.respond("i2cWrite", callback);
};

/**
 * Reads an I2C value from the board.
 *
 * @param {Number} address I2C address to write to
 * @param {Number} cmd I2C command to write
 * @param {Number} length amount of data to read
 * @param {Function} callback function to be invoked when values are read
 * @return {void}
 * @publish
 */
Adaptor.prototype.i2cRead = function(address, cmd, length, callback) {
  if (!this.i2cReady) {
    this.i2cConfig(2000);
  }

  // TODO: decouple read and write operations here...
  if (cmd) {
    cmd = (Array.isArray(cmd)) ? cmd : [cmd];
    this.board.sendI2CWriteRequest(address, cmd);
  }

  this.board.sendI2CReadRequest(address, length, function(data) {
    var err = null;

    if (data.name === "Error") {
      err = data;
      data = null;
    }

    this.respond("i2cRead", callback, err, data);
  }.bind(this));
};

Adaptor.prototype.pinMode = function(pin, mode) {
  this.board.pinMode(pin, this._convertPinMode(mode));
};

Adaptor.prototype.i2cConfig = function(delay) {
  this.board.sendI2CConfig(delay);
  this.i2cReady = true;
};

Adaptor.prototype._convertPinMode = function(mode) {
  return this.board.MODES[mode.toUpperCase()] || this.board.MODES.INPUT;
};

},{"cylon":34,"firmata":42}],11:[function(require,module,exports){
/*
 * Analog Sensor driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

/* eslint camelcase: 0 */

"use strict";

var Cylon = require("cylon");

var events = [
  /**
   * Emitted when the Analog Sensor has fetched a new value
   *
   * @event analogRead
   */
  "analogRead",

  /**
   * Emitted when the Analog Sensor reads a value above the specified upper
   * limit
   *
   * @event upperLimit
   */
  "upperLimit",

  /**
   * Emitted when the Analog Sensor reads a value below the specified lower
   * limit
   *
   * @event lowerLimit
   */
  "lowerLimit"
];

/**
 * An Analog Sensor driver
 *
 * @constructor AnalogSensor
 * @param {Object} opts options object
 * @param {String|Number} opts.pin the pin to connect to
 * @param {Number} [opts.upperLimit] upper limit for sensor
 * @param {Number} [opts.lowerLimit] lower limit for sensor
 */
var AnalogSensor = module.exports = function AnalogSensor(opts) {
  AnalogSensor.__super__.constructor.apply(this, arguments);

  this.upperLimit = opts.upperLimit || 256;
  this.lowerLimit = opts.lowerLimit || 0;
  this.analogVal = null;

  if (this.pin == null) {
    throw new Error("No pin specified for Analog Sensor. Cannot proceed");
  }

  this.commands = {
    analog_read: this.analogRead
  };

  this.events = events;
};

/** Subclasses the Cylon.Driver class */
Cylon.Utils.subclass(AnalogSensor, Cylon.Driver);

/**
 * Gets the current value from the Analog Sensor
 *
 * @param {Function} [callback] invoked with `err, value` as args
 * @return {Number} the current sensor value
 * @publish
 */
AnalogSensor.prototype.analogRead = function(callback) {
  var val = this.analogVal;

  if (typeof callback === "function") {
    callback(null, val);
  }

  return val;
};

/**
 * Starts the Analog Sensor
 *
 * @param {Function} callback to be triggered when started
 * @return {void}
 */
AnalogSensor.prototype.start = function(callback) {
  this.connection.analogRead(this.pin, function(err, readVal) {
    if (err) { return; }

    this.analogVal = readVal;
    this.emit("analogRead", readVal);

    if (readVal >= this.upperLimit) {
      this.emit("upperLimit", readVal);
    } else if (readVal <= this.lowerLimit) {
      this.emit("lowerLimit", readVal);
    }
  }.bind(this));

  callback();
};

/**
 * Stops the Analog Sensor
 *
 * @param {Function} callback to be triggered when stopped
 * @return {void}
 * @api private
 */
AnalogSensor.prototype.halt = function(callback) {
  callback();
};

},{"cylon":34}],12:[function(require,module,exports){
/*
 * Cylon button driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require("cylon");

var events = [
  /**
   * Emitted when the Button is pushed
   *
   * @event push
   */
  "push",

  /**
   * Emitted when the Button is released
   *
   * @event release
   */
  "release"
];

/**
 * A Button driver
 *
 * @constructor Button
 *
 * @param {Object} opts options object
 * @param {String|Number} opts.pin the pin to connect to
 */
var Button = module.exports = function Button() {
  Button.__super__.constructor.apply(this, arguments);

  this.pressed = false;
  this.prevState = 0;

  if (this.pin == null) {
    throw new Error("No pin specified for Button. Cannot proceed");
  }

  this.commands = {
    is_pressed: this.isPressed
  };

  this.events = events;
};

/** Subclasses the Cylon.Driver class */
Cylon.Utils.subclass(Button, Cylon.Driver);

/**
 * Check whether or not the Button is currently pressed
 *
 * @param {Function} [callback] invoked with `err, value` as args
 * @return {Boolean} whether or not the button is pressed
 * @publish
 */
Button.prototype.isPressed = function(callback) {
  if (typeof callback === "function") {
    callback(null, this.pressed);
  }

  return this.pressed;
};

/**
 * Starts the Button
 *
 * @param {Function} callback to be triggered when started
 * @return {void}
 * @private
 */
Button.prototype.start = function(callback) {
  this.connection.digitalRead(this.pin, function(err, data) {
    if (err) { return; }

    var previouslyPressed = this.pressed;
    this.pressed = (data === 1);

    if (this.pressed && !previouslyPressed) {
      this.pressed = true;
      this.emit("push");
    } else if (!this.pressed && previouslyPressed) {
      this.pressed = false;
      this.emit("release");
    }
  }.bind(this));

  callback();
};

/**
 * Stops the Analog Sensor
 *
 * @param {Function} callback to be triggered when stopped
 * @return {void}
 * @private
 */
Button.prototype.halt = function(callback) {
  callback();
};

},{"cylon":34}],13:[function(require,module,exports){
/*
 * Continuous Servo driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require("cylon");

/**
 * A Continuous Servo driver
 *
 * @constructor ContinuousServo
 *
 * @param {Object} opts options object
 * @param {String|Number} opts.pin the pin to connect to
 */
var ContinuousServo = module.exports = function(opts) {
  ContinuousServo.__super__.constructor.apply(this, arguments);

  this.angleValue = 0;
  this.freq = opts.freq || null;
  this.pwmScale = opts.pwmScale || { bottom: 0, top: 180 };
  this.pulseWidth = opts.pulseWidth || { min: 500, max: 2400 };

  if (this.pin == null) {
    throw new Error("No pin specified for Continuous Servo. Cannot proceed");
  }

  this.commands = {
    clockwise: this.clockwise,
    counter_clockwise: this.counterClockwise,
    stop: this.stop
  };
};

/** Subclasses the Cylon.Driver class */
Cylon.Utils.subclass(ContinuousServo, Cylon.Driver);

/**
 * Starts the Continuous Servo
 *
 * @param {Function} callback to be triggered when started
 * @return {void}
 */
ContinuousServo.prototype.start = function(callback) {
  callback();
};

/**
 * Stops the Continuous Servo
 *
 * @param {Function} callback to be triggered when stopped
 * @return {void}
 */
ContinuousServo.prototype.halt = function(callback) {
  callback();
};

/**
 * Stops the Continuous Servo's rotation
 *
 * @param {Function} callback (err, val) triggers when write is complete
 * @return {void}
 * @publish
 */
ContinuousServo.prototype.stop = function(callback) {
  var scaledDuty = (90).fromScale(
    this.pwmScale.bottom,
    this.pwmScale.top
  );

  this.connection.servoWrite(
    this.pin,
    scaledDuty,
    this.freq,
    this.pulseWidth,
    callback
  );
};

/**
 * Rotates the Continuous Servo clockwise
 *
 * @param {Function} [callback] - (err, val) triggers when write is complete
 * @return {void}
 * @publish
 */
ContinuousServo.prototype.clockwise = function(callback) {
  return this.rotate("clockwise", callback);
};

/**
 * Rotates the Continuous Servo counter-clockwise
 *
 * @param {Function} [callback] - (err, val) triggers when write is complete
 * @return {void}
 * @publish
 */
ContinuousServo.prototype.counterClockwise = function(callback) {
  return this.rotate("counter-clockwise", callback);
};

/**
 * Rotates the Continuous Servo
 *
 * @param {String} direction 'clockwise' or 'counter-clockwise'
 * @param {Function} [callback] - (err, val) triggers when write is complete
 * @return {void}
 * @publish
 */
ContinuousServo.prototype.rotate = function(direction, callback) {
  var spin = (direction === "clockwise") ? 180 : 89;

  var scaledDuty = (spin).fromScale(
    this.pwmScale.bottom,
    this.pwmScale.top
  );

  this.connection.servoWrite(
    this.pin,
    scaledDuty,
    this.freq,
    this.pulseWidth,
    callback
  );
};

},{"cylon":34}],14:[function(require,module,exports){
/*
 * DirectPin driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require("cylon");

/**
 * A Direct Pin driver
 *
 * @constructor DirectPin
 *
 * @param {Object} opts options object
 * @param {String|Number} opts.pin the pin to connect to
 */
var DirectPin = module.exports = function DirectPin() {
  DirectPin.__super__.constructor.apply(this, arguments);

  this.readSet = false;
  this.high = false;

  if (this.pin == null) {
    throw new Error("No pin specified for Direct Pin. Cannot proceed");
  }

  this.commands = {
    digital_read: this.digitalRead,
    digital_write: this.digitalWrite,

    analog_read: this.analogRead,
    analog_write: this.analogWrite,

    pwm_write: this.pwmWrite,
    servo_write: this.servoWrite,
  };
};

/** Subclasses the Cylon.Driver class */
Cylon.Utils.subclass(DirectPin, Cylon.Driver);

/**
 * Starts the Direct Pin
 *
 * @param {Function} callback to be triggered when started
 * @return {void}
 */
DirectPin.prototype.start = function(callback) {
  callback();
};

/**
 * Stops the Direct Pin
 *
 * @param {Function} callback to be triggered when stopped
 * @return {void}
 */
DirectPin.prototype.halt = function(callback) {
  callback();
};

/**
 * Writes a digital value to the pin
 *
 * @param {Number} value value to write to the pin
 * @param {Function} [callback] - (err, val) triggers when write is complete
 * @return {void}
 * @publish
 */
DirectPin.prototype.digitalWrite = function(value, callback) {
  this.connection.digitalWrite(this.pin, value, callback);
};

/**
 * Writes an analog value to the pin
 *
 * @param {Number} value value to write to the pin
 * @param {Function} [callback] - (err, val) triggers when write is complete
 * @return {void}
 * @publish
 */
DirectPin.prototype.analogWrite = function(value, callback) {
  this.connection.analogWrite(this.pin, value, callback);
};

/**
 * Reads the value from the pin
 *
 * Triggers the provided callback when the pin state has been read.
 *
 * @param {Function} callback triggered when the pin state has been read
 * @return {void}
 * @publish
 */
DirectPin.prototype.digitalRead = function(callback) {
  this._read("d", callback);
};

/**
 * Reads the value from the pin
 *
 * Triggers the provided callback when the pin state has been read.
 *
 * @param {Function} callback triggered when the pin state has been read
 * @return {void}
 * @publish
 */
DirectPin.prototype.analogRead = function(callback) {
  this._read("a", callback);
};

DirectPin.prototype._read = function(type, callback) {
  if (!this.readSet) {
    switch (type) {
      case "a":
        this.connection.analogRead(this.pin, callback);
        break;
      case "d":
        this.connection.digitalRead(this.pin, callback);
        break;
    }

    this.readSet = true;
  }
};

/**
 * Writes a servo value to the pin
 *
 * @param {Number} angle angle value to write to the pin
 * @param {Function} [callback] - (err, val) triggers when write is complete
 * @return {void}
 * @publish
 */
DirectPin.prototype.servoWrite = function(angle, callback) {
  return this.connection.servoWrite(this.pin, angle, callback);
};

/**
 * Writes a PWM value to the pin
 *
 * @param {Number} value value to write to the pin
 * @param {Function} [callback] - (err, val) triggers when write is complete
 * @return {void}
 * @publish
 */
DirectPin.prototype.pwmWrite = function(value, callback) {
  return this.connection.pwmWrite(this.pin, value, callback);
};

},{"cylon":34}],15:[function(require,module,exports){
(function (__dirname){
/*
 * SHARP IR Range Sensor driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require("cylon");
var path = require("path");

var events = [
  /**
   * Emitted when the IR Range Sensor has detected the current range
   *
   * @event range
   * @value distance the current distance in inches
   */
  "range",

  /**
   * Emitted when the IR Range Sensor has detected the current range
   *
   * @event rangeCm
   * @value distance the current distance in centimeters
   */
  "rangeCm",
];

/**
 * A IR Range Sensor driver
 *
 * @constructor IrRangeSensor
 *
 * @param {Object} opts options object
 * @param {String|Number} opts.pin the pin to connect to
 * @param {String} opts.model the IR Range Sensor model number
 */
var IrRangeSensor = module.exports = function IrRangeSensor(opts) {
  IrRangeSensor.__super__.constructor.apply(this, arguments);

  this.model = opts.model;
  this.analogVal = 0;
  this.distanceCm = 0;
  this.distanceIn = 0;

  if (this.pin == null) {
    throw new Error("No pin specified for IR Range Sensor. Cannot proceed");
  }

  this._setRangeTable();

  this.commands = {
    analog_read: this.analogRead,
    range_cm: this.rangeCm,
    range: this.range
  };

  this.events = events;
};

Cylon.Utils.subclass(IrRangeSensor, Cylon.Driver);

IrRangeSensor.prototype._setRangeTable = function() {
  if (this.model) {
    var model = path.join(
      __dirname,
      "./ir_range_tables/" + this.model.toLowerCase() + ".js"
    );

    this.rangeTable = require(model);
  } else {
    this.rangeTable = {};

    var str = "IRSensor CANNOT calculate distance (range and rangecm) without ";
    str += "IR model number.\n";
    str += "Only analogRead() values will be available.\n";
    str += "To generate a distance range table, check ./node_modules";
    str += "/cylon-gpio/utilities/generate-ir-rage-sensor-table.js.\n";
    str += "Try passing model number as a device parameter.";
    Cylon.Logger.info(str);
  }
};
/**
 * Starts the IR Range Sensor
 *
 * @param {Function} callback to be triggered when started
 * @return {void}
 */
IrRangeSensor.prototype.start = function(callback) {
  this.connection.analogRead(this.pin, function(err, readVal) {
    if (err) { return; }
    this._calcDistances(readVal);
    this.emit("range", this.distanceIn);
    this.emit("rangeCm", this.distanceCm);
  }.bind(this));

  callback();
};

/**
 * Stops the IR Range Sensor
 *
 * @param {Function} callback to be triggered when stopped
 * @return {void}
 */
IrRangeSensor.prototype.halt = function(callback) {
  callback();
};

/**
 * Uses the range table to calculate distances
 *
 * Uses the calculated distance to set `this.analogVal`, `this.distanceCm`, and
 * `this.distanceIn`
 *
 * @param {Number} analogVal value to calculate distance for
 * @return {void}
 */
IrRangeSensor.prototype._calcDistances = function(analogVal) {
  var distance = 0,
      tmpRange = 0;

  for (var range in this.rangeTable.rangeDistances) {
    tmpRange = parseInt(range, 10);
    if ((analogVal <= tmpRange) && (analogVal + 5 > tmpRange)) {
      distance = this.rangeTable.rangeDistances[range].dist;
      break;
    }
  }

  this.analogVal = analogVal;
  this.distanceCm = distance;
  this.distanceIn = distance / 2.54;
};

/**
 * Returns the current analog value from the pin
 *
 * @param {Function} [callback] invoked with `err, value` as args
 * @return {Number} current analog value, or 0 if it's not been read yet
 * @publish
 */
IrRangeSensor.prototype.analogRead = function(callback) {
  var val = this.analogVal || 0;

  if (typeof callback === "function") {
    callback(null, val);
  }

  return val;
};

/**
 * Returns the current range, in centimeters
 *
 * @param {Function} [callback] invoked with `err, value` as args
 * @return {Number} current detected range in centimeters
 * @publish
 */
IrRangeSensor.prototype.rangeCm = function(callback) {
  if (typeof callback === "function") {
    callback(null, this.distanceCm);
  }

  return this.distanceCm;
};

/**
 * Returns the current range, in inches
 *
 * @param {Function} [callback] invoked with `err, value` as args
 * @return {Number} current detected range in inches
 * @publish
 */
IrRangeSensor.prototype.range = function(callback) {
  if (typeof callback === "function") {
    callback(null, this.distanceIn);
  }

  return this.distanceIn;
};

}).call(this,"/node_modules/cylon-gpio/lib")
},{"cylon":34,"path":62}],16:[function(require,module,exports){
/*
 * LED driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require("cylon");

/**
 * A LED driver
 *
 * @constructor led
 *
 * @param {Object} opts options object
 * @param {String|Number} opts.pin the pin to connect to
 * @param {Number} opts.freq led frequency
 * @param {Object} [opts.pwmScale] pwm scale
 * @param {Number} opts.pwmScale.bottom pwm bottom
 * @param {Number} opts.pwmScale.top pwm top
 */
var Led = module.exports = function Led(opts) {
  Led.__super__.constructor.apply(this, arguments);

  this.freq = opts.freq || null;
  this.isHigh = false;
  this.brightnessValue = 0;
  this.pwmScale = opts.pwmScale || { bottom: 0, top: 255 };

  if (this.pin == null) {
    throw new Error("No pin specified for LED. Cannot proceed");
  }

  this.commands = {
    is_on: this.isOn,

    turn_on: this.turnOn,
    turn_off: this.turnOff,
    toggle: this.toggle,

    brightness: this.brightness,
    current_brightness: this.currentBrightness
  };
};

/** Subclasses the Cylon.Driver class */
Cylon.Utils.subclass(Led, Cylon.Driver);

/**
 * Starts the LED
 *
 * @param {Function} callback to be triggered when started
 * @return {void}
 */
Led.prototype.start = function(callback) {
  callback();
};

/**
 * Stops the LED
 *
 * @param {Function} callback to be triggered when halted
 * @return {void}
 */
Led.prototype.halt = function(callback) {
  callback();
};

/**
 * Writes a HIGH (1) value to the pin, turning the LED on.
 *
 * Also sets `this.isHigh` to `true`.
 *
 * @param {Function} [callback] - (err, val) triggers when write is complete
 * @return {void}
 * @publish
 */
Led.prototype.turnOn = function(callback) {
  this.isHigh = true;
  this.connection.digitalWrite(this.pin, 1, callback);
};

/**
 * Writes a LOW (0) value to the pin, turning the LED off.
 *
 * Also sets `this.isHigh` to `false`.
 *
 * @param {Function} [callback] - (err, val) triggers when write is complete
 * @return {void}
 * @publish
 */
Led.prototype.turnOff = function(callback) {
  this.isHigh = false;
  this.connection.digitalWrite(this.pin, 0, callback);
};

/**
 * Toggles the LED on or off, depending on its current state
 *
 * @param {Function} callback function to be invoked when done
 * @return {void}
 * @publish
 */
Led.prototype.toggle = function(callback) {
  if (this.isHigh) {
    this.turnOff();
  } else {
    this.turnOn();
  }

  if (typeof callback === "function") {
    callback();
  }
};

/**
 * Returns the current brightness of the LED.
 *
 * @param {Function} [callback] invoked with `err, value` as args
 * @return {Number} the current LED brightness value (0-255)
 * @publish
 */
Led.prototype.currentBrightness = function(callback) {
  if (typeof callback === "function") {
    callback(null, this.brightnessValue);
  }

  return this.brightnessValue;
};

/**
 * Sets brightness of the LED to the specified value using PWM.
 *
 * @param {Number} value - PWM value to set the brightness to (0-255)
 * @param {Function} [callback] - (err, val) triggers when write is complete
 * @return {void}
 * @publish
 */
Led.prototype.brightness = function(value, callback) {
  var scaledDuty = (value).fromScale(this.pwmScale.bottom, this.pwmScale.top);

  this.connection.pwmWrite(
    this.pin,
    scaledDuty,
    this.freq,
    null,
    null,
    callback
  );

  this.brightnessValue = value;
};

/**
 * Returns whether or not the LED is currently on
 *
 * @param {Function} [callback] invoked with `err, value` as args
 * @return {Boolean} whether or not the LED is currently on
 * @publish
 */
Led.prototype.isOn = function(callback) {
  if (typeof callback === "function") {
    callback(null, this.isHigh);
  }

  return this.isHigh;
};

},{"cylon":34}],17:[function(require,module,exports){
/*
 * Cylon Makey Button driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require("cylon");

var events = [
  /**
   * Emitted when the Makey Button is pushed
   *
   * @event push
   */
  "push",

  /**
   * Emitted when the Makey Button is released
   *
   * @event release
   */
  "release"
];

/**
 * A Makey Button driver
 *
 * @constructor MakeyButton
 *
 * @param {Object} opts options object
 * @param {String|Number} opts.pin the pin to connect to
 */
var MakeyButton = module.exports = function MakeyButton() {
  MakeyButton.__super__.constructor.apply(this, arguments);

  this.isPressed = false;
  this.currentValue = 0;
  this.data = [];

  if (this.pin == null) {
    throw new Error("No pin specified for Makey Button. Cannot proceed");
  }

  this.events = events;
};

/** Subclasses the Cylon.Driver class */
Cylon.Utils.subclass(MakeyButton, Cylon.Driver);

/**
 * Starts the Makey Button
 *
 * @param {Function} callback to be triggered when started
 * @return {void}
 */
MakeyButton.prototype.start = function(callback) {
  this.connection.digitalRead(this.pin, function(err, data) {
    if (err) { return; }
    this.currentValue = data;
  }.bind(this));

  Cylon.Utils.every(50, function() {
    this.data.push(this.currentValue);
    if (this.data.length > 5) {
      this.data.shift();
    }

    if (this.averageData() <= 0.5 && !this.isPressed) {
      this.isPressed = true;
      this.emit("push");
    } else if (this.averageData() > 0.5 && this.isPressed) {
      this.isPressed = false;
      this.emit("release");
    }
  }.bind(this));

  callback();
};

/**
 * Stops the Makey Button
 *
 * @param {Function} callback to be triggered when halted
 * @return {void}
 */
MakeyButton.prototype.halt = function(callback) {
  callback();
};

/**
 * Averages read digital values
 *
 * @return {Number} averaged value
 */
MakeyButton.prototype.averageData = function() {
  var result = 0;

  if (this.data.length > 0) {
    this.data.forEach(function(n) { result += n; });
    result = result / this.data.length;
  }

  return result;
};

},{"cylon":34}],18:[function(require,module,exports){
/*
 * Maxbotix ultrasonic rangefinder driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require("cylon");

var events = [
  /**
   * Emitted when the Maxbotix has detected the current range
   *
   * @event range
   * @value distance the current distance in inches
   */
  "range",

  /**
   * Emitted when the Maxbotix has detected the current range
   *
   * @event rangeCm
   * @value distance the current distance in centimeters
   */
  "rangeCm",
];

/**
 * A Maxbotix driver
 *
 * @constructor maxbotix
 *
 * @param {Object} opts options object
 * @param {String|Number} opts.pin the pin to connect to
 */
var Maxbotix = module.exports = function Maxbotix(opts) {
  Maxbotix.__super__.constructor.apply(this, arguments);

  this.analogValue = 0;
  this.model = opts.model || "lv";

  if (this.pin == null) {
    throw new Error("No pin specified for Maxbotix. Cannot proceed");
  }

  this.commands = {
    range: this.range,
    rangeCm: this.rangeCm
  };

  this.events = events;
};

/** Subclasses the Cylon.Driver class */
Cylon.Utils.subclass(Maxbotix, Cylon.Driver);

/**
 * Starts the Maxbotix
 *
 * @param {Function} callback to be triggered when started
 * @return {void}
 */
Maxbotix.prototype.start = function(callback) {
  Cylon.Logger.debug("Maxbotix on pin " + this.pin + " started");

  this.connection.analogRead(this.pin, function(err, readVal) {
    if (err) { return; }
    this.analogValue = readVal;
    this.emit("range", this.range());
    this.emit("rangeCm", this.rangeCm());
  }.bind(this));

  callback();
};

/**
 * Stops the Maxbotix
 *
 * @param {Function} callback to be triggered when halted
 * @return {void}
 */
Maxbotix.prototype.halt = function(callback) {
  callback();
};

/**
 * Gets the distance measured by the sonar, in inches.
 *
 * @param {Function} [callback] invoked with `err, value` as args
 * @return {Number} the current measured distance, in inches
 * @publish
 */
Maxbotix.prototype.range = function(callback) {
  var models = ["lv", "xl", "xl-long", "hr", "hr-long"],
      distance = this.rangeCm();

  if (models.indexOf(this.model) > -1) {
    distance = distance * 0.3937;
  }

  if (typeof callback === "function") {
    callback(null, distance);
  }

  return distance;
};

/**
 * Gets the distance measured by the sonar, in centimeters.
 *
 * @param {Function} [callback] invoked with `err, value` as args
 * @return {Number} the current measured distance, in centimeters
 * @publish
 */
Maxbotix.prototype.rangeCm = function(callback) {
  var distance;

  switch (this.model) {
    case "lv":
      distance = (this.analogValue / 2.0) / 0.3937;
      break;
    case "xl-long":
      distance = this.analogValue * 2.0;
      break;
    case "hr":
      distance = this.analogValue * 0.5;
      break;
    case "xl":
    case "hr-long":
      distance = this.analogValue;
      break;
    default:
      distance = this.analogValue; // raw data, in case of unknown model
  }

  if (typeof callback === "function") {
    callback(null, distance);
  }

  return distance;
};

},{"cylon":34}],19:[function(require,module,exports){
/*
 * Motor driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require("cylon");

/**
 * A Motor driver
 *
 * @constructor motor
 *
 * @param {Object} opts options object
 * @param {String|Number} opts.pin the pin to connect to
 * @param {Number} opts.freq motor frequency
 * @param {Object} [opts.pwmScale] pwm scale
 * @param {Number} opts.pwmScale.bottom pwm scale bottom
 * @param {Number} opts.pwmScale.top pwm scale top
 */
var Motor = module.exports = function Motor(opts) {
  Motor.__super__.constructor.apply(this, arguments);

  this.freq = opts.freq || null;
  this.speedValue = 0;
  this.isOn = false;
  this.pwmScale = opts.pwmScale || { bottom: 0, top: 255 };

  if (this.pin == null) {
    throw new Error("No pin specified for Motor. Cannot proceed");
  }

  this.commands = {
    turn_on: this.turnOn,
    turn_off: this.turnOff,
    toggle: this.toggle,
    speed: this.speed,
    current_speed: this.currentSpeed
  };
};

/** Subclasses the Cylon.Driver class */
Cylon.Utils.subclass(Motor, Cylon.Driver);

/**
 * Starts the Motor
 *
 * @param {Function} callback to be triggered when started
 * @return {void}
 */
Motor.prototype.start = function(callback) {
  callback();
};

/**
 * Stops the Motor
 *
 * @param {Function} callback to be triggered when halted
 * @return {void}
 */
Motor.prototype.halt = function(callback) {
  callback();
};

/**
 * Turns the Motor on by writing a HIGH (1) value to the pin
 *
 * Also sets `this.isOn` to `true`.
 *
 * @param {Function} [callback] - (err, val) triggers when write is complete
 * @return {void}
 * @publish
 */
Motor.prototype.turnOn = function(callback) {
  this.isOn = true;
  this.connection.digitalWrite(this.pin, 1, callback);
};

/**
 * Turns the Motor off by writing a LOW (0) value to the pin
 *
 * Also sets `this.isOn` to `false`.
 *
 * @param {Function} [callback] - (err, val) triggers when write is complete
 * @return {void}
 * @publish
 */
Motor.prototype.turnOff = function(callback) {
  this.isOn = false;
  this.connection.digitalWrite(this.pin, 0, callback);
};

/**
 * Toggles the Motor on or off, depending on its current state
 *
 * @param {Function} [callback] invoked with `err, value` as args
 * @return {void}
 * @publish
 */
Motor.prototype.toggle = function(callback) {
  if (this.isOn) {
    this.turnOff();
  } else {
    this.turnOn();
  }

  if (typeof callback === "function") {
    callback();
  }
};

/**
 * Returns the Motor's current speed value
 *
 * @param {Function} [callback] - (err, val)
 * @return {Number} the current motor speed
 * @publish
 */
Motor.prototype.currentSpeed = function(callback) {
  if (typeof callback === "function") {
    callback(null, this.speedValue);
  }

  return this.speedValue;
};

/**
 * Sets the Motor's speed to the PWM value provided (0-255)
 *
 * @param {Number} value PWM value to set the speed to (0-255)
 * @param {Function} [callback] - (err, val) triggers when write is complete
 * @return {void}
 * @publish
 */
Motor.prototype.speed = function(value, callback) {
  var scaledDuty = (value).fromScale(this.pwmScale.bottom, this.pwmScale.top);

  this.connection.pwmWrite(
    this.pin,
    scaledDuty,
    this. freq,
    null, null,
    callback
  );

  this.speedValue = value;
  this.isOn = this.speedValue > 0;
};

},{"cylon":34}],20:[function(require,module,exports){
/*
 * Relay driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2015 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require("cylon");

/**
 * A Relay driver
 *
 * @constructor relay
 *
 * @param {Object} opts options object
 * @param {String|Number} opts.pin the pin to connect to
 * @param {String} opts.type either "open" or "closed"
 */
var Relay = module.exports = function Relay(opts) {
  Relay.__super__.constructor.apply(this, arguments);

  this.type = opts.type || "open";
  this.isOn = false;

  if (this.pin == null) {
    throw new Error("No pin specified for Relay. Cannot proceed");
  }

  this.commands = {
    turn_on: this.turnOn,
    turn_off: this.turnOff,
    toggle: this.toggle
  };
};

/** Subclasses the Cylon.Driver class */
Cylon.Utils.subclass(Relay, Cylon.Driver);

/**
 * Starts the Relay
 *
 * @param {Function} callback to be triggered when started
 * @return {void}
 */
Relay.prototype.start = function(callback) {
  callback();
};

/**
 * Stops the Relay
 *
 * @param {Function} callback to be triggered when halted
 * @return {void}
 */
Relay.prototype.halt = function(callback) {
  callback();
};

/**
 * Turn the Relay on.
 *
 * @param {Function} [callback] - (err, val) triggers when write is complete
 * @return {void}
 * @publish
 */
Relay.prototype.turnOn = function(callback) {
  var newValue;
  if (this.type === "open") {
    newValue = 1;
  } else {
    newValue = 0;
  }

  this.connection.digitalWrite(this.pin, newValue, callback);
  this.isOn = true;
};

/**
 * Turn the Relay off.
 *
 * @param {Function} [callback] - (err, val) triggers when write is complete
 * @return {void}
 * @publish
 */
Relay.prototype.turnOff = function(callback) {
  var newValue;
  if (this.type === "open") {
    newValue = 0;
  } else {
    newValue = 1;
  }

  this.connection.digitalWrite(this.pin, newValue, callback);
  this.isOn = false;
};

/**
 * Toggles the Relay on or off, depending on its current state
 *
 * @param {Function} callback function to be invoked when done
 * @return {void}
 * @publish
 */
Relay.prototype.toggle = function(callback) {
  if (this.isOn) {
    this.turnOff();
  } else {
    this.turnOn();
  }

  if (typeof callback === "function") {
    callback();
  }
};

},{"cylon":34}],21:[function(require,module,exports){
/*
 * RGB LED strip driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2015 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require("cylon");

/**
 * RGB LED driver
 *
 * @constructor led
 *
 * @param {Object} opts options object
 * @param {String|Number} opts.redPin the red pin to connect to
 * @param {String|Number} opts.greenPin the green pin to connect to
 * @param {String|Number} opts.bluePin the blue pin to connect to
 */
var RGBLed = module.exports = function RGBLed(opts) {
  RGBLed.__super__.constructor.apply(this, arguments);

  this.redPin = opts.redPin || null;
  this.greenPin = opts.greenPin || null;
  this.bluePin = opts.bluePin || null;

  if (this.redPin == null) {
    throw new Error("No red pin specified for RGB LED. Cannot proceed");
  }

  if (this.greenPin == null) {
    throw new Error("No green pin specified for RGB LED. Cannot proceed");
  }

  if (this.bluePin == null) {
    throw new Error("No blue pin specified for RGB LED. Cannot proceed");
  }

  this.commands = {
    is_on: this.isOn,
    set_rgb: this.setRGB
  };
};

/** Subclasses the Cylon.Driver class */
Cylon.Utils.subclass(RGBLed, Cylon.Driver);

/**
 * Starts the RGBLed
 *
 * @param {Function} callback to be triggered when started
 * @return {void}
 */
RGBLed.prototype.start = function(callback) {
  callback();
};

/**
 * Stops the RGBLed
 *
 * @param {Function} callback to be triggered when halted
 * @return {void}
 */
RGBLed.prototype.halt = function(callback) {
  callback();
};

/**
 * Sets the RGB LED to a specific color
 *
 * @param {Number} hex value for the LED e.g. 0xff00ff
 * @param {Function} callback to be triggered when complete
 * @return {void}
 * @publish
 */
RGBLed.prototype.setRGB = function(hex, callback) {
  var val = this._hexToRgb(hex);
  this.isHigh = true;
  this.connection.pwmWrite(this.redPin, val.r);
  this.connection.pwmWrite(this.greenPin, val.g);
  this.connection.pwmWrite(this.bluePin, val.b);

  if (typeof callback === "function") {
    callback(null, val);
  }
};

/**
 * Returns whether or not the RGB LED is currently on
 *
 * @param {Function} callback function to invoke with isOn value
 * @return {Boolean} whether or not the LED is currently on
 * @publish
 */
RGBLed.prototype.isOn = function(callback) {
  if (typeof callback === "function") {
    callback(null, this.isHigh);
  }

  return this.isHigh;
};

RGBLed.prototype._hexToRgb = function(hex) {
  var param = hex.toString(16);
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(param);

  if (result) {
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    };
  }

  return { r: 0, g: 0, b: 0 };
};

},{"cylon":34}],22:[function(require,module,exports){
/*
 * Servo driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require("cylon");

/**
 * A Servo driver
 *
 * @constructor Servo
 *
 * @param {Object} opts options object
 * @param {String|Number} opts.pin the pin to connect to
 * @param {Object} [opts.range] range min/max
 * @param {Number} opts.range.min range min
 * @param {Number} opts.range.max range max
 * @param {Object} [opts.pulseWidth] pulse width min/max
 * @param {Number} opts.pulseWidth.min pulse width min
 * @param {Number} opts.pulseWidth.max pulse width min
 * @param {Object} [opts.pwmScale] PWM scale bottom/top
 * @param {Number} opts.pwmScale.bottom PWM scale bottom
 * @param {Number} opts.pwmScale.top PWM scale top
 */
var Servo = module.exports = function Servo(opts) {
  Servo.__super__.constructor.apply(this, arguments);

  this.angleValue = 0;

  this.angleRange = opts.range || { min: 20, max: 160 };
  this.freq = opts.freq || null;
  this.pulseWidth = opts.pulseWidth || { min: 500, max: 2400 };
  this.pwmScale = opts.pwmScale || { bottom: 0, top: 180 };

  if (this.pin == null) {
    throw new Error("No pin specified for Servo. Cannot proceed");
  }

  this.commands = {
    angle: this.angle,
    current_angle: this.currentAngle
  };
};

/** Subclasses the Cylon.Driver class */
Cylon.Utils.subclass(Servo, Cylon.Driver);

/**
 * Starts the Servo
 *
 * @param {Function} callback to be triggered when started
 * @return {void}
 */
Servo.prototype.start = function(callback) {
  callback();
};

/**
 * Stop the Servo
 *
 * @param {Function} callback to be triggered when halted
 * @return {void}
 */
Servo.prototype.halt = function(callback) {
  callback();
};

/**
 * Returns the current angle of the Servo
 *
 * @param {Function} callback function to be invoked with angle value
 * @return {Number} the current servo angle value (0-180)
 * @publish
 */
Servo.prototype.currentAngle = function(callback) {
  if (typeof callback === "function") {
    callback(null, this.angleValue);
  }

  return this.angleValue;
};

/**
 * Sets the angle of the servo to the provided value
 *
 * @param {Number} value - the angle to point the servo to (0-180)
 * @param {Function} [callback] - (err, val) triggers when write is complete
 * @return {void}
 * @publish
 */
Servo.prototype.angle = function(value, callback) {
  var scaledDuty = (this.safeAngle(value)).fromScale(
    this.pwmScale.bottom,
    this.pwmScale.top
  );

  this.connection.servoWrite(
    this.pin,
    scaledDuty,
    this.freq,
    this.pulseWidth,
    callback
  );
  this.angleValue = value;
};

// Public: Saves an specified angle, angle must be an
// integer value between 0 and 180.
//
// value - params
//
// Returns null.

/**
 * Given a servo angle, determines if it's safe or not, and returns a safe value
 *
 * @param {Number} value the angle the user wants to set the servo to
 * @return {Number} a made-safe angle to set the servo to
 * @publish
 */
Servo.prototype.safeAngle = function(value) {
  if (value < this.angleRange.min) {
    value = this.angleRange.min;
  } else if (value > this.angleRange.max) {
    value = this.angleRange.max;
  }

  return value;
};

},{"cylon":34}],23:[function(require,module,exports){
/*
 * BlinkM driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2015 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require("cylon");

var I2CDriver = require("./i2c-driver");

/**
 * A BlinkM Driver
 *
 * @constructor blinkm
 */
var BlinkM = module.exports = function BlinkM() {
  BlinkM.__super__.constructor.apply(this, arguments);
  this.address = this.address || 0x09;

  this.setupCommands([
    "goToRGB", "fadeToRGB", "fadeToHSB", "fadeToRandomRGB",
    "fadeToRandomHSB", "playLightScript", "stopScript", "setFadeSpeed",
    "setTimeAdjust", "getRGBColor", "setAddress", "getAddress", "getFirmware"
  ]);
};

Cylon.Utils.subclass(BlinkM, I2CDriver);

BlinkM.TO_RGB = 0x6e;
BlinkM.FADE_TO_RGB = 0x63;
BlinkM.FADE_TO_HSB = 0x68;
BlinkM.FADE_TO_RND_RGB = 0x43;
BlinkM.FADE_TO_RND_HSB = 0x48;
BlinkM.PLAY_LIGHT_SCRIPT = 0x70;
BlinkM.STOP_SCRIPT = 0x6f;
BlinkM.SET_FADE = 0x66;
BlinkM.SET_TIME = 0x74;
BlinkM.GET_RGB = 0x67;
BlinkM.GET_ADDRESS = 0x61;
BlinkM.SET_ADDRESS = 0x41;
BlinkM.GET_FIRMWARE = 0x5a;

/**
 * Sets the color of the BlinkM to the specified combination of RGB values.
 *
 * @param {Number} r red value, 0-255
 * @param {Number} g green value, 0-255
 * @param {Number} b blue value, 0-255
 * @param {Function} callback function to invoke when complete
 * @return {void}
 * @publish
 */
BlinkM.prototype.goToRGB = function(r, g, b, callback) {
  this.connection.i2cWrite(this.address, BlinkM.TO_RGB, [r, g, b], callback);
};

/**
 * Fades the color of the BlinkM to the specified combination of RGB values.
 *
 * @param {Number} r red value, 0-255
 * @param {Number} g green value, 0-255
 * @param {Number} b blue value, 0-255
 * @param {Function} callback function to invoke when complete
 * @return {void}
 * @publish
 */
BlinkM.prototype.fadeToRGB = function(r, g, b, callback) {
  this.connection.i2cWrite(this.address,
                           BlinkM.FADE_TO_RGB,
                           [r, g, b],
                           callback);
};

/**
 * Fades the color of the BlinkM to the specified combination of HSB values.
 *
 * @param {Number} h hue value, 0-359
 * @param {Number} s saturation value, 0-100
 * @param {Number} b brightness value, 0-100
 * @param {Function} callback function to invoke when complete
 * @return {void}
 * @publish
 */
BlinkM.prototype.fadeToHSB = function(h, s, b, callback) {
  this.connection.i2cWrite(this.address,
                           BlinkM.FADE_TO_HSB,
                           [h, s, b],
                           callback);
};

/**
 * Fades the color of the BlinkM to a random combination of RGB values.
 *
 * @param {Number} r red value, 0-255
 * @param {Number} g green value, 0-255
 * @param {Number} b blue value, 0-255
 * @param {Function} cb function to invoke when complete
 * @return {void}
 * @publish
 */
BlinkM.prototype.fadeToRandomRGB = function(r, g, b, cb) {
  this.connection.i2cWrite(this.address, BlinkM.FADE_TO_RND_RGB, [r, g, b], cb);
};

/**
 * Fades the color of the BlinkM to a random combination of HSB values.
 *
 * @param {Number} h hue value, 0-359
 * @param {Number} s saturation value, 0-100
 * @param {Number} b brightness value, 0-100
 * @param {Function} cb function to invoke when complete
 * @return {void}
 * @publish
 */
BlinkM.prototype.fadeToRandomHSB = function(h, s, b, cb) {
  this.connection.i2cWrite(this.address, BlinkM.FADE_TO_RND_HSB, [h, s, b], cb);
};

/**
 * Plays a light script for the BlinkM.
 *
 * Available scripts are available in the BlinkM datasheet.
 *
 * A `repeats` value of `0` causes the script to execute until the the
 * `#stopScript` command is called.
 *
 * @param {Number} id light script to play
 * @param {Number} repeats whether the script should repeat
 * @param {Number} startAtLine which line in the light script to start at
 * @param {Function} cb function to invoke when complete
 * @return {void}
 * @publish
 */
BlinkM.prototype.playLightScript = function(id, repeats, startAtLine, cb) {
  this.connection.i2cWrite(
    this.address,
    BlinkM.PLAY_LIGHT_SCRIPT,
    [id, repeats, startAtLine],
    cb
  );
};

/**
 * Stops the currently executing BlinkM light script.
 *
 * @param {Function} cb function to invoke when complete
 * @return {void}
 * @publish
 */
BlinkM.prototype.stopScript = function(cb) {
  this.connection.i2cWrite(this.address, BlinkM.STOP_SCRIPT, [], cb);
};

/**
 * Sets the fade speed for the BlinkM
 *
 * @param {Number} speed how fast colors should fade (1-255)
 * @param {Function} cb function to invoke when complete
 * @return {void}
 * @publish
 */
BlinkM.prototype.setFadeSpeed = function(speed, cb) {
  this.connection.i2cWrite(this.address, BlinkM.SET_FADE, [speed], cb);
};

/**
 * Sets a time adjust for the BlinkM.
 *
 * This affects the duration of scripts.
 *
 * @param {Number} time an integer between -128 and 127. 0 resets the time.
 * @param {Function} cb function to invoke when complete
 * @return {void}
 * @publish
 */
BlinkM.prototype.setTimeAdjust = function(time, cb) {
  this.connection.i2cWrite(this.address, BlinkM.SET_TIME, [time], cb);
};

/**
 * Gets the RGB values for the current BlinkM color.
 *
 * Yields an array in the form `[r, g, b]`, each a 0-255 integer.
 *
 * @param {Function} cb function to invoke when complete
 * @return {void}
 * @publish
 */
BlinkM.prototype.getRGBColor = function(cb) {
  return this.connection.i2cRead(this.address, BlinkM.GET_RGB, 3, cb);
};

/**
 * Returns a string describing the current I2C address being used.
 *
 * @param {Function} cb function to invoke when complete
 * @return {void}
 * @publish
 */
BlinkM.prototype.getAddress = function(cb) {
  return this.connection.i2cRead(this.address, BlinkM.GET_ADDRESS, 1, cb);
};

/**
 * Sets an address to the BlinkM driver
 *
 * @param {Number} address I2C address to set
 * @param {Function} cb function to invoke when complete
 * @return {void}
 * @publish
 */
BlinkM.prototype.setAddress = function(address, cb) {
  this.connection.i2cWrite(
    this.address,
    BlinkM.SET_ADDRESS,
    [address, 0xd0, 0x0d, address],
    cb
  );

  this.address = address;
};

/**
 * Returns a string describing the I2C firmware version being used
 *
 * @param {Function} cb function to invoke when complete
 * @return {void}
 * @publish
 */
BlinkM.prototype.getFirmware = function(cb) {
  return this.connection.i2cRead(this.address, BlinkM.GET_FIRMWARE, 1, cb);
};

},{"./i2c-driver":26,"cylon":34}],24:[function(require,module,exports){
(function (Buffer){
/*
 * BMP180 I2C Barometric Pressure + Temperature sensor driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2015 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

/* eslint camelcase: 0 */

"use strict";

var Cylon = require("cylon");

var I2CDriver = require("./i2c-driver");

/**
 * A BMP180 Driver
 *
 * @constructor bmp180
 */
var Bmp180 = module.exports = function Bmp180() {
  Bmp180.__super__.constructor.apply(this, arguments);

  this.address = this.address || 0x77;

  this.commands = {
    get_pressure: this.getPressure,
    get_temperature: this.getTemperature,
    get_altitude: this.getAltitude
  };
};

Cylon.Utils.subclass(Bmp180, I2CDriver);

Bmp180.REGISTER_CALIBRATION = 0xAA;
Bmp180.REGISTER_CONTROL = 0xF4;
Bmp180.REGISTER_TEMPDATA = 0xF6;
Bmp180.REGISTER_PRESSUREDATA = 0xF6;
Bmp180.REGISTER_READTEMPCMD = 0x2E;
Bmp180.REGISTER_READPRESSURECMD = 0x34;

Bmp180.MODE_LOWRES = 0;
Bmp180.MODE_MEDIUMRES = 1;
Bmp180.MODE_HIGHRES = 2;
Bmp180.MODE_UHIGHRES = 3;

function waitTime(mode) {
  switch (mode) {
    case Bmp180.MODE_LOWRES:
      return 5;
    case Bmp180.MODE_MEDIUMRES:
      return 8;
    case Bmp180.MODE_HIGHRES:
      return 14;
    case Bmp180.MODE_UHIGHRES:
      return 26;
    default:
      return 8;
  }
}

/**
 * Starts the driver
 *
 * @param {Function} callback triggered when the driver is started
 * @return {void}
 */
Bmp180.prototype.start = function(callback) {
  this.readCoefficients(callback);
};

/**
 * Gets the value of the pressure in Pascals.
 *
 * Since temperature is also calculated to determine pressure, it returns the
 * temperature as well.
 *
 * @param {Number} mode mode to use
 * @param {Function} callback function to be invoked with data
 * @return {void}
 * @publish
 */
Bmp180.prototype.getPressure = function(mode, callback) {
  var self = this;
  // need temperature for calibration
  var p = 0,
      temp = 0.0;

  this.getRawTemp(function(err, rawTemp) {
    if (err) {
      callback(err, null);
    } else {
      var result = self.calculateTemperature(rawTemp);
      temp = result.temp;

      self.getRawPressure(mode, function(error, rawPress) {
        if (error) {
          callback(error, null);
        } else {
          var modeVal = parseInt(mode, 10);
          p = self.calculatePressure(modeVal, rawPress, result.b5);

          callback(err, { temp: temp, press: p });
        }
      });
    }
  });
};

/**
 * Gets the value of the temperature in degrees Celsius.
 *
 * @param {Function} callback function to be invoked with data
 * @return {void}
 * @publish
 */
Bmp180.prototype.getTemperature = function(callback) {
  var self = this;

  var temp = 0.0;

  this.getRawTemp(function(err, rawTemp) {
    if (err) {
      callback(err, null);
    } else {
      temp = self.calculateTemperature(rawTemp).temp;

      callback(err, { temp: temp });
    }
  });
};

/**
 * Calculates the altitude from the pressure and temperature.
 *
 * Since temperature and pressure are calculated to determine altitude, it
 * returns all three.
 *
 * @param {Number} mode which mode to use
 * @param {Number} seaLevelPressure the pressure at sea level
 * @param {Function} callback function to be invoked with data
 * @return {void}
 * @publish
 */
Bmp180.prototype.getAltitude = function(mode, seaLevelPressure, callback) {
  if (seaLevelPressure == null) { seaLevelPressure = 101325; }

  this.getPressure(mode, function(err, v) {
    if (err) {
      callback(err, null);
    } else {
      var altitude = 44330.0 *
        (1.0 - Math.pow(v.press / seaLevelPressure, 0.1903));

      callback(err, { temp: v.temp, press: v.press, alt: altitude });
    }
  });
};

Bmp180.prototype.readCoefficients = function(callback) {
  var self = this;

  this.connection.i2cRead(
    this.address,
    Bmp180.REGISTER_CALIBRATION,
    22,
    function(err, d) {
      if (err) {
        callback(err, null);
      } else {
        var data = new Buffer(d);

        self.ac1 = data.readInt16BE(0);
        self.ac2 = data.readInt16BE(2);
        self.ac3 = data.readInt16BE(4);
        self.ac4 = data.readUInt16BE(6);
        self.ac5 = data.readUInt16BE(8);
        self.ac6 = data.readUInt16BE(10);

        self.b1 = data.readInt16BE(12);
        self.b2 = data.readInt16BE(14);

        self.mb = data.readInt16BE(16);
        self.mc = data.readInt16BE(18);
        self.md = data.readInt16BE(20);

        callback(err, data);
        self.emit("start");
      }
    }
  );
};

Bmp180.prototype.getRawTemp = function(callback) {
  var self = this;

  this.connection.i2cWrite(
    self.address,
    Bmp180.REGISTER_CONTROL,
    [Bmp180.REGISTER_READTEMPCMD],
    function(err) {
      if (err) {
        callback(err, null);
      } else {
        setTimeout(function() {
          self.connection.i2cRead(
            self.address,
            Bmp180.REGISTER_TEMPDATA,
            2,
            function(error, d) {
              if (error) {
                callback(error, null);
              } else {
                var data = new Buffer(d);
                var rawTemp = data.readUInt16BE(0);
                callback(null, rawTemp);
              }
            }
          );
        }, 5);
      }
    }
  );
};

Bmp180.prototype.getRawPressure = function(mode, callback) {
  var self = this;

  var modeVal = parseInt(mode, 10);

  if (isNaN(modeVal) || modeVal < 0 || modeVal > 3) {
    callback(new Error("Invalid pressure sensing mode."));
  }

  this.connection.i2cWrite(
    self.address,
    Bmp180.REGISTER_CONTROL,
    [Bmp180.REGISTER_READPRESSURECMD],
    function(err) {
      if (err) {
        callback(err, null);
      } else {
        setTimeout(function() {
          self.connection.i2cRead(
            self.address,
            Bmp180.REGISTER_PRESSUREDATA,
            3,
            function(error, data) {
              if (error) {
                callback(error, null);
              } else {
                var msb = data[0];
                var lsb = data[1];
                var xlsb = data[2];
                var press = ((msb << 16) + (lsb << 8) + xlsb) >> (8 - modeVal);
                callback(null, press);
              }
            }
          );
        }, waitTime(modeVal));
      }
    }
  );
};

Bmp180.prototype.calculateTemperature = function(rawTemp) {
  var x1 = 0,
      x2 = 0,
      b5 = 0,
      temp = 0.0;

  x1 = ((rawTemp - this.ac6) * this.ac5) >> 15;
  x2 = Math.ceil((this.mc << 11) / (x1 + this.md));
  b5 = x1 + x2;
  temp = ((b5 + 8) >> 4) / 10.0;

  return {temp: temp, b5: b5};
};

Bmp180.prototype.calculatePressure = function(mode, rawPress, b5) {
  var x1 = 0,
      x2 = 0,
      x3 = 0,
      b3 = 0,
      b4 = 0,
      b6 = 0,
      b7 = 0,
      p = 0;

  b6 = b5 - 4000;
  x1 = (this.b2 * (b6 * b6) >> 12) >> 11;
  x2 = (this.ac2 * b6) >> 11;
  x3 = x1 + x2;
  b3 = Math.ceil((((this.ac1 * 4 + x3) << mode) + 2) / 4);

  x1 = (this.ac3 * b6) >> 13;
  x2 = (this.b1 * ((b6 * b6) >> 12)) >> 16;
  x3 = ((x1 + x2) + 2) >> 2;
  b4 = (this.ac4 * (x3 + 32768)) >> 15;
  b7 = (rawPress - b3) * (50000 >> mode);

  if (b7 < 0x80000000) {
    p = Math.ceil((b7 * 2) / b4);
  } else {
    p = Math.ceil((b7 / b4) * 2);
  }

  x1 = (p >> 8) * (p >> 8);
  x1 = (x1 * 3038) >> 16;
  x2 = (-7357 * p) >> 16;

  p = p + ((x1 + x2 + 3791) >> 4);
  return p;
};


}).call(this,require("buffer").Buffer)
},{"./i2c-driver":26,"buffer":7,"cylon":34}],25:[function(require,module,exports){
(function (Buffer){
/*
 * HMC6352 Digital Compass driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2015 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require("cylon");

var I2CDriver = require("./i2c-driver");

/**
 * A HMC6352 Driver
 *
 * @constructor hmc6352
 */
var Hmc6352 = module.exports = function Hmc6352() {
  Hmc6352.__super__.constructor.apply(this, arguments);

  // to accomodate the 7-bit device addressing
  this.address = this.address || 0x42 >> 1;

  this.commands = {
    heading: this.heading
  };
};

Cylon.Utils.subclass(Hmc6352, I2CDriver);

/**
 * Starts the driver
 *
 * @param {Function} callback triggered when the driver is started
 * @return {void}
 */
Hmc6352.prototype.start = function(callback) {
  this.connection.i2cWrite(this.address, this.commandBytes("A"));
  callback();
};

/**
 * Returns the heading data for the compass.
 *
 * @param {Function} callback function to be invoked with data
 * @return {void}
 * @publish
 */
Hmc6352.prototype.heading = function(callback) {
  this.connection.i2cRead(
    this.address,
    this.commandBytes("A"),
    2,
    function(err, data) {
      if (typeof callback === "function") {
        callback(err, this.parseHeading(data));
      }
    }.bind(this)
  );
};

/**
 * commandBytes
 *
 * @param {String} s string to coerce to Buffer
 * @return {Buffer} buffer containing command string
 */
Hmc6352.prototype.commandBytes = function(s) {
  return new Buffer(s, "ascii");
};

/**
 * parseHeading
 *
 * @param {Number} val value to parse
 * @return {number} represents the current heading
 */
Hmc6352.prototype.parseHeading = function(val) {
  return (val[1] + val[0] * 256) / 10.0;
};

}).call(this,require("buffer").Buffer)
},{"./i2c-driver":26,"buffer":7,"cylon":34}],26:[function(require,module,exports){
/**
 * Cylon.js - i2c Base Driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2015 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require("cylon");

var I2CDriver = module.exports = function I2CDriver(opts) {
  I2CDriver.__super__.constructor.apply(this, arguments);

  opts = opts || {};

  this.address = opts.address;
};

Cylon.Utils.subclass(I2CDriver, Cylon.Driver);

I2CDriver.prototype.start = function(callback) {
  callback();
};

I2CDriver.prototype.halt = function(callback) {
  callback();
};

},{"cylon":34}],27:[function(require,module,exports){
/*
 * LCD display driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2015 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require("cylon");

var I2CDriver = require("./i2c-driver");

/**
 * A LCD Driver
 *
 * @constructor lcd
 */
var LCD = module.exports = function LCD() {
  LCD.__super__.constructor.apply(this, arguments);

  this.address = this.address || 0x27;
  this._backlightVal = LCD.NOBACKLIGHT;
  this._displayfunction = LCD.FOURBITMODE | LCD.TWOLINE | LCD.FIVExEIGHTDOTS;
  this._displaycontrol = LCD.DISPLAYON | LCD.CURSOROFF | LCD.BLINKOFF;
  this._displaymode = LCD.ENTRYLEFT | LCD.ENTRYSHIFTDECREMENT;

  this.setupCommands([
    "clear", "home", "setCursor", "displayOff", "displayOn",
    "cursorOff", "cursorOn", "blinkOff", "blinkOn", "backlightOff",
    "backlightOn", "print"
  ]);
};

Cylon.Utils.subclass(LCD, I2CDriver);

// i2c commands
LCD.CLEARDISPLAY = 0x01;
LCD.RETURNHOME = 0x02;
LCD.ENTRYMODESET = 0x04;
LCD.DISPLAYCONTROL = 0x08;
LCD.CURSORSHIFT = 0x10;
LCD.FUNCTIONSET = 0x20;
LCD.SETCGRAMADDR = 0x40;
LCD.SETDDRAMADDR = 0x80;

// flags for display entry mode
LCD.ENTRYRIGHT = 0x00;
LCD.ENTRYLEFT = 0x02;
LCD.ENTRYSHIFTINCREMENT = 0x01;
LCD.ENTRYSHIFTDECREMENT = 0x00;

// flags for display on/off control
LCD.DISPLAYON = 0x04;
LCD.DISPLAYOFF = 0x00;
LCD.CURSORON = 0x02;
LCD.CURSOROFF = 0x00;
LCD.BLINKON = 0x01;
LCD.BLINKOFF = 0x00;

// flags for display/cursor shift
LCD.DISPLAYMOVE = 0x08;
LCD.CURSORMOVE = 0x00;
LCD.MOVERIGHT = 0x04;
LCD.MOVELEFT = 0x00;

// flags for function set
LCD.EIGHTBITMODE = 0x10;
LCD.FOURBITMODE = 0x00;
LCD.TWOLINE = 0x08;
LCD.ONELINE = 0x00;
LCD.FIVExTENDOTS = 0x04;
LCD.FIVExEIGHTDOTS = 0x00;

// flags for backlight control
LCD.BACKLIGHT = 0x08;
LCD.NOBACKLIGHT = 0x00;

LCD.En = 0x04; // Enable bit
LCD.Rw = 0x02; // Read/Write bit
LCD.Rs = 0x01; // Register select bit

/**
 * Starts the driver
 *
 * @param {Function} callback triggered when the driver is started
 * @return {void}
 */
LCD.prototype.start = function(callback) {
  Cylon.Utils.sleep(50);

  this._expanderWrite(this._backlightVal);
  Cylon.Utils.sleep(100);

  this._write4bits(0x03 << 4);
  Cylon.Utils.sleep(4);

  this._write4bits(0x03 << 4);
  Cylon.Utils.sleep(4);

  this._write4bits(0x03 << 4);
  this._write4bits(0x02 << 4);
  this._sendCommand(LCD.FUNCTIONSET | this._displayfunction);

  this.displayOn();
  this.clear();

  // Initialize to default text direction (for roman languages), set entry mode
  this._sendCommand(LCD.ENTRYMODESET | this._displaymode);
  this.home();

  every(0, function() {
    this._expanderWrite(this._backlightVal);
  }.bind(this));

  callback();
};

/**
 * Clears display and returns cursor to the home position (address 0).
 *
 * @param {Function} [callback] function to be invoked when done
 * @return {void}
 * @publish
 */
LCD.prototype.clear = function(callback) {
  this._sendCommand(LCD.CLEARDISPLAY);
  Cylon.Utils.sleep(2);

  if (typeof callback === "function") {
    callback();
  }
};

/**
 * Returns cursor to home position.
 *
 * @param {Function} [callback] function to be invoked when done
 * @return {void}
 * @publish
 */
LCD.prototype.home = function(callback) {
  this._sendCommand(LCD.RETURNHOME);
  Cylon.Utils.sleep(2);
  if (typeof callback === "function") {
    callback();
  }
};

/**
 * Sets cursor position.
 *
 * @param {Number} col cursor column to set
 * @param {Number} row cursor row to set
 * @param {Function} [callback] function to be invoked when done
 * @return {void}
 * @publish
 */
LCD.prototype.setCursor = function(col, row, callback) {
  var rowOffsets = [0x00, 0x40, 0x14, 0x54];
  this._sendCommand(LCD.SETDDRAMADDR | (col + rowOffsets[row]));
  if (typeof callback === "function") {
    callback();
  }
};

/**
 * Sets Off of all display (D), cursor Off (C) and blink of cursor position
 * character (B).
 *
 * @param {Function} [callback] function to be invoked when done
 * @return {void}
 * @publish
 */
LCD.prototype.displayOff = function(callback) {
  this._displaycontrol &= ~LCD.DISPLAYON;
  this._sendCommand(LCD.DISPLAYCONTROL | this._displaycontrol);
  if (typeof callback === "function") {
    callback();
  }
};

/**
 * Sets On of all display (D), cursor On (C) and blink of cursor position
 * character (B).
 *
 * @param {Function} [callback] function to be invoked when done
 * @return {void}
 * @publish
 */
LCD.prototype.displayOn = function(callback) {
  this._displaycontrol |= LCD.DISPLAYON;
  this._sendCommand(LCD.DISPLAYCONTROL | this._displaycontrol);
  if (typeof callback === "function") {
    callback();
  }
};

/**
 * Turns off the cursor.
 *
 * @param {Function} [callback] function to be invoked when done
 * @return {void}
 * @publish
 */
LCD.prototype.cursorOff = function(callback) {
  this._displaycontrol &= ~LCD.CURSORON;
  this._sendCommand(LCD.DISPLAYCONTROL | this._displaycontrol);
  if (typeof callback === "function") {
    callback();
  }
};

/**
 * Turns on the cursor.
 *
 * @param {Function} [callback] function to be invoked when done
 * @return {void}
 * @publish
 */
LCD.prototype.cursorOn = function(callback) {
  this._displaycontrol |= LCD.CURSORON;
  this._sendCommand(LCD.DISPLAYCONTROL | this._displaycontrol);
  if (typeof callback === "function") {
    callback();
  }
};

/**
 * Turns off the cursor blinking character.
 *
 * @param {Function} [callback] function to be invoked when done
 * @return {void}
 * @publish
 */
LCD.prototype.blinkOff = function(callback) {
  this._displaycontrol &= ~LCD.BLINKON;
  this._sendCommand(LCD.DISPLAYCONTROL | this._displaycontrol);
  if (typeof callback === "function") {
    callback();
  }
};

/**
 * Turns on the cursor blinking character.
 *
 * @param {Function} [callback] function to be invoked when done
 * @return {void}
 * @publish
 */
LCD.prototype.blinkOn = function(callback) {
  this._displaycontrol |= LCD.BLINKON;
  this._sendCommand(LCD.DISPLAYCONTROL | this._displaycontrol);
  if (typeof callback === "function") {
    callback();
  }
};

/**
 * Turns off the back light.
 *
 * @param {Function} [callback] function to be invoked when done
 * @return {void}
 * @publish
 */
LCD.prototype.backlightOff = function(callback) {
  this._backlightVal = LCD.NOBACKLIGHT;
  this._expanderWrite(0);
  if (typeof callback === "function") {
    callback();
  }
};

/**
 * Turns on the back light.
 *
 * @param {Function} [callback] function to be invoked when done
 * @return {void}
 * @publish
 */
LCD.prototype.backlightOn = function(callback) {
  this._backlightVal = LCD.BACKLIGHT;
  this._expanderWrite(0);
  if (typeof callback === "function") {
    callback();
  }
};

/**
 * Prints characters on the LCD.
 *
 * @param {String} str string to print on the LCD
 * @param {Function} [callback] function to be invoked when done
 * @return {void}
 * @publish
 */
LCD.prototype.print = function(str, callback) {
  var chars = str.split("");

  for (var i = 0; i < chars.length; i++) {
    this._writeData(chars[i].charCodeAt(0));
  }

  if (typeof callback === "function") {
    callback();
  }
};

LCD.prototype._write4bits = function(val) {
  this._expanderWrite(val);
  this._pulseEnable(val);
};

LCD.prototype._expanderWrite = function(data) {
  this.connection.i2cWrite(this.address, (data | this._backlightVal) & 0xFF);
};

LCD.prototype._pulseEnable = function(data) {
  this._expanderWrite(data | LCD.En);
  Cylon.Utils.sleep(0.0001);
  this._expanderWrite(data & ~LCD.En);
  Cylon.Utils.sleep(0.05);
};

LCD.prototype._sendCommand = function(value) {
  this._sendData(value, 0);
};

LCD.prototype._writeData = function(value) {
  this._sendData(value, LCD.Rs);
};

LCD.prototype._sendData = function(val, mode) {
  var highnib = val & 0xf0,
      lownib = (val << 4) & 0xf0;

  this._write4bits(highnib | mode);
  this._write4bits(lownib | mode);
};

},{"./i2c-driver":26,"cylon":34}],28:[function(require,module,exports){
/*
 * LIDAR-Lite driver
 * http://cylonjs.com
 *
 * Copyright (c) 2015 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require("cylon");

var I2CDriver = require("./i2c-driver");

/**
 * LIDAR-Lite Driver
 *
 * @constructor LidarLite
 */
var LIDARLite = module.exports = function LIDARLite() {
  LIDARLite.__super__.constructor.apply(this, arguments);
  this.address = this.address || 0x62;
  this.commands = {
    distance: this.distance
  };
};

Cylon.Utils.subclass(LIDARLite, I2CDriver);

// Register to write to initiate ranging.
LIDARLite.RegisterMeasure = 0x00;
// Value to initiate ranging.
LIDARLite.MeasureValue = 0x04;
// Register to get both High and Low bytes in 1 call.
LIDARLite.RegisterHighLowB = 0x8f;

/**
 * Returns the distance data for the LIDAR-Lite in cm.
 *
 * @param {Function} callback function to be invoked when done
 * @return {void}
 * @publish
 */
LIDARLite.prototype.distance = function(callback) {
  this.connection.i2cWrite(this.address,
                           LIDARLite.RegisterMeasure,
                           LIDARLite.MeasureValue);
  Cylon.Utils.sleep(20);

  this.connection.i2cRead(
    this.address,
    LIDARLite.RegisterHighLowB,
    2,
    function(err, data) {
      if (typeof callback === "function") {
        callback(err, this.parseDistance(data));
      }
    }.bind(this)
  );
};

/**
 * parseDistance
 *
 * @param {Number} val value to parse
 * @return {number} represents the current distance
 */
LIDARLite.prototype.parseDistance = function(val) {
  return (val[0] << 8) + val[1];
};

},{"./i2c-driver":26,"cylon":34}],29:[function(require,module,exports){
(function (Buffer){
/*
 * LSM9DS0G I2C gyroscope driver
 * http://cylonjs.com
 *
 * Copyright (c) 2014-2015 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require("cylon");

var I2CDriver = require("./i2c-driver");

/**
 * A LSM9DS0G Driver
 *
 * @constructor lsm9ds0g
 * @param {Object} [opts] options object
 * @param {Number} opts.scale gyroscope scale
 * @param {Number} opts.odr ODR setting
 */
var LSM9DS0G = module.exports = function LSM9DS0G(opts) {
  LSM9DS0G.__super__.constructor.apply(this, arguments);
  this.address = this.address || 0x6b;

  this.scale = opts.scale || LSM9DS0G.G_SCALE_245DPS;
  this.odr = opts.odr || LSM9DS0G.G_ODR_95_BW_125;

  this.commands = {
    getGyro: this.getGyro
  };
};

Cylon.Utils.subclass(LSM9DS0G, I2CDriver);

LSM9DS0G.WHO_AM_I_G = 0x0F;
LSM9DS0G.CTRL_REG1_G = 0x20;
LSM9DS0G.CTRL_REG2_G = 0x21;
LSM9DS0G.CTRL_REG3_G = 0x22;
LSM9DS0G.CTRL_REG4_G = 0x23;
LSM9DS0G.CTRL_REG5_G = 0x24;
LSM9DS0G.REFERENCE_G = 0x25;
LSM9DS0G.STATUS_REG_G = 0x27;
LSM9DS0G.OUT_X_L_G = 0x28;
LSM9DS0G.OUT_X_H_G = 0x29;
LSM9DS0G.OUT_Y_L_G = 0x2A;
LSM9DS0G.OUT_Y_H_G = 0x2B;
LSM9DS0G.OUT_Z_L_G = 0x2C;
LSM9DS0G.OUT_Z_H_G = 0x2D;
LSM9DS0G.FIFO_CTRL_REG_G = 0x2E;
LSM9DS0G.FIFO_SRC_REG_G = 0x2F;
LSM9DS0G.INT1_CFG_G = 0x30;
LSM9DS0G.INT1_SRC_G = 0x31;
LSM9DS0G.INT1_THS_XH_G = 0x32;
LSM9DS0G.INT1_THS_XL_G = 0x33;
LSM9DS0G.INT1_THS_YH_G = 0x34;
LSM9DS0G.INT1_THS_YL_G = 0x35;
LSM9DS0G.INT1_THS_ZH_G = 0x36;
LSM9DS0G.INT1_THS_ZL_G = 0x37;
LSM9DS0G.INT1_DURATION_G = 0x38;

LSM9DS0G.G_SCALE_245DPS = 0;  // 245 degrees per second
LSM9DS0G.G_SCALE_500DPS = 1;  // 500 dps
LSM9DS0G.G_SCALE_2000DPS = 2; // 2000 dps

LSM9DS0G.G_ODR_95_BW_125 = 0x0;  //   95         12.5
LSM9DS0G.G_ODR_95_BW_25 = 0x1;   //   95          25

    // 0x2 and 0x3 define the same data rate and bandwidth
LSM9DS0G.G_ODR_190_BW_125 = 0x4; //   190        12.5
LSM9DS0G.G_ODR_190_BW_25 = 0x5;  //   190         25
LSM9DS0G.G_ODR_190_BW_50 = 0x6;  //   190         50
LSM9DS0G.G_ODR_190_BW_70 = 0x7;  //   190         70
LSM9DS0G.G_ODR_380_BW_20 = 0x8;  //   380         20
LSM9DS0G.G_ODR_380_BW_25 = 0x9;  //   380         25
LSM9DS0G.G_ODR_380_BW_50 = 0xA;  //   380         50
LSM9DS0G.G_ODR_380_BW_100 = 0xB; //   380         100
LSM9DS0G.G_ODR_760_BW_30 = 0xC;  //   760         30
LSM9DS0G.G_ODR_760_BW_35 = 0xD;  //   760         35
LSM9DS0G.G_ODR_760_BW_50 = 0xE;  //   760         50
LSM9DS0G.G_ODR_760_BW_100 = 0xF; //   760         100

/**
 * Starts the driver
 *
 * @param {Function} callback triggered when the driver is started
 * @return {void}
 */
LSM9DS0G.prototype.start = function(callback) {
  this._initGyro();
  callback();
};

/**
 * Gets the value of Gyroscope.
 *
 * @param {Function} callback function to be invoked with data
 * @return {void}
 * @publish
 */
LSM9DS0G.prototype.getGyro = function(callback) {
  var self = this;

  self.connection.i2cRead(self.address,
                          LSM9DS0G.OUT_X_L_G,
                          6,
    function(err, d) {
      if (err) {
        callback(err, null);
      } else {
        var result = {};
        var data = new Buffer(d);
        result.x = data.readInt16LE(0); // Store x-axis values into gx
        result.y = data.readInt16LE(2); // Store y-axis values into gy
        result.z = data.readInt16LE(4); // Store z-axis values into gz
        callback(null, result);
      }
    }
  );

};

LSM9DS0G.prototype._initGyro = function() {
  /* CTRL_REG1_G sets output data rate, bandwidth, power-down and enables
  Bits[7:0]: DR1 DR0 BW1 BW0 PD Zen Xen Yen
  DR[1:0] - Output data rate selection
    00=95Hz, 01=190Hz, 10=380Hz, 11=760Hz
  BW[1:0] - Bandwidth selection (sets cutoff frequency)
     Value depends on ODR. See datasheet table 21.
  PD - Power down enable (0=power down mode, 1=normal or sleep mode)
  Zen, Xen, Yen - Axis enable (o=disabled, 1=enabled) */
  // Normal mode, enable all axes
  this.connection.i2cWrite(this.address, LSM9DS0G.CTRL_REG1_G, 0x0F);

  /* CTRL_REG2_G sets up the HPF
  Bits[7:0]: 0 0 HPM1 HPM0 HPCF3 HPCF2 HPCF1 HPCF0
  HPM[1:0] - High pass filter mode selection
    00=normal (reset reading HP_RESET_FILTER, 01=ref signal for filtering,
    10=normal, 11=autoreset on interrupt
  HPCF[3:0] - High pass filter cutoff frequency
    Value depends on data rate. See datasheet table 26.
  */
  // Normal mode, high cutoff frequency
  this.connection.i2cWrite(this.address, LSM9DS0G.CTRL_REG2_G, 0x00);

  /* CTRL_REG3_G sets up interrupt and DRDY_G pins
  Bits[7:0]: I1_IINT1 I1_BOOT H_LACTIVE PP_OD I2_DRDY I2_WTM I2_ORUN I2_EMPTY
  I1_INT1 - Interrupt enable on INT_G pin (0=disable, 1=enable)
  I1_BOOT - Boot status available on INT_G (0=disable, 1=enable)
  H_LACTIVE - Interrupt active configuration on INT_G (0:high, 1:low)
  PP_OD - Push-pull/open-drain (0=push-pull, 1=open-drain)
  I2_DRDY - Data ready on DRDY_G (0=disable, 1=enable)
  I2_WTM - FIFO watermark interrupt on DRDY_G (0=disable 1=enable)
  I2_ORUN - FIFO overrun interrupt on DRDY_G (0=disable 1=enable)
  I2_EMPTY - FIFO empty interrupt on DRDY_G (0=disable 1=enable) */
  // Int1 enabled (pp, active low), data read on DRDY_G:
  this.connection.i2cWrite(this.address, LSM9DS0G.CTRL_REG3_G, 0x88);

  /* CTRL_REG4_G sets the scale, update mode
  Bits[7:0] - BDU BLE FS1 FS0 - ST1 ST0 SIM
  BDU - Block data update (0=continuous, 1=output not updated until read
  BLE - Big/little endian (0=data LSB @ lower address, 1=LSB @ higher add)
  FS[1:0] - Full-scale selection
    00=245dps, 01=500dps, 10=2000dps, 11=2000dps
  ST[1:0] - Self-test enable
    00=disabled, 01=st 0 (x+, y-, z-), 10=undefined, 11=st 1 (x-, y+, z+)
  SIM - SPI serial interface mode select
    0=4 wire, 1=3 wire */
  // Set scale to 245 dps
  this.connection.i2cWrite(this.address, LSM9DS0G.CTRL_REG4_G, 0x00);

  /* CTRL_REG5_G sets up the FIFO, HPF, and INT1
  Bits[7:0] - BOOT FIFO_EN - HPen INT1_Sel1 INT1_Sel0 Out_Sel1 Out_Sel0
  BOOT - Reboot memory content (0=normal, 1=reboot)
  FIFO_EN - FIFO enable (0=disable, 1=enable)
  HPen - HPF enable (0=disable, 1=enable)
  INT1_Sel[1:0] - Int 1 selection configuration
  Out_Sel[1:0] - Out selection configuration */
  this.connection.i2cWrite(this.address, LSM9DS0G.CTRL_REG5_G, 0x00);
};

}).call(this,require("buffer").Buffer)
},{"./i2c-driver":26,"buffer":7,"cylon":34}],30:[function(require,module,exports){
(function (Buffer){
/*
 * LSM9DS0XM I2C accelerometer driver
 * http://cylonjs.com
 *
 * Copyright (c) 2014-2015 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require("cylon");

var I2CDriver = require("./i2c-driver");

/**
 * A LSM9DS0XM Driver
 *
 * @constructor lsm9ds0xm
 */
var LSM9DS0XM = module.exports = function LSM9DS0XM() {
  LSM9DS0XM.__super__.constructor.apply(this, arguments);
  this.address = this.address || 0x1d;

  this.commands = {
    getAccel: this.getAccel,
    getMag: this.getMag
  };
};

Cylon.Utils.subclass(LSM9DS0XM, I2CDriver);

LSM9DS0XM.OUT_TEMP_L_XM = 0x05;
LSM9DS0XM.OUT_TEMP_H_XM = 0x06;
LSM9DS0XM.STATUS_REG_M = 0x07;
LSM9DS0XM.OUT_X_L_M = 0x08;
LSM9DS0XM.OUT_X_H_M = 0x09;
LSM9DS0XM.OUT_Y_L_M = 0x0A;
LSM9DS0XM.OUT_Y_H_M = 0x0B;
LSM9DS0XM.OUT_Z_L_M = 0x0C;
LSM9DS0XM.OUT_Z_H_M = 0x0D;
LSM9DS0XM.WHO_AM_I_XM = 0x0F;
LSM9DS0XM.INT_CTRL_REG_M = 0x12;
LSM9DS0XM.INT_SRC_REG_M = 0x13;
LSM9DS0XM.INT_THS_L_M = 0x14;
LSM9DS0XM.INT_THS_H_M = 0x15;
LSM9DS0XM.OFFSET_X_L_M = 0x16;
LSM9DS0XM.OFFSET_X_H_M = 0x17;
LSM9DS0XM.OFFSET_Y_L_M = 0x18;
LSM9DS0XM.OFFSET_Y_H_M = 0x19;
LSM9DS0XM.OFFSET_Z_L_M = 0x1A;
LSM9DS0XM.OFFSET_Z_H_M = 0x1B;
LSM9DS0XM.REFERENCE_X = 0x1C;
LSM9DS0XM.REFERENCE_Y = 0x1D;
LSM9DS0XM.REFERENCE_Z = 0x1E;
LSM9DS0XM.CTRL_REG0_XM = 0x1F;
LSM9DS0XM.CTRL_REG1_XM = 0x20;
LSM9DS0XM.CTRL_REG2_XM = 0x21;
LSM9DS0XM.CTRL_REG3_XM = 0x22;
LSM9DS0XM.CTRL_REG4_XM = 0x23;
LSM9DS0XM.CTRL_REG5_XM = 0x24;
LSM9DS0XM.CTRL_REG6_XM = 0x25;
LSM9DS0XM.CTRL_REG7_XM = 0x26;
LSM9DS0XM.STATUS_REG_A = 0x27;
LSM9DS0XM.OUT_X_L_A = 0x28;
LSM9DS0XM.OUT_X_H_A = 0x29;
LSM9DS0XM.OUT_Y_L_A = 0x2A;
LSM9DS0XM.OUT_Y_H_A = 0x2B;
LSM9DS0XM.OUT_Z_L_A = 0x2C;
LSM9DS0XM.OUT_Z_H_A = 0x2D;
LSM9DS0XM.FIFO_CTRL_REG = 0x2E;
LSM9DS0XM.FIFO_SRC_REG = 0x2F;
LSM9DS0XM.INT_GEN_1_REG = 0x30;
LSM9DS0XM.INT_GEN_1_SRC = 0x31;
LSM9DS0XM.INT_GEN_1_THS = 0x32;
LSM9DS0XM.INT_GEN_1_DURATION = 0x33;
LSM9DS0XM.INT_GEN_2_REG = 0x34;
LSM9DS0XM.INT_GEN_2_SRC = 0x35;
LSM9DS0XM.INT_GEN_2_THS = 0x36;
LSM9DS0XM.INT_GEN_2_DURATION = 0x37;
LSM9DS0XM.CLICK_CFG = 0x38;
LSM9DS0XM.CLICK_SRC = 0x39;
LSM9DS0XM.CLICK_THS = 0x3A;
LSM9DS0XM.TIME_LIMIT = 0x3B;
LSM9DS0XM.TIME_LATENCY = 0x3C;
LSM9DS0XM.TIME_WINDOW = 0x3D;
LSM9DS0XM.ACT_THS = 0x3E;
LSM9DS0XM.ACT_DUR = 0x3F;

/**
 * Starts the driver
 *
 * @param {Function} callback triggered when the driver is started
 * @return {void}
 */
LSM9DS0XM.prototype.start = function(callback) {
  this._initAccel();
  this._initMag();
  callback();
};

/**
 * Gets the value of Accelerometer.
 *
 * @param {Function} callback callback to be invoked with data
 * @return {void}
 * @publish
 */
LSM9DS0XM.prototype.getAccel = function(callback) {
  var self = this;

  self.connection.i2cRead(self.address,
                          LSM9DS0XM.OUT_X_L_A,
                          6,
    function(err, d) {
      if (err) {
        callback(err, null);
      } else {
        var result = {};
        var data = new Buffer(d);
        result.x = data.readInt16LE(0);
        result.y = data.readInt16LE(2);
        result.z = data.readInt16LE(4);
        callback(null, result);
      }
    }
  );
};

/**
 * Gets the value of Magnetometer.
 *
 * @param {Function} callback callback to be invoked with data
 * @return {void}
 * @publish
 */
LSM9DS0XM.prototype.getMag = function(callback) {
  var self = this;

  self.connection.i2cRead(self.address,
                          LSM9DS0XM.OUT_X_L_M,
                          6,
    function(err, d) {
      if (err) {
        callback(err, null);
      } else {
        var result = {};
        var data = new Buffer(d);
        result.x = data.readInt16LE(0);
        result.y = data.readInt16LE(2);
        result.z = data.readInt16LE(4);
        callback(null, result);
      }
    }
  );
};

LSM9DS0XM.prototype._initAccel = function() {
  /* CTRL_REG0_XM (0x1F) (Default value: 0x00)
  Bits (7-0): BOOT FIFO_EN WTM_EN 0 0 HP_CLICK HPIS1 HPIS2
  BOOT - Reboot memory content (0: normal, 1: reboot)
  FIFO_EN - Fifo enable (0: disable, 1: enable)
  WTM_EN - FIFO watermark enable (0: disable, 1: enable)
  HP_CLICK - HPF enabled for click (0: filter bypassed, 1: enabled)
  HPIS1 - HPF enabled for interrupt generator 1 (0: bypassed, 1: enabled)
  HPIS2 - HPF enabled for interrupt generator 2 (0: bypassed, 1 enabled)   */
  this.connection.i2cWrite(this.address, LSM9DS0XM.CTRL_REG0_XM, 0x00);

  /* CTRL_REG1_XM (0x20) (Default value: 0x07)
  Bits (7-0): AODR3 AODR2 AODR1 AODR0 BDU AZEN AYEN AXEN
  AODR[3:0] - select the acceleration data rate:
    0000=power down, 0001=3.125Hz, 0010=6.25Hz, 0011=12.5Hz,
    0100=25Hz, 0101=50Hz, 0110=100Hz, 0111=200Hz, 1000=400Hz,
    1001=800Hz, 1010=1600Hz, (remaining combinations undefined).
  BDU - block data update for accel AND mag
    0: Continuous update
    1: Output registers aren't updated until MSB and LSB have been read.
  AZEN, AYEN, and AXEN - Acceleration x/y/z-axis enabled.
    0: Axis disabled, 1: Axis enabled                  */
  // 100Hz data rate, x/y/z all enabled
  this.connection.i2cWrite(this.address, LSM9DS0XM.CTRL_REG1_XM, 0x57);

  /* CTRL_REG2_XM (0x21) (Default value: 0x00)
  Bits (7-0): ABW1 ABW0 AFS2 AFS1 AFS0 AST1 AST0 SIM
  ABW[1:0] - Accelerometer anti-alias filter bandwidth
    00=773Hz, 01=194Hz, 10=362Hz, 11=50Hz
  AFS[2:0] - Accel full-scale selection
    000=+/-2g, 001=+/-4g, 010=+/-6g, 011=+/-8g, 100=+/-16g
  AST[1:0] - Accel self-test enable
    00=normal (no self-test), 01=positive st, 10=negative st, 11=not allowed
  SIM - SPI mode selection
    0=4-wire, 1=3-wire                           */
  this.connection.i2cWrite(this.address,
                           LSM9DS0XM.CTRL_REG2_XM,
                           0x00); // Set scale to 2g

  /* CTRL_REG3_XM is used to set interrupt generators on INT1_XM
  Bits (7-0): P1_BOOT P1_TAP P1_INT1 P1_INT2 P1_INTM P1_DRDYA P1_DRDYM P1_EMPTY
  */
  // Accelerometer data ready on INT1_XM (0x04)
  this.connection.i2cWrite(this.address, LSM9DS0XM.CTRL_REG3_XM, 0x04);
};

LSM9DS0XM.prototype._initMag = function() {
  /* CTRL_REG5_XM enables temp sensor, sets mag resolution and data rate
  Bits (7-0): TEMP_EN M_RES1 M_RES0 M_ODR2 M_ODR1 M_ODR0 LIR2 LIR1
  TEMP_EN - Enable temperature sensor (0=disabled, 1=enabled)
  M_RES[1:0] - Magnetometer resolution select (0=low, 3=high)
  M_ODR[2:0] - Magnetometer data rate select
    000=3.125Hz, 001=6.25Hz, 010=12.5Hz, 011=25Hz, 100=50Hz, 101=100Hz
  LIR2 - Latch interrupt request on INT2_SRC (cleared by reading INT2_SRC)
    0=interrupt request not latched, 1=interrupt request latched
  LIR1 - Latch interrupt request on INT1_SRC (cleared by readging INT1_SRC)
    0=irq not latched, 1=irq latched                   */
  // Mag data rate - 100 Hz, enable temperature sensor
  this.connection.i2cWrite(this.address, LSM9DS0XM.CTRL_REG5_XM, 0x94);

  /* CTRL_REG6_XM sets the magnetometer full-scale
  Bits (7-0): 0 MFS1 MFS0 0 0 0 0 0
  MFS[1:0] - Magnetic full-scale selection
  00:+/-2Gauss, 01:+/-4Gs, 10:+/-8Gs, 11:+/-12Gs               */
  // Mag scale to +/- 2GS
  this.connection.i2cWrite(this.address, LSM9DS0XM.CTRL_REG6_XM, 0x00);

  /* CTRL_REG7_XM sets magnetic sensor mode, low power mode, and filters
  AHPM1 AHPM0 AFDS 0 0 MLP MD1 MD0
  AHPM[1:0] - HPF mode selection
    00=normal (resets reference registers), 01=reference signal for filtering,
    10=normal, 11=autoreset on interrupt event
  AFDS - Filtered acceleration data selection
    0=internal filter bypassed, 1=data from internal filter sent to FIFO
  MLP - Magnetic data low-power mode
    0=data rate is set by M_ODR bits in CTRL_REG5
    1=data rate is set to 3.125Hz
  MD[1:0] - Magnetic sensor mode selection (default 10)
    00=continuous-conversion, 01=single-conversion, 10 and 11=power-down */
  // Continuous conversion mode
  this.connection.i2cWrite(this.address, LSM9DS0XM.CTRL_REG7_XM, 0x00);

  /* CTRL_REG4_XM is used to set interrupt generators on INT2_XM
  Bits (7-0): P2_TAP P2_INT1 P2_INT2 P2_INTM P2_DRDYA P2_DRDYM P2_Overrun P2_WTM
  */
  // Magnetometer data ready on INT2_XM (0x08)
  this.connection.i2cWrite(this.address, LSM9DS0XM.CTRL_REG4_XM, 0x04);

  /* INT_CTRL_REG_M to set push-pull/open drain, and active-low/high
  Bits[7:0] - XMIEN YMIEN ZMIEN PP_OD IEA IEL 4D MIEN
  XMIEN, YMIEN, ZMIEN - Enable interrupt recognition on axis for mag data
  PP_OD - Push-pull/open-drain interrupt configuration (0=push-pull, 1=od)
  IEA - Interrupt polarity for accel and magneto
    0=active-low, 1=active-high
  IEL - Latch interrupt request for accel and magneto
    0=irq not latched, 1=irq latched
  4D - 4D enable. 4D detection is enabled when 6D bit in INT_GEN1_REG is set
  MIEN - Enable interrupt generation for magnetic data
    0=disable, 1=enable) */
  // Enable interrupts for mag, active-low, push-pull
  this.connection.i2cWrite(this.address, LSM9DS0XM.INT_CTRL_REG_M, 0x09);
};

}).call(this,require("buffer").Buffer)
},{"./i2c-driver":26,"buffer":7,"cylon":34}],31:[function(require,module,exports){
(function (Buffer){
/*
 * MPL115A2 I2C Barometric Pressure + Temperature sensor driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2015 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

/* eslint camelcase: 0 */

"use strict";

var Cylon = require("cylon");

var I2CDriver = require("./i2c-driver");

/**
 * A MPL115A2 Driver
 *
 * @constructor mpl115a2
 */
var Mpl115A2 = module.exports = function Mpl115A2() {
  Mpl115A2.__super__.constructor.apply(this, arguments);
  this.address = this.address || 0x60;
  this.commands = {
    get_pressure: this.getPressure,
    get_temperature: this.getTemperature
  };
};

Cylon.Utils.subclass(Mpl115A2, I2CDriver);

Mpl115A2.REGISTER_PRESSURE_MSB = 0x00;
Mpl115A2.REGISTER_PRESSURE_LSB = 0x01;
Mpl115A2.REGISTER_TEMP_MSB = 0x02;
Mpl115A2.REGISTER_TEMP_LSB = 0x03;
Mpl115A2.REGISTER_A0_COEFF_MSB = 0x04;
Mpl115A2.REGISTER_A0_COEFF_LSB = 0x05;
Mpl115A2.REGISTER_B1_COEFF_MSB = 0x06;
Mpl115A2.REGISTER_B1_COEFF_LSB = 0x07;
Mpl115A2.REGISTER_B2_COEFF_MSB = 0x08;
Mpl115A2.REGISTER_B2_COEFF_LSB = 0x09;
Mpl115A2.REGISTER_C12_COEFF_MSB = 0x0A;
Mpl115A2.REGISTER_C12_COEFF_LSB = 0x0B;
Mpl115A2.REGISTER_STARTCONVERSION = 0x12;

/**
 * Starts the driver
 *
 * @param {Function} callback triggered when the driver is started
 * @return {void}
 */
Mpl115A2.prototype.start = function(callback) {
  this.readCoefficients(callback);
};

Mpl115A2.prototype.readCoefficients = function(callback) {
  var self = this;

  this.connection.i2cRead(
    this.address,
    Mpl115A2.REGISTER_A0_COEFF_MSB,
    8,
    function(err, d) {
      var data = new Buffer(d);

      var a0coeff = data.readUInt16BE(0),
          b1coeff = data.readUInt16BE(2),
          b2coeff = data.readUInt16BE(4),
          c12coeff = (data.readUInt16BE(6)) >> 2;

      self.a0 = a0coeff / 8;
      self.b1 = b1coeff / 8192;
      self.b2 = b2coeff / 16384;
      self.c12 = c12coeff / 4194304.0;

      callback(err, data);
      self.emit("start");
    }
  );
};


Mpl115A2.prototype.getPT = function(callback) {
  var self = this;

  this.connection.i2cWrite(this.address,
                           Mpl115A2.REGISTER_STARTCONVERSION, [0x00]);
  this.connection.i2cWrite(this.address, 0x00);

  Cylon.Utils.sleep(5);

  this.connection.i2cRead(
    this.address,
    Mpl115A2.REGISTER_PRESSURE_MSB,
    4,
    function(err, d) {
      var pressure, temp, pressureComp;
      var data = new Buffer(d);

      pressure = (data.readUInt16BE(0)) >> 6;

      temp = (data.readUInt16BE(2)) >> 6;

      pressureComp = self.a0 + (self.b1 + self.c12 * temp) * pressure;

      pressureComp += self.b2 * temp * 1.0;

      self.pressure = ((65.0 / 1023.0) * pressureComp) + 50.0;
      self.temperature = ((temp - 498.0) / -5.35) + 25.0;

      var values = {
        pressure: self.pressure,
        temperature: self.temperature
      };

      callback(err, values);
    }
  );
};

/**
 * Gets value of the pressure.
 *
 * @param {Function} callback
 * @return {integer}
 * @publish
 */
Mpl115A2.prototype.getPressure = Mpl115A2.prototype.getPT;

/**
 * Gets value of the temperature.
 *
 * @param {Function} callback
 * @return {integer}
 * @publish
 */
Mpl115A2.prototype.getTemperature = Mpl115A2.prototype.getPT;

}).call(this,require("buffer").Buffer)
},{"./i2c-driver":26,"buffer":7,"cylon":34}],32:[function(require,module,exports){
(function (Buffer){
/*
 * MPU6050 I2C accelerometer and temperature sensor driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013-15 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

/* eslint camelcase: 0 */

"use strict";

var Cylon = require("cylon");

var I2CDriver = require("./i2c-driver");

/**
 * A MPU6050 Driver
 *
 * @constructor mpu6050
 */
var Mpu6050 = module.exports = function Mpu6050() {
  Mpu6050.__super__.constructor.apply(this, arguments);
  this.address = this.address || 0x68; // DataSheet
  this.commands = {
    get_angular_velocity: this.getAngularVelocity,
    get_acceleration: this.getAcceleration,
    get_motion_and_temp: this.getMotionAndTemp
  };
};

Cylon.Utils.subclass(Mpu6050, I2CDriver);

Mpu6050.RA_ACCEL_XOUT_H = 0x3B;
Mpu6050.RA_PWR_MGMT_1 = 0x6B;
Mpu6050.PWR1_CLKSEL_BIT = 2;
Mpu6050.PWR1_CLKSEL_LENGTH = 3;
Mpu6050.CLOCK_PLL_XGYRO = 0x01;

Mpu6050.GYRO_FS_250 = 0x00;
Mpu6050.RA_GYRO_CONFIG = 0x1B;
Mpu6050.GCONFIG_FS_SEL_LENGTH = 2;
Mpu6050.GCONFIG_FS_SEL_BIT = 4;

Mpu6050.RA_ACCEL_CONFIG = 0x1C;
Mpu6050.ACONFIG_AFS_SEL_BIT = 4;
Mpu6050.ACONFIG_AFS_SEL_LENGTH = 2;
Mpu6050.ACCEL_FS_2 = 0x00;

Mpu6050.RA_PWR_MGMT_1 = 0x6B;
Mpu6050.PWR1_SLEEP_BIT = 6;

/**
 * Starts the driver
 *
 * @param {Function} callback triggered when the driver is started
 * @return {void}
 */
Mpu6050.prototype.start = function(callback) {
  // setClockSource
  this._writeBits(Mpu6050.RA_PWR_MGMT_1,
                  [Mpu6050.PWR1_CLKSEL_BIT,
                   Mpu6050.PWR1_CLKSEL_LENGTH,
                   Mpu6050.CLOCK_PLL_XGYRO]);

  // setFullScaleGyroRange
  this._writeBits(Mpu6050.RA_GYRO_CONFIG,
                  [Mpu6050.GCONFIG_FS_SEL_BIT,
                   Mpu6050.GCONFIG_FS_SEL_LENGTH,
                   Mpu6050.GYRO_FS_250]);

  // setFullScaleAccelRange
  this._writeBits(Mpu6050.RA_ACCEL_CONFIG,
                  [Mpu6050.ACONFIG_AFS_SEL_BIT,
                   Mpu6050.ACONFIG_AFS_SEL_LENGTH,
                   Mpu6050.ACCEL_FS_2]);

  callback();
  this.emit("start");
};

/**
 * Gets the value of the Angular Velocity
 *
 * @param {Function} callback function to be invoked with data
 * @return {void}
 * @publish
 */
Mpu6050.prototype.getAngularVelocity = function(callback) {
  this.getMotionAndTemp(callback);
};

/**
 * Gets the value of the Acceleration
 *
 * @param {Function} callback function to be invoked with data
 * @return {void}
 * @publish
 */
Mpu6050.prototype.getAcceleration = function(callback) {
  this.getMotionAndTemp(callback);
};

/**
 * Gets the value of the Motion.
 *
 * @param {Function} callback function to be invoked with data
 * @return {void}
 * @publish
 */
Mpu6050.prototype.getMotionAndTemp = function(callback) {
  // first, wake up
  this.connection.i2cWrite(this.address, Mpu6050.RA_PWR_MGMT_1, [0x00]);

  this.connection.i2cRead(
    this.address,
    Mpu6050.RA_ACCEL_XOUT_H,
    14,
    function(err, d) {
      var data = new Buffer(d);
      var ax = data.readInt16BE(0),
          ay = data.readInt16BE(2),
          az = data.readInt16BE(4);

      var temp = data.readInt16BE(6);

      var gx = data.readInt16BE(8),
          gy = data.readInt16BE(10),
          gz = data.readInt16BE(12);

      var values = {
        a: [ax, ay, az],
        g: [gx, gy, gz],
        t: this.convertToCelsius(temp)
      };

      callback(err, values);
    }.bind(this));
};

// The temperature sensor is -40 to +85 degrees Celsius.
// It is a signed integer.
// According to the datasheet:
//   340 per degrees Celsius, -512 at 35 degrees.
// At 0 degrees: -512 - (340 * 35) = -12412
Mpu6050.prototype.convertToCelsius = function(temp) {
  return (temp + 12412.0) / 340.0;
};

Mpu6050.prototype._bitMask = function(bit, bitLength) {
  return ((1 << bitLength) - 1) << (1 + bit - bitLength);
};

Mpu6050.prototype._writeBits = function(func, bit, bitLength, value, callback) {
  var that = this;
  this.connection.i2cRead(this.address, func, 1, function(err, buffer) {
    if (err) { return; }
    var mask = that._bitMask(bit, bitLength);
    var newValue = buffer ^ ((buffer ^ (value << bit)) & mask);
    console.log(newValue);
    that.connection.i2cWrite(that.address, func, [newValue], callback);
  });
};

}).call(this,require("buffer").Buffer)
},{"./i2c-driver":26,"buffer":7,"cylon":34}],33:[function(require,module,exports){
/*
 * PCA9685 driver
 * http://cylonjs.com
 *
 * Copyright (c) 2015 The Hybrid Group
 * Licensed under the Apache 2.0 license.
 */

/* eslint camelcase: 0 */

"use strict";

var Cylon = require("cylon");

var I2CDriver = require("./i2c-driver");

/**
 * PCA9685 Driver
 *
 * @constructor pca9685
 */
var PCA9685 = module.exports = function PCA9685() {
  PCA9685.__super__.constructor.apply(this, arguments);
  this.address = this.address || 0x40;
  this.commands = {
    stop: this.stop,
    set_pwm_freq: this.setPWMFreq,
    set_pwm: this.setPWM
  };
};

Cylon.Utils.subclass(PCA9685, I2CDriver);

PCA9685.MODE1 = 0x00;
PCA9685.PRESCALE = 0xFE;
PCA9685.SUBADR1 = 0x02;
PCA9685.SUBADR2 = 0x03;
PCA9685.SUBADR3 = 0x04;
PCA9685.LED0_ON_L = 0x06;
PCA9685.LED0_ON_H = 0x07;
PCA9685.LED0_OFF_L = 0x08;
PCA9685.LED0_OFF_H = 0x09;
PCA9685.ALLLED_ON_L = 0xFA;
PCA9685.ALLLED_ON_H = 0xFB;
PCA9685.ALLLED_OFF_L = 0xFC;
PCA9685.ALLLED_OFF_H = 0xFD;

/**
 * Starts the driver
 *
 * @param {Function} callback triggered when the driver is started
 * @return {void}
 */
PCA9685.prototype.start = function(callback) {
  this.connection.i2cWrite(this.address, PCA9685.MODE1, [0x00]);
  this.connection.i2cWrite(this.address, PCA9685.ALLLED_OFF_H, [0x10]);
  callback();
};

PCA9685.prototype.stop = function() {
  this.connection.i2cWrite(this.address, PCA9685.ALLLED_OFF_H, [0x10]);
};

/**
 * Set the servo frequency for the PCA9685
 *
 * @param {number} frequency frequency to write
 * @param {function} [callback] function to be invoked when done
 * @return {void}
 * @publish
 */
PCA9685.prototype.setPWMFreq = function(frequency, callback) {
  // Adjust per https://github.com/adafruit/Adafruit-PWM-Servo-Driver-Library/
  var prescaleval = 25000000;
  prescaleval /= 4096.0;
  prescaleval /= frequency;
  prescaleval -= 1.0;
  var prescale = Math.floor(prescaleval * 1.0 + 0.5);

  this.connection.i2cRead(
    this.address,
    PCA9685.MODE1,
    1,
    function(err, data) {
      if (err) { return; }

      var oldmode = data[0];
      var newmode = [(oldmode & 0x7F) | 0x10]; // sleep
      this.connection.i2cWrite(this.address, PCA9685.MODE1, newmode);

      this.connection.i2cWrite(
        this.address, PCA9685.PRESCALE, Math.floor(prescale)
      );

      this.connection.i2cWrite(this.address, PCA9685.MODE1, [oldmode]);

      Cylon.Utils.sleep(100);

      this.connection.i2cWrite(this.address, PCA9685.MODE1, [oldmode | 0x80]);

      if (typeof callback === "function") {
        callback(null, frequency);
      }
    }.bind(this));
};

/**
 * Set the servo position for the PCA9685
 *
 * @param {number} channel channel to write to
 * @param {number} pulseon pulse on to set
 * @param {number} pulseoff pulse off to set
 * @param {function} [callback] function to be invoked when done
 * @return {void}
 * @publish
 */
PCA9685.prototype.setPWM = function(channel, pulseon, pulseoff, callback) {
  this.connection.i2cWrite(
    this.address, PCA9685.LED0_ON_L + 4 * channel, [pulseon & 0xFF]);
  this.connection.i2cWrite(
    this.address, PCA9685.LED0_ON_H + 4 * channel, [pulseon >> 8]);
  this.connection.i2cWrite(
    this.address, PCA9685.LED0_OFF_L + 4 * channel, [pulseoff & 0xFF]);
  this.connection.i2cWrite(
    this.address, PCA9685.LED0_OFF_H + 4 * channel, [pulseoff >> 8], callback);
};

},{"./i2c-driver":26,"cylon":34}],34:[function(require,module,exports){
(function (process){
"use strict";

function lib(path) { return require("./lib/" + path); }

var Config = lib("config"),
    MCP = lib("mcp"),
    API = lib("api");

var exports = module.exports = {};

exports.MCP = lib("mcp");
exports.Robot = lib("robot");
exports.Driver = lib("driver");
exports.Adaptor = lib("adaptor");

exports.Utils = lib("utils");
exports.Logger = lib("logger");

exports.IO = {
  DigitalPin: lib("io/digital-pin"),
  Utils: lib("io/utils")
};

exports.robot = MCP.create;
exports.start = MCP.start;
exports.halt = MCP.halt;

exports.api = API.create;

exports.config = Config.update;

process.on("SIGINT", function() {
  exports.halt(function() {
    process.kill(process.pid);
  });
});

if (process.platform === "win32") {
  var io = { input: process.stdin, output: process.stdout },
      quit = process.emit.bind(process, "SIGINT");

  require("readline").createInterface(io).on("SIGINT", quit);
}

}).call(this,require('_process'))
},{"_process":63,"readline":6}],35:[function(require,module,exports){
(function (process){
/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = require('./debug');
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window && typeof window.process !== 'undefined' && window.process.type === 'renderer') {
    return true;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return (typeof document !== 'undefined' && document && 'WebkitAppearance' in document.documentElement.style) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (typeof window !== 'undefined' && window && window.console && (console.firebug || (console.exception && console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (typeof navigator !== 'undefined' && navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    // double check webkit in userAgent just in case we are in a worker
    (typeof navigator !== 'undefined' && navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit')

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}

}).call(this,require('_process'))
},{"./debug":36,"_process":63}],36:[function(require,module,exports){

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = require('ms');

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0, i;

  for (i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  return debug;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

},{"ms":54}],37:[function(require,module,exports){
'use strict';

var keys = require('object-keys');
var foreach = require('foreach');
var hasSymbols = typeof Symbol === 'function' && typeof Symbol() === 'symbol';

var toStr = Object.prototype.toString;

var isFunction = function (fn) {
	return typeof fn === 'function' && toStr.call(fn) === '[object Function]';
};

var arePropertyDescriptorsSupported = function () {
	var obj = {};
	try {
		Object.defineProperty(obj, 'x', { enumerable: false, value: obj });
        /* eslint-disable no-unused-vars, no-restricted-syntax */
        for (var _ in obj) { return false; }
        /* eslint-enable no-unused-vars, no-restricted-syntax */
		return obj.x === obj;
	} catch (e) { /* this is IE 8. */
		return false;
	}
};
var supportsDescriptors = Object.defineProperty && arePropertyDescriptorsSupported();

var defineProperty = function (object, name, value, predicate) {
	if (name in object && (!isFunction(predicate) || !predicate())) {
		return;
	}
	if (supportsDescriptors) {
		Object.defineProperty(object, name, {
			configurable: true,
			enumerable: false,
			value: value,
			writable: true
		});
	} else {
		object[name] = value;
	}
};

var defineProperties = function (object, map) {
	var predicates = arguments.length > 2 ? arguments[2] : {};
	var props = keys(map);
	if (hasSymbols) {
		props = props.concat(Object.getOwnPropertySymbols(map));
	}
	foreach(props, function (name) {
		defineProperty(object, name, map[name], predicates[name]);
	});
};

defineProperties.supportsDescriptors = !!supportsDescriptors;

module.exports = defineProperties;

},{"foreach":44,"object-keys":55}],38:[function(require,module,exports){
(function (process,global){
 /*!
  * https://github.com/paulmillr/es6-shim
  * @license es6-shim Copyright 2013-2016 by Paul Miller (http://paulmillr.com)
  *   and contributors,  MIT License
  * es6-shim: v0.35.1
  * see https://github.com/paulmillr/es6-shim/blob/0.35.1/LICENSE
  * Details and documentation:
  * https://github.com/paulmillr/es6-shim/
  */

// UMD (Universal Module Definition)
// see https://github.com/umdjs/umd/blob/master/returnExports.js
(function (root, factory) {
  /*global define, module, exports */
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.returnExports = factory();
  }
}(this, function () {
  'use strict';

  var _apply = Function.call.bind(Function.apply);
  var _call = Function.call.bind(Function.call);
  var isArray = Array.isArray;
  var keys = Object.keys;

  var not = function notThunker(func) {
    return function notThunk() {
      return !_apply(func, this, arguments);
    };
  };
  var throwsError = function (func) {
    try {
      func();
      return false;
    } catch (e) {
      return true;
    }
  };
  var valueOrFalseIfThrows = function valueOrFalseIfThrows(func) {
    try {
      return func();
    } catch (e) {
      return false;
    }
  };

  var isCallableWithoutNew = not(throwsError);
  var arePropertyDescriptorsSupported = function () {
    // if Object.defineProperty exists but throws, it's IE 8
    return !throwsError(function () {
      Object.defineProperty({}, 'x', { get: function () {} });
    });
  };
  var supportsDescriptors = !!Object.defineProperty && arePropertyDescriptorsSupported();
  var functionsHaveNames = (function foo() {}).name === 'foo'; // eslint-disable-line no-extra-parens

  var _forEach = Function.call.bind(Array.prototype.forEach);
  var _reduce = Function.call.bind(Array.prototype.reduce);
  var _filter = Function.call.bind(Array.prototype.filter);
  var _some = Function.call.bind(Array.prototype.some);

  var defineProperty = function (object, name, value, force) {
    if (!force && name in object) { return; }
    if (supportsDescriptors) {
      Object.defineProperty(object, name, {
        configurable: true,
        enumerable: false,
        writable: true,
        value: value
      });
    } else {
      object[name] = value;
    }
  };

  // Define configurable, writable and non-enumerable props
  // if they don’t exist.
  var defineProperties = function (object, map, forceOverride) {
    _forEach(keys(map), function (name) {
      var method = map[name];
      defineProperty(object, name, method, !!forceOverride);
    });
  };

  var _toString = Function.call.bind(Object.prototype.toString);
  var isCallable = typeof /abc/ === 'function' ? function IsCallableSlow(x) {
    // Some old browsers (IE, FF) say that typeof /abc/ === 'function'
    return typeof x === 'function' && _toString(x) === '[object Function]';
  } : function IsCallableFast(x) { return typeof x === 'function'; };

  var Value = {
    getter: function (object, name, getter) {
      if (!supportsDescriptors) {
        throw new TypeError('getters require true ES5 support');
      }
      Object.defineProperty(object, name, {
        configurable: true,
        enumerable: false,
        get: getter
      });
    },
    proxy: function (originalObject, key, targetObject) {
      if (!supportsDescriptors) {
        throw new TypeError('getters require true ES5 support');
      }
      var originalDescriptor = Object.getOwnPropertyDescriptor(originalObject, key);
      Object.defineProperty(targetObject, key, {
        configurable: originalDescriptor.configurable,
        enumerable: originalDescriptor.enumerable,
        get: function getKey() { return originalObject[key]; },
        set: function setKey(value) { originalObject[key] = value; }
      });
    },
    redefine: function (object, property, newValue) {
      if (supportsDescriptors) {
        var descriptor = Object.getOwnPropertyDescriptor(object, property);
        descriptor.value = newValue;
        Object.defineProperty(object, property, descriptor);
      } else {
        object[property] = newValue;
      }
    },
    defineByDescriptor: function (object, property, descriptor) {
      if (supportsDescriptors) {
        Object.defineProperty(object, property, descriptor);
      } else if ('value' in descriptor) {
        object[property] = descriptor.value;
      }
    },
    preserveToString: function (target, source) {
      if (source && isCallable(source.toString)) {
        defineProperty(target, 'toString', source.toString.bind(source), true);
      }
    }
  };

  // Simple shim for Object.create on ES3 browsers
  // (unlike real shim, no attempt to support `prototype === null`)
  var create = Object.create || function (prototype, properties) {
    var Prototype = function Prototype() {};
    Prototype.prototype = prototype;
    var object = new Prototype();
    if (typeof properties !== 'undefined') {
      keys(properties).forEach(function (key) {
        Value.defineByDescriptor(object, key, properties[key]);
      });
    }
    return object;
  };

  var supportsSubclassing = function (C, f) {
    if (!Object.setPrototypeOf) { return false; /* skip test on IE < 11 */ }
    return valueOrFalseIfThrows(function () {
      var Sub = function Subclass(arg) {
        var o = new C(arg);
        Object.setPrototypeOf(o, Subclass.prototype);
        return o;
      };
      Object.setPrototypeOf(Sub, C);
      Sub.prototype = create(C.prototype, {
        constructor: { value: Sub }
      });
      return f(Sub);
    });
  };

  var getGlobal = function () {
    /* global self, window, global */
    // the only reliable means to get the global object is
    // `Function('return this')()`
    // However, this causes CSP violations in Chrome apps.
    if (typeof self !== 'undefined') { return self; }
    if (typeof window !== 'undefined') { return window; }
    if (typeof global !== 'undefined') { return global; }
    throw new Error('unable to locate global object');
  };

  var globals = getGlobal();
  var globalIsFinite = globals.isFinite;
  var _indexOf = Function.call.bind(String.prototype.indexOf);
  var _arrayIndexOfApply = Function.apply.bind(Array.prototype.indexOf);
  var _concat = Function.call.bind(Array.prototype.concat);
  // var _sort = Function.call.bind(Array.prototype.sort);
  var _strSlice = Function.call.bind(String.prototype.slice);
  var _push = Function.call.bind(Array.prototype.push);
  var _pushApply = Function.apply.bind(Array.prototype.push);
  var _shift = Function.call.bind(Array.prototype.shift);
  var _max = Math.max;
  var _min = Math.min;
  var _floor = Math.floor;
  var _abs = Math.abs;
  var _exp = Math.exp;
  var _log = Math.log;
  var _sqrt = Math.sqrt;
  var _hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);
  var ArrayIterator; // make our implementation private
  var noop = function () {};

  var OrigMap = globals.Map;
  var origMapDelete = OrigMap && OrigMap.prototype['delete'];
  var origMapGet = OrigMap && OrigMap.prototype.get;
  var origMapHas = OrigMap && OrigMap.prototype.has;
  var origMapSet = OrigMap && OrigMap.prototype.set;

  var Symbol = globals.Symbol || {};
  var symbolSpecies = Symbol.species || '@@species';

  var numberIsNaN = Number.isNaN || function isNaN(value) {
    // NaN !== NaN, but they are identical.
    // NaNs are the only non-reflexive value, i.e., if x !== x,
    // then x is NaN.
    // isNaN is broken: it converts its argument to number, so
    // isNaN('foo') => true
    return value !== value;
  };
  var numberIsFinite = Number.isFinite || function isFinite(value) {
    return typeof value === 'number' && globalIsFinite(value);
  };
  var _sign = isCallable(Math.sign) ? Math.sign : function sign(value) {
    var number = Number(value);
    if (number === 0) { return number; }
    if (numberIsNaN(number)) { return number; }
    return number < 0 ? -1 : 1;
  };

  // taken directly from https://github.com/ljharb/is-arguments/blob/master/index.js
  // can be replaced with require('is-arguments') if we ever use a build process instead
  var isStandardArguments = function isArguments(value) {
    return _toString(value) === '[object Arguments]';
  };
  var isLegacyArguments = function isArguments(value) {
    return value !== null &&
      typeof value === 'object' &&
      typeof value.length === 'number' &&
      value.length >= 0 &&
      _toString(value) !== '[object Array]' &&
      _toString(value.callee) === '[object Function]';
  };
  var isArguments = isStandardArguments(arguments) ? isStandardArguments : isLegacyArguments;

  var Type = {
    primitive: function (x) { return x === null || (typeof x !== 'function' && typeof x !== 'object'); },
    string: function (x) { return _toString(x) === '[object String]'; },
    regex: function (x) { return _toString(x) === '[object RegExp]'; },
    symbol: function (x) {
      return typeof globals.Symbol === 'function' && typeof x === 'symbol';
    }
  };

  var overrideNative = function overrideNative(object, property, replacement) {
    var original = object[property];
    defineProperty(object, property, replacement, true);
    Value.preserveToString(object[property], original);
  };

  // eslint-disable-next-line no-restricted-properties
  var hasSymbols = typeof Symbol === 'function' && typeof Symbol['for'] === 'function' && Type.symbol(Symbol());

  // This is a private name in the es6 spec, equal to '[Symbol.iterator]'
  // we're going to use an arbitrary _-prefixed name to make our shims
  // work properly with each other, even though we don't have full Iterator
  // support.  That is, `Array.from(map.keys())` will work, but we don't
  // pretend to export a "real" Iterator interface.
  var $iterator$ = Type.symbol(Symbol.iterator) ? Symbol.iterator : '_es6-shim iterator_';
  // Firefox ships a partial implementation using the name @@iterator.
  // https://bugzilla.mozilla.org/show_bug.cgi?id=907077#c14
  // So use that name if we detect it.
  if (globals.Set && typeof new globals.Set()['@@iterator'] === 'function') {
    $iterator$ = '@@iterator';
  }

  // Reflect
  if (!globals.Reflect) {
    defineProperty(globals, 'Reflect', {}, true);
  }
  var Reflect = globals.Reflect;

  var $String = String;

  /* global document */
  var domAll = (typeof document === 'undefined' || !document) ? null : document.all;
  /* jshint eqnull:true */
  var isNullOrUndefined = domAll == null ? function isNullOrUndefined(x) {
    /* jshint eqnull:true */
    return x == null;
  } : function isNullOrUndefinedAndNotDocumentAll(x) {
    /* jshint eqnull:true */
    return x == null && x !== domAll;
  };

  var ES = {
    // http://www.ecma-international.org/ecma-262/6.0/#sec-call
    Call: function Call(F, V) {
      var args = arguments.length > 2 ? arguments[2] : [];
      if (!ES.IsCallable(F)) {
        throw new TypeError(F + ' is not a function');
      }
      return _apply(F, V, args);
    },

    RequireObjectCoercible: function (x, optMessage) {
      if (isNullOrUndefined(x)) {
        throw new TypeError(optMessage || 'Cannot call method on ' + x);
      }
      return x;
    },

    // This might miss the "(non-standard exotic and does not implement
    // [[Call]])" case from
    // http://www.ecma-international.org/ecma-262/6.0/#sec-typeof-operator-runtime-semantics-evaluation
    // but we can't find any evidence these objects exist in practice.
    // If we find some in the future, you could test `Object(x) === x`,
    // which is reliable according to
    // http://www.ecma-international.org/ecma-262/6.0/#sec-toobject
    // but is not well optimized by runtimes and creates an object
    // whenever it returns false, and thus is very slow.
    TypeIsObject: function (x) {
      if (x === void 0 || x === null || x === true || x === false) {
        return false;
      }
      return typeof x === 'function' || typeof x === 'object' || x === domAll;
    },

    ToObject: function (o, optMessage) {
      return Object(ES.RequireObjectCoercible(o, optMessage));
    },

    IsCallable: isCallable,

    IsConstructor: function (x) {
      // We can't tell callables from constructors in ES5
      return ES.IsCallable(x);
    },

    ToInt32: function (x) {
      return ES.ToNumber(x) >> 0;
    },

    ToUint32: function (x) {
      return ES.ToNumber(x) >>> 0;
    },

    ToNumber: function (value) {
      if (_toString(value) === '[object Symbol]') {
        throw new TypeError('Cannot convert a Symbol value to a number');
      }
      return +value;
    },

    ToInteger: function (value) {
      var number = ES.ToNumber(value);
      if (numberIsNaN(number)) { return 0; }
      if (number === 0 || !numberIsFinite(number)) { return number; }
      return (number > 0 ? 1 : -1) * _floor(_abs(number));
    },

    ToLength: function (value) {
      var len = ES.ToInteger(value);
      if (len <= 0) { return 0; } // includes converting -0 to +0
      if (len > Number.MAX_SAFE_INTEGER) { return Number.MAX_SAFE_INTEGER; }
      return len;
    },

    SameValue: function (a, b) {
      if (a === b) {
        // 0 === -0, but they are not identical.
        if (a === 0) { return 1 / a === 1 / b; }
        return true;
      }
      return numberIsNaN(a) && numberIsNaN(b);
    },

    SameValueZero: function (a, b) {
      // same as SameValue except for SameValueZero(+0, -0) == true
      return (a === b) || (numberIsNaN(a) && numberIsNaN(b));
    },

    IsIterable: function (o) {
      return ES.TypeIsObject(o) && (typeof o[$iterator$] !== 'undefined' || isArguments(o));
    },

    GetIterator: function (o) {
      if (isArguments(o)) {
        // special case support for `arguments`
        return new ArrayIterator(o, 'value');
      }
      var itFn = ES.GetMethod(o, $iterator$);
      if (!ES.IsCallable(itFn)) {
        // Better diagnostics if itFn is null or undefined
        throw new TypeError('value is not an iterable');
      }
      var it = ES.Call(itFn, o);
      if (!ES.TypeIsObject(it)) {
        throw new TypeError('bad iterator');
      }
      return it;
    },

    GetMethod: function (o, p) {
      var func = ES.ToObject(o)[p];
      if (isNullOrUndefined(func)) {
        return void 0;
      }
      if (!ES.IsCallable(func)) {
        throw new TypeError('Method not callable: ' + p);
      }
      return func;
    },

    IteratorComplete: function (iterResult) {
      return !!iterResult.done;
    },

    IteratorClose: function (iterator, completionIsThrow) {
      var returnMethod = ES.GetMethod(iterator, 'return');
      if (returnMethod === void 0) {
        return;
      }
      var innerResult, innerException;
      try {
        innerResult = ES.Call(returnMethod, iterator);
      } catch (e) {
        innerException = e;
      }
      if (completionIsThrow) {
        return;
      }
      if (innerException) {
        throw innerException;
      }
      if (!ES.TypeIsObject(innerResult)) {
        throw new TypeError("Iterator's return method returned a non-object.");
      }
    },

    IteratorNext: function (it) {
      var result = arguments.length > 1 ? it.next(arguments[1]) : it.next();
      if (!ES.TypeIsObject(result)) {
        throw new TypeError('bad iterator');
      }
      return result;
    },

    IteratorStep: function (it) {
      var result = ES.IteratorNext(it);
      var done = ES.IteratorComplete(result);
      return done ? false : result;
    },

    Construct: function (C, args, newTarget, isES6internal) {
      var target = typeof newTarget === 'undefined' ? C : newTarget;

      if (!isES6internal && Reflect.construct) {
        // Try to use Reflect.construct if available
        return Reflect.construct(C, args, target);
      }
      // OK, we have to fake it.  This will only work if the
      // C.[[ConstructorKind]] == "base" -- but that's the only
      // kind we can make in ES5 code anyway.

      // OrdinaryCreateFromConstructor(target, "%ObjectPrototype%")
      var proto = target.prototype;
      if (!ES.TypeIsObject(proto)) {
        proto = Object.prototype;
      }
      var obj = create(proto);
      // Call the constructor.
      var result = ES.Call(C, obj, args);
      return ES.TypeIsObject(result) ? result : obj;
    },

    SpeciesConstructor: function (O, defaultConstructor) {
      var C = O.constructor;
      if (C === void 0) {
        return defaultConstructor;
      }
      if (!ES.TypeIsObject(C)) {
        throw new TypeError('Bad constructor');
      }
      var S = C[symbolSpecies];
      if (isNullOrUndefined(S)) {
        return defaultConstructor;
      }
      if (!ES.IsConstructor(S)) {
        throw new TypeError('Bad @@species');
      }
      return S;
    },

    CreateHTML: function (string, tag, attribute, value) {
      var S = ES.ToString(string);
      var p1 = '<' + tag;
      if (attribute !== '') {
        var V = ES.ToString(value);
        var escapedV = V.replace(/"/g, '&quot;');
        p1 += ' ' + attribute + '="' + escapedV + '"';
      }
      var p2 = p1 + '>';
      var p3 = p2 + S;
      return p3 + '</' + tag + '>';
    },

    IsRegExp: function IsRegExp(argument) {
      if (!ES.TypeIsObject(argument)) {
        return false;
      }
      var isRegExp = argument[Symbol.match];
      if (typeof isRegExp !== 'undefined') {
        return !!isRegExp;
      }
      return Type.regex(argument);
    },

    ToString: function ToString(string) {
      return $String(string);
    }
  };

  // Well-known Symbol shims
  if (supportsDescriptors && hasSymbols) {
    var defineWellKnownSymbol = function defineWellKnownSymbol(name) {
      if (Type.symbol(Symbol[name])) {
        return Symbol[name];
      }
      // eslint-disable-next-line no-restricted-properties
      var sym = Symbol['for']('Symbol.' + name);
      Object.defineProperty(Symbol, name, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: sym
      });
      return sym;
    };
    if (!Type.symbol(Symbol.search)) {
      var symbolSearch = defineWellKnownSymbol('search');
      var originalSearch = String.prototype.search;
      defineProperty(RegExp.prototype, symbolSearch, function search(string) {
        return ES.Call(originalSearch, string, [this]);
      });
      var searchShim = function search(regexp) {
        var O = ES.RequireObjectCoercible(this);
        if (!isNullOrUndefined(regexp)) {
          var searcher = ES.GetMethod(regexp, symbolSearch);
          if (typeof searcher !== 'undefined') {
            return ES.Call(searcher, regexp, [O]);
          }
        }
        return ES.Call(originalSearch, O, [ES.ToString(regexp)]);
      };
      overrideNative(String.prototype, 'search', searchShim);
    }
    if (!Type.symbol(Symbol.replace)) {
      var symbolReplace = defineWellKnownSymbol('replace');
      var originalReplace = String.prototype.replace;
      defineProperty(RegExp.prototype, symbolReplace, function replace(string, replaceValue) {
        return ES.Call(originalReplace, string, [this, replaceValue]);
      });
      var replaceShim = function replace(searchValue, replaceValue) {
        var O = ES.RequireObjectCoercible(this);
        if (!isNullOrUndefined(searchValue)) {
          var replacer = ES.GetMethod(searchValue, symbolReplace);
          if (typeof replacer !== 'undefined') {
            return ES.Call(replacer, searchValue, [O, replaceValue]);
          }
        }
        return ES.Call(originalReplace, O, [ES.ToString(searchValue), replaceValue]);
      };
      overrideNative(String.prototype, 'replace', replaceShim);
    }
    if (!Type.symbol(Symbol.split)) {
      var symbolSplit = defineWellKnownSymbol('split');
      var originalSplit = String.prototype.split;
      defineProperty(RegExp.prototype, symbolSplit, function split(string, limit) {
        return ES.Call(originalSplit, string, [this, limit]);
      });
      var splitShim = function split(separator, limit) {
        var O = ES.RequireObjectCoercible(this);
        if (!isNullOrUndefined(separator)) {
          var splitter = ES.GetMethod(separator, symbolSplit);
          if (typeof splitter !== 'undefined') {
            return ES.Call(splitter, separator, [O, limit]);
          }
        }
        return ES.Call(originalSplit, O, [ES.ToString(separator), limit]);
      };
      overrideNative(String.prototype, 'split', splitShim);
    }
    var symbolMatchExists = Type.symbol(Symbol.match);
    var stringMatchIgnoresSymbolMatch = symbolMatchExists && (function () {
      // Firefox 41, through Nightly 45 has Symbol.match, but String#match ignores it.
      // Firefox 40 and below have Symbol.match but String#match works fine.
      var o = {};
      o[Symbol.match] = function () { return 42; };
      return 'a'.match(o) !== 42;
    }());
    if (!symbolMatchExists || stringMatchIgnoresSymbolMatch) {
      var symbolMatch = defineWellKnownSymbol('match');

      var originalMatch = String.prototype.match;
      defineProperty(RegExp.prototype, symbolMatch, function match(string) {
        return ES.Call(originalMatch, string, [this]);
      });

      var matchShim = function match(regexp) {
        var O = ES.RequireObjectCoercible(this);
        if (!isNullOrUndefined(regexp)) {
          var matcher = ES.GetMethod(regexp, symbolMatch);
          if (typeof matcher !== 'undefined') {
            return ES.Call(matcher, regexp, [O]);
          }
        }
        return ES.Call(originalMatch, O, [ES.ToString(regexp)]);
      };
      overrideNative(String.prototype, 'match', matchShim);
    }
  }

  var wrapConstructor = function wrapConstructor(original, replacement, keysToSkip) {
    Value.preserveToString(replacement, original);
    if (Object.setPrototypeOf) {
      // sets up proper prototype chain where possible
      Object.setPrototypeOf(original, replacement);
    }
    if (supportsDescriptors) {
      _forEach(Object.getOwnPropertyNames(original), function (key) {
        if (key in noop || keysToSkip[key]) { return; }
        Value.proxy(original, key, replacement);
      });
    } else {
      _forEach(Object.keys(original), function (key) {
        if (key in noop || keysToSkip[key]) { return; }
        replacement[key] = original[key];
      });
    }
    replacement.prototype = original.prototype;
    Value.redefine(original.prototype, 'constructor', replacement);
  };

  var defaultSpeciesGetter = function () { return this; };
  var addDefaultSpecies = function (C) {
    if (supportsDescriptors && !_hasOwnProperty(C, symbolSpecies)) {
      Value.getter(C, symbolSpecies, defaultSpeciesGetter);
    }
  };

  var addIterator = function (prototype, impl) {
    var implementation = impl || function iterator() { return this; };
    defineProperty(prototype, $iterator$, implementation);
    if (!prototype[$iterator$] && Type.symbol($iterator$)) {
      // implementations are buggy when $iterator$ is a Symbol
      prototype[$iterator$] = implementation;
    }
  };

  var createDataProperty = function createDataProperty(object, name, value) {
    if (supportsDescriptors) {
      Object.defineProperty(object, name, {
        configurable: true,
        enumerable: true,
        writable: true,
        value: value
      });
    } else {
      object[name] = value;
    }
  };
  var createDataPropertyOrThrow = function createDataPropertyOrThrow(object, name, value) {
    createDataProperty(object, name, value);
    if (!ES.SameValue(object[name], value)) {
      throw new TypeError('property is nonconfigurable');
    }
  };

  var emulateES6construct = function (o, defaultNewTarget, defaultProto, slots) {
    // This is an es5 approximation to es6 construct semantics.  in es6,
    // 'new Foo' invokes Foo.[[Construct]] which (for almost all objects)
    // just sets the internal variable NewTarget (in es6 syntax `new.target`)
    // to Foo and then returns Foo().

    // Many ES6 object then have constructors of the form:
    // 1. If NewTarget is undefined, throw a TypeError exception
    // 2. Let xxx by OrdinaryCreateFromConstructor(NewTarget, yyy, zzz)

    // So we're going to emulate those first two steps.
    if (!ES.TypeIsObject(o)) {
      throw new TypeError('Constructor requires `new`: ' + defaultNewTarget.name);
    }
    var proto = defaultNewTarget.prototype;
    if (!ES.TypeIsObject(proto)) {
      proto = defaultProto;
    }
    var obj = create(proto);
    for (var name in slots) {
      if (_hasOwnProperty(slots, name)) {
        var value = slots[name];
        defineProperty(obj, name, value, true);
      }
    }
    return obj;
  };

  // Firefox 31 reports this function's length as 0
  // https://bugzilla.mozilla.org/show_bug.cgi?id=1062484
  if (String.fromCodePoint && String.fromCodePoint.length !== 1) {
    var originalFromCodePoint = String.fromCodePoint;
    overrideNative(String, 'fromCodePoint', function fromCodePoint(codePoints) {
      return ES.Call(originalFromCodePoint, this, arguments);
    });
  }

  var StringShims = {
    fromCodePoint: function fromCodePoint(codePoints) {
      var result = [];
      var next;
      for (var i = 0, length = arguments.length; i < length; i++) {
        next = Number(arguments[i]);
        if (!ES.SameValue(next, ES.ToInteger(next)) || next < 0 || next > 0x10FFFF) {
          throw new RangeError('Invalid code point ' + next);
        }

        if (next < 0x10000) {
          _push(result, String.fromCharCode(next));
        } else {
          next -= 0x10000;
          _push(result, String.fromCharCode((next >> 10) + 0xD800));
          _push(result, String.fromCharCode((next % 0x400) + 0xDC00));
        }
      }
      return result.join('');
    },

    raw: function raw(callSite) {
      var cooked = ES.ToObject(callSite, 'bad callSite');
      var rawString = ES.ToObject(cooked.raw, 'bad raw value');
      var len = rawString.length;
      var literalsegments = ES.ToLength(len);
      if (literalsegments <= 0) {
        return '';
      }

      var stringElements = [];
      var nextIndex = 0;
      var nextKey, next, nextSeg, nextSub;
      while (nextIndex < literalsegments) {
        nextKey = ES.ToString(nextIndex);
        nextSeg = ES.ToString(rawString[nextKey]);
        _push(stringElements, nextSeg);
        if (nextIndex + 1 >= literalsegments) {
          break;
        }
        next = nextIndex + 1 < arguments.length ? arguments[nextIndex + 1] : '';
        nextSub = ES.ToString(next);
        _push(stringElements, nextSub);
        nextIndex += 1;
      }
      return stringElements.join('');
    }
  };
  if (String.raw && String.raw({ raw: { 0: 'x', 1: 'y', length: 2 } }) !== 'xy') {
    // IE 11 TP has a broken String.raw implementation
    overrideNative(String, 'raw', StringShims.raw);
  }
  defineProperties(String, StringShims);

  // Fast repeat, uses the `Exponentiation by squaring` algorithm.
  // Perf: http://jsperf.com/string-repeat2/2
  var stringRepeat = function repeat(s, times) {
    if (times < 1) { return ''; }
    if (times % 2) { return repeat(s, times - 1) + s; }
    var half = repeat(s, times / 2);
    return half + half;
  };
  var stringMaxLength = Infinity;

  var StringPrototypeShims = {
    repeat: function repeat(times) {
      var thisStr = ES.ToString(ES.RequireObjectCoercible(this));
      var numTimes = ES.ToInteger(times);
      if (numTimes < 0 || numTimes >= stringMaxLength) {
        throw new RangeError('repeat count must be less than infinity and not overflow maximum string size');
      }
      return stringRepeat(thisStr, numTimes);
    },

    startsWith: function startsWith(searchString) {
      var S = ES.ToString(ES.RequireObjectCoercible(this));
      if (ES.IsRegExp(searchString)) {
        throw new TypeError('Cannot call method "startsWith" with a regex');
      }
      var searchStr = ES.ToString(searchString);
      var position;
      if (arguments.length > 1) {
        position = arguments[1];
      }
      var start = _max(ES.ToInteger(position), 0);
      return _strSlice(S, start, start + searchStr.length) === searchStr;
    },

    endsWith: function endsWith(searchString) {
      var S = ES.ToString(ES.RequireObjectCoercible(this));
      if (ES.IsRegExp(searchString)) {
        throw new TypeError('Cannot call method "endsWith" with a regex');
      }
      var searchStr = ES.ToString(searchString);
      var len = S.length;
      var endPosition;
      if (arguments.length > 1) {
        endPosition = arguments[1];
      }
      var pos = typeof endPosition === 'undefined' ? len : ES.ToInteger(endPosition);
      var end = _min(_max(pos, 0), len);
      return _strSlice(S, end - searchStr.length, end) === searchStr;
    },

    includes: function includes(searchString) {
      if (ES.IsRegExp(searchString)) {
        throw new TypeError('"includes" does not accept a RegExp');
      }
      var searchStr = ES.ToString(searchString);
      var position;
      if (arguments.length > 1) {
        position = arguments[1];
      }
      // Somehow this trick makes method 100% compat with the spec.
      return _indexOf(this, searchStr, position) !== -1;
    },

    codePointAt: function codePointAt(pos) {
      var thisStr = ES.ToString(ES.RequireObjectCoercible(this));
      var position = ES.ToInteger(pos);
      var length = thisStr.length;
      if (position >= 0 && position < length) {
        var first = thisStr.charCodeAt(position);
        var isEnd = position + 1 === length;
        if (first < 0xD800 || first > 0xDBFF || isEnd) { return first; }
        var second = thisStr.charCodeAt(position + 1);
        if (second < 0xDC00 || second > 0xDFFF) { return first; }
        return ((first - 0xD800) * 1024) + (second - 0xDC00) + 0x10000;
      }
    }
  };
  if (String.prototype.includes && 'a'.includes('a', Infinity) !== false) {
    overrideNative(String.prototype, 'includes', StringPrototypeShims.includes);
  }

  if (String.prototype.startsWith && String.prototype.endsWith) {
    var startsWithRejectsRegex = throwsError(function () {
      /* throws if spec-compliant */
      '/a/'.startsWith(/a/);
    });
    var startsWithHandlesInfinity = valueOrFalseIfThrows(function () {
      return 'abc'.startsWith('a', Infinity) === false;
    });
    if (!startsWithRejectsRegex || !startsWithHandlesInfinity) {
      // Firefox (< 37?) and IE 11 TP have a noncompliant startsWith implementation
      overrideNative(String.prototype, 'startsWith', StringPrototypeShims.startsWith);
      overrideNative(String.prototype, 'endsWith', StringPrototypeShims.endsWith);
    }
  }
  if (hasSymbols) {
    var startsWithSupportsSymbolMatch = valueOrFalseIfThrows(function () {
      var re = /a/;
      re[Symbol.match] = false;
      return '/a/'.startsWith(re);
    });
    if (!startsWithSupportsSymbolMatch) {
      overrideNative(String.prototype, 'startsWith', StringPrototypeShims.startsWith);
    }
    var endsWithSupportsSymbolMatch = valueOrFalseIfThrows(function () {
      var re = /a/;
      re[Symbol.match] = false;
      return '/a/'.endsWith(re);
    });
    if (!endsWithSupportsSymbolMatch) {
      overrideNative(String.prototype, 'endsWith', StringPrototypeShims.endsWith);
    }
    var includesSupportsSymbolMatch = valueOrFalseIfThrows(function () {
      var re = /a/;
      re[Symbol.match] = false;
      return '/a/'.includes(re);
    });
    if (!includesSupportsSymbolMatch) {
      overrideNative(String.prototype, 'includes', StringPrototypeShims.includes);
    }
  }

  defineProperties(String.prototype, StringPrototypeShims);

  // whitespace from: http://es5.github.io/#x15.5.4.20
  // implementation from https://github.com/es-shims/es5-shim/blob/v3.4.0/es5-shim.js#L1304-L1324
  var ws = [
    '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003',
    '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028',
    '\u2029\uFEFF'
  ].join('');
  var trimRegexp = new RegExp('(^[' + ws + ']+)|([' + ws + ']+$)', 'g');
  var trimShim = function trim() {
    return ES.ToString(ES.RequireObjectCoercible(this)).replace(trimRegexp, '');
  };
  var nonWS = ['\u0085', '\u200b', '\ufffe'].join('');
  var nonWSregex = new RegExp('[' + nonWS + ']', 'g');
  var isBadHexRegex = /^[-+]0x[0-9a-f]+$/i;
  var hasStringTrimBug = nonWS.trim().length !== nonWS.length;
  defineProperty(String.prototype, 'trim', trimShim, hasStringTrimBug);

  // Given an argument x, it will return an IteratorResult object,
  // with value set to x and done to false.
  // Given no arguments, it will return an iterator completion object.
  var iteratorResult = function (x) {
    return { value: x, done: arguments.length === 0 };
  };

  // see http://www.ecma-international.org/ecma-262/6.0/#sec-string.prototype-@@iterator
  var StringIterator = function (s) {
    ES.RequireObjectCoercible(s);
    this._s = ES.ToString(s);
    this._i = 0;
  };
  StringIterator.prototype.next = function () {
    var s = this._s;
    var i = this._i;
    if (typeof s === 'undefined' || i >= s.length) {
      this._s = void 0;
      return iteratorResult();
    }
    var first = s.charCodeAt(i);
    var second, len;
    if (first < 0xD800 || first > 0xDBFF || (i + 1) === s.length) {
      len = 1;
    } else {
      second = s.charCodeAt(i + 1);
      len = (second < 0xDC00 || second > 0xDFFF) ? 1 : 2;
    }
    this._i = i + len;
    return iteratorResult(s.substr(i, len));
  };
  addIterator(StringIterator.prototype);
  addIterator(String.prototype, function () {
    return new StringIterator(this);
  });

  var ArrayShims = {
    from: function from(items) {
      var C = this;
      var mapFn;
      if (arguments.length > 1) {
        mapFn = arguments[1];
      }
      var mapping, T;
      if (typeof mapFn === 'undefined') {
        mapping = false;
      } else {
        if (!ES.IsCallable(mapFn)) {
          throw new TypeError('Array.from: when provided, the second argument must be a function');
        }
        if (arguments.length > 2) {
          T = arguments[2];
        }
        mapping = true;
      }

      // Note that that Arrays will use ArrayIterator:
      // https://bugs.ecmascript.org/show_bug.cgi?id=2416
      var usingIterator = typeof (isArguments(items) || ES.GetMethod(items, $iterator$)) !== 'undefined';

      var length, result, i;
      if (usingIterator) {
        result = ES.IsConstructor(C) ? Object(new C()) : [];
        var iterator = ES.GetIterator(items);
        var next, nextValue;

        i = 0;
        while (true) {
          next = ES.IteratorStep(iterator);
          if (next === false) {
            break;
          }
          nextValue = next.value;
          try {
            if (mapping) {
              nextValue = typeof T === 'undefined' ? mapFn(nextValue, i) : _call(mapFn, T, nextValue, i);
            }
            result[i] = nextValue;
          } catch (e) {
            ES.IteratorClose(iterator, true);
            throw e;
          }
          i += 1;
        }
        length = i;
      } else {
        var arrayLike = ES.ToObject(items);
        length = ES.ToLength(arrayLike.length);
        result = ES.IsConstructor(C) ? Object(new C(length)) : new Array(length);
        var value;
        for (i = 0; i < length; ++i) {
          value = arrayLike[i];
          if (mapping) {
            value = typeof T === 'undefined' ? mapFn(value, i) : _call(mapFn, T, value, i);
          }
          createDataPropertyOrThrow(result, i, value);
        }
      }

      result.length = length;
      return result;
    },

    of: function of() {
      var len = arguments.length;
      var C = this;
      var A = isArray(C) || !ES.IsCallable(C) ? new Array(len) : ES.Construct(C, [len]);
      for (var k = 0; k < len; ++k) {
        createDataPropertyOrThrow(A, k, arguments[k]);
      }
      A.length = len;
      return A;
    }
  };
  defineProperties(Array, ArrayShims);
  addDefaultSpecies(Array);

  // Our ArrayIterator is private; see
  // https://github.com/paulmillr/es6-shim/issues/252
  ArrayIterator = function (array, kind) {
    this.i = 0;
    this.array = array;
    this.kind = kind;
  };

  defineProperties(ArrayIterator.prototype, {
    next: function () {
      var i = this.i;
      var array = this.array;
      if (!(this instanceof ArrayIterator)) {
        throw new TypeError('Not an ArrayIterator');
      }
      if (typeof array !== 'undefined') {
        var len = ES.ToLength(array.length);
        for (; i < len; i++) {
          var kind = this.kind;
          var retval;
          if (kind === 'key') {
            retval = i;
          } else if (kind === 'value') {
            retval = array[i];
          } else if (kind === 'entry') {
            retval = [i, array[i]];
          }
          this.i = i + 1;
          return iteratorResult(retval);
        }
      }
      this.array = void 0;
      return iteratorResult();
    }
  });
  addIterator(ArrayIterator.prototype);

/*
  var orderKeys = function orderKeys(a, b) {
    var aNumeric = String(ES.ToInteger(a)) === a;
    var bNumeric = String(ES.ToInteger(b)) === b;
    if (aNumeric && bNumeric) {
      return b - a;
    } else if (aNumeric && !bNumeric) {
      return -1;
    } else if (!aNumeric && bNumeric) {
      return 1;
    } else {
      return a.localeCompare(b);
    }
  };

  var getAllKeys = function getAllKeys(object) {
    var ownKeys = [];
    var keys = [];

    for (var key in object) {
      _push(_hasOwnProperty(object, key) ? ownKeys : keys, key);
    }
    _sort(ownKeys, orderKeys);
    _sort(keys, orderKeys);

    return _concat(ownKeys, keys);
  };
  */

  // note: this is positioned here because it depends on ArrayIterator
  var arrayOfSupportsSubclassing = Array.of === ArrayShims.of || (function () {
    // Detects a bug in Webkit nightly r181886
    var Foo = function Foo(len) { this.length = len; };
    Foo.prototype = [];
    var fooArr = Array.of.apply(Foo, [1, 2]);
    return fooArr instanceof Foo && fooArr.length === 2;
  }());
  if (!arrayOfSupportsSubclassing) {
    overrideNative(Array, 'of', ArrayShims.of);
  }

  var ArrayPrototypeShims = {
    copyWithin: function copyWithin(target, start) {
      var o = ES.ToObject(this);
      var len = ES.ToLength(o.length);
      var relativeTarget = ES.ToInteger(target);
      var relativeStart = ES.ToInteger(start);
      var to = relativeTarget < 0 ? _max(len + relativeTarget, 0) : _min(relativeTarget, len);
      var from = relativeStart < 0 ? _max(len + relativeStart, 0) : _min(relativeStart, len);
      var end;
      if (arguments.length > 2) {
        end = arguments[2];
      }
      var relativeEnd = typeof end === 'undefined' ? len : ES.ToInteger(end);
      var finalItem = relativeEnd < 0 ? _max(len + relativeEnd, 0) : _min(relativeEnd, len);
      var count = _min(finalItem - from, len - to);
      var direction = 1;
      if (from < to && to < (from + count)) {
        direction = -1;
        from += count - 1;
        to += count - 1;
      }
      while (count > 0) {
        if (from in o) {
          o[to] = o[from];
        } else {
          delete o[to];
        }
        from += direction;
        to += direction;
        count -= 1;
      }
      return o;
    },

    fill: function fill(value) {
      var start;
      if (arguments.length > 1) {
        start = arguments[1];
      }
      var end;
      if (arguments.length > 2) {
        end = arguments[2];
      }
      var O = ES.ToObject(this);
      var len = ES.ToLength(O.length);
      start = ES.ToInteger(typeof start === 'undefined' ? 0 : start);
      end = ES.ToInteger(typeof end === 'undefined' ? len : end);

      var relativeStart = start < 0 ? _max(len + start, 0) : _min(start, len);
      var relativeEnd = end < 0 ? len + end : end;

      for (var i = relativeStart; i < len && i < relativeEnd; ++i) {
        O[i] = value;
      }
      return O;
    },

    find: function find(predicate) {
      var list = ES.ToObject(this);
      var length = ES.ToLength(list.length);
      if (!ES.IsCallable(predicate)) {
        throw new TypeError('Array#find: predicate must be a function');
      }
      var thisArg = arguments.length > 1 ? arguments[1] : null;
      for (var i = 0, value; i < length; i++) {
        value = list[i];
        if (thisArg) {
          if (_call(predicate, thisArg, value, i, list)) {
            return value;
          }
        } else if (predicate(value, i, list)) {
          return value;
        }
      }
    },

    findIndex: function findIndex(predicate) {
      var list = ES.ToObject(this);
      var length = ES.ToLength(list.length);
      if (!ES.IsCallable(predicate)) {
        throw new TypeError('Array#findIndex: predicate must be a function');
      }
      var thisArg = arguments.length > 1 ? arguments[1] : null;
      for (var i = 0; i < length; i++) {
        if (thisArg) {
          if (_call(predicate, thisArg, list[i], i, list)) {
            return i;
          }
        } else if (predicate(list[i], i, list)) {
          return i;
        }
      }
      return -1;
    },

    keys: function keys() {
      return new ArrayIterator(this, 'key');
    },

    values: function values() {
      return new ArrayIterator(this, 'value');
    },

    entries: function entries() {
      return new ArrayIterator(this, 'entry');
    }
  };
  // Safari 7.1 defines Array#keys and Array#entries natively,
  // but the resulting ArrayIterator objects don't have a "next" method.
  if (Array.prototype.keys && !ES.IsCallable([1].keys().next)) {
    delete Array.prototype.keys;
  }
  if (Array.prototype.entries && !ES.IsCallable([1].entries().next)) {
    delete Array.prototype.entries;
  }

  // Chrome 38 defines Array#keys and Array#entries, and Array#@@iterator, but not Array#values
  if (Array.prototype.keys && Array.prototype.entries && !Array.prototype.values && Array.prototype[$iterator$]) {
    defineProperties(Array.prototype, {
      values: Array.prototype[$iterator$]
    });
    if (Type.symbol(Symbol.unscopables)) {
      Array.prototype[Symbol.unscopables].values = true;
    }
  }
  // Chrome 40 defines Array#values with the incorrect name, although Array#{keys,entries} have the correct name
  if (functionsHaveNames && Array.prototype.values && Array.prototype.values.name !== 'values') {
    var originalArrayPrototypeValues = Array.prototype.values;
    overrideNative(Array.prototype, 'values', function values() { return ES.Call(originalArrayPrototypeValues, this, arguments); });
    defineProperty(Array.prototype, $iterator$, Array.prototype.values, true);
  }
  defineProperties(Array.prototype, ArrayPrototypeShims);

  if (1 / [true].indexOf(true, -0) < 0) {
    // indexOf when given a position arg of -0 should return +0.
    // https://github.com/tc39/ecma262/pull/316
    defineProperty(Array.prototype, 'indexOf', function indexOf(searchElement) {
      var value = _arrayIndexOfApply(this, arguments);
      if (value === 0 && (1 / value) < 0) {
        return 0;
      }
      return value;
    }, true);
  }

  addIterator(Array.prototype, function () { return this.values(); });
  // Chrome defines keys/values/entries on Array, but doesn't give us
  // any way to identify its iterator.  So add our own shimmed field.
  if (Object.getPrototypeOf) {
    addIterator(Object.getPrototypeOf([].values()));
  }

  // note: this is positioned here because it relies on Array#entries
  var arrayFromSwallowsNegativeLengths = (function () {
    // Detects a Firefox bug in v32
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1063993
    return valueOrFalseIfThrows(function () {
      return Array.from({ length: -1 }).length === 0;
    });
  }());
  var arrayFromHandlesIterables = (function () {
    // Detects a bug in Webkit nightly r181886
    var arr = Array.from([0].entries());
    return arr.length === 1 && isArray(arr[0]) && arr[0][0] === 0 && arr[0][1] === 0;
  }());
  if (!arrayFromSwallowsNegativeLengths || !arrayFromHandlesIterables) {
    overrideNative(Array, 'from', ArrayShims.from);
  }
  var arrayFromHandlesUndefinedMapFunction = (function () {
    // Microsoft Edge v0.11 throws if the mapFn argument is *provided* but undefined,
    // but the spec doesn't care if it's provided or not - undefined doesn't throw.
    return valueOrFalseIfThrows(function () {
      return Array.from([0], void 0);
    });
  }());
  if (!arrayFromHandlesUndefinedMapFunction) {
    var origArrayFrom = Array.from;
    overrideNative(Array, 'from', function from(items) {
      if (arguments.length > 1 && typeof arguments[1] !== 'undefined') {
        return ES.Call(origArrayFrom, this, arguments);
      } else {
        return _call(origArrayFrom, this, items);
      }
    });
  }

  var int32sAsOne = -(Math.pow(2, 32) - 1);
  var toLengthsCorrectly = function (method, reversed) {
    var obj = { length: int32sAsOne };
    obj[reversed ? (obj.length >>> 0) - 1 : 0] = true;
    return valueOrFalseIfThrows(function () {
      _call(method, obj, function () {
        // note: in nonconforming browsers, this will be called
        // -1 >>> 0 times, which is 4294967295, so the throw matters.
        throw new RangeError('should not reach here');
      }, []);
      return true;
    });
  };
  if (!toLengthsCorrectly(Array.prototype.forEach)) {
    var originalForEach = Array.prototype.forEach;
    overrideNative(Array.prototype, 'forEach', function forEach(callbackFn) {
      return ES.Call(originalForEach, this.length >= 0 ? this : [], arguments);
    }, true);
  }
  if (!toLengthsCorrectly(Array.prototype.map)) {
    var originalMap = Array.prototype.map;
    overrideNative(Array.prototype, 'map', function map(callbackFn) {
      return ES.Call(originalMap, this.length >= 0 ? this : [], arguments);
    }, true);
  }
  if (!toLengthsCorrectly(Array.prototype.filter)) {
    var originalFilter = Array.prototype.filter;
    overrideNative(Array.prototype, 'filter', function filter(callbackFn) {
      return ES.Call(originalFilter, this.length >= 0 ? this : [], arguments);
    }, true);
  }
  if (!toLengthsCorrectly(Array.prototype.some)) {
    var originalSome = Array.prototype.some;
    overrideNative(Array.prototype, 'some', function some(callbackFn) {
      return ES.Call(originalSome, this.length >= 0 ? this : [], arguments);
    }, true);
  }
  if (!toLengthsCorrectly(Array.prototype.every)) {
    var originalEvery = Array.prototype.every;
    overrideNative(Array.prototype, 'every', function every(callbackFn) {
      return ES.Call(originalEvery, this.length >= 0 ? this : [], arguments);
    }, true);
  }
  if (!toLengthsCorrectly(Array.prototype.reduce)) {
    var originalReduce = Array.prototype.reduce;
    overrideNative(Array.prototype, 'reduce', function reduce(callbackFn) {
      return ES.Call(originalReduce, this.length >= 0 ? this : [], arguments);
    }, true);
  }
  if (!toLengthsCorrectly(Array.prototype.reduceRight, true)) {
    var originalReduceRight = Array.prototype.reduceRight;
    overrideNative(Array.prototype, 'reduceRight', function reduceRight(callbackFn) {
      return ES.Call(originalReduceRight, this.length >= 0 ? this : [], arguments);
    }, true);
  }

  var lacksOctalSupport = Number('0o10') !== 8;
  var lacksBinarySupport = Number('0b10') !== 2;
  var trimsNonWhitespace = _some(nonWS, function (c) {
    return Number(c + 0 + c) === 0;
  });
  if (lacksOctalSupport || lacksBinarySupport || trimsNonWhitespace) {
    var OrigNumber = Number;
    var binaryRegex = /^0b[01]+$/i;
    var octalRegex = /^0o[0-7]+$/i;
    // Note that in IE 8, RegExp.prototype.test doesn't seem to exist: ie, "test" is an own property of regexes. wtf.
    var isBinary = binaryRegex.test.bind(binaryRegex);
    var isOctal = octalRegex.test.bind(octalRegex);
    var toPrimitive = function (O) { // need to replace this with `es-to-primitive/es6`
      var result;
      if (typeof O.valueOf === 'function') {
        result = O.valueOf();
        if (Type.primitive(result)) {
          return result;
        }
      }
      if (typeof O.toString === 'function') {
        result = O.toString();
        if (Type.primitive(result)) {
          return result;
        }
      }
      throw new TypeError('No default value');
    };
    var hasNonWS = nonWSregex.test.bind(nonWSregex);
    var isBadHex = isBadHexRegex.test.bind(isBadHexRegex);
    var NumberShim = (function () {
      // this is wrapped in an IIFE because of IE 6-8's wacky scoping issues with named function expressions.
      var NumberShim = function Number(value) {
        var primValue;
        if (arguments.length > 0) {
          primValue = Type.primitive(value) ? value : toPrimitive(value, 'number');
        } else {
          primValue = 0;
        }
        if (typeof primValue === 'string') {
          primValue = ES.Call(trimShim, primValue);
          if (isBinary(primValue)) {
            primValue = parseInt(_strSlice(primValue, 2), 2);
          } else if (isOctal(primValue)) {
            primValue = parseInt(_strSlice(primValue, 2), 8);
          } else if (hasNonWS(primValue) || isBadHex(primValue)) {
            primValue = NaN;
          }
        }
        var receiver = this;
        var valueOfSucceeds = valueOrFalseIfThrows(function () {
          OrigNumber.prototype.valueOf.call(receiver);
          return true;
        });
        if (receiver instanceof NumberShim && !valueOfSucceeds) {
          return new OrigNumber(primValue);
        }
        /* jshint newcap: false */
        return OrigNumber(primValue);
        /* jshint newcap: true */
      };
      return NumberShim;
    }());
    wrapConstructor(OrigNumber, NumberShim, {});
    // this is necessary for ES3 browsers, where these properties are non-enumerable.
    defineProperties(NumberShim, {
      NaN: OrigNumber.NaN,
      MAX_VALUE: OrigNumber.MAX_VALUE,
      MIN_VALUE: OrigNumber.MIN_VALUE,
      NEGATIVE_INFINITY: OrigNumber.NEGATIVE_INFINITY,
      POSITIVE_INFINITY: OrigNumber.POSITIVE_INFINITY
    });
    /* globals Number: true */
    /* eslint-disable no-undef, no-global-assign */
    /* jshint -W020 */
    Number = NumberShim;
    Value.redefine(globals, 'Number', NumberShim);
    /* jshint +W020 */
    /* eslint-enable no-undef, no-global-assign */
    /* globals Number: false */
  }

  var maxSafeInteger = Math.pow(2, 53) - 1;
  defineProperties(Number, {
    MAX_SAFE_INTEGER: maxSafeInteger,
    MIN_SAFE_INTEGER: -maxSafeInteger,
    EPSILON: 2.220446049250313e-16,

    parseInt: globals.parseInt,
    parseFloat: globals.parseFloat,

    isFinite: numberIsFinite,

    isInteger: function isInteger(value) {
      return numberIsFinite(value) && ES.ToInteger(value) === value;
    },

    isSafeInteger: function isSafeInteger(value) {
      return Number.isInteger(value) && _abs(value) <= Number.MAX_SAFE_INTEGER;
    },

    isNaN: numberIsNaN
  });
  // Firefox 37 has a conforming Number.parseInt, but it's not === to the global parseInt (fixed in v40)
  defineProperty(Number, 'parseInt', globals.parseInt, Number.parseInt !== globals.parseInt);

  // Work around bugs in Array#find and Array#findIndex -- early
  // implementations skipped holes in sparse arrays. (Note that the
  // implementations of find/findIndex indirectly use shimmed
  // methods of Number, so this test has to happen down here.)
  /*jshint elision: true */
  /* eslint-disable no-sparse-arrays */
  if ([, 1].find(function () { return true; }) === 1) {
    overrideNative(Array.prototype, 'find', ArrayPrototypeShims.find);
  }
  if ([, 1].findIndex(function () { return true; }) !== 0) {
    overrideNative(Array.prototype, 'findIndex', ArrayPrototypeShims.findIndex);
  }
  /* eslint-enable no-sparse-arrays */
  /*jshint elision: false */

  var isEnumerableOn = Function.bind.call(Function.bind, Object.prototype.propertyIsEnumerable);
  var ensureEnumerable = function ensureEnumerable(obj, prop) {
    if (supportsDescriptors && isEnumerableOn(obj, prop)) {
      Object.defineProperty(obj, prop, { enumerable: false });
    }
  };
  var sliceArgs = function sliceArgs() {
    // per https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#32-leaking-arguments
    // and https://gist.github.com/WebReflection/4327762cb87a8c634a29
    var initial = Number(this);
    var len = arguments.length;
    var desiredArgCount = len - initial;
    var args = new Array(desiredArgCount < 0 ? 0 : desiredArgCount);
    for (var i = initial; i < len; ++i) {
      args[i - initial] = arguments[i];
    }
    return args;
  };
  var assignTo = function assignTo(source) {
    return function assignToSource(target, key) {
      target[key] = source[key];
      return target;
    };
  };
  var assignReducer = function (target, source) {
    var sourceKeys = keys(Object(source));
    var symbols;
    if (ES.IsCallable(Object.getOwnPropertySymbols)) {
      symbols = _filter(Object.getOwnPropertySymbols(Object(source)), isEnumerableOn(source));
    }
    return _reduce(_concat(sourceKeys, symbols || []), assignTo(source), target);
  };

  var ObjectShims = {
    // 19.1.3.1
    assign: function (target, source) {
      var to = ES.ToObject(target, 'Cannot convert undefined or null to object');
      return _reduce(ES.Call(sliceArgs, 1, arguments), assignReducer, to);
    },

    // Added in WebKit in https://bugs.webkit.org/show_bug.cgi?id=143865
    is: function is(a, b) {
      return ES.SameValue(a, b);
    }
  };
  var assignHasPendingExceptions = Object.assign && Object.preventExtensions && (function () {
    // Firefox 37 still has "pending exception" logic in its Object.assign implementation,
    // which is 72% slower than our shim, and Firefox 40's native implementation.
    var thrower = Object.preventExtensions({ 1: 2 });
    try {
      Object.assign(thrower, 'xy');
    } catch (e) {
      return thrower[1] === 'y';
    }
  }());
  if (assignHasPendingExceptions) {
    overrideNative(Object, 'assign', ObjectShims.assign);
  }
  defineProperties(Object, ObjectShims);

  if (supportsDescriptors) {
    var ES5ObjectShims = {
      // 19.1.3.9
      // shim from https://gist.github.com/WebReflection/5593554
      setPrototypeOf: (function (Object, magic) {
        var set;

        var checkArgs = function (O, proto) {
          if (!ES.TypeIsObject(O)) {
            throw new TypeError('cannot set prototype on a non-object');
          }
          if (!(proto === null || ES.TypeIsObject(proto))) {
            throw new TypeError('can only set prototype to an object or null' + proto);
          }
        };

        var setPrototypeOf = function (O, proto) {
          checkArgs(O, proto);
          _call(set, O, proto);
          return O;
        };

        try {
          // this works already in Firefox and Safari
          set = Object.getOwnPropertyDescriptor(Object.prototype, magic).set;
          _call(set, {}, null);
        } catch (e) {
          if (Object.prototype !== {}[magic]) {
            // IE < 11 cannot be shimmed
            return;
          }
          // probably Chrome or some old Mobile stock browser
          set = function (proto) {
            this[magic] = proto;
          };
          // please note that this will **not** work
          // in those browsers that do not inherit
          // __proto__ by mistake from Object.prototype
          // in these cases we should probably throw an error
          // or at least be informed about the issue
          setPrototypeOf.polyfill = setPrototypeOf(
            setPrototypeOf({}, null),
            Object.prototype
          ) instanceof Object;
          // setPrototypeOf.polyfill === true means it works as meant
          // setPrototypeOf.polyfill === false means it's not 100% reliable
          // setPrototypeOf.polyfill === undefined
          // or
          // setPrototypeOf.polyfill ==  null means it's not a polyfill
          // which means it works as expected
          // we can even delete Object.prototype.__proto__;
        }
        return setPrototypeOf;
      }(Object, '__proto__'))
    };

    defineProperties(Object, ES5ObjectShims);
  }

  // Workaround bug in Opera 12 where setPrototypeOf(x, null) doesn't work,
  // but Object.create(null) does.
  if (Object.setPrototypeOf && Object.getPrototypeOf &&
      Object.getPrototypeOf(Object.setPrototypeOf({}, null)) !== null &&
      Object.getPrototypeOf(Object.create(null)) === null) {
    (function () {
      var FAKENULL = Object.create(null);
      var gpo = Object.getPrototypeOf;
      var spo = Object.setPrototypeOf;
      Object.getPrototypeOf = function (o) {
        var result = gpo(o);
        return result === FAKENULL ? null : result;
      };
      Object.setPrototypeOf = function (o, p) {
        var proto = p === null ? FAKENULL : p;
        return spo(o, proto);
      };
      Object.setPrototypeOf.polyfill = false;
    }());
  }

  var objectKeysAcceptsPrimitives = !throwsError(function () { Object.keys('foo'); });
  if (!objectKeysAcceptsPrimitives) {
    var originalObjectKeys = Object.keys;
    overrideNative(Object, 'keys', function keys(value) {
      return originalObjectKeys(ES.ToObject(value));
    });
    keys = Object.keys;
  }
  var objectKeysRejectsRegex = throwsError(function () { Object.keys(/a/g); });
  if (objectKeysRejectsRegex) {
    var regexRejectingObjectKeys = Object.keys;
    overrideNative(Object, 'keys', function keys(value) {
      if (Type.regex(value)) {
        var regexKeys = [];
        for (var k in value) {
          if (_hasOwnProperty(value, k)) {
            _push(regexKeys, k);
          }
        }
        return regexKeys;
      }
      return regexRejectingObjectKeys(value);
    });
    keys = Object.keys;
  }

  if (Object.getOwnPropertyNames) {
    var objectGOPNAcceptsPrimitives = !throwsError(function () { Object.getOwnPropertyNames('foo'); });
    if (!objectGOPNAcceptsPrimitives) {
      var cachedWindowNames = typeof window === 'object' ? Object.getOwnPropertyNames(window) : [];
      var originalObjectGetOwnPropertyNames = Object.getOwnPropertyNames;
      overrideNative(Object, 'getOwnPropertyNames', function getOwnPropertyNames(value) {
        var val = ES.ToObject(value);
        if (_toString(val) === '[object Window]') {
          try {
            return originalObjectGetOwnPropertyNames(val);
          } catch (e) {
            // IE bug where layout engine calls userland gOPN for cross-domain `window` objects
            return _concat([], cachedWindowNames);
          }
        }
        return originalObjectGetOwnPropertyNames(val);
      });
    }
  }
  if (Object.getOwnPropertyDescriptor) {
    var objectGOPDAcceptsPrimitives = !throwsError(function () { Object.getOwnPropertyDescriptor('foo', 'bar'); });
    if (!objectGOPDAcceptsPrimitives) {
      var originalObjectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
      overrideNative(Object, 'getOwnPropertyDescriptor', function getOwnPropertyDescriptor(value, property) {
        return originalObjectGetOwnPropertyDescriptor(ES.ToObject(value), property);
      });
    }
  }
  if (Object.seal) {
    var objectSealAcceptsPrimitives = !throwsError(function () { Object.seal('foo'); });
    if (!objectSealAcceptsPrimitives) {
      var originalObjectSeal = Object.seal;
      overrideNative(Object, 'seal', function seal(value) {
        if (!ES.TypeIsObject(value)) { return value; }
        return originalObjectSeal(value);
      });
    }
  }
  if (Object.isSealed) {
    var objectIsSealedAcceptsPrimitives = !throwsError(function () { Object.isSealed('foo'); });
    if (!objectIsSealedAcceptsPrimitives) {
      var originalObjectIsSealed = Object.isSealed;
      overrideNative(Object, 'isSealed', function isSealed(value) {
        if (!ES.TypeIsObject(value)) { return true; }
        return originalObjectIsSealed(value);
      });
    }
  }
  if (Object.freeze) {
    var objectFreezeAcceptsPrimitives = !throwsError(function () { Object.freeze('foo'); });
    if (!objectFreezeAcceptsPrimitives) {
      var originalObjectFreeze = Object.freeze;
      overrideNative(Object, 'freeze', function freeze(value) {
        if (!ES.TypeIsObject(value)) { return value; }
        return originalObjectFreeze(value);
      });
    }
  }
  if (Object.isFrozen) {
    var objectIsFrozenAcceptsPrimitives = !throwsError(function () { Object.isFrozen('foo'); });
    if (!objectIsFrozenAcceptsPrimitives) {
      var originalObjectIsFrozen = Object.isFrozen;
      overrideNative(Object, 'isFrozen', function isFrozen(value) {
        if (!ES.TypeIsObject(value)) { return true; }
        return originalObjectIsFrozen(value);
      });
    }
  }
  if (Object.preventExtensions) {
    var objectPreventExtensionsAcceptsPrimitives = !throwsError(function () { Object.preventExtensions('foo'); });
    if (!objectPreventExtensionsAcceptsPrimitives) {
      var originalObjectPreventExtensions = Object.preventExtensions;
      overrideNative(Object, 'preventExtensions', function preventExtensions(value) {
        if (!ES.TypeIsObject(value)) { return value; }
        return originalObjectPreventExtensions(value);
      });
    }
  }
  if (Object.isExtensible) {
    var objectIsExtensibleAcceptsPrimitives = !throwsError(function () { Object.isExtensible('foo'); });
    if (!objectIsExtensibleAcceptsPrimitives) {
      var originalObjectIsExtensible = Object.isExtensible;
      overrideNative(Object, 'isExtensible', function isExtensible(value) {
        if (!ES.TypeIsObject(value)) { return false; }
        return originalObjectIsExtensible(value);
      });
    }
  }
  if (Object.getPrototypeOf) {
    var objectGetProtoAcceptsPrimitives = !throwsError(function () { Object.getPrototypeOf('foo'); });
    if (!objectGetProtoAcceptsPrimitives) {
      var originalGetProto = Object.getPrototypeOf;
      overrideNative(Object, 'getPrototypeOf', function getPrototypeOf(value) {
        return originalGetProto(ES.ToObject(value));
      });
    }
  }

  var hasFlags = supportsDescriptors && (function () {
    var desc = Object.getOwnPropertyDescriptor(RegExp.prototype, 'flags');
    return desc && ES.IsCallable(desc.get);
  }());
  if (supportsDescriptors && !hasFlags) {
    var regExpFlagsGetter = function flags() {
      if (!ES.TypeIsObject(this)) {
        throw new TypeError('Method called on incompatible type: must be an object.');
      }
      var result = '';
      if (this.global) {
        result += 'g';
      }
      if (this.ignoreCase) {
        result += 'i';
      }
      if (this.multiline) {
        result += 'm';
      }
      if (this.unicode) {
        result += 'u';
      }
      if (this.sticky) {
        result += 'y';
      }
      return result;
    };

    Value.getter(RegExp.prototype, 'flags', regExpFlagsGetter);
  }

  var regExpSupportsFlagsWithRegex = supportsDescriptors && valueOrFalseIfThrows(function () {
    return String(new RegExp(/a/g, 'i')) === '/a/i';
  });
  var regExpNeedsToSupportSymbolMatch = hasSymbols && supportsDescriptors && (function () {
    // Edge 0.12 supports flags fully, but does not support Symbol.match
    var regex = /./;
    regex[Symbol.match] = false;
    return RegExp(regex) === regex;
  }());

  var regexToStringIsGeneric = valueOrFalseIfThrows(function () {
    return RegExp.prototype.toString.call({ source: 'abc' }) === '/abc/';
  });
  var regexToStringSupportsGenericFlags = regexToStringIsGeneric && valueOrFalseIfThrows(function () {
    return RegExp.prototype.toString.call({ source: 'a', flags: 'b' }) === '/a/b';
  });
  if (!regexToStringIsGeneric || !regexToStringSupportsGenericFlags) {
    var origRegExpToString = RegExp.prototype.toString;
    defineProperty(RegExp.prototype, 'toString', function toString() {
      var R = ES.RequireObjectCoercible(this);
      if (Type.regex(R)) {
        return _call(origRegExpToString, R);
      }
      var pattern = $String(R.source);
      var flags = $String(R.flags);
      return '/' + pattern + '/' + flags;
    }, true);
    Value.preserveToString(RegExp.prototype.toString, origRegExpToString);
  }

  if (supportsDescriptors && (!regExpSupportsFlagsWithRegex || regExpNeedsToSupportSymbolMatch)) {
    var flagsGetter = Object.getOwnPropertyDescriptor(RegExp.prototype, 'flags').get;
    var sourceDesc = Object.getOwnPropertyDescriptor(RegExp.prototype, 'source') || {};
    var legacySourceGetter = function () {
      // prior to it being a getter, it's own + nonconfigurable
      return this.source;
    };
    var sourceGetter = ES.IsCallable(sourceDesc.get) ? sourceDesc.get : legacySourceGetter;

    var OrigRegExp = RegExp;
    var RegExpShim = (function () {
      return function RegExp(pattern, flags) {
        var patternIsRegExp = ES.IsRegExp(pattern);
        var calledWithNew = this instanceof RegExp;
        if (!calledWithNew && patternIsRegExp && typeof flags === 'undefined' && pattern.constructor === RegExp) {
          return pattern;
        }

        var P = pattern;
        var F = flags;
        if (Type.regex(pattern)) {
          P = ES.Call(sourceGetter, pattern);
          F = typeof flags === 'undefined' ? ES.Call(flagsGetter, pattern) : flags;
          return new RegExp(P, F);
        } else if (patternIsRegExp) {
          P = pattern.source;
          F = typeof flags === 'undefined' ? pattern.flags : flags;
        }
        return new OrigRegExp(pattern, flags);
      };
    }());
    wrapConstructor(OrigRegExp, RegExpShim, {
      $input: true // Chrome < v39 & Opera < 26 have a nonstandard "$input" property
    });
    /* globals RegExp: true */
    /* eslint-disable no-undef, no-global-assign */
    /* jshint -W020 */
    RegExp = RegExpShim;
    Value.redefine(globals, 'RegExp', RegExpShim);
    /* jshint +W020 */
    /* eslint-enable no-undef, no-global-assign */
    /* globals RegExp: false */
  }

  if (supportsDescriptors) {
    var regexGlobals = {
      input: '$_',
      lastMatch: '$&',
      lastParen: '$+',
      leftContext: '$`',
      rightContext: '$\''
    };
    _forEach(keys(regexGlobals), function (prop) {
      if (prop in RegExp && !(regexGlobals[prop] in RegExp)) {
        Value.getter(RegExp, regexGlobals[prop], function get() {
          return RegExp[prop];
        });
      }
    });
  }
  addDefaultSpecies(RegExp);

  var inverseEpsilon = 1 / Number.EPSILON;
  var roundTiesToEven = function roundTiesToEven(n) {
    // Even though this reduces down to `return n`, it takes advantage of built-in rounding.
    return (n + inverseEpsilon) - inverseEpsilon;
  };
  var BINARY_32_EPSILON = Math.pow(2, -23);
  var BINARY_32_MAX_VALUE = Math.pow(2, 127) * (2 - BINARY_32_EPSILON);
  var BINARY_32_MIN_VALUE = Math.pow(2, -126);
  var E = Math.E;
  var LOG2E = Math.LOG2E;
  var LOG10E = Math.LOG10E;
  var numberCLZ = Number.prototype.clz;
  delete Number.prototype.clz; // Safari 8 has Number#clz

  var MathShims = {
    acosh: function acosh(value) {
      var x = Number(value);
      if (numberIsNaN(x) || value < 1) { return NaN; }
      if (x === 1) { return 0; }
      if (x === Infinity) { return x; }
      return _log((x / E) + (_sqrt(x + 1) * _sqrt(x - 1) / E)) + 1;
    },

    asinh: function asinh(value) {
      var x = Number(value);
      if (x === 0 || !globalIsFinite(x)) {
        return x;
      }
      return x < 0 ? -asinh(-x) : _log(x + _sqrt((x * x) + 1));
    },

    atanh: function atanh(value) {
      var x = Number(value);
      if (numberIsNaN(x) || x < -1 || x > 1) {
        return NaN;
      }
      if (x === -1) { return -Infinity; }
      if (x === 1) { return Infinity; }
      if (x === 0) { return x; }
      return 0.5 * _log((1 + x) / (1 - x));
    },

    cbrt: function cbrt(value) {
      var x = Number(value);
      if (x === 0) { return x; }
      var negate = x < 0;
      var result;
      if (negate) { x = -x; }
      if (x === Infinity) {
        result = Infinity;
      } else {
        result = _exp(_log(x) / 3);
        // from http://en.wikipedia.org/wiki/Cube_root#Numerical_methods
        result = ((x / (result * result)) + (2 * result)) / 3;
      }
      return negate ? -result : result;
    },

    clz32: function clz32(value) {
      // See https://bugs.ecmascript.org/show_bug.cgi?id=2465
      var x = Number(value);
      var number = ES.ToUint32(x);
      if (number === 0) {
        return 32;
      }
      return numberCLZ ? ES.Call(numberCLZ, number) : 31 - _floor(_log(number + 0.5) * LOG2E);
    },

    cosh: function cosh(value) {
      var x = Number(value);
      if (x === 0) { return 1; } // +0 or -0
      if (numberIsNaN(x)) { return NaN; }
      if (!globalIsFinite(x)) { return Infinity; }
      if (x < 0) { x = -x; }
      if (x > 21) { return _exp(x) / 2; }
      return (_exp(x) + _exp(-x)) / 2;
    },

    expm1: function expm1(value) {
      var x = Number(value);
      if (x === -Infinity) { return -1; }
      if (!globalIsFinite(x) || x === 0) { return x; }
      if (_abs(x) > 0.5) {
        return _exp(x) - 1;
      }
      // A more precise approximation using Taylor series expansion
      // from https://github.com/paulmillr/es6-shim/issues/314#issuecomment-70293986
      var t = x;
      var sum = 0;
      var n = 1;
      while (sum + t !== sum) {
        sum += t;
        n += 1;
        t *= x / n;
      }
      return sum;
    },

    hypot: function hypot(x, y) {
      var result = 0;
      var largest = 0;
      for (var i = 0; i < arguments.length; ++i) {
        var value = _abs(Number(arguments[i]));
        if (largest < value) {
          result *= (largest / value) * (largest / value);
          result += 1;
          largest = value;
        } else {
          result += value > 0 ? (value / largest) * (value / largest) : value;
        }
      }
      return largest === Infinity ? Infinity : largest * _sqrt(result);
    },

    log2: function log2(value) {
      return _log(value) * LOG2E;
    },

    log10: function log10(value) {
      return _log(value) * LOG10E;
    },

    log1p: function log1p(value) {
      var x = Number(value);
      if (x < -1 || numberIsNaN(x)) { return NaN; }
      if (x === 0 || x === Infinity) { return x; }
      if (x === -1) { return -Infinity; }

      return (1 + x) - 1 === 0 ? x : x * (_log(1 + x) / ((1 + x) - 1));
    },

    sign: _sign,

    sinh: function sinh(value) {
      var x = Number(value);
      if (!globalIsFinite(x) || x === 0) { return x; }

      if (_abs(x) < 1) {
        return (Math.expm1(x) - Math.expm1(-x)) / 2;
      }
      return (_exp(x - 1) - _exp(-x - 1)) * E / 2;
    },

    tanh: function tanh(value) {
      var x = Number(value);
      if (numberIsNaN(x) || x === 0) { return x; }
      // can exit early at +-20 as JS loses precision for true value at this integer
      if (x >= 20) { return 1; }
      if (x <= -20) { return -1; }

      return (Math.expm1(x) - Math.expm1(-x)) / (_exp(x) + _exp(-x));
    },

    trunc: function trunc(value) {
      var x = Number(value);
      return x < 0 ? -_floor(-x) : _floor(x);
    },

    imul: function imul(x, y) {
      // taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/imul
      var a = ES.ToUint32(x);
      var b = ES.ToUint32(y);
      var ah = (a >>> 16) & 0xffff;
      var al = a & 0xffff;
      var bh = (b >>> 16) & 0xffff;
      var bl = b & 0xffff;
      // the shift by 0 fixes the sign on the high part
      // the final |0 converts the unsigned value into a signed value
      return (al * bl) + ((((ah * bl) + (al * bh)) << 16) >>> 0) | 0;
    },

    fround: function fround(x) {
      var v = Number(x);
      if (v === 0 || v === Infinity || v === -Infinity || numberIsNaN(v)) {
        return v;
      }
      var sign = _sign(v);
      var abs = _abs(v);
      if (abs < BINARY_32_MIN_VALUE) {
        return sign * roundTiesToEven(
          abs / BINARY_32_MIN_VALUE / BINARY_32_EPSILON
        ) * BINARY_32_MIN_VALUE * BINARY_32_EPSILON;
      }
      // Veltkamp's splitting (?)
      var a = (1 + (BINARY_32_EPSILON / Number.EPSILON)) * abs;
      var result = a - (a - abs);
      if (result > BINARY_32_MAX_VALUE || numberIsNaN(result)) {
        return sign * Infinity;
      }
      return sign * result;
    }
  };
  defineProperties(Math, MathShims);
  // IE 11 TP has an imprecise log1p: reports Math.log1p(-1e-17) as 0
  defineProperty(Math, 'log1p', MathShims.log1p, Math.log1p(-1e-17) !== -1e-17);
  // IE 11 TP has an imprecise asinh: reports Math.asinh(-1e7) as not exactly equal to -Math.asinh(1e7)
  defineProperty(Math, 'asinh', MathShims.asinh, Math.asinh(-1e7) !== -Math.asinh(1e7));
  // Chrome 40 has an imprecise Math.tanh with very small numbers
  defineProperty(Math, 'tanh', MathShims.tanh, Math.tanh(-2e-17) !== -2e-17);
  // Chrome 40 loses Math.acosh precision with high numbers
  defineProperty(Math, 'acosh', MathShims.acosh, Math.acosh(Number.MAX_VALUE) === Infinity);
  // Firefox 38 on Windows
  defineProperty(Math, 'cbrt', MathShims.cbrt, Math.abs(1 - (Math.cbrt(1e-300) / 1e-100)) / Number.EPSILON > 8);
  // node 0.11 has an imprecise Math.sinh with very small numbers
  defineProperty(Math, 'sinh', MathShims.sinh, Math.sinh(-2e-17) !== -2e-17);
  // FF 35 on Linux reports 22025.465794806725 for Math.expm1(10)
  var expm1OfTen = Math.expm1(10);
  defineProperty(Math, 'expm1', MathShims.expm1, expm1OfTen > 22025.465794806719 || expm1OfTen < 22025.4657948067165168);

  var origMathRound = Math.round;
  // breaks in e.g. Safari 8, Internet Explorer 11, Opera 12
  var roundHandlesBoundaryConditions = Math.round(0.5 - (Number.EPSILON / 4)) === 0 &&
    Math.round(-0.5 + (Number.EPSILON / 3.99)) === 1;

  // When engines use Math.floor(x + 0.5) internally, Math.round can be buggy for large integers.
  // This behavior should be governed by "round to nearest, ties to even mode"
  // see http://www.ecma-international.org/ecma-262/6.0/#sec-terms-and-definitions-number-type
  // These are the boundary cases where it breaks.
  var smallestPositiveNumberWhereRoundBreaks = inverseEpsilon + 1;
  var largestPositiveNumberWhereRoundBreaks = (2 * inverseEpsilon) - 1;
  var roundDoesNotIncreaseIntegers = [
    smallestPositiveNumberWhereRoundBreaks,
    largestPositiveNumberWhereRoundBreaks
  ].every(function (num) {
    return Math.round(num) === num;
  });
  defineProperty(Math, 'round', function round(x) {
    var floor = _floor(x);
    var ceil = floor === -1 ? -0 : floor + 1;
    return x - floor < 0.5 ? floor : ceil;
  }, !roundHandlesBoundaryConditions || !roundDoesNotIncreaseIntegers);
  Value.preserveToString(Math.round, origMathRound);

  var origImul = Math.imul;
  if (Math.imul(0xffffffff, 5) !== -5) {
    // Safari 6.1, at least, reports "0" for this value
    Math.imul = MathShims.imul;
    Value.preserveToString(Math.imul, origImul);
  }
  if (Math.imul.length !== 2) {
    // Safari 8.0.4 has a length of 1
    // fixed in https://bugs.webkit.org/show_bug.cgi?id=143658
    overrideNative(Math, 'imul', function imul(x, y) {
      return ES.Call(origImul, Math, arguments);
    });
  }

  // Promises
  // Simplest possible implementation; use a 3rd-party library if you
  // want the best possible speed and/or long stack traces.
  var PromiseShim = (function () {
    var setTimeout = globals.setTimeout;
    // some environments don't have setTimeout - no way to shim here.
    if (typeof setTimeout !== 'function' && typeof setTimeout !== 'object') { return; }

    ES.IsPromise = function (promise) {
      if (!ES.TypeIsObject(promise)) {
        return false;
      }
      if (typeof promise._promise === 'undefined') {
        return false; // uninitialized, or missing our hidden field.
      }
      return true;
    };

    // "PromiseCapability" in the spec is what most promise implementations
    // call a "deferred".
    var PromiseCapability = function (C) {
      if (!ES.IsConstructor(C)) {
        throw new TypeError('Bad promise constructor');
      }
      var capability = this;
      var resolver = function (resolve, reject) {
        if (capability.resolve !== void 0 || capability.reject !== void 0) {
          throw new TypeError('Bad Promise implementation!');
        }
        capability.resolve = resolve;
        capability.reject = reject;
      };
      // Initialize fields to inform optimizers about the object shape.
      capability.resolve = void 0;
      capability.reject = void 0;
      capability.promise = new C(resolver);
      if (!(ES.IsCallable(capability.resolve) && ES.IsCallable(capability.reject))) {
        throw new TypeError('Bad promise constructor');
      }
    };

    // find an appropriate setImmediate-alike
    var makeZeroTimeout;
    /*global window */
    if (typeof window !== 'undefined' && ES.IsCallable(window.postMessage)) {
      makeZeroTimeout = function () {
        // from http://dbaron.org/log/20100309-faster-timeouts
        var timeouts = [];
        var messageName = 'zero-timeout-message';
        var setZeroTimeout = function (fn) {
          _push(timeouts, fn);
          window.postMessage(messageName, '*');
        };
        var handleMessage = function (event) {
          if (event.source === window && event.data === messageName) {
            event.stopPropagation();
            if (timeouts.length === 0) { return; }
            var fn = _shift(timeouts);
            fn();
          }
        };
        window.addEventListener('message', handleMessage, true);
        return setZeroTimeout;
      };
    }
    var makePromiseAsap = function () {
      // An efficient task-scheduler based on a pre-existing Promise
      // implementation, which we can use even if we override the
      // global Promise below (in order to workaround bugs)
      // https://github.com/Raynos/observ-hash/issues/2#issuecomment-35857671
      var P = globals.Promise;
      var pr = P && P.resolve && P.resolve();
      return pr && function (task) {
        return pr.then(task);
      };
    };
    /*global process */
    /* jscs:disable disallowMultiLineTernary */
    var enqueue = ES.IsCallable(globals.setImmediate) ?
      globals.setImmediate :
      typeof process === 'object' && process.nextTick ? process.nextTick :
      makePromiseAsap() ||
      (ES.IsCallable(makeZeroTimeout) ? makeZeroTimeout() :
      function (task) { setTimeout(task, 0); }); // fallback
    /* jscs:enable disallowMultiLineTernary */

    // Constants for Promise implementation
    var PROMISE_IDENTITY = function (x) { return x; };
    var PROMISE_THROWER = function (e) { throw e; };
    var PROMISE_PENDING = 0;
    var PROMISE_FULFILLED = 1;
    var PROMISE_REJECTED = 2;
    // We store fulfill/reject handlers and capabilities in a single array.
    var PROMISE_FULFILL_OFFSET = 0;
    var PROMISE_REJECT_OFFSET = 1;
    var PROMISE_CAPABILITY_OFFSET = 2;
    // This is used in an optimization for chaining promises via then.
    var PROMISE_FAKE_CAPABILITY = {};

    var enqueuePromiseReactionJob = function (handler, capability, argument) {
      enqueue(function () {
        promiseReactionJob(handler, capability, argument);
      });
    };

    var promiseReactionJob = function (handler, promiseCapability, argument) {
      var handlerResult, f;
      if (promiseCapability === PROMISE_FAKE_CAPABILITY) {
        // Fast case, when we don't actually need to chain through to a
        // (real) promiseCapability.
        return handler(argument);
      }
      try {
        handlerResult = handler(argument);
        f = promiseCapability.resolve;
      } catch (e) {
        handlerResult = e;
        f = promiseCapability.reject;
      }
      f(handlerResult);
    };

    var fulfillPromise = function (promise, value) {
      var _promise = promise._promise;
      var length = _promise.reactionLength;
      if (length > 0) {
        enqueuePromiseReactionJob(
          _promise.fulfillReactionHandler0,
          _promise.reactionCapability0,
          value
        );
        _promise.fulfillReactionHandler0 = void 0;
        _promise.rejectReactions0 = void 0;
        _promise.reactionCapability0 = void 0;
        if (length > 1) {
          for (var i = 1, idx = 0; i < length; i++, idx += 3) {
            enqueuePromiseReactionJob(
              _promise[idx + PROMISE_FULFILL_OFFSET],
              _promise[idx + PROMISE_CAPABILITY_OFFSET],
              value
            );
            promise[idx + PROMISE_FULFILL_OFFSET] = void 0;
            promise[idx + PROMISE_REJECT_OFFSET] = void 0;
            promise[idx + PROMISE_CAPABILITY_OFFSET] = void 0;
          }
        }
      }
      _promise.result = value;
      _promise.state = PROMISE_FULFILLED;
      _promise.reactionLength = 0;
    };

    var rejectPromise = function (promise, reason) {
      var _promise = promise._promise;
      var length = _promise.reactionLength;
      if (length > 0) {
        enqueuePromiseReactionJob(
          _promise.rejectReactionHandler0,
          _promise.reactionCapability0,
          reason
        );
        _promise.fulfillReactionHandler0 = void 0;
        _promise.rejectReactions0 = void 0;
        _promise.reactionCapability0 = void 0;
        if (length > 1) {
          for (var i = 1, idx = 0; i < length; i++, idx += 3) {
            enqueuePromiseReactionJob(
              _promise[idx + PROMISE_REJECT_OFFSET],
              _promise[idx + PROMISE_CAPABILITY_OFFSET],
              reason
            );
            promise[idx + PROMISE_FULFILL_OFFSET] = void 0;
            promise[idx + PROMISE_REJECT_OFFSET] = void 0;
            promise[idx + PROMISE_CAPABILITY_OFFSET] = void 0;
          }
        }
      }
      _promise.result = reason;
      _promise.state = PROMISE_REJECTED;
      _promise.reactionLength = 0;
    };

    var createResolvingFunctions = function (promise) {
      var alreadyResolved = false;
      var resolve = function (resolution) {
        var then;
        if (alreadyResolved) { return; }
        alreadyResolved = true;
        if (resolution === promise) {
          return rejectPromise(promise, new TypeError('Self resolution'));
        }
        if (!ES.TypeIsObject(resolution)) {
          return fulfillPromise(promise, resolution);
        }
        try {
          then = resolution.then;
        } catch (e) {
          return rejectPromise(promise, e);
        }
        if (!ES.IsCallable(then)) {
          return fulfillPromise(promise, resolution);
        }
        enqueue(function () {
          promiseResolveThenableJob(promise, resolution, then);
        });
      };
      var reject = function (reason) {
        if (alreadyResolved) { return; }
        alreadyResolved = true;
        return rejectPromise(promise, reason);
      };
      return { resolve: resolve, reject: reject };
    };

    var optimizedThen = function (then, thenable, resolve, reject) {
      // Optimization: since we discard the result, we can pass our
      // own then implementation a special hint to let it know it
      // doesn't have to create it.  (The PROMISE_FAKE_CAPABILITY
      // object is local to this implementation and unforgeable outside.)
      if (then === Promise$prototype$then) {
        _call(then, thenable, resolve, reject, PROMISE_FAKE_CAPABILITY);
      } else {
        _call(then, thenable, resolve, reject);
      }
    };
    var promiseResolveThenableJob = function (promise, thenable, then) {
      var resolvingFunctions = createResolvingFunctions(promise);
      var resolve = resolvingFunctions.resolve;
      var reject = resolvingFunctions.reject;
      try {
        optimizedThen(then, thenable, resolve, reject);
      } catch (e) {
        reject(e);
      }
    };

    var Promise$prototype, Promise$prototype$then;
    var Promise = (function () {
      var PromiseShim = function Promise(resolver) {
        if (!(this instanceof PromiseShim)) {
          throw new TypeError('Constructor Promise requires "new"');
        }
        if (this && this._promise) {
          throw new TypeError('Bad construction');
        }
        // see https://bugs.ecmascript.org/show_bug.cgi?id=2482
        if (!ES.IsCallable(resolver)) {
          throw new TypeError('not a valid resolver');
        }
        var promise = emulateES6construct(this, PromiseShim, Promise$prototype, {
          _promise: {
            result: void 0,
            state: PROMISE_PENDING,
            // The first member of the "reactions" array is inlined here,
            // since most promises only have one reaction.
            // We've also exploded the 'reaction' object to inline the
            // "handler" and "capability" fields, since both fulfill and
            // reject reactions share the same capability.
            reactionLength: 0,
            fulfillReactionHandler0: void 0,
            rejectReactionHandler0: void 0,
            reactionCapability0: void 0
          }
        });
        var resolvingFunctions = createResolvingFunctions(promise);
        var reject = resolvingFunctions.reject;
        try {
          resolver(resolvingFunctions.resolve, reject);
        } catch (e) {
          reject(e);
        }
        return promise;
      };
      return PromiseShim;
    }());
    Promise$prototype = Promise.prototype;

    var _promiseAllResolver = function (index, values, capability, remaining) {
      var alreadyCalled = false;
      return function (x) {
        if (alreadyCalled) { return; }
        alreadyCalled = true;
        values[index] = x;
        if ((--remaining.count) === 0) {
          var resolve = capability.resolve;
          resolve(values); // call w/ this===undefined
        }
      };
    };

    var performPromiseAll = function (iteratorRecord, C, resultCapability) {
      var it = iteratorRecord.iterator;
      var values = [];
      var remaining = { count: 1 };
      var next, nextValue;
      var index = 0;
      while (true) {
        try {
          next = ES.IteratorStep(it);
          if (next === false) {
            iteratorRecord.done = true;
            break;
          }
          nextValue = next.value;
        } catch (e) {
          iteratorRecord.done = true;
          throw e;
        }
        values[index] = void 0;
        var nextPromise = C.resolve(nextValue);
        var resolveElement = _promiseAllResolver(
          index, values, resultCapability, remaining
        );
        remaining.count += 1;
        optimizedThen(nextPromise.then, nextPromise, resolveElement, resultCapability.reject);
        index += 1;
      }
      if ((--remaining.count) === 0) {
        var resolve = resultCapability.resolve;
        resolve(values); // call w/ this===undefined
      }
      return resultCapability.promise;
    };

    var performPromiseRace = function (iteratorRecord, C, resultCapability) {
      var it = iteratorRecord.iterator;
      var next, nextValue, nextPromise;
      while (true) {
        try {
          next = ES.IteratorStep(it);
          if (next === false) {
            // NOTE: If iterable has no items, resulting promise will never
            // resolve; see:
            // https://github.com/domenic/promises-unwrapping/issues/75
            // https://bugs.ecmascript.org/show_bug.cgi?id=2515
            iteratorRecord.done = true;
            break;
          }
          nextValue = next.value;
        } catch (e) {
          iteratorRecord.done = true;
          throw e;
        }
        nextPromise = C.resolve(nextValue);
        optimizedThen(nextPromise.then, nextPromise, resultCapability.resolve, resultCapability.reject);
      }
      return resultCapability.promise;
    };

    defineProperties(Promise, {
      all: function all(iterable) {
        var C = this;
        if (!ES.TypeIsObject(C)) {
          throw new TypeError('Promise is not object');
        }
        var capability = new PromiseCapability(C);
        var iterator, iteratorRecord;
        try {
          iterator = ES.GetIterator(iterable);
          iteratorRecord = { iterator: iterator, done: false };
          return performPromiseAll(iteratorRecord, C, capability);
        } catch (e) {
          var exception = e;
          if (iteratorRecord && !iteratorRecord.done) {
            try {
              ES.IteratorClose(iterator, true);
            } catch (ee) {
              exception = ee;
            }
          }
          var reject = capability.reject;
          reject(exception);
          return capability.promise;
        }
      },

      race: function race(iterable) {
        var C = this;
        if (!ES.TypeIsObject(C)) {
          throw new TypeError('Promise is not object');
        }
        var capability = new PromiseCapability(C);
        var iterator, iteratorRecord;
        try {
          iterator = ES.GetIterator(iterable);
          iteratorRecord = { iterator: iterator, done: false };
          return performPromiseRace(iteratorRecord, C, capability);
        } catch (e) {
          var exception = e;
          if (iteratorRecord && !iteratorRecord.done) {
            try {
              ES.IteratorClose(iterator, true);
            } catch (ee) {
              exception = ee;
            }
          }
          var reject = capability.reject;
          reject(exception);
          return capability.promise;
        }
      },

      reject: function reject(reason) {
        var C = this;
        if (!ES.TypeIsObject(C)) {
          throw new TypeError('Bad promise constructor');
        }
        var capability = new PromiseCapability(C);
        var rejectFunc = capability.reject;
        rejectFunc(reason); // call with this===undefined
        return capability.promise;
      },

      resolve: function resolve(v) {
        // See https://esdiscuss.org/topic/fixing-promise-resolve for spec
        var C = this;
        if (!ES.TypeIsObject(C)) {
          throw new TypeError('Bad promise constructor');
        }
        if (ES.IsPromise(v)) {
          var constructor = v.constructor;
          if (constructor === C) {
            return v;
          }
        }
        var capability = new PromiseCapability(C);
        var resolveFunc = capability.resolve;
        resolveFunc(v); // call with this===undefined
        return capability.promise;
      }
    });

    defineProperties(Promise$prototype, {
      'catch': function (onRejected) {
        return this.then(null, onRejected);
      },

      then: function then(onFulfilled, onRejected) {
        var promise = this;
        if (!ES.IsPromise(promise)) { throw new TypeError('not a promise'); }
        var C = ES.SpeciesConstructor(promise, Promise);
        var resultCapability;
        var returnValueIsIgnored = arguments.length > 2 && arguments[2] === PROMISE_FAKE_CAPABILITY;
        if (returnValueIsIgnored && C === Promise) {
          resultCapability = PROMISE_FAKE_CAPABILITY;
        } else {
          resultCapability = new PromiseCapability(C);
        }
        // PerformPromiseThen(promise, onFulfilled, onRejected, resultCapability)
        // Note that we've split the 'reaction' object into its two
        // components, "capabilities" and "handler"
        // "capabilities" is always equal to `resultCapability`
        var fulfillReactionHandler = ES.IsCallable(onFulfilled) ? onFulfilled : PROMISE_IDENTITY;
        var rejectReactionHandler = ES.IsCallable(onRejected) ? onRejected : PROMISE_THROWER;
        var _promise = promise._promise;
        var value;
        if (_promise.state === PROMISE_PENDING) {
          if (_promise.reactionLength === 0) {
            _promise.fulfillReactionHandler0 = fulfillReactionHandler;
            _promise.rejectReactionHandler0 = rejectReactionHandler;
            _promise.reactionCapability0 = resultCapability;
          } else {
            var idx = 3 * (_promise.reactionLength - 1);
            _promise[idx + PROMISE_FULFILL_OFFSET] = fulfillReactionHandler;
            _promise[idx + PROMISE_REJECT_OFFSET] = rejectReactionHandler;
            _promise[idx + PROMISE_CAPABILITY_OFFSET] = resultCapability;
          }
          _promise.reactionLength += 1;
        } else if (_promise.state === PROMISE_FULFILLED) {
          value = _promise.result;
          enqueuePromiseReactionJob(
            fulfillReactionHandler, resultCapability, value
          );
        } else if (_promise.state === PROMISE_REJECTED) {
          value = _promise.result;
          enqueuePromiseReactionJob(
            rejectReactionHandler, resultCapability, value
          );
        } else {
          throw new TypeError('unexpected Promise state');
        }
        return resultCapability.promise;
      }
    });
    // This helps the optimizer by ensuring that methods which take
    // capabilities aren't polymorphic.
    PROMISE_FAKE_CAPABILITY = new PromiseCapability(Promise);
    Promise$prototype$then = Promise$prototype.then;

    return Promise;
  }());

  // Chrome's native Promise has extra methods that it shouldn't have. Let's remove them.
  if (globals.Promise) {
    delete globals.Promise.accept;
    delete globals.Promise.defer;
    delete globals.Promise.prototype.chain;
  }

  if (typeof PromiseShim === 'function') {
    // export the Promise constructor.
    defineProperties(globals, { Promise: PromiseShim });
    // In Chrome 33 (and thereabouts) Promise is defined, but the
    // implementation is buggy in a number of ways.  Let's check subclassing
    // support to see if we have a buggy implementation.
    var promiseSupportsSubclassing = supportsSubclassing(globals.Promise, function (S) {
      return S.resolve(42).then(function () {}) instanceof S;
    });
    var promiseIgnoresNonFunctionThenCallbacks = !throwsError(function () {
      globals.Promise.reject(42).then(null, 5).then(null, noop);
    });
    var promiseRequiresObjectContext = throwsError(function () { globals.Promise.call(3, noop); });
    // Promise.resolve() was errata'ed late in the ES6 process.
    // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1170742
    //      https://code.google.com/p/v8/issues/detail?id=4161
    // It serves as a proxy for a number of other bugs in early Promise
    // implementations.
    var promiseResolveBroken = (function (Promise) {
      var p = Promise.resolve(5);
      p.constructor = {};
      var p2 = Promise.resolve(p);
      try {
        p2.then(null, noop).then(null, noop); // avoid "uncaught rejection" warnings in console
      } catch (e) {
        return true; // v8 native Promises break here https://code.google.com/p/chromium/issues/detail?id=575314
      }
      return p === p2; // This *should* be false!
    }(globals.Promise));

    // Chrome 46 (probably older too) does not retrieve a thenable's .then synchronously
    var getsThenSynchronously = supportsDescriptors && (function () {
      var count = 0;
      var thenable = Object.defineProperty({}, 'then', { get: function () { count += 1; } });
      Promise.resolve(thenable);
      return count === 1;
    }());

    var BadResolverPromise = function BadResolverPromise(executor) {
      var p = new Promise(executor);
      executor(3, function () {});
      this.then = p.then;
      this.constructor = BadResolverPromise;
    };
    BadResolverPromise.prototype = Promise.prototype;
    BadResolverPromise.all = Promise.all;
    // Chrome Canary 49 (probably older too) has some implementation bugs
    var hasBadResolverPromise = valueOrFalseIfThrows(function () {
      return !!BadResolverPromise.all([1, 2]);
    });

    if (!promiseSupportsSubclassing || !promiseIgnoresNonFunctionThenCallbacks ||
        !promiseRequiresObjectContext || promiseResolveBroken ||
        !getsThenSynchronously || hasBadResolverPromise) {
      /* globals Promise: true */
      /* eslint-disable no-undef, no-global-assign */
      /* jshint -W020 */
      Promise = PromiseShim;
      /* jshint +W020 */
      /* eslint-enable no-undef, no-global-assign */
      /* globals Promise: false */
      overrideNative(globals, 'Promise', PromiseShim);
    }
    if (Promise.all.length !== 1) {
      var origAll = Promise.all;
      overrideNative(Promise, 'all', function all(iterable) {
        return ES.Call(origAll, this, arguments);
      });
    }
    if (Promise.race.length !== 1) {
      var origRace = Promise.race;
      overrideNative(Promise, 'race', function race(iterable) {
        return ES.Call(origRace, this, arguments);
      });
    }
    if (Promise.resolve.length !== 1) {
      var origResolve = Promise.resolve;
      overrideNative(Promise, 'resolve', function resolve(x) {
        return ES.Call(origResolve, this, arguments);
      });
    }
    if (Promise.reject.length !== 1) {
      var origReject = Promise.reject;
      overrideNative(Promise, 'reject', function reject(r) {
        return ES.Call(origReject, this, arguments);
      });
    }
    ensureEnumerable(Promise, 'all');
    ensureEnumerable(Promise, 'race');
    ensureEnumerable(Promise, 'resolve');
    ensureEnumerable(Promise, 'reject');
    addDefaultSpecies(Promise);
  }

  // Map and Set require a true ES5 environment
  // Their fast path also requires that the environment preserve
  // property insertion order, which is not guaranteed by the spec.
  var testOrder = function (a) {
    var b = keys(_reduce(a, function (o, k) {
      o[k] = true;
      return o;
    }, {}));
    return a.join(':') === b.join(':');
  };
  var preservesInsertionOrder = testOrder(['z', 'a', 'bb']);
  // some engines (eg, Chrome) only preserve insertion order for string keys
  var preservesNumericInsertionOrder = testOrder(['z', 1, 'a', '3', 2]);

  if (supportsDescriptors) {

    var fastkey = function fastkey(key, skipInsertionOrderCheck) {
      if (!skipInsertionOrderCheck && !preservesInsertionOrder) {
        return null;
      }
      if (isNullOrUndefined(key)) {
        return '^' + ES.ToString(key);
      } else if (typeof key === 'string') {
        return '$' + key;
      } else if (typeof key === 'number') {
        // note that -0 will get coerced to "0" when used as a property key
        if (!preservesNumericInsertionOrder) {
          return 'n' + key;
        }
        return key;
      } else if (typeof key === 'boolean') {
        return 'b' + key;
      }
      return null;
    };

    var emptyObject = function emptyObject() {
      // accomodate some older not-quite-ES5 browsers
      return Object.create ? Object.create(null) : {};
    };

    var addIterableToMap = function addIterableToMap(MapConstructor, map, iterable) {
      if (isArray(iterable) || Type.string(iterable)) {
        _forEach(iterable, function (entry) {
          if (!ES.TypeIsObject(entry)) {
            throw new TypeError('Iterator value ' + entry + ' is not an entry object');
          }
          map.set(entry[0], entry[1]);
        });
      } else if (iterable instanceof MapConstructor) {
        _call(MapConstructor.prototype.forEach, iterable, function (value, key) {
          map.set(key, value);
        });
      } else {
        var iter, adder;
        if (!isNullOrUndefined(iterable)) {
          adder = map.set;
          if (!ES.IsCallable(adder)) { throw new TypeError('bad map'); }
          iter = ES.GetIterator(iterable);
        }
        if (typeof iter !== 'undefined') {
          while (true) {
            var next = ES.IteratorStep(iter);
            if (next === false) { break; }
            var nextItem = next.value;
            try {
              if (!ES.TypeIsObject(nextItem)) {
                throw new TypeError('Iterator value ' + nextItem + ' is not an entry object');
              }
              _call(adder, map, nextItem[0], nextItem[1]);
            } catch (e) {
              ES.IteratorClose(iter, true);
              throw e;
            }
          }
        }
      }
    };
    var addIterableToSet = function addIterableToSet(SetConstructor, set, iterable) {
      if (isArray(iterable) || Type.string(iterable)) {
        _forEach(iterable, function (value) {
          set.add(value);
        });
      } else if (iterable instanceof SetConstructor) {
        _call(SetConstructor.prototype.forEach, iterable, function (value) {
          set.add(value);
        });
      } else {
        var iter, adder;
        if (!isNullOrUndefined(iterable)) {
          adder = set.add;
          if (!ES.IsCallable(adder)) { throw new TypeError('bad set'); }
          iter = ES.GetIterator(iterable);
        }
        if (typeof iter !== 'undefined') {
          while (true) {
            var next = ES.IteratorStep(iter);
            if (next === false) { break; }
            var nextValue = next.value;
            try {
              _call(adder, set, nextValue);
            } catch (e) {
              ES.IteratorClose(iter, true);
              throw e;
            }
          }
        }
      }
    };

    var collectionShims = {
      Map: (function () {

        var empty = {};

        var MapEntry = function MapEntry(key, value) {
          this.key = key;
          this.value = value;
          this.next = null;
          this.prev = null;
        };

        MapEntry.prototype.isRemoved = function isRemoved() {
          return this.key === empty;
        };

        var isMap = function isMap(map) {
          return !!map._es6map;
        };

        var requireMapSlot = function requireMapSlot(map, method) {
          if (!ES.TypeIsObject(map) || !isMap(map)) {
            throw new TypeError('Method Map.prototype.' + method + ' called on incompatible receiver ' + ES.ToString(map));
          }
        };

        var MapIterator = function MapIterator(map, kind) {
          requireMapSlot(map, '[[MapIterator]]');
          this.head = map._head;
          this.i = this.head;
          this.kind = kind;
        };

        MapIterator.prototype = {
          next: function next() {
            var i = this.i;
            var kind = this.kind;
            var head = this.head;
            if (typeof this.i === 'undefined') {
              return iteratorResult();
            }
            while (i.isRemoved() && i !== head) {
              // back up off of removed entries
              i = i.prev;
            }
            // advance to next unreturned element.
            var result;
            while (i.next !== head) {
              i = i.next;
              if (!i.isRemoved()) {
                if (kind === 'key') {
                  result = i.key;
                } else if (kind === 'value') {
                  result = i.value;
                } else {
                  result = [i.key, i.value];
                }
                this.i = i;
                return iteratorResult(result);
              }
            }
            // once the iterator is done, it is done forever.
            this.i = void 0;
            return iteratorResult();
          }
        };
        addIterator(MapIterator.prototype);

        var Map$prototype;
        var MapShim = function Map() {
          if (!(this instanceof Map)) {
            throw new TypeError('Constructor Map requires "new"');
          }
          if (this && this._es6map) {
            throw new TypeError('Bad construction');
          }
          var map = emulateES6construct(this, Map, Map$prototype, {
            _es6map: true,
            _head: null,
            _map: OrigMap ? new OrigMap() : null,
            _size: 0,
            _storage: emptyObject()
          });

          var head = new MapEntry(null, null);
          // circular doubly-linked list.
          /* eslint no-multi-assign: 1 */
          head.next = head.prev = head;
          map._head = head;

          // Optionally initialize map from iterable
          if (arguments.length > 0) {
            addIterableToMap(Map, map, arguments[0]);
          }
          return map;
        };
        Map$prototype = MapShim.prototype;

        Value.getter(Map$prototype, 'size', function () {
          if (typeof this._size === 'undefined') {
            throw new TypeError('size method called on incompatible Map');
          }
          return this._size;
        });

        defineProperties(Map$prototype, {
          get: function get(key) {
            requireMapSlot(this, 'get');
            var entry;
            var fkey = fastkey(key, true);
            if (fkey !== null) {
              // fast O(1) path
              entry = this._storage[fkey];
              if (entry) {
                return entry.value;
              } else {
                return;
              }
            }
            if (this._map) {
              // fast object key path
              entry = origMapGet.call(this._map, key);
              if (entry) {
                return entry.value;
              } else {
                return;
              }
            }
            var head = this._head;
            var i = head;
            while ((i = i.next) !== head) {
              if (ES.SameValueZero(i.key, key)) {
                return i.value;
              }
            }
          },

          has: function has(key) {
            requireMapSlot(this, 'has');
            var fkey = fastkey(key, true);
            if (fkey !== null) {
              // fast O(1) path
              return typeof this._storage[fkey] !== 'undefined';
            }
            if (this._map) {
              // fast object key path
              return origMapHas.call(this._map, key);
            }
            var head = this._head;
            var i = head;
            while ((i = i.next) !== head) {
              if (ES.SameValueZero(i.key, key)) {
                return true;
              }
            }
            return false;
          },

          set: function set(key, value) {
            requireMapSlot(this, 'set');
            var head = this._head;
            var i = head;
            var entry;
            var fkey = fastkey(key, true);
            if (fkey !== null) {
              // fast O(1) path
              if (typeof this._storage[fkey] !== 'undefined') {
                this._storage[fkey].value = value;
                return this;
              } else {
                entry = this._storage[fkey] = new MapEntry(key, value); /* eslint no-multi-assign: 1 */
                i = head.prev;
                // fall through
              }
            } else if (this._map) {
              // fast object key path
              if (origMapHas.call(this._map, key)) {
                origMapGet.call(this._map, key).value = value;
              } else {
                entry = new MapEntry(key, value);
                origMapSet.call(this._map, key, entry);
                i = head.prev;
                // fall through
              }
            }
            while ((i = i.next) !== head) {
              if (ES.SameValueZero(i.key, key)) {
                i.value = value;
                return this;
              }
            }
            entry = entry || new MapEntry(key, value);
            if (ES.SameValue(-0, key)) {
              entry.key = +0; // coerce -0 to +0 in entry
            }
            entry.next = this._head;
            entry.prev = this._head.prev;
            entry.prev.next = entry;
            entry.next.prev = entry;
            this._size += 1;
            return this;
          },

          'delete': function (key) {
            requireMapSlot(this, 'delete');
            var head = this._head;
            var i = head;
            var fkey = fastkey(key, true);
            if (fkey !== null) {
              // fast O(1) path
              if (typeof this._storage[fkey] === 'undefined') {
                return false;
              }
              i = this._storage[fkey].prev;
              delete this._storage[fkey];
              // fall through
            } else if (this._map) {
              // fast object key path
              if (!origMapHas.call(this._map, key)) {
                return false;
              }
              i = origMapGet.call(this._map, key).prev;
              origMapDelete.call(this._map, key);
              // fall through
            }
            while ((i = i.next) !== head) {
              if (ES.SameValueZero(i.key, key)) {
                i.key = empty;
                i.value = empty;
                i.prev.next = i.next;
                i.next.prev = i.prev;
                this._size -= 1;
                return true;
              }
            }
            return false;
          },

          clear: function clear() {
             /* eslint no-multi-assign: 1 */
            requireMapSlot(this, 'clear');
            this._map = OrigMap ? new OrigMap() : null;
            this._size = 0;
            this._storage = emptyObject();
            var head = this._head;
            var i = head;
            var p = i.next;
            while ((i = p) !== head) {
              i.key = empty;
              i.value = empty;
              p = i.next;
              i.next = i.prev = head;
            }
            head.next = head.prev = head;
          },

          keys: function keys() {
            requireMapSlot(this, 'keys');
            return new MapIterator(this, 'key');
          },

          values: function values() {
            requireMapSlot(this, 'values');
            return new MapIterator(this, 'value');
          },

          entries: function entries() {
            requireMapSlot(this, 'entries');
            return new MapIterator(this, 'key+value');
          },

          forEach: function forEach(callback) {
            requireMapSlot(this, 'forEach');
            var context = arguments.length > 1 ? arguments[1] : null;
            var it = this.entries();
            for (var entry = it.next(); !entry.done; entry = it.next()) {
              if (context) {
                _call(callback, context, entry.value[1], entry.value[0], this);
              } else {
                callback(entry.value[1], entry.value[0], this);
              }
            }
          }
        });
        addIterator(Map$prototype, Map$prototype.entries);

        return MapShim;
      }()),

      Set: (function () {
        var isSet = function isSet(set) {
          return set._es6set && typeof set._storage !== 'undefined';
        };
        var requireSetSlot = function requireSetSlot(set, method) {
          if (!ES.TypeIsObject(set) || !isSet(set)) {
            // https://github.com/paulmillr/es6-shim/issues/176
            throw new TypeError('Set.prototype.' + method + ' called on incompatible receiver ' + ES.ToString(set));
          }
        };

        // Creating a Map is expensive.  To speed up the common case of
        // Sets containing only string or numeric keys, we use an object
        // as backing storage and lazily create a full Map only when
        // required.
        var Set$prototype;
        var SetShim = function Set() {
          if (!(this instanceof Set)) {
            throw new TypeError('Constructor Set requires "new"');
          }
          if (this && this._es6set) {
            throw new TypeError('Bad construction');
          }
          var set = emulateES6construct(this, Set, Set$prototype, {
            _es6set: true,
            '[[SetData]]': null,
            _storage: emptyObject()
          });
          if (!set._es6set) {
            throw new TypeError('bad set');
          }

          // Optionally initialize Set from iterable
          if (arguments.length > 0) {
            addIterableToSet(Set, set, arguments[0]);
          }
          return set;
        };
        Set$prototype = SetShim.prototype;

        var decodeKey = function (key) {
          var k = key;
          if (k === '^null') {
            return null;
          } else if (k === '^undefined') {
            return void 0;
          } else {
            var first = k.charAt(0);
            if (first === '$') {
              return _strSlice(k, 1);
            } else if (first === 'n') {
              return +_strSlice(k, 1);
            } else if (first === 'b') {
              return k === 'btrue';
            }
          }
          return +k;
        };
        // Switch from the object backing storage to a full Map.
        var ensureMap = function ensureMap(set) {
          if (!set['[[SetData]]']) {
            var m = new collectionShims.Map();
            set['[[SetData]]'] = m;
            _forEach(keys(set._storage), function (key) {
              var k = decodeKey(key);
              m.set(k, k);
            });
            set['[[SetData]]'] = m;
          }
          set._storage = null; // free old backing storage
        };

        Value.getter(SetShim.prototype, 'size', function () {
          requireSetSlot(this, 'size');
          if (this._storage) {
            return keys(this._storage).length;
          }
          ensureMap(this);
          return this['[[SetData]]'].size;
        });

        defineProperties(SetShim.prototype, {
          has: function has(key) {
            requireSetSlot(this, 'has');
            var fkey;
            if (this._storage && (fkey = fastkey(key)) !== null) {
              return !!this._storage[fkey];
            }
            ensureMap(this);
            return this['[[SetData]]'].has(key);
          },

          add: function add(key) {
            requireSetSlot(this, 'add');
            var fkey;
            if (this._storage && (fkey = fastkey(key)) !== null) {
              this._storage[fkey] = true;
              return this;
            }
            ensureMap(this);
            this['[[SetData]]'].set(key, key);
            return this;
          },

          'delete': function (key) {
            requireSetSlot(this, 'delete');
            var fkey;
            if (this._storage && (fkey = fastkey(key)) !== null) {
              var hasFKey = _hasOwnProperty(this._storage, fkey);
              return (delete this._storage[fkey]) && hasFKey;
            }
            ensureMap(this);
            return this['[[SetData]]']['delete'](key);
          },

          clear: function clear() {
            requireSetSlot(this, 'clear');
            if (this._storage) {
              this._storage = emptyObject();
            }
            if (this['[[SetData]]']) {
              this['[[SetData]]'].clear();
            }
          },

          values: function values() {
            requireSetSlot(this, 'values');
            ensureMap(this);
            return this['[[SetData]]'].values();
          },

          entries: function entries() {
            requireSetSlot(this, 'entries');
            ensureMap(this);
            return this['[[SetData]]'].entries();
          },

          forEach: function forEach(callback) {
            requireSetSlot(this, 'forEach');
            var context = arguments.length > 1 ? arguments[1] : null;
            var entireSet = this;
            ensureMap(entireSet);
            this['[[SetData]]'].forEach(function (value, key) {
              if (context) {
                _call(callback, context, key, key, entireSet);
              } else {
                callback(key, key, entireSet);
              }
            });
          }
        });
        defineProperty(SetShim.prototype, 'keys', SetShim.prototype.values, true);
        addIterator(SetShim.prototype, SetShim.prototype.values);

        return SetShim;
      }())
    };

    if (globals.Map || globals.Set) {
      // Safari 8, for example, doesn't accept an iterable.
      var mapAcceptsArguments = valueOrFalseIfThrows(function () { return new Map([[1, 2]]).get(1) === 2; });
      if (!mapAcceptsArguments) {
        globals.Map = function Map() {
          if (!(this instanceof Map)) {
            throw new TypeError('Constructor Map requires "new"');
          }
          var m = new OrigMap();
          if (arguments.length > 0) {
            addIterableToMap(Map, m, arguments[0]);
          }
          delete m.constructor;
          Object.setPrototypeOf(m, globals.Map.prototype);
          return m;
        };
        globals.Map.prototype = create(OrigMap.prototype);
        defineProperty(globals.Map.prototype, 'constructor', globals.Map, true);
        Value.preserveToString(globals.Map, OrigMap);
      }
      var testMap = new Map();
      var mapUsesSameValueZero = (function () {
        // Chrome 38-42, node 0.11/0.12, iojs 1/2 also have a bug when the Map has a size > 4
        var m = new Map([[1, 0], [2, 0], [3, 0], [4, 0]]);
        m.set(-0, m);
        return m.get(0) === m && m.get(-0) === m && m.has(0) && m.has(-0);
      }());
      var mapSupportsChaining = testMap.set(1, 2) === testMap;
      if (!mapUsesSameValueZero || !mapSupportsChaining) {
        overrideNative(Map.prototype, 'set', function set(k, v) {
          _call(origMapSet, this, k === 0 ? 0 : k, v);
          return this;
        });
      }
      if (!mapUsesSameValueZero) {
        defineProperties(Map.prototype, {
          get: function get(k) {
            return _call(origMapGet, this, k === 0 ? 0 : k);
          },
          has: function has(k) {
            return _call(origMapHas, this, k === 0 ? 0 : k);
          }
        }, true);
        Value.preserveToString(Map.prototype.get, origMapGet);
        Value.preserveToString(Map.prototype.has, origMapHas);
      }
      var testSet = new Set();
      var setUsesSameValueZero = (function (s) {
        s['delete'](0);
        s.add(-0);
        return !s.has(0);
      }(testSet));
      var setSupportsChaining = testSet.add(1) === testSet;
      if (!setUsesSameValueZero || !setSupportsChaining) {
        var origSetAdd = Set.prototype.add;
        Set.prototype.add = function add(v) {
          _call(origSetAdd, this, v === 0 ? 0 : v);
          return this;
        };
        Value.preserveToString(Set.prototype.add, origSetAdd);
      }
      if (!setUsesSameValueZero) {
        var origSetHas = Set.prototype.has;
        Set.prototype.has = function has(v) {
          return _call(origSetHas, this, v === 0 ? 0 : v);
        };
        Value.preserveToString(Set.prototype.has, origSetHas);
        var origSetDel = Set.prototype['delete'];
        Set.prototype['delete'] = function SetDelete(v) {
          return _call(origSetDel, this, v === 0 ? 0 : v);
        };
        Value.preserveToString(Set.prototype['delete'], origSetDel);
      }
      var mapSupportsSubclassing = supportsSubclassing(globals.Map, function (M) {
        var m = new M([]);
        // Firefox 32 is ok with the instantiating the subclass but will
        // throw when the map is used.
        m.set(42, 42);
        return m instanceof M;
      });
      // without Object.setPrototypeOf, subclassing is not possible
      var mapFailsToSupportSubclassing = Object.setPrototypeOf && !mapSupportsSubclassing;
      var mapRequiresNew = (function () {
        try {
          return !(globals.Map() instanceof globals.Map);
        } catch (e) {
          return e instanceof TypeError;
        }
      }());
      if (globals.Map.length !== 0 || mapFailsToSupportSubclassing || !mapRequiresNew) {
        globals.Map = function Map() {
          if (!(this instanceof Map)) {
            throw new TypeError('Constructor Map requires "new"');
          }
          var m = new OrigMap();
          if (arguments.length > 0) {
            addIterableToMap(Map, m, arguments[0]);
          }
          delete m.constructor;
          Object.setPrototypeOf(m, Map.prototype);
          return m;
        };
        globals.Map.prototype = OrigMap.prototype;
        defineProperty(globals.Map.prototype, 'constructor', globals.Map, true);
        Value.preserveToString(globals.Map, OrigMap);
      }
      var setSupportsSubclassing = supportsSubclassing(globals.Set, function (S) {
        var s = new S([]);
        s.add(42, 42);
        return s instanceof S;
      });
      // without Object.setPrototypeOf, subclassing is not possible
      var setFailsToSupportSubclassing = Object.setPrototypeOf && !setSupportsSubclassing;
      var setRequiresNew = (function () {
        try {
          return !(globals.Set() instanceof globals.Set);
        } catch (e) {
          return e instanceof TypeError;
        }
      }());
      if (globals.Set.length !== 0 || setFailsToSupportSubclassing || !setRequiresNew) {
        var OrigSet = globals.Set;
        globals.Set = function Set() {
          if (!(this instanceof Set)) {
            throw new TypeError('Constructor Set requires "new"');
          }
          var s = new OrigSet();
          if (arguments.length > 0) {
            addIterableToSet(Set, s, arguments[0]);
          }
          delete s.constructor;
          Object.setPrototypeOf(s, Set.prototype);
          return s;
        };
        globals.Set.prototype = OrigSet.prototype;
        defineProperty(globals.Set.prototype, 'constructor', globals.Set, true);
        Value.preserveToString(globals.Set, OrigSet);
      }
      var newMap = new globals.Map();
      var mapIterationThrowsStopIterator = !valueOrFalseIfThrows(function () {
        return newMap.keys().next().done;
      });
      /*
        - In Firefox < 23, Map#size is a function.
        - In all current Firefox, Set#entries/keys/values & Map#clear do not exist
        - https://bugzilla.mozilla.org/show_bug.cgi?id=869996
        - In Firefox 24, Map and Set do not implement forEach
        - In Firefox 25 at least, Map and Set are callable without "new"
      */
      if (
        typeof globals.Map.prototype.clear !== 'function' ||
        new globals.Set().size !== 0 ||
        newMap.size !== 0 ||
        typeof globals.Map.prototype.keys !== 'function' ||
        typeof globals.Set.prototype.keys !== 'function' ||
        typeof globals.Map.prototype.forEach !== 'function' ||
        typeof globals.Set.prototype.forEach !== 'function' ||
        isCallableWithoutNew(globals.Map) ||
        isCallableWithoutNew(globals.Set) ||
        typeof newMap.keys().next !== 'function' || // Safari 8
        mapIterationThrowsStopIterator || // Firefox 25
        !mapSupportsSubclassing
      ) {
        defineProperties(globals, {
          Map: collectionShims.Map,
          Set: collectionShims.Set
        }, true);
      }

      if (globals.Set.prototype.keys !== globals.Set.prototype.values) {
        // Fixed in WebKit with https://bugs.webkit.org/show_bug.cgi?id=144190
        defineProperty(globals.Set.prototype, 'keys', globals.Set.prototype.values, true);
      }

      // Shim incomplete iterator implementations.
      addIterator(Object.getPrototypeOf((new globals.Map()).keys()));
      addIterator(Object.getPrototypeOf((new globals.Set()).keys()));

      if (functionsHaveNames && globals.Set.prototype.has.name !== 'has') {
        // Microsoft Edge v0.11.10074.0 is missing a name on Set#has
        var anonymousSetHas = globals.Set.prototype.has;
        overrideNative(globals.Set.prototype, 'has', function has(key) {
          return _call(anonymousSetHas, this, key);
        });
      }
    }
    defineProperties(globals, collectionShims);
    addDefaultSpecies(globals.Map);
    addDefaultSpecies(globals.Set);
  }

  var throwUnlessTargetIsObject = function throwUnlessTargetIsObject(target) {
    if (!ES.TypeIsObject(target)) {
      throw new TypeError('target must be an object');
    }
  };

  // Some Reflect methods are basically the same as
  // those on the Object global, except that a TypeError is thrown if
  // target isn't an object. As well as returning a boolean indicating
  // the success of the operation.
  var ReflectShims = {
    // Apply method in a functional form.
    apply: function apply() {
      return ES.Call(ES.Call, null, arguments);
    },

    // New operator in a functional form.
    construct: function construct(constructor, args) {
      if (!ES.IsConstructor(constructor)) {
        throw new TypeError('First argument must be a constructor.');
      }
      var newTarget = arguments.length > 2 ? arguments[2] : constructor;
      if (!ES.IsConstructor(newTarget)) {
        throw new TypeError('new.target must be a constructor.');
      }
      return ES.Construct(constructor, args, newTarget, 'internal');
    },

    // When deleting a non-existent or configurable property,
    // true is returned.
    // When attempting to delete a non-configurable property,
    // it will return false.
    deleteProperty: function deleteProperty(target, key) {
      throwUnlessTargetIsObject(target);
      if (supportsDescriptors) {
        var desc = Object.getOwnPropertyDescriptor(target, key);

        if (desc && !desc.configurable) {
          return false;
        }
      }

      // Will return true.
      return delete target[key];
    },

    has: function has(target, key) {
      throwUnlessTargetIsObject(target);
      return key in target;
    }
  };

  if (Object.getOwnPropertyNames) {
    Object.assign(ReflectShims, {
      // Basically the result of calling the internal [[OwnPropertyKeys]].
      // Concatenating propertyNames and propertySymbols should do the trick.
      // This should continue to work together with a Symbol shim
      // which overrides Object.getOwnPropertyNames and implements
      // Object.getOwnPropertySymbols.
      ownKeys: function ownKeys(target) {
        throwUnlessTargetIsObject(target);
        var keys = Object.getOwnPropertyNames(target);

        if (ES.IsCallable(Object.getOwnPropertySymbols)) {
          _pushApply(keys, Object.getOwnPropertySymbols(target));
        }

        return keys;
      }
    });
  }

  var callAndCatchException = function ConvertExceptionToBoolean(func) {
    return !throwsError(func);
  };

  if (Object.preventExtensions) {
    Object.assign(ReflectShims, {
      isExtensible: function isExtensible(target) {
        throwUnlessTargetIsObject(target);
        return Object.isExtensible(target);
      },
      preventExtensions: function preventExtensions(target) {
        throwUnlessTargetIsObject(target);
        return callAndCatchException(function () {
          Object.preventExtensions(target);
        });
      }
    });
  }

  if (supportsDescriptors) {
    var internalGet = function get(target, key, receiver) {
      var desc = Object.getOwnPropertyDescriptor(target, key);

      if (!desc) {
        var parent = Object.getPrototypeOf(target);

        if (parent === null) {
          return void 0;
        }

        return internalGet(parent, key, receiver);
      }

      if ('value' in desc) {
        return desc.value;
      }

      if (desc.get) {
        return ES.Call(desc.get, receiver);
      }

      return void 0;
    };

    var internalSet = function set(target, key, value, receiver) {
      var desc = Object.getOwnPropertyDescriptor(target, key);

      if (!desc) {
        var parent = Object.getPrototypeOf(target);

        if (parent !== null) {
          return internalSet(parent, key, value, receiver);
        }

        desc = {
          value: void 0,
          writable: true,
          enumerable: true,
          configurable: true
        };
      }

      if ('value' in desc) {
        if (!desc.writable) {
          return false;
        }

        if (!ES.TypeIsObject(receiver)) {
          return false;
        }

        var existingDesc = Object.getOwnPropertyDescriptor(receiver, key);

        if (existingDesc) {
          return Reflect.defineProperty(receiver, key, {
            value: value
          });
        } else {
          return Reflect.defineProperty(receiver, key, {
            value: value,
            writable: true,
            enumerable: true,
            configurable: true
          });
        }
      }

      if (desc.set) {
        _call(desc.set, receiver, value);
        return true;
      }

      return false;
    };

    Object.assign(ReflectShims, {
      defineProperty: function defineProperty(target, propertyKey, attributes) {
        throwUnlessTargetIsObject(target);
        return callAndCatchException(function () {
          Object.defineProperty(target, propertyKey, attributes);
        });
      },

      getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey) {
        throwUnlessTargetIsObject(target);
        return Object.getOwnPropertyDescriptor(target, propertyKey);
      },

      // Syntax in a functional form.
      get: function get(target, key) {
        throwUnlessTargetIsObject(target);
        var receiver = arguments.length > 2 ? arguments[2] : target;

        return internalGet(target, key, receiver);
      },

      set: function set(target, key, value) {
        throwUnlessTargetIsObject(target);
        var receiver = arguments.length > 3 ? arguments[3] : target;

        return internalSet(target, key, value, receiver);
      }
    });
  }

  if (Object.getPrototypeOf) {
    var objectDotGetPrototypeOf = Object.getPrototypeOf;
    ReflectShims.getPrototypeOf = function getPrototypeOf(target) {
      throwUnlessTargetIsObject(target);
      return objectDotGetPrototypeOf(target);
    };
  }

  if (Object.setPrototypeOf && ReflectShims.getPrototypeOf) {
    var willCreateCircularPrototype = function (object, lastProto) {
      var proto = lastProto;
      while (proto) {
        if (object === proto) {
          return true;
        }
        proto = ReflectShims.getPrototypeOf(proto);
      }
      return false;
    };

    Object.assign(ReflectShims, {
      // Sets the prototype of the given object.
      // Returns true on success, otherwise false.
      setPrototypeOf: function setPrototypeOf(object, proto) {
        throwUnlessTargetIsObject(object);
        if (proto !== null && !ES.TypeIsObject(proto)) {
          throw new TypeError('proto must be an object or null');
        }

        // If they already are the same, we're done.
        if (proto === Reflect.getPrototypeOf(object)) {
          return true;
        }

        // Cannot alter prototype if object not extensible.
        if (Reflect.isExtensible && !Reflect.isExtensible(object)) {
          return false;
        }

        // Ensure that we do not create a circular prototype chain.
        if (willCreateCircularPrototype(object, proto)) {
          return false;
        }

        Object.setPrototypeOf(object, proto);

        return true;
      }
    });
  }
  var defineOrOverrideReflectProperty = function (key, shim) {
    if (!ES.IsCallable(globals.Reflect[key])) {
      defineProperty(globals.Reflect, key, shim);
    } else {
      var acceptsPrimitives = valueOrFalseIfThrows(function () {
        globals.Reflect[key](1);
        globals.Reflect[key](NaN);
        globals.Reflect[key](true);
        return true;
      });
      if (acceptsPrimitives) {
        overrideNative(globals.Reflect, key, shim);
      }
    }
  };
  Object.keys(ReflectShims).forEach(function (key) {
    defineOrOverrideReflectProperty(key, ReflectShims[key]);
  });
  var originalReflectGetProto = globals.Reflect.getPrototypeOf;
  if (functionsHaveNames && originalReflectGetProto && originalReflectGetProto.name !== 'getPrototypeOf') {
    overrideNative(globals.Reflect, 'getPrototypeOf', function getPrototypeOf(target) {
      return _call(originalReflectGetProto, globals.Reflect, target);
    });
  }
  if (globals.Reflect.setPrototypeOf) {
    if (valueOrFalseIfThrows(function () {
      globals.Reflect.setPrototypeOf(1, {});
      return true;
    })) {
      overrideNative(globals.Reflect, 'setPrototypeOf', ReflectShims.setPrototypeOf);
    }
  }
  if (globals.Reflect.defineProperty) {
    if (!valueOrFalseIfThrows(function () {
      var basic = !globals.Reflect.defineProperty(1, 'test', { value: 1 });
      // "extensible" fails on Edge 0.12
      var extensible = typeof Object.preventExtensions !== 'function' || !globals.Reflect.defineProperty(Object.preventExtensions({}), 'test', {});
      return basic && extensible;
    })) {
      overrideNative(globals.Reflect, 'defineProperty', ReflectShims.defineProperty);
    }
  }
  if (globals.Reflect.construct) {
    if (!valueOrFalseIfThrows(function () {
      var F = function F() {};
      return globals.Reflect.construct(function () {}, [], F) instanceof F;
    })) {
      overrideNative(globals.Reflect, 'construct', ReflectShims.construct);
    }
  }

  if (String(new Date(NaN)) !== 'Invalid Date') {
    var dateToString = Date.prototype.toString;
    var shimmedDateToString = function toString() {
      var valueOf = +this;
      if (valueOf !== valueOf) {
        return 'Invalid Date';
      }
      return ES.Call(dateToString, this);
    };
    overrideNative(Date.prototype, 'toString', shimmedDateToString);
  }

  // Annex B HTML methods
  // http://www.ecma-international.org/ecma-262/6.0/#sec-additional-properties-of-the-string.prototype-object
  var stringHTMLshims = {
    anchor: function anchor(name) { return ES.CreateHTML(this, 'a', 'name', name); },
    big: function big() { return ES.CreateHTML(this, 'big', '', ''); },
    blink: function blink() { return ES.CreateHTML(this, 'blink', '', ''); },
    bold: function bold() { return ES.CreateHTML(this, 'b', '', ''); },
    fixed: function fixed() { return ES.CreateHTML(this, 'tt', '', ''); },
    fontcolor: function fontcolor(color) { return ES.CreateHTML(this, 'font', 'color', color); },
    fontsize: function fontsize(size) { return ES.CreateHTML(this, 'font', 'size', size); },
    italics: function italics() { return ES.CreateHTML(this, 'i', '', ''); },
    link: function link(url) { return ES.CreateHTML(this, 'a', 'href', url); },
    small: function small() { return ES.CreateHTML(this, 'small', '', ''); },
    strike: function strike() { return ES.CreateHTML(this, 'strike', '', ''); },
    sub: function sub() { return ES.CreateHTML(this, 'sub', '', ''); },
    sup: function sub() { return ES.CreateHTML(this, 'sup', '', ''); }
  };
  _forEach(Object.keys(stringHTMLshims), function (key) {
    var method = String.prototype[key];
    var shouldOverwrite = false;
    if (ES.IsCallable(method)) {
      var output = _call(method, '', ' " ');
      var quotesCount = _concat([], output.match(/"/g)).length;
      shouldOverwrite = output !== output.toLowerCase() || quotesCount > 2;
    } else {
      shouldOverwrite = true;
    }
    if (shouldOverwrite) {
      overrideNative(String.prototype, key, stringHTMLshims[key]);
    }
  });

  var JSONstringifiesSymbols = (function () {
    // Microsoft Edge v0.12 stringifies Symbols incorrectly
    if (!hasSymbols) { return false; } // Symbols are not supported
    var stringify = typeof JSON === 'object' && typeof JSON.stringify === 'function' ? JSON.stringify : null;
    if (!stringify) { return false; } // JSON.stringify is not supported
    if (typeof stringify(Symbol()) !== 'undefined') { return true; } // Symbols should become `undefined`
    if (stringify([Symbol()]) !== '[null]') { return true; } // Symbols in arrays should become `null`
    var obj = { a: Symbol() };
    obj[Symbol()] = true;
    if (stringify(obj) !== '{}') { return true; } // Symbol-valued keys *and* Symbol-valued properties should be omitted
    return false;
  }());
  var JSONstringifyAcceptsObjectSymbol = valueOrFalseIfThrows(function () {
    // Chrome 45 throws on stringifying object symbols
    if (!hasSymbols) { return true; } // Symbols are not supported
    return JSON.stringify(Object(Symbol())) === '{}' && JSON.stringify([Object(Symbol())]) === '[{}]';
  });
  if (JSONstringifiesSymbols || !JSONstringifyAcceptsObjectSymbol) {
    var origStringify = JSON.stringify;
    overrideNative(JSON, 'stringify', function stringify(value) {
      if (typeof value === 'symbol') { return; }
      var replacer;
      if (arguments.length > 1) {
        replacer = arguments[1];
      }
      var args = [value];
      if (!isArray(replacer)) {
        var replaceFn = ES.IsCallable(replacer) ? replacer : null;
        var wrappedReplacer = function (key, val) {
          var parsedValue = replaceFn ? _call(replaceFn, this, key, val) : val;
          if (typeof parsedValue !== 'symbol') {
            if (Type.symbol(parsedValue)) {
              return assignTo({})(parsedValue);
            } else {
              return parsedValue;
            }
          }
        };
        args.push(wrappedReplacer);
      } else {
        // create wrapped replacer that handles an array replacer?
        args.push(replacer);
      }
      if (arguments.length > 2) {
        args.push(arguments[2]);
      }
      return origStringify.apply(this, args);
    });
  }

  return globals;
}));

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":63}],39:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],40:[function(require,module,exports){
(function (Buffer,process){
var Emitter = require("events").EventEmitter;

function Mock(path) {
  this.isClosed = false;
}

Mock.prototype = Object.create(Emitter.prototype, {
  constructor: {
    value: Mock
  }
});

Mock.prototype.write = function (buffer) {
  // Tests are written to work with arrays not buffers
  // this shouldn"t impact the data, just the container
  // This also should be changed in future test rewrites
  if (Buffer.isBuffer(buffer)) {
    buffer = Array.prototype.slice.call(buffer, 0);
  }

  this.lastWrite = buffer;
  this.emit("write", buffer);
};

/* istanbul ignore next */
Mock.prototype.close = function () {
  this.isClosed = true;
};

var com;
var sp;
var stub = {
  SerialPort: Mock,
  list: function() {},
};

try {
  /* istanbul ignore if */
  if (process.browser || parseFloat(process.versions.nw) >= 0.13) {
    com = require("browser-serialport");
  } else {
    /* istanbul ignore else */
    if (process.env.IS_TEST_MODE) {
      com = stub;
    } else {
      sp = require("serialport");
      com = {
        SerialPort: sp,
        list: sp.list,
      };
    }
  }
} catch (err) {}


/* istanbul ignore if */
if (com == null) {
  if (process.env.IS_TEST_MODE) {
    com = stub;
  } else {
    console.log("It looks like serialport didn't compile properly. This is a common problem and its fix is well documented here https://github.com/voodootikigod/node-serialport#to-install");
    console.log("The result of requiring the package is: ", sp);
    throw "Missing serialport dependency";
  }
}

module.exports = com;

}).call(this,{"isBuffer":require("../../is-buffer/index.js")},require('_process'))
},{"../../is-buffer/index.js":50,"_process":63,"browser-serialport":5,"events":39,"serialport":77}],41:[function(require,module,exports){
/**
 * "Inspired" by Encoder7Bit.h/Encoder7Bit.cpp in the
 * Firmata source code.
 */
module.exports = {
  to7BitArray: function(data) {
    var shift = 0;
    var previous = 0;
    var output = [];

    data.forEach(function(byte) {
      if (shift === 0) {
        output.push(byte & 0x7f);
        shift++;
        previous = byte >> 7;
      } else {
        output.push(((byte << shift) & 0x7f) | previous);
        if (shift === 6) {
          output.push(byte >> 1);
          shift = 0;
        } else {
          shift++;
          previous = byte >> (8 - shift);
        }
      }
    });

    if (shift > 0) {
      output.push(previous);
    }

    return output;
  },
  from7BitArray: function(encoded) {
    var expectedBytes = (encoded.length) * 7 >> 3;
    var decoded = [];

    for (var i = 0; i < expectedBytes; i++) {
      var j = i << 3;
      var pos = parseInt(j / 7, 10);
      var shift = j % 7;
      decoded[i] = (encoded[pos] >> shift) | ((encoded[pos + 1] << (7 - shift)) & 0xFF);
    }

    return decoded;
  }
};

},{}],42:[function(require,module,exports){
(function (process,Buffer){
// Global Environment Dependencies
/* istanbul ignore if */
/* jshint -W079 */
if (!Object.assign || !Map) {
  require("es6-shim");
}

// Built-in Dependencies
var Emitter = require("events").EventEmitter;

// Internal Dependencies
var Encoder7Bit = require("./encoder7bit");
var OneWireUtils = require("./onewireutils");
var com = require("./com");

// Program specifics
var i2cActive = new Map();

/**
 * constants
 */

var ANALOG_MAPPING_QUERY = 0x69;
var ANALOG_MAPPING_RESPONSE = 0x6A;
var ANALOG_MESSAGE = 0xE0;
var CAPABILITY_QUERY = 0x6B;
var CAPABILITY_RESPONSE = 0x6C;
var DIGITAL_MESSAGE = 0x90;
var END_SYSEX = 0xF7;
var EXTENDED_ANALOG = 0x6F;
var I2C_CONFIG = 0x78;
var I2C_REPLY = 0x77;
var I2C_REQUEST = 0x76;
var I2C_READ_MASK = 0x18;   // 0b00011000
var I2C_END_TX_MASK = 0x40; // 0b01000000
var ONEWIRE_CONFIG_REQUEST = 0x41;
var ONEWIRE_DATA = 0x73;
var ONEWIRE_DELAY_REQUEST_BIT = 0x10;
var ONEWIRE_READ_REPLY = 0x43;
var ONEWIRE_READ_REQUEST_BIT = 0x08;
var ONEWIRE_RESET_REQUEST_BIT = 0x01;
var ONEWIRE_SEARCH_ALARMS_REPLY = 0x45;
var ONEWIRE_SEARCH_ALARMS_REQUEST = 0x44;
var ONEWIRE_SEARCH_REPLY = 0x42;
var ONEWIRE_SEARCH_REQUEST = 0x40;
var ONEWIRE_WITHDATA_REQUEST_BITS = 0x3C;
var ONEWIRE_WRITE_REQUEST_BIT = 0x20;
var PIN_MODE = 0xF4;
var PIN_STATE_QUERY = 0x6D;
var PIN_STATE_RESPONSE = 0x6E;
var PING_READ = 0x75;
var PULSE_IN = 0x74;
var PULSE_OUT = 0x73;
var QUERY_FIRMWARE = 0x79;
var REPORT_ANALOG = 0xC0;
var REPORT_DIGITAL = 0xD0;
var REPORT_VERSION = 0xF9;
var SAMPLING_INTERVAL = 0x7A;
var SERVO_CONFIG = 0x70;
var SERIAL_MESSAGE = 0x60;
var SERIAL_CONFIG = 0x10;
var SERIAL_WRITE = 0x20;
var SERIAL_READ = 0x30;
var SERIAL_REPLY = 0x40;
var SERIAL_CLOSE = 0x50;
var SERIAL_FLUSH = 0x60;
var SERIAL_LISTEN = 0x70;
var START_SYSEX = 0xF0;
var STEPPER = 0x72;
var STRING_DATA = 0x71;
var SYSTEM_RESET = 0xFF;

var MAX_PIN_COUNT = 128;

/**
 * MIDI_RESPONSE contains functions to be called when we receive a MIDI message from the arduino.
 * used as a switch object as seen here http://james.padolsey.com/javascript/how-to-avoid-switch-case-syndrome/
 * @private
 */

var MIDI_RESPONSE = {};

/**
 * Handles a REPORT_VERSION response and emits the reportversion event.
 * @private
 * @param {Board} board the current arduino board we are working with.
 */

MIDI_RESPONSE[REPORT_VERSION] = function(board) {
  board.version.major = board.currentBuffer[1];
  board.version.minor = board.currentBuffer[2];
  board.emit("reportversion");
};

/**
 * Handles a ANALOG_MESSAGE response and emits "analog-read" and "analog-read-"+n events where n is the pin number.
 * @private
 * @param {Board} board the current arduino board we are working with.
 */

MIDI_RESPONSE[ANALOG_MESSAGE] = function(board) {
  var pin = board.currentBuffer[0] & 0x0F;
  var value = board.currentBuffer[1] | (board.currentBuffer[2] << 7);

  /* istanbul ignore else */
  if (board.pins[board.analogPins[pin]]) {
    board.pins[board.analogPins[pin]].value = value;
  }

  board.emit("analog-read-" + pin, value);
  board.emit("analog-read", {
    pin: pin,
    value: value,
  });
};

/**
 * Handles a DIGITAL_MESSAGE response and emits:
 * "digital-read"
 * "digital-read-"+n
 *
 * Where n is the pin number.
 *
 * @private
 * @param {Board} board the current arduino board we are working with.
 */

MIDI_RESPONSE[DIGITAL_MESSAGE] = function(board) {
  var port = (board.currentBuffer[0] & 0x0F);
  var portValue = board.currentBuffer[1] | (board.currentBuffer[2] << 7);

  for (var i = 0; i < 8; i++) {
    var pinNumber = 8 * port + i;
    var pin = board.pins[pinNumber];
    var bit = 1 << i;

    if (pin && (pin.mode === board.MODES.INPUT || pin.mode === board.MODES.PULLUP)) {
      pin.value = (portValue >> (i & 0x07)) & 0x01;

      if (pin.value) {
        board.ports[port] |= bit;
      } else {
        board.ports[port] &= ~bit;
      }

      board.emit("digital-read-" + pinNumber, pin.value);
      board.emit("digital-read", {
        pin: pinNumber,
        value: pin.value,
      });
    }
  }
};

/**
 * SYSEX_RESPONSE contains functions to be called when we receive a SYSEX message from the arduino.
 * used as a switch object as seen here http://james.padolsey.com/javascript/how-to-avoid-switch-case-syndrome/
 * @private
 */

var SYSEX_RESPONSE = {};

/**
 * Handles a QUERY_FIRMWARE response and emits the "queryfirmware" event
 * @private
 * @param {Board} board the current arduino board we are working with.
 */

SYSEX_RESPONSE[QUERY_FIRMWARE] = function(board) {
  var length = board.currentBuffer.length - 2;
  var buffer = new Buffer(Math.round((length - 4) / 2));
  var byte = 0;
  var offset = 0;

  for (var i = 4; i < length; i += 2) {
    byte = ((board.currentBuffer[i] & 0x7F) | ((board.currentBuffer[i + 1] & 0x7F) << 7)) & 0xFF;
    buffer.writeUInt8(byte, offset++);
  }

  board.firmware = {
    name: buffer.toString(),
    version: {
      major: board.currentBuffer[2],
      minor: board.currentBuffer[3],
    },
  };

  board.emit("queryfirmware");
};

/**
 * Handles a CAPABILITY_RESPONSE response and emits the "capability-query" event
 * @private
 * @param {Board} board the current arduino board we are working with.
 */

SYSEX_RESPONSE[CAPABILITY_RESPONSE] = function(board) {
  var mode, resolution;
  var modes = Object.keys(board.MODES).map(function(key) {
    return board.MODES[key];
  });
  var capability = 0;

  function supportedModes(capability) {
    return modes.reduce(function(accum, mode, index) {
      if (capability & (1 << mode)) {
        accum.push(mode);
      }
      return accum;
    }, []);
  }

  // Only create pins if none have been previously created on the instance.
  if (!board.pins.length) {
    for (var i = 2, n = 0; i < board.currentBuffer.length - 1; i++) {
      if (board.currentBuffer[i] === 127) {
        board.pins.push({
          supportedModes: supportedModes(capability),
          mode: undefined,
          value: 0,
          report: 1,
        });
        capability = 0;
        n = 0;
        continue;
      }
      if (n === 0) {
        mode = board.currentBuffer[i];
        resolution = (1 << board.currentBuffer[i + 1]) - 1;
        capability |= (1 << mode);

        // ADC Resolution of Analog Inputs
        if (mode === board.MODES.ANALOG && board.RESOLUTION.ADC === null) {
          board.RESOLUTION.ADC = resolution;
        }

        // PWM Resolution of PWM Outputs
        if (mode === board.MODES.PWM && board.RESOLUTION.PWM === null) {
          board.RESOLUTION.PWM = resolution;
        }

        // DAC Resolution of DAC Outputs
        // if (mode === board.MODES.DAC && board.RESOLUTION.DAC === null) {
        //   board.RESOLUTION.DAC = resolution;
        // }
      }
      n ^= 1;
    }
  }

  board.emit("capability-query");
};

/**
 * Handles a PIN_STATE response and emits the 'pin-state-'+n event where n is the pin number.
 *
 * Note about pin state: For output modes, the state is any value that has been
 * previously written to the pin. For input modes, the state is the status of
 * the pullup resistor.
 * @private
 * @param {Board} board the current arduino board we are working with.
 */

SYSEX_RESPONSE[PIN_STATE_RESPONSE] = function (board) {
  var pin = board.currentBuffer[2];
  board.pins[pin].mode = board.currentBuffer[3];
  board.pins[pin].state = board.currentBuffer[4];
  if (board.currentBuffer.length > 6) {
    board.pins[pin].state |= (board.currentBuffer[5] << 7);
  }
  if (board.currentBuffer.length > 7) {
    board.pins[pin].state |= (board.currentBuffer[6] << 14);
  }
  board.emit("pin-state-" + pin);
};

/**
 * Handles a ANALOG_MAPPING_RESPONSE response and emits the "analog-mapping-query" event.
 * @private
 * @param {Board} board the current arduino board we are working with.
 */

SYSEX_RESPONSE[ANALOG_MAPPING_RESPONSE] = function(board) {
  var pin = 0;
  var currentValue;
  for (var i = 2; i < board.currentBuffer.length - 1; i++) {
    currentValue = board.currentBuffer[i];
    board.pins[pin].analogChannel = currentValue;
    if (currentValue !== 127) {
      board.analogPins.push(pin);
    }
    pin++;
  }
  board.emit("analog-mapping-query");
};

/**
 * Handles a I2C_REPLY response and emits the "I2C-reply-"+n event where n is the slave address of the I2C device.
 * The event is passed the buffer of data sent from the I2C Device
 * @private
 * @param {Board} board the current arduino board we are working with.
 */

SYSEX_RESPONSE[I2C_REPLY] = function(board) {
  var reply = [];
  var address = (board.currentBuffer[2] & 0x7F) | ((board.currentBuffer[3] & 0x7F) << 7);
  var register = (board.currentBuffer[4] & 0x7F) | ((board.currentBuffer[5] & 0x7F) << 7);

  for (var i = 6, length = board.currentBuffer.length - 1; i < length; i += 2) {
    reply.push(board.currentBuffer[i] | (board.currentBuffer[i + 1] << 7));
  }

  board.emit("I2C-reply-" + address + "-" + register, reply);
};

SYSEX_RESPONSE[ONEWIRE_DATA] = function(board) {
  var subCommand = board.currentBuffer[2];

  if (!SYSEX_RESPONSE[subCommand]) {
    return;
  }

  SYSEX_RESPONSE[subCommand](board);
};

SYSEX_RESPONSE[ONEWIRE_SEARCH_REPLY] = function(board) {
  var pin = board.currentBuffer[3];
  var replyBuffer = board.currentBuffer.slice(4, board.currentBuffer.length - 1);

  board.emit("1-wire-search-reply-" + pin, OneWireUtils.readDevices(replyBuffer));
};

SYSEX_RESPONSE[ONEWIRE_SEARCH_ALARMS_REPLY] = function(board) {
  var pin = board.currentBuffer[3];
  var replyBuffer = board.currentBuffer.slice(4, board.currentBuffer.length - 1);

  board.emit("1-wire-search-alarms-reply-" + pin, OneWireUtils.readDevices(replyBuffer));
};

SYSEX_RESPONSE[ONEWIRE_READ_REPLY] = function(board) {
  var encoded = board.currentBuffer.slice(4, board.currentBuffer.length - 1);
  var decoded = Encoder7Bit.from7BitArray(encoded);
  var correlationId = (decoded[1] << 8) | decoded[0];

  board.emit("1-wire-read-reply-" + correlationId, decoded.slice(2));
};

/**
 * Handles a STRING_DATA response and logs the string to the console.
 * @private
 * @param {Board} board the current arduino board we are working with.
 */

SYSEX_RESPONSE[STRING_DATA] = function(board) {
  var string = new Buffer(board.currentBuffer.slice(2, -1)).toString("utf8").replace(/\0/g, "");
  board.emit("string", string);
};

/**
 * Response from pingRead
 */

SYSEX_RESPONSE[PING_READ] = function(board) {
  var pin = (board.currentBuffer[2] & 0x7F) | ((board.currentBuffer[3] & 0x7F) << 7);
  var durationBuffer = [
    (board.currentBuffer[4] & 0x7F) | ((board.currentBuffer[5] & 0x7F) << 7),
    (board.currentBuffer[6] & 0x7F) | ((board.currentBuffer[7] & 0x7F) << 7),
    (board.currentBuffer[8] & 0x7F) | ((board.currentBuffer[9] & 0x7F) << 7),
    (board.currentBuffer[10] & 0x7F) | ((board.currentBuffer[11] & 0x7F) << 7),
  ];
  var duration = ((durationBuffer[0] << 24) +
    (durationBuffer[1] << 16) +
    (durationBuffer[2] << 8) +
    (durationBuffer[3]));
  board.emit("ping-read-" + pin, duration);
};

/**
 * Handles the message from a stepper completing move
 * @param {Board} board
 */

SYSEX_RESPONSE[STEPPER] = function(board) {
  var deviceNum = board.currentBuffer[2];
  board.emit("stepper-done-" + deviceNum, true);
};

/**
 * Handles a SERIAL_REPLY response and emits the "serial-data-"+n event where n is the id of the
 * serial port.
 * The event is passed the buffer of data sent from the serial device
 * @private
 * @param {Board} board the current arduino board we are working with.
 */

SYSEX_RESPONSE[SERIAL_MESSAGE] = function(board) {
  var command = board.currentBuffer[2] & 0xF0;
  var portId = board.currentBuffer[2] & 0x0F;
  var reply = [];

  /* istanbul ignore else */
  if (command === SERIAL_REPLY) {
    for (var i = 3, len = board.currentBuffer.length; i < len - 1; i += 2) {
      reply.push((board.currentBuffer[i + 1] << 7) | board.currentBuffer[i]);
    }
    board.emit("serial-data-" + portId, reply);
  }
};

/**
 * @class The Board object represents an arduino board.
 * @augments EventEmitter
 * @param {String} port This is the serial port the arduino is connected to.
 * @param {function} function A function to be called when the arduino is ready to communicate.
 * @property MODES All the modes available for pins on this arduino board.
 * @property I2C_MODES All the I2C modes available.
 * @property SERIAL_MODES All the Serial modes available.
 * @property SERIAL_PORT_ID ID values to pass as the portId parameter when calling serialConfig.
 * @property HIGH A constant to set a pins value to HIGH when the pin is set to an output.
 * @property LOW A constant to set a pins value to LOW when the pin is set to an output.
 * @property pins An array of pin object literals.
 * @property analogPins An array of analog pins and their corresponding indexes in the pins array.
 * @property version An object indicating the major and minor version of the firmware currently running.
 * @property firmware An object indicateon the name, major and minor version of the firmware currently running.
 * @property currentBuffer An array holding the current bytes received from the arduino.
 * @property {SerialPort} sp The serial port object used to communicate with the arduino.
 */

function Board(port, options, callback) {
  if (typeof options === "function" || typeof options === "undefined") {
    callback = options;
    options = {};
  }

  if (!(this instanceof Board)) {
    return new Board(port, options, callback);
  }

  Emitter.call(this);

  var board = this;
  var defaults = {
    reportVersionTimeout: 5000,
    samplingInterval: 19,
    serialport: {
      baudRate: 57600,
      bufferSize: 256,
    },
  };

  var settings = Object.assign({}, defaults, options);

  this.isReady = false;

  this.MODES = {
    INPUT: 0x00,
    OUTPUT: 0x01,
    ANALOG: 0x02,
    PWM: 0x03,
    SERVO: 0x04,
    SHIFT: 0x05,
    I2C: 0x06,
    ONEWIRE: 0x07,
    STEPPER: 0x08,
    SERIAL: 0x0A,
    PULLUP: 0x0B,
    IGNORE: 0x7F,
    PING_READ: 0x75,
    UNKOWN: 0x10,
  };

  this.I2C_MODES = {
    WRITE: 0,
    READ: 1,
    CONTINUOUS_READ: 2,
    STOP_READING: 3,
  };

  this.STEPPER = {
    TYPE: {
      DRIVER: 1,
      TWO_WIRE: 2,
      FOUR_WIRE: 4,
    },
    RUNSTATE: {
      STOP: 0,
      ACCEL: 1,
      DECEL: 2,
      RUN: 3,
    },
    DIRECTION: {
      CCW: 0,
      CW: 1,
    },
  };

  this.SERIAL_MODES = {
    CONTINUOUS_READ: 0x00,
    STOP_READING: 0x01,
  };

  // ids for hardware and software serial ports on the board
  this.SERIAL_PORT_IDs = {
    HW_SERIAL0: 0x00,
    HW_SERIAL1: 0x01,
    HW_SERIAL2: 0x02,
    HW_SERIAL3: 0x03,
    SW_SERIAL0: 0x08,
    SW_SERIAL1: 0x09,
    SW_SERIAL2: 0x10,
    SW_SERIAL3: 0x11,

    // Default can be used by depender libraries to key on a
    // single property name when negotiating ports.
    //
    // Firmata elects SW_SERIAL0: 0x08 as its DEFAULT
    DEFAULT: 0x08,
  };

  // map to the pin resolution value in the capability query response
  this.SERIAL_PIN_TYPES = {
    RES_RX0: 0x00,
    RES_TX0: 0x01,
    RES_RX1: 0x02,
    RES_TX1: 0x03,
    RES_RX2: 0x04,
    RES_TX2: 0x05,
    RES_RX3: 0x06,
    RES_TX3: 0x07,
  };

  this.RESOLUTION = {
    ADC: null,
    DAC: null,
    PWM: null,
  };

  this.HIGH = 1;
  this.LOW = 0;
  this.pins = [];
  this.ports = Array(16).fill(0);
  this.analogPins = [];
  this.version = {};
  this.firmware = {};
  this.currentBuffer = [];
  this.versionReceived = false;
  this.name = "Firmata";
  this.settings = settings;
  this.pending = 0;

  if (typeof port === "object") {
    this.transport = port;
  } else {
    this.transport = new com.SerialPort(port, settings.serialport);
  }

  // For backward compat
  this.sp = this.transport;

  this.transport.on("close", function() {
    this.emit("close");
  }.bind(this));

  this.transport.on("disconnect", function() {
    this.emit("disconnect");
  }.bind(this));

  this.transport.on("open", function() {
    this.emit("open");
    // Legacy
    this.emit("connect");
  }.bind(this));

  this.transport.on("error", function(error) {
    if (!this.isReady && typeof callback === "function") {
      callback(error);
    } else {
      this.emit("error", error);
    }
  }.bind(this));

  this.transport.on("data", function(data) {
    var byte, currByte, response, first, last, handler;

    for (var i = 0; i < data.length; i++) {
      byte = data[i];
      // we dont want to push 0 as the first byte on our buffer
      if (this.currentBuffer.length === 0 && byte === 0) {
        continue;
      } else {
        this.currentBuffer.push(byte);

        first = this.currentBuffer[0];
        last = this.currentBuffer[this.currentBuffer.length - 1];

        // [START_SYSEX, ... END_SYSEX]
        if (first === START_SYSEX && last === END_SYSEX) {

          handler = SYSEX_RESPONSE[this.currentBuffer[1]];

          // Ensure a valid SYSEX_RESPONSE handler exists
          // Only process these AFTER the REPORT_VERSION
          // message has been received and processed.
          if (handler && this.versionReceived) {
            handler(this);
          }

          // It is possible for the board to have
          // existing activity from a previous run
          // that will leave any of the following
          // active:
          //
          //    - ANALOG_MESSAGE
          //    - SERIAL_READ
          //    - I2C_REQUEST, CONTINUOUS_READ
          //
          // This means that we will receive these
          // messages on transport "open", before any
          // handshake can occur. We MUST assert
          // that we will only process this buffer
          // AFTER the REPORT_VERSION message has
          // been received. Not doing so will result
          // in the appearance of the program "hanging".
          //
          // Since we cannot do anything with this data
          // until _after_ REPORT_VERSION, discard it.
          //
          this.currentBuffer.length = 0;

        } else if (first === START_SYSEX && (this.currentBuffer.length > 0)) {
          // we have a new command after an incomplete sysex command
          currByte = data[i];
          if (currByte > 0x7F) {
            this.currentBuffer.length = 0;
            this.currentBuffer.push(currByte);
          }
        } else {
          /* istanbul ignore else */
          if (first !== START_SYSEX) {
            // Check if data gets out of sync: first byte in buffer
            // must be a valid response if not START_SYSEX
            // Identify response on first byte
            response = first < START_SYSEX ? (first & START_SYSEX) : first;

            // Check if the first byte is possibly
            // a valid MIDI_RESPONSE (handler)
            /* istanbul ignore else */
            if (response !== REPORT_VERSION &&
                response !== ANALOG_MESSAGE &&
                response !== DIGITAL_MESSAGE) {
              // If not valid, then we received garbage and can discard
              // whatever bytes have been been queued.
              this.currentBuffer.length = 0;
            }
          }
        }

        // There are 3 bytes in the buffer and the first is not START_SYSEX:
        // Might have a MIDI Command
        if (this.currentBuffer.length === 3 && first !== START_SYSEX) {
          // response bytes under 0xF0 we have a multi byte operation
          response = first < START_SYSEX ? (first & START_SYSEX) : first;

          /* istanbul ignore else */
          if (MIDI_RESPONSE[response]) {
            // It's ok that this.versionReceived will be set to
            // true every time a valid MIDI_RESPONSE is received.
            // This condition is necessary to ensure that REPORT_VERSION
            // is called first.
            if (this.versionReceived || first === REPORT_VERSION) {
              this.versionReceived = true;
              MIDI_RESPONSE[response](this);
            }
            this.currentBuffer.length = 0;
          } else {
            // A bad serial read must have happened.
            // Reseting the buffer will allow recovery.
            this.currentBuffer.length = 0;
          }
        }
      }
    }
  }.bind(this));

  // if we have not received the version within the alotted
  // time specified by the reportVersionTimeout (user or default),
  // then send an explicit request for it.
  this.reportVersionTimeoutId = setTimeout(function() {
    /* istanbul ignore else */
    if (this.versionReceived === false) {
      this.reportVersion(function() {});
      this.queryFirmware(function() {});
    }
  }.bind(this), settings.reportVersionTimeout);

  function ready() {
    board.isReady = true;
    board.emit("ready");
    /* istanbul ignore else */
    if (typeof callback === "function") {
      callback();
    }
  }

  // Await the reported version.
  this.once("reportversion", function() {
    clearTimeout(this.reportVersionTimeoutId);
    this.versionReceived = true;
    this.once("queryfirmware", function() {

      // Only preemptively set the sampling interval if `samplingInterval`
      // property was _explicitly_ set as a constructor option.
      if (options.samplingInterval !== undefined) {
        this.setSamplingInterval(options.samplingInterval);
      }
      if (settings.skipCapabilities) {
        this.analogPins = settings.analogPins || this.analogPins;
        this.pins = settings.pins || this.pins;
        /* istanbul ignore else */
        if (!this.pins.length) {
          for (var i = 0; i < (settings.pinCount || MAX_PIN_COUNT); i++) {
            var analogChannel = this.analogPins.indexOf(i);
            if (analogChannel < 0) {
              analogChannel = 127;
            }
            this.pins.push({supportedModes: [], analogChannel: analogChannel});
          }
        }

        // If the capabilities query is skipped,
        // default resolution values will be used.
        //
        // Based on ATmega328/P
        //
        this.RESOLUTION.ADC = 0x3FF;
        this.RESOLUTION.PWM = 0x0FF;

        ready();
      } else {
        this.queryCapabilities(function() {
          this.queryAnalogMapping(ready);
        });
      }
    });
  });
}

Board.prototype = Object.create(Emitter.prototype, {
  constructor: {
    value: Board,
  },
});

/**
 * writeToTransport Due to the non-blocking behaviour of transport write
 *                   operations, dependent programs need a way to know
 *                   when all writes are complete. Every write increments
 *                   a `pending` value, when the write operation has
 *                   completed, the `pending` value is decremented.
 *
 * @param  {Board} board An active Board instance
 * @param  {Array} data  An array of 8 and 7 bit values that will be
 *                       wrapped in a Buffer and written to the transport.
 */
function writeToTransport(board, data) {
  board.pending++;
  board.transport.write(new Buffer(data), function() {
    board.pending--;
  });
}

/**
 * Asks the arduino to tell us its version.
 * @param {function} callback A function to be called when the arduino has reported its version.
 */

Board.prototype.reportVersion = function(callback) {
  this.once("reportversion", callback);
  writeToTransport(this, [REPORT_VERSION]);
};

/**
 * Asks the arduino to tell us its firmware version.
 * @param {function} callback A function to be called when the arduino has reported its firmware version.
 */

Board.prototype.queryFirmware = function(callback) {
  this.once("queryfirmware", callback);
  writeToTransport(this, [START_SYSEX, QUERY_FIRMWARE, END_SYSEX]);
};

/**
 * Asks the arduino to read analog data. Turn on reporting for this pin.
 * @param {number} pin The pin to read analog data
 * @param {function} callback A function to call when we have the analag data.
 */

Board.prototype.analogRead = function(pin, callback) {
  this.reportAnalogPin(pin, 1);
  this.addListener("analog-read-" + pin, callback);
};

/**
 * Write a PWM value Asks the arduino to write an analog message.
 * @param {number} pin The pin to write analog data to.
 * @param {nubmer} value The data to write to the pin between 0 and this.RESOLUTION.PWM.
 */

Board.prototype.pwmWrite = function(pin, value) {
  var data = [];

  this.pins[pin].value = value;

  if (pin > 15) {
    data[0] = START_SYSEX;
    data[1] = EXTENDED_ANALOG;
    data[2] = pin;
    data[3] = value & 0x7F;
    data[4] = (value >> 7) & 0x7F;

    if (value > 0x00004000) {
      data[data.length] = (value >> 14) & 0x7F;
    }

    if (value > 0x00200000) {
      data[data.length] = (value >> 21) & 0x7F;
    }

    if (value > 0x10000000) {
      data[data.length] = (value >> 28) & 0x7F;
    }

    data[data.length] = END_SYSEX;
  } else {
    data.push(ANALOG_MESSAGE | pin, value & 0x7F, (value >> 7) & 0x7F);
  }

  writeToTransport(this, data);
};

Board.prototype.analogWrite = Board.prototype.pwmWrite;

/**
 * Set a pin to SERVO mode with an explicit PWM range.
 *
 * @param {number} pin The pin the servo is connected to
 * @param {number} min A 14-bit signed int.
 * @param {number} max A 14-bit signed int.
 */

Board.prototype.servoConfig = function(pin, min, max) {
  var temp;

  if (typeof pin === "object" && pin !== null) {
    temp = pin;
    pin = temp.pin;
    min = temp.min;
    max = temp.max;
  }

  if (typeof pin === "undefined") {
    throw new Error("servoConfig: pin must be specified");
  }

  if (typeof min === "undefined") {
    throw new Error("servoConfig: min must be specified");
  }

  if (typeof max === "undefined") {
    throw new Error("servoConfig: max must be specified");
  }

  // [0]  START_SYSEX  (0xF0)
  // [1]  SERVO_CONFIG (0x70)
  // [2]  pin number   (0-127)
  // [3]  minPulse LSB (0-6)
  // [4]  minPulse MSB (7-13)
  // [5]  maxPulse LSB (0-6)
  // [6]  maxPulse MSB (7-13)
  // [7]  END_SYSEX    (0xF7)

  this.pins[pin].mode = this.MODES.SERVO;

  writeToTransport(this, [
    START_SYSEX,
    SERVO_CONFIG,
    pin,
    min & 0x7F,
    (min >> 7) & 0x7F,
    max & 0x7F,
    (max >> 7) & 0x7F,
    END_SYSEX,
  ]);
};

/**
 * Asks the arduino to move a servo
 * @param {number} pin The pin the servo is connected to
 * @param {number} value The degrees to move the servo to.
 */

Board.prototype.servoWrite = function(pin, value) {
  // Values less than 544 will be treated as angles in degrees
  // (valid values in microseconds are handled as microseconds)
  this.analogWrite.apply(this, arguments);
};

/**
 * Asks the arduino to set the pin to a certain mode.
 * @param {number} pin The pin you want to change the mode of.
 * @param {number} mode The mode you want to set. Must be one of board.MODES
 */

Board.prototype.pinMode = function(pin, mode) {
  this.pins[pin].mode = mode;
  writeToTransport(this, [PIN_MODE, pin, mode]);
};

/**
 * Asks the arduino to write a value to a digital pin
 * @param {number} pin The pin you want to write a value to.
 * @param {value} value The value you want to write. Must be board.HIGH or board.LOW
 */

Board.prototype.digitalWrite = function(pin, value) {
  var port = pin >> 3;
  var bit = 1 << (pin & 0x07);

  this.pins[pin].value = value;

  if (value) {
    this.ports[port] |= bit;
  } else {
    this.ports[port] &= ~bit;
  }

  writeToTransport(this, [
    DIGITAL_MESSAGE | port,
    this.ports[port] & 0x7F,
    (this.ports[port] >> 7) & 0x7F
  ]);
};

/**
 * Asks the arduino to read digital data. Turn on reporting for this pin's port.
 *
 * @param {number} pin The pin to read data from
 * @param {function} callback The function to call when data has been received
 */

Board.prototype.digitalRead = function(pin, callback) {
  this.reportDigitalPin(pin, 1);
  this.addListener("digital-read-" + pin, callback);
};

/**
 * Asks the arduino to tell us its capabilities
 * @param {function} callback A function to call when we receive the capabilities
 */

Board.prototype.queryCapabilities = function(callback) {
  this.once("capability-query", callback);
  writeToTransport(this, [START_SYSEX, CAPABILITY_QUERY, END_SYSEX]);
};

/**
 * Asks the arduino to tell us its analog pin mapping
 * @param {function} callback A function to call when we receive the pin mappings.
 */

Board.prototype.queryAnalogMapping = function(callback) {
  this.once("analog-mapping-query", callback);
  writeToTransport(this, [START_SYSEX, ANALOG_MAPPING_QUERY, END_SYSEX]);
};

/**
 * Asks the arduino to tell us the current state of a pin
 * @param {number} pin The pin we want to the know the state of
 * @param {function} callback A function to call when we receive the pin state.
 */

Board.prototype.queryPinState = function(pin, callback) {
  this.once("pin-state-" + pin, callback);
  writeToTransport(this, [START_SYSEX, PIN_STATE_QUERY, pin, END_SYSEX]);
};

/**
 * Sends a string to the arduino
 * @param {String} string to send to the device
 */

Board.prototype.sendString = function(string) {
  var bytes = new Buffer(string + "\0", "utf8");
  var data = [];
  data.push(START_SYSEX);
  data.push(STRING_DATA);
  for (var i = 0, length = bytes.length; i < length; i++) {
    data.push(bytes[i] & 0x7F);
    data.push((bytes[i] >> 7) & 0x7F);
  }
  data.push(END_SYSEX);

  writeToTransport(this, data);
};

function i2cRequest(board, bytes) {
  var active = i2cActive.get(board);

  if (!active) {
    throw new Error("I2C is not enabled for this board. To enable, call the i2cConfig() method.");
  }

  // Do not tamper with I2C_CONFIG messages
  if (bytes[1] === I2C_REQUEST) {
    var address = bytes[2];

    // If no peripheral settings exist, make them.
    if (!active[address]) {
      active[address] = {
        stopTX: true,
      };
    }

    // READ (8) or CONTINUOUS_READ (16)
    // value & 0b00011000
    if (bytes[3] & I2C_READ_MASK) {
      // Invert logic to accomodate default = true,
      // which is actually stopTX = 0
      bytes[3] |= Number(!active[address].stopTX) << 6;
    }
  }

  writeToTransport(board, bytes);
}

/**
 * Sends a I2C config request to the arduino board with an optional
 * value in microseconds to delay an I2C Read.  Must be called before
 * an I2C Read or Write
 * @param {number} delay in microseconds to set for I2C Read
 */

Board.prototype.sendI2CConfig = function(delay) {
  return this.i2cConfig(delay);
};

/**
 * Enable I2C with an optional read delay. Must be called before
 * an I2C Read or Write
 *
 * Supersedes sendI2CConfig
 *
 * @param {number} delay in microseconds to set for I2C Read
 *
 * or
 *
 * @param {object} with a single property `delay`
 */

Board.prototype.i2cConfig = function(options) {
  var settings = i2cActive.get(this);
  var delay;

  if (!settings) {
    settings = {
      /*
        Keys will be I2C peripheral addresses
       */
    };
    i2cActive.set(this, settings);
  }

  if (typeof options === "number") {
    delay = options;
  } else {
    if (typeof options === "object" && options !== null) {
      delay = Number(options.delay);

      // When an address was explicitly specified, there may also be
      // peripheral specific instructions in the config.
      if (typeof options.address !== "undefined") {
        if (!settings[options.address]) {
          settings[options.address] = {
            stopTX: true,
          };
        }
      }

      // When settings have been explicitly provided, just bulk assign
      // them to the existing settings, even if that's empty. This
      // allows for reconfiguration as needed.
      if (typeof options.settings !== "undefined") {
        Object.assign(settings[options.address], options.settings);
        /*
          - stopTX: true | false
              Set `stopTX` to `false` if this peripheral
              expects Wire to keep the transmission connection alive between
              setting a register and requesting bytes.

              Defaults to `true`.
         */
      }
    }
  }

  settings.delay = delay = delay || 0;

  i2cRequest(this, [
    START_SYSEX,
    I2C_CONFIG,
    delay & 0xFF, (delay >> 8) & 0xFF,
    END_SYSEX,
  ]);

  return this;
};

/**
 * Asks the arduino to send an I2C request to a device
 * @param {number} slaveAddress The address of the I2C device
 * @param {Array} bytes The bytes to send to the device
 */

Board.prototype.sendI2CWriteRequest = function(slaveAddress, bytes) {
  var data = [];
  /* istanbul ignore next */
  bytes = bytes || [];

  data.push(
    START_SYSEX,
    I2C_REQUEST,
    slaveAddress,
    this.I2C_MODES.WRITE << 3
  );

  for (var i = 0, length = bytes.length; i < length; i++) {
    data.push(
      bytes[i] & 0x7F, (bytes[i] >> 7) & 0x7F
    );
  }

  data.push(END_SYSEX);

  i2cRequest(this, data);
};

/**
 * Write data to a register
 *
 * @param {number} address      The address of the I2C device.
 * @param {array} cmdRegOrData  An array of bytes
 *
 * Write a command to a register
 *
 * @param {number} address      The address of the I2C device.
 * @param {number} cmdRegOrData The register
 * @param {array} inBytes       An array of bytes
 *
 */

Board.prototype.i2cWrite = function(address, registerOrData, inBytes) {
  /**
   * registerOrData:
   * [... arbitrary bytes]
   *
   * or
   *
   * registerOrData, inBytes:
   * command [, ...]
   *
   */
  var bytes;
  var data = [
    START_SYSEX,
    I2C_REQUEST,
    address,
    this.I2C_MODES.WRITE << 3
  ];

  // If i2cWrite was used for an i2cWriteReg call...
  if (arguments.length === 3 &&
      !Array.isArray(registerOrData) &&
      !Array.isArray(inBytes)) {

    return this.i2cWriteReg(address, registerOrData, inBytes);
  }

  // Fix arguments if called with Firmata.js API
  if (arguments.length === 2) {
    if (Array.isArray(registerOrData)) {
      inBytes = registerOrData.slice();
      registerOrData = inBytes.shift();
    } else {
      inBytes = [];
    }
  }

  bytes = new Buffer([registerOrData].concat(inBytes));

  for (var i = 0, length = bytes.length; i < length; i++) {
    data.push(
      bytes[i] & 0x7F, (bytes[i] >> 7) & 0x7F
    );
  }

  data.push(END_SYSEX);

  i2cRequest(this, data);

  return this;
};

/**
 * Write data to a register
 *
 * @param {number} address    The address of the I2C device.
 * @param {number} register   The register.
 * @param {number} byte       The byte value to write.
 *
 */

Board.prototype.i2cWriteReg = function(address, register, byte) {
  i2cRequest(this, [
    START_SYSEX,
    I2C_REQUEST,
    address,
    this.I2C_MODES.WRITE << 3,
    // register
    register & 0x7F, (register >> 7) & 0x7F,
    // byte
    byte & 0x7F, (byte >> 7) & 0x7F,
    END_SYSEX,
  ]);

  return this;
};


/**
 * Asks the arduino to request bytes from an I2C device
 * @param {number} slaveAddress The address of the I2C device
 * @param {number} numBytes The number of bytes to receive.
 * @param {function} callback A function to call when we have received the bytes.
 */

Board.prototype.sendI2CReadRequest = function(address, numBytes, callback) {
  i2cRequest(this, [
    START_SYSEX,
    I2C_REQUEST,
    address,
    this.I2C_MODES.READ << 3,
    numBytes & 0x7F, (numBytes >> 7) & 0x7F,
    END_SYSEX,
  ]);
  this.once("I2C-reply-" + address + "-0" , callback);
};

// TODO: Refactor i2cRead and i2cReadOnce
//      to share most operations.

/**
 * Initialize a continuous I2C read.
 *
 * @param {number} address    The address of the I2C device
 * @param {number} register   Optionally set the register to read from.
 * @param {number} numBytes   The number of bytes to receive.
 * @param {function} callback A function to call when we have received the bytes.
 */

Board.prototype.i2cRead = function(address, register, bytesToRead, callback) {

  if (arguments.length === 3 &&
      typeof register === "number" &&
      typeof bytesToRead === "function") {
    callback = bytesToRead;
    bytesToRead = register;
    register = null;
  }

  var event = "I2C-reply-" + address + "-";
  var data = [
    START_SYSEX,
    I2C_REQUEST,
    address,
    this.I2C_MODES.CONTINUOUS_READ << 3,
  ];

  if (register !== null) {
    data.push(
      register & 0x7F, (register >> 7) & 0x7F
    );
  } else {
    register = 0;
  }

  event += register;

  data.push(
    bytesToRead & 0x7F, (bytesToRead >> 7) & 0x7F,
    END_SYSEX
  );

  this.on(event, callback);

  i2cRequest(this, data);

  return this;
};

/**
 * Stop continuous reading of the specified I2C address or register.
 *
 * @param {object} options Options:
 *   bus {number} The I2C bus (on supported platforms)
 *   address {number} The I2C peripheral address to stop reading.
 *
 * @param {number} address The I2C peripheral address to stop reading.
 */

Board.prototype.i2cStop = function(options) {
  // There may be more values in the future
  // var options = {};

  // null or undefined? Do nothing.
  if (options == null) {
    return;
  }

  if (typeof options === "number") {
    options = {
      address: options
    };
  }

  writeToTransport(this, [
    START_SYSEX,
    I2C_REQUEST,
    options.address,
    this.I2C_MODES.STOP_READING << 3,
    END_SYSEX,
  ]);

  Object.keys(this._events).forEach(function(event) {
    if (event.startsWith("I2C-reply-" + options.address)) {
      this.removeAllListeners(event);
    }
  }, this);
};


/**
 * Perform a single I2C read
 *
 * Supersedes sendI2CReadRequest
 *
 * Read bytes from address
 *
 * @param {number} address    The address of the I2C device
 * @param {number} register   Optionally set the register to read from.
 * @param {number} numBytes   The number of bytes to receive.
 * @param {function} callback A function to call when we have received the bytes.
 *
 */


Board.prototype.i2cReadOnce = function(address, register, bytesToRead, callback) {

  if (arguments.length === 3 &&
      typeof register === "number" &&
      typeof bytesToRead === "function") {
    callback = bytesToRead;
    bytesToRead = register;
    register = null;
  }

  var event = "I2C-reply-" + address + "-";
  var data = [
    START_SYSEX,
    I2C_REQUEST,
    address,
    this.I2C_MODES.READ << 3,
  ];

  if (register !== null) {
    data.push(
      register & 0x7F, (register >> 7) & 0x7F
    );
  } else {
    register = 0;
  }

  event += register;

  data.push(
    bytesToRead & 0x7F, (bytesToRead >> 7) & 0x7F,
    END_SYSEX
  );

  this.once(event, callback);

  i2cRequest(this, data);

  return this;
};

// CONTINUOUS_READ

/**
 * Configure the passed pin as the controller in a 1-wire bus.
 * Pass as enableParasiticPower true if you want the data pin to power the bus.
 * @param pin
 * @param enableParasiticPower
 */

Board.prototype.sendOneWireConfig = function(pin, enableParasiticPower) {
  writeToTransport(this, [
    START_SYSEX,
    ONEWIRE_DATA,
    ONEWIRE_CONFIG_REQUEST,
    pin,
    enableParasiticPower ? 0x01 : 0x00,
    END_SYSEX
  ]);
};

/**
 * Searches for 1-wire devices on the bus.  The passed callback should accept
 * and error argument and an array of device identifiers.
 * @param pin
 * @param callback
 */

Board.prototype.sendOneWireSearch = function(pin, callback) {
  this._sendOneWireSearch(ONEWIRE_SEARCH_REQUEST, "1-wire-search-reply-" + pin, pin, callback);
};

/**
 * Searches for 1-wire devices on the bus in an alarmed state.  The passed callback
 * should accept and error argument and an array of device identifiers.
 * @param pin
 * @param callback
 */

Board.prototype.sendOneWireAlarmsSearch = function(pin, callback) {
  this._sendOneWireSearch(ONEWIRE_SEARCH_ALARMS_REQUEST, "1-wire-search-alarms-reply-" + pin, pin, callback);
};

Board.prototype._sendOneWireSearch = function(type, event, pin, callback) {
  writeToTransport(this, [START_SYSEX, ONEWIRE_DATA, type, pin, END_SYSEX]);

  var searchTimeout = setTimeout(function() {
    /* istanbul ignore next */
    callback(new Error("1-Wire device search timeout - are you running ConfigurableFirmata?"));
  }, 5000);
  this.once(event, function(devices) {
    clearTimeout(searchTimeout);
    callback(null, devices);
  });
};

/**
 * Reads data from a device on the bus and invokes the passed callback.
 *
 * N.b. ConfigurableFirmata will issue the 1-wire select command internally.
 * @param pin
 * @param device
 * @param numBytesToRead
 * @param callback
 */

Board.prototype.sendOneWireRead = function(pin, device, numBytesToRead, callback) {
  var correlationId = Math.floor(Math.random() * 255);
  /* istanbul ignore next */
  var readTimeout = setTimeout(function() {
    /* istanbul ignore next */
    callback(new Error("1-Wire device read timeout - are you running ConfigurableFirmata?"));
  }, 5000);
  this._sendOneWireRequest(pin, ONEWIRE_READ_REQUEST_BIT, device, numBytesToRead, correlationId, null, null, "1-wire-read-reply-" + correlationId, function(data) {
    clearTimeout(readTimeout);
    callback(null, data);
  });
};

/**
 * Resets all devices on the bus.
 * @param pin
 */

Board.prototype.sendOneWireReset = function(pin) {
  this._sendOneWireRequest(pin, ONEWIRE_RESET_REQUEST_BIT);
};

/**
 * Writes data to the bus to be received by the passed device.  The device
 * should be obtained from a previous call to sendOneWireSearch.
 *
 * N.b. ConfigurableFirmata will issue the 1-wire select command internally.
 * @param pin
 * @param device
 * @param data
 */

Board.prototype.sendOneWireWrite = function(pin, device, data) {
  this._sendOneWireRequest(pin, ONEWIRE_WRITE_REQUEST_BIT, device, null, null, null, Array.isArray(data) ? data : [data]);
};

/**
 * Tells firmata to not do anything for the passed amount of ms.  For when you
 * need to give a device attached to the bus time to do a calculation.
 * @param pin
 */

Board.prototype.sendOneWireDelay = function(pin, delay) {
  this._sendOneWireRequest(pin, ONEWIRE_DELAY_REQUEST_BIT, null, null, null, delay);
};

/**
 * Sends the passed data to the passed device on the bus, reads the specified
 * number of bytes and invokes the passed callback.
 *
 * N.b. ConfigurableFirmata will issue the 1-wire select command internally.
 * @param pin
 * @param device
 * @param data
 * @param numBytesToRead
 * @param callback
 */

Board.prototype.sendOneWireWriteAndRead = function(pin, device, data, numBytesToRead, callback) {
  var correlationId = Math.floor(Math.random() * 255);
  /* istanbul ignore next */
  var readTimeout = setTimeout(function() {
    /* istanbul ignore next */
    callback(new Error("1-Wire device read timeout - are you running ConfigurableFirmata?"));
  }, 5000);
  this._sendOneWireRequest(pin, ONEWIRE_WRITE_REQUEST_BIT | ONEWIRE_READ_REQUEST_BIT, device, numBytesToRead, correlationId, null, Array.isArray(data) ? data : [data], "1-wire-read-reply-" + correlationId, function(data) {
    clearTimeout(readTimeout);

    callback(null, data);
  });
};

// see http://firmata.org/wiki/Proposals#OneWire_Proposal
Board.prototype._sendOneWireRequest = function(pin, subcommand, device, numBytesToRead, correlationId, delay, dataToWrite, event, callback) {
  var bytes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  if (device || numBytesToRead || correlationId || delay || dataToWrite) {
    subcommand = subcommand | ONEWIRE_WITHDATA_REQUEST_BITS;
  }

  if (device) {
    bytes.splice.apply(bytes, [0, 8].concat(device));
  }

  if (numBytesToRead) {
    bytes[8] = numBytesToRead & 0xFF;
    bytes[9] = (numBytesToRead >> 8) & 0xFF;
  }

  if (correlationId) {
    bytes[10] = correlationId & 0xFF;
    bytes[11] = (correlationId >> 8) & 0xFF;
  }

  if (delay) {
    bytes[12] = delay & 0xFF;
    bytes[13] = (delay >> 8) & 0xFF;
    bytes[14] = (delay >> 16) & 0xFF;
    bytes[15] = (delay >> 24) & 0xFF;
  }

  if (dataToWrite) {
    dataToWrite.forEach(function(byte) {
      bytes.push(byte);
    });
  }

  var output = [START_SYSEX, ONEWIRE_DATA, subcommand, pin];
  output = output.concat(Encoder7Bit.to7BitArray(bytes));
  output.push(END_SYSEX);

  writeToTransport(this, output);

  if (event && callback) {
    this.once(event, callback);
  }
};

/**
 * Set sampling interval in millis. Default is 19 ms
 * @param {number} interval The sampling interval in ms > 10
 */

Board.prototype.setSamplingInterval = function(interval) {
  var safeint = interval < 10 ? 10 : (interval > 65535 ? 65535 : interval);
  this.settings.samplingInterval = safeint;
  writeToTransport(this, [
    START_SYSEX,
    SAMPLING_INTERVAL,
    (safeint & 0x7F),
    ((safeint >> 7) & 0x7F),
    END_SYSEX
  ]);
};

/**
 * Get sampling interval in millis. Default is 19 ms
 *
 * @return {number} samplingInterval
 */

Board.prototype.getSamplingInterval = function() {
  return this.settings.samplingInterval;
};

/**
 * Set reporting on pin
 * @param {number} pin The pin to turn on/off reporting
 * @param {number} value Binary value to turn reporting on/off
 */

Board.prototype.reportAnalogPin = function(pin, value) {
  /* istanbul ignore else */
  if (value === 0 || value === 1) {
    this.pins[this.analogPins[pin]].report = value;
    writeToTransport(this, [REPORT_ANALOG | pin, value]);
  }
};

/**
 * Set reporting on pin
 * @param {number} pin The pin to turn on/off reporting
 * @param {number} value Binary value to turn reporting on/off
 */

Board.prototype.reportDigitalPin = function(pin, value) {
  var port = pin >> 3;
  /* istanbul ignore else */
  if (value === 0 || value === 1) {
    this.pins[pin].report = value;
    writeToTransport(this, [REPORT_DIGITAL | port, value]);
  }
};

/**
 *
 *
 */

Board.prototype.pingRead = function(opts, callback) {

  if (this.pins[opts.pin].supportedModes.indexOf(PING_READ) === -1) {
    throw new Error("Please upload PingFirmata to the board");
  }

  var pin = opts.pin;
  var value = opts.value;
  var pulseOut = opts.pulseOut || 0;
  var timeout = opts.timeout || 1000000;
  var pulseOutArray = [
    (pulseOut >> 24) & 0xFF,
    (pulseOut >> 16) & 0xFF,
    (pulseOut >> 8) & 0XFF,
    (pulseOut & 0xFF),
  ];
  var timeoutArray = [
    (timeout >> 24) & 0xFF,
    (timeout >> 16) & 0xFF,
    (timeout >> 8) & 0XFF,
    (timeout & 0xFF),
  ];

  writeToTransport(this, [
    START_SYSEX,
    PING_READ,
    pin,
    value,
    pulseOutArray[0] & 0x7F, (pulseOutArray[0] >> 7) & 0x7F,
    pulseOutArray[1] & 0x7F, (pulseOutArray[1] >> 7) & 0x7F,
    pulseOutArray[2] & 0x7F, (pulseOutArray[2] >> 7) & 0x7F,
    pulseOutArray[3] & 0x7F, (pulseOutArray[3] >> 7) & 0x7F,
    timeoutArray[0] & 0x7F, (timeoutArray[0] >> 7) & 0x7F,
    timeoutArray[1] & 0x7F, (timeoutArray[1] >> 7) & 0x7F,
    timeoutArray[2] & 0x7F, (timeoutArray[2] >> 7) & 0x7F,
    timeoutArray[3] & 0x7F, (timeoutArray[3] >> 7) & 0x7F,
    END_SYSEX,
  ]);

  this.once("ping-read-" + pin, callback);
};

/**
 * Stepper functions to support AdvancedFirmata"s asynchronous control of stepper motors
 * https://github.com/soundanalogous/AdvancedFirmata
 */

/**
 * Asks the arduino to configure a stepper motor with the given config to allow asynchronous control of the stepper
 * @param {number} deviceNum Device number for the stepper (range 0-5, expects steppers to be setup in order from 0 to 5)
 * @param {number} type One of this.STEPPER.TYPE.*
 * @param {number} stepsPerRev Number of steps motor takes to make one revolution
 * @param {number} dirOrMotor1Pin If using EasyDriver type stepper driver, this is direction pin, otherwise it is motor 1 pin
 * @param {number} stepOrMotor2Pin If using EasyDriver type stepper driver, this is step pin, otherwise it is motor 2 pin
 * @param {number} [motor3Pin] Only required if type == this.STEPPER.TYPE.FOUR_WIRE
 * @param {number} [motor4Pin] Only required if type == this.STEPPER.TYPE.FOUR_WIRE
 */

Board.prototype.stepperConfig = function(deviceNum, type, stepsPerRev, dirOrMotor1Pin, stepOrMotor2Pin, motor3Pin, motor4Pin) {
  var data = [
    START_SYSEX,
    STEPPER,
    0x00, // STEPPER_CONFIG from firmware
    deviceNum,
    type,
    stepsPerRev & 0x7F, (stepsPerRev >> 7) & 0x7F,
    dirOrMotor1Pin,
    stepOrMotor2Pin,
  ];
  if (type === this.STEPPER.TYPE.FOUR_WIRE) {
    data.push(motor3Pin, motor4Pin);
  }
  data.push(END_SYSEX);
  writeToTransport(this, data);
};

/**
 * Asks the arduino to move a stepper a number of steps at a specific speed
 * (and optionally with and acceleration and deceleration)
 * speed is in units of .01 rad/sec
 * accel and decel are in units of .01 rad/sec^2
 * TODO: verify the units of speed, accel, and decel
 * @param {number} deviceNum Device number for the stepper (range 0-5)
 * @param {number} direction One of this.STEPPER.DIRECTION.*
 * @param {number} steps Number of steps to make
 * @param {number} speed
 * @param {number|function} accel Acceleration or if accel and decel are not used, then it can be the callback
 * @param {number} [decel]
 * @param {function} [callback]
 */

Board.prototype.stepperStep = function(deviceNum, direction, steps, speed, accel, decel, callback) {
  if (typeof accel === "function") {
    callback = accel;
    accel = 0;
    decel = 0;
  }

  var data = [
    START_SYSEX,
    STEPPER,
    0x01, // STEPPER_STEP from firmware
    deviceNum,
    direction, // one of this.STEPPER.DIRECTION.*
    steps & 0x7F, (steps >> 7) & 0x7F, (steps >> 14) & 0x7f,
    speed & 0x7F, (speed >> 7) & 0x7F
  ];
  if (accel > 0 || decel > 0) {
    data.push(
      accel & 0x7F, (accel >> 7) & 0x7F,
      decel & 0x7F, (decel >> 7) & 0x7F
    );
  }
  data.push(END_SYSEX);
  writeToTransport(this, data);
  this.once("stepper-done-" + deviceNum, callback);
};

/**
 * Asks the Arduino to configure a hardware or serial port.
 * @param {object} options Options:
 *   portId {number} The serial port to use (HW_SERIAL1, HW_SERIAL2, HW_SERIAL3, SW_SERIAL0,
 *   SW_SERIAL1, SW_SERIAL2, SW_SERIAL3)
 *   baud {number} The baud rate of the serial port
 *   rxPin {number} [SW Serial only] The RX pin of the SoftwareSerial instance
 *   txPin {number} [SW Serial only] The TX pin of the SoftwareSerial instance
 */

Board.prototype.serialConfig = function(options) {

  var portId;
  var baud;
  var rxPin;
  var txPin;

  /* istanbul ignore else */
  if (typeof options === "object" && options !== null) {
    portId = options.portId;
    baud = options.baud;
    rxPin = options.rxPin;
    txPin = options.txPin;
  }

  /* istanbul ignore else */
  if (typeof portId === "undefined") {
    throw new Error("portId must be specified, see SERIAL_PORT_IDs for options.");
  }

  baud = baud || 57600;

  var data = [
    START_SYSEX,
    SERIAL_MESSAGE,
    SERIAL_CONFIG | portId,
    baud & 0x007F,
    (baud >> 7) & 0x007F,
    (baud >> 14) & 0x007F
  ];
  if (portId > 7 && typeof rxPin !== "undefined" && typeof txPin !== "undefined") {
    data.push(rxPin);
    data.push(txPin);
  } else if (portId > 7) {
    throw new Error("Both RX and TX pins must be defined when using Software Serial.");
  }

  data.push(END_SYSEX);
  writeToTransport(this, data);
};

/**
 * Write an array of bytes to the specified serial port.
 * @param {number} portId The serial port to write to.
 * @param {array} inBytes An array of bytes to write to the serial port.
 */

Board.prototype.serialWrite = function(portId, inBytes) {
  var data = [
    START_SYSEX,
    SERIAL_MESSAGE,
    SERIAL_WRITE | portId,
  ];
  for (var i = 0, len = inBytes.length; i < len; i++) {
    data.push(inBytes[i] & 0x007F);
    data.push((inBytes[i] >> 7) & 0x007F);
  }
  data.push(END_SYSEX);
  /* istanbul ignore else */
  if (inBytes.length > 0) {
    writeToTransport(this, data);
  }
};

/**
 * Start continuous reading of the specified serial port. The port is checked for data each
 * iteration of the main Arduino loop.
 * @param {number} portId The serial port to start reading continuously.
 * @param {number} maxBytesToRead [Optional] The maximum number of bytes to read per iteration.
 * If there are less bytes in the buffer, the lesser number of bytes will be returned. A value of 0
 * indicates that all available bytes in the buffer should be read.
 * @param {function} callback A function to call when we have received the bytes.
 */

Board.prototype.serialRead = function(portId, maxBytesToRead, callback) {
  var data = [
    START_SYSEX,
    SERIAL_MESSAGE,
    SERIAL_READ | portId,
    this.SERIAL_MODES.CONTINUOUS_READ
  ];

  if (arguments.length === 2 && typeof maxBytesToRead === "function") {
    callback = maxBytesToRead;
  } else {
    data.push(maxBytesToRead & 0x007F);
    data.push((maxBytesToRead >> 7) & 0x007F);
  }

  data.push(END_SYSEX);
  writeToTransport(this, data);

  this.on("serial-data-" + portId, callback);
};

/**
 * Stop continuous reading of the specified serial port. This does not close the port, it stops
 * reading it but keeps the port open.
 * @param {number} portId The serial port to stop reading.
 */

Board.prototype.serialStop = function(portId) {
  writeToTransport(this, [
    START_SYSEX,
    SERIAL_MESSAGE,
    SERIAL_READ | portId,
    this.SERIAL_MODES.STOP_READING,
    END_SYSEX,
  ]);

  this.removeAllListeners("serial-data-" + portId);
};

/**
 * Close the specified serial port.
 * @param {number} portId The serial port to close.
 */

Board.prototype.serialClose = function(portId) {
  writeToTransport(this, [
    START_SYSEX,
    SERIAL_MESSAGE,
    SERIAL_CLOSE | portId,
    END_SYSEX,
  ]);
};

/**
 * Flush the specified serial port. For hardware serial, this waits for the transmission of
 * outgoing serial data to complete. For software serial, this removed any buffered incoming serial
 * data.
 * @param {number} portId The serial port to flush.
 */

Board.prototype.serialFlush = function(portId) {
  writeToTransport(this, [
    START_SYSEX,
    SERIAL_MESSAGE,
    SERIAL_FLUSH | portId,
    END_SYSEX,
  ]);
};

/**
 * For SoftwareSerial only. Only a single SoftwareSerial instance can read data at a time.
 * Call this method to set this port to be the reading port in the case there are multiple
 * SoftwareSerial instances.
 * @param {number} portId The serial port to listen on.
 */

Board.prototype.serialListen = function(portId) {
  // listen only applies to software serial ports
  if (portId < 8) {
    return;
  }
  writeToTransport(this, [
    START_SYSEX,
    SERIAL_MESSAGE,
    SERIAL_LISTEN | portId,
    END_SYSEX,
  ]);
};

/**
 * Allow user code to handle arbitrary sysex responses
 *
 * @param {number} commandByte The commandByte must be associated with some message
 *                             that's expected from the slave device. The handler is
 *                             called with an array of _raw_ data from the slave. Data
 *                             decoding must be done within the handler itself.
 *
 *                             Use Board.decode(data) to extract useful values from
 *                             the incoming response data.
 *
 *  @param {function} handler Function which handles receipt of responses matching
 *                            commandByte.
 */

Board.prototype.sysexResponse = function(commandByte, handler) {
  if (Board.SYSEX_RESPONSE[commandByte]) {
    throw new Error(commandByte + " is not an available SYSEX_RESPONSE byte");
  }

  Board.SYSEX_RESPONSE[commandByte] = function(board) {
    handler(board.currentBuffer.slice(2, -1));
  };

  return this;
};

/**
 * Allow user code to send arbitrary sysex messages
 *
 * @param {array} message The message array is expected to be all necessary bytes
 *                        between START_SYSEX and END_SYSEX (non-inclusive). It will
 *                        be assumed that the data in the message array is
 *                        already encoded as 2 7-bit bytes LSB first.
 *
 *
 */

Board.prototype.sysexCommand = function(message) {

  if (!message || !message.length) {
    throw new Error("Sysex Command cannot be empty");
  }

  var data = message.slice();

  data.unshift(START_SYSEX);
  data.push(END_SYSEX);

  writeToTransport(this, data);
  return this;
};


/**
 * Send SYSTEM_RESET to arduino
 */

Board.prototype.reset = function() {
  writeToTransport(this, [SYSTEM_RESET]);
};

/**
 * Board.isAcceptablePort Determines if a `port` object (from SerialPort.list(...))
 * is a valid Arduino (or similar) device.
 * @return {Boolean} true if port can be connected to by Firmata
 */

Board.isAcceptablePort = function(port) {
  var rport = /usb|acm|^com/i;

  if (rport.test(port.comName)) {
    return true;
  }

  return false;
};

/**
 * Board.requestPort(callback) Request an acceptable port to connect to.
 * callback(error, port)
 */

Board.requestPort = function(callback) {
  com.list(function(error, ports) {
    var port = ports.find(function(port) {
      if (Board.isAcceptablePort(port)) {
        return port;
      }
    });

    if (port) {
      callback(null, port);
    } else {
      callback(new Error("No Acceptable Port Found"), null);
    }
  });
};

// For backwards compatibility
Board.Board = Board;
Board.SYSEX_RESPONSE = SYSEX_RESPONSE;
Board.MIDI_RESPONSE = MIDI_RESPONSE;

// Expose encode/decode for custom sysex messages
Board.encode = function(data) {
  var encoded = [];
  var length = data.length;

  for (var i = 0; i < length; i++) {
    encoded.push(
      data[i] & 0x7F,
      (data[i] >> 7) & 0x7F
    );
  }

  return encoded;
};

Board.decode = function(data) {
  var decoded = [];

  if (data.length % 2 !== 0) {
    throw new Error("Board.decode(data) called with odd number of data bytes");
  }

  while (data.length) {
    var lsb = data.shift();
    var msb = data.shift();
    decoded.push(lsb | (msb << 7));
  }

  return decoded;
};

/* istanbul ignore else */
if (process.env.IS_TEST_MODE) {
  Board.test = {
    writeToTransport: writeToTransport,
    i2cPeripheralSettings: function(board) {
      return i2cActive.get(board);
    },
    get i2cActive() {
      return i2cActive;
    }
  };
}

module.exports = Board;

}).call(this,require('_process'),require("buffer").Buffer)
},{"./com":40,"./encoder7bit":41,"./onewireutils":43,"_process":63,"buffer":7,"es6-shim":38,"events":39}],43:[function(require,module,exports){
var Encoder7Bit = require("./encoder7bit");

var OneWireUtils = {
  crc8: function(data) {
    var crc = 0;

    for (var i = 0; i < data.length; i++) {
      var inbyte = data[i];

      for (var n = 8; n; n--) {
        var mix = (crc ^ inbyte) & 0x01;
        crc >>= 1;

        if (mix) {
          crc ^= 0x8C;
        }

        inbyte >>= 1;
      }
    }
    return crc;
  },

  readDevices: function(data) {
    var deviceBytes = Encoder7Bit.from7BitArray(data);
    var devices = [];

    for (var i = 0; i < deviceBytes.length; i += 8) {
      var device = deviceBytes.slice(i, i + 8);

      if (device.length !== 8) {
        continue;
      }

      var check = OneWireUtils.crc8(device.slice(0, 7));

      if (check !== device[7]) {
        console.error("ROM invalid!");
      }

      devices.push(device);
    }

    return devices;
  }
};

module.exports = OneWireUtils;

},{"./encoder7bit":41}],44:[function(require,module,exports){

var hasOwn = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;

module.exports = function forEach (obj, fn, ctx) {
    if (toString.call(fn) !== '[object Function]') {
        throw new TypeError('iterator must be a function');
    }
    var l = obj.length;
    if (l === +l) {
        for (var i = 0; i < l; i++) {
            fn.call(ctx, obj[i], i, obj);
        }
    } else {
        for (var k in obj) {
            if (hasOwn.call(obj, k)) {
                fn.call(ctx, obj[k], k, obj);
            }
        }
    }
};


},{}],45:[function(require,module,exports){
var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var slice = Array.prototype.slice;
var toStr = Object.prototype.toString;
var funcType = '[object Function]';

module.exports = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slice.call(arguments, 1);

    var bound;
    var binder = function () {
        if (this instanceof bound) {
            var result = target.apply(
                this,
                args.concat(slice.call(arguments))
            );
            if (Object(result) === result) {
                return result;
            }
            return this;
        } else {
            return target.apply(
                that,
                args.concat(slice.call(arguments))
            );
        }
    };

    var boundLength = Math.max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs.push('$' + i);
    }

    bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};

},{}],46:[function(require,module,exports){
var implementation = require('./implementation');

module.exports = Function.prototype.bind || implementation;

},{"./implementation":45}],47:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],48:[function(require,module,exports){
(function (global){
'use strict';
var Mutation = global.MutationObserver || global.WebKitMutationObserver;

var scheduleDrain;

{
  if (Mutation) {
    var called = 0;
    var observer = new Mutation(nextTick);
    var element = global.document.createTextNode('');
    observer.observe(element, {
      characterData: true
    });
    scheduleDrain = function () {
      element.data = (called = ++called % 2);
    };
  } else if (!global.setImmediate && typeof global.MessageChannel !== 'undefined') {
    var channel = new global.MessageChannel();
    channel.port1.onmessage = nextTick;
    scheduleDrain = function () {
      channel.port2.postMessage(0);
    };
  } else if ('document' in global && 'onreadystatechange' in global.document.createElement('script')) {
    scheduleDrain = function () {

      // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
      // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
      var scriptEl = global.document.createElement('script');
      scriptEl.onreadystatechange = function () {
        nextTick();

        scriptEl.onreadystatechange = null;
        scriptEl.parentNode.removeChild(scriptEl);
        scriptEl = null;
      };
      global.document.documentElement.appendChild(scriptEl);
    };
  } else {
    scheduleDrain = function () {
      setTimeout(nextTick, 0);
    };
  }
}

var draining;
var queue = [];
//named nextTick for less confusing stack traces
function nextTick() {
  draining = true;
  var i, oldQueue;
  var len = queue.length;
  while (len) {
    oldQueue = queue;
    queue = [];
    i = -1;
    while (++i < len) {
      oldQueue[i]();
    }
    len = queue.length;
  }
  draining = false;
}

module.exports = immediate;
function immediate(task) {
  if (queue.push(task) === 1 && !draining) {
    scheduleDrain();
  }
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],49:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],50:[function(require,module,exports){
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}

},{}],51:[function(require,module,exports){
module.exports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

},{}],52:[function(require,module,exports){
'use strict';
var immediate = require('immediate');

/* istanbul ignore next */
function INTERNAL() {}

var handlers = {};

var REJECTED = ['REJECTED'];
var FULFILLED = ['FULFILLED'];
var PENDING = ['PENDING'];

module.exports = Promise;

function Promise(resolver) {
  if (typeof resolver !== 'function') {
    throw new TypeError('resolver must be a function');
  }
  this.state = PENDING;
  this.queue = [];
  this.outcome = void 0;
  if (resolver !== INTERNAL) {
    safelyResolveThenable(this, resolver);
  }
}

Promise.prototype["catch"] = function (onRejected) {
  return this.then(null, onRejected);
};
Promise.prototype.then = function (onFulfilled, onRejected) {
  if (typeof onFulfilled !== 'function' && this.state === FULFILLED ||
    typeof onRejected !== 'function' && this.state === REJECTED) {
    return this;
  }
  var promise = new this.constructor(INTERNAL);
  if (this.state !== PENDING) {
    var resolver = this.state === FULFILLED ? onFulfilled : onRejected;
    unwrap(promise, resolver, this.outcome);
  } else {
    this.queue.push(new QueueItem(promise, onFulfilled, onRejected));
  }

  return promise;
};
function QueueItem(promise, onFulfilled, onRejected) {
  this.promise = promise;
  if (typeof onFulfilled === 'function') {
    this.onFulfilled = onFulfilled;
    this.callFulfilled = this.otherCallFulfilled;
  }
  if (typeof onRejected === 'function') {
    this.onRejected = onRejected;
    this.callRejected = this.otherCallRejected;
  }
}
QueueItem.prototype.callFulfilled = function (value) {
  handlers.resolve(this.promise, value);
};
QueueItem.prototype.otherCallFulfilled = function (value) {
  unwrap(this.promise, this.onFulfilled, value);
};
QueueItem.prototype.callRejected = function (value) {
  handlers.reject(this.promise, value);
};
QueueItem.prototype.otherCallRejected = function (value) {
  unwrap(this.promise, this.onRejected, value);
};

function unwrap(promise, func, value) {
  immediate(function () {
    var returnValue;
    try {
      returnValue = func(value);
    } catch (e) {
      return handlers.reject(promise, e);
    }
    if (returnValue === promise) {
      handlers.reject(promise, new TypeError('Cannot resolve promise with itself'));
    } else {
      handlers.resolve(promise, returnValue);
    }
  });
}

handlers.resolve = function (self, value) {
  var result = tryCatch(getThen, value);
  if (result.status === 'error') {
    return handlers.reject(self, result.value);
  }
  var thenable = result.value;

  if (thenable) {
    safelyResolveThenable(self, thenable);
  } else {
    self.state = FULFILLED;
    self.outcome = value;
    var i = -1;
    var len = self.queue.length;
    while (++i < len) {
      self.queue[i].callFulfilled(value);
    }
  }
  return self;
};
handlers.reject = function (self, error) {
  self.state = REJECTED;
  self.outcome = error;
  var i = -1;
  var len = self.queue.length;
  while (++i < len) {
    self.queue[i].callRejected(error);
  }
  return self;
};

function getThen(obj) {
  // Make sure we only access the accessor once as required by the spec
  var then = obj && obj.then;
  if (obj && (typeof obj === 'object' || typeof obj === 'function') && typeof then === 'function') {
    return function appyThen() {
      then.apply(obj, arguments);
    };
  }
}

function safelyResolveThenable(self, thenable) {
  // Either fulfill, reject or reject with error
  var called = false;
  function onError(value) {
    if (called) {
      return;
    }
    called = true;
    handlers.reject(self, value);
  }

  function onSuccess(value) {
    if (called) {
      return;
    }
    called = true;
    handlers.resolve(self, value);
  }

  function tryToUnwrap() {
    thenable(onSuccess, onError);
  }

  var result = tryCatch(tryToUnwrap);
  if (result.status === 'error') {
    onError(result.value);
  }
}

function tryCatch(func, value) {
  var out = {};
  try {
    out.value = func(value);
    out.status = 'success';
  } catch (e) {
    out.status = 'error';
    out.value = e;
  }
  return out;
}

Promise.resolve = resolve;
function resolve(value) {
  if (value instanceof this) {
    return value;
  }
  return handlers.resolve(new this(INTERNAL), value);
}

Promise.reject = reject;
function reject(reason) {
  var promise = new this(INTERNAL);
  return handlers.reject(promise, reason);
}

Promise.all = all;
function all(iterable) {
  var self = this;
  if (Object.prototype.toString.call(iterable) !== '[object Array]') {
    return this.reject(new TypeError('must be an array'));
  }

  var len = iterable.length;
  var called = false;
  if (!len) {
    return this.resolve([]);
  }

  var values = new Array(len);
  var resolved = 0;
  var i = -1;
  var promise = new this(INTERNAL);

  while (++i < len) {
    allResolver(iterable[i], i);
  }
  return promise;
  function allResolver(value, i) {
    self.resolve(value).then(resolveFromAll, function (error) {
      if (!called) {
        called = true;
        handlers.reject(promise, error);
      }
    });
    function resolveFromAll(outValue) {
      values[i] = outValue;
      if (++resolved === len && !called) {
        called = true;
        handlers.resolve(promise, values);
      }
    }
  }
}

Promise.race = race;
function race(iterable) {
  var self = this;
  if (Object.prototype.toString.call(iterable) !== '[object Array]') {
    return this.reject(new TypeError('must be an array'));
  }

  var len = iterable.length;
  var called = false;
  if (!len) {
    return this.resolve([]);
  }

  var i = -1;
  var promise = new this(INTERNAL);

  while (++i < len) {
    resolver(iterable[i]);
  }
  return promise;
  function resolver(value) {
    self.resolve(value).then(function (response) {
      if (!called) {
        called = true;
        handlers.resolve(promise, response);
      }
    }, function (error) {
      if (!called) {
        called = true;
        handlers.reject(promise, error);
      }
    });
  }
}

},{"immediate":48}],53:[function(require,module,exports){
(function (global){
'use strict';
if (typeof global.Promise !== 'function') {
  global.Promise = require('./lib');
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./lib":52}],54:[function(require,module,exports){
/**
 * Helpers.
 */

var s = 1000
var m = s * 60
var h = m * 60
var d = h * 24
var y = d * 365.25

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function (val, options) {
  options = options || {}
  var type = typeof val
  if (type === 'string' && val.length > 0) {
    return parse(val)
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ?
			fmtLong(val) :
			fmtShort(val)
  }
  throw new Error('val is not a non-empty string or a valid number. val=' + JSON.stringify(val))
}

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str)
  if (str.length > 10000) {
    return
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str)
  if (!match) {
    return
  }
  var n = parseFloat(match[1])
  var type = (match[2] || 'ms').toLowerCase()
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y
    case 'days':
    case 'day':
    case 'd':
      return n * d
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n
    default:
      return undefined
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd'
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h'
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm'
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's'
  }
  return ms + 'ms'
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') ||
    plural(ms, h, 'hour') ||
    plural(ms, m, 'minute') ||
    plural(ms, s, 'second') ||
    ms + ' ms'
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name
  }
  return Math.ceil(ms / n) + ' ' + name + 's'
}

},{}],55:[function(require,module,exports){
'use strict';

// modified from https://github.com/es-shims/es5-shim
var has = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;
var slice = Array.prototype.slice;
var isArgs = require('./isArguments');
var isEnumerable = Object.prototype.propertyIsEnumerable;
var hasDontEnumBug = !isEnumerable.call({ toString: null }, 'toString');
var hasProtoEnumBug = isEnumerable.call(function () {}, 'prototype');
var dontEnums = [
	'toString',
	'toLocaleString',
	'valueOf',
	'hasOwnProperty',
	'isPrototypeOf',
	'propertyIsEnumerable',
	'constructor'
];
var equalsConstructorPrototype = function (o) {
	var ctor = o.constructor;
	return ctor && ctor.prototype === o;
};
var excludedKeys = {
	$console: true,
	$external: true,
	$frame: true,
	$frameElement: true,
	$frames: true,
	$innerHeight: true,
	$innerWidth: true,
	$outerHeight: true,
	$outerWidth: true,
	$pageXOffset: true,
	$pageYOffset: true,
	$parent: true,
	$scrollLeft: true,
	$scrollTop: true,
	$scrollX: true,
	$scrollY: true,
	$self: true,
	$webkitIndexedDB: true,
	$webkitStorageInfo: true,
	$window: true
};
var hasAutomationEqualityBug = (function () {
	/* global window */
	if (typeof window === 'undefined') { return false; }
	for (var k in window) {
		try {
			if (!excludedKeys['$' + k] && has.call(window, k) && window[k] !== null && typeof window[k] === 'object') {
				try {
					equalsConstructorPrototype(window[k]);
				} catch (e) {
					return true;
				}
			}
		} catch (e) {
			return true;
		}
	}
	return false;
}());
var equalsConstructorPrototypeIfNotBuggy = function (o) {
	/* global window */
	if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
		return equalsConstructorPrototype(o);
	}
	try {
		return equalsConstructorPrototype(o);
	} catch (e) {
		return false;
	}
};

var keysShim = function keys(object) {
	var isObject = object !== null && typeof object === 'object';
	var isFunction = toStr.call(object) === '[object Function]';
	var isArguments = isArgs(object);
	var isString = isObject && toStr.call(object) === '[object String]';
	var theKeys = [];

	if (!isObject && !isFunction && !isArguments) {
		throw new TypeError('Object.keys called on a non-object');
	}

	var skipProto = hasProtoEnumBug && isFunction;
	if (isString && object.length > 0 && !has.call(object, 0)) {
		for (var i = 0; i < object.length; ++i) {
			theKeys.push(String(i));
		}
	}

	if (isArguments && object.length > 0) {
		for (var j = 0; j < object.length; ++j) {
			theKeys.push(String(j));
		}
	} else {
		for (var name in object) {
			if (!(skipProto && name === 'prototype') && has.call(object, name)) {
				theKeys.push(String(name));
			}
		}
	}

	if (hasDontEnumBug) {
		var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);

		for (var k = 0; k < dontEnums.length; ++k) {
			if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
				theKeys.push(dontEnums[k]);
			}
		}
	}
	return theKeys;
};

keysShim.shim = function shimObjectKeys() {
	if (Object.keys) {
		var keysWorksWithArguments = (function () {
			// Safari 5.0 bug
			return (Object.keys(arguments) || '').length === 2;
		}(1, 2));
		if (!keysWorksWithArguments) {
			var originalKeys = Object.keys;
			Object.keys = function keys(object) {
				if (isArgs(object)) {
					return originalKeys(slice.call(object));
				} else {
					return originalKeys(object);
				}
			};
		}
	} else {
		Object.keys = keysShim;
	}
	return Object.keys || keysShim;
};

module.exports = keysShim;

},{"./isArguments":56}],56:[function(require,module,exports){
'use strict';

var toStr = Object.prototype.toString;

module.exports = function isArguments(value) {
	var str = toStr.call(value);
	var isArgs = str === '[object Arguments]';
	if (!isArgs) {
		isArgs = str !== '[object Array]' &&
			value !== null &&
			typeof value === 'object' &&
			typeof value.length === 'number' &&
			value.length >= 0 &&
			toStr.call(value.callee) === '[object Function]';
	}
	return isArgs;
};

},{}],57:[function(require,module,exports){
'use strict';

var keys = require('object-keys');

module.exports = function hasSymbols() {
	if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') { return false; }
	if (typeof Symbol.iterator === 'symbol') { return true; }

	var obj = {};
	var sym = Symbol('test');
	var symObj = Object(sym);
	if (typeof sym === 'string') { return false; }

	if (Object.prototype.toString.call(sym) !== '[object Symbol]') { return false; }
	if (Object.prototype.toString.call(symObj) !== '[object Symbol]') { return false; }

	// temp disabled per https://github.com/ljharb/object.assign/issues/17
	// if (sym instanceof Symbol) { return false; }
	// temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
	// if (!(symObj instanceof Symbol)) { return false; }

	var symVal = 42;
	obj[sym] = symVal;
	for (sym in obj) { return false; }
	if (keys(obj).length !== 0) { return false; }
	if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) { return false; }

	if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) { return false; }

	var syms = Object.getOwnPropertySymbols(obj);
	if (syms.length !== 1 || syms[0] !== sym) { return false; }

	if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) { return false; }

	if (typeof Object.getOwnPropertyDescriptor === 'function') {
		var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
		if (descriptor.value !== symVal || descriptor.enumerable !== true) { return false; }
	}

	return true;
};

},{"object-keys":55}],58:[function(require,module,exports){
'use strict';

// modified from https://github.com/es-shims/es6-shim
var keys = require('object-keys');
var bind = require('function-bind');
var canBeObject = function (obj) {
	return typeof obj !== 'undefined' && obj !== null;
};
var hasSymbols = require('./hasSymbols')();
var toObject = Object;
var push = bind.call(Function.call, Array.prototype.push);
var propIsEnumerable = bind.call(Function.call, Object.prototype.propertyIsEnumerable);
var originalGetSymbols = hasSymbols ? Object.getOwnPropertySymbols : null;

module.exports = function assign(target, source1) {
	if (!canBeObject(target)) { throw new TypeError('target must be an object'); }
	var objTarget = toObject(target);
	var s, source, i, props, syms, value, key;
	for (s = 1; s < arguments.length; ++s) {
		source = toObject(arguments[s]);
		props = keys(source);
		var getSymbols = hasSymbols && (Object.getOwnPropertySymbols || originalGetSymbols);
		if (getSymbols) {
			syms = getSymbols(source);
			for (i = 0; i < syms.length; ++i) {
				key = syms[i];
				if (propIsEnumerable(source, key)) {
					push(props, key);
				}
			}
		}
		for (i = 0; i < props.length; ++i) {
			key = props[i];
			value = source[key];
			if (propIsEnumerable(source, key)) {
				objTarget[key] = value;
			}
		}
	}
	return objTarget;
};

},{"./hasSymbols":57,"function-bind":46,"object-keys":55}],59:[function(require,module,exports){
'use strict';

var defineProperties = require('define-properties');

var implementation = require('./implementation');
var getPolyfill = require('./polyfill');
var shim = require('./shim');

var polyfill = getPolyfill();

defineProperties(polyfill, {
	implementation: implementation,
	getPolyfill: getPolyfill,
	shim: shim
});

module.exports = polyfill;

},{"./implementation":58,"./polyfill":60,"./shim":61,"define-properties":37}],60:[function(require,module,exports){
'use strict';

var implementation = require('./implementation');

var lacksProperEnumerationOrder = function () {
	if (!Object.assign) {
		return false;
	}
	// v8, specifically in node 4.x, has a bug with incorrect property enumeration order
	// note: this does not detect the bug unless there's 20 characters
	var str = 'abcdefghijklmnopqrst';
	var letters = str.split('');
	var map = {};
	for (var i = 0; i < letters.length; ++i) {
		map[letters[i]] = letters[i];
	}
	var obj = Object.assign({}, map);
	var actual = '';
	for (var k in obj) {
		actual += k;
	}
	return str !== actual;
};

var assignHasPendingExceptions = function () {
	if (!Object.assign || !Object.preventExtensions) {
		return false;
	}
	// Firefox 37 still has "pending exception" logic in its Object.assign implementation,
	// which is 72% slower than our shim, and Firefox 40's native implementation.
	var thrower = Object.preventExtensions({ 1: 2 });
	try {
		Object.assign(thrower, 'xy');
	} catch (e) {
		return thrower[1] === 'y';
	}
	return false;
};

module.exports = function getPolyfill() {
	if (!Object.assign) {
		return implementation;
	}
	if (lacksProperEnumerationOrder()) {
		return implementation;
	}
	if (assignHasPendingExceptions()) {
		return implementation;
	}
	return Object.assign;
};

},{"./implementation":58}],61:[function(require,module,exports){
'use strict';

var define = require('define-properties');
var getPolyfill = require('./polyfill');

module.exports = function shimAssign() {
	var polyfill = getPolyfill();
	define(
		Object,
		{ assign: polyfill },
		{ assign: function () { return Object.assign !== polyfill; } }
	);
	return polyfill;
};

},{"./polyfill":60,"define-properties":37}],62:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))
},{"_process":63}],63:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],64:[function(require,module,exports){
module.exports = require("./lib/_stream_duplex.js")

},{"./lib/_stream_duplex.js":65}],65:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.

module.exports = Duplex;

/*<replacement>*/
var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) keys.push(key);
  return keys;
}
/*</replacement>*/


/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

var Readable = require('./_stream_readable');
var Writable = require('./_stream_writable');

util.inherits(Duplex, Readable);

forEach(objectKeys(Writable.prototype), function(method) {
  if (!Duplex.prototype[method])
    Duplex.prototype[method] = Writable.prototype[method];
});

function Duplex(options) {
  if (!(this instanceof Duplex))
    return new Duplex(options);

  Readable.call(this, options);
  Writable.call(this, options);

  if (options && options.readable === false)
    this.readable = false;

  if (options && options.writable === false)
    this.writable = false;

  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false)
    this.allowHalfOpen = false;

  this.once('end', onend);
}

// the no-half-open enforcer
function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended)
    return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  process.nextTick(this.end.bind(this));
}

function forEach (xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

}).call(this,require('_process'))
},{"./_stream_readable":67,"./_stream_writable":69,"_process":63,"core-util-is":9,"inherits":49}],66:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.

module.exports = PassThrough;

var Transform = require('./_stream_transform');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

util.inherits(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough))
    return new PassThrough(options);

  Transform.call(this, options);
}

PassThrough.prototype._transform = function(chunk, encoding, cb) {
  cb(null, chunk);
};

},{"./_stream_transform":68,"core-util-is":9,"inherits":49}],67:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = Readable;

/*<replacement>*/
var isArray = require('isarray');
/*</replacement>*/


/*<replacement>*/
var Buffer = require('buffer').Buffer;
/*</replacement>*/

Readable.ReadableState = ReadableState;

var EE = require('events').EventEmitter;

/*<replacement>*/
if (!EE.listenerCount) EE.listenerCount = function(emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

var Stream = require('stream');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

var StringDecoder;


/*<replacement>*/
var debug = require('util');
if (debug && debug.debuglog) {
  debug = debug.debuglog('stream');
} else {
  debug = function () {};
}
/*</replacement>*/


util.inherits(Readable, Stream);

function ReadableState(options, stream) {
  var Duplex = require('./_stream_duplex');

  options = options || {};

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  var hwm = options.highWaterMark;
  var defaultHwm = options.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = (hwm || hwm === 0) ? hwm : defaultHwm;

  // cast to ints.
  this.highWaterMark = ~~this.highWaterMark;

  this.buffer = [];
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;


  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex)
    this.objectMode = this.objectMode || !!options.readableObjectMode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // when piping, we only care about 'readable' events that happen
  // after read()ing all the bytes and not getting any pushback.
  this.ranOut = false;

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;

  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    if (!StringDecoder)
      StringDecoder = require('string_decoder/').StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  var Duplex = require('./_stream_duplex');

  if (!(this instanceof Readable))
    return new Readable(options);

  this._readableState = new ReadableState(options, this);

  // legacy
  this.readable = true;

  Stream.call(this);
}

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function(chunk, encoding) {
  var state = this._readableState;

  if (util.isString(chunk) && !state.objectMode) {
    encoding = encoding || state.defaultEncoding;
    if (encoding !== state.encoding) {
      chunk = new Buffer(chunk, encoding);
      encoding = '';
    }
  }

  return readableAddChunk(this, state, chunk, encoding, false);
};

// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function(chunk) {
  var state = this._readableState;
  return readableAddChunk(this, state, chunk, '', true);
};

function readableAddChunk(stream, state, chunk, encoding, addToFront) {
  var er = chunkInvalid(state, chunk);
  if (er) {
    stream.emit('error', er);
  } else if (util.isNullOrUndefined(chunk)) {
    state.reading = false;
    if (!state.ended)
      onEofChunk(stream, state);
  } else if (state.objectMode || chunk && chunk.length > 0) {
    if (state.ended && !addToFront) {
      var e = new Error('stream.push() after EOF');
      stream.emit('error', e);
    } else if (state.endEmitted && addToFront) {
      var e = new Error('stream.unshift() after end event');
      stream.emit('error', e);
    } else {
      if (state.decoder && !addToFront && !encoding)
        chunk = state.decoder.write(chunk);

      if (!addToFront)
        state.reading = false;

      // if we want the data now, just emit it.
      if (state.flowing && state.length === 0 && !state.sync) {
        stream.emit('data', chunk);
        stream.read(0);
      } else {
        // update the buffer info.
        state.length += state.objectMode ? 1 : chunk.length;
        if (addToFront)
          state.buffer.unshift(chunk);
        else
          state.buffer.push(chunk);

        if (state.needReadable)
          emitReadable(stream);
      }

      maybeReadMore(stream, state);
    }
  } else if (!addToFront) {
    state.reading = false;
  }

  return needMoreData(state);
}



// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(state) {
  return !state.ended &&
         (state.needReadable ||
          state.length < state.highWaterMark ||
          state.length === 0);
}

// backwards compatibility.
Readable.prototype.setEncoding = function(enc) {
  if (!StringDecoder)
    StringDecoder = require('string_decoder/').StringDecoder;
  this._readableState.decoder = new StringDecoder(enc);
  this._readableState.encoding = enc;
  return this;
};

// Don't raise the hwm > 128MB
var MAX_HWM = 0x800000;
function roundUpToNextPowerOf2(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2
    n--;
    for (var p = 1; p < 32; p <<= 1) n |= n >> p;
    n++;
  }
  return n;
}

function howMuchToRead(n, state) {
  if (state.length === 0 && state.ended)
    return 0;

  if (state.objectMode)
    return n === 0 ? 0 : 1;

  if (isNaN(n) || util.isNull(n)) {
    // only flow one buffer at a time
    if (state.flowing && state.buffer.length)
      return state.buffer[0].length;
    else
      return state.length;
  }

  if (n <= 0)
    return 0;

  // If we're asking for more than the target buffer level,
  // then raise the water mark.  Bump up to the next highest
  // power of 2, to prevent increasing it excessively in tiny
  // amounts.
  if (n > state.highWaterMark)
    state.highWaterMark = roundUpToNextPowerOf2(n);

  // don't have that much.  return null, unless we've ended.
  if (n > state.length) {
    if (!state.ended) {
      state.needReadable = true;
      return 0;
    } else
      return state.length;
  }

  return n;
}

// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function(n) {
  debug('read', n);
  var state = this._readableState;
  var nOrig = n;

  if (!util.isNumber(n) || n > 0)
    state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 &&
      state.needReadable &&
      (state.length >= state.highWaterMark || state.ended)) {
    debug('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended)
      endReadable(this);
    else
      emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    if (state.length === 0)
      endReadable(this);
    return null;
  }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
  var doRead = state.needReadable;
  debug('need readable', doRead);

  // if we currently have less than the highWaterMark, then also read some
  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug('length less than watermark', doRead);
  }

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading) {
    doRead = false;
    debug('reading or ended', doRead);
  }

  if (doRead) {
    debug('do read');
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0)
      state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
  }

  // If _read pushed data synchronously, then `reading` will be false,
  // and we need to re-evaluate how much data we can return to the user.
  if (doRead && !state.reading)
    n = howMuchToRead(nOrig, state);

  var ret;
  if (n > 0)
    ret = fromList(n, state);
  else
    ret = null;

  if (util.isNull(ret)) {
    state.needReadable = true;
    n = 0;
  }

  state.length -= n;

  // If we have nothing in the buffer, then we want to know
  // as soon as we *do* get something into the buffer.
  if (state.length === 0 && !state.ended)
    state.needReadable = true;

  // If we tried to read() past the EOF, then emit end on the next tick.
  if (nOrig !== n && state.ended && state.length === 0)
    endReadable(this);

  if (!util.isNull(ret))
    this.emit('data', ret);

  return ret;
};

function chunkInvalid(state, chunk) {
  var er = null;
  if (!util.isBuffer(chunk) &&
      !util.isString(chunk) &&
      !util.isNullOrUndefined(chunk) &&
      !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  return er;
}


function onEofChunk(stream, state) {
  if (state.decoder && !state.ended) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;

  // emit 'readable' now to make sure it gets picked up.
  emitReadable(stream);
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;
  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing);
    state.emittedReadable = true;
    if (state.sync)
      process.nextTick(function() {
        emitReadable_(stream);
      });
    else
      emitReadable_(stream);
  }
}

function emitReadable_(stream) {
  debug('emit readable');
  stream.emit('readable');
  flow(stream);
}


// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    process.nextTick(function() {
      maybeReadMore_(stream, state);
    });
  }
}

function maybeReadMore_(stream, state) {
  var len = state.length;
  while (!state.reading && !state.flowing && !state.ended &&
         state.length < state.highWaterMark) {
    debug('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length)
      // didn't get any data, stop spinning.
      break;
    else
      len = state.length;
  }
  state.readingMore = false;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function(n) {
  this.emit('error', new Error('not implemented'));
};

Readable.prototype.pipe = function(dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }
  state.pipesCount += 1;
  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);

  var doEnd = (!pipeOpts || pipeOpts.end !== false) &&
              dest !== process.stdout &&
              dest !== process.stderr;

  var endFn = doEnd ? onend : cleanup;
  if (state.endEmitted)
    process.nextTick(endFn);
  else
    src.once('end', endFn);

  dest.on('unpipe', onunpipe);
  function onunpipe(readable) {
    debug('onunpipe');
    if (readable === src) {
      cleanup();
    }
  }

  function onend() {
    debug('onend');
    dest.end();
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);

  function cleanup() {
    debug('cleanup');
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', cleanup);
    src.removeListener('data', ondata);

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (state.awaitDrain &&
        (!dest._writableState || dest._writableState.needDrain))
      ondrain();
  }

  src.on('data', ondata);
  function ondata(chunk) {
    debug('ondata');
    var ret = dest.write(chunk);
    if (false === ret) {
      debug('false write response, pause',
            src._readableState.awaitDrain);
      src._readableState.awaitDrain++;
      src.pause();
    }
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  function onerror(er) {
    debug('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    if (EE.listenerCount(dest, 'error') === 0)
      dest.emit('error', er);
  }
  // This is a brutally ugly hack to make sure that our error handler
  // is attached before any userland ones.  NEVER DO THIS.
  if (!dest._events || !dest._events.error)
    dest.on('error', onerror);
  else if (isArray(dest._events.error))
    dest._events.error.unshift(onerror);
  else
    dest._events.error = [onerror, dest._events.error];



  // Both close and finish should trigger unpipe, but only once.
  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }
  dest.once('close', onclose);
  function onfinish() {
    debug('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);

  function unpipe() {
    debug('unpipe');
    src.unpipe(dest);
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }

  return dest;
};

function pipeOnDrain(src) {
  return function() {
    var state = src._readableState;
    debug('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain)
      state.awaitDrain--;
    if (state.awaitDrain === 0 && EE.listenerCount(src, 'data')) {
      state.flowing = true;
      flow(src);
    }
  };
}


Readable.prototype.unpipe = function(dest) {
  var state = this._readableState;

  // if we're not piping anywhere, then do nothing.
  if (state.pipesCount === 0)
    return this;

  // just one destination.  most common case.
  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes)
      return this;

    if (!dest)
      dest = state.pipes;

    // got a match.
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    if (dest)
      dest.emit('unpipe', this);
    return this;
  }

  // slow case. multiple pipe destinations.

  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;

    for (var i = 0; i < len; i++)
      dests[i].emit('unpipe', this);
    return this;
  }

  // try to find the right one.
  var i = indexOf(state.pipes, dest);
  if (i === -1)
    return this;

  state.pipes.splice(i, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1)
    state.pipes = state.pipes[0];

  dest.emit('unpipe', this);

  return this;
};

// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function(ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);

  // If listening to data, and it has not explicitly been paused,
  // then call resume to start the flow of data on the next tick.
  if (ev === 'data' && false !== this._readableState.flowing) {
    this.resume();
  }

  if (ev === 'readable' && this.readable) {
    var state = this._readableState;
    if (!state.readableListening) {
      state.readableListening = true;
      state.emittedReadable = false;
      state.needReadable = true;
      if (!state.reading) {
        var self = this;
        process.nextTick(function() {
          debug('readable nexttick read 0');
          self.read(0);
        });
      } else if (state.length) {
        emitReadable(this, state);
      }
    }
  }

  return res;
};
Readable.prototype.addListener = Readable.prototype.on;

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function() {
  var state = this._readableState;
  if (!state.flowing) {
    debug('resume');
    state.flowing = true;
    if (!state.reading) {
      debug('resume read 0');
      this.read(0);
    }
    resume(this, state);
  }
  return this;
};

function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    process.nextTick(function() {
      resume_(stream, state);
    });
  }
}

function resume_(stream, state) {
  state.resumeScheduled = false;
  stream.emit('resume');
  flow(stream);
  if (state.flowing && !state.reading)
    stream.read(0);
}

Readable.prototype.pause = function() {
  debug('call pause flowing=%j', this._readableState.flowing);
  if (false !== this._readableState.flowing) {
    debug('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }
  return this;
};

function flow(stream) {
  var state = stream._readableState;
  debug('flow', state.flowing);
  if (state.flowing) {
    do {
      var chunk = stream.read();
    } while (null !== chunk && state.flowing);
  }
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function(stream) {
  var state = this._readableState;
  var paused = false;

  var self = this;
  stream.on('end', function() {
    debug('wrapped end');
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length)
        self.push(chunk);
    }

    self.push(null);
  });

  stream.on('data', function(chunk) {
    debug('wrapped data');
    if (state.decoder)
      chunk = state.decoder.write(chunk);
    if (!chunk || !state.objectMode && !chunk.length)
      return;

    var ret = self.push(chunk);
    if (!ret) {
      paused = true;
      stream.pause();
    }
  });

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (util.isFunction(stream[i]) && util.isUndefined(this[i])) {
      this[i] = function(method) { return function() {
        return stream[method].apply(stream, arguments);
      }}(i);
    }
  }

  // proxy certain important events.
  var events = ['error', 'close', 'destroy', 'pause', 'resume'];
  forEach(events, function(ev) {
    stream.on(ev, self.emit.bind(self, ev));
  });

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  self._read = function(n) {
    debug('wrapped _read', n);
    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return self;
};



// exposed for testing purposes only.
Readable._fromList = fromList;

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
function fromList(n, state) {
  var list = state.buffer;
  var length = state.length;
  var stringMode = !!state.decoder;
  var objectMode = !!state.objectMode;
  var ret;

  // nothing in the list, definitely empty.
  if (list.length === 0)
    return null;

  if (length === 0)
    ret = null;
  else if (objectMode)
    ret = list.shift();
  else if (!n || n >= length) {
    // read it all, truncate the array.
    if (stringMode)
      ret = list.join('');
    else
      ret = Buffer.concat(list, length);
    list.length = 0;
  } else {
    // read just some of it.
    if (n < list[0].length) {
      // just take a part of the first list item.
      // slice is the same for buffers and strings.
      var buf = list[0];
      ret = buf.slice(0, n);
      list[0] = buf.slice(n);
    } else if (n === list[0].length) {
      // first list is a perfect match
      ret = list.shift();
    } else {
      // complex case.
      // we have enough to cover it, but it spans past the first buffer.
      if (stringMode)
        ret = '';
      else
        ret = new Buffer(n);

      var c = 0;
      for (var i = 0, l = list.length; i < l && c < n; i++) {
        var buf = list[0];
        var cpy = Math.min(n - c, buf.length);

        if (stringMode)
          ret += buf.slice(0, cpy);
        else
          buf.copy(ret, c, 0, cpy);

        if (cpy < buf.length)
          list[0] = buf.slice(cpy);
        else
          list.shift();

        c += cpy;
      }
    }
  }

  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;

  // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.
  if (state.length > 0)
    throw new Error('endReadable called on non-empty stream');

  if (!state.endEmitted) {
    state.ended = true;
    process.nextTick(function() {
      // Check that we didn't get one last unshift.
      if (!state.endEmitted && state.length === 0) {
        state.endEmitted = true;
        stream.readable = false;
        stream.emit('end');
      }
    });
  }
}

function forEach (xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

function indexOf (xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}

}).call(this,require('_process'))
},{"./_stream_duplex":65,"_process":63,"buffer":7,"core-util-is":9,"events":39,"inherits":49,"isarray":51,"stream":78,"string_decoder/":79,"util":4}],68:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.


// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.

module.exports = Transform;

var Duplex = require('./_stream_duplex');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

util.inherits(Transform, Duplex);


function TransformState(options, stream) {
  this.afterTransform = function(er, data) {
    return afterTransform(stream, er, data);
  };

  this.needTransform = false;
  this.transforming = false;
  this.writecb = null;
  this.writechunk = null;
}

function afterTransform(stream, er, data) {
  var ts = stream._transformState;
  ts.transforming = false;

  var cb = ts.writecb;

  if (!cb)
    return stream.emit('error', new Error('no writecb in Transform class'));

  ts.writechunk = null;
  ts.writecb = null;

  if (!util.isNullOrUndefined(data))
    stream.push(data);

  if (cb)
    cb(er);

  var rs = stream._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    stream._read(rs.highWaterMark);
  }
}


function Transform(options) {
  if (!(this instanceof Transform))
    return new Transform(options);

  Duplex.call(this, options);

  this._transformState = new TransformState(options, this);

  // when the writable side finishes, then flush out anything remaining.
  var stream = this;

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;

  this.once('prefinish', function() {
    if (util.isFunction(this._flush))
      this._flush(function(er) {
        done(stream, er);
      });
    else
      done(stream);
  });
}

Transform.prototype.push = function(chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
};

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform = function(chunk, encoding, cb) {
  throw new Error('not implemented');
};

Transform.prototype._write = function(chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;
  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform ||
        rs.needReadable ||
        rs.length < rs.highWaterMark)
      this._read(rs.highWaterMark);
  }
};

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read = function(n) {
  var ts = this._transformState;

  if (!util.isNull(ts.writechunk) && ts.writecb && !ts.transforming) {
    ts.transforming = true;
    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};


function done(stream, er) {
  if (er)
    return stream.emit('error', er);

  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  var ws = stream._writableState;
  var ts = stream._transformState;

  if (ws.length)
    throw new Error('calling transform done when ws.length != 0');

  if (ts.transforming)
    throw new Error('calling transform done when still transforming');

  return stream.push(null);
}

},{"./_stream_duplex":65,"core-util-is":9,"inherits":49}],69:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// A bit simpler than readable streams.
// Implement an async ._write(chunk, cb), and it'll handle all
// the drain event emission and buffering.

module.exports = Writable;

/*<replacement>*/
var Buffer = require('buffer').Buffer;
/*</replacement>*/

Writable.WritableState = WritableState;


/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

var Stream = require('stream');

util.inherits(Writable, Stream);

function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
}

function WritableState(options, stream) {
  var Duplex = require('./_stream_duplex');

  options = options || {};

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  var hwm = options.highWaterMark;
  var defaultHwm = options.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = (hwm || hwm === 0) ? hwm : defaultHwm;

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex)
    this.objectMode = this.objectMode || !!options.writableObjectMode;

  // cast to ints.
  this.highWaterMark = ~~this.highWaterMark;

  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  // a flag to see when we're in the middle of a write.
  this.writing = false;

  // when true all writes will be buffered until .uncork() call
  this.corked = 0;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false;

  // the callback that's passed to _write(chunk,cb)
  this.onwrite = function(er) {
    onwrite(stream, er);
  };

  // the callback that the user supplies to write(chunk,encoding,cb)
  this.writecb = null;

  // the amount that is being written when _write is called.
  this.writelen = 0;

  this.buffer = [];

  // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted
  this.pendingcb = 0;

  // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams
  this.prefinished = false;

  // True if the error was already emitted and should not be thrown again
  this.errorEmitted = false;
}

function Writable(options) {
  var Duplex = require('./_stream_duplex');

  // Writable ctor is applied to Duplexes, though they're not
  // instanceof Writable, they're instanceof Readable.
  if (!(this instanceof Writable) && !(this instanceof Duplex))
    return new Writable(options);

  this._writableState = new WritableState(options, this);

  // legacy.
  this.writable = true;

  Stream.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function() {
  this.emit('error', new Error('Cannot pipe. Not readable.'));
};


function writeAfterEnd(stream, state, cb) {
  var er = new Error('write after end');
  // TODO: defer error events consistently everywhere, not just the cb
  stream.emit('error', er);
  process.nextTick(function() {
    cb(er);
  });
}

// If we get something that is not a buffer, string, null, or undefined,
// and we're not in objectMode, then that's an error.
// Otherwise stream chunks are all considered to be of length=1, and the
// watermarks determine how many objects to keep in the buffer, rather than
// how many bytes or characters.
function validChunk(stream, state, chunk, cb) {
  var valid = true;
  if (!util.isBuffer(chunk) &&
      !util.isString(chunk) &&
      !util.isNullOrUndefined(chunk) &&
      !state.objectMode) {
    var er = new TypeError('Invalid non-string/buffer chunk');
    stream.emit('error', er);
    process.nextTick(function() {
      cb(er);
    });
    valid = false;
  }
  return valid;
}

Writable.prototype.write = function(chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;

  if (util.isFunction(encoding)) {
    cb = encoding;
    encoding = null;
  }

  if (util.isBuffer(chunk))
    encoding = 'buffer';
  else if (!encoding)
    encoding = state.defaultEncoding;

  if (!util.isFunction(cb))
    cb = function() {};

  if (state.ended)
    writeAfterEnd(this, state, cb);
  else if (validChunk(this, state, chunk, cb)) {
    state.pendingcb++;
    ret = writeOrBuffer(this, state, chunk, encoding, cb);
  }

  return ret;
};

Writable.prototype.cork = function() {
  var state = this._writableState;

  state.corked++;
};

Writable.prototype.uncork = function() {
  var state = this._writableState;

  if (state.corked) {
    state.corked--;

    if (!state.writing &&
        !state.corked &&
        !state.finished &&
        !state.bufferProcessing &&
        state.buffer.length)
      clearBuffer(this, state);
  }
};

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode &&
      state.decodeStrings !== false &&
      util.isString(chunk)) {
    chunk = new Buffer(chunk, encoding);
  }
  return chunk;
}

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, chunk, encoding, cb) {
  chunk = decodeChunk(state, chunk, encoding);
  if (util.isBuffer(chunk))
    encoding = 'buffer';
  var len = state.objectMode ? 1 : chunk.length;

  state.length += len;

  var ret = state.length < state.highWaterMark;
  // we must ensure that previous needDrain will not be reset to false.
  if (!ret)
    state.needDrain = true;

  if (state.writing || state.corked)
    state.buffer.push(new WriteReq(chunk, encoding, cb));
  else
    doWrite(stream, state, false, len, chunk, encoding, cb);

  return ret;
}

function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (writev)
    stream._writev(chunk, state.onwrite);
  else
    stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  if (sync)
    process.nextTick(function() {
      state.pendingcb--;
      cb(er);
    });
  else {
    state.pendingcb--;
    cb(er);
  }

  stream._writableState.errorEmitted = true;
  stream.emit('error', er);
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;

  onwriteStateUpdate(state);

  if (er)
    onwriteError(stream, state, sync, er, cb);
  else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(stream, state);

    if (!finished &&
        !state.corked &&
        !state.bufferProcessing &&
        state.buffer.length) {
      clearBuffer(stream, state);
    }

    if (sync) {
      process.nextTick(function() {
        afterWrite(stream, state, finished, cb);
      });
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished)
    onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}


// if there's something in the buffer waiting, then process it
function clearBuffer(stream, state) {
  state.bufferProcessing = true;

  if (stream._writev && state.buffer.length > 1) {
    // Fast case, write everything using _writev()
    var cbs = [];
    for (var c = 0; c < state.buffer.length; c++)
      cbs.push(state.buffer[c].callback);

    // count the one we are adding, as well.
    // TODO(isaacs) clean this up
    state.pendingcb++;
    doWrite(stream, state, true, state.length, state.buffer, '', function(err) {
      for (var i = 0; i < cbs.length; i++) {
        state.pendingcb--;
        cbs[i](err);
      }
    });

    // Clear buffer
    state.buffer = [];
  } else {
    // Slow case, write chunks one-by-one
    for (var c = 0; c < state.buffer.length; c++) {
      var entry = state.buffer[c];
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;

      doWrite(stream, state, false, len, chunk, encoding, cb);

      // if we didn't call the onwrite immediately, then
      // it means that we need to wait until it does.
      // also, that means that the chunk and cb are currently
      // being processed, so move the buffer counter past them.
      if (state.writing) {
        c++;
        break;
      }
    }

    if (c < state.buffer.length)
      state.buffer = state.buffer.slice(c);
    else
      state.buffer.length = 0;
  }

  state.bufferProcessing = false;
}

Writable.prototype._write = function(chunk, encoding, cb) {
  cb(new Error('not implemented'));

};

Writable.prototype._writev = null;

Writable.prototype.end = function(chunk, encoding, cb) {
  var state = this._writableState;

  if (util.isFunction(chunk)) {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (util.isFunction(encoding)) {
    cb = encoding;
    encoding = null;
  }

  if (!util.isNullOrUndefined(chunk))
    this.write(chunk, encoding);

  // .end() fully uncorks
  if (state.corked) {
    state.corked = 1;
    this.uncork();
  }

  // ignore unnecessary end() calls.
  if (!state.ending && !state.finished)
    endWritable(this, state, cb);
};


function needFinish(stream, state) {
  return (state.ending &&
          state.length === 0 &&
          !state.finished &&
          !state.writing);
}

function prefinish(stream, state) {
  if (!state.prefinished) {
    state.prefinished = true;
    stream.emit('prefinish');
  }
}

function finishMaybe(stream, state) {
  var need = needFinish(stream, state);
  if (need) {
    if (state.pendingcb === 0) {
      prefinish(stream, state);
      state.finished = true;
      stream.emit('finish');
    } else
      prefinish(stream, state);
  }
  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished)
      process.nextTick(cb);
    else
      stream.once('finish', cb);
  }
  state.ended = true;
}

}).call(this,require('_process'))
},{"./_stream_duplex":65,"_process":63,"buffer":7,"core-util-is":9,"inherits":49,"stream":78}],70:[function(require,module,exports){
module.exports = require("./lib/_stream_passthrough.js")

},{"./lib/_stream_passthrough.js":66}],71:[function(require,module,exports){
(function (process){
exports = module.exports = require('./lib/_stream_readable.js');
exports.Stream = require('stream');
exports.Readable = exports;
exports.Writable = require('./lib/_stream_writable.js');
exports.Duplex = require('./lib/_stream_duplex.js');
exports.Transform = require('./lib/_stream_transform.js');
exports.PassThrough = require('./lib/_stream_passthrough.js');
if (!process.browser && process.env.READABLE_STREAM === 'disable') {
  module.exports = require('stream');
}

}).call(this,require('_process'))
},{"./lib/_stream_duplex.js":65,"./lib/_stream_passthrough.js":66,"./lib/_stream_readable.js":67,"./lib/_stream_transform.js":68,"./lib/_stream_writable.js":69,"_process":63,"stream":78}],72:[function(require,module,exports){
module.exports = require("./lib/_stream_transform.js")

},{"./lib/_stream_transform.js":68}],73:[function(require,module,exports){
module.exports = require("./lib/_stream_writable.js")

},{"./lib/_stream_writable.js":69}],74:[function(require,module,exports){
(function (process){
'use strict';

var bindings = require('bindings')('serialport.node');
var listUnix = require('./list-unix');

var linux = process.platform !== 'win32' && process.platform !== 'darwin';

function listLinux(callback) {
  callback = callback || function(err) {
    if (err) { this.emit('error', err) }
  }.bind(this);
  return listUnix(callback);
};

var platformOptions = {};
if (process.platform !== 'win32') {
  platformOptions = {
    vmin: 1,
    vtime: 0
  };
}

module.exports = {
  close: bindings.close,
  drain: bindings.drain,
  flush: bindings.flush,
  list: linux ? listLinux : bindings.list,
  open: bindings.open,
  SerialportPoller: bindings.SerialportPoller,
  set: bindings.set,
  update: bindings.update,
  write: bindings.write,
  platformOptions: platformOptions
};

}).call(this,require('_process'))
},{"./list-unix":75,"_process":63,"bindings":3}],75:[function(require,module,exports){
'use strict';

require('lie/polyfill');
var childProcess = require('child_process');
var fs = require('fs');
var path = require('path');

function promisify(func) {
  return function(arg) {
    return new Promise(function(resolve, reject) {
      func(arg, function(err, data) {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    });
  };
}

function promisedFilter(func) {
  return function(data) {
    var shouldKeep = data.map(func);
    return Promise.all(shouldKeep).then(function(keep) {
      return data.filter(function(path, index) {
        return keep[index];
      });
    });
  };
}

var statAsync = promisify(fs.stat);
var readdirAsync = promisify(fs.readdir);
var execAsync = promisify(childProcess.exec);

function udevParser(output) {
  var udevInfo = output.split('\n').reduce(function(info, line) {
    if (!line || line.trim() === '') {
      return info;
    }
    var parts = line.split('=').map(function(part) {
      return part.trim();
    });

    info[parts[0].toLowerCase()] = parts[1];

    return info;
  }, {});

  var pnpId;
  if (udevInfo.devlinks) {
    udevInfo.devlinks.split(' ').forEach(function(path) {
      if (path.indexOf('/by-id/') === -1) { return }
      pnpId = path.substring(path.lastIndexOf('/') + 1);
    });
  }

  var vendorId = udevInfo.id_vendor_id;
  if (vendorId && vendorId.substring(0, 2) !== '0x') {
    vendorId = '0x' + vendorId;
  }

  var productId = udevInfo.id_model_id;
  if (productId && productId.substring(0, 2) !== '0x') {
    productId = '0x' + productId;
  }

  return {
    comName: udevInfo.devname,
    manufacturer: udevInfo.id_vendor,
    serialNumber: udevInfo.id_serial,
    pnpId: pnpId,
    vendorId: vendorId,
    productId: productId
  };
}

function checkPathAndDevice(path) {
  // get only serial port names
  if (!(/(tty(S|ACM|USB|AMA|MFD)|rfcomm)/).test(path)) {
    return false;
  }
  return statAsync(path).then(function(stats) {
    return stats.isCharacterDevice();
  });
}

function lookupPort(file) {
  var udevadm = 'udevadm info --query=property -p $(udevadm info -q path -n ' + file + ')';
  return execAsync(udevadm).then(udevParser);
}

function listUnix(callback) {
  var dirName = '/dev';
  readdirAsync(dirName)
    .catch(function(err) {
      // if this directory is not found we just pretend everything is OK
      // TODO Depreciated this check?
      if (err.errno === 34) {
        return [];
      }
      throw err;
    })
    .then(function(data) { return data.map(function(file) { return path.join(dirName, file) }) })
    .then(promisedFilter(checkPathAndDevice))
    .then(function(data) { return Promise.all(data.map(lookupPort)) })
    .then(function(data) { callback(null, data) }, function(err) { callback(err) });
}

module.exports = listUnix;

},{"child_process":6,"fs":6,"lie/polyfill":53,"path":62}],76:[function(require,module,exports){
(function (Buffer){
'use strict';

// Copyright 2011 Chris Williams <chris@iterativedesigns.com>

module.exports = {
  raw: function(emitter, buffer) {
    emitter.emit('data', buffer);
  },

  // encoding: ascii utf8 utf16le ucs2 base64 binary hex
  // More: http://nodejs.org/api/buffer.html#buffer_buffer
  readline: function(delimiter, encoding) {
    if (typeof delimiter === 'undefined' || delimiter === null) { delimiter = '\r' }
    if (typeof encoding === 'undefined' || encoding === null) { encoding = 'utf8' }
    // Delimiter buffer saved in closure
    var data = '';
    return function(emitter, buffer) {
      // Collect data
      data += buffer.toString(encoding);
      // Split collected data by delimiter
      var parts = data.split(delimiter);
      data = parts.pop();
      parts.forEach(function(part) {
        emitter.emit('data', part);
      });
    };
  },

  // Emit a data event every `length` bytes
  byteLength: function(length) {
    var data = new Buffer(0);
    return function(emitter, buffer) {
      data = Buffer.concat([data, buffer]);
      while (data.length >= length) {
        var out = data.slice(0, length);
        data = data.slice(length);
        emitter.emit('data', out);
      }
    };
  },

  // Emit a data event each time a byte sequence (delimiter is an array of byte) is found
  // Sample usage : byteDelimiter([10, 13])
  byteDelimiter: function(delimiter) {
    if (Object.prototype.toString.call(delimiter) !== '[object Array]') {
      delimiter = [ delimiter ];
    }
    var buf = [];
    var nextDelimIndex = 0;
    return function(emitter, buffer) {
      for (var i = 0; i < buffer.length; i++) {
        buf[buf.length] = buffer[i];
        if (buf[buf.length - 1] === delimiter[nextDelimIndex]) {
          nextDelimIndex++;
        }
        if (nextDelimIndex === delimiter.length) {
          emitter.emit('data', buf);
          buf = [];
          nextDelimIndex = 0;
        }
      }
    };
  }
};

}).call(this,require("buffer").Buffer)
},{"buffer":7}],77:[function(require,module,exports){
(function (process,Buffer){
'use strict';

// Copyright 2011 Chris Williams <chris@iterativedesigns.com>

// 3rd Party Dependencies
var debug = require('debug')('serialport');

// shims
var assign = require('object.assign').getPolyfill();

// Internal Dependencies
var SerialPortBinding = require('./bindings');
var parsers = require('./parsers');

// Built-ins Dependencies
var fs = require('fs');
var stream = require('stream');
var util = require('util');

//  VALIDATION ARRAYS
var DATABITS = [5, 6, 7, 8];
var STOPBITS = [1, 1.5, 2];
var PARITY = ['none', 'even', 'mark', 'odd', 'space'];
var FLOWCONTROLS = ['xon', 'xoff', 'xany', 'rtscts'];
var SET_OPTIONS = ['brk', 'cts', 'dtr', 'dts', 'rts'];

// Stuff from ReadStream, refactored for our usage:
var kPoolSize = 40 * 1024;
var kMinPoolSpace = 128;

var defaultSettings = {
  baudRate: 9600,
  autoOpen: true,
  parity: 'none',
  xon: false,
  xoff: false,
  xany: false,
  rtscts: false,
  hupcl: true,
  dataBits: 8,
  stopBits: 1,
  bufferSize: 64 * 1024,
  lock: true,
  parser: parsers.raw,
  platformOptions: SerialPortBinding.platformOptions
};

var defaultSetFlags = {
  brk: false,
  cts: false,
  dtr: true,
  dts: false,
  rts: true
};

// deprecate the lowercase version of these options next major release
var LOWERCASE_OPTIONS = [
  'baudRate',
  'dataBits',
  'stopBits',
  'bufferSize',
  'platformOptions'
];

function correctOptions(options) {
  LOWERCASE_OPTIONS.forEach(function(name) {
    var lowerName = name.toLowerCase();
    if (options.hasOwnProperty(lowerName)) {
      var value = options[lowerName];
      delete options[lowerName];
      options[name] = value;
    }
  });
  return options;
}

function SerialPort(path, options, callback) {
  if (typeof callback === 'boolean') {
    throw new TypeError('`openImmediately` is now called `autoOpen` and is a property of options');
  }

  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  options = options || {};

  stream.Stream.call(this);

  if (!path) {
    throw new TypeError('No path specified');
  }

  this.path = path;

  var correctedOptions = correctOptions(options);
  var settings = assign({}, defaultSettings, correctedOptions);

  if (typeof settings.baudRate !== 'number') {
    throw new TypeError('Invalid "baudRate" must be a number got: ' + settings.baudRate);
  }

  if (DATABITS.indexOf(settings.dataBits) === -1) {
    throw new TypeError('Invalid "databits": ' + settings.dataBits);
  }

  if (STOPBITS.indexOf(settings.stopBits) === -1) {
    throw new TypeError('Invalid "stopbits": ' + settings.stopbits);
  }

  if (PARITY.indexOf(settings.parity) === -1) {
    throw new TypeError('Invalid "parity": ' + settings.parity);
  }

  FLOWCONTROLS.forEach(function(control) {
    if (typeof settings[control] !== 'boolean') {
      throw new TypeError('Invalid "' + control + '" is not boolean');
    }
  });

  settings.disconnectedCallback = this._disconnected.bind(this);
  settings.dataCallback = settings.parser.bind(this, this);

  this.fd = null;
  this.paused = true;
  this.opening = false;
  this.closing = false;

  if (process.platform !== 'win32') {
    this.bufferSize = settings.bufferSize;
    this.readable = true;
    this.reading = false;
  }

  this.options = settings;

  if (this.options.autoOpen) {
    // is nextTick necessary?
    process.nextTick(this.open.bind(this, callback));
  }
}

util.inherits(SerialPort, stream.Stream);

SerialPort.prototype._error = function(error, callback) {
  if (callback) {
    callback.call(this, error);
  } else {
    this.emit('error', error);
  }
};

SerialPort.prototype.open = function(callback) {
  if (this.isOpen()) {
    return this._error(new Error('Port is already open'), callback);
  }

  if (this.opening) {
    return this._error(new Error('Port is opening'), callback);
  }

  this.paused = true;
  this.readable = true;
  this.reading = false;
  this.opening = true;

  SerialPortBinding.open(this.path, this.options, function(err, fd) {
    this.opening = false;
    if (err) {
      debug('SerialPortBinding.open had an error', err);
      return this._error(err, callback);
    }
    this.fd = fd;
    this.paused = false;

    if (process.platform !== 'win32') {
      this.serialPoller = new SerialPortBinding.SerialportPoller(this.fd, function(err) {
        if (!err) {
          this._read();
        } else {
          this._disconnected(err);
        }
      }.bind(this));
      this.serialPoller.start();
    }

    this.emit('open');
    if (callback) { callback.call(this, null) }
  }.bind(this));
};

SerialPort.prototype.update = function(options, callback) {
  if (!this.isOpen()) {
    debug('update attempted, but port is not open');
    return this._error(new Error('Port is not open'), callback);
  }

  var correctedOptions = correctOptions(options);
  var settings = assign({}, defaultSettings, correctedOptions);
  this.options.baudRate = settings.baudRate;

  SerialPortBinding.update(this.fd, this.options, function(err) {
    if (err) {
      return this._error(err, callback);
    }
    if (callback) { callback.call(this, null) }
  }.bind(this));
};

SerialPort.prototype.isOpen = function() {
  return this.fd !== null && !this.closing;
};

SerialPort.prototype.write = function(buffer, callback) {
  if (!this.isOpen()) {
    debug('write attempted, but port is not open');
    return this._error(new Error('Port is not open'), callback);
  }

  if (!Buffer.isBuffer(buffer)) {
    buffer = new Buffer(buffer);
  }

  debug('write ' + buffer.length + ' bytes of data');
  SerialPortBinding.write(this.fd, buffer, function(err) {
    if (err) {
      debug('SerialPortBinding.write had an error', err);
      return this._error(err, callback);
    }
    if (callback) { callback.call(this, null) }
  }.bind(this));
};

if (process.platform !== 'win32') {
  SerialPort.prototype._read = function() {
    if (!this.readable || this.paused || this.reading || this.closing) {
      return;
    }

    this.reading = true;

    if (!this.pool || this.pool.length - this.pool.used < kMinPoolSpace) {
      // discard the old pool. Can't add to the free list because
      // users might have references to slices on it.
      this.pool = new Buffer(kPoolSize);
      this.pool.used = 0;
    }

    // Grab another reference to the pool in the case that while we're in the
    // thread pool another read() finishes up the pool, and allocates a new
    // one.
    var toRead = Math.min(this.pool.length - this.pool.used, ~~this.bufferSize);
    var start = this.pool.used;

    var _afterRead = function(err, bytesRead, readPool, bytesRequested) {
      this.reading = false;
      if (err) {
        if (err.code && err.code === 'EAGAIN') {
          if (this.isOpen()) {
            this.serialPoller.start();
          }
        // handle edge case were mac/unix doesn't clearly know the error.
        } else if (err.code && (err.code === 'EBADF' || err.code === 'ENXIO' || (err.errno === -1 || err.code === 'UNKNOWN'))) {
          this._disconnected(err);
        } else {
          this.fd = null;
          this.readable = false;
          this.emit('error', err);
        }
        return;
      }

      // Since we will often not read the number of bytes requested,
      // let's mark the ones we didn't need as available again.
      this.pool.used -= bytesRequested - bytesRead;

      if (bytesRead === 0) {
        if (this.isOpen()) {
          this.serialPoller.start();
        }
      } else {
        var b = this.pool.slice(start, start + bytesRead);

        // do not emit events if the stream is paused
        if (this.paused) {
          if (!this.buffer) {
            this.buffer = new Buffer(0);
          }
          this.buffer = Buffer.concat([this.buffer, b]);
          return;
        }
        this._emitData(b);

        // do not emit events anymore after we declared the stream unreadable
        if (!this.readable) {
          return;
        }
        this._read();
      }
    }.bind(this);

    fs.read(this.fd, this.pool, this.pool.used, toRead, null, function(err, bytesRead) {
      var readPool = this.pool;
      var bytesRequested = toRead;
      _afterRead(err, bytesRead, readPool, bytesRequested);
    }.bind(this));

    this.pool.used += toRead;
  };

  SerialPort.prototype._emitData = function(data) {
    this.options.dataCallback(data);
  };

  SerialPort.prototype.pause = function() {
    this.paused = true;
  };

  SerialPort.prototype.resume = function() {
    this.paused = false;

    if (this.buffer) {
      var buffer = this.buffer;
      this.buffer = null;
      this._emitData(buffer);
    }

    // No longer open?
    if (!this.isOpen()) {
      return;
    }

    this._read();
  };
} // if !'win32'

SerialPort.prototype._disconnected = function(err) {
  this.paused = true;
  this.emit('disconnect', err);
  if (this.closing) {
    return;
  }

  if (this.fd === null) {
    return;
  }

  this.closing = true;
  if (process.platform !== 'win32') {
    this.readable = false;
    this.serialPoller.close();
  }

  SerialPortBinding.close(this.fd, function(err) {
    this.closing = false;
    if (err) {
      debug('Disconnect close completed with error: ', err);
    }
    this.fd = null;
    this.emit('close');
  }.bind(this));
};

SerialPort.prototype.close = function(callback) {
  this.paused = true;

  if (this.closing) {
    debug('close attempted, but port is already closing');
    return this._error(new Error('Port is not open'), callback);
  }

  if (!this.isOpen()) {
    debug('close attempted, but port is not open');
    return this._error(new Error('Port is not open'), callback);
  }

  this.closing = true;

  // Stop polling before closing the port.
  if (process.platform !== 'win32') {
    this.readable = false;
    this.serialPoller.close();
  }
  SerialPortBinding.close(this.fd, function(err) {
    this.closing = false;
    if (err) {
      debug('SerialPortBinding.close had an error', err);
      return this._error(err, callback);
    }

    this.fd = null;
    this.emit('close');
    if (callback) { callback.call(this, null) }
  }.bind(this));
};

SerialPort.prototype.flush = function(callback) {
  if (!this.isOpen()) {
    debug('flush attempted, but port is not open');
    return this._error(new Error('Port is not open'), callback);
  }

  SerialPortBinding.flush(this.fd, function(err, result) {
    if (err) {
      debug('SerialPortBinding.flush had an error', err);
      return this._error(err, callback);
    }
    if (callback) { callback.call(this, null, result) }
  }.bind(this));
};

SerialPort.prototype.set = function(options, callback) {
  if (!this.isOpen()) {
    debug('set attempted, but port is not open');
    return this._error(new Error('Port is not open'), callback);
  }

  options = options || {};
  if (!callback && typeof options === 'function') {
    callback = options;
    options = {};
  }

  var settings = {};
  for (var i = SET_OPTIONS.length - 1; i >= 0; i--) {
    var flag = SET_OPTIONS[i];
    if (options[flag] !== undefined) {
      settings[flag] = options[flag];
    } else {
      settings[flag] = defaultSetFlags[flag];
    }
  }

  SerialPortBinding.set(this.fd, settings, function(err) {
    if (err) {
      debug('SerialPortBinding.set had an error', err);
      return this._error(err, callback);
    }
    if (callback) { callback.call(this, null) }
  }.bind(this));
};

SerialPort.prototype.drain = function(callback) {
  if (!this.isOpen()) {
    debug('drain attempted, but port is not open');
    return this._error(new Error('Port is not open'), callback);
  }

  SerialPortBinding.drain(this.fd, function(err) {
    if (err) {
      debug('SerialPortBinding.drain had an error', err);
      return this._error(err, callback);
    }
    if (callback) { callback.call(this, null) }
  }.bind(this));
};

SerialPort.parsers = parsers;
SerialPort.list = SerialPortBinding.list;

// Write a depreciation warning once
Object.defineProperty(SerialPort, 'SerialPort', {
  get: function() {
    console.warn('DEPRECATION: Please use `require(\'serialport\')` instead of `require(\'serialport\').SerialPort`');
    Object.defineProperty(SerialPort, 'SerialPort', {
      value: SerialPort
    });
    return SerialPort;
  },
  configurable: true
});

module.exports = SerialPort;

}).call(this,require('_process'),require("buffer").Buffer)
},{"./bindings":74,"./parsers":76,"_process":63,"buffer":7,"debug":35,"fs":6,"object.assign":59,"stream":78,"util":82}],78:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = Stream;

var EE = require('events').EventEmitter;
var inherits = require('inherits');

inherits(Stream, EE);
Stream.Readable = require('readable-stream/readable.js');
Stream.Writable = require('readable-stream/writable.js');
Stream.Duplex = require('readable-stream/duplex.js');
Stream.Transform = require('readable-stream/transform.js');
Stream.PassThrough = require('readable-stream/passthrough.js');

// Backwards-compat with node 0.4.x
Stream.Stream = Stream;



// old-style streams.  Note that the pipe method (the only relevant
// part of this class) is overridden in the Readable class.

function Stream() {
  EE.call(this);
}

Stream.prototype.pipe = function(dest, options) {
  var source = this;

  function ondata(chunk) {
    if (dest.writable) {
      if (false === dest.write(chunk) && source.pause) {
        source.pause();
      }
    }
  }

  source.on('data', ondata);

  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }

  dest.on('drain', ondrain);

  // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once.
  if (!dest._isStdio && (!options || options.end !== false)) {
    source.on('end', onend);
    source.on('close', onclose);
  }

  var didOnEnd = false;
  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest.end();
  }


  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;

    if (typeof dest.destroy === 'function') dest.destroy();
  }

  // don't leave dangling pipes when there are errors.
  function onerror(er) {
    cleanup();
    if (EE.listenerCount(this, 'error') === 0) {
      throw er; // Unhandled stream error in pipe.
    }
  }

  source.on('error', onerror);
  dest.on('error', onerror);

  // remove all the event listeners that were added.
  function cleanup() {
    source.removeListener('data', ondata);
    dest.removeListener('drain', ondrain);

    source.removeListener('end', onend);
    source.removeListener('close', onclose);

    source.removeListener('error', onerror);
    dest.removeListener('error', onerror);

    source.removeListener('end', cleanup);
    source.removeListener('close', cleanup);

    dest.removeListener('close', cleanup);
  }

  source.on('end', cleanup);
  source.on('close', cleanup);

  dest.on('close', cleanup);

  dest.emit('pipe', source);

  // Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest;
};

},{"events":39,"inherits":49,"readable-stream/duplex.js":64,"readable-stream/passthrough.js":70,"readable-stream/readable.js":71,"readable-stream/transform.js":72,"readable-stream/writable.js":73}],79:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var Buffer = require('buffer').Buffer;

var isBufferEncoding = Buffer.isEncoding
  || function(encoding) {
       switch (encoding && encoding.toLowerCase()) {
         case 'hex': case 'utf8': case 'utf-8': case 'ascii': case 'binary': case 'base64': case 'ucs2': case 'ucs-2': case 'utf16le': case 'utf-16le': case 'raw': return true;
         default: return false;
       }
     }


function assertEncoding(encoding) {
  if (encoding && !isBufferEncoding(encoding)) {
    throw new Error('Unknown encoding: ' + encoding);
  }
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters. CESU-8 is handled as part of the UTF-8 encoding.
//
// @TODO Handling all encodings inside a single object makes it very difficult
// to reason about this code, so it should be split up in the future.
// @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
// points as used by CESU-8.
var StringDecoder = exports.StringDecoder = function(encoding) {
  this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
  assertEncoding(encoding);
  switch (this.encoding) {
    case 'utf8':
      // CESU-8 represents each of Surrogate Pair by 3-bytes
      this.surrogateSize = 3;
      break;
    case 'ucs2':
    case 'utf16le':
      // UTF-16 represents each of Surrogate Pair by 2-bytes
      this.surrogateSize = 2;
      this.detectIncompleteChar = utf16DetectIncompleteChar;
      break;
    case 'base64':
      // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
      this.surrogateSize = 3;
      this.detectIncompleteChar = base64DetectIncompleteChar;
      break;
    default:
      this.write = passThroughWrite;
      return;
  }

  // Enough space to store all bytes of a single character. UTF-8 needs 4
  // bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).
  this.charBuffer = new Buffer(6);
  // Number of bytes received for the current incomplete multi-byte character.
  this.charReceived = 0;
  // Number of bytes expected for the current incomplete multi-byte character.
  this.charLength = 0;
};


// write decodes the given buffer and returns it as JS string that is
// guaranteed to not contain any partial multi-byte characters. Any partial
// character found at the end of the buffer is buffered up, and will be
// returned when calling write again with the remaining bytes.
//
// Note: Converting a Buffer containing an orphan surrogate to a String
// currently works, but converting a String to a Buffer (via `new Buffer`, or
// Buffer#write) will replace incomplete surrogates with the unicode
// replacement character. See https://codereview.chromium.org/121173009/ .
StringDecoder.prototype.write = function(buffer) {
  var charStr = '';
  // if our last write ended with an incomplete multibyte character
  while (this.charLength) {
    // determine how many remaining bytes this buffer has to offer for this char
    var available = (buffer.length >= this.charLength - this.charReceived) ?
        this.charLength - this.charReceived :
        buffer.length;

    // add the new bytes to the char buffer
    buffer.copy(this.charBuffer, this.charReceived, 0, available);
    this.charReceived += available;

    if (this.charReceived < this.charLength) {
      // still not enough chars in this buffer? wait for more ...
      return '';
    }

    // remove bytes belonging to the current character from the buffer
    buffer = buffer.slice(available, buffer.length);

    // get the character that was split
    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);

    // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
    var charCode = charStr.charCodeAt(charStr.length - 1);
    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
      this.charLength += this.surrogateSize;
      charStr = '';
      continue;
    }
    this.charReceived = this.charLength = 0;

    // if there are no more bytes in this buffer, just emit our char
    if (buffer.length === 0) {
      return charStr;
    }
    break;
  }

  // determine and set charLength / charReceived
  this.detectIncompleteChar(buffer);

  var end = buffer.length;
  if (this.charLength) {
    // buffer the incomplete character bytes we got
    buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
    end -= this.charReceived;
  }

  charStr += buffer.toString(this.encoding, 0, end);

  var end = charStr.length - 1;
  var charCode = charStr.charCodeAt(end);
  // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
  if (charCode >= 0xD800 && charCode <= 0xDBFF) {
    var size = this.surrogateSize;
    this.charLength += size;
    this.charReceived += size;
    this.charBuffer.copy(this.charBuffer, size, 0, size);
    buffer.copy(this.charBuffer, 0, 0, size);
    return charStr.substring(0, end);
  }

  // or just emit the charStr
  return charStr;
};

// detectIncompleteChar determines if there is an incomplete UTF-8 character at
// the end of the given buffer. If so, it sets this.charLength to the byte
// length that character, and sets this.charReceived to the number of bytes
// that are available for this character.
StringDecoder.prototype.detectIncompleteChar = function(buffer) {
  // determine how many bytes we have to check at the end of this buffer
  var i = (buffer.length >= 3) ? 3 : buffer.length;

  // Figure out if one of the last i bytes of our buffer announces an
  // incomplete char.
  for (; i > 0; i--) {
    var c = buffer[buffer.length - i];

    // See http://en.wikipedia.org/wiki/UTF-8#Description

    // 110XXXXX
    if (i == 1 && c >> 5 == 0x06) {
      this.charLength = 2;
      break;
    }

    // 1110XXXX
    if (i <= 2 && c >> 4 == 0x0E) {
      this.charLength = 3;
      break;
    }

    // 11110XXX
    if (i <= 3 && c >> 3 == 0x1E) {
      this.charLength = 4;
      break;
    }
  }
  this.charReceived = i;
};

StringDecoder.prototype.end = function(buffer) {
  var res = '';
  if (buffer && buffer.length)
    res = this.write(buffer);

  if (this.charReceived) {
    var cr = this.charReceived;
    var buf = this.charBuffer;
    var enc = this.encoding;
    res += buf.slice(0, cr).toString(enc);
  }

  return res;
};

function passThroughWrite(buffer) {
  return buffer.toString(this.encoding);
}

function utf16DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 2;
  this.charLength = this.charReceived ? 2 : 0;
}

function base64DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 3;
  this.charLength = this.charReceived ? 3 : 0;
}

},{"buffer":7}],80:[function(require,module,exports){
arguments[4][49][0].apply(exports,arguments)
},{"dup":49}],81:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],82:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":81,"_process":63,"inherits":80}],83:[function(require,module,exports){
(function (process){