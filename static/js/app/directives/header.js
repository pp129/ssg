angular.module('app')
    .directive('fullscreen', function () {
        return {
            restrict: 'AC',
            template: '<i class="glyphicon glyphicon-fullscreen"></i>',
            link: function (scope, el, attr) {
                el.on('click', function () {
                    var element = document.documentElement;
                    if (!$('body')
                            .hasClass("full-screen")) {

                        $('body')
                            .addClass("full-screen");
                        $('#fullscreen-toggler')
                            .addClass("active");
                        if (element.requestFullscreen) {
                            element.requestFullscreen();
                        } else if (element.mozRequestFullScreen) {
                            element.mozRequestFullScreen();
                        } else if (element.webkitRequestFullscreen) {
                            element.webkitRequestFullscreen();
                        } else if (element.msRequestFullscreen) {
                            element.msRequestFullscreen();
                        }

                    } else {

                        $('body').removeClass("full-screen");
                        el.removeClass("active");

                        if (document.exitFullscreen) {
                            document.exitFullscreen();
                        } else if (document.mozCancelFullScreen) {
                            document.mozCancelFullScreen();
                        } else if (document.webkitExitFullscreen) {
                            document.webkitExitFullscreen();
                        }

                    }
                });
            }
        };
    });

angular.module('app')
    .directive('refresh', [
        '$rootScope', '$state', '$stateParams',
        function ($rootScope, $state, $stateParams) {
            return {
                restrict: 'AC',
                template: '<i class="glyphicon glyphicon-refresh"></i>',
                link: function (scope, el, attr) {
                    el.on('click', function () {
                        //console.log($stateParams)
                        $state.transitionTo($state.current, $stateParams, {
                            reload: true,
                            inherit: false,
                            notify: true
                        });
                    });
                }
            };
        }
    ]);

angular.module('app')
    .directive('sidebarToggler', function () {
        return {
            restrict: 'AC',
            template: '<i class="fa fa-arrows-h"></i>',
            link: function (scope, el, attr) {
                el.on('click', function () {
                    $("#sidebar").toggleClass("hide");
                    el.toggleClass("active");
                    return false;
                });
            }
        };
    });

angular.module('app')
    .directive('pageTitle', [
        '$rootScope', '$timeout',
        function ($rootScope, $timeout) {
            return {
                link: function (scope, element) {

                    var listener = function (event, toState) {
                        var title = 'Default Title';
                        if (toState.ncyBreadcrumb && toState.ncyBreadcrumb.label) title = toState.ncyBreadcrumb.label;
                        $timeout(function () {
                            element.text(title);
                        }, 0, false);
                    };
                    $rootScope.$on('$stateChangeSuccess', listener);
                }
            };
        }
    ]);

