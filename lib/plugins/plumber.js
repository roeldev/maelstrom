/**
 * maelstrom | lib/plugins/plumber.js
 */
'use strict';

var Maelstrom   = require('../index.js');
var Config      = Maelstrom.config;
var GulpPlumber = require('gulp-plumber');
var GulpNotify  = require('gulp-notify');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

module.exports = function()
{
    return GulpPlumber(
    {
        'errorHandler': GulpNotify.onError(Config.main.notify.error)
    });
};
