/**
 * Maelstrom | lib/utils.js
 * file version: 0.00.002
 */
'use strict';

var GulpUtil = require('gulp-util');

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
     * Creates a Maelstrom plugin.
     *
     * @param  {string} $name - Name of the plugin.
     * @param  {Object} $options - An object with the keys `src`, `dest`,
     *                             `stream` and `watch`.
     * @return {Function}
     */
    'plugin': function($name, $options)
    {
        var $plugin       = $options.stream;
            $plugin.name  = $name;
            $plugin.src   = $options.src;
            $plugin.dest  = $options.dest;
            $plugin.watch = $options.watch;

        return $plugin;
    },

    /**
     * Pipe an array of streams to the first stream.
     *
     * @param  {Array} $streams - Array of streams.
     * @return {Object} A stream.
     */
    'pipeStreams': function($streams)
    {
        var $stream,
            $firstStream;

        while($streams.length > 0)
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
     * @param  {Object} $stream - The stream wich to conditionally add.
     * @return {Object|boolean}
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
     * @param  {Object} $stream - The stream wich to conditionally add.
     * @return {Object|boolean}
     */
    'pipeWhenNotDev': function($stream)
    {
        return (this.isDev() ? false : $stream);
    }
}
