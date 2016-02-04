/**
 * maelstrom | lib/index.js
 */
'use strict';

var _        = require('underscore');
var Confirge = require('confirge');
var GulpUtil = require('gulp-util');
var Path     = require('path');
var Package  = require('../package.json');
var Tildify  = require('tildify');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

/**
 * Initializing maelstrom by calling this function passes all arguments to the
 * `maelstrom.init()` function, and adds all default tasks to gulp.
 */
var Maelstrom = function()
{
    if (arguments.length > 0)
    {
        return Maelstrom.init.apply(Maelstrom, arguments);
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
    GulpUtil.log('Init maelstrom ' +
                 GulpUtil.colors.grey('(' + Package.version + ')'));

    // load the init functions like this: pass the current Maelstrom object to
    // it's scope. otherwise the Maelstrom var inside thie seperate file is an
    // empty object :(
    var Init = require('./init.js')(Maelstrom);

    // basic check for gulp module
    if (!Init.isGulpInstance($gulp))
    {
        GulpUtil.log(GulpUtil.colors.red('Error!') +
            ' Make sure to pass an instance of gulp to maelstrom.init()');

        return false;
    }
    else if (arguments.length === 2 && _.isObject(arguments[1]))
    {
        $addTasks     = true;
        $customConfig = arguments[1];
    }
    else
    {
        $addTasks = ($addTasks !== false);
    }

    // create empty objects
    Maelstrom._tasks = {};
    Maelstrom._watch = {};

    // add the gulp instance to the main object and collect all config settings
    Maelstrom.gulp   = $gulp;
    Maelstrom.config = Init.createConfig($customConfig);

    // load plugins and add to main maelstrom instance
    Init.loadPlugins( Maelstrom._pluginDir );
    Init.loadPackage('maelstrom-js');
    Init.loadPackage('maelstrom-sass');

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
 * @param {mixed} $options... - All other args are passed along to the task.
 * @return {object|boolean}
 */
Maelstrom.task = function($taskName)
{
    var $result = false;
    var $task   = Maelstrom._tasks[$taskName];

    if (!_.isUndefined($task))
    {
        var $args = _.toArray(arguments);

        // add the task function to gulp
        $result = Maelstrom.gulp.task($taskName, $task.fn.apply(null, $args));

        if (Maelstrom.utils.isVerbose())
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
    var $task   = Maelstrom._tasks[$taskName];

    if (!_.isUndefined($task))
    {
        var $files = [];
        if ($task.plugin && _.isFunction($task.plugin.src))
        {
            $files = $task.plugin.src();
        }

        $files = Maelstrom.utils.extendArgs($extraFiles, $files);
        if ($files.length > 0)
        {
            // add the task to be watched by gulp
            $result = Maelstrom.gulp.watch($files,
                Maelstrom.utils.extendArgs($extraTasks, $taskName));
        }
        else
        {
            GulpUtil.log(GulpUtil.colors.red('Warning!') +
                ' No files to watch for task \'' + $taskName + '\'!');
        }
    }

    return $result;
};

Maelstrom.watchAll = function()
{
    for (var $taskName in Maelstrom._tasks)
    {
        if (Maelstrom._tasks.hasOwnProperty($taskName))
        {
            Maelstrom.watch($taskName);
        }
    }
};

/**
 * Extend maelstrom by adding your own functions, objects or arrays. To load a
 * plugin from a file pass the filename as a string. The results from the
 * file (`module.exports`) will be added as the plugin.
 *
 * @param {string} $name [''] - The name to call the plugin: `maelstrom._name_`.
 * @param {function|object|string} $plugin - A plugin to add to maelstrom.
 * @return {string|boolean} - Returns the name of the plugin when succesfully
 *                            added.
 */
Maelstrom.extend = function($name, $plugin)
{
    var $result = false;
    if (arguments.length === 1)
    {
        $plugin = arguments[0];
        if (_.isString($plugin))
        {
            $plugin = Maelstrom.utils.requirePluginFile($plugin);
            if (Maelstrom.utils.isValidPlugin($plugin))
            {
                $name = $result  = Path.basename($name, '.js');
                Maelstrom[$name] = $plugin;
            }
        }
    }
    else if (arguments.length >= 2)
    {
        if (_.isString($plugin))
        {
            $plugin = Maelstrom.utils.requirePluginFile($plugin);
        }

        if (Maelstrom.utils.isValidPlugin($plugin))
        {
            Maelstrom[$name] = $plugin;
            $result          = $name;
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

/**
 * List with registered tasks.
 *
 * @type {object}
 */
Maelstrom._tasks = {};

/**
 * List with tasks wich should be added to the default watch task.
 *
 * @type {object}
 */
Maelstrom._watch = {};

/**
 * Path to plugins dir. May only be overwritten when doing tests.
 *
 * @type {string}
 */
Maelstrom._pluginDir = Path.resolve(__dirname, 'plugins/');

/**
 * Plugin class wich can be used to create your own custom maelstrom plugins.
 *
 * @type {class}
 */
Maelstrom.Plugin = require('./plugin.js');

/**
 * Object with all available utility functions.
 *
 * @type {object}
 */
Maelstrom.utils = require('./utils.js')(Maelstrom);

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
