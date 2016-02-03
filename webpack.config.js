/**
 * @file webpack配置文件
 * @author Franck Chen(chenfan02@baidu.com)
 */

var path = require('path');

module.exports = {
    // 源文件代码根目录
    context: path.resolve('.'),
    // 输出
    output: {
        // 输出文件名
        filename: '[name].js'
    },
    // 依赖配置
    resolve: {
        // 依赖根路径
        root: [
            // npm
            path.resolve('./node_modules'),
            // bower,主要是为了ace和semantic 这两个npm装起来蛋疼无比的家伙
            path.resolve('./public/dep')
        ],
        alias: {
            common: path.resolve('./public/src/common')
        }
    },
    module: {
        loaders: [
            {
                test: /\.jsx$/,
                // 一定不能是loaders
                loader: 'babel',
                query: {
                    presets: ['react', 'es2015']
                }
            },
            {
                test: /\.es6$/,
                loader: 'babel',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
    noParse: [
        'jQuery',
        'angular',
        'validator'
    ],
    devtool: 'source-map'
};
