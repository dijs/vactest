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

(0, _index.serialOpen)().then(function () {
  return (0, _index.wait)(1000);
}).then(function () {
  return (0, _index.safeMode)();
}).then(function () {
  return (0, _index.wait)(1000);
}).then(function () {
  return (0, _index.programSong)(0, song1Notes, Array(song1Notes.length).fill(16));
}).then(function () {
  return (0, _index.wait)(1000);
}).then(function () {
  return (0, _index.programSong)(1, song2Notes, Array(song2Notes.length).fill(16));
}).then(function () {
  return (0, _index.wait)(1000);
}).then(function () {
  return (0, _index.playSong)(0);
}).then(function () {
  return (0, _index.wait)(quarterNote * song1Notes.length + 10);
}).then(function () {
  return (0, _index.playSong)(1);
}).then(function () {
  return (0, _index.wait)(quarterNote * song2Notes.length + 10);
}).then(function () {
  return (0, _index.passiveMode)();
}).then(function () {
  return (0, _index.wait)(1000);
}).then(function () {
  return (0, _index.serialClose)();
});