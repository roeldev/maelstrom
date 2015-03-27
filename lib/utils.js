/**
 * Maelstrom | lib/utils.js
 * file version: 0.00.004
 */
'use strict';

var _         = require('underscore'),
    Maelstrom = require('./index.js'),

    Gulp      = Maelstrom.gulp,
    GulpUtil  = require('gulp-util'),
    Path      = require('path');

//------------------------------------------------------------------------------

/**
 * @param {mixed} $array
 * @param {mixed} $defaultItem
 * @return {array}
 */
function createPluginWatchArray($array, $defaultItem)
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
     * Returns `true` if Gulp is run with the `--dev` flag.
     *
     * @return {boolean}
     */
    'isDev': function()
    {
        return !!GulpUtil.env.dev;
    },

    /**
     * Returns the plugin file path from where the Maelstrom.utils.plugin()
     * function is called.
     * *Example taken from http://stackoverflow.com/questions/16697791/nodejs-get-filename-of-caller-function
     *
     * @return {string|undefined}
     */
    getCallerFile: function()
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
    },

    /**
     * Creates a basic plugin from a module in a file.
     *
     * @param {string} $name [''] - The name of the plugin.
     * @param {object} $object - The object from where the plugin is created.
     * @return {object}
     */
    'createPlugin': function($name, $object)
    {
        if (arguments.length == 1)
        {
            $object = $name;
            $name = false;
        }

        // return original module when it does not have a stream key
        if (_.isUndefined($object.stream))
        {
            return $object;
        }

        // further create plugin
        var $plugin = $object.stream,
            $key;

        for ($key in $object)
        {
            if ($key != 'stream')
            {
                $plugin[$key] = $object[$key];
            }
        }

        if (_.isEmpty($name))
        {
            // attach some identifier stuff
            $plugin._file = this.getCallerFile();
            $plugin._name = Path.basename($plugin._file, '.js');
        }
        else
        {
            $plugin._name = $name;
        }

        // add a default watch function
        if (!_.isFunction($plugin.watch))
        {
            $plugin.watch = function($files, $tasks)
            {
                $files = createPluginWatchArray($files, $plugin.src());
                $tasks = createPluginWatchArray($tasks, $plugin._name);

                console.log($files);
                console.log($tasks);
                //return Gulp.watch($files, $tasks);
            };
        }
        return $plugin;
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
     * Returns the stream when Gulp is run with the `--dev` flag. If not, the
     * function will return `false` so the `pipeStreams()` method will not pipe
     * this stream.
     *
     * @param {object} $stream - The stream wich to conditionally add.
     * @return {object|boolean}
     */
    'pipeWhenDev': function($stream)
    {
        return (this.isDev() ? $stream : false);
    },

    /**
     * Returns the stream when Gulp is not run with the `--dev` flag. If it is,
     * the function will return `false` so the `pipeStreams()` method will not
     * pipe this stream.
     *
     * @param {object} $stream - The stream wich to conditionally add.
     * @return {object|boolean}
     */
    'pipeWhenNotDev': function($stream)
    {
        return (this.isDev() ? false : $stream);
    }
}
