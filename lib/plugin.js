/**
 * maelstrom | lib/plugin.js
 */
'use strict';

var _          = require('underscore');
var GulpUtil   = require('gulp-util');
var Chalk      = GulpUtil.colors;
var FileSystem = require('fs');
var Path       = require('path');
var Through    = require('through2');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

/**
 * @class
 */
function Plugin($filename)
{
    this._file   = $filename;
    this._name   = Path.basename($filename, '.js');
    this.streams = {};
    this.tasks   = {};
}

Plugin.prototype =
{
    '_file': null,
    '_name': null,

    /**
     * The name of the first or default stream wich should be returned by
     * `this.stream()` when no argument is passed.
     *
     * @var {string} defaultStream
     */
    'defaultStream': null,

    /**
     * A list of streams added to this plugin.
     *
     * @var {object} streams
     */
    'streams': null,

    /**
     * A list of tasks added to this plugin.
     *
     * @var {object} tasks
     */
    'tasks': null,

    /**
     * The stream callback function will be called when the stream is called
     * through the main maelstrom object. The callback function should always
     * return a valid stream wich can be piped by gulp.
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
    addStream: function($name, $stream)
    {
        if (_.isFunction($stream))
        {
            if (!this.defaultStream)
            {
                this.defaultStream = $name;
            }

            this.streams[$name] = $stream;
        }
    },

    readStreams: function($dir)
    {
        if (!$dir) $dir = 'streams';
        $dir = Path.dirname(this._file) + Path.sep + $dir;

        var $streamFiles = FileSystem.readdirSync($dir);
        for (var $i = 0, $iL = $streamFiles.length; $i < $iL; $i++)
        {
            var $streamFile = $streamFiles[$i];
            require($streamFile)(this, Maelstrom);
        }
    },

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
    addTask: function($name, $task)
    {
        if (_.isFunction($task))
        {
            this.tasks[$name] = $task;
        }
    },

    readTasks: function($dir)
    {
        if (!$dir) $dir = 'tasks';
    },

    /**
     * Returns a valid stream wich can be piped with gulp or any of it's
     * modules, or false when the requested stream does not exists.
     *
     * @param {string} $stream - Name of the stream to return.
     * @param {array} $args - Array with arguments to pass to the stream func.
     * @param {boolean} $alwaysReturnStream
     * @return {object|boolean}
     */
    stream: function($stream, $args, $alwaysReturnStream)
    {
        // on empty $stream, return this.defaultStream
        if (_.isEmpty($stream))
        {
            $stream = this.defaultStream;
        }

        var $result = this.streams[$stream];
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

            $result = $result.apply(this, $args);
        }

        return $result;
    },

    /**
     * Exports a stream from the plugin by creating a wrapper function wich is
     * added to maelstrom. When called, this function returns a valid stream,
     * wich can be used in your own custom gulp tasks.
     *
     * @return {function}
     */
    exportStreamer: function()
    {
        var $plugin = this;
        var $export = function($stream)
        {
            var $args = _.toArray(arguments);
            $args.shift();

            return $plugin.stream($stream, $args, true);
        };

        // extend the export streamer with functions/vars added to PluginExport
        for (var $key in $plugin)
        {
            if (_.isUndefined(Plugin.prototype[$key]))
            {
                $export[$key] = $plugin[$key];
            }
        }

        return $export;
    },

    /**
     * Exports a task from the plugin.
     *
     * @param {string} $task - The name of the task to export.
     * @return {object}
     */
    exportTask: function($task)
    {
        var $plugin = this;
        var $export = { 'plugin': $plugin };

        $export.fn = function()
        {
            var $result = $plugin.tasks[$task];

            if (!_.isFunction($result))
            {
                $result = function()
                {
                    return Through.obj(function($file)
                    {
                        GulpUtil.log(Chalk.red('Warning') + ': Unknown ' +
                            'maelstrom task \'' + Chalk.cyan($task) + '\'.');

                        this.push($file);
                    });
                };
            }
            else
            {
                var $args = _.toArray(arguments);
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

module.exports = Plugin;
