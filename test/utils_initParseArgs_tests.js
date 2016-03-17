/**
 * maelstrom | test/utils_initParseArgs_tests.js
 */
'use strict';

const Gulp = require('gulp');

const initParseArgs = require('../lib/utils/initParseArgs');

const expect = require('chai').expect;

// // // // // // // // // // // // // // // // // // // // // // // // // // //

const ARG_PLUGINS = ['test1', 'test-2'];
const ARG_CONFIG  = { 'config': 'test' };

// -----------------------------------------------------------------------------

describe('utils/initParseArgs()', function initParseArgsTests()
{
    it('should return the default init values [1]', function()
    {
        expect( initParseArgs() ).to.deep.equal(
        {
            'plugins': initParseArgs.DEFAULT_PLUGINS,
            'config':  {}
        });
    });

    it('should return the default init values [2]', function()
    {
        expect( initParseArgs(true) ).to.deep.equal(
        {
            'plugins': initParseArgs.DEFAULT_PLUGINS,
            'config':  {}
        });
    });

    it('should return empty init values [1]', function()
    {
        expect( initParseArgs(false) ).to.deep.equal(
        {
            'plugins': [],
            'config':  {}
        });
    });

    it('should return empty init values [2]', function()
    {
        expect( initParseArgs(false, false) ).to.deep.equal(
        {
            'plugins': [],
            'config':  {}
        });
    });

    it('should return empty init values [3]', function()
    {
        expect( initParseArgs(false, true) ).to.deep.equal(
        {
            'plugins': [],
            'config':  {}
        });
    });

    it('should return the specified plugins', function()
    {
        expect( initParseArgs(ARG_PLUGINS) ).to.deep.equal(
        {
            'plugins': ARG_PLUGINS,
            'config':  {}
        });
    });

    it('should return the specified plugins and ignore wrong arg', function()
    {
        expect( initParseArgs(ARG_PLUGINS, false) ).to.deep.equal(
        {
            'plugins': ARG_PLUGINS,
            'config':  {}
        });
    });

    it('should return the specified args', function()
    {
        expect( initParseArgs(ARG_PLUGINS, ARG_CONFIG) ).to.deep.equal(
        {
            'plugins': ARG_PLUGINS,
            'config':  ARG_CONFIG
        });
    });

    it('should return only one plugin', function()
    {
        expect( initParseArgs('test-plugin') ).to.deep.equal(
        {
            'plugins': ['test-plugin'],
            'config':  {}
        });
    });
});
