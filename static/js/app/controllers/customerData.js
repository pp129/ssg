app.controller('customerData', ['$scope', 'toaster', '$modal','commonTools',
    function ($scope, toaster, $modal,commonTools) {

        $scope.allData = [{
            cdesc: '客户名称',
            key: 'clientname',
            iscombo: false,
            isdate: false,
            istree: false
        }];
        
    	  //时间日期控件
	    var dateFormat = '';
	    angular.forEach($scope.allData, function(value, key) {
	        if (value.isdate) {
	            dateFormat = value.dataformat; //动态格式化方法
	        }
	    });
	    $scope.formatDate = function(date, dateFormat){
	    	return commonTools.formatDate(date, dateFormat);
	    }
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
                '一周前': [moment().subtract(6, 'days'), moment()],
                '30天前': [moment().subtract(29, 'days'), moment()],
            }
        }

        var json = '';
        var tableOption = {
            locale: 'zh-CN',
            method: 'GET',
            //cache: false,
            contentType: 'application/x-www-form-urlencoded',
            url: '/common/client/page',
            clickToSelect: true,
            singleSelect: false,
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
                }
            },
            onDblClickRow: function (row, $element) {
                rowEdit(row, $element);
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
                checkbox: true
            }, {
                field: 'client',
                title: '客户代码',
                halign: 'center',
                align: 'left'
            }, {
                field: 'abbname',
                title: '客户简称',
                halign: 'center',
                align: 'center'
            }, {
                field: 'clirntname',
                title: '客户名称',
                halign: 'center',
                align: 'center'
            }, {
                field: 'conoperflag',
                title: '船公司否',
                halign: 'center',
                align: 'center'
            }, {
                field: 'shipagentflag',
                title: '船代否',
                halign: 'center',
                align: 'center'
            }, {
                field: 'controlctnflag',
                title: '控箱代理否',
                halign: 'center',
                align: 'center'
            }, {
                field: 'truckflag',
                title: '车队否',
                halign: 'center',
                align: 'center'
            }, {
                field: 'conownerflag',
                title: '箱主否',
                halign: 'center',
                align: 'center'
            }, {
                field: 'ownerflag',
                title: '货主否',
                halign: 'center',
                align: 'center'
            }, {
                field: 'cargoagentflag',
                title: '货代否',
                halign: 'center',
                align: 'center'
            }, {
                field: 'shipperflag',
                title: '发货人否',
                halign: 'center',
                align: 'center'
            }, {
                field: 'consigneeflag',
                title: '收货人否',
                halign: 'center',
                align: 'center'
            }],
            onLoadSuccess: function (data) {
                console.log(data)
            }
        };

        $scope.init = function () {
            $("#table").bootstrapTable(tableOption);
        };

        //确定的方法!
        $scope.query = function() {
        	var filters = [];
            angular.forEach($scope.allData, function(value, key) {
                if (value.filter) {
                    console.log(value)
                    console.log(key)
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
                	if(value.dates.startDate||value.dates.endDate){
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
            console.log(json)
            $("#table").bootstrapTable('destroy').bootstrapTable(tableOption);
        } // query end

        $scope.clear = function () {
            angular.forEach($scope.allData, function (value) {
                if (value.filter) {
                    value.filter = null
                }
            });
            json = [];
            $("#table").bootstrapTable('destroy').bootstrapTable(tableOption);
        };

        $scope.add = function (windowClass, templateUrl, size) {
            var modalInstance = $modal.open({
                windowClass: windowClass,
                templateUrl: templateUrl,
                controller: 'funModalInstanceCtrl',
                size: size,
                resolve: { // 把数据传入弹框控制器
                    items: function () {
                        return {type: 'add'};
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) { // 确定后操作
                if (selectedItem.success) {
                    $("#table").bootstrapTable('destroy').bootstrapTable(tableOption);
                }
            }, function () { // 关闭后操作
                // $log.info('Modal dismissed at: ' + new Date());
            });
        };//add end

        $scope.deleteList = function () {
            var getSelectedRow = $("#table").bootstrapTable('getAllSelections');
            var deleteIDs = [];
            angular.forEach(getSelectedRow, function (value) {
            	console.log(value)
                deleteIDs.push(value.clientid);
            });
            if (deleteIDs.length <= 0) {
                toaster.pop('error', '未选中数据');
            } else {
                var modalInstance = $modal.open({
                    windowClass: 'modal-message modal-warning',
                    templateUrl: 'confirm.html',
                    controller: 'confirmModalInstanceCtrl',
                    size: 'sm',
                    resolve: {}
                });
                modalInstance.result.then(function () { // 确定后操作
                    $.ajax({
                        url: '../common/client/delete',
                        type: 'POST',
                        async: false,
                        data: {clientids: deleteIDs},
                        success: function (data) {
                            if (data.success) {
                                $("#table").bootstrapTable('destroy').bootstrapTable(tableOption);
                                toaster.pop('success', '删除成功');
                            } else {
                                toaster.pop('error', data.msg);
                            }
                        }
                    })
                }, function () { // 关闭后操作
                    //console.log(selectedItem)
                    // $log.info('Modal dismissed at: ' + new Date());
                });
            }
        };//delete end

        $scope.edit = function () {
            var getSelectedRow = $("#table").bootstrapTable('getAllSelections');
            var ids = [];
            angular.forEach(getSelectedRow, function (value) {
                ids.push(value.consize);
            });
            if (ids.length <= 0) {
                toaster.pop('error', '未选择数据');
            } else if (ids.length > 1) {
                toaster.pop('error', '只能选择一条数据编辑');
            } else {
                rowEdit(getSelectedRow[0])
            }
        };

        function rowEdit(row) {
            // console.log(row);
            //if($("#editPermit") && $("#editPermit").val()=="1"){
            $.ajax({
                url: '../common/client/edit',
                type: 'GET',
                async: false,
                data: {clientid: row.clientid},
                success: function (data) {
                    $scope.userarr = {form: data, type: 'update'}
                }
            });
            var modalInstance = $modal.open({
                windowClass: 'edit',
                templateUrl: 'funForm.html',
                controller: 'funModalInstanceCtrl',
                size: 'lg',
                resolve: { // 把数据传入弹框控制器
                    items: function () {
                        return $scope.userarr;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) { // 确定后操作
                if (selectedItem.success) {
                    $("#table").bootstrapTable('destroy').bootstrapTable(
                        tableOption);
                }
            }, function () { // 关闭后操作
                //console.log(selectedItem)
                // $log.info('Modal dismissed at: ' + new Date());
            });
            //}else{
            //	toaster.pop('error', '操作失败','当前帐号没有编辑操纵权限');
            //}

        }//rowEdit end

    }//fun info controller end
]);
app.controller('funModalInstanceCtrl', ['$scope', '$modalInstance', 'items',
    function ($scope, $modalInstance, items) {
        console.log(items);
        var ajaxUrl = '';
        $scope.disabled = false;
        $scope.formData = {};
        if (items.type === 'add') {
            ajaxUrl = '../common/client/save';
        } else if (items.type === 'update') {
            ajaxUrl = '../common/client/update';
            $scope.formData = items.form;
            $scope.disabled = true;
        }
        $scope.submit = function (isValid, $event) {
            //console.log(items)
            var event = $event || window.event;
            event.preventDefault();
            //$scope.formData.cancelflag = $scope.formData.cancelflag.value
            console.log($scope.formData);
            if (isValid) {
                console.log(ajaxUrl);
                $.ajax({
                    type: 'POST',
                    url: ajaxUrl,
                    contentType: 'application/json;charset=UTF-8',
                    dataType: 'json',
                    data: JSON.stringify($scope.formData),
                    success: function (data) {
                        console.log(data);
                        if (data.success) {
                            $modalInstance.close(data);
                        }
                    }
                })
            }
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);
app.controller('confirmModalInstanceCtrl', function ($scope, $modalInstance) {

    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});