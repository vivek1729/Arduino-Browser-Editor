}).call(this,require('_process'))
},{"./browser-logger":1,"_process":63,"cylon":34}],"cylon-firmata":[function(require,module,exports){
"use strict";

var Adaptor = require("./lib/firmata");

module.exports = {
  adaptors: ["firmata"],
  dependencies: ["cylon-gpio", "cylon-i2c"],

  adaptor: function(args) {
    return new Adaptor(args);
  }
};

},{"./lib/firmata":10}],"cylon-gpio":[function(require,module,exports){
"use strict";

/* eslint quote-props: 0 */

var Drivers = {
  "analog-sensor": require("./lib/analog-sensor"),
  "analogSensor": require("./lib/analog-sensor"),
  "button": require("./lib/button"),
  "continuous-servo": require("./lib/continuous-servo"),
  "led": require("./lib/led"),
  "makey-button": require("./lib/makey-button"),
  "maxbotix": require("./lib/maxbotix"),
  "motor": require("./lib/motor"),
  "relay": require("./lib/relay"),
  "servo": require("./lib/servo"),
  "ir-range-sensor": require("./lib/ir-range-sensor"),
  "direct-pin": require("./lib/direct-pin"),
  "rgb-led": require("./lib/rgb-led")
};

module.exports = {
  drivers: Object.keys(Drivers),

  driver: function(opts) {
    opts = opts || {};

    if (!Drivers[opts.driver]) {
      return null;
    }

    return new Drivers[opts.driver](opts);
  }
};

},{"./lib/analog-sensor":11,"./lib/button":12,"./lib/continuous-servo":13,"./lib/direct-pin":14,"./lib/ir-range-sensor":15,"./lib/led":16,"./lib/makey-button":17,"./lib/maxbotix":18,"./lib/motor":19,"./lib/relay":20,"./lib/rgb-led":21,"./lib/servo":22}],"cylon-i2c":[function(require,module,exports){
"use strict";

var Drivers = {
  blinkm: require("./lib/blinkm"),
  hmc6352: require("./lib/hmc6352"),
  mpl115a2: require("./lib/mpl115a2"),
  bmp180: require("./lib/bmp180"),
  mpu6050: require("./lib/mpu6050"),
  lcd: require("./lib/lcd"),
  lsm9ds0g: require("./lib/lsm9ds0g"),
  lsm9ds0xm: require("./lib/lsm9ds0xm"),
  "lidar-lite": require("./lib/lidar-lite"),
  pca9685: require("./lib/pca9685")
};

module.exports = {
  drivers: Object.keys(Drivers),

  driver: function(opts) {
    if (Drivers[opts.driver]) {
      return new Drivers[opts.driver](opts);
    }

    return null;
  }
};

},{"./lib/blinkm":23,"./lib/bmp180":24,"./lib/hmc6352":25,"./lib/lcd":27,"./lib/lidar-lite":28,"./lib/lsm9ds0g":29,"./lib/lsm9ds0xm":30,"./lib/mpl115a2":31,"./lib/mpu6050":32,"./lib/pca9685":33}]},{},[83]);
