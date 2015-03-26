/**
 * Maelstrom | lib/plugins/sass.js
 * file version: 0.00.002
 */
'use strict';

var _                = require('underscore'),
    Maelstrom        = require('../index.js'),
    Config           = Maelstrom.config,
    Utils            = require('../utils.js'),
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

var Plugin = function()
{
    // define the streamer that will transform the content
    return ((Config.sass.compiler == 'ruby')
        ? rubySassStream()
        : libSassStream());
};

Plugin.src = function()
{
    return Config.src.sass +'/**/*.{sass,scss}';
};

Plugin.dest = function()
{
    return Config.dest.css;
};

Plugin.watch = function($files, $tasks)
{
    if (!_.isArray($files))
    {
        $files = (_.isString($files) ? [$files] : []);
    }
    if (!_.isArray($tasks))
    {
        $tasks = (_.isString($tasks) ? [$tasks] : []);
    }

    $files.unshift(Plugin.src());
    $tasks.unshift(Plugin._name);

    return Gulp.watch($files, $tasks);
};

module.exports = Plugin;

/*module.exports = Utils.plugin('sass'
{
    'src': function()
    {
        return Config.assets.sass +'/** /*.{sass,scss}';
    },

    'dest': function()
    {
        return Config.output.css
    },

    'stream': function()
    {
        // define the streamer that will transform the content
        return ((Config.sass.compiler == 'ruby')
            ? rubySassStream()
            : libSassStream());
    },

    'watch': function($files, $tasks)
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
    }
});
*/
