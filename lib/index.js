/**
 * maelstrom | lib/index.js
 * file version: 0.00.008
 */
'use strict';
console.log('require index.js');

var _           = require('underscore'),
    FileSystem  = require('graceful-fs'),
    Init        = require('./init.js'),
    Path        = require('path');

////////////////////////////////////////////////////////////////////////////////

/**
 * Maelstrom initializer wich enables all default plugins and tasks.
 *
 * @return {object} - Returns the maelstrom object to allow method chaining.
 */
var Maelstrom = function()
{
    console.log('maelstrom()');

    if (arguments.length > 0)
    {
        this.init.apply(this, arguments);

        Init.defaultTasks();
        Init.defaultWatcher();
    }
    return this;
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
    console.log('maelstrom.init()');
    if (!Init.isGulpInstance($gulp))
    {
        console.log('Make sure to pass an instance of gulp to maelstrom.init()');
        return false;
    }

    this.tasks  = {};
    this.gulp   = $gulp;
    this.utils  = require('./utils.js');
    this.config = Init.createConfig(this, $customConfig);

    Init.loadPlugins(this);

    return this;
};

/**
 * Extend maelstrom by adding your own functions, objects or arrays.
 *
 * @param {string} $name [''] - The name to call the plugin: `maelstrom._name_`.
 * @param {string|object|function} $plugin - A plugin to add to maelstrom.
 * @return {object} - Returns the maelstrom object to allow method chaining.
 */
Maelstrom.extend = function($name, $plugin)
{
    console.log('maelstrom.extend()');
    /*if (arguments.length === 1)
    {
        $plugin = $name;
        if (_.isString($plugin))
        {
            $plugin = Path.resolve(process.cwd(), $plugin);
            if (FileSystem.existsSync($plugin))
            {
                $plugin = require($plugin);
                if (isValidPlugin($plugin))
                {
                    $name = Path.basename($name, '.js');
                    Maelstrom[$name] = $plugin;
                }
            }
        }
    }
    else if (arguments.length === 2)
    {
        if (_.isString($plugin))
        {
            $plugin = Path.resolve(process.cwd(), $plugin);
            $plugin = (FileSystem.existsSync($plugin)
                ? require($plugin)
                : false);
        }

        if (isValidPlugin($plugin))
        {
            Maelstrom[$name] = $plugin;
        }
    }*/

    return this;
};

/**
 * Pass a default maelstrom task to `gulp.task`.
 *
 * @param {string} $task - Name of the task to pass to `gulp.task`.
 * @return {object} - Returns the maelstrom object to allow method chaining.
 */
Maelstrom.useTask = function($taskName, $deps, $srcOptions, $destOptions)
{
    console.log('maelstrom.useTask()');

    var $task = this.tasks[$taskName];
    if (!_.isUndefined($task))
    {
        // add the task function to gulp
        this.gulp.task($taskName, $deps, $task.task);
    }

    return this;
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
    console.log('maelstrom.watch()');

    var $task = this.tasks[$taskName];
    if (!_.isUndefined($task))
    {
        var $files = combine($task.files, $extraFiles),
            $tasks = combine($task.tasks, $extraTasks);

        // add the task to be watched by gulp
        this.gulp.watch($files, $tasks);
    }

    return this;
};

Maelstrom.config = require('./config.js');

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
