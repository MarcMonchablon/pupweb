var gulp = require("gulp");
var gutil = require("gulp-util");
var concat = require("gulp-concat");
var rename = require("gulp-rename");

var connect = require("gulp-connect");
gulp.task('webserver', function() {
    connect.server({
	root: 'site',
	port: 8111,
	livereload: true
    });
});


var browserify = require('browserify');
var source = require('vinyl-source-stream');
gulp.task('browserify', function() {
    var bundleStream = browserify('./site/main.js', {debug: true}).bundle();

    bundleStream
//	.on('error', gutil.log.bind(gutil, 'Browserify Error'))
	.pipe(source('./site/main.js'))
	.pipe(rename('bundle.js'))
	.pipe(gulp.dest('./site'));
});

var jade = require("gulp-jade");
gulp.task('jade', function() {
    gulp.src('site/**/*.jade')
    .pipe(jade({pretty: true}))
    .pipe(gulp.dest('site/'))
    .pipe(connect.reload());
});



var stylus = require("gulp-stylus");

gulp.task('stylus', function() {
    gulp.src('site/**/*.styl')
    .pipe(stylus())
    .pipe(concat('main.css'))
    .pipe(gulp.dest('site/css/'))
    .pipe(connect.reload());
});


gulp.task('watch', function() {
    gulp.watch('site/**/*.jade', ['jade']);
    gulp.watch('site/**/*.styl', ['stylus']);
    gulp.watch('site/**/*.js', ['browserify']);
});



gulp.task('default', ['jade', 'stylus', 'browserify', 'webserver', 'watch']);
