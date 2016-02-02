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

var srcDirGlob = './public/src/**/';
var srcDir = './public/src/';

/**
 * 前端模块集合
 * @type {Array}
 */
var modules = fs.readdirSync('./public/src');

/**
 * 执行webpack构建js文件
 */
gulp.task('webpack', function () {
    // 项目中规定入口文件只有一种形式main.jsx
    return gulp.src(srcDirGlob + 'main.jsx')
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(gulp.dest('./public/asset'));
});

/**
 * 编译less任务
 */
gulp.task('less', function () {
    return gulp.src(srcDirGlob + '*.less', {base: './public/src'})
        .pipe(less())
        .pipe(gulp.dest('./public/asset'));
});

/**
 * 移动附加内容任务
 */
gulp.task('moveAsset', function () {
    return gulp.src(srcDirGlob + 'fonts/*.*', {base: './public/src'})
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
            console.log(module + '模块发生变化，准备开始构建...');
            gulp.src(glob)
                .pipe(webpack(require('./webpack.config.js')))
                .pipe(gulp.dest('./public/asset'));
        }
    });
});
