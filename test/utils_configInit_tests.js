/**
 * maelstrom | test/utils_configInit_tests.js
 */
'use strict';

const Confirge = require('confirge');
const Path     = require('path');

const Maelstrom  = require('../lib/index');
const configInit = require('../lib/utils/configInit');

const expect = require('chai').expect;

// // // // // // // // // // // // // // // // // // // // // // // // // // //

const FIXTURE_FILE = Path.resolve(__dirname, './fixtures/config-custom.yml');

// -----------------------------------------------------------------------------

describe('utils/configInit()', function configInitTests()
{
    it('should use the default config', function()
    {
        let $expected = Confirge.replace(Maelstrom.config,
                                         Maelstrom.config.vars);

        expect( configInit(Maelstrom.config) ).to.deep.equal($expected);
    });

    it('should extend the default config', function()
    {
        let $defaultConfig =
        {
            'option1': 'value1',
            'option2': 'value2'
        };

        let $customConfig =
        {
            'option3': 'value3'
        };

        expect( configInit($defaultConfig, $customConfig) ).to.deep.equal(
        {
            'option1': 'value1',
            'option2': 'value2',
            'option3': 'value3'
        });
    });

    it('should replace the default config', function()
    {
        let $defaultConfig =
        {
            'option1': 'value1',
            'option2': 'value2'
        };

        let $customConfig =
        {
            'option1': 'replacement1',
            'option2': 'replacement2'
        };

        let $expected = configInit($defaultConfig, $customConfig);
        expect( $expected ).to.deep.equal( $customConfig );
    });

    it('should load the default file and extend the default config', function()
    {
        let $defaultConfig =
        {
            'option1':    'value1',
            'option2':    'value2',
            'configFile': FIXTURE_FILE
        };

        let $customConfig =
        {
            'option1': 'replacement1',
            'option2': 'replacement2'
        };

        expect( configInit($defaultConfig, $customConfig) ).to.deep.equal(
        {
            'option1':       'replacement1',
            'option2':       'replacement2',
            'configFile':    FIXTURE_FILE,
            'customOption1': 'test',
            'customOption2': true
        });
    });

    it('should load an external file and extend the default config', function()
    {
        let $defaultConfig =
        {
            'option1': 'value1',
            'option2': 'value2'
        };

        let $customConfig =
        {
            'option1':    'replacement1',
            'option2':    'replacement2',
            'configFile': FIXTURE_FILE
        };

        expect( configInit($defaultConfig, $customConfig) ).to.deep.equal(
        {
            'option1':       'ok!',
            'option2':       'replacement2',
            'configFile':    FIXTURE_FILE,
            'customOption1': 'test',
            'customOption2': true
        });
    });

    it('should not load a file, but only extend the default config', function()
    {
        let $configFile = FIXTURE_FILE + '-non-existing';

        let $defaultConfig =
        {
            'option1': 'value1',
            'option2': 'value2'
        };

        let $customConfig =
        {
            'option1':    'replacement1',
            'option2':    'replacement2',
            'configFile': $configFile
        };

        expect( configInit($defaultConfig, $customConfig) ).to.deep.equal(
        {
            'option1':    'replacement1',
            'option2':    'replacement2',
            'configFile': $configFile
        });
    });
});
