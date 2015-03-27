/**
 * Maelstrom | lib/plugins/plumber.js
 * file version: 0.00.002
 */
'use strict';

var Config      = require('../index.js').config,
    GulpPlumber = require('gulp-plumber'),
    GulpNotify  = require('gulp-notify');

module.exports = function()
{
    return GulpPlumber({ errorHandler: GulpNotify.onError(Config.notifyError) });
};
