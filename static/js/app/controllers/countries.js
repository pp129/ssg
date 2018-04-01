app.controller('countries', ['$scope', 'toaster', '$modal',
    function ($scope, toaster, $modal) {

        $scope.allData = [{
            cdesc: '国家代码',
            key: 'countryno'
        }, {
            cdesc: '国家名称',
            key: 'countrycn'
        }, {
            cdesc: '中文名称',
            key: 'countryen'
        }];

        var json = '';
        var tableOption = {
            locale: 'zh-CN',
            method: 'GET',
            //cache: false,
            contentType: 'application/x-www-form-urlencoded',
            url: '/common/country/page',
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
                field: 'countryno',
                title: '国家代码',
                halign: 'center',
                align: 'left'
            }, {
                field: 'countrycn',
                title: '国家名称',
                halign: 'center',
                align: 'center'
            }, {
                field: 'countryen',
                title: '中文名称',
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

        $scope.query = function () {
            var filters = [];
            angular.forEach($scope.allData, function (value) {
                if (value.filter) {
                    filters.push({
                        colname: value.key,
                        operator: 'like',
                        isbetween: false,
                        value: '%' + value.filter + '%'
                    });
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
            	console.log(value.sdid)
                deleteIDs.push(value.sdid);
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
                        url: '../common/country/delete',
                        type: 'POST',
                        async: false,
                        data: {sdids: deleteIDs},
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
                ids.push(value.sdid);
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
             console.log(row);
            //if($("#editPermit") && $("#editPermit").val()=="1"){
            $.ajax({
                url: '../common/country/edit',
                type: 'GET',
                async: false,
                data: {sdid: row.sdid},
                success: function (data) {
                	console.log(data)
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
app.controller('funModalInstanceCtrl', ['$scope', '$modalInstance', 'items','toaster',
    function ($scope, $modalInstance, items,toaster) {
        console.log(items);
        var ajaxUrl = '';
        $scope.disabled = false;
        $scope.formData = {};
        if (items.type === 'add') {
            ajaxUrl = '../common/country/save';
        } else if (items.type === 'update') {
            ajaxUrl = '../common/country/update';
            $scope.formData = items.form;
            $scope.disabled = false;
        }
        $scope.submit = function (isValid, $event) {
            //console.log(items)
        	console.log(isValid, $event)
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
                        }else{
                        	toaster.pop('error',data.msg)
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