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
exports.programSong = programSong;
exports.playSong = playSong;

require('babel-polyfill');

var _serialport = require('serialport');

var _os = require('os');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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

function serialOpen() {
  return new Promise(function (resolve, reject) {
    serialPort.open(function (err) {
      return err ? reject(err) : resolve();
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
  console.log('starting safe mode');
  return serialWrite(Command.SAFE);
}

function passiveMode() {
  console.log('starting passive mode');
  return serialWrite(Command.START);
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
  console.log('programming song ' + songNumber + ' with ' + notes.length + ' notes');
  return serialWrite(Command.SONG, [songNumber, notes.length].concat(_toConsumableArray(song)));
}

function playSong(songNumber) {
  if (songNumber < 0 || songNumber > 4) {
    throw new Error('Song number can be (0-4)');
  }
  console.log('playing song ' + songNumber);
  return serialWrite(Command.PLAY, [songNumber]);
  // Find a way to wait the correct time here maybe...
}