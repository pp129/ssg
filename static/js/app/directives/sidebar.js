//Sidebar Menu Handle
angular.module('app')
    .directive('sidebarMenu', function() {
        return {
            restrict: 'AC',
            link: function (scope, el, attr) {
                el.find('li.active').parents('li').addClass('active open');

                el.on('click', 'a', function (e) {
                    e.preventDefault();
                    var isCompact = $("#sidebar").hasClass("menu-compact");//是否是闭合 的
                    var menuLink = $(e.target);
                    if ($(e.target).is('span'))
                        menuLink = $(e.target).closest('a');
                    if (!menuLink || menuLink.length == 0)
                        return;
                    if (!menuLink.hasClass("menu-dropdown")) {//没有子菜单
                        if (isCompact && menuLink.get(0).parentNode.parentNode == this) {
                            var menuText = menuLink.find(".menu-text").get(0);
                            if (e.target != menuText && !$.contains(menuText, e.target)) {
                                return false;
                            }
                        }
                        return;
                    }
                    var submenu = menuLink.next().get(0);
                    //console.log(submenu)
                    if (!$(submenu).is(":visible")) {//子菜单未展开时
                        var c = $(submenu.parentNode).closest("ul");
                        //console.log($(c).children().next("*>.open"))
                        var p = $(c).children().next("*>.open")
                        //console.log(p)
                        if (isCompact && c.hasClass("sidebar-menu"))
                            return;
                        c.find("* > .open > .submenu")
                            .each(function() {
                                if (this != submenu && !$(this.parentNode).hasClass("active"))
                                	//console.log($(this))
                                    $(this).slideUp(200).parent().removeClass("open");
                            });
                        //手风琴模式
                        p.each(function(){
                        	//console.log(this)
                        	//if (this != submenu && !$(this).hasClass("active"))
                                $(this).find('ul').slideUp(200).parent().removeClass("open");
                        })
                    }
                    if (isCompact && $(submenu.parentNode.parentNode).hasClass("sidebar-menu"))
                        return false;
                    $(submenu).slideToggle(200).parent().toggleClass("open");
                    return false;
                });
            }
        };
    });

