var robot = require('create-oi');

var isOSX = process.argv.length > 1 &&
  process.argv[2].toLowerCase() === '--osx';
var LINUX_PORT = '/dev/ttyUSB0';
var OSX_PORT = '/dev/tty.usbserial-DA01NNR3';
var SPEED = 100; // 100 mm/s

robot.init({
  serialport: isOSX ? OSX_PORT : LINUX_PORT,
  version: 2
});

function testDrive(bot) {
  var drive = bot.drive;
  var wait = bot.wait;

  drive(SPEED, 0)
    .then(wait(1000))
    .then(drive(0, 0));
}

robot.on('ready', function() {
  console.log('ready');
  testDrive(this);
});

robot.on('bump', function(bumpEvent) {
  console.log('bumped', bumpEvent.which);
  testDrive(this);
});
