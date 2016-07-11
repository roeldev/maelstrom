/**
 * maelstrom | test/utils_logError_tests.js
 */
'use strict';

const LogInterceptor = require('log-interceptor');

const logError = require('../lib/utils/logError');

const expect = require('chai').expect;

// // // // // // // // // // // // // // // // // // // // // // // // // // //

LogInterceptor.config(
{
    'stripColor':    true,
    'trimLinebreak': false,
    'trimTimestamp': true
});

// -----------------------------------------------------------------------------

describe('utils/logError()', function logErrorTests()
{
    it('should display an error message', function()
    {
        LogInterceptor();

        logError(['test', 'error']);

        expect( LogInterceptor.end().pop() ).to.equal('test error');
    });

    it('should display a detailed error message', function()
    {
        LogInterceptor();

        logError('test', new Error('error msg'));

        console.log(LogInterceptor.end());
        // expect( LogInterceptor.end() ).to.equal('test');
    });
});
