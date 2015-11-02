var config       = require('../config');
if(!config.tasks.jshint) return;

var gulp         = require('gulp');
var browserSync  = require('browser-sync');
var path         = require('path');
var jshint       = require('gulp-jshint');
var stylish       = require('jshint-stylish');
var gutil = require("gulp-util");

var paths = {
  src: path.join(config.root.src, config.tasks.jshint.src, '/**/*.{' + config.tasks.jshint.extensions + '}'),
  propFile: path.join(config.root.src, config.tasks.jshint.props)
};

var jshintTask = function () {
  return gulp.src(paths.src)
      .pipe(jshint(paths.propFile)
          .on('error', gutil.log))
      .pipe(jshint.reporter('jshint-stylish')
          .on('error', gutil.log))
      .pipe(jshint.reporter('fail')
          .on('error', gutil.log))
      .pipe(notify(function(file) {
        return "JSHint passed: " + file.relative;
      }));
};

gulp.task('jshint', jshintTask);
module.exports = jshintTask;
