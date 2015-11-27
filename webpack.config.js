/**
 * @file webpack配置文件
 * @author Franck Chen(chenfan02@baidu.com)
 */

var path = require('path');

module.exports = {
    // 源文件代码根目录
    context: path.join(__dirname, '/public/src'),
    // 需要打包的源文件，注意是不需要.js后缀的
    entry: {
        'interfaceList/main': './interfaceList/main',
        'responseSurvey/main': './responseSurvey/main',
        'jsonViewer/main': './jsonViewer/main'
    },
    // 输出
    output: {
        // 输出路径
        path: path.join(__dirname, '/public/asset'),
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
        /**
         * 依赖
         */
        alias: {
            jQuery: 'jquery/dist/jquery.min',
            angular: 'angular/angular.min',
            // 不想找麻烦就别用npm装semantic
            semantic: 'semantic/dist/components',
            ace: 'lib/ace/ace',
            validator: 'validator/validator.min'
        }
    },
    noParse: [
        'jQuery',
        'angular',
        'validator'
    ]
};
