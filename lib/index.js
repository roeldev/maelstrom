/**
 * maelstrom | lib/index.js
 */
'use strict';

const _        = require('underscore');
const GulpUtil = require('gulp-util');
const Package  = require('../package.json');
const Tildify  = require('tildify');

const configDefault     = require('./utils/configDefault');
const configInit        = require('./utils/configInit');
const checkGulpInstance = require('./utils/checkGulpInstance');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

const DEFAULT_PLUGINS = [
    'maelstrom-css',
    'maelstrom-icons',
    'maelstrom-images',
    'maelstrom-js',
    'maelstrom-sass',
];

// -----------------------------------------------------------------------------

const MaelstromClass = class
{
    constructor()
    {
        /**
         * List with registered plugins.
         *
         * @type {object}
         */
        this._plugins = {};

        /**
         * Some basic streams that are used a lot.
         *
         * @type {object}
         */
        this._streams = {
            'clean':   require('./streams/clean').call(this, this),
            'plumber': require('./streams/plumber').call(this, this),
            'size':    require('./streams/size').call(this, this),
        };

        /**
         * List with registered tasks.
         *
         * @type {object}
         */
        this._tasks = {};

        /**
         * List with tasks wich should be added to the default watch task.
         *
         * @type {object}
         */
        this._watch = {};

        /**
         * The default config settings.
         *
         * @type {object}
         */
        this.config = configDefault('./configs/maelstrom.yml');

        /**
         * A reference to the used gulp object.
         *
         * @type {object}
         */
        this.gulp = null;

        /**
         * Object with all utility related functions wich can be used by plugins
         * or other public functions.
         *
         * @type {object}
         */
        this.utils = require('./utils')(this);

        /**
         * A class for maelstrom plugins.
         *
         * @type {class}
         */
        this.Plugin = require('./plugin')(this);

        // extend the extend method with some additional subfunctions
        this.extend.fromFile    = require('./utils/extendFromFile').bind(this);
        this.extend.fromPackage = require('./utils/extendFromPackage').bind(this);
        this.extend.fromPlugin  = require('./utils/extendFromPlugin').bind(this);
        this.extend.fromObject  = require('./utils/extendFromObject').bind(this);
    }

    /**
     * Maelstrom initializer wich allows you to use the default plugins inside
     * your own gulp tasks.
     *
     * @param {object} $gulp - A reference to the required gulp module.
     * @param {boolean|array} $plugins [true]
     * @param {object} $customConfig - An optional custom config object.
     */
    init($gulp, $plugins, $customConfig)
    {
        GulpUtil.log(
            'Init maelstrom',
            GulpUtil.colors.grey('(' + Package.version + ')')
        );

        // basic check for gulp module
        if (!checkGulpInstance($gulp))
        {
            GulpUtil.log(GulpUtil.colors.red('Error!') +
                ' Make sure to pass an instance of gulp to maelstrom.init()');

            return false;
        }

        // when 2 args are passed and the 2nd is an object but not an array,
        // use this object as custom config settings and use default plugins
        if (arguments.length === 2 &&
            _.isObject(arguments[1]) &&
            !_.isArray(arguments[1]))
        {
            $plugins      = DEFAULT_PLUGINS;
            $customConfig = arguments[1];
        }
        // on empty array or when $plugins is not FALSE, use default plugins
        else if ((_.isArray($plugins) && $plugins.length === 0) ||
                 $plugins !== false)
        {
            $plugins = DEFAULT_PLUGINS;
        }

        // add the gulp instance to the main object and collect all config
        // settings
        this.gulp   = $gulp;
        this.config = configInit(this.config, $customConfig);

        // load all specified plugins
        if ($plugins)
        {
            for (let $i = 0, $iL = $plugins.length; $i < $iL; $i++)
            {
                this.extend($plugins[$i]);
            }
        }

        let self = this;

        this.gulp.task('watch', function()
        {
            self.watchAll();

            /*BrowserSync.init(Maelstrom.config.browserSync);

            Gulp.watch([
            ])
            .on('change', function()
            {
                setTimeout(BrowserSync.reload, 800);
            });*/
        });

        return this;
    }

    /**
     * Extend maelstrom by adding a plugin or your own functions/properties.
     */
    extend($name, $plugin)
    {
        // console.log('extend', $name, $plugin);

        let $result = false;

        if (arguments.length === 1)
        {
            $plugin = arguments[0];

            if (_.isString($plugin))
            {
                if (false) // is file?
                {
                    $result = this.extend.fromFile.call(this, $plugin);
                }
                else
                {
                    $result = this.extend.fromPackage.call(this, $plugin);
                }
            }
            else if (this.utils.isPlugin($plugin))
            {
                $result = this.extend.fromPlugin.call(this, $plugin);
            }
            else if (_.isObject($plugin))
            {
                $result = this.extend.fromObject.call(this, $plugin);
            }
        }
        /*else
        {

        }*/

        return $result;
    }

    stream($stream)
    {
        return this._streams[$stream]();
    }

    /**
     * This function adds a default maelstrom task to `gulp.task()`. The result
     * from the `gulp.task()` function is returned. If for some reason
     * `gulp.task()` is not called, the default value of `false` is returned.
     *
     * @param {string} $taskName - Name of the maelstrom task to add to gulp.
     * @param {mixed} $options... - All other args are passed along to the task.
     * @return {object|boolean}
     */
    task($taskName)
    {
        let $result = false;
        let $task   = this._tasks[$taskName];

        if (!_.isUndefined($task))
        {
            let $args = _.toArray(arguments);

            // add the task function to gulp
            $result = this.gulp.task($taskName, $task.fn.apply(null, $args));

            if (this.utils.isVerbose())
            {
                GulpUtil.log('  - Adding task',
                    GulpUtil.colors.cyan($taskName)
                );
            }
        }

        return $result;
    }

    /**
     * This function adds a file watcher with `gulp.watch()` for the given task.
     * The files to watch are taken from the plugin wich defined the task.
     * The default result from the `gulp.watch()` function is returned. If for
     * some reason `gulp.watch` is not called, the default value of `false`
     * is returned.
     *
     * @param {string} $taskName - Name of a maelstrom task to watch.
     * @param {array|string} $extraFiles - Optional extra files.
     * @param {array|string} $extraTasks - Optional extra tasks.
     * @return {object|boolean}
     */
    watch($taskName, $extraFiles, $extraTasks)
    {
        let $result = false;
        let $task   = this._tasks[$taskName];

        if (!_.isUndefined($task))
        {
            let $files = [];
            if ($task.plugin && _.isFunction($task.plugin.src))
            {
                $files = $task.plugin.src();
            }

            $files = this.utils.extendArgs($extraFiles, $files);
            if ($files.length > 0)
            {
                // add the task to be watched by gulp
                $result = this.gulp.watch($files,
                    this.utils.extendArgs($extraTasks, $taskName));
            }
            else
            {
                GulpUtil.log(GulpUtil.colors.red('Warning!'),
                    'No files to watch for task' + $taskName + '!');
            }
        }

        return $result;
    }

    /**
     * Add all known tasks to `gulp.watch()`.
     */
    watchAll()
    {
        for (let $taskName in this._tasks)
        {
            if (this._tasks.hasOwnProperty($taskName))
            {
                this.watch($taskName);
            }
        }
    }
};

/*
    maelstrom - A collection of gulp tasks
    Copyright (c) 2015-2016 Roel Schut (roelschut.nl)

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
module.exports = new MaelstromClass();
