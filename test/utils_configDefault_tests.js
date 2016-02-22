/**
 * maelstrom | test/utils_configDefault_tests.js
 */
'use strict';

const Expect = require('chai').expect;

const configDefault = require('../lib/utils/configDefault');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

const FIXTURE_FILE = './test/fixtures/config-default.yml';

// -----------------------------------------------------------------------------

describe('utils/configDefault()', function configDefaultTests()
{
    it('should read the config file', function()
    {
        Expect( configDefault(FIXTURE_FILE) ).to.be.an('object');
    });

    it('should parse the config file', function()
    {
        Expect( configDefault(FIXTURE_FILE) ).to.deep.equal(
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
