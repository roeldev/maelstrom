/**
 * Maelstrom | lib/index.js
 * file version: 0.00.006
 */
'use strict';

var _          = require('underscore'),
    FileSystem = require('graceful-fs'),
    DeepExtend = require('deep-extend'),
    RequireDir = require('require-dir'),
    Path       = require('path'),
    Maelstrom;

//------------------------------------------------------------------------------

/**
 * Basic check if the passed argument is actually gulp.
 *
 * @param {object} $gulp
 * @return {boolean}
 */
function isValidGulpInstance($gulp)
{
    var $result = false;
    if (!_.isEmpty($gulp) && $gulp.constructor)
    {
        var $constructor = $gulp.constructor.toString();
        $result = ($constructor.substr(0, 14) == 'function Gulp(');
    }

    return $result;
}

/**
 * Returns a config object from the combined available sources in this order:
 * - default maelstrom config
 * - `maelstrom.json`
 * - an object passed through `Maelstrom.init()`
 *
 * This means that the object passed through `maelstrom.init()` will always
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
 * Load all default maelstrom plugins from the `lib/plugins/` folder.
 */
function initPlugins()
{
    var $pluginDir   = Path.resolve(__dirname, 'plugins/'),
        $pluginFiles = FileSystem.readdirSync($pluginDir),
        $pluginFile,
        $pluginName,
        $plugin;

    while ($pluginFiles.length)
    {
        $pluginFile = $pluginName = $pluginFiles.shift();
        $pluginFile = Path.resolve($pluginDir +'/'+ $pluginFile);

        $plugin     = require($pluginFile);
        $pluginName = $plugin._name || Path.basename($pluginName, '.js');

        Maelstrom.extend($pluginName, $plugin);
    }
}

/**
 * Load all default maelstrom tasks from the `lib/tasks/` folder.
 */
function initTasks()
{
    var $taskDir   = Path.resolve(__dirname, 'tasks/'),
        $taskFiles = FileSystem.readdirSync($taskDir),
        $taskFile,
        $taskName;

    while ($taskFiles.length)
    {
        $taskFile = $taskName = $taskFiles.shift();
        $taskFile = Path.resolve($taskDir +'/'+ $taskFile);
        $taskName = Path.basename($taskName, '.js');

        Maelstrom.tasks[$taskName] = require($taskFile);
    }
}

//------------------------------------------------------------------------------

/**
 * Maelstrom initializer wich enables all default plugins and tasks.
 *
 * @return {object} - Returns the maelstrom object to allow method chaining.
 */
Maelstrom = function()
{
    if (arguments.length > 0)
    {
        Maelstrom.init.apply(this, arguments);

        // add all default maelstrom tasks as gulp tasks
        var $task;
        for ($task in Maelstrom.tasks) Maelstrom.useTask($task);

        // add all default maelstrom tasks to the gulp 'watch' task
        Maelstrom.gulp.task('watch', function()
        {
            for ($task in Maelstrom.tasks) Maelstrom.watch($task);
        });
    }
    return Maelstrom;
};

/**
 * Maelstrom initializer to allow you to use the default plugins inside your
 * own gulp tasks.
 *
 * @param {object} $gulp - A reference to the gulp instance
 * @param {object} $customConfig - An optional custom config object.
 * @return {object} - Returns the maelstrom object to allow method chaining.
 */
Maelstrom.init = function($gulp, $customConfig)
{
    if (!isValidGulpInstance($gulp))
    {
        console.log('Make sure to pass an instance of gulp to maelstrom.init()');
        return false;
    }

    Maelstrom.gulp   = $gulp;
    Maelstrom.config = initConfig($customConfig);
    Maelstrom.tasks  = {};
    Maelstrom.utils  = require('./utils.js');

    initPlugins();
    initTasks();

    return Maelstrom;
};

/**
 * Extend maelstrom by adding your own objects and/or functions.
 *
 * @param {string} $name - The name to call the extension: `maelstrom._name_`.
 * @param {mixed} $item - A custom callback function.
 * @return {object} - Returns the maelstrom object to allow method chaining.
 */
Maelstrom.extend = function($name, $item)
{
    Maelstrom[$name] = $item;
    return Maelstrom;
};

/**
 * Add a custom plugin to maelstrom.
 *
 * @param {string} $name - Name of the plugin.
 * @param {object} $plugin - Object with at least a `stream` key.
 * @return {object} - Returns the maelstrom object to allow method chaining.
 */
Maelstrom.addPlugin = function($name, $plugin)
{
    $plugin = Maelstrom.utils.createPlugin($name, $plugin);
    return Maelstrom.extend($name, $plugin);
};

/**
 * Pass a default maelstrom task to `gulp.task`.
 *
 * @param {string} $task - Name of the task to pass to `gulp.task`.
 * @return {object} - Returns the maelstrom object to allow method chaining.
 */
Maelstrom.useTask = function($taskName)
{
    var $task = Maelstrom.tasks[$taskName];
    if (!_.isUndefined($task))
    {
        // add the task function to gulp
        Maelstrom.gulp.task($taskName, $task.task);
    }

    return Maelstrom;
};

/**
 * Apply a default maelstrom task to `gulp.watch`.
 *
 * @param  {string} $taskName - Name of the task to `gulp.watch`.
 * @param  {[type]} $extraFiles - Optional extra files to pass to `gulp.watch`.
 * @param  {[type]} $extraTasks - Optional extra tasks to pass to `gulp.watch`.
 * @return {object} - Returns the maelstrom object to allow method chaining.
 */
Maelstrom.watch = function($taskName, $extraFiles, $extraTasks)
{
    var $task = Maelstrom.tasks[$taskName];
    if (!_.isUndefined($task))
    {
        // creates an array with arguments to apply to gulp.watch
        var $args = $task.watch($extraFiles, $extraTasks);
        // add the task to be watched by gulp
        Maelstrom.gulp.watch.apply(Maelstrom.gulp, $args);
    }

    return Maelstrom;
};

Maelstrom.config  = require('./config.js');
Maelstrom.require = RequireDir;
//Maelstrom.init.bind(null, require('gulp'));

/*
    maelstrom - A collection of Gulp tasks
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
