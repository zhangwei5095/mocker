/**
 * @file mock平台，接口响应总览代码页js
 * @author Franck Chen(chenfan02@baidu.com)
 * @date 2015-11-15
 */

// 第三方库
var angular = require('exports?angular!angular');

// 注册angular程序
var responseSurvey = angular.module('responseSurvey', []);

// angular app主controller,也是唯一的
responseSurvey.controller('main', function ($scope, $http, $location) {
    // 获取通过hash传递而来的参数
    var hashData = $location.search();

    // 这个接口的id
    $scope.interfaceId = hashData.interfaceId;
    // 这个接口的地址
    $scope.interfaceURL = hashData.interfaceURL;

    // 这个controller的数据用于解决子作用域问题,父子作用域得以联动
    var controllerData = $scope.controllerData = {};

    // 启用的响应是否发生了变化，首屏打开时肯定是没有
    $scope.activeResNotChanged = true;

    // 获取接口地址集合
    $scope.getResponseData = function () {
        $http
            .post(
                '/admin/getResponseList',
                {
                    interfaceId: $scope.interfaceId
                }
            )
            .then(
                function (e) {
                    var data = e.data;

                    controllerData.responseDataCollection = data.responseData;
                    // 目前启用的响应的id，没有则是个空字符串
                    controllerData.activeResponseId = data.activeResponseId;

                    // 填充是否激活标志位，用于渲染
                    controllerData.responseDataCollection.forEach(function (responseData) {
                        responseData.isActive = (responseData._id === controllerData.activeResponseId);
                    });
                }
            );
    };

    /**
     * 启用响应checkbox变化时的处理函数，启动对应的响应，关闭其他的
     *
     * @param {Object} responseData checkbox对应的响应的数据
     */
    $scope.changeActiveResponse = function (responseData) {
        // 响应数据
        var responseDataCollection = controllerData.responseDataCollection;

        // 启用的响应发生了变化，保存按键将启用
        $scope.activeResNotChanged = false;

        // 修改激活的响应
        $scope.activeResponseId = responseData.isActive ? responseData._id : '';

        // 启用选中的，关闭其他的，注意自身如果处于启用状态，则应该可以关闭
        responseDataCollection.forEach(function (data) {
            // 不能用 data.isActive === (data._id !== responseData._id)
            if (data._id !== responseData._id) {
                // 其他的需要关闭
                data.isActive = false;
            }
        });
    };

    /**
     * 向后端发送请求，更新启用的响应
     */
    $scope.updateActiveRes = function () {
        $http
            .post(
                'admin/setActiveResponse',
                {
                    // 接口id
                    interfaceId: $scope.interfaceId,
                    // 要启用的响应的id,如果是空则表示禁用所有响应
                    responseId: $scope.activeResponseId
                }
            )
            .then(
                function () {
                    // 保存成功后，置灰保存按键
                    $scope.activeResNotChanged = true;
                }
            );
    };

    // TODO 优化
    $scope.deleteResponse = function (responseId) {
        $http
            .post(
                'admin/deleteResponse',
                {
                    responseId: responseId
                }
            )
            .then(
                function (e) {
                    // TODO 判断status
                    $scope.getResponseData();
                }
            );
    };

    $scope.getResponseData();
});
