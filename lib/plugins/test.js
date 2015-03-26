/**
 * Maelstrom | lib/plugins/test.js
 * file version: 0.00.001
 */
'use strict';

var _           = require('underscore'),
    Maelstrom   = require('../index.js'),
    Config      = Maelstrom.config,
    Gulp        = Maelstrom.gulp,
    GulpPlugins = require('gulp-load-plugins')(),
    Through     = require('through2');

module.exports = function()
{
    return Through()
        .pipe( GulpPlugins.minifyCss() );
};
