/**
 * maelstrom | test/utils_checkValidMode_tests.js
 */
'use strict';

const checkValidMode = require('../lib/utils/checkValidMode');

const expect  = require('chai').expect;
const setMode = require('./helpers/setMode');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

const MODE_DEV  = 'dev';
const MODE_PROD = 'prod';

// -----------------------------------------------------------------------------

describe('utils/checkValidMode()', function checkValidModeTests()
{
    it('should validate the active mode [1]', function()
    {
        setMode(MODE_DEV);

        expect( checkValidMode(MODE_DEV) ).to.be.true;
    });

    it('should validate the active mode [2]', function()
    {
        setMode(MODE_PROD);

        expect( checkValidMode(MODE_PROD) ).to.be.true;
    });

    it('should fail validating the active mode [1]', function()
    {
        setMode(MODE_DEV);

        expect( checkValidMode(MODE_PROD) ).to.be.false;
    });

    it('should fail validating the active mode [2]', function()
    {
        setMode(MODE_PROD);

        expect( checkValidMode(MODE_DEV) ).to.be.false;
    });
});
