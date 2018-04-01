app.controller('DashboardCtrl', ['$rootScope', '$scope', 'dataDashboard', '$state', 'CommonQuery', 'toaster',
    function ($rootScope, $scope, dataDashboard, $state, CommonQuery, toaster) {
        //初始化加载数据
        $scope.loadData = function () {
            //console.log($rootScope.sideBarList)
            //获取菜单数据
            $.ajax({
                url: '../adminjson/dashboard.menutreeAll.json',
                async: false,
                type: 'GET',
                //ata: {parentid: 0},
                success: function (data) {
                    console.log(data);
                    angular.forEach(data, function (value) {
                        if (value.childList.length > 0) {
                            angular.forEach(value.childList, function (e) {
                                if (e.funcode.indexOf('^') > -1) {
                                    e.gosub = true
                                }
                            })
                        }
                    });
                    $scope.menu = data;
                }
            });

        };//loadData end

        $scope.formatDate = function (date, dateFormat) {
            return CommonQuery.formatDate(date, dateFormat);
        };

        $scope.go = function (state) {
            console.log(state);
            if(state.isrole){
                $state.go('app.' + state.funcode)
            }else{
                toaster.pop('error','当前用户权限不足')
            }
        };
        $scope.gosub = function (item) {
            console.log(item);
            var url = 'app.subMenu' + item.funcode;
            var param = item.funid;
            if(item.isrole){
                $state.go(url, {param: param, menucode: item.funid, form: false})
            }else{
                toaster.pop('error','当前用户权限不足')
            }
        };
        $scope.filterfun = function (e) {
            return e.funcode !== 'dashboard'
        };

        $scope.jump = function (id, funcode) {
            //console.log(id)
            $.ajax({
                url: './sys/function/checkrole',
                async: false,
                type: 'GET',
                data: {funid: id},
                success: function (data) {
                    //console.log(data)
                    if (data.success === false) {
                        toaster.pop('error', data.msg);
                    } else {
                        var url = 'app.subMenu' + funcode;
                        var paramid = id;
                        $state.go(url, {param: paramid, menucode: paramid, form: false})
                        //$state.go('app.subMenu',{param:id})
                    }
                }
            })
        }
    }]);