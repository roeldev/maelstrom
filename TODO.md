##High priority
####`gulp icons`
Create icon fonts from SVG files in `src.icons`. The sprite option has low priority.

####`gulp jslint`
Check all `src.js` JavaScript files for errors/problems with _jshint_ and check styleguide with _jscs_.


##Medium priority
####`gulp clean`
Clean all *dest* related dirs. Remove all temp files (like Thumbs.db, .DS_Store, error logs etc.).

####`gulp default`
Execute the `clean` task. Then execute all tasks wich write files to the *dest* dirs. These are tasks like `sass`, `images` and `icons`. The *dest* only contain 'fresh' files.

####`gulp datauri`
Watch the CSS files in dest. Filter the images <= 5kb in these files. Base64 encode these images and save the output to a src.datauri folder. Create a _datauri.scss import file with placeholders from the base64 encoded files. Show message to developer so he/she can update their CSS by extending the placeholder.

####`gulp phpunit`
Add phpunit support.

####`gulp phpspec`
Add phpspec support.

####`gulp screenshot`
Create screenshots with _pageres_ and save them to a *temp*  folder.


##Low priority
####`gulp favicon`
Convert a favicon image (jpg, png, gif or SVG) to favicon.ico and other specified favicons.

####`gulp coffee`
Compile CoffeeScript files to JavaScript, concat and minify.

####`gulp icons --type sprite`
Create a sprite from the SVG icons instead of the default icon font.

-------------

##Todo's and near future support
- clean - clean the public and temp folders and remove unnecessary files (like Thumbs.db and .DS_Store)
- sync:start - start browser-sync server/proxy
- sync:reload - reload browser-sync browsers
- datauri - css bestanden in de gaten houden, vervolgens alle src(.*) strings nalopen en afbeeldingen hierin van <= 5kb apart opslaan als base64 encoded strings in /assets/datauri/filename.txt. Vervolgens Sass import bestand maken met placeholders met deze data adhv. template.
- flags - vlaggen van alle landen als svg in assets/flags/. via config aangeven welke vlaggen gebruiken. vlaggen worden als sprite opgeslagen.
- watch --task <task> - watch specifieke task

##Distant future support
- Less
- Stylus
- CoffeeScript
- TypeScript
- Jade
- Haml
