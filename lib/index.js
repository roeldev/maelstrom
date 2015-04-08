/**
 * maelstrom | lib/index.js
 * file version: 0.00.010
 */
'use strict';
console.log('index.js');

var _          = require('underscore'),
    FileSystem = require('graceful-fs'),
    GulpUtil   = require('gulp-util'),
    Init       = require('./init.js'),
    Path       = require('path');

////////////////////////////////////////////////////////////////////////////////

/**
 * Loads a plugin file and returns it's required result, or returns `false` on
 * failure.
 *
 * @param {string} $file - A plugin file to require.
 * @return {mixed}
 */
function requirePluginFile($file)
{
    $file = Path.resolve(process.cwd(), $file);
    return (FileSystem.existsSync($file) ? require($file) : false);
}

/**
 * Checks whether the given plugin is valid.
 *
 * @param {function|object|array} $plugin
 * @return {boolean}
 */
function isValidPlugin($plugin)
{
    return (_.isFunction($plugin) || _.isObject($plugin) || _.isArray($plugin));
}

//------------------------------------------------------------------------------

/**
 * Initializing maelstrom by calling this function passes all arguments to the
 * `maelstrom.init()` function, and adds all default tasks to gulp.
 */
var Maelstrom = function()
{
    if (arguments.length > 0)
    {
        // call maelstrom.init()
        this.init.apply(this, arguments);

        // add tasks to gulp
        Init.defaultTasks(this);
        // create a default watch task
        Init.defaultWatcher(this);
    }
    return this;
};

/**
 * Maelstrom initializer wich allows you to use the default plugins inside your
 * own gulp tasks.
 *
 * @param {object} $gulp - A reference to the required gulp module.
 * @param {object} $customConfig - An optional custom config object.
 */
Maelstrom.init = function($gulp, $customConfig)
{
    GulpUtil.log('init maelstrom');

    if (!Init.isGulpInstance($gulp))
    {
        GulpUtil.log(GulpUtil.colors.red('Error!') +
                 ' Make sure to pass an instance of gulp to maelstrom.init()');

        return false;
    }

    this.tasks  = {};
    this.gulp   = $gulp;
    this.utils  = require('./utils.js');
    this.config = Init.createConfig(this, $customConfig);

    // load plugins and add to main maelstrom instance
    Init.loadPlugins(this);
};

/**
 * This function adds a default maelstrom task to `gulp.task()`. The result
 * from the `gulp.task()` function is returned. If for some reason
 * `gulp.task()` is not called, the default value of `false` is returned.
 *
 * @param {string} $taskName - Name of the maelstrom task to add to gulp.
 * @param {boolean} $includeSubTasks [true]
 * @param {mixed} $options... - All other args are passed along to the task.
 * @return {object|boolean}
 */
Maelstrom.task = function($taskName, $includeSubTasks)
{
    var $result = false,
        $task   = this.tasks[$taskName];

    if (!_.isUndefined($task))
    {
        var $args = _.toArray(arguments);
        if (_.isBoolean($includeSubTasks))
        {
            // unshift $includeSubTasks from the args array
            $args.shift();
            $args.shift();

            // add the task name back to args
            $args.unshift($taskName);
        }

        // add the task function to gulp
        $task   = $task.task.apply(null, $args);
        $result = this.gulp.task($taskName, $task);
    }

    return $result;
};

/**
 * This function adds a file watcher with `gulp.watch()` for the given task.
 * The files to watch are taken from the plugin wich defined the task.
 * The default result from the `gulp.watch()` function is returned. If for some
 * reason `gulp.watch` is not called, the default value of `false` is returned.
 *
 * @param {string} $taskName - Name of the maelstrom task to watch.
 * @param {array|string} $extraFiles - Optional extra files to pass to `gulp.watch`.
 * @param {array|string} $extraTasks - Optional extra tasks to pass to `gulp.watch`.
 * @return {object|boolean}
 */
Maelstrom.watch = function($taskName, $extraFiles, $extraTasks)
{
    var $result = false,
        $task   = this.tasks[$taskName];

    if (!_.isUndefined($task))
    {
        var $files = this.utils.extendArgs($extraFiles, $task.plugin.src()),
            $tasks = this.utils.extendArgs($extraTasks, $taskName);

        // add the task to be watched by gulp
        $result = this.gulp.watch($files, $tasks);
    }

    return $result;
};

/**
 * Extend maelstrom by adding your own functions, objects or arrays. To load a
 * plugin from a file pass the filename as a string. The results from the
 * file (`module.exports`) will be added as the plugin.
 *
 * @param {string} $name [''] - The name to call the plugin: `maelstrom._name_`.
 * @param {function|object|string} $plugin - A plugin to add to maelstrom.
 * @return {boolean} - Returns `true` when the plugin is succesfully added.
 */
Maelstrom.extend = function($name, $plugin)
{
    var $result = false;
    if (arguments.length === 1)
    {
        $plugin = $name;
        if (_.isString($plugin))
        {
            $plugin = requirePluginFile($plugin);
            if (isValidPlugin($plugin))
            {
                $name       = Path.basename($name, '.js');
                this[$name] = $plugin;
                $result     = true;
            }
        }
    }
    else if (arguments.length === 2)
    {
        if (_.isString($plugin))
        {
            $plugin = requirePluginFile($plugin);
        }

        if (isValidPlugin($plugin))
        {
            this[$name] = $plugin;
            $result     = true;
        }
    }

    return $result;
};

/**
 * Load the default config settings.
 *
 * @type {object}
 */
Maelstrom.config = require('./config.js');

/*
    maelstrom - A collection of gulp tasks
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
