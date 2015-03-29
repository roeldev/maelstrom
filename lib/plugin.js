/**
 * maelstrom | lib/plugin.js
 * file version: 0.00.001
 */
'use strict';
console.log('require plugin.js');

var _     = require('underscore'),
    Utils = require('./utils.js');

////////////////////////////////////////////////////////////////////////////////

function Plugin()
{
    console.log('plugin constructor');

    this.src;
    this.dest;
    this.defaultStream;

    this.streams = {};
    this.tasks   = {};
};

Plugin.prototype.src = function($src)
{
    this.src = $src;
};

Plugin.prototype.dest = function($dest)
{
    this.dest = $dest;
};

Plugin.prototype.addStream = function($name, $stream)
{
    if (!this.defaultStream)
    {
        this.defaultStream = $name;
    }

    this.streams[$name] = $stream;
};

Plugin.prototype.addTask = function($name, $task)
{
    this.tasks[$name] = $task;
};

Plugin.prototype.stream = function($stream)
{

};

Plugin.prototype.task = function($task)
{
    var $result =
    {
        'files': [this.src()]
    };
};

module.exports = Plugin;
