app.controller('subMenuCtrl', ['$rootScope', '$scope', '$state', 'toaster', 'commonTools', '$http',
    function ($rootScope, $scope, $state, toaster, commonTools, $http) {
        commonTools.getSubMenu().then(function (data) {
            $scope.funList = data
        });
        $scope.jump = function (id, url) {
            $http({
                method: 'GET',
                url: '../sys/function/checkrole',
                params: {
                    'funid': id
                }
            }).then(function successCallback(res) {
                // 请求成功执行代码
                var data = res.data;
                if (data.success === false) {
                    toaster.pop('error', data.msg);
                } else {
                    $state.go(url)
                }
            }, function errorCallback(res) {
                // 请求失败执行代码
                var data = res.data;
                toaster.pop('error', data.msg);
            });
        }
    }
]);