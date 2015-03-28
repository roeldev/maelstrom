/**
 * Maelstrom | lib/tasks/sass.js
 * file version: 0.00.002
 */
'use strict';

var Maelstrom = require('../index.js'),
    Config    = Maelstrom.config,
    Utils     = Maelstrom.utils,
    Gulp      = Maelstrom.gulp,
    Through   = require('Through2');

//------------------------------------------------------------------------------

var task,
    watch;

// create a task and watch function for ruby sass
if (Config.sass.compiler == 'ruby')
{
    watch = Utils.watch(Maelstrom.rubysass);
    task  = function()
    {
        console.log('Ruby Sass compiler not yet supported!');
        return Through.obj();
    };
}
// create a task and watch function for libsass
else
{
    watch = Utils.watch(Maelstrom.libsass);
    task  = function()
    {
        return Gulp.src( Maelstrom.libsass.src() )
            .pipe( Maelstrom.plumber() )
            .pipe( Maelstrom.libsass() )
            .pipe( Gulp.dest(Maelstrom.libsass.dest()) );
    };
}

//------------------------------------------------------------------------------

module.exports =
{
    'task':  task,
    'watch': watch
}
