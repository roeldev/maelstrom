/**
 * Maelstrom | lib/plugins/libsass.js
 * file version: 0.00.004
 */
'use strict';

var Maelstrom        = require('../index.js'),
    Config           = Maelstrom.config,
    Utils            = Maelstrom.utils,

    GulpSass         = require('gulp-sass'),
    GulpAutoprefixer = require('gulp-autoprefixer'),
    GulpMinifyCss    = require('gulp-minify-css');

//------------------------------------------------------------------------------

module.exports = Utils.createPlugin(
{
    'src': function()
    {
        return Config.src.sass +'/**/*.{sass,scss}';
    },

    'dest': function()
    {
        return Config.dest.css;
    },

    'stream': function()
    {
        return Utils.pipeStreams(
        [
            GulpSass(Config.sass.libsass),
            GulpAutoprefixer(Config.css.autoprefixer),
            Utils.pipeWhenNotDev( GulpMinifyCss() )
        ]);
    }
});
