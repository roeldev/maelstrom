/**
 * Maelstrom | lib/plugins/sass.js
 * file version: 0.00.001
 */
'use strict';

var _           = require('underscore'),
    Maelstrom   = require('../index.js'),
    Config      = Maelstrom.config,
    Utils       = require('../utils.js'),
    Gulp        = Maelstrom.gulp,
    GulpPlugins = require('gulp-load-plugins')(),
    Through     = require('through2');

//------------------------------------------------------------------------------

function sourceMapInit($condition)
{
    if (!$condition) return Through.obj();
    return GulpPlugins.sourcemaps.init({ loadMaps: true });
}

function sourceMapWrite($condition)
{
    if (!$condition) return Through.obj();
    return GulpPlugins.sourcemaps.write();
}

function minifyCss($condition)
{
    if (!$condition) return Through.obj();
    return GulpPlugins.minifyCss();
}

//------------------------------------------------------------------------------

function libSassStream($target)
{
    return Utils.pipeStreams(
    [
        GulpPlugins.sass(Config.sass.libsass),
        GulpPlugins.autoprefixer(Config.css.autoprefixer),
        GulpPlugins.minifyCss()
    ]);
}

function rubySassStream($target)
{
    return Through.obj();
}

//------------------------------------------------------------------------------

var MaelstromSass = function()
{
    // define the streamer that will transform the content
    return ((Config.sass.compiler == 'ruby')
        ? rubySassStream()
        : libSassStream());
};

MaelstromSass.src = function()
{
    return Config.assets.sass +'/**/*.{sass,scss}';
};

MaelstromSass.dest = function()
{
    return Config.output.css;
};

MaelstromSass.watch = function($files, $tasks)
{
    if (!_.isArray($files))
    {
        $files = (_.isString($files) ? [$files] : []);
    }
    if (!_.isArray($tasks))
    {
        $tasks = (_.isString($tasks) ? [$tasks] : []);
    }

    $files.unshift(MaelstromSass.src());
    $tasks.unshift('sass');

    return Gulp.watch($files, $tasks);
};

module.exports = MaelstromSass;
