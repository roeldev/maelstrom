/**
 * maelstrom | lib/Maelstrom.js
 *
 * - tests
 */
'use strict';

const _        = require('lodash');
const GulpUtil = require('gulp-util');
const Tildify  = require('tildify');

const checkGulpInstance = require('./utils/checkGulpInstance');
const configDefault     = require('./utils/configDefault');
const configInit        = require('./utils/configInit');
const initParseArgs     = require('./utils/initParseArgs');
const logError          = require('./utils/logError');
const logInit           = require('./utils/logInit');
const logPlugin         = require('./utils/logPlugin');
const logTaskWatch      = require('./utils/logTaskWatch');
const pluginRequire     = require('./utils/pluginRequire');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

// task group type constants
const TASK_CLEAN   = 'clean';
const TASK_COMPILE = 'compile';
const TASK_LINT    = 'lint';
const TASK_WATCH   = 'watch';

// -----------------------------------------------------------------------------

/**
 * The created maelstrom object instance.
 *
 * @type {object}
 */
let _instance = null;

/**
 * A reference to the used gulp object.
 *
 * @type {object}
 */
let _gulp = null;

/**
 * List with registered plugins.
 *
 * @type {object}
 */
const _plugins = {};

/**
 * Some basic streams that are used a lot.
 *
 * @type {object}
 */
const _streams =
{
    'clean':   require('./streams/clean'),
    'plumber': require('./streams/plumber'),
    'size':    require('./streams/size'),
    // 'sourcemaps': require('./streams/sourcemaps'),
};

/**
 * List with registered tasks.
 *
 * @type {object}
 */
const _tasks = {};

/**
 * List with registered tasks grouped by task group type.
 *
 * @type {object}
 */
const _tasksGrouped = {};

// -----------------------------------------------------------------------------

module.exports = class Maelstrom
{
    /**
     * Returns the static maelstrom instance.
     *
     * @type {object}
     */
    static instance()
    {
        if (!(_instance instanceof Maelstrom))
        {
            _instance = new Maelstrom();
        }

        return _instance;
    }

    /**
     * An array with default plugins to load.
     *
     * @type {array}
     */
    /*get DEFAULT_PLUGINS()
    {
        return
        [
            // 'maelstrom-css',
            // 'maelstrom-icons',
            // 'maelstrom-images',
            'maelstrom-js',
            // 'maelstrom-sass',
        ];
    }*/

    /**
     * Task group clean constant.
     * @type {string}
     */
    get TASK_CLEAN()
    {
        return TASK_CLEAN;
    }

    /**
     * Task group compile constant.
     * @type {string}
     */
    get TASK_COMPILE()
    {
        return TASK_COMPILE;
    }

    /**
     * Task group lint constant.
     * @type {string}
     */
    get TASK_LINT()
    {
        return TASK_LINT;
    }

    /**
     * Task group watch constant.
     * @type {string}
     */
    get TASK_WATCH()
    {
        return TASK_WATCH;
    }

    // -------------------------------------------------------------------------

    /**
     * A reference to the used gulp object.
     *
     * @type {object}
     */
    get gulp()
    {
        return _gulp;
    }

    /**
     * List with registered plugins.
     *
     * @type {object}
     */
    get plugins()
    {
        return _plugins;
    }

    /**
     * Some basic streams that are used a lot.
     *
     * @type {object}
     */
    get streams()
    {
        return _streams;
    }

    /**
     * List with registered tasks.
     *
     * @type {object}
     */
    get tasks()
    {
        return _tasks;
    }

    // -------------------------------------------------------------------------

    constructor()
    {
        /**
         * List with tasks wich should be added to the default watch task.
         *
         * @type {object}
         */
        // this._watch = {};

        /**
         * The default config settings.
         *
         * @type {object}
         */
        this.config = configDefault('./lib/configs/maelstrom.yml');
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

        // add the gulp instance to static constant
        _gulp = $gulp;
        // and collect all config settings
        this.config = configInit(this.config, $args.config);

        // load all specified plugins and add their tasks
        if ($args.plugins)
        {
            for (let $i = 0, $iL = $args.plugins.length; $i < $iL; $i++)
            {
                let $plugin = this.plugin($args.plugins[$i]);
                if (!$plugin)
                {
                    continue;
                }

                let $tasks  = $plugin.addTasks();
                for (let $j = 0, $jL = $tasks.length; $j < $jL; $j++)
                {
                    let $task = $tasks[$j];
                    _tasks[$task.name] = $task;

                    for (let $k = 0, $kL = $task.type.length; $k < $kL; $k++)
                    {
                        let $taskType = $task.type[$k];

                        if (!_tasksGrouped[$taskType])
                        {
                            _tasksGrouped[$taskType] = {};
                        }

                        _tasksGrouped[$taskType][$task.name] = $task;
                    }
                }
            }
        }

        // add a default watch task
        this.addWatchTask();

        // and we're done
        return this;
    }

    /**
     * Return a default stream.
     *
     * @param {string} $stream - Name of the default stream to return
     * @return {object}
     */
    stream($stream)
    {
        let $args = Array.apply(null, arguments).slice(1);
        return _streams[$stream].apply(this, $args);
    }

    /**
     * Load a plugin when it's not already loaded and return the Plugin object.
     *
     * @param {string} $package - Name of the plugin package.
     * @return {object} The Plugin object associated with the package.
     */
    plugin($package)
    {
        let $result = false;
        if (_plugins[$package])
        {
            // return an already loaded plugin
            $result = _plugins[$package];
        }
        else
        {
            // require the new plugin
            let $plugin = pluginRequire($package);

            // display an error when loading fails
            if ($plugin instanceof Error)
            {
                logError('- Unable to load plugin ' + $package, $plugin);
            }
            else
            {
                _plugins[$package] = $result = $plugin;

                if (this.utils.verboseLevel(true))
                {
                    logPlugin($plugin);
                }

                // create an exporter function for the plugin and add it to
                // maelstrom so all exposed properties and streams can be
                // used by the outside world
                $plugin.export(this);
            }
        }

        return $result;
    }

    /*addTask($taskName)
    {

    }*/

    /**
     * Adds a default watch task to gulp.
     */
    addWatchTask()
    {
        let self = this;

        _gulp.task('watch', function()
        {
            self.watchAllTasks();

            for (let $pluginName in _plugins)
            {
                let $plugin = _plugins[$pluginName];

                if ($plugin.watch)
                {
                    console.log('  '+$plugin.name);
                    $plugin.watch();
                }
            }
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
        let $task   = _tasks[$taskName];

        if (!_.isUndefined($task))
        {
            let $files = [];
            if ($task.plugin && _.isFunction($task.plugin.src))
            {
                $files = $task.plugin.src();
            }

            // console.log($files, $extraFiles);

            $files = this.utils.extendArgs($extraFiles, $files);
            if ($files.length > 0)
            {
                logTaskWatch($task);
                console.log($files);

                // add the task to be watched by gulp
                $result = _gulp.watch($files,
                    this.utils.extendArgs($extraTasks, $taskName));
            }
            else
            {
                logError('No files to watch for task ' + $taskName);
            }
        }

        return $result;
    }

    /**
     * Add all known tasks to `gulp.watch()`.
     */
    watchAllTasks()
    {
        let $tasks = _tasksGrouped[TASK_WATCH];

        for (let $taskName in $tasks)
        {
            if ($tasks.hasOwnProperty($taskName))
            {
                this.watchTask($taskName);
            }
        }
    }
};
