/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
/*!****************************!*\
  !*** ./src/tools/tools.ts ***!
  \****************************/


var res = document.removeEventListener('mouseup', function () {});
console.log('res: ', res);
document.addEventListener('mouseup', function (e) {
  var selected = document.getSelection();
  if (selected) console.log('selected: ', selected.toString());
});
/******/ })()
;