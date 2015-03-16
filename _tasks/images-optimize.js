var config      = require('../gulpconfig.js'),
    gulp        = require('gulp'),
    plugin      = require('gulp-load-plugins')(),
    browserSync = require('browser-sync');

//------------------------------------------------------------------------------

gulp.task('images-optimize', function()
{
    return gulp.src(config.imgs.dirSource +'/**/*.{'+ config.imgs.extensions.join(',') +'}')
        .pipe( plugin.plumber({ errorHandler: plugin.notify.onError(config.notifyError) }) )
        .pipe( plugin.if(!plugin.util.env.all, plugin.changed(config.imgs.dirOutput)) )
        .pipe( plugin.imagemin(config.imagemin) )
        .pipe( plugin.size({ showFiles: true }) )
        .pipe( gulp.dest(config.imgs.dirOutput) )
        .pipe( browserSync.reload({ stream: true }) );
});
