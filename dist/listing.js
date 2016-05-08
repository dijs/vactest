'use strict';

var _serialport = require('serialport');

(0, _serialport.list)(function (err, ports) {
  ports.forEach(function (port) {
    console.log(port);
  });
});