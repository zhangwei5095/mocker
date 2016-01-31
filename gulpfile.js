/**
 * @file gulp构建配置
 * @author Franck Chen(chenfan02@baidu.com)
 */

var gulp = require('gulp');
var webpack = require('webpack-stream');
var less = require('gulp-less');

/**
 * 执行webpack构建js文件
 */
gulp.task('webpack', function () {
    // 项目中规定入口文件只有一个 -- index.js
    return gulp.src('./public/src/**/index.jsx')
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(gulp.dest('./public/asset'));
});

/**
 * 编译less任务
 */
gulp.task('less', function () {
    return gulp.src('./public/src/**/*.less', {base: './public/src'})
        .pipe(less())
        .pipe(gulp.dest('./public/asset'));
});

/**
 * 移动附加内容任务
 */
gulp.task('moveAsset', function () {
    return gulp.src('./public/src/**/fonts/*.*', {base: './public/src'})
        .pipe(gulp.dest('./public/asset'));
});

/**
 * 样式构建任务
 */
gulp.task('style', ['less', 'moveAsset']);

/**
 * 构建任务
 */
gulp.task('build', ['webpack']);

/**
 * 默认任务
 */
gulp.task('default', ['webpack']);
