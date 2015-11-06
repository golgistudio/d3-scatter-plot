'use strict';

var config       = require('../config');
if(!config.tasks.bundle) return;

var watchify = require('watchify');
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');
var path        = require('path');

var paths = {
    src: path.join(config.root.src, config.tasks.bundle.start),
    bundleFileName:  config.tasks.bundle.bundleFileName,
    dest: path.join(config.root.dest, config.tasks.bundle.dest)
};

// add custom browserify options here
var customOpts = {
    entries: paths.src,
    debug: true
};
var opts = assign({}, watchify.args, customOpts);
//var b = watchify(browserify(opts));
var b = browserify(opts);

// add transformations here
// i.e. b.transform(coffeeify);

b.on('update', bundleTask); // on any dep update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal

function bundleTask() {
    return b.bundle()
        // log errors if they happen
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source(paths.bundleFileName))
        // optional, remove if you don't need to buffer file contents
        .pipe(buffer())
        // optional, remove if you dont want sourcemaps
        .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
        // Add transformation tasks to the pipeline here.
        .pipe(sourcemaps.write('./')) // writes .map file
        .pipe(gulp.dest(paths.dest));
}

gulp.task('bundle', bundleTask);
module.exports = bundleTask;
