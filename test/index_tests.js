/**
 * maelstrom | test/index_tests.js
 * file version: 0.00.002
 */
'use strict';

var Maelstrom      = require('../lib/index.js');
var Init           = require('../lib/init.js')(Maelstrom);
// var Utils       = require('../lib/utils.js')(Maelstrom);
// var Plugin      = require('../lib/plugin.js');
// var _           = require('underscore');
var Assert         = require('assert');
var Chalk          = require('gulp-util').colors;
var Gulp           = require('gulp');
var LogInterceptor = require('log-interceptor');
var Path           = require('path');
// var Util        = require('util');
var Tildify        = require('tildify');

var PLUGIN_VALID = Path.resolve(__dirname, './fixtures/plugins/valid.js');

////////////////////////////////////////////////////////////////////////////////

/*function silentInit()
{
    var $args = (arguments.length ? _.toArray(arguments) : []);
    $args.unshift(Gulp);

    LogInterceptor();

    Maelstrom.init.apply(Maelstrom, $args);
    return LogInterceptor.end();
}*/

//LogInterceptor.config({ stripColor: true, trimTimestamp: true });

/******************************************************************************/

describe('Maelstrom.init()', function()
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

    /*it('should load the util functions and add it to the main obj', function()
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
    });*/
});

describe('Maelstrom.task()', function()
{
    it('should return false on invalid task', function()
    {
        Assert.strictEqual(Maelstrom.task('invalid-task'), false);
    });

    it('should add the task to gulp and return an instance of gulp', function()
    {
        Maelstrom.tasks = {};
        Maelstrom.config.verbose = false;

        Init.loadPlugin( require(PLUGIN_VALID) );

        var $actual = Maelstrom.task('through');

        Assert.strictEqual($actual, Gulp);
    });

    it('should add the task to gulp and display a log message', function()
    {
        Maelstrom.tasks = {};
        Maelstrom.config.verbose = true;

        LogInterceptor();
        Init.loadPlugin( require(PLUGIN_VALID) );
        Maelstrom.task('through');

        var $actual = LogInterceptor.end();

        Assert.strictEqual(Chalk.stripColor($actual.pop()).substr(11),
            '- Add task \'through\': ' + Tildify(PLUGIN_VALID) + '\n');
    });
});

/*describe('Maelstrom.watch()', function()
{

});*/

/*describe('Maelstrom.extend()', function()
{

});*/
