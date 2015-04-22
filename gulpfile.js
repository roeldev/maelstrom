/**
 * maelstrom | gulpfile.js
 * file version: 0.00.004
 */
'use strict';

var Maelstrom       = require('./lib/index.js');
var Gulp            = require('gulp');
var GulpJsCs        = require('gulp-jscs');
var GulpJsCsStylish = require('gulp-jscs-stylish');
var GulpJsHint      = require('gulp-jshint');
var GulpMocha       = require('gulp-mocha');
var GulpSize        = require('gulp-size');
var Delete          = require('del');
var RunSequence     = require('run-sequence');

var JS_SRC =
[
    'gulpfile.js',
    'lib/**/*.js',
    '!lib/**/_*.js',
    '!lib/templates/*.js',
    'test/*.js'
];

////////////////////////////////////////////////////////////////////////////////

Maelstrom.init(Gulp,
{
    'src':
    {
        'images': './tests/input',
        'js':     './tests/input',
        'sass':   './tests/input'
    },

    'dest':
    {
        'images': './tests/output',
        'css':    './tests/output',
        'js':     './tests/output'
    },

    'jshintConfig': false
});

/*Maelstrom.extend('tests/custom-plugin.js');
Maelstrom.extend('customPlugin2', 'tests/custom-plugin.js');
Maelstrom.extend('customPlugin3', {});*/

//------------------------------------------------------------------------------
// Test related tasks
//------------------------------------------------------------------------------
/*
    Icons
    - svg -> iconfont
    - create iconfont Sass import file
    - svg -> sprite*
    - create sprite Sass import file*
 */
Gulp.task('test:icons', function()
{
    var $src  = 'tests/icons/*.svg';
    var $dest = 'tests/icons/dest';

    var $templateConfig =
    {
        'dest': 'tests/icons/dest/'
    };

    Delete($dest + '/*.*');

    Gulp.src($src)
        .pipe( Maelstrom.plumber() )
        .pipe( Maelstrom.icons('font', $templateConfig) )
        .pipe( GulpSize({ 'showFiles': true }) )
        .pipe( Gulp.dest($dest) );
});

/*
    Images plugin
    ✓ optimize images
    - resize images*
 */
Gulp.task('test:images', function()
{
    var $imgExt = Maelstrom.config.imageExtensions.join(',');
    var $src    = 'tests/images/*.{' + $imgExt + '}';
    var $dest   = 'tests/images/dest';

    Delete($dest + '/*.*');

    Gulp.src($src)
        .pipe( Maelstrom.plumber() )
        .pipe( Maelstrom.images('optimize') )
        .pipe( GulpSize({ 'showFiles': true }) )
        .pipe( Gulp.dest($dest) );
});

/*
    Sass plugin
    ✓ compile sass
    ✓ autoprefix
    ✓ minify
 */
Gulp.task('test:sass', function()
{
    var $src  = 'tests/sass/*.scss';
    var $dest = 'tests/sass/dest';

    Delete($dest + '/*.*');

    Gulp.src($src)
        .pipe( Maelstrom.plumber() )
        .pipe( Maelstrom.sass() )
        .pipe( GulpSize({ 'showFiles': true }) )
        .pipe( Gulp.dest($dest) );
});

//------------------------------------------------------------------------------
// Dev related tasks
//------------------------------------------------------------------------------
Gulp.task('lint', function()
{
    return Gulp.src(JS_SRC)
        .pipe( GulpJsHint() )
        .pipe( GulpJsCs() ).on('error', Maelstrom.utils.noop)
        .pipe( GulpJsCsStylish.combineWithHintResults() )
        .pipe( GulpJsHint.reporter('jshint-stylish') );
});

Gulp.task('test', function()
{
    return Gulp.src('test/*.js', { 'read': false })
        .pipe( GulpMocha({ 'reporter': 'spec' }) );
});

Gulp.task('dev', function()
{
    process.stdout.write('\u001b[2J');
    RunSequence('test', 'lint');
});

Gulp.task('watch', function()
{
    Gulp.watch(JS_SRC, ['dev']);
});

Gulp.task('watch:lint', function()
{
    Gulp.watch(JS_SRC, ['lint']);
});
