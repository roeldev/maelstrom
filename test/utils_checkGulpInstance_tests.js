/**
 * maelstrom | test/utils_checkGulpInstance_tests.js
 */
'use strict';

const Gulp   = require('gulp');
const Expect = require('chai').expect;

const checkGulpInstance = require('../lib/utils/checkGulpInstance');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

describe('utils/checkGulpInstance()', function checkGulpInstanceTests()
{
    it('should successfully validate the gulp instance', function()
    {
        Expect( checkGulpInstance(Gulp) ).to.be.true;
    });

    it('should fail validating an object', function()
    {
        Expect( checkGulpInstance({}) ).to.be.false;
    });

    it('should fail validating the string', function()
    {
        Expect( checkGulpInstance('function Gulp(') ).to.be.false;
    });
});
