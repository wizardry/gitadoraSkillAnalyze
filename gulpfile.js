
var gulp = require('gulp');
var gutil = require('gutil');
var connect = require('gulp-connect');
// var webpack = require('gulp-webpack');
var webpack = require('webpack');
var webpackDevServer = require("webpack-dev-server");
var webpackConfig = require('./webpack.config.js');
 console.log(webpackConfig)
gulp.task('webpack',function(){
  webpack(webpackConfig);
});
 //  use gulp-webpack
// gulp.task('webpack', function () {
//     gulp.src(['./src/js/**/*.js'])
//     .pipe(webpack(webpackConfig))
//     .pipe(gulp.dest('./build/js'));
// });

gulp.task("webpack-dev-server", function(callback) {
    // Start a webpack-dev-server
    var compiler = webpack(webpackConfig);

    return new webpackDevServer(compiler, {
      contentBase: './build',
      publicPath:'/js/',
      cache:false,
      hot:true,
    }).listen(8080);
});
 
// gulp.task('connect', function() {
//   connect.server({
//     root: './build/'
//   });
// });

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
  gulp.src('./src/img/**/')
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
    gulp.watch('./src/img/**.*.png', ['copy:_img']);
});
 
// gulp.task('default', ['webpack','watch','connect','copy:_img']);
// gulp.task('default', ['webpack','watch','webpack-dev-server','connect','copy:_img']);
gulp.task('default', ['webpack','watch','webpack-dev-server','copy:_img']);