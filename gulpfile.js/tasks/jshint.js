var config       = require('../config');
if(!config.tasks.jshint) return;

var gulp         = require('gulp');
var browserSync  = require('browser-sync');
var path         = require('path');
var jshint       = require('gulp-jshint');
var stylish       = require('jshint-stylish');
var handleErrors = require('../lib/handleErrors');

var notify = require('gulp-notify');

var paths = {
    src: path.join(config.root.src, config.tasks.jshint.src, '/**/*.{' + config.tasks.jshint.extensions + '}'),
    propFile: path.join(config.root.src, config.tasks.jshint.props)
};

var jshintTask = function () {
    return gulp.src(paths.src)
        .pipe(jshint(paths.propFile, {fail: true}))
        .pipe(jshint.reporter(stylish))
        .pipe(jshint.reporter('fail'))
        .on('error', handleErrors);
};

gulp.task('jshint', jshintTask);
module.exports = jshintTask;
