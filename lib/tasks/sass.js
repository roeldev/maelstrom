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
    Through     = require('Through2'),
    BrowserSync = require('browser-sync');

//------------------------------------------------------------------------------

Gulp.task('sass', function()
{
    if (Config.sass.compiler == 'ruby')
    {
        console.log('Ruby Sass compiler not yet supported!');
        return false;
    }
    else
    {
        return Gulp.src( Maelstrom.libsass.src() )
            .pipe( Maelstrom.plumber() )
            .pipe( Maelstrom.libsass() )
            .pipe( GulpSize({ showFiles: true }) )
            .pipe( Gulp.dest(Maelstrom.libsass.dest()) )
            .pipe( BrowserSync.reload({ stream: true }) );
    }
});

if (Config.sass.compiler == 'ruby')
{
    Utils.watch(Maelstrom.rubysass);
}
else
{
    Utils.watch(Maelstrom.libsass);
}
