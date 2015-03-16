var config      = require('../gulpconfig.js'),
    gulp        = require('gulp'),
    plugin      = require('gulp-load-plugins')(),
    browserSync = require('browser-sync');

//------------------------------------------------------------------------------

gulp.task('scss-compile', function()
{
    var $sassOptions = {};
    if(config.isDev)
    {
        $sassOptions =
        {
            style:          'expanded',
            sourceComments: true,
            sourceMap:      true,
            sourceMapEmbed: true
        };
    }

    return gulp.src(config.scss.dirSource +'/*.scss')
        .pipe( plugin.plumber({ errorHandler: plugin.notify.onError(config.notifyError) }) )
        .pipe( plugin.if(config.isDev, plugin.sourcemaps.init({ loadMaps: true })) )
        .pipe( plugin.sass($sassOptions) )
        .pipe( plugin.if(config.isDev, plugin.sourcemaps.write()) )
        .pipe( plugin.autoprefixer(config.autoprefixer) )
        .pipe( plugin.if(!config.isDev, plugin.minifyCss()) )
        .pipe( plugin.size({ showFiles: true }) )
        .pipe( gulp.dest(config.scss.dirOutput) )
        .pipe( browserSync.reload({ stream: true }) );
});
