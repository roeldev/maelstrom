/**
 * maelstrom | test/utils_tests.js
 * file version: 0.00.003
 */
'use strict';

var Maelstrom = require('../lib/index.js');
var Utils     = require('../lib/utils.js')(Maelstrom);
var Assert    = require('assert');
var GulpUtil  = require('gulp-util');
var Path      = require('path');
var Through   = require('through2');

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

    it('should revert to config defaultMode and return true', function()
    {
        setMode('prod', true);
        Assert.strictEqual(Utils.isProd(), true);
    });
});

describe('Utils.extendArgs()', function extendArgsTests()
{
    it('it should append the vars and return an array [1]', function()
    {
        var $actual = Utils.extendArgs('var2', 'var1');

        Assert.deepEqual($actual, ['var1', 'var2']);
    });

    it('it should append the vars and return an array [2]', function()
    {
        var $actual = Utils.extendArgs(['var2', false], 'var1');

        Assert.deepEqual($actual, ['var1', 'var2', false]);
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
