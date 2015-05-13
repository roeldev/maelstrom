/**
 * maelstrom | test/utils_tests.js
 * file version: 0.00.007
 */
'use strict';

var Maelstrom = require('../lib/index.js');
var Utils     = Maelstrom.utils;
var Assert    = require('assert');
var GulpUtil  = require('gulp-util');
var Path      = require('path');
var Through   = require('through2');
var Util      = require('util');

var PLUGIN_INVALID = Path.resolve(__dirname, './fixtures/plugins/invalid.js');
var PLUGIN_VALID   = Path.resolve(__dirname, './fixtures/plugins/valid.js');

////////////////////////////////////////////////////////////////////////////////

function setMode($mode, $setConfig)
{
    if ($setConfig === true)
    {
        GulpUtil.env.dev  = false;
        GulpUtil.env.prod = false;

        Maelstrom.config.defaultMode = $mode;
    }
    else if ($mode === 'dev')
    {
        GulpUtil.env.dev  = true;
        GulpUtil.env.prod = false;
    }
    else
    {
        GulpUtil.env.dev  = false;
        GulpUtil.env.prod = true;
    }
}

//------------------------------------------------------------------------------

describe('Utils.isDev()', function isDevTests()
{
    it('should return true when --dev', function()
    {
        setMode('dev');
        Assert.strictEqual(Utils.isDev(), true);
    });

    it('should return false when --prod', function()
    {
        setMode('prod');
        Assert.strictEqual(Utils.isDev(), false);
    });

    it('should revert to config defaultMode and return true', function()
    {
        setMode('dev', true);
        Assert.strictEqual(Utils.isDev(), true);
    });
});

describe('Utils.isProd()', function isProdTests()
{
    it('should return true when --prod', function()
    {
        setMode('prod');
        Assert.strictEqual(Utils.isProd(), true);
    });

    it('should return false when --dev', function()
    {
        setMode('dev');
        Assert.strictEqual(Utils.isProd(), false);
    });

    it('should revert to config defaultMode and return true', function()
    {
        setMode('prod', true);
        Assert.strictEqual(Utils.isProd(), true);
    });
});

describe('Utils.isVerbose()', function isVerbose()
{
    it('should return true when set with env', function()
    {
        GulpUtil.env.verbose     = true;
        Maelstrom.config.verbose = false;

        Assert.strictEqual(Utils.isVerbose(), true);
    });

    it('should return true when not set with env but in config', function()
    {
        GulpUtil.env.verbose     = undefined;
        Maelstrom.config.verbose = true;

        Assert.strictEqual(Utils.isVerbose(), true);
    });

    it('should return false when negative with env', function()
    {
        GulpUtil.env.verbose     = false;
        Maelstrom.config.verbose = true;

        Assert.strictEqual(Utils.isVerbose(), false);
    });

    it('should return false when negative with env and config', function()
    {
        GulpUtil.env.verbose     = false;
        Maelstrom.config.verbose = false;

        Assert.strictEqual(Utils.isVerbose(), false);
    });
});

describe('Utils.extendArgs()', function extendArgsTests()
{
    it('should append the vars and return an array [1]', function()
    {
        var $actual = Utils.extendArgs('var2', 'var1');

        Assert.deepEqual($actual, ['var1', 'var2']);
    });

    it('should append the vars and return an array [2]', function()
    {
        var $actual = Utils.extendArgs('var2', ['var1']);

        Assert.deepEqual($actual, ['var1', 'var2']);
    });

    it('should append the vars and return an array [3]', function()
    {
        var $actual = Utils.extendArgs(['var2', false], 'var1');

        Assert.deepEqual($actual, ['var1', 'var2', false]);
    });

    it('should append the vars and return an array [4]', function()
    {
        var $actual = Utils.extendArgs(['var2', false], ['var1', true]);

        Assert.deepEqual($actual, ['var1', true, 'var2', false]);
    });

    it('should append the vars and return an array [5]', function()
    {
        var $actual = Utils.extendArgs(undefined, 'var1');

        Assert.deepEqual($actual, ['var1']);
    });

    it('should append the vars and return an array [6]', function()
    {
        var $actual = Utils.extendArgs(undefined, ['var1']);

        Assert.deepEqual($actual, ['var1']);
    });

    it('should return an empty array [1]', function()
    {
        var $actual = Utils.extendArgs(undefined, []);

        Assert.strictEqual($actual.length, 0);
    });

    it('should return an empty array [2]', function()
    {
        var $actual = Utils.extendArgs([], []);

        Assert.strictEqual($actual.length, 0);
    });
});

