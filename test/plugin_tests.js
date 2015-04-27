/**
 * maelstrom | test/plugin_tests.js
 * file version: 0.00.001
 */
'use strict';

var _         = require('underscore');
var Maelstrom = require('../lib/index.js');
var Utils     = require('../lib/utils.js')(Maelstrom);
var Plugin    = require('../lib/plugin.js');
var Assert    = require('assert');
var Path      = require('path');
var Through   = require('through2');

var THROUGH_CONSTRUCTOR = Through.obj().constructor;

////////////////////////////////////////////////////////////////////////////////

function getFixtureFile($file)
{
    return Path.resolve(__dirname, './fixtures/' + $file);
}

function getPlugin($streams, $tasks)
{
    var $plugin = new Plugin(__filename);

    if ($streams === true)
    {
        $plugin.addStream('stream1', Utils.noop);
        $plugin.addStream('stream2', Utils.noop);
    }

    if ($tasks === true)
    {
        $plugin.addTask('task1', Utils.noop);
        $plugin.addTask('task2', Utils.noop);
    }

    return $plugin;
}

//------------------------------------------------------------------------------

describe('Plugin.addStream()', function()
{
    it('should add the stream to the streams list', function()
    {
        Assert.deepEqual(getPlugin(true).streams,
        {
            'stream1': Utils.noop,
            'stream2': Utils.noop
        });
    });

    it('should not add the items to the streams list', function()
    {
        var $plugin = getPlugin();
        $plugin.addStream('stream1', false);
        $plugin.addStream('stream2', {});

        Assert.deepEqual($plugin.streams, {});
    });

    it('should set the first added stream name as defaultStream', function()
    {
        Assert.strictEqual(getPlugin(true).defaultStream, 'stream1');
    });
});

describe('Plugin.addTask()', function()
{
    it('should add the task to the tasks list', function()
    {
        Assert.deepEqual(getPlugin(false, true).tasks,
        {
            'task1': Utils.noop,
            'task2': Utils.noop
        });
    });

    it('should not add the items to the tasks list', function()
    {
        var $plugin = getPlugin();
        $plugin.addTask('task1', false);
        $plugin.addTask('task2', {});

        Assert.deepEqual($plugin.tasks, {});
    });
});

describe('Plugin.stream()', function()
{
    // 'stream': function($stream, $args, $alwaysReturnStream)

    it('should return the same stream from the given name', function()
    {
        var $stream = function()
        {
            return true;
        };

        var $plugin = getPlugin(true);
        $plugin.addStream('test', function()
        {
            return $stream;
        });

        Assert.strictEqual($plugin.stream('test'), $stream);
    });

    it('should return the same stream, wich is set as default', function()
    {
        var $stream = function()
        {
            return true;
        };

        var $plugin = getPlugin();
        $plugin.addStream('test', function()
        {
            return $stream;
        });

        $plugin.addStream('stream1', Utils.noop);
        $plugin.addStream('stream2', Utils.noop);

        Assert.strictEqual($plugin.stream(), $stream);
    });

    it('should pass the arguments and return the stream', function()
    {
        var $input  = ['test1', 'test2'];
        var $plugin = getPlugin(true);
        $plugin.addStream('test', function()
        {
            return _.toArray(arguments);
        });

        Assert.deepEqual($plugin.stream('test', $input), $input);
    });

    it('should return false', function()
    {
        var $plugin = getPlugin(true);
        Assert.strictEqual($plugin.stream('nope'), false);
    });

    it('should return a passthrough stream', function()
    {
        var $actual = getPlugin().stream('nope', [], true);

        Assert.strictEqual($actual.constructor, THROUGH_CONSTRUCTOR);
    });
});

