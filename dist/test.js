'use strict';

var _index = require('./index');

var B = 71;
var E = 71 + 4;
var F = 71 + 5;
var G = 71 + 7;
var Gs = 71 + 8;

var quarterNote = 1000 / 4;

var song1Notes = [B, E, B, G, B, E, B, G, B, E, B, G, B, E, B, G];
var song2Notes = [B, F, B, Gs, B, F, B, Gs, B, F, B, Gs, B, F, B, Gs];

var program = [(0, _index.serialOpen)(), (0, _index.safeMode)(), (0, _index.programSong)(0, song1Notes, Array(song1Notes.length).fill(16)), (0, _index.programSong)(1, song2Notes, Array(song2Notes.length).fill(16)), (0, _index.playSong)(0), (0, _index.wait)(quarterNote * song1Notes.length + 10), (0, _index.playSong)(1), (0, _index.wait)(quarterNote * song2Notes.length + 10), (0, _index.passiveMode)(), (0, _index.serialClose)()];

program.reduce(function (previous, next) {
  return previous.then(function () {
    return next;
  });
}, Promise.resolve()).catch(function (err) {
  return console.error(err.stack);
});