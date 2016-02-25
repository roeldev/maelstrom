/**
 * maelstrom | lib/streams/plumber.js
 */
'use strict';

var GulpPlumber = require('gulp-plumber');
var GulpNotify  = require('gulp-notify');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

module.exports = function()
{
    const self = this; // maelstrom object

    return GulpPlumber(
    {
        'errorHandler': GulpNotify.onError(self.config.main.notify.error)
    });
};
