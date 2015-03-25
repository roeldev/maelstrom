#maelstrom-js
**A collection of Gulp tasks. Work in progress.**

##Installation
```
npm install --save maelstrom
```

##How to use

##Sample `maelstrom.json`
```js
var gulp = require('gulp'),
    maelstrom = require('maelstrom)(gulp);
```

##Available Gulp tasks
###Sass###
```
gulp sass --compiler <_libsass|ruby_> *--dev**
```
Compile Sass bestanden dmv. _libsass_ of _Ruby_ (default in te stellen via config, of anders via parameter). Wanneer niet *dev*, de output door _autoprefixer_ en _minifycss_.

###Images###
```
gulp images
```
Optimaliseer afbeeldingen dmv. _imagemin_.

```
gulp images:resize –-size <_width_x_height_> --quality <_quality_> --dir <_dir_>
```
Verkleint de afbeeldingen in map *dir* volgens de opgegeven *width* x *height* en/of *quality* parameter.

###Icons###
```
gulp icons –-create <_font|sprite_>
```
Combineert SVGs en maakt of font bestanden, of een grote SVG sprite. In beide gevallen wordt een Sass import bestand aangemaakt in de `assets/scss/` map. Vervolgens wordt een evt. gegenereerd SVG bestand geoptimaliseerd.

##Todo's and near future support
- clean - clean the public and temp folders and remove unnecessary files (like Thumbs.db and .DS_Store)
- sync:start - start browser-sync server/proxy
- sync:reload - reload browser-sync browsers
- datauri - css bestanden in de gaten houden, vervolgens alle src(.*) strings nalopen en afbeeldingen hierin van <= 5kb apart opslaan als base64 encoded strings in /assets/datauri/filename.txt. Vervolgens Sass import bestand maken met placeholders met deze data adhv. template.

##Distant future support
- Less
- Stylus
- CoffeeScript
- TypeScript
- Jade
- Haml
