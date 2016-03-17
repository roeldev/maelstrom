/**
 * maelstrom | test/utils_checkGulpInstance_tests.js
 */
'use strict';

const Gulp = require('gulp');

const checkGulpInstance = require('../lib/utils/checkGulpInstance');

const expect = require('chai').expect;

// // // // // // // // // // // // // // // // // // // // // // // // // // //

describe('utils/checkGulpInstance()', function checkGulpInstanceTests()
{
    it('should successfully validate the gulp instance', function()
    {
        expect( checkGulpInstance(Gulp) ).to.be.true;
    });

    it('should fail validating an object', function()
    {
        expect( checkGulpInstance({}) ).to.be.false;
    });

    it('should fail validating the string', function()
    {
        expect( checkGulpInstance('function Gulp(') ).to.be.false;
    });
});
