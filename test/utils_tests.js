/**
 * maelstrom | test/utils_tests.js
 */
'use strict';

const Expect   = require('chai').expect;
const GulpUtil = require('gulp-util');
const Path     = require('path');

const Maelstrom = require('../lib/index.js');
const Utils     = Maelstrom.utils;

// // // // // // // // // // // // // // // // // // // // // // // // // // //

const PLUGIN_INVALID = Path.resolve(__dirname, './fixtures/plugins/invalid.js');
const PLUGIN_VALID   = Path.resolve(__dirname, './fixtures/plugins/valid.js');

// -----------------------------------------------------------------------------

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

// -----------------------------------------------------------------------------

describe('Utils.isPlugin()', function isPluginTests()
{
    it('should pass the check', function()
    {
        Expect( new Maelstrom.Plugin() ).to.be.instanceof(Maelstrom.Plugin);
    });

    it('should fail the check', function()
    {
        Expect( {} ).not.to.be.instanceof(Maelstrom.Plugin);
    });
});

describe('Utils.isDev()', function isDevTests()
{
    it('should return true when --dev', function()
    {
        setMode('dev');
        Expect( Utils.isDev() ).to.be.true;
    });

    it('should return false when --prod', function()
    {
        setMode('prod');
        Expect( Utils.isDev() ).to.be.false;
    });

    it('should revert to config defaultMode and return true', function()
    {
        setMode('dev', true);
        Expect( Utils.isDev() ).to.be.true;
    });
});

describe('Utils.isProd()', function isProdTests()
{
    it('should return true when --prod', function()
    {
        setMode('prod');
        Expect( Utils.isProd() ).to.be.true;
    });

    it('should return false when --dev', function()
    {
        setMode('dev');
        Expect( Utils.isProd() ).to.be.false;
    });

    it('should revert to config defaultMode and return true', function()
    {
        setMode('prod', true);
        Expect( Utils.isProd() ).to.be.true;
    });
});

describe('Utils.isVerbose()', function isVerbose()
{
    it('should return true when set with env', function()
    {
        GulpUtil.env.verbose     = true;
        Maelstrom.config.verbose = false;

        Expect( Utils.isVerbose() ).to.be.true;
    });

    it('should return true when not set with env but in config', function()
    {
        GulpUtil.env.verbose     = undefined;
        Maelstrom.config.verbose = true;

        Expect( Utils.isVerbose() ).to.be.true;
    });

    it('should return false when negative with env', function()
    {
        GulpUtil.env.verbose     = false;
        Maelstrom.config.verbose = true;

        Expect( Utils.isVerbose() ).to.be.false;
    });

    it('should return false when negative with env and config', function()
    {
        GulpUtil.env.verbose     = false;
        Maelstrom.config.verbose = false;

        Expect( Utils.isVerbose() ).to.be.false;
    });
});

describe('Utils.extendArgs()', function extendArgsTests()
{
    it('should append the vars and return an array [1]', function()
    {
        Expect( Utils.extendArgs('var2', 'var1') )
            .to.deep.equal(['var1', 'var2']);
    });

    it('should append the vars and return an array [2]', function()
    {
        Expect( Utils.extendArgs('var2', ['var1']) )
            .to.deep.equal(['var1', 'var2']);
    });

    it('should append the vars and return an array [3]', function()
    {
        Expect( Utils.extendArgs(['var2', false], 'var1') )
            .to.deep.equal(['var1', 'var2', false]);
    });

    it('should append the vars and return an array [4]', function()
    {
        Expect( Utils.extendArgs(['var2', false], ['var1', true]) )
            .to.deep.equal(['var1', true, 'var2', false]);
    });

    it('should append the vars and return an array [5]', function()
    {
        Expect( Utils.extendArgs(undefined, 'var1') ).to.deep.equal(['var1']);
    });

    it('should append the vars and return an array [6]', function()
    {
        Expect( Utils.extendArgs(undefined, ['var1']) )
            .to.deep.equal(['var1']);
    });

    it('should return an empty array [1]', function()
    {
        Expect( Utils.extendArgs(undefined, []) ).to.be.empty;
    });

    it('should return an empty array [2]', function()
    {
        Expect( Utils.extendArgs([], []) ).to.be.empty;
    });

    it('should return an empty array [3]', function()
    {
        Expect( Utils.extendArgs([], undefined) ).to.be.empty;
    });
});
