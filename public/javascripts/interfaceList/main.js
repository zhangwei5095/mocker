/**
 * @file 新商桥mocker平台接口列表
 * @author Franck Chen(chenfan02@baidu.com)
 * @date 2015-10-25
 */

define(function (require) {
    // 第三方库
    var angular = require('angular');
    var $ = require('jquery');
    var validator = require('validator');

    // semantic ui组件
    require('semanticComponents/dimmer.min');
    require('semanticComponents/transition.min');
    require('semanticComponents/modal.min');

    // 添加接口模态窗口
    var addInterfaceModal = $('#add-interface-modal');

    // 注册angular程序
    var interfaceList = angular.module('interfaceList', []);

    // 记录服务器url+端口的div
    var hostPrefix = $('#host-prefix').text();
    // 地址输入框
    var URLInput = $('#url-input');

    interfaceList.controller('main', function ($scope, $http) {
        // 操作结果模态窗口参数
        $scope.opModalData = {
            modalId: 'result-modal',
            successTitle: '保存成功',
            failTitle: '保存失败'
        };

        // 获取接口地址集合
        $scope.getURLList = function () {
            $http
                .post(
                    'admin/getAllInterface',
                    {}
                )
                .then(
                    function (e) {
                        var data = e.data;

                        $scope.interfaceList = data.interfaceList;
                    }
                );
        };

        $scope.getURLList();

        // URL地址是否合理
        $scope.URLisValid = true;

        // 点击新填接口按键时弹出模态窗口
        $scope.showModal = function () {
            addInterfaceModal.modal('show');
        };

        // 点击模态窗口的确定按键时触发，校验URL地址是否合法
        $scope.validateURL = function () {
            var inputVal = URLInput.val();
            // mock地址
            var mockInterfaceURL = hostPrefix + inputVal;

            // 若果用户没有输入地址，则提示
            if (inputVal === '') {
                // 弹出错误提示
                $scope.errorTip = '地址不能为空';
                $scope.URLisValid = false;

                return;
            }

            // 校验URL是否合法
            $scope.URLisValid = validator.isURL(mockInterfaceURL);

            if (!$scope.URLisValid) {
                // 弹错误提示
                $scope.errorTip = '请输入合法的URL地址';
                $scope.URLisValid = false;

                return;
            }

            // 与后端通信，注册新接口
            var promise = $http.post(
                'admin/addInterfaceURL',
                {
                    url: inputVal
                }
            );

            // 隐藏浮窗
            addInterfaceModal.modal('hide');

            promise.then(
                function (e) {
                    if (e.data.status === 0) {
                        $scope.opModalData.result = true;
                    }
                    else {
                        $scope.opModalData.result = false;
                        $scope.opModalData.detail = e.data.statusInfo;
                    }

                    // 弹出保存结果浮窗
                    $('#result-model').modal('show');

                    // 重新获取接口数据，刷新列表
                    $scope.getURLList();
                },
                function (e) {
                }
            );
        };
    });

    angular.bootstrap(document, ['interfaceList']);
});
