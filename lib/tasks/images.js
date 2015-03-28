/**
 * maelstrom | lib/tasks/sass.js
 * file version: 0.00.002
 */
'use strict';

var Maelstrom   = require('../index.js'),
    Config      = Maelstrom.config,
    Utils       = Maelstrom.utils,
    Gulp        = Maelstrom.gulp,
    GulpSize    = require('gulp-size'),
    Through     = require('through2'),
    BrowserSync = require('browser-sync');

//------------------------------------------------------------------------------

Gulp.task('images', function()
{
    return Gulp.src( Maelstrom.imagemin.src() )
        .pipe( Maelstrom.plumber() )
        .pipe( GulpIf(!GulpUtil.env.all, GulpChanged( Maelstrom.imagemin.dest() )) )
        .pipe( Maelstrom.imagemin() )
        .pipe( GulpSize({ showFiles: true }) )
        .pipe( Gulp.dest(Maelstrom.imagemin.dest()) )
        .pipe( BrowserSync.reload({ stream: true }) );
});
