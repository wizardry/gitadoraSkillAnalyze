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
    root: [__dirname]
  });
});

var jade = require('gulp-jade');
 
gulp.task('jade', function() {
 
  gulp.src('*.jade')
    .pipe(jade({
      jade: jade,
      pretty:false
    }))
    .pipe(gulp.dest('./guild/'));
});
// copy image files
gulp.task('copy:_img', function(){
  g.src(srcPath+'img/**/')
    .pipe(gulp.dest('./build/img/'));
});


gulp.task('watch', function () {
    gulp.watch('./src/**/*.js', ['webpack']);
});
 
gulp.task('default', ['webpack','watch','jade']);