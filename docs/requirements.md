##Documentation
- [Requirements][docs-requirements]: What software, packages and gems are required?
- [Config][docs-config]: All available config options described and explained.
- [API][docs-api]: Want to know how to use the maelstrom functions?
- [Plugins][docs-plugins]: Detailed descriptions for all default maelstrom plugins.
- [Tasks][docs-tasks]: More info about maelstrom's default gulp tasks.
--------------------------------------------------------------------------------


#Requirements
To avoid any problems, make sure the following software is installed on your system. This pretty much avoids any problems, so you can make use of all of maelstrom's plugins.

- **[node.js][url-nodejs]**
> On Windows: make sure to install the 32-bit version!

- **[Python 2.7.x][url-python]**
> On Windows: make sure to install the 32-bit version, use the default installation location (ie. `C:\Python27`), install [Visual Studio Express 2012][url-vsx2012], and add the system variable PYTHON with value `C:\Python27\python.exe`. After that you probably need to restart your computer or sign-out and sign-in again to make sure all system vars are loaded :)

- **[Git][url-git]**
> On Windows: make sure to install with the option 'Use Git from the Windows Command Prompt', so Git is added to your PATH variable.

- **[Ruby][url-ruby]**
> On Windows: use the default installation location with the option 'Add Ruby executables to your PATH' selected.

- **Node modules:**
Make sure these npm packages are installed using the `-g` or `--global` flag:
```bash
npm install -g gulp browser-sync jshint jscs
```

- **Ruby gems:**
Install the required Ruby gems with Bundler: `bundle install`; or install them manually:
```bash
gem install compass
gem install scss-lint
```

[url-nodejs]: https://nodejs.org/download/
[url-python]: https://www.python.org/downloads/release/python-279/
[url-vsx2012]: http://go.microsoft.com/?linkid=9816758
[url-git]: http://git-scm.com/downloads
[url-ruby]: https://www.ruby-lang.org/en/documentation/installation/#rubyinstaller

[docs-requirements]: requirements.md
[docs-config]: config.md
[docs-api]: api.md
[docs-plugins]: plugins.md
[docs-tasks]: tasks.md
