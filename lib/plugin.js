/**
 * maelstrom | lib/plugin.js
 */
'use strict';

const _        = require('lodash');
const GulpUtil = require('gulp-util');
const Path     = require('path');
const Through  = require('through2');

const logTask      = require('./utils/logTask');
const pluginExport = require('./utils/pluginExport');
const Task         = require('./task');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

module.exports = function($maelstrom)
{
    return class
    {
        /**
         * @param {string} $file
         * @param {string|array} $name
         * @param {object} $expose
         */
        constructor($file, $name, $expose)
        {
            let $alias = [];
            if (_.isArray($name))
            {
                if ($name.length === 1)
                {
                    $name = $name[0];
                }
                else
                {
                    $alias = $name;
                    $name  = $alias.shift();
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
            this.package = require(Path.resolve($file, '../../package.json'));

            /**
             * The name of plugin.
             *
             * @type {string}
             */
            this.name = $name;

            /**
             * Optional alias(es) of the plugin.
             *
             * @type {string}
             */
            this.alias = $alias;

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

            /**
             * When the plugin is fully loaded, eg. all streams and tasks are
             * added, this flag will be set to true.
             *
             * @type {boolean}
             */
            this.initialized = false;

            // remove keys wich should not be exposed
            // delete $expose.file;
            // delete $expose.name;
            // delete $expose.alias;

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
         * Returns the main maelstrom instance.
         *
         * @var {object}
         */
        get maelstrom()
        {
            return $maelstrom;
        }

        init()
        {
            this.initialized = true;

            console.log('init plugin '+ this.name);
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
         */
        export($target)
        {
            let $exporter = pluginExport(this);

            $target[this.name] = $exporter;

            for (let $i = 0, $iL = this.alias.length; $i < $iL; $i++)
            {
                $target[this.alias[$i]] = $exporter;
            }

            return $target;
        }

        /**
         * Adds a task from the plugin to gulp.
         *
         * @param {string} $taskName - Name of the task.
         */
        addTask($taskName)
        {
            let $task = this.tasks[$taskName];
            let $args = Array.apply(null, arguments).slice(1);

            // let $taskExport = $task.export.apply(null, $args);
            let $taskExport = $task.export2($args);

            // add the task to gulp
            this.maelstrom.gulp.task($task.name, $taskExport);

            if ($task.alias)
            {
                // add the task with alias names to gulp
                for (let $i = 0, $iL = $task.alias.length; $i < $iL; $i++)
                {
                    this.maelstrom.gulp.task($task.alias[$i], $taskExport);
                }
            }

            logTask($task);

            return $task;
        }

        /**
         *
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

        /*getTaskNames()
        {
            let $result = [];

            for (let $i = 0, $iL = arguments.length; $i < $iL; $i++)
            {
                let $taskName = arguments[$i];
                if (this.tasks[$taskName])
                {
                    let $task = this.tasks[$taskName];
                    $result = _.concat($result, $task.names);
                }
            }

            return $result;
        }*/

        /**
         * Exports a task from the plugin.
         *
         * @param {string} $task - The name of the task to export.
         * @return {object}
         */
        /*exportTask($task)
        {
            let $plugin = this;
            let $export = { 'plugin': $plugin };

            $export.fn = function()
            {
                let $result = $plugin.tasks[$task];

                if (!_.isFunction($result))
                {
                    $result = function()
                    {
                        return Through.obj(function($file)
                        {
                            let $msg = [
                                GulpUtil.colors.red('Warning'),
                                ': Unknown maelstrom task ',
                                GulpUtil.colors.cyan($task)
                            ];

                            GulpUtil.log($msg.join(''));
                            this.push($file);
                        });
                    };
                }
                else
                {
                    let $args = _.toArray(arguments);
                    // $args.unshift($plugin);

                    $result = function()
                    {
                        return $plugin.tasks[$task].apply(null, $args);
                    };
                }

                return $result;
            };

            return $export;
        }*/
    };
}
