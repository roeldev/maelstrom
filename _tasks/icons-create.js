var config      = require('../gulpconfig.js'),
    gulp        = require('gulp'),
    runSequence = require('run-sequence');

//------------------------------------------------------------------------------

gulp.task('icons-create', function(done)
{
    runSequence('icons-create-fonts', 'scss-compile', done);
});