describe('Utils.pipeStreams()', function pipeStreamsTests()
{
    it('should return the same object [1]', function()
    {
        var $input  = Through.obj();
        var $actual = Utils.pipeStreams([$input]);

        Assert.deepEqual($actual, $input);
    });

    it('should return the same object [2]', function()
    {
        var $input  = Through.obj();
        var $actual = Utils.pipeStreams([$input, false]);

        Assert.deepEqual($actual, $input);
    });

    it('should return the same object [3]', function()
    {
        var $input  = Through.obj();
        var $actual = Utils.pipeStreams([false, $input]);

        Assert.deepEqual($actual, $input);
    });

    it('should pipe the streams to the first stream', function()
    {
        var $actual = Utils.pipeStreams([Through.obj(),
                                        Through.obj(),
                                        Through.obj()]);

        var $expected = Through.obj();
        $expected.pipe(Through.obj());
        $expected.pipe(Through.obj());

        // convert the actual objects to a string, otherwise Assert will fail
        // the deepEqual test. seems like the regular objects are just too big
        $actual   = Util.inspect($actual, false, null);
        $expected = Util.inspect($expected, false, null);

        Assert.strictEqual($actual, $expected);
    });
});

describe('Utils.pipeWhen()', function pipeWhenTests()
{
    it('should return the same stream', function()
    {
        var $input = Through.obj();

        Assert.deepEqual(Utils.pipeWhen(true, $input), $input);
    });

    it('should return false', function()
    {
        Assert.strictEqual(Utils.pipeWhen(false, Through.obj()), false);
    });
});

describe('Utils.pipeWhenDev()', function pipeWhenDevTests()
{
    it('should return the same stream [1]', function()
    {
        setMode('dev');
        var $input = Through.obj();

        Assert.strictEqual(Utils.pipeWhenDev($input), $input);
    });

    it('should return the same stream [2]', function()
    {
        setMode('prod');
        var $input = Through.obj();

        Assert.strictEqual(Utils.pipeWhenDev($input, true), $input);
    });

    it('should return false', function()
    {
        setMode('prod');
        Assert.strictEqual(Utils.pipeWhenDev(Through.obj()), false);
    });
});

describe('Utils.pipeWhenProd()', function pipeWhenProdTests()
{
    it('should return the same stream [1]', function()
    {
        setMode('prod');
        var $input = Through.obj();

        Assert.strictEqual(Utils.pipeWhenProd($input), $input);
    });

    it('should return the same stream [2]', function()
    {
        setMode('dev');
        var $input = Through.obj();

        Assert.strictEqual(Utils.pipeWhenProd($input, true), $input);
    });

    it('should return false', function()
    {
        setMode('dev');
        Assert.strictEqual(Utils.pipeWhenProd(Through.obj()), false);
    });
});

describe('Utils.requirePluginFile()', function requirePluginFileTests()
{
    it('should read and return the loaded plugin', function()
    {
        var $expected = require(PLUGIN_VALID);

        Assert.strictEqual(Utils.requirePluginFile(PLUGIN_VALID), $expected);
    });

    it('should not read the file and return false', function()
    {
        Assert.strictEqual(Utils.requirePluginFile('nope.js'), false);
    });
});

describe('Utils.isValidPlugin()', function isValidPluginTests()
{
    it('should load the plugin and successfully validate it', function()
    {
        var $input = Utils.requirePluginFile(PLUGIN_VALID);

        Assert.strictEqual(Utils.isValidPlugin($input), true);
    });

    it('should load the plugin and fail validating', function()
    {
        var $input = Utils.requirePluginFile(PLUGIN_INVALID);

        Assert.strictEqual(Utils.isValidPlugin($input), false);
    });
});
