/**
 * maelstrom | lib/streams/plumber.js
 */
'use strict';

const GulpPlumber = require('gulp-plumber');
const GulpNotify  = require('gulp-notify');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

module.exports = function()
{
    const self = this; // maelstrom object

    return GulpPlumber(
    {
        'errorHandler': GulpNotify.onError(self.config.main.notify.error)
    });
};
