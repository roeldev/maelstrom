/**
 * maelstrom | test/init_tests.js
 * file version: 0.00.006
 */
'use strict';

var Maelstrom      = require('../lib/index.js');
var Init           = require('../lib/init.js')(Maelstrom);
var Plugin         = require('../lib/plugin.js');
var _              = require('underscore');
var Assert         = require('assert');
var Confirge       = require('confirge');
var FileSystem     = require('graceful-fs');
var Gulp           = require('gulp');
var LogInterceptor = require('log-interceptor');
var Noop           = Maelstrom.utils.noop;
var Path           = require('path');
var Tildify        = require('tildify');

var PLUGIN_DIR   = Path.resolve(__dirname, './fixtures/plugins/');
var PLUGIN_VALID = Path.resolve(__dirname, './fixtures/plugins/valid.js');

Maelstrom.gulp   = Gulp;
Maelstrom.Plugin = Plugin;

////////////////////////////////////////////////////////////////////////////////

function getFixtureFile($file)
{
    return Path.resolve(__dirname, './fixtures/' + $file);
}

LogInterceptor.config({ 'stripColor': true, 'trimTimestamp': true });

//------------------------------------------------------------------------------

describe('Init.isGulpInstance()', function isGulpInstanceTests()
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

describe('Init.createConfig()', function createConfigTests()
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

describe('Init.loadPlugins()', function loadPluginsTests()
{
    it('should add all plugins to Maelstrom', function()
    {
        Maelstrom.config.verbose = false;
        Maelstrom._tasks = {};

        Init.loadPlugins(PLUGIN_DIR);

        var $assert      = true;
        var $pluginFiles = FileSystem.readdirSync(PLUGIN_DIR);
        var $pluginName;

        for (var $i = 0, $iL = $pluginFiles.length; $i < $iL; $i++)
        {
            $pluginName = Path.basename($pluginFiles[$i], '.js');
            if (_.isUndefined(Maelstrom[$pluginName]))
            {
                $assert = false;
                break;
            }
        }

        Assert($assert);
    });

    it('should add all plugins to Maelstrom and display a log', function()
    {
        Maelstrom.config.verbose = true;
        Maelstrom._tasks = {};

        LogInterceptor();
        Init.loadPlugins(PLUGIN_DIR);

        var $actual   = LogInterceptor.end();
        var $expected = [];

        var $pluginFiles = FileSystem.readdirSync(PLUGIN_DIR);
        var $pluginFile, $pluginName;

        for (var $i = 0, $iL = $pluginFiles.length; $i < $iL; $i++)
        {
            $pluginFile = PLUGIN_DIR + Path.sep + $pluginFiles[$i];
            $pluginName = Path.basename($pluginFiles[$i], '.js');

            $expected.push('- Load plugin \'' + $pluginName + '\': ' +
                           Tildify($pluginFile) + '\n');
        }

        Assert.deepEqual($actual, $expected);
    });

    it('should add all the tasks from the plugins to Maelstrom', function()
    {
        Maelstrom.config.verbose = false;
        Maelstrom._tasks = {};

        Init.loadPlugins(PLUGIN_DIR);

        var $assert      = true;
        var $pluginFiles = FileSystem.readdirSync(PLUGIN_DIR);
        var $pluginFile, $plugin;

        for (var $i = 0, $iL = $pluginFiles.length; $i < $iL; $i++)
        {
            $pluginFile = PLUGIN_DIR + Path.sep + $pluginFiles[$i];
            $plugin     = require($pluginFile);

            if (!($plugin instanceof Plugin))
            {
                continue;
            }

            for (var $taskName in $plugin.tasks)
            {
                if (!$plugin.tasks.hasOwnProperty($taskName))
                {
                    continue;
                }

                if (_.isUndefined(Maelstrom._tasks[$taskName]))
                {
                    $assert = false;
                    break;
                }
            }
        }

        Assert($assert);
    });
});

describe('Init.loadPlugin()', function loadPluginTests()
{
    it('should return the exact same plugin', function()
    {
        var $input = Noop;

        Assert.strictEqual(Init.loadPlugin($input), $input);
    });

    it('should return a streamer', function()
    {
        var $plugin = new Plugin(__filename);
        $plugin.testVar = [true, false, 'random string'];
        $plugin.addStream('stream1', Noop);
        $plugin.addStream('stream2', Noop);

        var $result = Init.loadPlugin($plugin);

        Assert(_.isFunction($result) && $result.testVar === $plugin.testVar);
    });

    it('should add the tasks to Maelstrom', function()
    {
        Maelstrom._tasks = {};

        var $plugin = new Plugin(__filename);
        $plugin.addTask('task1', Noop);
        $plugin.addTask('task2', Noop);

        Init.loadPlugin($plugin);

        // use custom check because deepEqual does not seem to work
        function check($item)
        {
            return (_.isObject($item) &&
                    ($item.plugin === $plugin) &&
                    _.isFunction($item.fn));
        }

        Assert(_.isObject(Maelstrom._tasks) &&
               check(Maelstrom._tasks.task1) &&
               check(Maelstrom._tasks.task2));
    });
});

describe('Init.defaultTasks()', function defaultTasksTests()
{
    it('should add all tasks with Maelstrom.task()', function()
    {
        var $actual = Init.defaultTasks();

        Assert.deepEqual($actual, ['task1', 'task2']);
    });

    it('should add all tasks to gulp', function()
    {
        Init.defaultTasks();

        var $actual    = 0;
        var $expected  = ['task1', 'task2'];
        var $gulpTasks = _.keys(Gulp.tasks);

        for (var $i = 0, $iL = $expected.length; $i < $iL; $i++)
        {
            if ($gulpTasks.indexOf($expected[$i]) !== -1)
            {
                $actual++;
            }
        }

        Assert.strictEqual($actual, $expected.length);
    });
});

describe('Init.defaultWatcher()', function defaultWatcherTests()
{
    it('should add a watch task to gulp [1]', function()
    {
        Init.defaultWatcher();

        Assert(_.keys(Gulp.tasks).indexOf('watch') !== -1);
    });

    it('should add a watch task to gulp [2]', function()
    {
        Maelstrom._tasks = {};

        Init.loadPlugin( require(PLUGIN_VALID) );
        Init.defaultWatcher();

        LogInterceptor();
        Gulp.tasks.watch.fn();

        var $actual = LogInterceptor.end();

        Assert.strictEqual($actual.shift(),
            'Warning! No files to watch for task \'plumber\'!\n');
    });
});
