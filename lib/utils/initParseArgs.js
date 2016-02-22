/**
 * maelstrom | utils/initParseArgs.js
 */
'use strict';

const _ = require('underscore');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

const DEFAULT_PLUGINS = [
    'maelstrom-css',
    'maelstrom-icons',
    'maelstrom-images',
    'maelstrom-js',
    'maelstrom-sass',
];

function parsePluginsArg($arg)
{
    // when first arg is an array, use it to load all needed plugins
    if (_.isArray($arg))
    {
        this.plugins = $arg;
    }
    // when it's a string, only load one plugin
    else if (_.isString($arg))
    {
        this.plugins = [$arg]
    }
    // else, when it's false, do not load any plugins
    else if ($arg === false)
    {
        this.plugins = [];
    }
}

function parseConfigArg($arg)
{
    let $result = false;

    // when the 2nd arg is an object, use it for custom config settings
    if (_.isObject($arg) && !_.isArray($arg))
    {
        this.config = $arg;

        $result = true;
    }

    return $result;
}

// -----------------------------------------------------------------------------

const initParseArgs = function initParseArgs()
{
    // the default maelstrom.init() args values
    let $result = {
        'plugins': DEFAULT_PLUGINS,
        'config':  {}
    };

    if (arguments.length >= 2)
    {
        parsePluginsArg.call($result, arguments[0]);
        parseConfigArg.call($result, arguments[1]);
    }
    else if (arguments.length === 1)
    {
        if (!parseConfigArg.call($result, arguments[0]))
        {
            parsePluginsArg.call($result, arguments[0]);
        }
    }

    return $result;
};

// -----------------------------------------------------------------------------

initParseArgs.DEFAULT_PLUGINS = DEFAULT_PLUGINS;
initParseArgs.config          = parseConfigArg;
initParseArgs.plugin          = parsePluginsArg;

module.exports = initParseArgs;
