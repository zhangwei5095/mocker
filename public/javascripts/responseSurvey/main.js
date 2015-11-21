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

        // 这个controller的数据用于解决子作用域问题
        $scope.controllerData = {
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

                        $scope.responseData = data.responseData;
                        // 目前启用的响应的id，没有则是个空字符串
                        $scope.controllerData.activeResponseId = data.activeResponseId;
                    }
                );
        };

        $scope.getResponseData();
    });

    // 启动angular app
    angular.bootstrap(document, ['responseSurvey']);
});
