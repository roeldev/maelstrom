/**
 * maelstrom | lib/index.js
 *
 * maelstrom - A collection of gulp tasks
 * Copyright (c) 2015-2016 Roel Schut (roelschut.nl)

 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */
'use strict';

const _        = require('lodash');
const GulpUtil = require('gulp-util');
const Tildify  = require('tildify');

const checkGulpInstance = require('./utils/checkGulpInstance');
const checkValidMode    = require('./utils/checkValidMode');
const configDefault     = require('./utils/configDefault');
const configInit        = require('./utils/configInit');
const initParseArgs     = require('./utils/initParseArgs');
const logError          = require('./utils/logError');
const logInit           = require('./utils/logInit');
const logPlugin         = require('./utils/logPlugin');
const pluginRequire     = require('./utils/pluginRequire');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

const Maelstrom = class
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
            'clean':      require('./streams/clean'),
            'plumber':    require('./streams/plumber'),
            'size':       require('./streams/size'),
            // 'sourcemaps': require('./streams/sourcemaps'),
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
        this.config = configDefault('./lib/configs/maelstrom.yml');

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
        logInit();

        // basic check for gulp module
        if (!checkGulpInstance($gulp))
        {
            logError(['Make sure to pass an instance of gulp to',
                      'maelstrom.init()']);

            return false;
        }

        // parse given arguments and return an object with all needed values
        let $args = Array.apply(null, arguments).slice(1);
        $args = initParseArgs.apply(this, $args);

        // add the gulp instance to the main object and collect all config
        // settings
        this.gulp   = $gulp;
        this.config = configInit(this.config, $args.config);

        // load all specified plugins and add their tasks
        if ($args.plugins)
        {
            for (let $i = 0, $iL = $args.plugins.length; $i < $iL; $i++)
            {
                let $plugin = this.plugin($args.plugins[$i]);
                $plugin.addTasks();
            }
        }

        // add a default watch task
        this.addWatcher();

        return this;
    }

    /**
     * Return a default stream.
     */
    stream($stream)
    {
        let $args = Array.apply(null, arguments).slice(1);
        return this._streams[$stream].apply(this, $args);
    }

    /**
     * Load a plugin when it's not already loaded and return the Plugin object.
     *
     * @param {string} $package - Name of the plugin package
     * @return {object} The Plugin object to return
     */
    plugin($package)
    {
        let $result = false;
        if (this._plugins[$package])
        {
            $result = this._plugins[$package];
        }
        else
        {
            $result = pluginRequire($package);

            if ($result instanceof Error)
            {
                logError('- Unable to load plugin ' + $package, $result);
            }
            else
            {
                this._plugins[$package] = $result;

                if (this.verboseLevel(true))
                {
                    logPlugin($result);
                }

                // create an exporter function for the plugin and add it to
                // maelstrom so all exposed properties and streams can be
                // used by the outside world
                $result.export(this);
            }
        }

        return $result;
    }

    addTask($taskName)
    {

    }

    addWatcher()
    {
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
    }

    /**
     * Adds a task to watch with `gulp.watch()`. The files to watch are taken
     * from the plugin wich defined the task. The default result from the
     * `gulp.watch()` function is returned. If this fails for any reason
     * `false` is returned.
     *
     * @param {string} $taskName - Name of a maelstrom task to watch.
     * @param {array|string} $extraFiles - Optional extra files.
     * @param {array|string} $extraTasks - Optional extra tasks.
     * @return {object|boolean}
     */
    watchTask($taskName, $extraFiles, $extraTasks)
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
                logError('No files to watch for task' + $taskName + '!');
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
                this.watchTask($taskName);
            }
        }
    }

    // -------------------------------------------------------------------------

    /**
     * Checks of the given argument is an instance of the maelstrom.Plugin
     * class.
     *
     * @param {mixed} $plugin
     * @return {boolean}
     */
    isPlugin($plugin)
    {
        return ($plugin instanceof this.Plugin);
    }

    /**
     * Returns `true` if gulp is run with the `--dev` flag and `prod` is not
     * the default active mode.
     *
     * @return {boolean}
     */
    isDevMode()
    {
        let $mode   = 'dev';
        let $isDev  = checkValidMode('dev');
        let $isProd = checkValidMode('prod');

        // when both are set, or both are not set, always default to config
        if ($isDev === $isProd)
        {
            $mode = this.config.defaultMode;
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
    isProdMode()
    {
        return !this.isDevMode();
    }

    /**
     * Returns `true` if gulp is run with the `--verbose` flag or if the
     * `verbose` config option in equals `true`.
     *
     * @return {boolean}
     */
    verboseLevel($level)
    {
        let $default = (this.config.verbose === true);
        let $env     = GulpUtil.env.verbose;

        return (_.isUndefined($env) ? $default : ($env === true));
    }
};

// -----------------------------------------------------------------------------

Maelstrom.TASK_COMPILE = 'compile';
Maelstrom.TASK_LINT    = 'lint';
Maelstrom.TASK_CLEAN   = 'clean';

// -----------------------------------------------------------------------------

// create an instance when not already done
if (!(Maelstrom.instance instanceof Maelstrom))
{
    Maelstrom.instance = new Maelstrom();
}

module.exports = Maelstrom.instance;
