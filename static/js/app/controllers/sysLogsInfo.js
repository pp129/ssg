app.controller('logsInfo', ['$scope', 'toaster', '$modal', '$http', '$stateParams', '$state', '$rootScope', 'CommonQuery', 'commonTools',
    function ($scope, toaster, $modal, $http, $stateParams, $state, $rootScope, CommonQuery, commonTools) {

        $scope.allData = [{
            cdesc: '操作员',
            key: 'makeman',
            isdate: false,
            iscombo: false,
            istree: false
        }, {
            cdesc: '操作时间',
            key: 'maketime',
            dataformat: 'yyyy-MM-dd',
            isdate: true,
            iscombo: false,
            istree: false,
            dates: {startDate: null, endDate: null}
        }];
        //时间日期控件
        var dateFormat = '';
        angular.forEach($scope.allData, function (value) {
            if (value.isdate) {
                dateFormat = value.dataformat; //动态格式化方法
            }
        });
        $scope.formatDate = function (date, dateFormat) {
            return commonTools.formatDate(date, dateFormat);
        };
        $scope.rangeoptions = {
            applyClass: 'btn-success',
            format: dateFormat,
            clearLabel: '取消',
            locale: {
                separator: "～",
                applyLabel: "确定",
                fromLabel: "起始日期",
                toLabel: "结束日期",
                //cancelLabel: "取消",
                //clearLabel: "取消",
                customRangeLabel: '自定义',
                daysOfWeek: ["日", "一", "二", "三", "四", "五", "六"],
                monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                "firstDay": 1
            },
            ranges: {
                '\u4e00\u5468\u524d': [moment().subtract(6, 'days'), moment()],
                '30\u5929\u524d': [moment().subtract(29, 'days'), moment()]
            }
        };
        //table options
        var json = '';
        var tableOption = {
            locale: 'zh-CN',
            method: 'GET',
            cache: false,
            contentType: 'application/x-www-form-urlencoded',
            url: './sys/log/pageList',
            //clickToSelect: true,
            //singleSelect: false,
            pagination: true,
            sidePagination: 'server',
            pageNumber: 1,
            pageSize: 10,
            pageList: [10, 15, 20, 25, 50, 100],
            queryParamsType: '',
            queryParams: function (params) {
                return {
                    pagesize: params.pageSize, // 页面大小
                    pageindex: params.pageNumber, // 页码
                    whereJson: json
                };
            },
            responseHandler: function (res) {
                return {
                    "total": res.total, // 总页数
                    "rows": res.list// 数据
                };
            },
            columns: [{
                field: 'index',
                title: '#',
                width: 36,
                halign: 'center',
                align: 'center',
                formatter: function (value, row, index) {
                    return '<div>' + (index + 1) + '</div>';
                }
            }, {
                field: 'makeman',
                title: '操作员',
                halign: 'center',
                align: 'center'
            }, {
                field: 'maketime',
                title: '操作时间',
                halign: 'center',
                align: 'center',
                cellStyle: function cellStyle() {
                    return {
                        css: {
                            "min-width": "100px"
                        }
                    };
                },
                formatter: function (value) {
                    if (value)
                        return CommonQuery.formatDate(new Date(value))
                }
            }, {
                field: 'logtype',
                title: '日志类型',
                halign: 'center',
                align: 'center'
            }, {
                field: 'title',
                title: '日志标题',
                halign: 'center',
                align: 'left'
            }, {
                field: 'requesturl',
                title: '请求地址',
                halign: 'center',
                align: 'left'
            }, {
                field: 'method',
                title: '提交方法',
                halign: 'center',
                align: 'center'
            }, {
                field: 'ipaddress',
                title: '操作IP地址',
                halign: 'center',
                align: 'left'
            }, {
                field: 'useragent',
                title: '操作浏览器',
                //width: 130,
                halign: 'center',
                align: 'center',
                cellStyle: function cellStyle() {
                    return {
                        css: {
                            "max-width": "250px",
                            "white-space": "nowrap",
                            "overflow": "hidden",
                            "text-overflow": "ellipsis"
                        }
                    };
                }
            }, {
                field: 'params',
                title: '请求参数',
                halign: 'center',
                align: 'left'
            }, {
                field: 'requesttime',
                title: '请求耗时',
                halign: 'center',
                align: 'center'
            }, {
                field: 'exceptionstr',
                title: '异常',
                halign: 'center',
                align: 'left'
            }],
            onLoadSuccess: function (data) {
                console.log(data)
            }
        };

        $scope.init = function () {
            $("#table").bootstrapTable(tableOption);
        };

        $scope.query = function () {
            var filters = [];
            angular.forEach($scope.allData, function (value) {
                if (value.filter) {
                    //console.log(value)
                    if (value.iscombo || value.istree) {
                        filters.push({
                            colname: value.key,
                            operator: '=',
                            isbetween: false,
                            value: value.filter
                        });
                    } else {
                        filters.push({
                            colname: value.key,
                            operator: 'like',
                            isbetween: false,
                            value: '%' + value.filter + '%'
                        });
                    }
                } else if (value.dates) {
                    if (value.dates.startDate || value.dates.endDate) {
                        filters.push({
                            colname: value.key,
                            operator: '=',
                            isbetween: true,
                            value: commonTools.formatDate(value.dates.startDate),
                            value2: commonTools.formatDate(value.dates.endDate),
                            dataformat: 'yyyy-MM-dd'
                        });
                    }
                }
            });
            json = JSON.stringify(filters);
            console.log(json);
            $("#table").bootstrapTable('destroy').bootstrapTable(tableOption);
        }; // query end

        $scope.clear = function () {
            angular.forEach($scope.allData, function (value) {
                if (value.filter) {
                    value.filter = null
                }
                if (value.dates) {
                    value.dates = {
                        startDate: null,
                        endDate: null
                    }
                }
            });
            json = [];
            $("#table").bootstrapTable('destroy').bootstrapTable(tableOption);
        }
    }
]);