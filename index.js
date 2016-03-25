var Roomba = require('roomba').Roomba;

var bot = new Roomba({
  sp: {
    path: '/dev/ttyUSB0',
    options: {
      baudrate: 57600
    }
  },
  update_freq: 500
});

bot.once('ready', function() {
  console.log('bot is ready');
  console.log('stopping spin');
  bot.send({
    cmd: 'DRIVE',
    data: [0, -1]
  });
  console.log('sending song');
  bot.send({
    cmd: 'SONG',
    data: [1, 6, 62, 30, 64, 30, 65, 160, 64, 50, 60, 50, 53, 120]
    // data: [1, 16, 76, 16, 76, 16, 76, 32, 76, 16, 76, 16, 76, 32, 76, 16, 79, 16,
    //   72, 16, 74, 16, 76, 32, 77, 16, 77, 16, 77, 16, 77, 32, 77, 16
    // ]
  });
  console.log('sending play');
  bot.send({
    cmd: 'PLAY',
    data: [1]
  });
});

bot.on('sense', function(sensors) {
  console.log('sensing something');
  if (sensors.bump.right || sensors.bump.left) {
    console.log('bump detected');
    // stop spinning
    bot.send({
      cmd: 'DRIVE',
      data: [0, -1]
    });
  }
});
