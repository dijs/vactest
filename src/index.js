import 'babel-polyfill'
// import promisify from 'es6-promisify';
import {SerialPort} from 'serialport'
import {platform} from 'os'

const LINUX_PORT = '/dev/ttyUSB0'
const OSX_PORT = '/dev/tty.usbserial-DA01NNR3'
const CREATE_2_BAUDRATE = 115200
const port = platform() === 'darwin' ? OSX_PORT : LINUX_PORT

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
};

const serialPort = new SerialPort(port, {
  baudrate: CREATE_2_BAUDRATE
}, false); // this is the openImmediately flag [default is true]

const serialOpen = () => {
  return new Promise((resolve, reject) => {
    serialPort.open(err => err ? reject(err) : resolve())
  })
}

const serialClose = () => {
  return new Promise((resolve, reject) => {
    serialPort.close(err => err ? reject(err) : resolve())
  })
}

const serialWrite = data => {
  return new Promise((resolve, reject) => {
    serialPort.write(data, (err, result) => err ? reject(err) : resolve(result))
  })
}

const wait = ms => {
  // new Promise(resolve => setTimeout(resolve, ms))
  return Promise
    .resolve(ms)
    .then(value => {
      return new Promise(resolve => setTimeout(() => resolve(), ms))
    })
}
//
// console.log('hello');
// wait(1000)
//   .then(() => console.log('goodbye'))
//   .then(() => wait(1000))
//   .then(() => console.log('goodbye again'))


serialOpen()
.then(() => console.log('open'))
.then(() => wait(500))
.then(() => console.log('starting safe mode'))
.then(() => serialWrite(Command.SAFE))
.then(() => console.log('closing'))
.then(() => wait(1000))
.then(() => serialClose())
.then(() => console.log('closed'))
.catch(err => console.error(err.stack))

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
