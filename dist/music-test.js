'use strict';

var _vaccom = require('../../vaccom');

var B = 71;
var E = 71 + 4;
var F = 71 + 5;
var G = 71 + 7;
var Gs = 71 + 8;

var quarterNote = 1000 / 4;

var song1Notes = [B, E, B, G, B, E, B, G, B, E, B, G, B, E, B, G];
var song2Notes = [B, F, B, Gs, B, F, B, Gs, B, F, B, Gs, B, F, B, Gs];

console.log('What is going on??');

(0, _vaccom.serialOpen)().then(function () {
  return (0, _vaccom.wait)(1000);
}).then(function () {
  return (0, _vaccom.safeMode)();
}).then(function () {
  return (0, _vaccom.wait)(1000);
}).then(function () {
  return (0, _vaccom.programSong)(0, song1Notes, Array(song1Notes.length).fill(16));
}).then(function () {
  return (0, _vaccom.wait)(1000);
}).then(function () {
  return (0, _vaccom.programSong)(1, song2Notes, Array(song2Notes.length).fill(16));
}).then(function () {
  return (0, _vaccom.wait)(1000);
}).then(function () {
  return (0, _vaccom.playSong)(0);
}).then(function () {
  return (0, _vaccom.wait)(quarterNote * song1Notes.length + 10);
}).then(function () {
  return (0, _vaccom.playSong)(1);
}).then(function () {
  return (0, _vaccom.wait)(quarterNote * song2Notes.length + 10);
}).then(function () {
  return (0, _vaccom.passiveMode)();
}).then(function () {
  return (0, _vaccom.wait)(1000);
}).then(function () {
  return (0, _vaccom.serialClose)();
});