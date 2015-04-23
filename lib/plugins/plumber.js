/**
 * maelstrom | lib/plugins/plumber.js
 * file version: 0.01.000
 */
'use strict';

var Maelstrom     = require('../index.js');
var ModulesConfig = Maelstrom.config.modules;
var GulpPlumber   = require('gulp-plumber');
var GulpNotify    = require('gulp-notify');

////////////////////////////////////////////////////////////////////////////////

module.exports = function()
{
    return GulpPlumber(
    {
        'errorHandler': GulpNotify.onError(ModulesConfig.notifyError)
    });
};
