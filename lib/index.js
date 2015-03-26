/**
 * Maelstrom | lib/index.js
 * file version: 0.00.003
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
 * @param  {Object} $customConfig - Custom config object
 * @return {Object}
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
 *
 * @return null
 */
function initPlugins()
{
    var $pluginDir   = Path.resolve(__dirname, './plugins/'),
        $pluginFiles = FileSystem.readdirSync($pluginDir),
        $pluginFile,
        $pluginName;

    while($pluginFiles.length)
    {
        $pluginFile = $pluginName = $pluginFiles.shift();

        $pluginName = $pluginName.substr(0, ($pluginName.length - 3));
        $pluginFile = Path.resolve($pluginDir +'/'+ $pluginFile);

        Maelstrom.addPlugin($pluginName, $pluginFile);
    }
}

//------------------------------------------------------------------------------

/**
 * Maelstrom initializer wich enables all default plugins and tasks.
 *
 * @param  {string|array} $tasksDirs - Array with dirs to require
 * @param  {object} $config - Config options
 * @return null
 */
Maelstrom = function($gulp, $tasksDirs, $config)
{
    // bulk require dirs, used in short form
    initTasksDirs($tasksDirs);

    Maelstrom.init($gulp, $config);
    return Maelstrom;
};

Maelstrom.config  = require('./config.js');
Maelstrom.require = RequireDir;

/**
 * Maelstrom initializer to allow you to use the default plugins inside your
 * own Gulp tasks.
 *
 * @param  {[type]} $gulp         [description]
 * @param  {[type]} $customConfig [description]
 * @return {[type]}               [description]
 */
Maelstrom.init = function($gulp, $customConfig)
{
    Maelstrom.config = initConfig($customConfig);
    Maelstrom.gulp   = $gulp;

    initPlugins();
    return Maelstrom;
};

/**
 * Adds a plugin to Maelstrom.
 *
 * @param  {string} $name - Name of the plugin.
 * @param  {string} $file - The plugin file to require.
 */
Maelstrom.addPlugin = function($name, $file)
{
    var $module = require($file),
        $plugin = $module.stream;

    if (!_.isUndefined($plugin))
    {
        $plugin._name = $name;
        $plugin._file = $file;
        $plugin.src   = $module.src;
        $plugin.dest  = $module.dest;
        $plugin.watch = $module.watch;

        if (!_.isFunction($plugin.watch))
        {
            $plugin.watch = function($files, $tasks)
            {
                if (!_.isArray($files))
                {
                    $files = (_.isString($files) ? [$files] : []);
                }
                if (!_.isArray($tasks))
                {
                    $tasks = (_.isString($tasks) ? [$tasks] : []);
                }

                $files.unshift($plugin.src());
                $tasks.unshift($plugin._name);

                return Maelstrom.gulp.watch($files, $tasks);
            };
        }
    }

    Maelstrom[$name] = $plugin;
    return Maelstrom;
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
