/**
 * maelstrom | utils/extendFromPackage.js
 */
'use strict';

const _        = require('lodash');
const GulpUtil = require('gulp-util');
const Path     = require('path');
const Tildify  = require('tildify');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

/**
 * Extend maelstrom by using a package
 *
 * @param {string} $package
 * @return {object|boolean}
 */
module.exports = function extendFromPackage($package)
{
    // console.log('extend from package', $package);

    let $result     = false;
    let $pluginFile = false;

    try
    {
        $result = require($package + 'x');
    }
    catch($e)
    {
        $pluginFile = '../../../' + $package + '/lib/index.js';
        $pluginFile = Path.resolve(__dirname, $pluginFile);

        try
        {
            $result = require($pluginFile);
        }
        catch($e)
        {
            GulpUtil.log( GulpUtil.colors.red(
                          '- Unable to load plugin ' + $package) );

            // console.log($e);
        }
    }

    if ($result !== false)
    {
        if (this.utils.isVerbose())
        {
            let $msg = [
                '- Loading plugin',
                GulpUtil.colors.cyan($package),
            ];

            if ($pluginFile)
            {
                $msg.push( 'from' );
                $msg.push( GulpUtil.colors.magenta( Tildify($pluginFile) ) );
            }

            GulpUtil.log.apply(null, $msg);
        }

        if (_.isFunction($result))
        {
            $result = $result.call(this, this);
        }

        $result = this.extend($result);
    }

    return $result;
};
