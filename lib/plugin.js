/**
 * maelstrom | lib/plugin.js
 */
'use strict';

const _        = require('lodash');
const GulpUtil = require('gulp-util');
const Through  = require('through2');

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
        addStream($name, $stream)
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
         * @param {taskCallback} $task - Task callback function.
         */
        addTask($name, $task)
        {
            if (_.isFunction($task))
            {
                this.tasks[$name] = $task;
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
         * Exports a stream from the plugin by creating a wrapper function wich
         * is added to maelstrom. When called, this function returns a valid
         * stream, wich can be used in your own custom gulp tasks.
         *
         * @return {function}
         */
        exportStreamer()
        {
            let self = this;

            // create a wrapper function wich directs all calls to the plugin's
            // stream method
            let $result = function($stream)
            {
                let $args = _.toArray(arguments);
                $args.shift();

                // initialize the plugin when not already done
                if (!self.initialized)
                {
                    self.init();
                }

                return self.stream($stream, $args, true);
            };

            // extend the wrapper function with functions/properties wich are
            // added to the plugin and are intended to be exposed
            for (let $key in this.expose)
            {
                if (this.expose.hasOwnProperty($key))
                {
                    $result[$key] = this.expose[$key];
                }
            }

            return $result;
        }

        /**
         * Exports a task from the plugin.
         *
         * @param {string} $task - The name of the task to export.
         * @return {object}
         */
        exportTask($task)
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
        }
    };
}