angular.module('app')
    .directive('headerTitle', [
        '$rootScope', '$timeout', '$state',
        function ($rootScope, $timeout, $state) {
            return {
                link: function (scope, element) {
                    var currentState = {}
                    if ($state) {
                        currentState = $state.current
                    }
                    var dashboard = {
                        name: 'app.dashboard',
                        ncyBreadcrumb: {
                            description: '主页',
                            label: '主页'
                        },
                        params: {openType: '', form: false, param: '', menucode: '', dbName: ''},
                        templateUrl: 'page/dashboard.jsp',
                        title: '主页',
                        url: '/dashboard'
                    }
                    var stockArr = [];
                    $rootScope.currentState = {};
                    stockArr.push(JSON.stringify(dashboard))
                    stockArr.push(JSON.stringify(currentState))
                    $rootScope.currentState = currentState
                    $("#clearLabel").click(function (event) {
                        angular.forEach(element[0].children, function (value, key) {
                            if (value.tagName == 'A' && value.id != 'dashboard') {
                                for (var i = 0; i < stockArr.length; i++) {
                                    //console.log(eval("["+stockArr[i]+"]")[0].title)
                                    if (value.id == eval("[" + stockArr[i] + "]")[0].title) {
                                        stockArr.splice(i, 2);
                                    }
                                }
                                if (stockArr.length > 0) {
                                    var href = eval("[" + stockArr[stockArr.length - 1] + "]")[0].name;
                                    //console.log(stockArr)
                                    $state.go(href)
                                    value.previousSibling.remove();
                                    value.remove();
                                }
                            }
                        });
                        $('.scroll-pane').data('jsp').scrollTo(0, 0);
                    });
                    var listener = function (event, toState) {
                        //console.log(toState)
                        var a = '';
                        stockArr.push(JSON.stringify(toState));
                        var description = '';
                        description = toState.ncyBreadcrumb.description;
                        function unique(str) {
                            var newArr = [],
                                i = 0,
                                len = str.length;
                            for (; i < len; i++) {
                                var a = str[i];
                                if (newArr.indexOf(a) === -1) {
                                    newArr[newArr.length] = a;
                                }
                            }
                            return newArr;
                        }
                        if (description !== "") {
                            stockArr = unique(stockArr);
                            a = '<a id="dashboard" href="#/app/dashboard" class="btn navBtn btn-palegreen btn-xs">主页</a><span class="closeLabel">&times;</span>'
                            angular.forEach(stockArr, function (value) {
                                var index = stockArr.indexOf(JSON.stringify(toState));
                                if (index > -1) {
                                    stockArr.splice(index, 1);
                                    stockArr.push(JSON.stringify(toState))
                                }
                                value = eval("[" + value + "]");
                                if (!value[0].params.form && value[0].name !== 'app.dashboard') {
                                    //console.log(value[0])
                                    a += '<a id="' + value[0].title + '" href="#/app' + value[0].url + '" class="btn navBtn btn-azure btn-xs">' + value[0].ncyBreadcrumb.description + '</a><span class="closeLabel">&times;</span>'
                                }
                            });
                            element.html(a);
                            $('#navTabTitle > a').each(function () {
                                if ($(this).attr('id') === description) {
                                    $(this).addClass("current");
                                    $(this).addClass("btn-darkorange");
                                    $(this).removeClass("btn-azure")
                                } else {
                                    if ($(this).hasClass("current")) {
                                        $(this).removeClass("current");
                                        $(this).removeClass("btn-darkorange");
                                        $(this).addClass("btn-azure")
                                    }
                                }
                            })
                        }//if descrition exist end
                        $('.closeLabel').click(function (event) {
                            var removeItem = event.target.previousSibling.id;
                            //console.log(removeItem)
                            if (removeItem && removeItem != 'dashboard') {
                                for (var i = 0; i < stockArr.length; i++) {
                                    //console.log(eval("["+stockArr[i]+"]")[0].title)
                                    if (removeItem == eval("[" + stockArr[i] + "]")[0].title) {
                                        stockArr.splice(i, 2);
                                        break;
                                    }
                                }
                                if (stockArr.length > 0) {
                                    var href = eval("[" + stockArr[stockArr.length - 1] + "]")[0].name;
                                    //console.log(stockArr)
                                    $state.go(href)
                                    event.target.previousSibling.remove();
                                    event.target.remove();
                                }
                            }
                        });

                        scope.master = element;
                        var scrollBarWidth = 0;
                        scope.$watch("master", function () {
                            angular.forEach(element[0].children, function (value, key) {
                                if (value.tagName == 'A') {
                                    scrollBarWidth = value.offsetWidth + scrollBarWidth + 12
                                }
                            })
                            if (scrollBarWidth >= 943) {
                                var setBarWidth = "width:" + scrollBarWidth
                                //console.log(setBarWidth)
                                element[0].setAttribute("style", setBarWidth)
                                $('.scroll-pane').jScrollPane({
                                    //showArrows:true,
                                    stickToRight: true,
                                    animateScroll: true
                                    //arrowScrollOnHover:true
                                })
                                var api = $('.scroll-pane').data('jsp');
                                api.scrollTo(scrollBarWidth, 0);
                            }
                        });
                    };
                    $rootScope.$on('$stateChangeSuccess', listener);
                }
            };
        }
    ]);