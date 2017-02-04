/**
 * @author Jagoba Pérez <jagobapg@protonmail.com>
 */

'use strict';

var gulp = require('gulp'),
    fs = require('fs'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    source = require('vinyl-source-stream'),
    livereload = require('gulp-livereload'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    uglifyCss= require('gulp-uglifycss'),
    buffer = require('vinyl-buffer'),
    uglifyJs = require('gulp-uglify'),
    scssLint = require('gulp-scss-lint'),
    image = require('gulp-imagemin'),
    plumber = require('gulp-plumber'),
    rollup = require('rollup-plugin-replace'),
    replace = require('gulp-replace');

var paths = {
    // JS core files
    jsSrc: 'app/js/**/*.js',
    jsEntry: 'app/js/index.js',
    jsBuiltFile: 'app.min.js',
    jsBuilt: 'static/js',

    // SCSS files
    scssSrc: 'app/scss/**/*.scss',
    scssEntry: 'app/scss/index.scss',
    scssBuiltFile: 'app.min.css',
    scssBuilt: 'static/css',

    // image files
    imagesSrc: 'app/images/**/*',
    imagesProc: 'static/images',

    // font files
    fontFiles: 'app/fonts/**/*',
    fontProc: 'static/fonts',
};

var dependencies = [
    paths.dependencies + '/fetch/lib/fetch.js',
]

function onError(err) {
    console.log(err);
    this.emit('end');
}

gulp.task('js', function () {
    return browserify(paths.jsEntry)
        .transform('babelify', {presets: ['es2015', 'react']})
        .bundle()
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(source(paths.jsBuiltFile))
        .pipe(buffer())
        .pipe(gulp.dest(paths.jsBuilt));
});

gulp.task('js-prod', function () {
    process.env.NODE_ENV = 'production';
    
    return browserify(paths.jsEntry)
        .transform('babelify', {presets: ['es2015', 'react']})
        .bundle()
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(source(paths.jsBuiltFile))
        .pipe(buffer())
        .pipe(uglifyJs())
        .pipe(gulp.dest(paths.jsBuilt));
});

gulp.task('scss', function () {
    return gulp.src(paths.scssSrc)
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(scssLint())
        .pipe(sass())
        .pipe(concat(paths.scssBuiltFile))
        .pipe(gulp.dest(paths.scssBuilt))
});

gulp.task('scss-prod', function () {
    return gulp.src(paths.scssSrc)
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(sass())
        .pipe(concat(paths.scssBuiltFile))
        .pipe(uglifyCss({
            'maxLineLen': 80,
            'uglyComments': true
        }))
        .pipe(gulp.dest(paths.scssBuilt))
});

gulp.task('images', function() {
    return gulp.src(paths.imagesSrc)
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(image())
        .pipe(gulp.dest(paths.imagesProc));
});

gulp.task('fonts', function() {
    return gulp.src(paths.fontFiles)
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(gulp.dest(paths.fontProc));
});

gulp.task('watch', ['scss', 'js'], function() {
    livereload.listen();
    gulp.watch(paths.scssSrc, ['scss']);
    gulp.watch(paths.jsSrc, ['js']);
});
gulp.task('default', ['scss', 'js', 'images', 'fonts']);
gulp.task('prod', ['scss-prod', 'js-prod', 'images', 'fonts']);
