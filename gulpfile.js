/**
 * @file gulp构建配置
 * @author Franck Chen(chenfan02@baidu.com)
 */

// 原生模块
var fs = require('fs-extra');
var path = require('path');

// 第三方
var gulp = require('gulp');
var gUtil = require('gulp-util');

// 处理器
var webpack = require('webpack-stream');
var less = require('gulp-less');
var name = require('vinyl-named');
var cssNano = require('gulp-cssnano');
var uglify = require('gulp-uglify');

var srcDirGlob = './public/src/**/';
var srcDir = './public/src/';
var assetDir = './public/asset/';

// webpack配置
var webpackConfig = require('./webpack.config.js');

/**
 * 获取前端模块集合
 *
 * @return {Array} 前端模块名称集合
 */
var getModules = function () {
    return fs.readdirSync('./public/src');
};

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
 * 构建全部JS文件的回调函数
 *
 * @return {Stream}
 */
var buildAllJS = function () {

    // 项目中规定入口文件只有一种形式main.jsx
    return gulp.src(srcDirGlob + 'main.jsx', {base: srcDir})
        .pipe(
            name(function (file) {
                // webpack entry point
                return removeExtension(file.relative);
            })
        )
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest(assetDir));
};

/**
 * 执行webpack构建js文件
 */
gulp.task('webpack', buildAllJS);

/**
 * 编译less任务
 */
gulp.task('less', function () {
    return gulp.src(srcDirGlob + 'main.less', {base: srcDir})
        .pipe(less())
        .pipe(gulp.dest(assetDir));
});

/**
 * 移动附加内容任务
 */
gulp.task('moveAsset', function () {
    return gulp.src(srcDirGlob + 'fonts/*.*', {base: srcDir})
        .pipe(gulp.dest(assetDir));
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
 * 获取匹配入口文件的信息
 *
 * @param {string} filePath 变化的文件的路径
 * @param {string} entryFileName 入口文件名
 * @return {Object}
 */
var getEntryFileInfo = function (filePath, entryFileName) {
    var glob = '';
    var i = 0;
    var len = 0;
    var module = '';
    // 获取模块
    var modules = getModules();

    for (i = 0, len = modules.length; i < len; i++) {
        module = modules[i];
        var relativePath = path.relative(srcDir, filePath);

        // 变化的js文件能够匹配上所属的模块，则生成glob
        if (relativePath.indexOf(module) === 0) {
            glob = path.join(srcDir, module) + '/**/' + entryFileName;

            break;
        }
    }

    return {
        moduleName: module,
        glob: glob
    };
};

/**
 * 根据前端资源文件路径推算出该文件所属的模块
 *
 * @param {string} filePath 文件路径
 * @return {string} 模块名
 */
var getModuleName = function (filePath) {
    var relativePath = path.relative(srcDir, path.resolve(filePath));

    return relativePath.split('/')[0];
};

/**
 * webpack 实时监控任务
 */
gulp.task('webpack-watch', function () {
    try {
        gulp.src(srcDirGlob + 'main.jsx', {base: srcDir})
            .pipe(
                name(function (file) {
                    // webpack entry point
                    return removeExtension(file.relative);
                })
            )
            .pipe(
                webpack(Object.assign({}, webpackConfig, {watch: true}))
            )
            .pipe(gulp.dest(assetDir));
    }
    catch (e) {
        gUtil.log('Error Catch');
    }
});

/**
 * 开发时用的监控、增量构建任务
 */
gulp.task('dev', ['style', 'webpack-watch'], function () {
    // 样式实时构建
    gulp.watch(srcDirGlob + 'css/*', function (e) {
        // 发生变化的文件的路径
        var filePath = e.path;
        // 发生变化的文件的后缀
        var extName = path.extname(filePath);
        // 发生变化的文件在静态资源目录下的相对路径
        var relativePath = path.relative(srcDir, e.path);

        // common忽略
        if (relativePath.indexOf('common') === 0) {
            return;
        }

        // 如果变化的是less文件，则编译
        if (extName === '.less') {
            // 发生变化的文件在静态资源目录下的相对路径
            var entryFileInfo = getEntryFileInfo(filePath, 'main.less');

            if (entryFileInfo.glob) {
                gUtil.log(gUtil.colors.magenta(entryFileInfo.moduleName) + '模块样式文件发生变化，准备开始构建...');

                try {
                    // 编译入口less文件
                    gulp.src(entryFileInfo.glob, {base: srcDir})
                        .pipe(less())
                        .pipe(gulp.dest(assetDir))
                        .on('end', function () {
                            gUtil.log('样式编译完成');
                        });
                }
                catch (e) {
                    gUtil.log('构建发生错误');
                }
            }
        }
        else {
            // 所属模块的名称
            var moduleName = getModuleName(filePath);

            // 如果发生变化的是其他资源，则移动
            gUtil.log(gUtil.colors.magenta(moduleName) + '模块样式相关文件发生变化，准备开始构建...');

            // 移动
            gulp.src(path.join(srcDir, moduleName, 'css/font/*'), {base: srcDir})
                .pipe(gulp.dest(assetDir))
                .on('end', function () {
                    gUtil.log('文件移动完成');
                });
        }
    });
});

/**
 * 生成环境构建任务
 */
gulp.task('product', function () {
    // 首先要清空asset目录，保证干净
    fs.remove(assetDir, function (err) {
        if (err) {
            gUtil.log('Build failed, can not remove assets!');
            return;
        }

        // css
        gulp.src(srcDirGlob + 'main.less', {base: srcDir})
            .pipe(less())
            .pipe(cssNano())
            .pipe(gulp.dest(assetDir));

        // js
        var productWebpackConfig = Object.assign({}, webpackConfig);
        delete productWebpackConfig.devtool;
        gulp.src(srcDirGlob + 'main.jsx', {base: srcDir})
            .pipe(
                name(function (file) {
                    // webpack entry point
                    return removeExtension(file.relative);
                })
            )
            .pipe(webpack(productWebpackConfig))
            .pipe(uglify({mangle: true}))
            .pipe(gulp.dest(assetDir));

        // others
        gulp.src(srcDirGlob + 'fonts/*.*', {base: srcDir})
            .pipe(gulp.dest(assetDir));
    });
});
