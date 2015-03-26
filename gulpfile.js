var Gulp        = require('gulp'),
    GulpPlugins = require('gulp-load-plugins')(),
    Maelstrom   = require('./lib/index.js'),
    Del         = require('del');

Maelstrom.init();

Gulp.task('test:css', function()
{
    Gulp.src('./tests/input/*.css')
        .pipe( Maelstrom.test() )
        .pipe( Gulp.dest('./tests/output/') );
});

Gulp.task('test:sass', function()
{
    Del('./tests/output/*.*');

    var $src = Gulp.src('./tests/input/*.scss')
        .pipe( Maelstrom.sass() )
        .pipe( Gulp.dest('./tests/output/') );
});

Gulp.task('watch:tests', function()
{
    Gulp.watch('tests/input/*.scss', ['test:sass']);
});
