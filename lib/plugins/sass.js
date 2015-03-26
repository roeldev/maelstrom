/**
 * Maelstrom | lib/plugins/sass.js
 * file version: 0.00.003
 */
'use strict';

var _                = require('underscore'),
    Maelstrom        = require('../index.js'),
    Utils            = require('../utils.js'),
    Config           = Maelstrom.config,
    Gulp             = Maelstrom.gulp,
    GulpSass         = require('gulp-sass'),
    GulpAutoprefixer = require('gulp-autoprefixer'),
    GulpMinifyCss    = require('gulp-minify-css'),
    Through          = require('through2');

//------------------------------------------------------------------------------

function libSassStream($target)
{
    return Utils.pipeStreams(
    [
        GulpSass(Config.sass.libsass),
        GulpAutoprefixer(Config.css.autoprefixer),
        Utils.pipeWhenNotDev( GulpMinifyCss() )
    ]);
}

function rubySassStream($target)
{
    return Through.obj();
}

//------------------------------------------------------------------------------

module.exports =
{
    'src': function()
    {
        return Config.src.sass +'/**/*.{sass,scss}';
    },

    'dest': function()
    {
        return Config.dest.css
    },

    'stream': function()
    {
        // define the streamer that will transform the content
        return ((Config.sass.compiler == 'ruby')
            ? rubySassStream()
            : libSassStream());
    }
};
