var config      = require('../gulpconfig.js'),
    gulp        = require('gulp'),
    runSequence = require('run-sequence');

//------------------------------------------------------------------------------

gulp.task('default', function(done)
{
    runSequence('images-optimize', 'icons-create-fonts', 'scss-compile', done);
});
