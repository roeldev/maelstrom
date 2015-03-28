var Gulp        = require('gulp'),
    Maelstrom   = require('./lib/index.js'),
    Delete      = require('del');

Maelstrom.init(Gulp,
{
    'src':
    {
        'js':   './tests/input',
        'sass': './tests/input'
    },

    'dest':
    {
        'css': './tests/output',
        'js':  './tests/output'
    }
});

Maelstrom.extend('tests/custom-plugin.js');
Maelstrom.extend('customPlugin2', 'tests/custom-plugin.js');
Maelstrom.extend('customPlugin3', {});

console.log(Maelstrom);

//------------------------------------------------------------------------------

Gulp.task('test:css', function()
{
    Gulp.src('./tests/input/*.css')
        .pipe( Maelstrom.test() )
        .pipe( Gulp.dest('./tests/output/') );
});

Gulp.task('test:sass', function()
{
    Delete(Maelstrom.libsass.dest() +'/*.*');

    Gulp.src( Maelstrom.libsass.src() )
        .pipe( Maelstrom.plumber() )
        .pipe( Maelstrom.libsass() )
        .pipe( Gulp.dest(Maelstrom.libsass.dest()) );
});

Gulp.task('watch:tests', function()
{
    Gulp.watch('tests/input/*.scss', ['test:sass']);

    Maelstrom.watch('sass');
});
