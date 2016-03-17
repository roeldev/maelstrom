/**
 * maelstrom | test/helpers/setMode.js
 */
'use strict';

const GulpUtil  = require('gulp-util');
const Maelstrom = require('../../lib/index.js');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

module.exports = function setMode($mode, $setConfig)
{
    if ($setConfig === true)
    {
        GulpUtil.env.dev  = false;
        GulpUtil.env.prod = false;

        Maelstrom.config.defaultMode = $mode;
    }
    else if ($mode === 'dev')
    {
        GulpUtil.env.dev  = true;
        GulpUtil.env.prod = false;
    }
    else
    {
        GulpUtil.env.dev  = false;
        GulpUtil.env.prod = true;
    }
};
