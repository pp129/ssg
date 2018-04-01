app.controller('test', ['$scope', 'toaster', '$modal',
    function ($scope, toaster, $modal) {

        $scope.allData = [{
            cdesc: '角色',
            key: 'rolecode'
        }, {
            cdesc: '角色名称',
            key: 'rolename'
        }];

        var json = '';
        var tableOption = {
            locale: 'zh-CN',
            method: 'GET',
            cache: false,
            contentType: 'application/x-www-form-urlencoded',
            url: '../sys/roleinfo/pageVoList',
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
                };
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
            rowStyle: function (row) {
                //['active', 'success', 'info', 'warning', 'danger'];
                var strclass = "";
                if (row.cancelflag === "无效") {
                    strclass = 'danger';
                } else {
                    return {};
                }
                return {classes: strclass}
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
                field: 'rolecode',
                title: '角色',
                halign: 'center',
                align: 'left',
                width: 120
            }, {
                field: 'rolename',
                title: '角色名称',
                halign: 'center',
                align: 'left'
            }, {
                field: 'datascope',
                title: '数据范围',
                halign: 'center',
                align: 'left'
            }, {
                field: 'cancelflag',
                title: '有效否',
                halign: 'center',
                align: 'center',
                width: 60
            }]
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
            $("#table").bootstrapTable('destroy').bootstrapTable(tableOption);
        }; // query end

        $scope.clear = function () {
            angular.forEach($scope.allData, function (value) {
                if (value.filter) {
                    value.filter = null
                }
            });
            json = [];
            $("#table").bootstrapTable('destroy').bootstrapTable(
                tableOption);
        };

        $scope.add = function (windowClass, templateUrl, size) {
            $.ajax({
                url: '../sys/roleinfo/edit',
                type: 'GET',
                async: false,
                data: {roleid: ''},
                success: function (data) {
                    $scope.userarr = {form: data, type: 'add'}
                }
            });
            var modalInstance = $modal.open({
                windowClass: windowClass,
                templateUrl: templateUrl,
                controller: 'roleModalInstanceCtrl',
                size: size,
                resolve: { // 把数据传入弹框控制器
                    items: function () {
                        return $scope.userarr;
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
                deleteIDs.push(value.roleid);
            });
            if (deleteIDs <= 0) {
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
                        url: '../sys/roleinfo/delete',
                        type: 'POST',
                        async: false,
                        data: {roleids: deleteIDs},
                        success: function (data) {
                            if (data.success) {
                                $("#table").bootstrapTable('destroy').bootstrapTable(tableOption);
                                toaster.pop('success', '删除成功');
                            } else {
                                toaster.pop('error', data.msg);
                            }
                        }
                    });
                }, function () { // 关闭后操作
                    //console.log(selectedItem)
                    // $log.info('Modal dismissed at: ' + new Date());
                });
            }
        };//delete end

        $scope.batchcancel = function () {
            var getSelectedRow = $("#table").bootstrapTable('getAllSelections');
            var ids = [];
            angular.forEach(getSelectedRow, function (value) {
                ids.push(value.roleid);
            });
            if (ids.length <= 0) {
                toaster.pop('error', '未选择数据');

            } else if (ids.length > 1) {
                toaster.pop('error', '只能选择一条数据恢复');
            } else {
                $.ajax({
                    url: '../sys/roleinfo/batchcancel',
                    type: 'POST',
                    async: false,
                    data: {ids: ids, cancelflag: 0},
                    success: function (data) {
                        console.log(data);
                        if (data.success) {
                            $("#table").bootstrapTable('destroy').bootstrapTable(tableOption);
                            toaster.pop('success', '恢复成功');
                        } else {
                            toaster.pop('error', data.msg);
                        }
                    }
                })
            }

        };//batchcancel end

        $scope.edit = function () {
            var getSelectedRow = $("#table").bootstrapTable('getAllSelections');
            var ids = [];
            angular.forEach(getSelectedRow, function (value) {
                ids.push(value.roleid);
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
            //console.log(row);
            //if($("#editPermit") && $("#editPermit").val()=="1"){
            $.ajax({
                url: '../sys/roleinfo/edit',
                type: 'GET',
                async: false,
                data: {roleid: row.roleid},
                success: function (data) {
                    console.log(data);
                    $scope.userarr = {form: data, type: 'update'}
                }
            });
            var modalInstance = $modal.open({
                windowClass: 'edit',
                templateUrl: 'roleForm.html',
                controller: 'roleModalInstanceCtrl',
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

    }//role info controller end
]);
app.controller('roleModalInstanceCtrl', [
    '$scope',
    '$modalInstance',
    'items',
    function ($scope, $modalInstance, items) {

        console.log(items);
        $scope.formData = items.form;

        //下拉选择处理
        $scope.combo = {}; //字典表
        $scope.combox = ['cancelflag', 'datascope']; //字典表索引
        angular.forEach($scope.combox, function (value) {
            $.ajax({
                url: '../common/comdict/type',
                type: 'GET',
                async: false,
                data: {type: value},
                success: function (data) {
                    console.log(data)
                    $scope.combo[value] = data;
                }
            });
        });
        var ajaxUrl = '';
        if (items.type === 'add') {
            ajaxUrl = '../sys/roleinfo/add';
            $scope.formData.cancelflag = $scope.combo.cancelflag[0].value;
            $scope.formData.datascope = $scope.combo.datascope[5].value
        } else if (items.type === 'update') {
            ajaxUrl = '../sys/roleinfo/update'
        }
        $scope.stuff = [];//储存树形菜单数据
        $scope.checkfunsArr = [];//储存选中的菜单

        function checkSelected(funid, funs) {
            for (var i = 0; i < funs.length; i++) {
                if (funid === funs[i].funid)
                    return true;
            }
            return false;
        }

        function aaa(item, funs) {
            for (var i = 0; i < item.length; i++) {
                item[i].selected = checkSelected(item[i].funid, funs);
                if (item[i].childList && item[i].childList.length > 0) {
                    aaa(item[i].childList, funs)
                }
            }
        }

        var json = '';
        var tableOption = {
            locale: 'zh-CN',
            method: 'GET',
            cache: false,
            contentType: 'application/x-www-form-urlencoded',
            url: '../sys/function/funtreelist',
            detailView: true,//父子表
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
                };
            },
            responseHandler: function (data) {
                console.log(data);
                for (var i = 0; i < data.length; i++) {
                    data[i].selected = checkSelected(data[i].funid, items.form.functions);
                    if (data[i].childList && data[i].childList.length > 0) {
                        aaa(data[i].childList, items.form.functions)
                    }
                }
                console.log(data);
                return {
                    "total": data.length, // 总页数
                    "rows": data// 数据
                };
            },
            onCheckAll: function (rows) {

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
                checkbox: true,
                formatter: function (value, row) {
                    if (row.selected === true)
                        return {
                            //disabled : true,//设置是否可用
                            checked: true//设置选中
                        };
                    return value;
                }
            }, {
                field: 'funcode',
                title: '菜单代码',
                halign: 'center',
                align: 'left'
            }, {
                field: 'funname',
                title: '菜单名称',
                halign: 'center',
                align: 'left'
            }],
            onExpandRow: function (index, row, $detail) {
                //if (row.childList.length > 0) {
                $scope.InitSubTable(index, row, $detail);
                //}
            }
        };
        //初始化子表格(无线循环)
        $scope.InitSubTable = function (index, row, $detail) {
            //console.log($detail.parent().parent().parent());
            var $parentTable = $detail.parent().parent().parent();
            //console.log($parentTable);
            var parentDatas = $parentTable.bootstrapTable('getData');
            angular.forEach(parentDatas, function (value, key) {
                if (index !== key) {
                    $parentTable.bootstrapTable('collapseRow', key);
                }
            });

            var cur_table = $detail.html('<table></table>').find('table');
            if (row.childList.length > 0) {
                $(cur_table).bootstrapTable({
                    clickToSelect: true,
                    detailView: true,//父子表
                    pagination: true,
                    pageSize: 10,
                    pageList: [10, 25],
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
                        checkbox: true,
                        formatter: function (value, row) {
                            if (row.selected === true)
                                return {
                                    //disabled : true,//设置是否可用
                                    checked: true//设置选中
                                };
                            return value;
                        }
                    }, {
                        field: 'funcode',
                        title: '菜单代码',
                        halign: 'center',
                        align: 'left'
                    }, {
                        field: 'funname',
                        title: '菜单名称',
                        halign: 'center',
                        align: 'left'
                    }],
                    //无线循环取子表，直到子表里面没有记录
                    onExpandRow: function (index, row, $Subdetail) {
                        //if (row.childList.length > 0) {
                        $scope.InitSubTable(index, row, $Subdetail);
                        //}
                    },
                    data: row.childList
                });
            }
        };

        $scope.loadRoles = function () {
            $("#roles").bootstrapTable(tableOption)
        };

        $scope.submit = function (isValid, $event) {
            var event = $event || window.event;
            event.preventDefault();

            if (isValid) {

                $scope.formData.checkfuns = [];
                angular.forEach($scope.checkfunsArr, function (value) {
                    if (value && value.selected) {
                        $scope.formData.checkfuns.push(value.id);
                    }
                });

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
                        } else {
                            alert(data.msg)
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