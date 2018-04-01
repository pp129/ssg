/**
 * created by pan on 2017/12/20.
 */
var INTEGER_REGEXP = /^\-?\d*$/;//正整数
var INTEGER_REGEXP_0_99 = /^([1-9][0-9]|[1-9])$/;//正整数 0-99
var INTEGER_FLOAT_REGEXP = /(^0\.\d*[1-9]\d?$)|(^[1-9]\d*(.\d*[1-9]\d?)?$)|(^[1-9]\d*(.0)?$)/; //非零正数
var INTEGER_FLOAT_10_2 = /^\d{0,10}\.{0,1}(\d{1,2})?$/; //number(10,2)
var INTEGER_FLOAT_15_6 = /^\d{0,15}\.{0,1}(\d{1,6})?$/; //number(15,6)

angular.module('app')
    .directive('pwCheck', ['$timeout', function ($timeout) {
        return {
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                var firstPassword = '#' + attrs.pwCheck;
                elem.add(firstPassword).on('keyup', function () {
                    var v = elem.eq(0).val() === $(firstPassword).val();
                    $timeout(function () {
                        console.log(elem.eq(0).val());
                        if (!elem.eq(0).val()) {
                            ctrl.$setValidity('pwCheck', true);
                        } else {
                            ctrl.$setValidity('pwCheck', v);
                        }
                    });
                });
            }
        }
    }])
    .directive('integer', function () {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$parsers.unshift(function (viewValue) {
                    if (INTEGER_REGEXP.test(viewValue)) {
                        ctrl.$setValidity('integer', true);
                        return viewValue;
                    } else {
                        ctrl.$setValidity('integer', false);
                        return undefined;
                    }
                });
            }
        };
    })
    .directive('integerInHundred', function () {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$parsers.unshift(function (viewValue) {
                    if (INTEGER_REGEXP_0_99.test(viewValue)) {
                        ctrl.$setValidity('integerInHundred', true);
                        return viewValue;
                    } else {
                        ctrl.$setValidity('integerInHundred', false);
                        return undefined;
                    }
                });
            }
        };
    })
    .directive('intFloat', function () {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$parsers.unshift(function (viewValue) {
                    if (INTEGER_FLOAT_REGEXP.test(viewValue)) {
                        ctrl.$setValidity('intFloat', true);
                        return viewValue;
                    } else {
                        ctrl.$setValidity('intFloat', false);
                        return undefined;
                    }
                });
            }
        };
    })
    .directive('intFloatTenTwo', function () {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$parsers.unshift(function (viewValue) {
                    if (INTEGER_FLOAT_10_2.test(viewValue)) {
                        ctrl.$setValidity('intFloatTenTwo', true);
                        return viewValue;
                    } else {
                        ctrl.$setValidity('intFloatTenTwo', false);
                        return undefined;
                    }
                });
            }
        };
    })
    .directive('intFloatFifteenSix', function () {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$parsers.unshift(function (viewValue) {
                    if (INTEGER_FLOAT_15_6.test(viewValue)) {
                        ctrl.$setValidity('intFloatFifteenSix', true);
                        return viewValue;
                    } else {
                        ctrl.$setValidity('intFloatFifteenSix', false);
                        return undefined;
                    }
                });
            }
        };
    })
;