/**
 * maelstrom | test/utils_configDefault_tests.js
 */
'use strict';

const configDefault = require('../lib/utils/configDefault');

const expect = require('chai').expect;

// // // // // // // // // // // // // // // // // // // // // // // // // // //

const FIXTURE_FILE = './test/fixtures/config-default.yml';

// -----------------------------------------------------------------------------

describe('utils/configDefault()', function configDefaultTests()
{
    it('should read the config file', function()
    {
        expect( configDefault(FIXTURE_FILE) ).to.be.an('object');
    });

    it('should parse the config file', function()
    {
        expect( configDefault(FIXTURE_FILE) ).to.deep.equal(
        {
            'default':
            {
                'config': true
            },

            'src':  {},
            'dest': {},

            'vars':
            {
                'src':  {},
                'dest': {}
            }
        });
    });
});
