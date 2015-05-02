/**
 * maelstrom | lib/index.js
 * file version: 0.00.015
 */
'use strict';

var _           = require('underscore');
var Confirge    = require('confirge');
var GulpUtil    = require('gulp-util');
var Path        = require('path');
var Tildify     = require('tildify');
var Maelstrom;
var Init;
var Utils;

////////////////////////////////////////////////////////////////////////////////

/**
 * Initializing maelstrom by calling this function passes all arguments to the
 * `maelstrom.init()` function, and adds all default tasks to gulp.
 */
Maelstrom = function()
{
    if (arguments.length > 0)
    {
        Maelstrom.init.apply(Maelstrom, arguments);
    }
    return Maelstrom;
};

/**
 * Maelstrom initializer wich allows you to use the default plugins inside your
 * own gulp tasks.
 *
 * @param {object} $gulp - A reference to the required gulp module.
 * @param {boolean|array} $addTasks [true]
 * @param {object} $customConfig - An optional custom config object.
 */
Maelstrom.init = function($gulp, $addTasks, $customConfig)
{
    GulpUtil.log('Init maelstrom');

    // load the init and util functions like this and pass the current
    // maelstrom object to their scope. otherwise the Maelstrom var inside
    // those files is an empty object :(
    Init  = require('./init.js')(Maelstrom);
    Utils = require('./utils.js')(Maelstrom);

    // basic check for gulp module
    if (!Init.isGulpInstance($gulp))
    {
        GulpUtil.log(GulpUtil.colors.red('Error!') +
            ' Make sure to pass an instance of gulp to maelstrom.init()');

        return false;
    }
    else if (_.isObject($addTasks) && arguments.length === 2)
    {
        $addTasks     = true;
        $customConfig = arguments[1];
    }
    else
    {
        $addTasks = ($addTasks !== false);
    }

    Maelstrom.tasks  = {};
    Maelstrom.gulp   = $gulp;
    Maelstrom.config = Init.createConfig($customConfig);
    Maelstrom.utils  = Utils;
    Maelstrom.Plugin = require('./plugin.js');

    // load plugins and add to main maelstrom instance
    Init.loadPlugins( Path.resolve(__dirname, 'plugins/') );

    // add default tasks to gulp?
    if ($addTasks)
    {
        // add tasks to gulp
        Init.defaultTasks();
        // create a default watch task
        Init.defaultWatcher();
    }

    return Maelstrom;
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
    var $result = false;
    var $task   = Maelstrom.tasks[$taskName];

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
        $result = Maelstrom.gulp.task($taskName, $task.fn.apply(null, $args));

        if (Maelstrom.config.verbose)
        {
            GulpUtil.log('- Add task \'' +
                GulpUtil.colors.cyan($taskName) + '\': ' +
                GulpUtil.colors.magenta( Tildify($task.plugin._file) ));
        }
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
 * @param {array|string} $extraFiles - Optional extra files.
 * @param {array|string} $extraTasks - Optional extra tasks.
 * @return {object|boolean}
 */
Maelstrom.watch = function($taskName, $extraFiles, $extraTasks)
{
    var $result = false;
    var $task   = Maelstrom.tasks[$taskName];

    if (!_.isUndefined($task))
    {
        var $files = Utils.extendArgs($extraFiles, $task.plugin.src());
        var $tasks = Utils.extendArgs($extraTasks, $taskName);

        // add the task to be watched by gulp
        $result = Maelstrom.gulp.watch($files, $tasks);
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
    if (arguments.length === 1)
    {
        $plugin = arguments[0];
        if (_.isString($plugin))
        {
            $plugin = Utils.requirePluginFile($plugin);
            if (Utils.isValidPlugin($plugin))
            {
                $name            = Path.basename($name, '.js');
                Maelstrom[$name] = $plugin;

                return true;
            }
        }
    }
    else if (arguments.length === 2)
    {
        if (_.isString($plugin))
        {
            $plugin = Utils.requirePluginFile($plugin);
        }

        if (Utils.isValidPlugin($plugin))
        {
            Maelstrom[$name] = $plugin;

            return true;
        }
    }

    return false;
};

/**
 * Load the default config settings.
 *
 * @type {object}
 */
Maelstrom.config = (function()
{
    var $moduleDir  = Path.dirname(__dirname);
    var $configFile = Path.resolve($moduleDir, './configs/maelstrom.yml');
    var $config     = Confirge($configFile); // load default config file

    // add src and dest paths as vars
    $config = Confirge.extend($config,
    {
        'vars':
        {
            'module': $moduleDir,
            'src':    $config.src,
            'dest':   $config.dest
        }
    });

    return $config;
})();

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
