/**
 * maelstrom | test/utils_tests.js
 */
'use strict';

const GulpUtil = require('gulp-util');
const Path     = require('path');

const Maelstrom = require('../lib/index');

const expect  = require('chai').expect;
const setMode = require('./helpers/setMode');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

const PLUGIN_INVALID = Path.resolve(__dirname, './fixtures/plugins/invalid.js');
const PLUGIN_VALID   = Path.resolve(__dirname, './fixtures/plugins/valid.js');

// -----------------------------------------------------------------------------

describe('Utils.isPlugin()', function isPluginTests()
{
    it('should pass the check', function()
    {
        let $actual = new Maelstrom.Plugin(__filename, 'test', {});

        expect($actual).to.be.instanceof(Maelstrom.Plugin);
    });

    it('should fail the check', function()
    {
        expect( {} ).not.to.be.instanceof(Maelstrom.Plugin);
    });
});

describe('Utils.isDev()', function isDevTests()
{
    it('should return true when --dev', function()
    {
        setMode('dev');
        expect( Maelstrom.utils.isDev() ).to.be.true;
    });

    it('should return false when --prod', function()
    {
        setMode('prod');
        expect( Maelstrom.utils.isDev() ).to.be.false;
    });

    it('should revert to config defaultMode and return true', function()
    {
        setMode('dev', true);
        expect( Maelstrom.utils.isDev() ).to.be.true;
    });
});

describe('Utils.isProd()', function isProdTests()
{
    it('should return true when --prod', function()
    {
        setMode('prod');
        expect( Maelstrom.utils.isProd() ).to.be.true;
    });

    it('should return false when --dev', function()
    {
        setMode('dev');
        expect( Maelstrom.utils.isProd() ).to.be.false;
    });

    it('should revert to config defaultMode and return true', function()
    {
        setMode('prod', true);
        expect( Maelstrom.utils.isProd() ).to.be.true;
    });
});

describe('Utils.verboseLevel()', function verboseLevelTests()
{
    it('should return true when set with env', function()
    {
        GulpUtil.env.verbose     = true;
        Maelstrom.config.verbose = false;

        expect( Maelstrom.utils.verboseLevel() ).to.be.true;
    });

    it('should return true when not set with env but in config', function()
    {
        GulpUtil.env.verbose     = undefined;
        Maelstrom.config.verbose = true;

        expect( Maelstrom.utils.verboseLevel() ).to.be.true;
    });

    it('should return false when negative with env', function()
    {
        GulpUtil.env.verbose     = false;
        Maelstrom.config.verbose = true;

        expect( Maelstrom.utils.verboseLevel() ).to.be.false;
    });

    it('should return false when negative with env and config', function()
    {
        GulpUtil.env.verbose     = false;
        Maelstrom.config.verbose = false;

        expect( Maelstrom.utils.verboseLevel() ).to.be.false;
    });
});

describe('Utils.extendArgs()', function extendArgsTests()
{
    it('should append the vars and return an array [1]', function()
    {
        expect( Maelstrom.utils.extendArgs('var2', 'var1') )
            .to.deep.equal(['var1', 'var2']);
    });

    it('should append the vars and return an array [2]', function()
    {
        expect( Maelstrom.utils.extendArgs('var2', ['var1']) )
            .to.deep.equal(['var1', 'var2']);
    });

    it('should append the vars and return an array [3]', function()
    {
        expect( Maelstrom.utils.extendArgs(['var2', false], 'var1') )
            .to.deep.equal(['var1', 'var2', false]);
    });

    it('should append the vars and return an array [4]', function()
    {
        expect( Maelstrom.utils.extendArgs(['var2', false], ['var1', true]) )
            .to.deep.equal(['var1', true, 'var2', false]);
    });

    it('should append the vars and return an array [5]', function()
    {
        expect( Maelstrom.utils.extendArgs(undefined, 'var1') )
            .to.deep.equal(['var1']);
    });

    it('should append the vars and return an array [6]', function()
    {
        expect( Maelstrom.utils.extendArgs(undefined, ['var1']) )
            .to.deep.equal(['var1']);
    });

    it('should return an empty array [1]', function()
    {
        expect( Maelstrom.utils.extendArgs(undefined, []) ).to.be.empty;
    });

    it('should return an empty array [2]', function()
    {
        expect( Maelstrom.utils.extendArgs([], []) ).to.be.empty;
    });

    it('should return an empty array [3]', function()
    {
        expect( Maelstrom.utils.extendArgs([], undefined) ).to.be.empty;
    });
});
