'use strict';

angular.module('app')
.run(['$location','$rootScope','$state',function($location, $rootScope,$state){  
	$rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {  
		$rootScope.title = toState.title;
		$rootScope.previousState_name = fromState.name;  
        $rootScope.previousState_params = fromParams;  
	});  
	$rootScope.back = function(param) {//实现返回的函数  
		if(param){
			$state.go($rootScope.previousState_name,{param:param});  
		}else{
			$state.go($rootScope.previousState_name,$rootScope.previousState_params);  
		}
    };  
}]) 
.controller('AppCtrl', ['$rootScope', '$localStorage', '$state', '$timeout',
    function ($rootScope, $localStorage, $state, $timeout) {
	    $rootScope.settings = {
	        skin: '',
	        color: {
	            themeprimary: '#2dc3e8',
	            themesecondary: '#fb6e52',
	            themethirdcolor: '#ffce55',
	            themefourthcolor: '#a0d468',
	            themefifthcolor: '#e75b8d'
	        },
	        rtl: false,
	        fixed: {
	            navbar: false,
	            sidebar: false,
	            //breadcrumbs: true,
	            header: false
	        }
	    };
	    if (angular.isDefined($localStorage.settings))
	        $rootScope.settings = $localStorage.settings;
	    else
	        $localStorage.settings = $rootScope.settings;
	
	    $rootScope.$watch('settings', function () {
	        if ($rootScope.settings.fixed.header) {
	            $rootScope.settings.fixed.navbar = false;
	            $rootScope.settings.fixed.sidebar = false;
	            //$rootScope.settings.fixed.breadcrumbs = true;
	        }
	        /*if ($rootScope.settings.fixed.breadcrumbs) {
	            $rootScope.settings.fixed.navbar = true;
	            $rootScope.settings.fixed.sidebar = true;
	        }*/
	        
	        if ($rootScope.settings.fixed.sidebar) {
	            $rootScope.settings.fixed.navbar = false;
	
	
	            //Slim Scrolling for Sidebar Menu in fix state
	            var position = $rootScope.settings.rtl ? 'right' : 'left';
	            if (!$('.page-sidebar').hasClass('menu-compact')) {
	                $('.sidebar-menu').slimscroll({
	                    position: position,
	                    size: '3px',
	                    color: $rootScope.settings.color.themeprimary,
	                    height: $(window).height() - 90,
	                });
	            }
	        } else {
	            if ($(".sidebar-menu").closest("div").hasClass("slimScrollDiv")) {
	                $(".sidebar-menu").slimScroll({ destroy: true });
	                $(".sidebar-menu").attr('style', '');
	            }
	        }
	
	        $localStorage.settings = $rootScope.settings;
	    }, true);
	
	    $rootScope.$on('$viewContentLoaded',
	        function (event, toState, toParams, fromState, fromParams) {
	            if ($rootScope.settings.rtl && $state.current.name != "persian.dashboard" && $state.current.name != "arabic.dashboard") {
	                switchClasses("pull-right", "pull-left");
	                switchClasses("databox-right", "databox-left");
	                switchClasses("item-right", "item-left");
	            }
	            if ($state.current.name == 'error404') {
	                $('body').addClass('body-404');
	            }
	            if ($state.current.name == 'error500') {
	                $('body').addClass('body-500');
	            }
	            $timeout(function () {
	                if ($rootScope.settings.fixed.sidebar) {
	                    //Slim Scrolling for Sidebar Menu in fix state
	                    var position = $rootScope.settings.rtl ? 'right' : 'left';
	                    if (!$('.page-sidebar').hasClass('menu-compact')) {
	                        $('.sidebar-menu').slimscroll({
	                            position: position,
	                            size: '3px',
	                            color: $rootScope.settings.color.themeprimary,
	                            height: $(window).height() - 90,
	                        });
	                    }
	                } else {
	                    if ($(".sidebar-menu").closest("div").hasClass("slimScrollDiv")) {
	                        $(".sidebar-menu").slimScroll({ destroy: true });
	                        $(".sidebar-menu").attr('style', '');
	                    }
	                }
	            }, 500);
	
	            window.scrollTo(0, 0);
	        }
	    );
	}
]);