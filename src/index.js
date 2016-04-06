import 'babel-polyfill'
import {SerialPort} from 'serialport'
import {platform} from 'os'

// TODO: There may be a way to look for these...
const LINUX_PORT = '/dev/ttyUSB0'
const OSX_PORT = '/dev/tty.usbserial-DA01NNR3'
const port = platform() === 'darwin' ? OSX_PORT : LINUX_PORT

// TODO: Create a constants file later...
const CREATE_2_BAUDRATE = 115200
const Command = {
    START: 0x80,
    SAFE: 0x83,
    DRIVE: 0x89,
    DRIVE_DIRECT: 0x91,
    LED: 0x8B,
    SONG: 0x8C,
    PLAY: 0x8D,
    STREAM: 0x94,
    SENSORS: 0x8E
}

// TODO: Build wait times into the commands (since they are required)
// TODO: Only export the useable methods, not the raw communication methods...
// TODO: Add eslint
// TODO: Push this to npm when done with testing

const serialPort = new SerialPort(port, {
  baudrate: CREATE_2_BAUDRATE
}, false) // this is the openImmediately flag [default is true]

export function serialOpen() {
  return new Promise((resolve, reject) => {
    serialPort.open(err => err ? reject(err) : resolve())
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
  console.log('starting safe mode')
  return serialWrite(Command.SAFE)
}

export function passiveMode() {
  console.log('starting passive mode')
  return serialWrite(Command.START)
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
  console.log(`programming song ${songNumber} with ${notes.length} notes`)
  return serialWrite(Command.SONG, [songNumber, notes.length, ...song])
}

export function playSong(songNumber) {
  if (songNumber < 0 || songNumber > 4) {
    throw new Error('Song number can be (0-4)');
  }
  console.log(`playing song ${songNumber}`)
  return serialWrite(Command.PLAY, [songNumber])
  // Find a way to wait the correct time here maybe...
}

// TODO: Way down the line... allow users to play MIDI files somehow.
// - Choose one instrument (argument) -> must be linear...
// - Convert notes to roomba notes
// - Break into songs
// - Program/Play songs in sequence
