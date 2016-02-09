/**
 * @file gulp构建配置
 * @author Franck Chen(chenfan02@baidu.com)
 */

// 原生模块
var fs = require('fs');
var path = require('path');

// 第三方
var gulp = require('gulp');
var webpack = require('webpack-stream');
var less = require('gulp-less');
var name = require('vinyl-named');

var srcDirGlob = './public/src/**/';
var srcDir = './public/src/';

var webpackConfig = require('./webpack.config.js');

/**
 * 前端模块集合
 * @type {Array}
 */
var modules = fs.readdirSync('./public/src');

/**
 * 移除文件的后缀名
 *
 * @param {string} fileName 文件名
 * @return {string} 移除后缀后的文件名
 */
var removeExtension = function (fileName) {
    return fileName.substr(0, fileName.lastIndexOf('.')) || fileName;
};

/**
 * 执行webpack构建js文件
 */
gulp.task('webpack', function () {

    // 项目中规定入口文件只有一种形式main.jsx
    return gulp.src(srcDirGlob + 'main.jsx', {base: srcDir})
        .pipe(name(function (file) {
            // webpack entry point
            return removeExtension(file.relative);
        }))
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest('./public/asset/'));
});

/**
 * 编译less任务
 */
gulp.task('less', function () {
    return gulp.src(srcDirGlob + 'main.less', {base: srcDir})
        .pipe(less())
        .pipe(gulp.dest('./public/asset'));
});

/**
 * 移动附加内容任务
 */
gulp.task('moveAsset', function () {
    return gulp.src(srcDirGlob + 'fonts/*.*', {base: srcDir})
        .pipe(gulp.dest('./public/asset'));
});

/**
 * 样式构建任务
 */
gulp.task('style', ['less', 'moveAsset']);

/**
 * 构建任务
 */
gulp.task('build', ['webpack', 'style']);

/**
 * 默认任务
 */
gulp.task('default', ['webpack', 'style']);

/**
 * 开发时用的监控、增量构建任务
 */
var jsFiles = [
    '*.es6', '*.js', '*.jsx'
];
var jsFilesGlob = jsFiles.map(function (pattern) {
    return srcDirGlob + pattern;
});
gulp.task('dev', function () {
    gulp.watch(jsFilesGlob, function (e) {
        var filePath = e.path;
        var glob = '';
        var i = 0;
        var len = 0;
        var module = '';

        for (i = 0, len = modules.length; i < len; i++) {
            module = modules[i];

            // 变化的js文件能够匹配上所述的模块，则生成glob
            if (filePath.indexOf(module) >= 0) {
                glob = path.join(srcDir, module) + '/**/main.jsx';

                break;
            }
        }

        if (glob) {
            console.log(module + '模块JS代码发生变化，准备开始构建...');

            gulp.src(glob, {base: srcDir})
                .pipe(name(function (file) {
                    // webpack entry point
                    return removeExtension(file.relative);
                }))
                .pipe(webpack(webpackConfig))
                .pipe(gulp.dest('./public/asset/'));
        }
    });
});
