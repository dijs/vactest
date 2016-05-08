'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serialOpen = serialOpen;
exports.serialClose = serialClose;
exports.serialWrite = serialWrite;
exports.wait = wait;
exports.safeMode = safeMode;
exports.passiveMode = passiveMode;
exports.moveForward = moveForward;
exports.stopMotion = stopMotion;
exports.turnClockwise = turnClockwise;
exports.turnCounterClockwise = turnCounterClockwise;
exports.programSong = programSong;
exports.playSong = playSong;

require('babel-polyfill');

var _serialport = require('serialport');

var _os = require('os');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var log = require('debug')('Vaccom');

function findUsbPort() {
  return new Promise(function (resolve, reject) {
    (0, _serialport.list)(function (err, ports) {
      if (err) {
        return reject(err);
      }
      var usbComPorts = ports.map(function (port) {
        return port.comName;
      }).filter(function (name) {
        return name.toLowerCase().indexOf('usb') !== -1;
      });
      if (usbComPorts.length > 0) {
        return resolve(usbComPorts[0]);
      }
      return reject(new Error('Could not find USB COM port'));
    });
  });
}

// TODO: Create a constants file later...
var CREATE_2_BAUDRATE = 115200;
var Command = {
  START: 0x80,
  SAFE: 0x83,
  DRIVE: 0x89,
  LED: 0x8B,
  SONG: 0x8C,
  PLAY: 0x8D,
  STREAM: 0x94,
  SENSORS: 0x8E,
  CLEAN: 0x87,
  SEEK_DOCK: 0x8F
};

var STRAIGHT = 32768;
var CLOCKWISE = -1;
var COUNTER_CLOCKWISE = 1;

// TODO: Build wait times into the commands (since they are required)
// TODO: Only export the useable methods, not the raw communication methods...
// TODO: Add eslint
// TODO: Push this to npm when done with testing

var serialPort = void 0;

function serialOpen(comPort) {
  var findPort = comPort ? Promise.resolve(comPort) : findUsbPort();
  return findPort.then(function (port) {
    // Setting global port here for re-use
    serialPort = new _serialport.SerialPort(port, {
      baudrate: CREATE_2_BAUDRATE
    }, false); // this is the openImmediately flag [default is true]
    return new Promise(function (resolve, reject) {
      serialPort.open(function (err) {
        return err ? reject(err) : resolve();
      });
    });
  });
}

function serialClose() {
  return new Promise(function (resolve, reject) {
    serialPort.close(function (err) {
      return err ? reject(err) : resolve();
    });
  });
}

function serialWrite(command, data) {
  var buffer = [command].concat(data || []);
  return new Promise(function (resolve, reject) {
    serialPort.write(buffer, function (err, result) {
      return err ? reject(err) : resolve(result);
    });
  });
}

function wait(ms) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
}

function safeMode() {
  log('starting safe mode');
  return serialWrite(Command.SAFE);
}

function passiveMode() {
  log('starting passive mode');
  return serialWrite(Command.START);
}

/**
 * Move Roomba Forward
 * @param  {Number} velocity mm/s
 * @param  {Number} radius   mm (default is straight)
 */
function moveForward(velocity) {
  var radius = arguments.length <= 1 || arguments[1] === undefined ? STRAIGHT : arguments[1];

  if (velocity < -500 || velocity > 500) {
    throw new Error('Must use velocity between -500 and 500 mm/s');
  }
  if (radius !== STRAIGHT && (radius < -2000 || radius > 2000)) {
    throw new Error('Must use radius between -2000 and 2000 mm');
  }
  log('moving forward with velocity ' + velocity + ' and radius ' + radius);
  var velocityBuffer = new Buffer(2);
  velocityBuffer.writeInt16BE(velocity);
  var radiusBuffer = new Buffer(2);
  if (radius === STRAIGHT) {
    radiusBuffer.writeUInt16BE(radius);
  } else {
    radiusBuffer.writeInt16BE(radius);
  }
  return serialWrite(Command.DRIVE, [].concat(_toConsumableArray(velocityBuffer), _toConsumableArray(radiusBuffer)));
}

/**
 * Stops all motion
 */
function stopMotion() {
  log('stopping motion');
  return moveForward(0);
}

/**
 * Rotate Roomba clockwise with a specificed velocity
 * @param  {Number} velocity (default is 100)
 */
function turnClockwise() {
  var velocity = arguments.length <= 0 || arguments[0] === undefined ? 100 : arguments[0];

  log('rotating clockwise with ' + velocity + ' mm/s velocity');
  return moveForward(velocity, CLOCKWISE);
}

/**
 * Rotate Roomba counter clockwise with a specificed velocity
 * @param  {Number} velocity (default is 100)
 */
function turnCounterClockwise() {
  var velocity = arguments.length <= 0 || arguments[0] === undefined ? 100 : arguments[0];

  log('rotating counter clockwise with ' + velocity + ' mm/s velocity');
  return moveForward(velocity, COUNTER_CLOCKWISE);
}

// Maybe move this out into its own file... or a music file
// http://www.irobotweb.com/~/media/MainSite/PDFs/About/STEM/Create/iRobot_Roomba_600_Open_Interface_Spec.pdf?la=en
function programSong(songNumber, notes, durations) {
  if (notes.length !== durations.length) {
    throw new Error('Notes and durations must be of the same length');
  }
  if (notes.length > 16) {
    throw new Error('Songs are limited to 16 notes');
  }
  var song = Array(notes.length * 2).fill().map(function (_, i) {
    return i % 2 === 0 ? notes[i / 2] : durations[(i - 1) / 2];
  });
  log('programming song ' + songNumber + ' with ' + notes.length + ' notes');
  return serialWrite(Command.SONG, [songNumber, notes.length].concat(_toConsumableArray(song)));
}

function playSong(songNumber) {
  if (songNumber < 0 || songNumber > 4) {
    throw new Error('Song number can be (0-4)');
  }
  log('playing song ' + songNumber);
  return serialWrite(Command.PLAY, [songNumber]);
  // Find a way to wait the correct time here maybe...
}

// TODO: Way down the line... allow users to play MIDI files somehow.
// - Choose one instrument (argument) -> must be linear...
// - Convert notes to roomba notes
// - Break into songs
// - Program/Play songs in sequence