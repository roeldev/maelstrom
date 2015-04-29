/**
 * maelstrom | test/init_tests.js
 * file version: 0.00.001
 */
'use strict';

var Maelstrom = require('../lib/index.js');
var Init      = require('../lib/init.js')(Maelstrom);
var Utils     = require('../lib/utils.js')(Maelstrom);
var Plugin    = require('../lib/plugin.js');
var _         = require('underscore');
var Assert    = require('assert');
var Confirge  = require('confirge');
var Gulp      = require('gulp');
var Path      = require('path');

////////////////////////////////////////////////////////////////////////////////

function getFixtureFile($file)
{
    return Path.resolve(__dirname, './fixtures/' + $file);
}

function resetConfig()
{
    var $configFile  = Path.resolve(__dirname, '../lib/configs/maelstrom.yml');
    Maelstrom.config = Confirge.read($configFile);
}

//------------------------------------------------------------------------------

describe('Init.isGulpInstance()', function()
{
    it('should successfully validate the gulp instance', function()
    {
        Assert.strictEqual(Init.isGulpInstance(Gulp), true);
    });

    it('should fail validating the object', function()
    {
        Assert.strictEqual(Init.isGulpInstance(Maelstrom), false);
    });

    it('should fail validating the string', function()
    {
        Assert.strictEqual(Init.isGulpInstance('function Gulp('), false);
    });
});

describe('Init.createConfig()', function()
{
    it('should use the default config', function()
    {
        var $expected = Confirge.replace(Maelstrom.config,
                                         Maelstrom.config.vars);

        Assert.deepEqual(Init.createConfig(), $expected);
    });

    it('should extend the default config', function()
    {
        Maelstrom.config =
        {
            'option1': 'value1',
            'option2': 'value2'
        };

        Assert.deepEqual(Init.createConfig({ 'option3': 'value3' }),
        {
            'option1': 'value1',
            'option2': 'value2',
            'option3': 'value3'
        });
    });

    it('should replace the default config', function()
    {
        Maelstrom.config =
        {
            'option1': 'value1',
            'option2': 'value2'
        };

        var $input =
        {
            'option1': 'replacement1',
            'option2': 'replacement2'
        };

        Assert.deepEqual(Init.createConfig($input), $input);
    });

    it('should load the default file and extend the default config', function()
    {
        var $customConfig = getFixtureFile('custom-config.yml');
        var $input =
        {
            'option1': 'replacement1',
            'option2': 'replacement2'
        };

        Maelstrom.config =
        {
            'option1':    'value1',
            'option2':    'value2',
            'configFile': $customConfig
        };

        Assert.deepEqual(Init.createConfig($input),
        {
            'option1':       'replacement1',
            'option2':       'replacement2',
            'configFile':    $customConfig,
            'customOption1': 'test',
            'customOption2': true
        });
    });

    it('should load an external file and extend the default config', function()
    {
        Maelstrom.config =
        {
            'option1': 'value1',
            'option2': 'value2'
        };

        var $customConfig = getFixtureFile('custom-config.yml');
        var $input =
        {
            'option1':    'replacement1',
            'option2':    'replacement2',
            'configFile': $customConfig
        };

        Assert.deepEqual(Init.createConfig($input),
        {
            'option1':       'ok!',
            'option2':       'replacement2',
            'configFile':    $customConfig,
            'customOption1': 'test',
            'customOption2': true
        });
    });

    it('should not load an external file, but still extend the default config',
        function()
        {
            Maelstrom.config =
            {
                'option1': 'value1',
                'option2': 'value2'
            };

            var $customConfig = getFixtureFile('false-custom-config.yml');
            var $input =
            {
                'option1':    'replacement1',
                'option2':    'replacement2',
                'configFile': $customConfig
            };

            Assert.deepEqual(Init.createConfig($input),
            {
                'option1':    'replacement1',
                'option2':    'replacement2',
                'configFile': $customConfig
            });
        });
});

describe('Init.loadPlugin()', function()
{
    it('should return the exact same plugin', function()
    {
        var $input = Utils.noop;

        Assert.strictEqual(Init.loadPlugin($input), $input);
    });

    it('should return a streamer', function()
    {
        var $plugin = new Plugin(__filename);
        $plugin.testVar = [true, false, 'random string'];
        $plugin.addStream('stream1', Utils.noop);
        $plugin.addStream('stream2', Utils.noop);

        var $result = Init.loadPlugin($plugin);

        Assert(_.isFunction($result) && $result.testVar === $plugin.testVar);
    });

    it('should add the tasks to Maelstrom', function()
    {
        Maelstrom.tasks = {};

        var $plugin = new Plugin(__filename);
        $plugin.addTask('task1', Utils.noop);
        $plugin.addTask('task2', Utils.noop);

        var $result = Init.loadPlugin($plugin);

        Assert.deepEqual(Maelstrom.tasks,
        {
            'task1': $plugin.exportTask('task1'),
            'task2': $plugin.exportTask('task2')
        });
    });
});
