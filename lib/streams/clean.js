/**
 * maelstrom | lib/streams/clean.js
 */
'use strict';

const Del      = require('del');
const GulpUtil = require('gulp-util');
const Path     = require('path');
const Tildify  = require('tildify');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

module.exports = function($dir)
{
    $dir = Path.resolve(process.cwd(), $dir);

    GulpUtil.log.apply(null,
    [
        'Cleaning dir',
        GulpUtil.colors.magenta( Tildify($dir) ) + ',',
        'removing files...'
    ]);

    let $deletedFiles = Del.sync([$dir + '/**', '!' + $dir]);

    for (let $i = 0, $iL = $deletedFiles.length; $i < $iL; $i++)
    {
        let $deletedFile = $deletedFiles[$i];
        $deletedFile = Path.relative($dir, $deletedFile);

        GulpUtil.log('  ' + GulpUtil.colors.blue($deletedFile));
    }
};
