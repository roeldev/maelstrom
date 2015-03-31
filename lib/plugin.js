/**
 * maelstrom | lib/plugin.js
 * file version: 0.00.002
 */
'use strict';
//console.log('require plugin.js');

var _       = require('underscore'),
    Path    = require('path'),
    Through = require('through2');

////////////////////////////////////////////////////////////////////////////////

function exportStreamer($plugin)
{
    var $export = function($stream)
    {
        return $plugin.stream($stream, true);
    };

    $export.src = function()
    {
        return $plugin.src();
    };

    $export.dest = function()
    {
        return $plugin.dest();
    };

    return $export;
}

function exportTask($plugin, $task)
{
    return new Object(
    {
        'plugin': $plugin,

        'task': function()
        {
            var $result = $plugin.tasks[$task];
            if (!_.isFunction($result))
            {
                $result = function()
                {
                    console.log('invalid task!');
                };
            }
            else
            {
                var $args = _.toArray(arguments);
                    $args.unshift($plugin);

                $result = function()
                {
                    return $plugin.tasks[$task].apply(null, $args);
                };
            }

            return $result;
        }
    });
}

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
     * The src callback function.
     *
     * @var {function} src
     */
    'src': null,

    /**
     * The dest callback function.
     *
     * @var {function} dest
     */
    'dest': null,

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
    'addStream': function($name, $stream)
    {
        if (!this.defaultStream)
        {
            this.defaultStream = $name;
        }

        this.streams[$name] = $stream;
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
    'addTask': function($name, $task)
    {
        //console.log('['+ this._name +'] add task '+ $name +', ', this.tasks);
        this.tasks[$name] = $task;
    },

    /**
     * Returns a valid stream wich can be piped with gulp or any of it's
     * modules, or false when the requested stream does not exists.
     *
     * @param {string} $stream - Name of the stream to return.
     * @param {boolean} $alwaysReturnStream
     * @return {object|boolean}
     */
    'stream': function($stream, $alwaysReturnStream)
    {
        //console.log('Plugin.stream() '+ $stream);

        // on empty $stream, return this.defaultStream
        if (_.isEmpty($stream))
        {
            $stream = this.defaultStream;
        }

        var $result = this.streams[$stream];
        if (_.isUndefined($result))
        {
            $result = (($alwaysReturnStream === true) ? Through.obj() : false);
        }
        else
        {
            $result = $result.apply(this);
        }

        return $result;
    },

    /**
     * Returns as valid function wich can be used by `gulp.task()`, or false
     * when the requested stream does not exists.
     *
     * @param {string} $task - Name of the task to return.
     * @return {object|boolean}
     */
    /*'task': function($task)
    {
        console.log('Plugin.task() '+ $task);

        var $result = this.tasks[$task];
        if (_.isEmpty($result))
        {
            $result = false;
        }

        return $result;
    },*/

    /**
     * Exports a stream from the plugin by creating a wrapper function wich is
     * added to maelstrom. When called, this function returns a valid stream,
     * wich can be used in your own custom gulp tasks.
     *
     * @return {function}
     */
    'exportStreamer': function()
    {
        //console.log('['+ this._name +'] Plugin.exportStreamer()');
        return exportStreamer(this);
    },

    /**
     * Exports a task from the plugin.
     *
     * @param {string} $task - The name of the task to export.
     * @return {object}
     */
    'exportTask': function($task)
    {
        //console.log('['+ this._name +'] Plugin.exportTask()', $task);
        return exportTask(this, $task);
    }
};

module.exports = Plugin;
