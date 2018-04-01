app.controller('funInfo', ['$scope', 'toaster', '$modal',
    function ($scope, toaster, $modal) {

        $scope.allData = [{
            cdesc: '菜单代码',
            key: 'funcode'
        }, {
            cdesc: '菜单名称',
            key: 'funname'
        }];

        var json = '';
        var tableOption = {
            locale: 'zh-CN',
            method: 'GET',
            //cache: false,
            contentType: 'application/x-www-form-urlencoded',
            url: '../sys/function/pageVoList',
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
                field: 'cancelflag',
                title: '有效否',
                halign: 'center',
                align: 'center',
                width: 60
            }, {
                field: 'funname',
                title: '菜单名称',
                halign: 'center',
                align: 'center'
            }, {
                field: 'parentid',
                title: '上级菜单',
                halign: 'center',
                align: 'center'
            }, {
                field: 'funtype',
                title: '菜单类型',
                halign: 'center',
                align: 'center'
            }, {
                field: 'funsort',
                title: '排序',
                halign: 'center',
                align: 'center'
            }, {
                field: 'funcode',
                title: '菜单代码',
                halign: 'center',
                align: 'left'
            }]
            , onLoadSuccess: function (data) {
                console.log(data)
            }
        };

        $scope.funs = [];//储存树形菜单数据
        //$scope.checkfunsArr = [];//储存选中的菜单

        $.ajax({
            url: '/sys/function/menutreelist',
            type: 'get',
            success: function (data) {
                console.log(data);
                var jsonstr = '[';
                for (var i = 0; i < data.length; i++) {
                    jsonstr += '{name:\'' + data[i].funname + '\',id:' + data[i].funid;
                    //jsonstr+='label:\''+data[i].funname+'\',funid:'+JSON.stringify(data[i])+',selected:'+checkSelected(data[i].funid,items.form.functions);
                    if (data[i].childList && data[i].childList.length > 0) {
                        /** @namespace items.form.functions */
                        jsonstr += ',children:[' + aaa(data[i].childList) + ']';
                    }
                    jsonstr += '},';
                }
                jsonstr = jsonstr.substring(0, jsonstr.length - 1) + ']';
                $scope.funs = eval(jsonstr);

                function aaa(item) {
                    var tempjson = '';
                    for (var i = 0; i < item.length; i++) {
                        var temppppjson = ',{';
                        temppppjson += 'name:\'' + item[i].funname + '\',id:' + item[i].funid;
                        //temppppjson += 'label:\''+item[i].funname+'\',funid:'+JSON.stringify(item[i])+',selected:'+checkSelected(item[i].funid,funs);
                        if (item[i].childList && item[i].childList.length > 0) {
                            temppppjson += ',children:[' + aaa(item[i].childList) + ']';
                        }
                        temppppjson += '}';
                        tempjson += temppppjson;
                    }
                    return tempjson.substring(1);
                }
            }

        });

        $scope.init = function () {
            $("#table").bootstrapTable(tableOption);
        };

        $scope.FunsCallback = function (item, selectedItems) {
            console.log(item, selectedItems);
            var filters = [];
            filters.push({
                colname: 'parentid',
                operator: '=',
                isbetween: false,
                value: item.id
            });
            json = JSON.stringify(filters);
            console.log(json);
            $("#table").bootstrapTable('destroy').bootstrapTable(tableOption);
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
            $.ajax({
                url: '../sys/function/edit',
                type: 'GET',
                async: false,
                data: {funid: ''},
                success: function (data) {
                    console.log(data);
                    $scope.userarr = {form: data, type: 'add'}
                }
            });
            var modalInstance = $modal.open({
                windowClass: windowClass,
                templateUrl: templateUrl,
                controller: 'funModalInstanceCtrl',
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
                deleteIDs.push(value.funid);
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
                        url: '../sys/function/delete',
                        type: 'POST',
                        async: false,
                        data: {funids: deleteIDs},
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

        $scope.batchcancel = function () {
            var getSelectedRow = $("#table").bootstrapTable('getAllSelections');
            var ids = [];
            angular.forEach(getSelectedRow, function (value) {
                ids.push(value.funid);
            });
            if (ids.length <= 0) {
                toaster.pop('error', '未选择数据');

            } else if (ids.length > 1) {
                toaster.pop('error', '只能选择一条数据恢复');
            } else {
                $.ajax({
                    url: './sys/function/batchcancel',
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
                ids.push(value.funid);
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
                url: '../sys/function/edit',
                type: 'GET',
                async: false,
                data: {funid: row.funid},
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
        if (items.form.parentid === '0' || !items.form.parentid) {
            $scope.parentid = '空'
        }

        $scope.cancelflag = [{text: '有效', value: '0'}, {text: '无效', value: '1'}];

        $scope.stuff = [];//储存树形菜单数据
        $scope.checkfunsArr = [];//储存选中的菜单
        $.ajax({
            type: 'GET',
            url: '../sys/function/funtreelist',
            success: function (data) {
                console.log(data);
                var jsonstr = '[';
                for (var i = 0; i < data.length; i++) {
                    jsonstr += '{name:\'' + data[i].funname + '\',id:' + data[i].funid + ',selected:' + checkSelected(data[i], items.form);
                    //jsonstr+='label:\''+data[i].funname+'\',funid:'+JSON.stringify(data[i])+',selected:'+checkSelected(data[i].funid,items.form.functions);
                    if (data[i].childList && data[i].childList.length > 0) {
                        jsonstr += ',children:[' + aaa(data[i].childList, items.form) + ']';
                    }
                    jsonstr += '},';
                }
                jsonstr = jsonstr.substring(0, jsonstr.length - 1) + ']';
                console.log(jsonstr);
                $scope.stuff = eval(jsonstr);
            }
        });

        function checkSelected(fun, funform) {
            if (fun.funid === funform.parentid) {
                $scope.parentid = fun.funname;
                return true;
            }
            return false;
        }

        function aaa(item, funs) {
            var tempjson = '';
            for (var i = 0; i < item.length; i++) {
                var temppppjson = ',{';
                temppppjson += 'name:\'' + item[i].funname + '\',id:' + item[i].funid + ',selected:' + checkSelected(item[i], funs);
                //temppppjson += 'label:\''+item[i].funname+'\',funid:'+JSON.stringify(item[i])+',selected:'+checkSelected(item[i].funid,funs);
                if (item[i].childList && item[i].childList.length > 0) {
                    temppppjson += ',children:[' + aaa(item[i].childList, funs) + ']';
                }
                temppppjson += '}';
                tempjson += temppppjson;
            }
            return tempjson.substring(1);
        }

        $scope.funtype = [{text: '网页', value: '1'}, {text: '按钮', value: '2'}];
        $scope.formData = items.form;
        if (!items.form.parentid) {
            $scope.formData.parentid = 0
        }
        if (!items.form.funsort) {
            $scope.formData.funsort = 10
        }
        if (items.form.cancelflag && items.form.funtype) {
            $scope.formData.cancelflag === '0' ? $scope.formData.cancelflag = {
                text: '有效',
                value: '0'
            } : $scope.formData.cancelflag = {text: '无效', value: '1'};
            $scope.formData.funtype === '1' ? $scope.formData.funtype = {
                text: '网页',
                value: '1'
            } : $scope.formData.funtype = {text: '按钮', value: '2'}
        } else {
            $scope.formData.cancelflag = {text: '有效', value: '0'};
            $scope.formData.funtype = {text: '网页', value: '1'}
        }

        $scope.CustomCallback = function (item, selectedItems) {
            console.log(item, selectedItems, $scope.checkfunsArr);
            if (selectedItems.length > 0) {
                if (item.selected && $scope.checkfunsArr.length > 0) {
                    selectedItems.splice(selectedItems.indexOf(item), 1);
                    item.selected = false;
                    $scope.checkfunsArr = selectedItems;
                }
            }
        };
        $scope.setSelected = function () {
            console.log($scope.checkfunsArr);
            if ($scope.checkfunsArr.length <= 0) {
                $scope.parentid = '空';
                $scope.formData.parentid = 0;
            } else {
                $scope.parentid = $scope.checkfunsArr[0].name;
                $scope.formData.parentid = $scope.checkfunsArr[0].id;
            }
        };
        /*$scope.checkitem = function () {
            if ($scope.checkfunsArr.length <= 0) {
                $scope.formData.parentid = 0;
                $scope.parentid = '空'
            }
        };*/
        var ajaxUrl = '';
        $scope.submit = function (isValid, $event) {
            //console.log(items)
            var event = $event || window.event;
            event.preventDefault();
            //$scope.formData.cancelflag = $scope.formData.cancelflag.value	
            console.log($scope.formData);
            if (items.type === 'add')
                ajaxUrl = '../sys/function/add';
            if (items.type === 'update')
                ajaxUrl = '../sys/function/update';
            if (isValid) {
                console.log(ajaxUrl);
                if ($scope.formData.cancelflag.value) {
                    $scope.formData.cancelflag = $scope.formData.cancelflag.value;
                    $scope.formData.funtype = $scope.formData.funtype.value;
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