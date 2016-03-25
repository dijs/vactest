var robot = require('create-oi');

robot.init({
  serialport: '/dev/ttyUSB0'
});

robot.on('bump', function(bumpEvent) {
  console.log('bumped', bumpEvent.direction);
});


//
// var Roomba = require('roomba').Roomba;
//
// var bot = new Roomba({
//   sp: {
//     path: '/dev/ttyUSB0',
//     options: {
//       baudrate: 57600
//     }
//   },
//   update_freq: 200
// });
//
// function test() {
//   // console.log('stopping spin');
//   // bot.send({
//   //   cmd: 'DRIVE',
//   //   data: [0, -1]
//   // });
//   console.log('sending song');
//   bot.send({
//     cmd: 'SONG',
//     data: [1, 6, 62, 30, 64, 30, 65, 160, 64, 50, 60, 50, 53, 120]
//   });
//   console.log('sending play');
//   bot.send({
//     cmd: 'PLAY',
//     data: [1]
//   });
// }
//
// bot.once('ready', function() {
//   console.log('bot is ready');
//   // setTimeout(test, 2000);
//   //
// });
//
// bot.on('sense', function(sensors) {
//   console.log('sensing something');
//   if (sensors.bump.right || sensors.bump.left) {
//     console.log('bump detected');
//     // test();
//   }
// });
