/**
 * maelstrom | lib/utils.js
 * file version: 0.00.015
 */
'use strict';

var _          = require('underscore');
var FileSystem = require('graceful-fs');
var GulpUtil   = require('gulp-util');
var Path       = require('path');

////////////////////////////////////////////////////////////////////////////////

/**
 * Check wheter the given mode is set as an env variable.
 *
 * @param {string} $mode - The mode to check.
 * @return {boolean}
 */
function checkValidMode($mode)
{
    var $result = false;

    if (!_.isUndefined(GulpUtil.env[$mode]))
    {
        $result = (GulpUtil.env[$mode] === true);
    }

    return $result;
}

//------------------------------------------------------------------------------

module.exports = function(Maelstrom)
{
    return new Object(
    {
        /**
         * Empty function.
         */
        'noop': function()
        {
        },

        /**
         * Returns `true` if gulp is run with the `--dev` flag and `prod` is
         * not the default active mode.
         *
         * @return {boolean}
         */
        'isDev': function()
        {
            var $mode   = 'dev';
            var $isDev  = checkValidMode('dev');
            var $isProd = checkValidMode('prod');

            // when both are set, or both are not set, always default to config
            if ($isDev === $isProd)
            {
                $mode = Maelstrom.config.defaultMode;
            }
            else if ($isProd)
            {
                $mode = 'prod';
            }

            return ($mode === 'dev');
        },

        /**
         * Returns `true` if gulp is run with the `--prod` flag and `dev` is
         * not the default active mode.
         *
         * @return {boolean}
         */
        'isProd': function()
        {
            return !this.isDev();
        },

        /**
         * Extends an argument or aguments array with a given default value.
         * This default value is shifted to the front of the array.
         *
         * @param {mixed} $args
         * @param {mixed} $default
         * @return {array} An arguments array.
         */
        'extendArgs': function($args, $default)
        {
            var $result;

            if (_.isArray($args))
            {
                $result = $args;
                $result.unshift($default);
            }
            else
            {
                $result = [$default];
                $result.push($args);
            }

            return $result;
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

                if ($stream === false)
                {
                    continue;
                }

                if (!$firstStream)
                {
                    $firstStream = $stream;
                }
                else
                {
                    $firstStream.pipe($stream);
                }
            }

            return $firstStream;
        },

        /**
         * Returns the stream when the condition is true. If not, the function
         * will return `false` so the `pipeStreams()` method will not pipe this
         * stream.
         *
         * @param {boolean} $condition - The condition to check against.
         * @param {object} $stream - The stream wich to conditionally add.
         * @return {object|boolean}
         */
        'pipeWhen': function($condition, $stream)
        {
            return ($condition === true ? $stream : false);
        },

        /**
         * Returns the stream when maelstrom is in dev mode. If not, the
         * function will return `false` so the `pipeStreams()` method will not
         * pipe this stream.
         *
         * @param {object} $stream - The stream wich to conditionally add.
         * @param {boolean} $overrideCondition - Extra condition to check
         * against.
         * @return {object|boolean}
         */
        'pipeWhenDev': function($stream, $overrideCondition)
        {
            $overrideCondition = ($overrideCondition === true);
            return ((this.isDev() || $overrideCondition) ? $stream : false);
        },

        /**
         * Returns the stream when gulp is in prod mode. If it is not, the
         * function will return `false` so the `pipeStreams()` method will not
         * pipe this stream.
         *
         * @param {object} $stream - The stream wich to conditionally add.
         * @param {boolean} $overrideCondition - Extra condition to check
         * against.
         * @return {object|boolean}
         */
        'pipeWhenProd': function($stream, $overrideCondition)
        {
            $overrideCondition = ($overrideCondition === true);
            return ((this.isProd() || $overrideCondition) ? $stream : false);
        },

        /**
         * Loads a plugin file and returns it's required result, or returns
         * `false` on failure.
         *
         * @param {string} $file - A plugin file to require.
         * @return {mixed}
         */
        'requirePluginFile': function($file)
        {
            $file = Path.resolve(process.cwd(), $file);
            return (FileSystem.existsSync($file) ? require($file) : false);
        },

        /**
         * Checks whether the given plugin is valid.
         *
         * @param {function|object|array} $plugin
         * @return {boolean}
         */
        'isValidPlugin': function($plugin)
        {
            return (_.isFunction($plugin) ||
                    _.isObject($plugin) ||
                    _.isArray($plugin));
        }
    });
};
