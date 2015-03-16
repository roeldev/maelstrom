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

var _          = require('underscore'),
    fileSystem = require('fs'),
    requireDir = require('require-dir');

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

// default config
var _config =
{

};

//------------------------------------------------------------------------------

/*
    config volgorde
    - default
    - maelstrom.json
    - $config parameter
*/
var _init = function($customConfig)
{
    var $result            = {},
        $configs           = [$result, maelstrom.config],
        $projectConfig     = {},
        $projectConfigFile = 'maelstrom.json';

    // read config json file from project root folder
    if (fileSystem.existsSync($projectConfigFile))
    {
        $projectConfig = fileSystem.readFileSync($projectConfigFile, 'utf8');
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
    _.extend.apply($result, $configs);
    maelstrom.config = $result;
};

//------------------------------------------------------------------------------

var maelstrom = function($taskDirs, $config)
{
    var $requireDirs = ['./tasks']
    if (_.isArray($taskDirs))
    {
        $taskDirs.unshift($requireDirs[0]);
        $requireDirs = $taskDirs;
    }
    elseif (_.isString($taskDirs))
    {
        $requireDirs.push($taskDirs);
    }

    _init($config);
    requireDir($requireDirs);
};

maelstrom.config     = _config;
maelstrom.init       = _init;
maelstrom.requireDir = requireDir;

module.exports = maelstrom;
