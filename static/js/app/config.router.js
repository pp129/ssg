'use strict';

app.run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {

    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

}]).config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    var states = [];
    $.ajax({
        url: '../adminjson/router.menutreelist.json',
        type: 'GET',
        async: false,
        success: function (data) {
            console.log(data);
            angular.forEach(data, function (value) {
                states.push({
                    name: "app.subMenu" + value.funcode,
                    url: "/subMenu" + value.funcode,
                    title: value.funname,
                    templateUrl: "../page/subMenu.html",
                    ncyBreadcrumb: {
                        label: value.funname,
                        description: value.funname
                    },
                    params: {
                        openType: '',
                        form: false,
                        param: value.funid,
                        menucode: value.funid,
                        cnName: value.funname
                    }
                });
                if (value.childList && value.childList.length > 0) {
                    for (var j = 0; j < value.childList.length; j++) {
                        aaa(value.childList[j]);
                    }
                } else {
                    //console.log(data)
                    states.push({
                        name: "app." + value.funcode,
                        url: "/" + value.funcode,
                        title: value.funname,
                        templateUrl: "../page/" + value.funcode + ".html",
                        ncyBreadcrumb: {
                            label: value.funname,
                            description: value.funname
                        },
                        params: {openType: '', form: false, param: '', menucode: value.funid, cnName: value.funname}
                    })
                }
            })
        }
    });

    function aaa(data) {
        //console.log(data);
        /** @namespace data.childList.length */
        if (!data.childList || data.childList.length < 1) {
            var index = data.funcode.indexOf('!');
            //console.log(data);
            if (index > -1) {//是通用查询
                states.push({
                    name: "app." + data.funcode,
                    url: "/" + data.funcode,
                    title: data.funname,
                    templateUrl: "../page/" + data.funcode.substring(0, index) + ".html",
                    ncyBreadcrumb: {
                        label: data.funname,
                        description: data.funname
                    },
                    params: {
                        openType: '',
                        form: false,
                        param: data.funcode.substring(index + 1),
                        menucode: data.funid,
                        cnName: data.funname
                    }
                })
            } else if (data.funcode.indexOf('^') > -1) {
                states.push({
                    name: "app.subMenu" + data.funcode,
                    url: "/subMenu" + data.funcode,
                    title: data.funname,
                    templateUrl: "subMenu.html",
                    ncyBreadcrumb: {
                        label: data.funname,
                        description: data.funname
                    },
                    params: {openType: '', form: false, param: '', menucode: data.funid, cnName: data.funname}
                })
            } else {
                states.push({
                    name: "app." + data.funcode,
                    url: "/" + data.funcode,
                    title: data.funname,
                    templateUrl: "../page/" + data.funcode + ".html",
                    ncyBreadcrumb: {
                        label: data.funname,
                        description: data.funname
                    },
                    params: {openType: '', form: false, param: '', menucode: data.funid, cnName: data.funname}
                })
            }
        } else {
            console.log(data);
            for (var i = 0; i < data.childList.length; i++) {
                //console.log(data.childList[i])
                aaa(data.childList[i]);
            }
            states.push({
                name: "app.subMenu" + data.funcode,
                url: "/subMenu" + data.funcode,
                title: data.funname,
                templateUrl: "/page/subMenu.html",
                ncyBreadcrumb: {
                    label: data.funname,
                    description: data.funname
                },
                params: {
                    openType: '',
                    form: false,
                    param: data.funid,
                    menucode: data.funid,
                    cnName: data.funname
                }
            });

        }
    }

    //var path = $location.path();
    //console.log(path);
    $urlRouterProvider.otherwise('/app/dashboard');

    $stateProvider.state('app', {
        abstract: true,
        url: '^/app',
        templateUrl: '../page/layout.html',
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(
                    [
                        'ui.select',
                        'toaster',
                        'daterangepicker',
                        'checklist-model',
                        'angular.icheck',
                        'ngGrid',
                        'ng.ueditor',
                        'multiselect-searchtree',
                        'angular-list-select',
                        'angularFileUpload',
                        'ng-nestable'
                    ]).then(function () {
                        return $ocLazyLoad.load({
                            serie: true,
                            files: [
                                '../static/css/bootstrap-table.min.css',
                                //'../static/js/lib/jquery/bootstrap-table/bootstrap-editable.css',
                                //'../static/js/lib/jquery/bootstrap-table/bootstrap-editable.js',
                                '../static/js/lib/jquery/bootstrap-table/bootstrap-table.js',
                                '../static/js/lib/jquery/bootstrap-table/bootstrap-table-zh-CN.min.js',
                                '../static/js/lib/jquery/bootstrap-table/bootstrap-table-editable.js',
                                '../static/js/echarts.min.js',
                                '../static/js/ng-echarts.min.js',
                                //'../static/js/lib/jquery/fuelux/wizard/wizard-custom.js',
                                '../static/js/app/services/factory.dashboard.js',
                                '../static/js/app/services/service.userinfo.js',
                                '../static/js/app/services/service.CommonQuery.js',
                                '../static/js/app/services/service.CommonTools.js'
                            ]
                        });
                    }
                )
            }]
        }
    });

    angular.forEach(states, function (state) {
        $stateProvider.state(state.name, state);
    });
    console.log(states)
}]);