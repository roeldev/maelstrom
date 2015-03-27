/**
 * Maelstrom | lib/tasks/sass.js
 * file version: 0.00.001
 */
'use strict';

var Maelstrom = require('../index.js'),
    Gulp = Maelstrom.gulp;

//------------------------------------------------------------------------------

function compileLibSass()
{
    return Gulp.src( Maelstrom.libsass.src() )
        .pipe( Maelstrom.plumber() )
        .pipe( Maelstrom.libsass() )
        .pipe( Gulp.dest(Maelstrom.libsass.dest()) );
}

function compileRubySass()
{

}

//------------------------------------------------------------------------------

module.exports = function()
{
    return compileLibSass();
};
