var app =
    angular.module('app')
        .config(
        [
            '$controllerProvider', '$compileProvider', '$filterProvider', '$provide','$httpProvider','$locationProvider',
            function($controllerProvider, $compileProvider, $filterProvider, $provide,$httpProvider,$locationProvider) {
            	//$compileProvider.debugInfoEnabled(false);
                app.controller = $controllerProvider.register;
                app.directive = $compileProvider.directive;
                app.filter = $filterProvider.register;
                app.factory = $provide.factory;
                app.service = $provide.service;
                app.constant = $provide.constant;
                app.value = $provide.value;
                $httpProvider.defaults.transformRequest = function(obj){
                    var str = [];  
                    for(var p in obj){  
                      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));  
                    }  
                    return str.join("&");
                  };

                  $httpProvider.defaults.headers.post = {  
                       'Content-Type': 'application/x-www-form-urlencoded'  
                  }
                  
            }
        ]);


app.config(function($breadcrumbProvider) {
    $breadcrumbProvider.setOptions({
        template: '<ul class="breadcrumb"><li><i class="fa fa-home"></i><a ui-sref="app.dashboard">主页</a></li><li ng-repeat="step in steps" ng-class="{active: $last}" ng-switch="$last || !!step.abstract"><a ng-switch-when="false" href="{{step.ncyBreadcrumbLink}}">{{step.ncyBreadcrumbLabel}}</a><span ng-switch-when="true">{{step.ncyBreadcrumbLabel}}</span></li></ul>'
    });
});