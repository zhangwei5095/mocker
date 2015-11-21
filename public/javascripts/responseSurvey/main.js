/**
 * @file mock平台，接口响应总览代码页js
 * @author Franck Chen(chenfan02@baidu.com)
 * @date 2015-11-15
 */

define(function (require) {
    // 第三方库
    var angular = require('angular');

    // 注册angular程序
    var responseSurvey = angular.module('responseSurvey', []);

    responseSurvey.controller('main', function ($scope, $http, $location) {
        // 获取通过hash传递而来的参数
        var hashData = $location.search();

        // 这个接口的id
        $scope.interfaceId = hashData.interfaceId;

        // 这个controller的数据用于解决子作用域问题,父子作用域得以联动
        var controllerData = $scope.controllerData = {
            // 启用的响应是否发生了变化，首屏打开时肯定是没有
            activeResNotChanged: true
        };

        // 获取接口地址集合
        $scope.getResponseData = function () {
            $http
                .post(
                    'admin/getResponseList',
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

            // 启用选中的，关闭其他的，注意自身如果处于启用状态，则应该可以关闭
            responseDataCollection.forEach(function (data) {
                // 不能用 data.isActive === (data._id !== responseData._id)
                if (data._id !== responseData._id) {
                    // 其他的需要关闭
                    data.isActive = false;
                }
            });
        };

        $scope.getResponseData();
    });

    // 启动angular app
    angular.bootstrap(document, ['responseSurvey']);
});
