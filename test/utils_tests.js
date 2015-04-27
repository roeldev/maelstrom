/**
 * maelstrom | test/utils_tests.js
 * file version: 0.00.002
 */
'use strict';

var Maelstrom = require('../lib/index.js');
var Utils     = require('../lib/utils.js')(Maelstrom);
var Assert    = require('assert');
var GulpUtil  = require('gulp-util');
var Path      = require('path');
var Through   = require('through2');

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

describe('Maelstrom.utils.isDev()', function()
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

describe('Maelstrom.utils.isProd()', function()
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

describe('Maelstrom.utils.extendArgs()', function()
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

describe('Maelstrom.utils.pipeStreams()', function()
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

describe('Maelstrom.utils.pipeWhen()', function()
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

describe('Maelstrom.utils.pipeWhenDev()', function()
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

describe('Maelstrom.utils.pipeWhenProd()', function()
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

describe('Maelstrom.utils.requirePluginFile()', function()
{
    it('should read and return the loaded plugin', function()
    {
        var $input    = Path.resolve(__dirname, './fixtures/plugin-valid.js');
        var $expected = require($input);

        Assert.strictEqual(Utils.requirePluginFile($input), $expected);
    });

    it('should not read the file and return false', function()
    {
        Assert.strictEqual(Utils.requirePluginFile('nope.js'), false);
    });
});

describe('Maelstrom.utils.isValidPlugin()', function()
{
    it('should load the plugin and successfully validate it', function()
    {
        var $file  = Path.resolve(__dirname, './fixtures/plugin-valid.js');
        var $input = Utils.requirePluginFile($file);

        Assert.strictEqual(Utils.isValidPlugin($input), true);
    });

    it('should load the plugin and fail validating', function()
    {
        var $file  = Path.resolve(__dirname, './fixtures/plugin-invalid.js');
        var $input = Utils.requirePluginFile($file);

        Assert.strictEqual(Utils.isValidPlugin($input), false);
    });
});
