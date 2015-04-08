##Documentation
- [Requirements][docs-requirements]: What software, packages and gems are required?
- [Config][docs-config]: All available config options described and explained.
- [API][docs-api]: Want to know how to use the maelstrom functions?
- [Plugins][docs-plugins]: Detailed descriptions for all default maelstrom plugins.
- [Tasks][docs-tasks]: More info about maelstrom's default gulp tasks.
[< Back to Readme](../)

--------------------------------------------------------------------------------


#Available tasks
- Sass
- Images
- Icons


####`gulp sass [--compiler <libsass|ruby>] [--dev] [--prod]`

#####_--dev_
> Type: `boolean`

> Default: `0`

> Values: `0` or `1`

This flag indicates if the compiled CSS file should not be minified. The default value is `1`, an optional value of `0` can be used, wich disables minifying the output file.

#####_--prod_
> Type: `boolean`

> Default: `0`

> Values: `0` or `1`


####`gulp images [--optimize][ --resize][ --quality]`
#####_--optimize_
> Type: `boolean`

> Default: `1`

> Values: `0` or `1`

Optimize images with _imagemin_.

#####_--resize_
> Type: `number`

> Default: `0`

> Format: `width`x`height`

Resizes the images to the specified width and height values. This can be either a pixel value like `300x200` to resize to a fixed size. Or a percentage like `50%` or `60%x40%` to scale the width and height according to the given percentag.

#####_--quality_
> Type: `number`

> Default: `1`

> Values: a number from `1` to `100`.

Specify the image quality. A higher number means better quality, but also a larger file size.


####`gulp icons`
Combineert SVGs en maakt of font bestanden, of een grote SVG sprite. In beide gevallen wordt een Sass import bestand aangemaakt in de `assets/scss/` map. Vervolgens wordt een evt. gegenereerd SVG bestand geoptimaliseerd.

[docs-requirements]: requirements.md
[docs-config]: config.md
[docs-api]: api.md
[docs-plugins]: plugins.md
[docs-tasks]: tasks.md
