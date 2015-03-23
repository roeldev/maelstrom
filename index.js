"use strict";
/*
    maelstrom-js - A collection of Gulp tasks
    Copyright (c) 2015 Roel Schut (roelschut.nl)

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */

var _           = require('underscore'),
    _deepExtend = require('deep-extend'),
    _fileSystem = require('fs'),
    _requireDir = require('require-dir'),
    _gulp       = require('gulp');

/*

Task commands:
- sass (kiest adhv. config welke engine te gebuiken)
- sass-compile:libsass (compilen dmv. libsass)
- sass-compile:ruby (compilen dmv. ruby)

- images (optimaliseer alle afbeeldingen vanuit assets/imgs)
- image-optimize (optimaliseer losse afbeelding adhv. parameter)
- image-resize (verklein afbeelding adhv. parameter, sla verkleinde variant ook op in asset/imgs)

- iconfont

- watch (watch all)
- watch:assets (watch alle asset files)
- watch:public (watch alle public files -> browserSync)

*/

//------------------------------------------------------------------------------

var _dirAssets = 'assets',
    _dirOutput = 'public',

// default config
_config =
{
    'assets':
    {
        'favicon': _dirAssets +'/favicon',
        'icons':   _dirAssets +'/icons',
        'images':  _dirAssets +'/imgs',
        'js':      _dirAssets +'/js',
        'sass':    _dirAssets +'/scss'
    },

    'output':
    {
        'css':    _dirOutput +'/css',
        'fonts':  _dirOutput +'/fonts',
        'images': _dirOutput +'/imgs',
        'js':     _dirOutput +'/js'
    },

    //--------------------------------------------------------------------------
    // MODULES
    //--------------------------------------------------------------------------
    'css':
    {
        'autoprefixer':
        {
            'cascade':  false,
            'browsers': ['last 4 version']
        },

        'concatenate': {}
    },

    'sass':
    {
        'compiler': 'libsass', // libsass|ruby

        'libsass':
        {
            style:          'expanded',
            sourceComments: true
        }
    },

    //--------------------------------------------------------------------------

    'images':
    {
        'imagemin':
        {
            'progressive': true,
            'interlaced':  true
        }
    },

    //--------------------------------------------------------------------------

    'icons':
    {
        'type': 'font', // font|sprite

        'iconfont':
        {
            'fontName':           'iconfont',
            'appendCodepoints':   true,
            'normalize':          true,
            'centerHorizontally': true,
            'fixedWidth':         false,
            'fontHeight':         18,
        }
    },

    //--------------------------------------------------------------------------

    'notify':
    {
        'error':
        {
            'message': 'Error: <%= error.message %>',
            'time':    8000,
            'wait':    false
        },
    },

    //--------------------------------------------------------------------------

    'browserSync':
    {
        'proxy':  'localhost:8000',
        'port':   80,
        'files':  [],
        'open':   false,
        'ui':     false,
        'notify': false,
    }
};

//------------------------------------------------------------------------------

/*
    config volgorde
    - default
    - maelstrom.JSON
    - config parameter
*/
var _init = function($customConfig)
{
    var $result            = {},
        $configs           = [$result, maelstrom.config],
        $projectConfig     = {},
        $projectConfigFile = 'maelstrom.json';

    // read config json file from project root folder
    if (_fileSystem.existsSync($projectConfigFile))
    {
        $projectConfig = _fileSystem.readFileSync($projectConfigFile, 'utf8');
        $projectConfig = JSON.parse($projectConfig);

        if (!_.isEmpty($projectConfig))
        {
            $configs.push($projectConfig);
        }
    }

    if (_.isObject($customConfig) && !_.isEmpty($customConfig))
    {
        $configs.push($customConfig);
    }

    // combine the 3 config sources in to one object
    $result = _deepExtend.apply($result, $configs);
    maelstrom.config = $result;
};

//------------------------------------------------------------------------------

/**
 * Maelstrom initializer
 *
 * @param  {string|array} tasksDirs - Array with dirs to require
 * @param  {object} config - Config options
 * @return null
 */
var maelstrom = function(tasksDirs, config)
{
    var requireDirs = ['./tasks']
    if (_.isArray(tasksDirs))
    {
        tasksDirs.unshift(requireDirs[0]);
        requireDirs = tasksDirs;
    }
    elseif (_.isString(tasksDirs))
    {
        requireDirs.push(tasksDirs);
    }

    _init(config);
    _requireDir(requireDirs);
};

maelstrom.config  = _config;
maelstrom.init    = _init;
maelstrom.require = _requireDir;

module.exports = maelstrom;
