# gulp-wind-tpl2js

> Compile template to js string, and wrap as amd/cmd module.

## Installation

Install package with NPM and add it to your development dependencies:

`npm install --save-dev gulp-wind-tpl2js`

## Usage

```javascript
var tpl2js = require('gulp-wind-tpl2js');

gulp.task('tpl2js', function () {
    return gulp.src('./test/tpl/**/*.html')
        .pipe(tpl2js('c.js', {base: './test'}))
        .pipe(gulp.dest('./dest/'));
});
```