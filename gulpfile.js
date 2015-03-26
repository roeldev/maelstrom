var Gulp        = require('gulp'),
    Maelstrom   = require('./lib/index.js'),
    Del         = require('del');

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

//------------------------------------------------------------------------------

Gulp.task('test:css', function()
{
    Gulp.src('./tests/input/*.css')
        .pipe( Maelstrom.test() )
        .pipe( Gulp.dest('./tests/output/') );
});

Gulp.task('test:sass', function()
{
    Del(Maelstrom.sass.dest() +'/*.*');

    Gulp.src( Maelstrom.sass.src() )
        .pipe( Maelstrom.sass() )
        .pipe( Gulp.dest(Maelstrom.sass.dest()) );
});

Gulp.task('watch:tests', function()
{
    Gulp.watch('tests/input/*.scss', ['test:sass']);

    Maelstrom.sass.watch();
});
