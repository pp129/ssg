app.controller('roleInfo', ['$scope', 'toaster', '$modal',
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
            url: '../adminjson/roleinfo.pageVoList.json',
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
                console.log(res);
                return {
                    "total": res.total, // 总页数
                    "rows": res.rows// 数据
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
            ,onLoadSuccess:function (data) {
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
            //console.log(windowClass);
            var rolid = '';
            $.ajax({
                url: 'adminjson/roleinfo.edit.admin.json',
                type: 'GET',
                async: false,
                data: {roleid: rolid},
                success: function (data) {
                    $scope.userarr = {form: data, type: windowClass}
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
                    toaster.pop('success', '新增成功');
                    $("#table").bootstrapTable('destroy').bootstrapTable(tableOption);
                }
            }, function () { // 关闭后操作
                // $log.info('Modal dismissed at: ' + new Date());
            });
        };//add end

        $scope.clone = function (windowClass, templateUrl, size) {
            //console.log(windowClass);
            var getSelectedRow = $("#table").bootstrapTable('getAllSelections');
            var ids = [];
            angular.forEach(getSelectedRow, function (value) {
                ids.push(value.roleid);
            });
            if (ids.length <= 0) {
                toaster.pop('error', '未选择数据');
            } else if (ids.length > 1) {
                toaster.pop('error', '只能选择一条数据复制');
            } else {
                var modalInstance = $modal.open({
                    windowClass: windowClass,
                    templateUrl: templateUrl,
                    controller: 'cloneModalInstanceCtrl',
                    size: size,
                    resolve: { // 把数据传入弹框控制器
                        items: function () {
                            return ids[0];
                        }
                    }
                });
                modalInstance.result.then(function (selectedItem) { // 确定后操作
                    console.log(selectedItem);
                    if(selectedItem.success){
                        $("#table").bootstrapTable('destroy').bootstrapTable(tableOption);
                    }
                    /*if (selectedItem.success) {
                        toaster.pop('success', '复制成功');
                        $("#table").bootstrapTable('destroy').bootstrapTable(tableOption);
                    }*/
                }, function () { // 关闭后操作
                    // $log.info('Modal dismissed at: ' + new Date());
                });
            }
        };//clone end

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
                url: '../adminjson/roleinfo.edit.admin.json',
                type: 'GET',
                async: false,
                data: {roleid: row.roleid},
                success: function (data) {
                    console.log(JSON.stringify(data));
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
                    toaster.pop('success', '修改成功');
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
app.controller('roleModalInstanceCtrl', ['$scope', '$modalInstance', 'items', 'toaster',
    function ($scope, $modalInstance, items, toaster) {
        console.log(items);
        $scope.formData = items.form;
        //下拉选择处理
        $scope.combo = {}; //字典表
        $scope.combox = ['cancelflag', 'datascope']; //字典表索引
        $.ajax({
            url: '../adminjson/comdict.cancelflag.json',
            type: 'GET',
            async: false,
            //data: {type: value},
            success: function (data) {
                console.log(JSON.stringify(data));
                $scope.combo.cancelflag = data;
            }
        });
        $.ajax({
            url: '../adminjson/comdict.datascope.json',
            type: 'GET',
            async: false,
            //data: {type: value},
            success: function (data) {
                console.log(JSON.stringify(data));
                $scope.combo.datascope = data;
            }
        });
        var ajaxUrl = '';
        if (items.type === 'add') {
            ajaxUrl = '../sys/roleinfo/add';
            $scope.formData.cancelflag = $scope.combo.cancelflag[0].value;
            $scope.formData.datascope = $scope.combo.datascope[5].value
        } else {
            console.log(items.form.roleid);
            $scope.roleuser = function () {
                $("#roleuser").bootstrapTable({
                    locale: 'zh-CN',
                    method: 'GET',
                    cache: false,
                    contentType: 'application/x-www-form-urlencoded',
                    url: '/sys/userinfo/roleuser',
                    pagination: true,
                    sidePagination: 'server',
                    pageNumber: 1,
                    pageSize: 5,
                    pageList: [5, 10, 15, 20, 50, 100],
                    queryParamsType: '',
                    queryParams: function (params) {
                        return {
                            pagesize: params.pageSize, // 页面大小
                            pageindex: params.pageNumber, // 页码
                            roleid: items.form.roleid
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
                        field: 'usercode',
                        title: '用户代码',
                        halign: 'center',
                        align: 'left'
                    }, {
                        field: 'username',
                        title: '用户名称',
                        halign: 'center',
                        align: 'left'
                    }]
                });
            };
            if (items.type === 'update') {
                ajaxUrl = '../sys/roleinfo/update';
            }
        }
        $scope.stuff = [];//储存树形菜单数据
        $scope.checkfunsArr = [];//储存选中的菜单

        $.ajax({
            url: '../adminjson/funtreelist.json',
            type: 'GET',
            async: false,
            success: function (data) {
                $scope.jsondata=data;
                var jsonstr = '[';
                for (var i = 0; i < data.length; i++) {
                    jsonstr += '{name:\'' + data[i].funname + '\',id:' + data[i].funid + ',selected:' + checkSelected(data[i].funid, items.form.functions);
                    //jsonstr+='label:\''+data[i].funname+'\',funid:'+JSON.stringify(data[i])+',selected:'+checkSelected(data[i].funid,items.form.functions);
                    if (data[i].childList && data[i].childList.length > 0) {
                        /** @namespace items.form.functions */
                        jsonstr += ',children:[' + aaa(data[i].childList, items.form.functions) + ']';
                    }
                    jsonstr += '},';
                }
                jsonstr = jsonstr.substring(0, jsonstr.length - 1) + ']';
                $scope.stuff = eval(jsonstr);
            }
        });

        function checkSelected(funid, funs) {
            for (var i = 0; i < funs.length; i++) {
                if (funid === funs[i].funid)
                    return true;
            }
            return false;
        }

        function aaa(item, funs) {
            var tempjson = '';
            for (var i = 0; i < item.length; i++) {
                var temppppjson = ',{';
                temppppjson += 'name:\'' + item[i].funname + '\',id:' + item[i].funid + ',selected:' + checkSelected(item[i].funid, funs);
                //temppppjson += 'label:\''+item[i].funname+'\',funid:'+JSON.stringify(item[i])+',selected:'+checkSelected(item[i].funid,funs);
                if (item[i].childList && item[i].childList.length > 0) {
                    temppppjson += ',children:[' + aaa(item[i].childList, funs) + ']';
                }
                temppppjson += '}';
                tempjson += temppppjson;
            }
            return tempjson.substring(1);
        }

        /**
         * @return {boolean}
         */
        $scope.CustomCallback = function () {
            //if (selectedItems !== undefined && selectedItems.length >= 80) {
            // return false;
            //} else {
            return true;
            //}
        };
        /*$scope.ok = function() {
            $scope.formParam = {
                type: items.type,
                data: $scope.formData
            }
            $modalInstance.close($scope.formParam); //传出选中项数据
            $window.location.reload();
        };*/


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
                    async: false,
                    success: function (data) {
                        console.log(data);
                        if (data.success) {
                            $modalInstance.close(data);
                        } else {
                            toaster.pop('error', '操作失败', data.msg);
                            //alert(data.msg)
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
app.controller('cloneModalInstanceCtrl', ['$scope', '$modalInstance', 'items', 'toaster',
    function ($scope, $modalInstance, items, toaster) {
        console.log(items);
        $scope.allData = [{
            cdesc: '角色',
            key: 'rolecode'
        }, {
            cdesc: '角色名称',
            key: 'rolename'
        }];
        var json = '';
        var tableOpts = {
            locale: 'zh-CN',
            method: 'GET',
            cache: false,
            contentType: 'application/x-www-form-urlencoded',
            url: '/sys/roleinfo/pageVoList',
            clickToSelect: true,
            singleSelect: true,
            pagination: true,
            sidePagination: 'server',
            pageNumber: 1,
            pageSize: 5,
            pageList: [5, 10, 20, 25, 50, 100],
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
            rowStyle: function (row) {
                //['active', 'success', 'info', 'warning', 'danger'];
                var strclass = "";
                if (row.cancelflag === "无效") {
                    strclass = 'danger';
                } else if (row.roleid === items) {
                    strclass = 'info';
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
                checkbox: true,
                formatter: function (value, row) {
                    if (row.roleid === items) {
                        return {
                            disabled: true,//设置是否可用
                            checked: false//设置选中
                        };
                    }
                }
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

        $scope.initClone = function () {
            $("#cloneTable").bootstrapTable(tableOpts)
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
            $("#cloneTable").bootstrapTable('destroy').bootstrapTable(tableOpts);
        }; // query end

        $scope.clear = function () {
            angular.forEach($scope.allData, function (value) {
                if (value.filter) {
                    value.filter = null
                }
            });
            json = [];
            $("#cloneTable").bootstrapTable('destroy').bootstrapTable(tableOpts);
        };
        $scope.ok = function () {
            var getSelectedRow = $("#cloneTable").bootstrapTable('getAllSelections');
            if (getSelectedRow.length <= 0) {
                toaster.pop('error', '未选择角色');
                return false;
            } else {
                //console.log(items, getSelectedRow);
                $.ajax({
                    url: '/sys/roleinfo/copyrole',
                    type: 'POST',
                    data: {fromroleid: getSelectedRow[0].roleid, toroleid: items},
                    async: false,
                    success: function (data) {
                        console.log(data);
                        if(data.success){
                            toaster.pop('success',data.msg);
                            $modalInstance.close(data);
                        }else{
                            toaster.pop('error',data.msg);
                            return false
                        }
                    }
                })
                //$modalInstance.close(getSelectedRow);
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