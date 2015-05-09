/**
 * maelstrom | test/index_tests.js
 * file version: 0.00.004
 */
'use strict';

var Maelstrom      = require('../lib/index.js');
var Init           = require('../lib/init.js')(Maelstrom);
var Utils          = require('../lib/utils.js')(Maelstrom);
var Plugin         = require('../lib/plugin.js');
var _              = require('underscore');
var Assert         = require('assert');
var Chalk          = require('gulp-util').colors;
var Gulp           = require('gulp');
var LogInterceptor = require('log-interceptor');
var Path           = require('path');
var Util           = require('util');
var Tildify        = require('tildify');

var PLUGIN_VALID  = Path.resolve(__dirname, './fixtures/plugins/valid.js');
var PLUGIN_VALID2 = Path.resolve(__dirname, './fixtures/plugins/valid2.js');

////////////////////////////////////////////////////////////////////////////////

function silentInit($args, $breakSilence)
{
    if (!_.isArray($args))
    {
        $args = [];
    }

    $args.unshift(Gulp);

    LogInterceptor($breakSilence === true);

    Maelstrom.init.apply(Maelstrom, $args);
    return LogInterceptor.end();
}

function resetGulpTasks()
{
    for (var $taskName in Maelstrom.tasks)
    {
        if (Maelstrom.tasks.hasOwnProperty($taskName))
        {
            delete Gulp.tasks[$taskName];
        }
    }
}

Maelstrom._PLUGIN_DIR = Path.resolve(__dirname, './fixtures/plugins/');
// LogInterceptor.config({ stripColor: true, trimTimestamp: true });

/******************************************************************************/

describe('Maelstrom()', function maelstromTests()
{
    it('should pass the arguments to Maelstrom.init()', function()
    {
        LogInterceptor();
        Maelstrom(Gulp, false);
        LogInterceptor.end();

        Assert.strictEqual(Maelstrom.gulp, Gulp);
    });

    it('should return the main object when no args are given', function()
    {
        Assert.strictEqual(Maelstrom(), Maelstrom);
    });
});

describe('Maelstrom.init()', function initTests()
{
    it('should stop initializing on invalid gulp instance', function()
    {
        LogInterceptor();
        var $actual = Maelstrom.init({});
        LogInterceptor.end();

        Assert.strictEqual($actual, false);
    });

    it('should display an error msg on invalid gulp instance', function()
    {
        LogInterceptor();
        Maelstrom.init({});

        var $actual = LogInterceptor.end();

        Assert.equal(Chalk.stripColor($actual.pop()).substr(11),
            'Error! Make sure to pass an instance of gulp to ' +
            'maelstrom.init()\n');
    });

    it('should add the gulp instance to the main object', function()
    {
        silentInit();

        Assert.strictEqual(Maelstrom.gulp, Gulp);
    });

    it('should load the util functions and add it to the main obj', function()
    {
        silentInit();

        var $actual   = Util.inspect(Maelstrom.utils, false, null);
        var $expected = Util.inspect(Utils, false, null);

        Assert.strictEqual($actual, $expected);
    });

    it('should load the Plugin class and add it to the main obj', function()
    {
        silentInit();
        Assert.strictEqual(Maelstrom.Plugin, Plugin);
    });


    function checkTasksAdded()
    {
        for (var $taskName in Maelstrom.tasks)
        {
            if (!Maelstrom.tasks.hasOwnProperty($taskName))
            {
                continue;
            }

            if (_.isUndefined(Gulp.tasks[$taskName]))
            {
                return false;
            }
        }

        return true;
    }

    it('should add the default tasks to the main object [1]', function()
    {
        resetGulpTasks();
        silentInit([true]);

        Assert(checkTasksAdded());
    });

    it('should add the default tasks to the main object [2]', function()
    {
        resetGulpTasks();
        silentInit([{}]);

        Assert(checkTasksAdded());
    });


    function checkTasksNotAdded()
    {
        for (var $taskName in Maelstrom.tasks)
        {
            if (!Maelstrom.tasks.hasOwnProperty($taskName))
            {
                continue;
            }

            if (!_.isUndefined(Gulp.tasks[$taskName]))
            {
                return false;
            }
        }

        return true;
    }

    it('should not add the default tasks to the main object [1]', function()
    {
        resetGulpTasks();
        silentInit([false, {}]);

        Assert(checkTasksNotAdded());
    });

    it('should not add the default tasks to the main object [2]', function()
    {
        resetGulpTasks();
        silentInit([{}, {}]);

        Assert(checkTasksNotAdded());
    });
});

