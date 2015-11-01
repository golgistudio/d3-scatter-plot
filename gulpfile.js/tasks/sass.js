var config       = require('../config')
if(!config.tasks.sass) return

var gulp         = require('gulp')
var browserSync  = require('browser-sync')
var sass         = require('gulp-sass')
var sourcemaps   = require('gulp-sourcemaps')
var handleErrors = require('../lib/handleErrors')
var autoprefixer = require('gulp-autoprefixer')
var path         = require('path')

var paths = {
  src: path.join(config.root.src, config.tasks.sass.src, '/**/*.{' + config.tasks.sass.extensions + '}'),
  dest: path.join(config.root.dest, config.tasks.sass.dest)
}

var sassTask = function () {
  return gulp.src(paths.src)
    .pipe(sourcemaps.init())
    .pipe(sass(config.tasks.sass.sass))
    .on('error', handleErrors)
    .pipe(autoprefixer(config.tasks.sass.autoprefixer))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.dest))
    .pipe(browserSync.stream())
}

gulp.task('sass', sassTask)
module.exports = sassTask
