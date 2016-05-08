import 'babel-polyfill'
import {SerialPort, list} from 'serialport'
import {platform} from 'os'

const log = require('debug')('Vaccom')

function findUsbPort() {
  return new Promise((resolve, reject) => {
    list((err, ports) => {
      if (err) {
        return reject(err)
      }
      const usbComPorts = ports
        .map(port => port.comName)
        .filter(name => name.toLowerCase().indexOf('usb') !== -1);
      if (usbComPorts.length > 0) {
        return resolve(usbComPorts[0])
      }
      return reject(new Error('Could not find USB COM port'))
    })
  })
}

// TODO: Create a constants file later...
const CREATE_2_BAUDRATE = 115200
const Command = {
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
}

const STRAIGHT = 32768;
const CLOCKWISE = -1;
const COUNTER_CLOCKWISE = 1;

// TODO: Build wait times into the commands (since they are required)
// TODO: Only export the useable methods, not the raw communication methods...
// TODO: Add eslint
// TODO: Push this to npm when done with testing

let serialPort;

export function serialOpen(comPort) {
  const findPort = comPort ? Promise.resolve(comPort) : findUsbPort()
  return findPort.then(port => {
    // Setting global port here for re-use
    serialPort = new SerialPort(port, {
      baudrate: CREATE_2_BAUDRATE
    }, false) // this is the openImmediately flag [default is true]
    return new Promise((resolve, reject) => {
      serialPort.open(err => err ? reject(err) : resolve())
    })
  })
}

export function serialClose() {
  return new Promise((resolve, reject) => {
    serialPort.close(err => err ? reject(err) : resolve())
  })
}

export function serialWrite(command, data) {
  const buffer = [command].concat(data || [])
  return new Promise((resolve, reject) => {
    serialPort.write(buffer, (err, result) => err ? reject(err) : resolve(result))
  })
}

export function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function safeMode() {
  log('starting safe mode')
  return serialWrite(Command.SAFE)
}

export function passiveMode() {
  log('starting passive mode')
  return serialWrite(Command.START)
}

/**
 * Move Roomba Forward
 * @param  {Number} velocity mm/s
 * @param  {Number} radius   mm (default is straight)
 */
export function moveForward(velocity, radius = STRAIGHT) {
  if (velocity < -500 || velocity > 500) {
    throw new Error('Must use velocity between -500 and 500 mm/s');
  }
  if (radius !== STRAIGHT && (radius < -2000 || radius > 2000)) {
    throw new Error('Must use radius between -2000 and 2000 mm');
  }
  log(`moving forward with velocity ${velocity} and radius ${radius}`);
  const velocityBuffer = new Buffer(2);
  velocityBuffer.writeInt16BE(velocity);
  const radiusBuffer = new Buffer(2);
  if (radius === STRAIGHT) {
    radiusBuffer.writeUInt16BE(radius);
  } else {
    radiusBuffer.writeInt16BE(radius);
  }
  return serialWrite(Command.DRIVE, [...velocityBuffer, ...radiusBuffer]);
}

/**
 * Stops all motion
 */
export function stopMotion() {
  log('stopping motion');
  return moveForward(0);
}

/**
 * Rotate Roomba clockwise with a specificed velocity
 * @param  {Number} velocity (default is 100)
 */
export function turnClockwise(velocity = 100) {
  log(`rotating clockwise with ${velocity} mm/s velocity`);
  return moveForward(velocity, CLOCKWISE);
}

/**
 * Rotate Roomba counter clockwise with a specificed velocity
 * @param  {Number} velocity (default is 100)
 */
export function turnCounterClockwise(velocity = 100) {
  log(`rotating counter clockwise with ${velocity} mm/s velocity`);
  return moveForward(velocity, COUNTER_CLOCKWISE);
}

// Maybe move this out into its own file... or a music file
// http://www.irobotweb.com/~/media/MainSite/PDFs/About/STEM/Create/iRobot_Roomba_600_Open_Interface_Spec.pdf?la=en
export function programSong(songNumber, notes, durations) {
  if (notes.length !== durations.length) {
    throw new Error('Notes and durations must be of the same length');
  }
  if (notes.length > 16) {
    throw new Error('Songs are limited to 16 notes');
  }
  const song = Array(notes.length * 2)
    .fill()
    .map((_, i) => i % 2 === 0 ? notes[i / 2] : durations[(i - 1) / 2])
  log(`programming song ${songNumber} with ${notes.length} notes`)
  return serialWrite(Command.SONG, [songNumber, notes.length, ...song])
}

export function playSong(songNumber) {
  if (songNumber < 0 || songNumber > 4) {
    throw new Error('Song number can be (0-4)');
  }
  log(`playing song ${songNumber}`)
  return serialWrite(Command.PLAY, [songNumber])
  // Find a way to wait the correct time here maybe...
}

// TODO: Way down the line... allow users to play MIDI files somehow.
// - Choose one instrument (argument) -> must be linear...
// - Convert notes to roomba notes
// - Break into songs
// - Program/Play songs in sequence
