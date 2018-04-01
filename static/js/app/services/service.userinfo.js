app.service('GetUserInfo', function ($q, $http, $stateParams) {
    this.GetUserInfo = function () {
        return $http({
            method: 'GET',
            url: 'https://www.easy-mock.com/mock/5ac06d71a5bbc64b284023ec/ssg/currentuser',
            params:{usercode:'admin'}
        }).then(function successCallback(res) {
            // 请求成功执行代码
            //console.log(eval(res.data));
            return eval(res.data)
        }, function errorCallback(res) {
            // 请求失败执行代码
            return eval(res.data)
        });
    };
});