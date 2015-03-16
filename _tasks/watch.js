var config      = require('../gulpconfig.js'),
    gulp        = require('gulp'),
    browserSync = require('browser-sync');

//------------------------------------------------------------------------------

gulp.task('watch', function()
{
    browserSync(config.browserSync);

    gulp.watch(config.icons.dirSource +'/**/*', ['icons-create-fonts']);
    gulp.watch(config.scss.dirSource +'/**/*.scss', ['scss-compile']);
    gulp.watch(config.imgs.dirSource +'/**/*.{'+ config.imgs.extensions.join(',') +'}', ['images-optimize']);
    gulp.watch(config.publicDir +'/*.html').on('change', browserSync.reload);
});
