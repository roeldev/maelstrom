/**
 * maelstrom | lib/plugins/sass.js
 * file version: 0.00.001
 */
'use strict';

var Maelstrom        = require('../index.js'),
    Plugin           = require('../plugin.js'),
    Utils            = Maelstrom.utils,
    GulpAutoprefixer = require('gulp-autoprefixer'),
    GulpMinifyCss    = require('gulp-minify-css'),
    GulpSass         = require('gulp-sass'),
    GulpSize         = require('gulp-size');

////////////////////////////////////////////////////////////////////////////////

module.exports = function()
{
    var $plugin = new Plugin(
    {
        'src':  this.config.src.sass +'/**/*.{sass,scss}',
        'dest': this.config.dest.css
    });

    $plugin.addStream('libsass', function()
    {
        return Utils.pipeStreams(
        [
            GulpSass(this.config.sass.libsass),
            GulpAutoprefixer(this.config.css.autoprefixer),
            Utils.pipeWhenNotDev( GulpMinifyCss() )
        ]);
    });

    $plugin.addTask('sass', function()
    {
        if (this.config.sass.compiler == 'ruby')
        {
            console.log('Ruby Sass task not yet supported!');
            return false;
        }
        else
        {
            return this.gulp.src( this.src() )
                .pipe( this.plumber() )
                .pipe( this.sass('libsass') )
                .pipe( GulpSize({ showFiles: true }) )
                .pipe( this.gulp.dest(this.dest()) )
                .pipe( BrowserSync.reload({ stream: true }) );
        }
    });

    return $plugin;
};
