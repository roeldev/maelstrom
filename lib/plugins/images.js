/**
 * maelstrom | lib/plugins/images.js
 * file version: 0.00.001
 */
'use strict';

var Maelstrom    = require('../index.js'),
    Plugin       = require('../plugin.js'),
    Utils        = Maelstrom.utils,
    GulpImageMin = require('gulp-imagemin');

////////////////////////////////////////////////////////////////////////////////

module.exports = function()
{
    var $fileExtensions = this.config.images.extensions.join(',');

    var $plugin = new Plugin(
    {
        'src':  this.config.src.images +'/**/*.{'+ $fileExtensions +'}',
        'dest': this.config.dest.images
    });

    $plugin.addStream('optimize', function()
    {
        GulpImageMin(this.config.images.imagemin);
    });

    $plugin.addStream('resize', []);

    $plugin.addTask('images:optimize', function()
    {
        return this.gulp.src( this.images.src() )
            .pipe( this.plumber() )
            .pipe( GulpIf(!GulpUtil.env.all, GulpChanged( this.images.dest() )) )
            .pipe( this.images('optimize') )
            .pipe( GulpSize({ showFiles: true }) )
            .pipe( this.gulp.dest(this.images.dest()) )
            .pipe( BrowserSync.reload({ stream: true }) );
    });

    $plugin.addTask('images:resize', function()
    {
        // loop through resize tasks, multiple this.gulp.src calls...
    });

    $plugin.addTask('images', ['images:optimize', 'images:resize']);

    return $plugin;
};
