/**
 * maelstrom | lib/utils.js
 * file version: 0.00.008
 */
'use strict';
//console.log('require utils.js');

var _         = require('underscore'),
    Maelstrom = require('./index.js'),
    GulpUtil  = require('gulp-util');

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

module.exports =
{
    /**
     * Returns `true` if gulp is run with the `--dev` flag and `prod` is not
     * the default active mode.
     *
     * @return {boolean}
     */
    'isDev': function()
    {
        var $mode   = 'dev',
            $isDev  = checkValidMode('dev'),
            $isProd = checkValidMode('prod');

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
     * Returns `true` if gulp is run with the `--prod` flag and `dev` is not
     * the default active mode.
     *
     * @return {boolean}
     */
    'isProd': function()
    {
        return !this.isDev();
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
     * Returns the stream when maelstrom is in dev mode. If not, the function
     * will return `false` so the `pipeStreams()` method will not pipe this
     * stream.
     *
     * @param {object} $stream - The stream wich to conditionally add.
     * @return {object|boolean}
     */
    'pipeWhenDev': function($stream)
    {
        return (this.isDev() ? $stream : false);
    },

    /**
     * Returns the stream when gulp is in prod mode. If it is not, the function
     * will return `false` so the `pipeStreams()` method will not pipe this
     * stream.
     *
     * @param {object} $stream - The stream wich to conditionally add.
     * @return {object|boolean}
     */
    'pipeWhenProd': function($stream)
    {
        return (this.isProd() ? $stream : false);
    }
};
