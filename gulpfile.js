var Gulp       = require('gulp'),
    GulpPlugin = require('gulp-load-plugins')(),
    Maelstrom  = require('./index.js');

Maelstrom.init();

Gulp.task('test:css', function()
{
    Gulp.src('./tests/input/*.css')
        .pipe( Maelstrom.test() )
        .pipe( Gulp.dest('./tests/output/') );
});

Gulp.task('test:sass', function()
{
    Gulp.src('./tests/input/*.scss')
        .pipe( Maelstrom.sass() )
        .pipe( GulpPlugin.minifyCss() )
        .pipe( Gulp.dest('./tests/output/') );
});
