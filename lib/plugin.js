/**
 * maelstrom | lib/plugin.js
 * file version: 0.00.002
 */
'use strict';
console.log('require plugin.js');

var _     = require('underscore'),
    Utils = require('./utils.js');

////////////////////////////////////////////////////////////////////////////////

/**
 * @class
 */
function Plugin()
{
}

Plugin.prototype =
{
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
    'streams': {},

    /**
     * A list of tasks added to this plugin.
     *
     * @var {object} tasks
     */
    'tasks': {},

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
        this.tasks[$name] = $task;
    },

    /**
     * Returns a valid stream wich can be piped with gulp or any of it's
     * modules.
     *
     * @param {string} $stream - Name of the stream to return.
     * @return {object}
     */
    'stream': function($stream)
    {
        console.log('Plugin.stream() '+ $stream);

        if (!$stream) $stream = this.defaultStream;
        return this.streams[$stream]();
    },

    'task': function($task)
    {
        var $result =
        {
            'files': [this.src()]
        };
    }
};

module.exports = Plugin;
