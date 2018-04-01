/**
 * Checklist-model
 * AngularJS directive for list of checkboxes
 * https://github.com/vitalets/checklist-model
 * License: MIT http://opensource.org/licenses/MIT
 */

/* commonjs package manager support (eg componentjs) */
if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports) {
    module.exports = 'angular.icheck';
}

angular.module('angular.icheck', [])

    .directive('iCheck', function () {
        return {
            require: 'ngModel',
            link: function ($scope, element, $attrs, ngModel) {
                //console.log($attrs, ngModel);
                var $element = $(element);
                var color = $attrs.color;
                var skin = $attrs.skin;
                var label = $element.next();
                label.remove();
                skin = skin && color ? skin + '-' + color : skin;

                $element.iCheck({
                    checkboxClass: skin ? 'icheckbox_' + skin : 'icheckbox_minimal',
                    insert: '<div class="icheck_line-icon"></div>' + $attrs.name
                });
                /*if (!$attrs.checked) {
                    $element.iCheck('uncheck');
                }*/

                $element.on('ifChecked', function (event) {
                    ngModel.$setViewValue(true);
                });

                $element.on('ifUnchecked', function (event) {
                    ngModel.$setViewValue(false);
                });

                $scope.$watch($attrs.ngHide, function (newValue) {
                    if (newValue) {
                        $element.parent().hide();
                    } else {
                        $element.parent().show();
                    }
                });


                $scope.$watch($attrs.ngModel, function (newValue) {
                    if (newValue) {
                        $element.iCheck('check');
                        $element.iCheck('update');
                    } else {
                        $element.iCheck('uncheck');
                        $element.iCheck('update');
                    }
                });

                $scope.$watch($attrs.ngDisabled, function (newValue) {
                    if (newValue) {
                        $element.iCheck('disable');
                    } else {
                        $element.iCheck('enable');
                    }
                });
            }
        }
    });