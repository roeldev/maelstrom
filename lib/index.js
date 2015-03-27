/**
 * Maelstrom | lib/index.js
 * file version: 0.00.004
 */
'use strict';

var _          = require('underscore'),
    FileSystem = require('graceful-fs'),
    DeepExtend = require('deep-extend'),
    RequireDir = require('require-dir'),
    Path       = require('path'),
    Maelstrom;

//------------------------------------------------------------------------------

function initTasksDir($tasksDirs)
{
    var $requireDirs = ['./tasks'];
    if (_.isArray($tasksDirs))
    {
        $tasksDirs.unshift($requireDirs[0]);
        $requireDirs = $tasksDirs;
    }
    elseif (_.isString($tasksDirs))
    {
        $requireDirs.push($tasksDirs);
    }

    RequireDir($requireDirs);
}


/**
 * Returns a config object from the combined available sources in this order:
 * - default Maelstrom config
 * - `maelstrom.json`
 * - an object passed through `Maelstrom.init()`
 *
 * This means that the object passed through Maelstrom.init() will always
 * override any settings already set by any of the other config sources.
 *
 * @param {object} $customConfig - Custom config object
 * @return {object}
 */
function initConfig($customConfig)
{
    var $result            = {},
        $configs           = [$result, Maelstrom.config],
        $projectConfig     = {},
        $projectConfigFile = 'maelstrom.json';

    // read config json file from project root folder
    if (FileSystem.existsSync($projectConfigFile))
    {
        $projectConfig = FileSystem.readFileSync($projectConfigFile, 'utf8');
        $projectConfig = JSON.parse($projectConfig);

        if (!_.isEmpty($projectConfig))
        {
            $configs.push($projectConfig);
        }
    }

    if (_.isObject($customConfig) && !_.isEmpty($customConfig))
    {
        $configs.push($customConfig);
    }

    // combine the 3 config sources in to one object
    $result = DeepExtend.apply($result, $configs);
    return $result;
}

/**
 * Load all default Maelstrom plugins from the `lib/plugins/` folder.
 */
function initPlugins()
{
    var $pluginDir   = Path.resolve(__dirname, './plugins/'),
        $pluginFiles = FileSystem.readdirSync($pluginDir),
        $pluginFile,
        $pluginName,
        $plugin;

    while($pluginFiles.length)
    {
        $pluginFile = $pluginName = $pluginFiles.shift();
        $pluginFile = Path.resolve($pluginDir +'/'+ $pluginFile);

        $plugin = require($pluginFile);

        $pluginName = $plugin._name
            || $pluginName.substr(0, ($pluginName.length - 3));

        Maelstrom.extend($pluginName, $plugin);
    }
}

//------------------------------------------------------------------------------

/**
 * Maelstrom initializer wich enables all default plugins and tasks.
 *
 * @param {string|array} $tasksDirs - Array with dirs to require
 * @param {object} $config - Config options
 * @return {object} - Returns the Maelstrom object to allow method chaining.
 */
Maelstrom = function($gulp, $tasksDirs, $config)
{
    // bulk require dirs, used in short form
    initTasksDirs($tasksDirs);

    Maelstrom.init($gulp, $config);
    return Maelstrom;
};

Maelstrom.config  = require('./config.js');
Maelstrom.utils   = require('./utils.js');
Maelstrom.require = RequireDir;

/**
 * Maelstrom initializer to allow you to use the default plugins inside your
 * own Gulp tasks.
 *
 * @param {[type]} $gulp         [description]
 * @param {[type]} $customConfig [description]
 * @return {object} - Returns the Maelstrom object to allow method chaining.
 */
Maelstrom.init = function($gulp, $customConfig)
{
    Maelstrom.config = initConfig($customConfig);
    Maelstrom.gulp   = $gulp;

    initPlugins();
    return Maelstrom;
};

/**
 * Extend Maelstrom by adding your own objects and/or functions.
 *
 * @param {string} $name - The name to call the extension: Maelstrom.<name>.
 * @param {mixed} $item - A custom callback function.
 * @return {object} - Returns the Maelstrom object to allow method chaining.
 */
Maelstrom.extend = function($name, $item)
{
    Maelstrom[$name] = $item;
    return Maelstrom;
};

/**
 * Add a custom plugin to Maelstrom.
 *
 * @param {string} $name - Name of the plugin.
 * @param {object} $plugin - Object with atleast a `stream` key.
 * @return {object} - Returns the Maelstrom object to allow method chaining.
 */
Maelstrom.addPlugin = function($name, $plugin)
{
    $plugin = Maelstrom.utils.createPlugin($name, $plugin);
    return Maelstrom.extend($name, $plugin);
};

/*
    Maelstrom - A collection of Gulp tasks
    Copyright (c) 2015 Roel Schut (roelschut.nl)

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */
module.exports = Maelstrom;
