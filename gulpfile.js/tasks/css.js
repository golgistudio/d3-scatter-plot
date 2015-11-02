var config       = require('../config');
if(!config.tasks.css) return;

var gulp         = require('gulp');
var browserSync  = require('browser-sync');
var sourcemaps   = require('gulp-sourcemaps');
var handleErrors = require('../lib/handleErrors');
var autoprefixer = require('gulp-autoprefixer');
var path         = require('path');

var paths = {
  src: path.join(config.root.src, config.tasks.css.src, '/**/*.{' + config.tasks.css.extensions + '}'),
  dest: path.join(config.root.dest, config.tasks.css.dest)
};

var cssTask = function () {
  console.log(paths.src);
  console.log(paths.dest);
  return gulp.src(paths.src)
    .on('error', handleErrors)
    .pipe(autoprefixer(config.tasks.css.autoprefixer))
    .pipe(gulp.dest(paths.dest))
    .pipe(browserSync.stream())
};

gulp.task('css', cssTask);
module.exports = cssTask;
