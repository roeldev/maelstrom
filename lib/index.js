/**
 * Maelstrom | lib/index.js
 * file version: 0.00.001
 */
'use strict';

var _          = require('underscore'),
    FileSystem = require('graceful-fs'),
    DeepExtend = require('deep-extend'),
    RequireDir = require('require-dir'),
    Maelstrom;

//------------------------------------------------------------------------------

/**
 * Maelstrom initializer
 *
 * @param  {string|array} $tasksDirs - Array with dirs to require
 * @param  {object} $config - Config options
 * @return null
 */
Maelstrom = function($gulp, $tasksDirs, $config)
{
    var $requireDirs = ['./tasks'];
    if (_.isArray($tasksDirs))
    {
        $tasksDirs.unshift($requireDirs[0]);
        $requireDirs = $tasksDirs;
    }
    elseif (_.isString($tasksDirs))
    {
        $requireDirs.push($tasksDirs);
    }

    Maelstrom.init($gulp, $config);
    Maelstrom.require($requireDirs);
};

Maelstrom.config  = require('./config.js');
Maelstrom.require = RequireDir;
Maelstrom.plugins = [];

//------------------------------------------------------------------------------

Maelstrom.init = function($gulp, $customConfig)
{
    var $result            = {},
        $configs           = [$result, Maelstrom.config],
        $projectConfig     = {},
        $projectConfigFile = 'maelstrom.json';

    // read config json file from project root folder
    if (FileSystem.existsSync($projectConfigFile))
    {
        $projectConfig = FileSystem.readFileSync($projectConfigFile, 'utf8');
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
    $result = DeepExtend.apply($result, $configs);

    Maelstrom.config = $result;
    Maelstrom.gulp   = $gulp;

    Maelstrom.test = require('./plugins/test.js');
    Maelstrom.sass = require('./plugins/sass.js');
};

Maelstrom.plugin = function($plugin)
{

};

/*
    Maelstrom - A collection of Gulp tasks
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
module.exports = Maelstrom;
