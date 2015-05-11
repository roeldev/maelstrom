## Documentation
- [Requirements][docs-requirements]: What software, packages and gems are required?
- [Config][docs-config]: All available config options described and explained.
- [API][docs-api]: Want to know how to use the maelstrom functions?
- [Plugins][docs-plugins]: Detailed descriptions for all default maelstrom plugins.
- [Tasks][docs-tasks]: More info about maelstrom's default gulp tasks.

[< Back to Readme](../README.md)

[docs-requirements]: requirements.md
[docs-config]: config.md
[docs-api]: api.md
[docs-plugins]: plugins.md
[docs-tasks]: tasks.md

--------------------------------------------------------------------------------

# API
- [maelstrom.init()][api-maelstrom-init]
- [maelstrom.task()][api-maelstrom-task]
- [maelstrom.watch()][api-maelstrom-watch]
- [maelstrom.extend()][api-maelstrom-extend]


--------------------------------------------------------------------------------
### maelstrom.init(gulp[, addTasks][, customConfig])
Maelstrom initializer wich allows you to use the default plugins inside your own gulp tasks.

- <h4>gulp</h4>
<table>
<tr><td>Type</td><td><code>object</code></td></tr>
</table>
A reference to the required gulp module.

- <h4>addTasks</h4>
<table>
<tr><td>Type</td><td><code>boolean</code> or <code>array</code></td></tr>
<tr><td>Default</td><td><code>true</code></td></tr>
</table>
Specify wich default maelstrom tasks to add to gulp. By default, all tasks are added. When `false`, no tasks will be added.

- <h4>customConfig</h4>
<table>
<tr><td>Type</td><td><code>object</code></td></tr>
</table>
An optional custom config object. This will overrule both the default maelstrom config and the options loaded from your `maelstrom.yml` or `maelstrom.json` file.


--------------------------------------------------------------------------------
### maelstrom.task(taskName[, options...])
This function adds a default maelstrom task to `gulp.task()`. The result from the `gulp.task()` function is returned. If for some reason `gulp.task()` is not called, the default value of `false` is returned.

- <h4>taskName</h4>
<table>
<tr><td>Type</td><td><code>string</code></td></tr>
</table>
Name of the maelstrom task to add to gulp.

- <h4>options</h4>
<table>
<tr><td>Type</td><td><code>mixed</code></td></tr>
</table>
All other arguments are passed along to the task function. Check the documentation for the task you would like to use to see wich extra options are available.


--------------------------------------------------------------------------------
### maelstrom.watch(taskName[, extraFiles][, extraTasks])
This function adds a file watcher with `gulp.watch()` for the given task. The files to watch are taken from the plugin wich defined the task. The default result from the `gulp.watch()` function is returned. If for some reason `gulp.watch` is not called, the default value of `false` is returned.

- <h4>taskName</h4>
<table>
<tr><td>Type</td><td><code>string</code></td></tr>
</table>
Name of the maelstrom task to watch.

- <h4>extraFiles</h4>
<table>
<tr><td>Type</td><td><code>array</code> or <code>string</code></td></tr>
</table>
Optional extra files to pass to `gulp.watch()`.

- <h4>extraTasks</h4>
<table>
<tr><td>Type</td><td><code>array</code> or <code>string</code></td></tr>
</table>
Optional extra tasks to pass to `gulp.watch()`.


--------------------------------------------------------------------------------
### maelstrom.extend(name, plugin)
Extend maelstrom by adding your own functions, objects or arrays. To load a plugin from a file pass the filename as a string. The results from the file (`module.exports`) will be added as the plugin.

- <h4>name</h4>
<table>
<tr><td>Type</td><td><code>string</code></td></tr>
</table>
The name to call the plugin: `maelstrom[name]`.

- <h4>plugin</h4>
<table>
<tr><td>Type</td><td><code>function</code>, <code>object</code> or <code>string</code></td></tr>
</table>
A plugin to add to maelstrom.


[api-maelstrom-init]: #maelstrominitgulp-addtasks-customconfig
[api-maelstrom-task]: #maelstromtasktaskname-options
[api-maelstrom-watch]: #maelstromwatchtaskname-extrafiles-extratasks
[api-maelstrom-extend]: #maelstromextendname-plugin
