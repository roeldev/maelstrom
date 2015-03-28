/**
 * maelstrom | lib/utils.js
 * file version: 0.00.006
 */
'use strict';

var _          = require('underscore'),
    Maelstrom  = require('./index.js'),
    Gulp       = Maelstrom.gulp,
    GulpUtil   = require('gulp-util'),
    Path       = require('path');

//------------------------------------------------------------------------------

/**
 * Returns the file path from where the function is called.
 * *Example taken from http://stackoverflow.com/questions/16697791/nodejs-get-filename-of-caller-function
 *
 * @return {string|undefined}
 */
function getCallerFile()
{
    try
    {
        var $error = new Error(),
            $callerFile,
            $currentFile;

        Error.prepareStackTrace = function($error, stack)
        {
            return stack;
        };

        $currentFile = $error.stack.shift().getFileName();
        while ($error.stack.length)
        {
            $callerFile = $error.stack.shift().getFileName();
            if ($currentFile !== $callerFile)
            {
                return $callerFile;
            }
        }
    }
    catch ($error) {}
    return undefined;
}

/**
 * @param {mixed} $array
 * @param {mixed} $defaultItem
 * @return {array}
 */
function arrayFromArguments($array, $defaultItem)
{
    if (!_.isArray($array))
    {
        $array = (_.isString($array) ? [$array] : []);
    }

    $array.unshift($defaultItem);
    return $array;
}

//------------------------------------------------------------------------------

module.exports =
{
    /**
     * Returns `true` if gulp is run with the `--dev` flag.
     *
     * @return {boolean}
     */
    'isDev': function()
    {
        return !!GulpUtil.env.dev;
    },

    /**
     * Pipe an array of streams to the first stream.
     *
     * @param {array} $streams - Array of streams.
     * @return {object} A stream.
     */
    'pipeStreams': function($streams)
    {
        var $stream,
            $firstStream;

        while ($streams.length > 0)
        {
            $stream = $streams.shift();
            if ($stream !== false)
            {
                if (!$firstStream)
                {
                    $firstStream = $stream;
                }
                else
                {
                    $firstStream.pipe($stream);
                }
            }
        }

        return $firstStream;
    },

    /**
     * Returns the stream when gulp is run with the `--dev` flag. If not, the
     * function will return `false` so the `pipeStreams()` method will not
     * pipe this stream.
     *
     * @param {object} $stream - The stream wich to conditionally add.
     * @return {object|boolean}
     */
    'pipeWhenDev': function($stream)
    {
        return (this.isDev() ? $stream : false);
    },

    /**
     * Returns the stream when gulp is not run with the `--dev` flag. If it is,
     * the function will return `false` so the `pipeStreams()` method will not
     * pipe this stream.
     *
     * @param {object} $stream - The stream wich to conditionally add.
     * @return {object|boolean}
     */
    'pipeWhenNotDev': function($stream)
    {
        return (this.isDev() ? false : $stream);
    },

    /**
     * Returns a function wich returns the source value for the plugin wich can
     * be used in tasks added to gulp.
     *
     * @param {string} $defaultSrc
     * @return {function}
     */
    'src': function($defaultSrc)
    {
        return function($src)
        {
            return $defaultSrc;
        };
    },

    /**
     * Returns a function wich returns the destination value for the plugin
     * wich can be used in tasks added to gulp.
     *
     * @param {string} $defaultDest
     * @return {function}
     */
    'dest': function($defaultDest)
    {
        return function($dest)
        {
            return $defaultDest;
        };
    },

    /**
     * Returns a function wich returns an array with files and tasks to apply
     * to `gulp.watch`.
     *
     * @param {object} $plugin - The plugin wich is used in the watched task.
     * @param {string} $taskName - When empty, the basename of the caller file
     *                             will be used.
     * @return {function}
     */
    'watch': function($plugin, $taskName)
    {
        if (_.isEmpty($taskName))
        {
            $taskName = Path.basename(getCallerFile(), '.js');
        }

        return function($files, $tasks)
        {
            $files = arrayFromArguments($files, $plugin.src());
            $tasks = arrayFromArguments($tasks, $taskName);

            return [$files, $tasks];
        };
    }
}
