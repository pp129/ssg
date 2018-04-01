angular.module('app')
    .config([
        '$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
            $ocLazyLoadProvider.config({
                debug: true,
                events: true,
                modules: [
                    {
                        name: 'toaster',
                        files: [
                            '../static/js/lib/modules/angularjs-toaster/toaster.css',
                            '../static/js/lib/modules/angularjs-toaster/toaster.js'
                        ]
                    },
                    {
                        name: 'ui.select',
                        files: [
                            '../static/js/lib/modules/angular-ui-select/select.css',
                            '../static/js/lib/modules/angular-ui-select/select.js'
                        ]
                    },
                    {
                        name: 'angular-list-select',
                        files: [
                            '../static/js/lib/angular-list-select/css/angular-list-select.min.css',
                            '../static/js/lib/angular-list-select/angular-list-select.js'
                        ]
                    },
                    {
                        name: 'ngTagsInput',
                        files: [
                            '../static/js/lib/modules/ng-tags-input/ng-tags-input.js'
                        ]
                    },
                    {
                        name: 'daterangepicker',
                        serie: true,
                        files: [
                    		'../static/js/lib/modules/angular-daterangepicker/daterangepicker.css',
                            '../static/js/lib/modules/angular-daterangepicker/moment.js',
                            '../static/js/lib/modules/angular-daterangepicker/daterangepicker.js',
                            '../static/js/lib/modules/angular-daterangepicker/angular-daterangepicker.js'
                        ]
                    },
                    {
                        name: 'vr.directives.slider',
                        files: [
                            '../static/js/lib/modules/angular-slider/angular-slider.min.js'
                        ]
                    },
                    {
                        name: 'minicolors',
                        files: [
                            '../static/js/lib/modules/angular-minicolors/jquery.minicolors.js',
                            '../static/js/lib/modules/angular-minicolors/angular-minicolors.js'
                        ]
                    },
                    {
                        name: 'textAngular',
                        files: [
                            '../static/js/lib/modules/text-angular/textAngular-sanitize.min.js',
                            '../static/js/lib/modules/text-angular/textAngular-rangy.min.js',
                            '../static/js/lib/modules/text-angular/textAngular.min.js'
                        ]
                    },
                    {
                        name: 'ng-nestable',
                        files: [
                            '../static/js/lib/modules/angular-nestable/jquery.nestable.js',
                            '../static/js/lib/modules/angular-nestable/angular-nestable.js'
                        ]
                    },
                    {
                        name: 'angularBootstrapNavTree',
                        files: [
                            '../static/js/lib/modules/angular-bootstrap-nav-tree/abn_tree_directive.js'
                        ]
                    },
                    {
                        name: 'ivh.treeview',
                        files: [
                            '../static/js/lib/angular-ivh-treeview/ivh-treeview.js',
                            '../static/js/lib/angular-ivh-treeview/ivh-treeview.css',
                            '../static/js/lib/angular-ivh-treeview/ivh-treeview-theme-basic.css',
                        ]
                    },
                    {
                        name: 'multiselect-searchtree',
                        files: [
                            '../static/js/lib/angular-multi-select-tree/src/kjvelarde-multiselect-searchtree.min.css',
                            '../static/js/lib/angular-multi-select-tree/src/kjvelarde-multiselect-searchtree.js',
                            //'../static/js/lib/angular-multi-select-tree/src/kjvelarde-multiselect-searchtree.tpl.js',
                        ]
                    },
                    {
                        name: 'ui.calendar',
                        files: [
                            '../static/js/lib/jquery/fullcalendar/jquery-ui.custom.min.js',
                            '../static/js/lib/jquery/fullcalendar/moment.min.js',
                            '../static/js/lib/jquery/fullcalendar/fullcalendar.js',
                            '../static/js/lib/modules/angular-ui-calendar/calendar.js'
                        ]
                    },
                    {
                        name: 'ngGrid',
                        files: [
                            '../static/js/lib/modules/ng-grid/ng-grid.min.js',
                            '../static/js/lib/modules/ng-grid/ng-grid.css'
                        ]
                    },
                    {
                        name: 'dropzone',
                        files: [
                            '../static/js/lib/modules/angular-dropzone/dropzone.min.js',
                            '../static/js/lib/modules/angular-dropzone/angular-dropzone.js'
                        ]
                    },
                    {
                        name: 'checklist-model',
                        files: [
                            '../static/js/app/directives/checklist-model.js',
                        ]
                    },
                    {
                        name: 'angular.icheck',
                        files: [
                            '../static/js/app/directives/icheck.js'
                        ]
                    },
                    {
                        name: 'ng.ueditor',
                        files: [
                            '../static/js/lib/angular-ueditor/angular-ueditor.js',
                        ]
                    },
                    {
                        name: 'angularFileUpload',
                        files: [
                            '../static/js/lib/angular-file-upload/angular-file-upload.js',
                        ]
                    },
                    {
                        name: 'ng-nestable',
                        files: [
                            '../static/js/lib/modules/angular-nestable/jquery.nestable.js',
                            '../static/js/lib/modules/angular-nestable/angular-nestable.js'
                        ]
                    }
                ]
            });
        }
    ]);