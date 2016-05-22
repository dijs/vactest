'use strict';

var _vaccom = require('vaccom');

(0, _vaccom.serialOpen)().then(function () {
  return (0, _vaccom.wait)(1000);
}).then(function () {
  return (0, _vaccom.safeMode)();
}).then(function () {
  return (0, _vaccom.wait)(1000);
}).then(function () {
  return (0, _vaccom.moveForward)(100);
}).then(function () {
  return (0, _vaccom.wait)(1000);
}).then(function () {
  return (0, _vaccom.stopMotion)();
}).then(function () {
  return (0, _vaccom.turnClockwise)();
}).then(function () {
  return (0, _vaccom.wait)(1500);
}).then(function () {
  return (0, _vaccom.stopMotion)();
}).then(function () {
  return (0, _vaccom.wait)(1000);
}).then(function () {
  return (0, _vaccom.moveForward)(100);
}).then(function () {
  return (0, _vaccom.wait)(1000);
}).then(function () {
  return (0, _vaccom.stopMotion)();
}).then(function () {
  return (0, _vaccom.wait)(1000);
}).then(function () {
  return (0, _vaccom.serialClose)();
}).catch(function (e) {
  return console.error(e.stack);
}).then(function () {
  return (0, _vaccom.serialClose)();
});