describe('Maelstrom.task()', function taskTests()
{
    it('should return false on invalid task', function()
    {
        Assert.strictEqual(Maelstrom.task('invalid-task'), false);
    });

    it('should add the task to gulp', function()
    {
        resetGulpTasks();

        Maelstrom.tasks = {};
        Maelstrom.config.verbose = false;

        Init.loadPlugin( require(PLUGIN_VALID) );
        Maelstrom.task('plumber');

        Assert(!_.isUndefined(Gulp.tasks.plumber));
    });

    it('should add the task to gulp and return an instance of gulp', function()
    {
        Maelstrom.tasks = {};
        Maelstrom.config.verbose = false;

        Init.loadPlugin( require(PLUGIN_VALID2) );

        var $actual = Maelstrom.task('through');

        Assert.strictEqual($actual, Gulp);
    });

    it('should add the task to gulp and display a log message', function()
    {
        Maelstrom.tasks = {};
        Maelstrom.config.verbose = true;

        LogInterceptor();
        Init.loadPlugin( require(PLUGIN_VALID2) );
        Maelstrom.task('through');

        var $actual = LogInterceptor.end();

        Assert.strictEqual(Chalk.stripColor($actual.pop()).substr(11),
            '- Add task \'through\': ' + Tildify(PLUGIN_VALID2) + '\n');
    });
});

describe('Maelstrom.watch()', function watchTests()
{
    it('should return false on invalid task', function()
    {
        Assert.strictEqual(Maelstrom.watch('invalid-task'), false);
    });

    it('should display a warning log message', function()
    {
        resetGulpTasks();

        Maelstrom.tasks = {};
        Maelstrom.config.verbose = false;

        Init.loadPlugin( require(PLUGIN_VALID) );

        LogInterceptor();
        Maelstrom.watch('plumber');

        var $actual = LogInterceptor.end();

        Assert.strictEqual(Chalk.stripColor($actual.pop()).substr(11),
            'Warning! No files to watch for task \'plumber\'!\n');
    });

    it('should add the task to gulp [1]', function()
    {
        resetGulpTasks();

        Maelstrom.tasks = {};
        Maelstrom.config.verbose = false;

        Init.loadPlugin( require(PLUGIN_VALID) );
        var $actual = Maelstrom.watch('plumber', ['some/file.*']);

        Assert(_.isObject($actual));
    });

    it('should add the task to gulp [2]', function()
    {
        resetGulpTasks();

        Maelstrom.tasks = {};
        Maelstrom.config.verbose = false;

        Init.loadPlugin( require(PLUGIN_VALID2) );
        var $actual = Maelstrom.watch('through');

        Assert(_.isObject($actual));
    });
});

describe('Maelstrom.extend()', function extendTests()
{
    it('should not add the value to the main object', function()
    {
        delete Maelstrom.test;
        Maelstrom.extend('test', false);

        Assert(_.isUndefined(Maelstrom.test));
    });

    it('should load the plugin and add to the main object [1]', function()
    {
        var $plugin = require(PLUGIN_VALID);

        delete Maelstrom.test;
        Maelstrom.extend('test', PLUGIN_VALID);

        Assert.strictEqual(Maelstrom.test, $plugin);
    });

    it('should load the plugin and add to the main object [2]', function()
    {
        var $plugin = require(PLUGIN_VALID);

        delete Maelstrom.valid;
        Maelstrom.extend(PLUGIN_VALID);

        Assert.strictEqual(Maelstrom.valid, $plugin);
    });

    it('should add the loaded plugin to the main object', function()
    {
        var $plugin = require(PLUGIN_VALID);

        delete Maelstrom.test;
        Maelstrom.extend('test', $plugin);

        Assert.strictEqual(Maelstrom.test, $plugin);
    });

    it('should add the function to the main object', function()
    {
        var $plugin = function()
        {
            return 'some plugin test value function';
        };

        delete Maelstrom.test;
        Maelstrom.extend('test', $plugin);

        Assert.strictEqual(Maelstrom.test, $plugin);
    });
});
