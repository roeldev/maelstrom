/**
 * maelstrom | lib/plugins/plumber.js
 * file version: 0.00.004
 */
'use strict';

var ModulesConfig = require('../index.js').config.modules,
    GulpPlumber   = require('gulp-plumber'),
    GulpNotify    = require('gulp-notify');

////////////////////////////////////////////////////////////////////////////////

module.exports = function()
{
    return GulpPlumber(
    {
        'errorHandler': GulpNotify.onError(ModulesConfig.notifyError)
    });
};
