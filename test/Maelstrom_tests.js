/**
 * maelstrom | test/Maelstrom_tests.js
 */
'use strict';

const Gulp           = require('gulp');
const LogInterceptor = require('log-interceptor');

const Maelstrom = require('../lib/index');

const expect         = require('chai').expect;
const silentInit     = require('./helpers/silentInit');
const resetGulpTasks = require('./helpers/resetGulpTasks');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

LogInterceptor.config(
{
    'stripColor':    true,
    'trimTimestamp': true
});

// -----------------------------------------------------------------------------

describe('Maelstrom.init()', function initTests()
{
    it('should stop initializing on invalid gulp instance', function()
    {
        LogInterceptor();
        let $actual = Maelstrom.init({});
        LogInterceptor.end();

        expect($actual).to.be.false;
    });

    it('should display an error msg on invalid gulp instance', function()
    {
        LogInterceptor();
        Maelstrom.init({});

        let $actual = LogInterceptor.end();

        expect( $actual.pop() ).to.equal(
            'Make sure to pass an instance of gulp to maelstrom.init()\n');
    });

    /*it('should add the gulp instance to the main object', function()
    {
        silentInit();

        expect(Maelstrom.gulp).to.be.instanceof(Gulp);
    });*/

    /*it('should load the Plugin class and add it to the main obj', function()
    {
        silentInit();

        Assert.strictEqual(Maelstrom.Plugin, Plugin);
    });


    function checkTasksAdded()
    {
        for (let $taskName in Maelstrom._tasks)
        {
            if (!Maelstrom._tasks.hasOwnProperty($taskName))
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
        silentInit([]);

        Assert(checkTasksAdded());
    });

    it('should add the default tasks to the main object [2]', function()
    {
        resetGulpTasks();
        silentInit([true]);

        Assert(checkTasksAdded());
    });

    it('should add the default tasks to the main object [3]', function()
    {
        resetGulpTasks();
        silentInit([{}]);

        Assert(checkTasksAdded());
    });

    it('should add the default tasks to the main object [4]', function()
    {
        resetGulpTasks();
        silentInit([true, {}]);

        Assert(checkTasksAdded());
    });

    it('should add the default tasks to the main object [5]', function()
    {
        resetGulpTasks();
        silentInit([{}, {}]);

        Assert(checkTasksAdded());
    });


    function checkTasksNotAdded()
    {
        for (let $taskName in Maelstrom._tasks)
        {
            if (!Maelstrom._tasks.hasOwnProperty($taskName))
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
        silentInit([false]);

        Assert(checkTasksNotAdded());
    });

    it('should not add the default tasks to the main object [2]', function()
    {
        resetGulpTasks();
        silentInit([false, {}]);

        Assert(checkTasksNotAdded());
    });*/
});

/*describe('Maelstrom.task()', function taskTests()
{
    it('should return false on invalid task', function()
    {
        Assert.strictEqual(Maelstrom.task('invalid-task'), false);
    });

    it('should add the task to gulp', function()
    {
        resetGulpTasks();

        Maelstrom._tasks = {};
        Maelstrom.config.verbose = false;

        Init.loadPlugin( require(PLUGIN_VALID) );
        Maelstrom.task('plumber');

        Assert(!_.isUndefined(Gulp.tasks.plumber));
    });

    it('should add the task to gulp and return an instance of gulp', function()
    {
        Maelstrom._tasks = {};
        Maelstrom.config.verbose = false;

        Init.loadPlugin( require(PLUGIN_VALID2) );

        let $actual = Maelstrom.task('through');

        Assert.strictEqual($actual, Gulp);
    });

    it('should add the task to gulp and display a log message', function()
    {
        Maelstrom._tasks = {};
        Maelstrom.config.verbose = true;

        LogInterceptor();
        Init.loadPlugin( require(PLUGIN_VALID2) );
        Maelstrom.task('through');

        let $actual = LogInterceptor.end();

        Assert.strictEqual($actual.pop(),
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

        Maelstrom._tasks = {};
        Maelstrom.config.verbose = false;

        Init.loadPlugin( require(PLUGIN_VALID) );

        LogInterceptor();
        Maelstrom.watch('plumber');

        let $actual = LogInterceptor.end();

        Assert.strictEqual($actual.pop(),
            'Warning! No files to watch for task \'plumber\'!\n');
    });

    it('should add the task to gulp [1]', function()
    {
        resetGulpTasks();

        Maelstrom._tasks = {};
        Maelstrom.config.verbose = false;

        Init.loadPlugin( require(PLUGIN_VALID) );
        let $actual = Maelstrom.watch('plumber', ['some/file.*']);

        Assert(_.isObject($actual));
    });

    it('should add the task to gulp [2]', function()
    {
        resetGulpTasks();

        Maelstrom._tasks = {};
        Maelstrom.config.verbose = false;

        Init.loadPlugin( require(PLUGIN_VALID2) );
        let $actual = Maelstrom.watch('through');

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
        let $plugin = require(PLUGIN_VALID);

        delete Maelstrom.test;
        Maelstrom.extend('test', PLUGIN_VALID);

        Assert.strictEqual(Maelstrom.test, $plugin);
    });

    it('should load the plugin and add to the main object [2]', function()
    {
        let $plugin = require(PLUGIN_VALID);

        delete Maelstrom.valid;
        Maelstrom.extend(PLUGIN_VALID);

        Assert.strictEqual(Maelstrom.valid, $plugin);
    });

    it('should add the loaded plugin to the main object', function()
    {
        let $plugin = require(PLUGIN_VALID);

        delete Maelstrom.test;
        Maelstrom.extend('test', $plugin);

        Assert.strictEqual(Maelstrom.test, $plugin);
    });

    it('should add the function to the main object', function()
    {
        let $plugin = function()
        {
            return 'some plugin test value function';
        };

        delete Maelstrom.test;
        Maelstrom.extend('test', $plugin);

        Assert.strictEqual(Maelstrom.test, $plugin);
    });
});
*/
