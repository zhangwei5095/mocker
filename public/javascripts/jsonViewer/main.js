/**
 * @file JSON编辑器页面js代码
 * @author Franck Chen(chenfan02@baidu.com)
 * @date 2015-11-19
 */

define(function (require) {
    // 依赖
    var $ = require('jquery');
    var angular = require('angular');
    var ace = require('ace/ace');

    // semantic ui组件
    require('semanticComponents/dimmer.min');
    require('semanticComponents/transition.min');
    require('semanticComponents/modal.min');

    // 配置ace
    ace.config.set('basePath', '..');
    // 生成编辑器
    var editor = ace.edit('editor');
    // 配置皮肤
    editor.setTheme('ace/theme/monokai');
    // JSON语法高亮模式
    var JsMod = require('ace/mode/json').Mode;
    editor.getSession().setMode(new JsMod());

    // 注册angular程序
    var jsonViewer = angular.module('jsonViewer', []);

    // 新添响应的地址
    var addNewURL = 'admin/addNewJSONRes';
    // 编辑响应的地址
    var editResURL = 'admin/editRes';

    // controller
    jsonViewer.controller('main', function ($scope, $http, $location) {
        // 分析hash参数
        var hashData = $location.search();

        // 接口id,这个一定有，没有就是bug
        $scope.interfaceId = hashData.interfaceId;
        // 响应id,hash参数中不一定有，没有就是新增接口
        $scope.responseId = hashData.responseId || '';

        // 操作结果模态窗口初始参数
        $scope.opModalData = {
            modalId: 'result-modal',
            successTitle: '保存成功',
            failTitle: '保存失败'
        };

        /**
         * 点击保存按键时的处理函数，主要功能是保存新建或修改的接口响应
         */
        $scope.saveData = function () {
            // ace editor的内容
            var value = editor.getValue();

            // 如果有responseId则代表这个响应已经存在，保存时更新
            if ($scope.responseId) {
                $http
                    .post(
                        editResURL,
                        {
                            responseId: $scope.responseId,
                            name: $('#response-name').val(),
                            value: value
                        }
                    )
                    .then(
                        function () {
                            // 正确状态
                            $scope.opModalData.result = true;
                            // 弹出保存结果浮窗
                            $('#' + $scope.opModalData.modalId).modal('show');
                        }
                    );
            }
            // 如果不存在responseId那么就是新建响应
            else {
                $http
                    .post(
                        addNewURL,
                        {
                            // 对应接口的id
                            interfaceId: $scope.interfaceId,
                            name: $('#response-name').val(),
                            value: value
                        }
                    )
                    .then(
                        // 新响应保存成功了
                        function (e) {
                            var data = e.data;

                            // 刷新responseId,下次保存的时候就走更新接口了
                            $scope.responseId = data.responseId;

                            // 正确状态
                            $scope.opModalData.result = true;
                            // 弹出保存结果浮窗
                            $('#' + $scope.opModalData.modalId).modal('show');
                        },
                        function () {
                            // TODO 失败提示
                        }
                    );
            }
        };
    });

    // 启动angular app
    angular.bootstrap(document, ['jsonViewer']);
});
