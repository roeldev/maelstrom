/**
 * Maelstrom | lib/plugins/libsass.js
 * file version: 0.00.005
 */
'use strict';

var Maelstrom        = require('../index.js'),
    Config           = Maelstrom.config,
    Utils            = Maelstrom.utils,
    GulpSass         = require('gulp-sass'),
    GulpAutoprefixer = require('gulp-autoprefixer'),
    GulpMinifyCss    = require('gulp-minify-css');

//------------------------------------------------------------------------------

module.exports = function()
{
    return Utils.pipeStreams(
    [
        GulpSass(Config.sass.libsass),
        GulpAutoprefixer(Config.css.autoprefixer),
        Utils.pipeWhenNotDev( GulpMinifyCss() )
    ]);
}

module.exports.src  = Utils.src(Config.src.sass +'/**/*.{sass,scss}');
module.exports.dest = Utils.dest(Config.dest.css);
