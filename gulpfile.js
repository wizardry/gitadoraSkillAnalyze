
var gulp = require('gulp');
var connect = require('gulp-connect');
var webpack = require('gulp-webpack');
var webpackConfig = require('./webpack.config.js');
 
gulp.task('webpack', function () {
    gulp.src(['./src/js/**/*.js'])
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('./build/js'));
});
 
gulp.task('connect', function() {
  connect.server({
    root: './build/'
  });
});

var jade = require('gulp-jade');
 
gulp.task('jade', function() {
 
  gulp.src('./src/**/*.jade')
    .pipe(jade({
      pretty:false
    }))
    .pipe(gulp.dest('./build/'));
});
// copy image files
gulp.task('copy:_img', function(){
  g.src('./src/img/**/')
    .pipe(gulp.dest('./build/img/'));
});

var sass = require('gulp-sass');
 
gulp.task('sass', function () {
  return gulp.src('./src/css/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./build/css'));
});

gulp.task('watch', function () {
    gulp.watch('./src/**/*.jade',['jade']);
    gulp.watch('./src/css/**/*.scss',['sass']);
    gulp.watch('./src/**/*.js', ['webpack']);
});
 
gulp.task('default', ['webpack','watch','connect']);