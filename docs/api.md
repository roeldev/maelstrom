##Documentation
- [Requirements][docs-requirements]: What software, packages and gems are required?
- [Config][docs-config]: All available config options described and explained.
- [API][docs-api]: Want to know how to use the maelstrom functions?
- [Plugins][docs-plugins]: Detailed descriptions for all default maelstrom plugins.
- [Tasks][docs-tasks]: More info about maelstrom's default gulp tasks.

[< Back to Readme](../README.md)

--------------------------------------------------------------------------------


#API
- [maelstrom()][api-maelstrom]
- [maelstrom.init()][api-maelstrom-init]
- [maelstrom.task()][api-maelstrom-task]
- [maelstrom.watch()][api-maelstrom-watch]
- [maelstrom.extend()][api-maelstrom-extend]


####`maelstrom()`
Initializing maelstrom by calling this function passes all arguments to the `maelstrom.init()` function, and adds all default tasks to gulp.


####`maelstrom.init(gulp[, customConfig])`
Maelstrom initializer wich allows you to use the default plugins inside your own gulp tasks.


#####_gulp_
> Type: `object`

A reference to the required gulp module.


#####_customConfig_
> Type: `object`

> Optional

An optional custom config object. This will overrule both the default maelstrom config and the options loaded from `maelstrom.json`.


####`maelstrom.task(taskName[, options...])`
This function adds a default maelstrom task to `gulp.task()`. The result from the `gulp.task()` function is returned. If for some reason `gulp.task()` is not called, the default value of `false` is returned.


#####_taskName_
> Type: `string`

Name of the maelstrom task to add to gulp.


#####_options_
> Type: `mixed`

> Optional

All other arguments are passed along to the task function. Check the documentation for the task you would like to use to see wich extra options are available.


####`maelstrom.watch(taskName[, extraFiles][, extraTasks])`
This function adds a file watcher with `gulp.watch()` for the given task. The files to watch are taken from the plugin wich defined the task. The default result from the `gulp.watch()` function is returned. If for some reason `gulp.watch` is not called, the default value of `false` is returned.


#####_taskName_
> Type: `string`

Name of the maelstrom task to watch.


#####_extraFiles_
> Type: `array` or `string`

> Optional

Optional extra files to pass to `gulp.watch()`.


#####_extraTasks_
> Type: `array` or `string`

> Optional

Optional extra tasks to pass to `gulp.watch()`.


####`maelstrom.extend(name, plugin)`
Extend maelstrom by adding your own functions, objects or arrays. To load a plugin from a file pass the filename as a string. The results from the file (`module.exports`) will be added as the plugin.


#####_name_
> Type: `string`

The name to call the plugin: `maelstrom._name_`.


#####_plugin_
> Type: `function` or `object` or `string`

A plugin to add to maelstrom.

[api-maelstrom]: #maelstrom-1
[api-maelstrom-init]: #maelstrominitgulp-customconfig
[api-maelstrom-task]: #maelstromtasktaskname-options
[api-maelstrom-watch]: #maelstromwatchtaskname-extrafiles-extratasks
[api-maelstrom-extend]: #maelstromextendname-plugin

[docs-requirements]: requirements.md
[docs-config]: config.md
[docs-api]: api.md
[docs-plugins]: plugins.md
[docs-tasks]: tasks.md