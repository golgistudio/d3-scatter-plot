var config       = require('../config');
if(!config.tasks.purecss) return;

var gulp         = require('gulp');
var browserSync  = require('browser-sync');
var sourcemaps   = require('gulp-sourcemaps');
var handleErrors = require('../lib/handleErrors');
var autoprefixer = require('gulp-autoprefixer');
var path         = require('path');

var paths = {
  src: path.join(config.root.src, config.tasks.purecss.src, '/**/*.{' + config.tasks.purecss.extensions + '}'),
  dest: path.join(config.root.dest, config.tasks.purecss.dest)
};

var purecss = function () {
  console.log(paths.src);
  console.log(paths.dest);
  return gulp.src(paths.src)
    .on('error', handleErrors)
    .pipe(autoprefixer(config.tasks.purecss.autoprefixer))
    .pipe(gulp.dest(paths.dest))
    .pipe(browserSync.stream())
};

gulp.task('purecss', purecss);
module.exports = purecss;
