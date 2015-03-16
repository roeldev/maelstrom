var config    = require('../gulpconfig.js'),
    gulp      = require('gulp'),
    pagespeed = require('psi');

//------------------------------------------------------------------------------

gulp.task('pagespeed', function(callback)
{
    return pagespeed.output(config.pagespeed.domain, config.pagespeed, callback);
});
