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

        // 获取接口地址集合
        $scope.getResponseData = function () {
            $http
                .post(
                    'getResponseList',
                    {
                        interfaceId: $scope.interfaceId
                    }
                )
                .then(
                    function (e) {
                        $scope.responseData = e.data.responseData;
                    }
                );
        };

        $scope.getResponseData();
    });

    angular.bootstrap(document, ['responseSurvey']);
});
