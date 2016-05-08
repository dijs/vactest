'use strict';

var _index = require('./index');

(0, _index.serialOpen)().then(function () {
  return (0, _index.wait)(1000);
}).then(function () {
  return (0, _index.safeMode)();
}).then(function () {
  return (0, _index.wait)(1000);
}).then(function () {
  return (0, _index.moveForward)(100);
}).then(function () {
  return (0, _index.wait)(1000);
}).then(function () {
  return (0, _index.stopMotion)();
}).then(function () {
  return (0, _index.turnClockwise)();
}).then(function () {
  return (0, _index.wait)(1500);
}).then(function () {
  return (0, _index.stopMotion)();
}).then(function () {
  return (0, _index.wait)(1000);
}).then(function () {
  return (0, _index.moveForward)(100);
}).then(function () {
  return (0, _index.wait)(1000);
}).then(function () {
  return (0, _index.stopMotion)();
}).then(function () {
  return (0, _index.wait)(1000);
}).then(function () {
  return (0, _index.serialClose)();
}).catch(function (e) {
  return console.error(e.stack);
}).then(function () {
  return (0, _index.serialClose)();
});