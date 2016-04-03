'use strict';

require('babel-polyfill');

var _serialport = require('serialport');

var _os = require('os');

// import promisify from 'es6-promisify';


var LINUX_PORT = '/dev/ttyUSB0';
var OSX_PORT = '/dev/tty.usbserial-DA01NNR3';
var CREATE_2_BAUDRATE = 115200;
var port = (0, _os.platform)() === 'darwin' ? OSX_PORT : LINUX_PORT;

var Command = {
  START: 0x80,
  SAFE: 0x83,
  DRIVE: 0x89,
  DRIVE_DIRECT: 0x91,
  LED: 0x8B,
  SONG: 0x8C,
  PLAY: 0x8D,
  STREAM: 0x94,
  SENSORS: 0x8E
};

var serialPort = new _serialport.SerialPort(port, {
  baudrate: CREATE_2_BAUDRATE
}, false); // this is the openImmediately flag [default is true]

var serialOpen = function serialOpen() {
  return new Promise(function (resolve, reject) {
    serialPort.open(function (err) {
      return err ? reject(err) : resolve();
    });
  });
};

var serialClose = function serialClose() {
  return new Promise(function (resolve, reject) {
    serialPort.close(function (err) {
      return err ? reject(err) : resolve();
    });
  });
};

var serialWrite = function serialWrite(data) {
  return new Promise(function (resolve, reject) {
    serialPort.write(data, function (err, result) {
      return err ? reject(err) : resolve(result);
    });
  });
};

var wait = function wait(ms) {
  // new Promise(resolve => setTimeout(resolve, ms))
  return Promise.resolve(ms).then(function (value) {
    return new Promise(function (resolve) {
      return setTimeout(function () {
        return resolve();
      }, ms);
    });
  });
};
//
// console.log('hello');
// wait(1000)
//   .then(() => console.log('goodbye'))
//   .then(() => wait(1000))
//   .then(() => console.log('goodbye again'))

serialOpen().then(function () {
  return console.log('open');
}).then(function () {
  return wait(500);
}).then(function () {
  return console.log('starting safe mode');
}).then(function () {
  return serialWrite(Command.SAFE);
}).then(function () {
  return console.log('closing');
}).then(function () {
  return wait(1000);
}).then(function () {
  return serialClose();
}).then(function () {
  return console.log('closed');
}).catch(function (err) {
  return console.error(err.stack);
});

// serialPort.open(function(error) {
//   if (error) {
//     console.log('failed to open: ' + error);
//   } else {
//     console.log('open');
//     serialPort.on('data', function(data) {
//       // console.log('data received: ' + data);
//     });
//     serialPort.write("ls\n", function(err, results) {
//       if (err) {
//         console.log('err ' + err);
//       }
//       console.log('results ' + results);
//     });
//   }
// });