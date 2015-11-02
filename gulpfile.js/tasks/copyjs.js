var config      = require('../config');
if(!config.tasks.copyjs) return;

var browserSync = require('browser-sync');
var changed     = require('gulp-changed');
var gulp        = require('gulp');
var path        = require('path');

var paths = {
  src: path.join(config.root.src, config.tasks.copyjs.src, '/**/*.{' + config.tasks.copyjs.extensions + '}'),
  dest: path.join(config.root.dest, config.tasks.copyjs.dest)
};

var copyjsTask = function() {
  return gulp.src(paths.src)
    .pipe(changed(paths.dest)) // Ignore unchanged files
    .pipe(gulp.dest(paths.dest))
    .pipe(browserSync.stream())
};

gulp.task('copyjs', copyjsTask);
module.exports = copyjsTask;