describe('Plugin.exportStreamer()', function()
{
    it('should export a streamer and copy extra plugin methods', function()
    {
        var $plugin   = require(getFixtureFile('plugin-valid.js'));
        var $streamer = $plugin.exportStreamer();

        Assert(_.isFunction($streamer) && _.isFunction($streamer.isValidTest));
    });

    it('should export a streamer and not add prototype methods', function()
    {
        var $plugin   = require(getFixtureFile('plugin-valid.js'));
        var $streamer = $plugin.exportStreamer();

        Assert(_.isFunction($streamer) &&
               _.isUndefined($streamer.exportStreamer));
    });

    it('should export a streamer wich can return plugin streams [1]', function()
    {
        var $plugin   = require(getFixtureFile('plugin-valid.js'));
        var $streamer = $plugin.exportStreamer();
        var $actual   = $streamer().constructor;

        Assert.strictEqual($actual, $plugin.stream().constructor);
    });

    it('should export a streamer wich can return plugin streams [2]', function()
    {
        var $plugin   = require(getFixtureFile('plugin-valid.js'));
        var $streamer = $plugin.exportStreamer();
        var $actual   = $streamer('plumber').constructor;

        Assert.strictEqual($actual, $plugin.stream('plumber').constructor);
    });

    it('should export a streamer wich can return plugin streams [3]', function()
    {
        var $plugin   = require(getFixtureFile('plugin-valid.js'));
        var $streamer = $plugin.exportStreamer();
        var $actual   = $streamer('non-existing').constructor;

        Assert.strictEqual($actual, THROUGH_CONSTRUCTOR);
    });

    it('should export a streamer wich passes through the args [1]', function()
    {
        var $plugin   = require(getFixtureFile('plugin-valid.js'));
        var $streamer = $plugin.exportStreamer();
        var $input    = ['args1', 'args2'];
        var $actual   = $streamer('argsTest', $input);

        Assert.deepEqual($actual, [$input]);
    });

    it('should export a streamer wich passes through the args [2]', function()
    {
        var $plugin   = require(getFixtureFile('plugin-valid.js'));
        var $streamer = $plugin.exportStreamer();
        var $input    = ['args1', 'args2'];
        var $actual   = $streamer('argsTest', $input[0], $input[1]);

        Assert.deepEqual($actual, $input);
    });
});

describe('Plugin.exportTask()', function()
{
    it('should attach the exact same plugin to the export', function()
    {
        var $plugin = getPlugin(false, true);
        var $actual = $plugin.exportTask('task1');

        Assert.strictEqual($actual.plugin, $plugin);
    });

    it('should add a task function to the export', function()
    {
        var $plugin = getPlugin(false, true);
        var $actual = $plugin.exportTask('task1');

        Assert(_.isFunction($actual.fn));
    });

    it('should add a task function to the export, wich returns a function',
        function()
        {
            var $plugin = getPlugin(false, true);
            var $actual = $plugin.exportTask('task1');

            Assert(_.isFunction($actual.fn()));
        });

    it('should return the stream from the task', function()
    {
        var $plugin = require(getFixtureFile('plugin-valid.js'));
        var $task   = $plugin.exportTask('through').fn();

        Assert.strictEqual($task().constructor, THROUGH_CONSTRUCTOR);
    });

    it('should pass the arguments to the exported task function [1]', function()
    {
        var $plugin = require(getFixtureFile('plugin-valid.js'));
        var $input  = ['args1', 'args2'];
        var $task   = $plugin.exportTask('argsTest').fn($input);

        Assert.deepEqual($task(), [$plugin, $input]);
    });

    it('should pass the arguments to the exported task function [2]', function()
    {
        var $plugin = require(getFixtureFile('plugin-valid.js'));
        var $input  = ['args1', 'args2'];
        var $task   = $plugin.exportTask('argsTest').fn.apply(null, $input);

        Assert.deepEqual($task(), [$plugin, $input[0], $input[1]]);
    });

    it('should return a dummy task function when not exists', function()
    {
        var $plugin = require(getFixtureFile('plugin-valid.js'));
        var $task   = $plugin.exportTask('nope').fn();

        Assert.strictEqual($task().constructor, THROUGH_CONSTRUCTOR);
    });
});
