// If your code is written in es6, use the 'npm run doc' command instead.
//

var config       = require('../config');
if(!config.tasks.jsdoc) return;

var gulp         = require('gulp');
var path         = require('path');
var jsdoc = require("gulp-jsdoc");
var handleErrors = require('../lib/handleErrors');

var paths = {
    src:  path.join(config.root.src, config.tasks.jsdoc.src, '/**/*.{' + config.tasks.jsdoc.extensions + '}'),
    dest: path.join(config.root.qualityRoot, config.tasks.jsdoc.dest)
};

var jsdocTask = function () {
    return gulp.src(paths.src)
        .pipe(jsdoc(paths.dest))
        .on('error', handleErrors);
};

gulp.task('jsdoc', jsdocTask);
module.exports = jsdocTask;
