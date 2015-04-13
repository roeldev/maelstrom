/**
 * maelstrom | gulpfile.js
 * file version: 0.00.002
 */
'use strict';

var Maelstrom  = require('./lib/index.js'),
    Gulp       = require('gulp'),
    GulpSize   = require('gulp-size'),
    Delete     = require('del');

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
    var $src  = 'tests/icons/*.svg',
        $dest = 'tests/icons/dest',

    $templateConfig =
    {
        'dest': 'tests/icons/dest/'
    };

    Delete($dest +'/*.*');

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
    var $imgExt = Maelstrom.config.imageExtensions.join(','),
        $src    = 'tests/images/*.{'+ $imgExt +'}',
        $dest   = 'tests/images/dest';

    Delete($dest +'/*.*');

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
    var $src  = 'tests/sass/*.scss',
        $dest = 'tests/sass/dest';

    Delete($dest +'/*.*');

    Gulp.src($src)
        .pipe( Maelstrom.plumber() )
        .pipe( Maelstrom.sass() )
        .pipe( GulpSize({ 'showFiles': true }) )
        .pipe( Gulp.dest($dest) );
});

//------------------------------------------------------------------------------
// Dev related tasks
//------------------------------------------------------------------------------
Gulp.task('dev:jshint', function()
{
    return Gulp.src([__filename, 'lib/**/*.js'])
        .pipe( Maelstrom.plumber() )
        .pipe( Maelstrom.js('lint') );
});

Gulp.task('dev:watch', function()
{
    Gulp.watch([__filename, 'lib/**/*.js'], ['dev:jshint']);
});

Gulp.task('default', function(){ });
