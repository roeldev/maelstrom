/**
 * maelstrom | test/utils_initParseArgs_tests.js
 */
'use strict';

const Gulp   = require('gulp');
const Expect = require('chai').expect;

const initParseArgs = require('../lib/utils/initParseArgs');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

const ARG_PLUGINS = ['test1', 'test-2'];
const ARG_CONFIG  = { 'config': 'test' };

// -----------------------------------------------------------------------------

describe('utils/initParseArgs()', function initParseArgsTests()
{
    it('should return the default init values [1]', function()
    {
        Expect( initParseArgs() ).to.deep.equal(
        {
            'plugins': initParseArgs.DEFAULT_PLUGINS,
            'config':  {}
        });
    });

    it('should return the default init values [2]', function()
    {
        Expect( initParseArgs(true) ).to.deep.equal(
        {
            'plugins': initParseArgs.DEFAULT_PLUGINS,
            'config':  {}
        });
    });

    it('should return empty init values [1]', function()
    {
        Expect( initParseArgs(false) ).to.deep.equal(
        {
            'plugins': [],
            'config':  {}
        });
    });

    it('should return empty init values [2]', function()
    {
        Expect( initParseArgs(false, false) ).to.deep.equal(
        {
            'plugins': [],
            'config':  {}
        });
    });

    it('should return empty init values [3]', function()
    {
        Expect( initParseArgs(false, true) ).to.deep.equal(
        {
            'plugins': [],
            'config':  {}
        });
    });

    it('should return the specified plugins', function()
    {
        Expect( initParseArgs(ARG_PLUGINS) ).to.deep.equal(
        {
            'plugins': ARG_PLUGINS,
            'config':  {}
        });
    });

    it('should return the specified plugins and ignore wrong arg', function()
    {
        Expect( initParseArgs(ARG_PLUGINS, false) ).to.deep.equal(
        {
            'plugins': ARG_PLUGINS,
            'config':  {}
        });
    });

    it('should return the specified args', function()
    {
        Expect( initParseArgs(ARG_PLUGINS, ARG_CONFIG) ).to.deep.equal(
        {
            'plugins': ARG_PLUGINS,
            'config':  ARG_CONFIG
        });
    });

    it('should return only one plugin', function()
    {
        Expect( initParseArgs('test-plugin') ).to.deep.equal(
        {
            'plugins': ['test-plugin'],
            'config':  {}
        });
    });
});
