/**
 * maelstrom | lib/Plugin.js
 */
'use strict';

const _        = require('lodash');
const GulpUtil = require('gulp-util');
const Path     = require('path');
const Through  = require('through2');

const logTaskAdd   = require('./utils/logTaskAdd');
const pluginExport = require('./utils/pluginExport');

const Maelstrom = require('./Maelstrom').instance();
const Task      = require('./Task');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

module.exports = class Plugin
{
    /**
     * Returns the main maelstrom instance.
     *
     * @var {object}
     */
    get maelstrom()
    {
        return Maelstrom;
    }

    // -------------------------------------------------------------------------

    /**
     * @param {string} $file
     * @param {string|array} $name
     * @param {object} $expose
     */
    constructor($file, $name, $expose)
    {
        let $aliases = [];
        if (_.isArray($name))
        {
            if ($name.length === 1)
            {
                $name = $name[0];
            }
            else
            {
                $aliases = $name;
                $name    = $aliases.shift();
            }
        }

        /**
         * The file from wich the plugin is loaded.
         *
         * @type {string}
         */
        this.file = $file;

        /**
         * The package information of the plugin.
         *
         * @type {object}
         */
        this.package = require( Path.resolve($file, '../../package.json') );

        /**
         * The name of plugin.
         *
         * @type {string}
         */
        this.name = $name;

        /**
         * Optional aliases(es) of the plugin.
         *
         * @type {string}
         */
        this.aliases = $aliases;

        /**
         * An object with extra functions/properties wich are exposed when
         * added to the maelstrom instance.
         *
         * @type {Object}
         */
        this.expose = {};

        /**
         * The name of the first or default stream wich should be returned by
         * `this.stream()` when no argument is passed.
         *
         * @var {string} defaultStream
         */
        this.defaultStream = null;

        /**
         * A list of streams added to this plugin.
         *
         * @var {object} streams
         */
        this.streams = {};

        /**
         * A list of tasks added to this plugin.
         *
         * @var {object} tasks
         */
        this.tasks = {};

        // expose all extra added functions/properties
        for (let $key in $expose)
        {
            if ($expose.hasOwnProperty($key))
            {
                let $value = $expose[$key];

                // create a bound version of the function so _this_ in the
                // function always revers to the plugin instance
                if (_.isFunction($value))
                {
                    $value = $value.bind(this);
                }

                this[$key]        = $value;
                this.expose[$key] = $value;
            }
        }
    }

    /**
     * The stream callback function will be called when the stream is called
     * through the main maelstrom object. The callback function should
     * always return a valid stream wich can be piped by gulp.
     *
     * @callback streamCallback
     * @return {object}
     */
    /**
     * Adds a stream to the plugin.
     *
     * @param {string} $name - Name of the stream.
     * @param {streamCallback} $stream - Stream callback function.
     */
    setStream($name, $stream)
    {
        if (_.isFunction($stream))
        {
            if (!this.defaultStream)
            {
                this.defaultStream = $name;
            }

            this.streams[$name] = $stream;
        }
    }

    /**
     * The task callback function will be directly added to gulp with
     * `gulp.task(taskName, callbackFn)`.
     *
     * @callback taskCallback
     * @return {object}
     */
    /**
     * Adds a task to the plugin.
     *
     * @param {string} $name - Name of the task.
     * @param {array} $type [null] - Type of the task to group them together
     * @param {taskCallback} $task - Task callback function.
     */
    setTask($name, $type, $task)
    {
        if (arguments.length === 2)
        {
            $task = arguments[1];
        }

        if (_.isFunction($task))
        {
            this.tasks[$name] = new Task(this, $name, $type, $task);
        }
    }

    /**
     * Returns a valid stream wich can be piped with gulp or any of it's
     * modules, or false when the requested stream does not exists.
     *
     * @param {string} $stream - Name of the stream to return.
     * @param {array} $args - Array with arguments to pass to the stream func.
     * @param {boolean} $alwaysReturnStream
     * @return {object|boolean}
     */
    stream($stream, $args, $alwaysReturnStream)
    {
        // when no stream to return is specified, use the default (first
        // added) stream of the plugin
        if (_.isEmpty($stream))
        {
            $stream = this.defaultStream;
        }

        let $result = this.streams[$stream];
        if (_.isUndefined($result))
        {
            $result = (($alwaysReturnStream === true) ?
                       Through.obj() :
                       false);
        }
        else
        {
            if (!_.isArray($args))
            {
                $args = [];
            }

            // export the stream
            $result = $result.apply(this, $args);
        }

        return $result;
    }

    /**
     * Create an export function and add it to the target.
     *
     * @param {object} $target
     * @return {object} Returns the target object.
     */
    export($target)
    {
        let $exporter = pluginExport(this);

        $target[this.name] = $exporter;

        for (let $i = 0, $iL = this.aliases.length; $i < $iL; $i++)
        {
            $target[this.aliases[$i]] = $exporter;
        }

        return $target;
    }

    /**
     * Adds a task from the plugin to gulp.
     *
     * @param {string} $taskName - Name of the task.
     * @return {object} Returns the added tasks' object.
     */
    addTask($taskName)
    {
        let $task = this.tasks[$taskName];
        let $args = Array.apply(null, arguments).slice(1);

        let $taskExport = $task.export($args);

        // add the task to gulp
        Maelstrom.gulp.task($task.name, $taskExport);

        if ($task.aliases)
        {
            // add the task with aliases names to gulp
            for (let $i = 0, $iL = $task.aliases.length; $i < $iL; $i++)
            {
                Maelstrom.gulp.task($task.aliases[$i], $taskExport);
            }
        }

        logTaskAdd($task);

        return $task;
    }

    /**
     * Adds multiple tasks from the plugin to gulp. When the tasks parameter is
     * FALSE, all tasks from the plugin are added.
     *
     * @param {string|array} $tasks
     * @param {string|array} $moreTasks...
     */
    addTasks($tasks)
    {
        let $result = [];

        if (_.isEmpty($tasks))
        {
            for (let $taskName in this.tasks)
            {
                $result.push(this.addTask($taskName));
            }

            return $result;
        }
        else if (arguments.length === 1)
        {
            if (_.isString($tasks))
            {
                return this.addTask($tasks);
            }
        }
        else
        {
            $tasks = _.toArray(arguments);
        }

        if (_.isArray($tasks))
        {
            for (let $i = 0, $iL = $tasks.length; $i < $iL; $i++)
            {
                this.addTask($tasks[$i]);
            }

            return $result;
        }
    }
};
