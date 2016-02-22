/**
 * maelstrom | gulpfile.js
 */
'use strict';

const Gulp        = require('gulp');
const GulpMocha   = require('gulp-mocha');
const GulpSize    = require('gulp-size');
const Delete      = require('del');
const Maelstrom   = require('./lib/index.js');
const RunSequence = require('run-sequence');

Maelstrom.init(Gulp, ['maelstrom-js']);

// -----------------------------------------------------------------------------

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

Gulp.task('watch:dev', function()
{
    Gulp.watch(Maelstrom.config.src.js, ['dev']);
});

Gulp.task('watch:lint', function()
{
    Gulp.watch(Maelstrom.config.src.js, ['lint']);
});

Gulp.task('watch', ['watch:dev', 'watch:lint']);
