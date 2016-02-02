/**
 * maelstrom | lib/utils.js
 */
'use strict';

var _          = require('underscore');
var FileSystem = require('graceful-fs');
var GulpUtil   = require('gulp-util');
var Path       = require('path');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

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

// -----------------------------------------------------------------------------

module.exports = function(Maelstrom)
{
    var Utils = {};

    /**
     * Empty function.
     */
    Utils.noop = function()
    {
    };

    /**
     * Returns `true` if gulp is run with the `--dev` flag and `prod` is not
     * the default active mode.
     *
     * @return {boolean}
     */
    Utils.isDev = function()
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
    };

    /**
     * Returns `true` if gulp is run with the `--prod` flag and `dev` is not
     * the default active mode.
     *
     * @return {boolean}
     */
    Utils.isProd = function()
    {
        return !Maelstrom.utils.isDev();
    };

    /**
     * Returns `true` if gulp is run with the `--verbose` flag or if the
     * `verbose` config option in equals `true`.
     *
     * @return {boolean}
     */
    Utils.isVerbose = function()
    {
        var $default = (Maelstrom.config.verbose === true);
        var $env     = GulpUtil.env.verbose;

        return (_.isUndefined($env) ? $default : ($env === true));
    };

    /**
     * Extends an argument or aguments array with a given default value. This
     * default value is shifted to the front of the array.
     *
     * @param {mixed} $args
     * @param {mixed} $default
     * @return {array} An arguments array.
     */
    Utils.extendArgs = function($args, $default)
    {
        var $result = [];

        if (_.isArray($default))
        {
            $result = $default;

            if (_.isArray($args))
            {
                $result = $default.concat($args);
            }
            else if (!_.isEmpty($args))
            {
                $result.push($args);
            }
        }
        else if (_.isArray($args))
        {
            $result = $args;
            if (!_.isEmpty($default))
            {
                $result.unshift($default);
            }
        }
        else
        {
            if (!_.isEmpty($default))
            {
                $result.push($default);
            }

            if (!_.isEmpty($args))
            {
                $result.push($args);
            }
        }

        return $result;
    };

    /**
     * Loads a plugin file and returns it's required result, or returns `false`
     * on failure.
     *
     * @param {string} $file - A plugin file to require.
     * @return {mixed}
     */
    Utils.requirePluginFile = function($file)
    {
        $file = Path.resolve(process.cwd(), $file);
        return (FileSystem.existsSync($file) ? require($file) : false);
    };

    /**
     * Checks whether the given plugin is valid.
     *
     * @param {function|object|array} $plugin
     * @return {boolean}
     */
    Utils.isValidPlugin = function($plugin)
    {
        return (_.isFunction($plugin) ||
                _.isObject($plugin) ||
                _.isArray($plugin));
    };

    return Utils;
};
