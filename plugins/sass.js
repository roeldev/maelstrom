"use strict";

var _           = require('underscore'),
    Maelstrom   = require('../index.js'),
    Config      = Maelstrom.config,
    Gulp        = Maelstrom.gulp,
    GulpPlugins = require('gulp-load-plugins')(),
    Through     = require('through2');

// sass -> css + autoprefix + minify

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
    var $isDev = false;

    var $stream = Through()
        //.pipe( sourceMapInit($isDev) )
        .pipe( GulpPlugins.sass(Config.sass.libsass) )
        //.pipe( sourceMapWrite($isDev) )
        //.pipe( GulpPlugins.autoprefixer(Config.css.autoprefixer) )


    return $stream;
}

function rubySassStream($target)
{
    var $stream = Through();
        /*$stream.write($prefixText);
        $stream.on('error', $target.emit.bind($target, 'error'));*/

    return $stream;
}

//------------------------------------------------------------------------------

var MaelstromSass = function()
{
    // define the streamer that will transform the content
    return ((Config.sass.compiler == 'ruby')
        ? rubySassStream(this)
        : libSassStream(this));
};

MaelstromSass.src = function()
{
    return Config.assets.sass +'/**/*.{sass|scss}';
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
