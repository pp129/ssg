app.controller('userInfo', ['$scope', 'toaster', '$modal', '$http', '$stateParams', '$state', '$rootScope', 'commonTools',
    function ($scope, toaster, $modal, $http, $stateParams, $state, $rootScope, commonTools) {
        //查询条件
        $scope.allData = [{
            cdesc: '用户名',
            key: 'u.usercode',
            isdate: false,
            iscombo: false,
            istree: false
        }, {
            cdesc: '真实名称',
            key: 'u.username',
            isdate: false,
            iscombo: false,
            istree: false
        }, {
            cdesc: '组织机构',
            key: 'g.groupid',
            isdate: false,
            iscombo: false,
            istree: true
        }];
        //TREE
        $scope.searchArr = [];
        $.ajax({
            type: 'GET',
            url: '/sys/groupinfo/treelist',
            success: function (data) {
                var jsonstr = commonTools.recursive({
                    data: data,
                    childName: 'childgroupList',
                    name: 'groupname',
                    id: 'groupid',
                    selectedItem: null
                });
                $scope.searchStuff = eval(jsonstr.tree);
            }
        });
        $scope.SearchCallback = function (item) {
            angular.forEach($scope.allData, function (value) {
                if (value.istree) {
                    value.filter = JSON.stringify(item.id)
                }
            });
            $scope.parentid = item.name;
        };
        //console.log($stateParams)
        if ($stateParams.openType === 'showInfo') {
            rowEdit($stateParams.param)
        }
        //table options
        var json = '';
        var tableOption = {
            locale: 'zh-CN',
            method: 'GET',
            cache: false,
            contentType: 'application/x-www-form-urlencoded',
            url: '/sys/userinfo/pageVoList',
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
                field: 'usercode',
                title: '用户名',
                halign: 'center',
                align: 'left'
            }, {
                field: 'username',
                title: '真实名称',
                halign: 'center',
                align: 'left'
            }, {
                field: 'groupid',
                title: '组织机构',
                halign: 'center',
                align: 'left'
            }, {
                field: 'phone',
                title: '电话',
                halign: 'center',
                align: 'left'
            }, {
                field: 'email',
                title: '邮箱',
                halign: 'center',
                align: 'left'
            }, {
                field: 'rolestr',
                title: '所属角色',
                halign: 'center',
                align: 'left'
            }, {
                field: 'cancelflag',
                title: '有效否',
                halign: 'center',
                align: 'center',
                width: 60
            }],
            onLoadSuccess: function (data) {
                console.log(data);
            }
        };
        //表格初始化
        $scope.init = function () {
            $("#table").bootstrapTable(tableOption);
        };
        //查询
        $scope.query = function () {
            json = JSON.stringify(commonTools.queryData($scope.allData));
            $("#table").bootstrapTable('destroy').bootstrapTable(tableOption);
        }; // query end
        //取消
        $scope.clear = function () {
            angular.forEach($scope.allData, function (value) {
                if (value.filter) {
                    value.filter = null
                }
                if (value.istree) {
                    $scope.parentid = null
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
        };
        //新增
        $scope.add = function (windowClass, templateUrl, size) {
            $.ajax({
                url: '/sys/userinfo/edit',
                type: 'GET',
                async: false,
                data: {userid: ''},
                success: function (data) {
                    $scope.userarr = {form: data, type: 'add'}
                }
            });
            var modalInstance = $modal.open({
                windowClass: windowClass,
                templateUrl: templateUrl,
                controller: 'userModalInstanceCtrl',
                size: size,
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
                // $log.info('Modal dismissed at: ' + new Date());
            });
        };//add end
        //删除
        $scope.deleteList = function () {
            var getSelectedRow = $("#table").bootstrapTable('getAllSelections');
            var deleteIDs = [];
            angular.forEach(getSelectedRow, function (value) {
                deleteIDs.push(value.userid);
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
                        url: '/sys/userinfo/delete',
                        type: 'POST',
                        async: false,
                        data: {userids: deleteIDs},
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
        //恢复
        $scope.batchcancel = function () {
            var getSelectedRow = $("#table").bootstrapTable('getAllSelections');
            var ids = [];
            angular.forEach(getSelectedRow, function (value) {
                ids.push(value.userid);
            });
            if (ids.length <= 0) {
                toaster.pop('error', '未选择数据');

            } else if (ids.length > 1) {
                toaster.pop('error', '只能选择一条数据恢复');
            } else {
                $.ajax({
                    url: '/sys/userinfo/batchcancel',
                    type: 'POST',
                    async: false,
                    data: {ids: ids, cancelflag: 0},
                    success: function (data) {
                        //console.log(data);
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
        //编辑
        $scope.edit = function () {
            var getSelectedRow = $("#table").bootstrapTable('getAllSelections');
            var ids = [];
            angular.forEach(getSelectedRow, function (value) {
                ids.push(value.userid);
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
            var permit = $("#editPermit");
            if (permit && permit.val() === "1") {
                $.ajax({
                    url: '/sys/userinfo/edit',
                    type: 'GET',
                    async: false,
                    data: {userid: JSON.stringify(row.userid)},
                    success: function (data) {
                        //console.log(data);
                        $scope.userarr = {form: data, type: 'update'}
                    }
                });
                //curIndex = $element[0].rowIndex;
                var modalInstance = $modal.open({
                    windowClass: 'edit',
                    templateUrl: 'userForm.html',
                    controller: 'userModalInstanceCtrl',
                    size: 'lg',
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
                    //console.log(selectedItem)
                    // $log.info('Modal dismissed at: ' + new Date());
                });
            } else {
                toaster.pop('error', '操作失败', '当前帐号没有编辑操纵权限');
            }
        }//rowEdit end

    }//controller end
]);
app.controller('userModalInstanceCtrl', ['$scope', '$modalInstance', 'items', 'toaster', 'CommonQuery', 'commonTools', '$modal',
    function ($scope, $modalInstance, items, toaster, CommonQuery, commonTools, $modal) {
        console.log(items);
        $scope.formData = items.form;
        $scope.opentype = items.type;
        //下拉选择处理
        $scope.combo = {};
        $scope.combox = ['cancelflag'];
        angular.forEach($scope.combox, function (value) {
            $.ajax({
                url: '/common/comdict/type',
                type: 'GET',
                async: false,
                data: {type: value},
                success: function (data) {
                    $scope.combo[value] = data;
                }
            });
        });
        //判断新增或编辑
        var ajaxUrl = '';
        var roleidArr = [];
        if (items.type === 'add') {
            ajaxUrl = '/sys/userinfo/add';
            $scope.formData.cancelflag = $scope.combo.cancelflag[0].value
        }
        if (items.type === 'update') {
            ajaxUrl = '/sys/userinfo/update';
            /** @namespace $scope.formData.roles */
            angular.forEach($scope.formData.roles, function (value) {
                roleidArr.push(value.roleid)
            })
        }
        //组织机构
        $scope.checkfunsArr = [];
        $.ajax({
            type: 'GET',
            url: '/sys/groupinfo/treelist',
            success: function (data) {
                //console.log(data);
                var jsonstr = '[';
                for (var i = 0; i < data.length; i++) {
                    if (data[i].cancelflag === '0') {
                        jsonstr += '{name:\'' + data[i].groupname + '\',id:' + data[i].groupid + ',selected:' + checkSelected(data[i], items.form);
                        //jsonstr+='label:\''+data[i].funname+'\',funid:'+JSON.stringify(data[i])+',selected:'+checkSelected(data[i].funid,items.form.functions);
                        if (data[i]['childgroupList'] && data[i]['childgroupList'].length > 0) {
                            jsonstr += ',children:[' + aaa(data[i]['childgroupList'], items.form) + ']';
                        }
                        jsonstr += '},';
                    }
                }
                jsonstr = jsonstr.substring(0, jsonstr.length - 1) + ']';
                $scope.stuff = eval(jsonstr);
            }
        });

        function checkSelected(fun, funform) {
            if (fun.groupid === funform.groupid) {
                $scope.groupid = fun.groupname;
                return true;
            }
            return false;
        }

        function aaa(item, funs) {
            var tempjson = '';
            for (var i = 0; i < item.length; i++) {
                if (item[i].cancelflag === '0') {
                    var temppppjson = ',{';
                    temppppjson += 'name:\'' + item[i].groupname + '\',id:' + item[i].groupid + ',selected:' + checkSelected(item[i], funs);
                    //temppppjson += 'label:\''+item[i].funname+'\',funid:'+JSON.stringify(item[i])+',selected:'+checkSelected(item[i].funid,funs);
                    if (item[i]['childgroupList'] && item[i]['childgroupList'].length > 0) {
                        temppppjson += ',children:[' + aaa(item[i]['childgroupList'], funs) + ']';
                    }
                    temppppjson += '}';
                    tempjson += temppppjson;
                }
            }
            return tempjson.substring(1);
        }

        //格式化日期
        if ($scope.formData.logintime) {
            $scope.logintime = commonTools.formatDate($scope.formData.logintime, 'yyyy-MM-dd HH24:mi:ss');
        }

        //角色
        $.ajax({
            url: '/sys/roleinfo/rolelist',
            type: 'GET',
            async: false,
            success: function (data) {
                //console.log(data);
                $scope.availableRoles = data
            }
        });
        $scope.rolesCtrl = function (windowClass, templateUrl, size) {
            var modalInstance = $modal.open({
                windowClass: windowClass,
                templateUrl: templateUrl,
                controller: 'rolesModalInstanceCtrl',
                size: size,
                resolve: { // 把数据传入弹框控制器
                    items: function () {
                        return {
                            selectedRoles: $scope.formData.roles,
                            availableRoles: $scope.availableRoles
                        };
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) { // 确定后操作
                var checkedRoles = [];
                angular.forEach(selectedItem, function (value) {
                    if (value.checked) {
                        checkedRoles.push(value)
                    }
                });
                $scope.formData.roles = checkedRoles;
                console.log($scope.formData);
                //$scope.formData.roles = selectedItem;
            }, function () { // 关闭后操作
                // $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.CustomCallback = function () {
            $scope.formData.groupid = $scope.checkfunsArr[0].id;
            $scope.groupid = $scope.checkfunsArr[0].name
        };
        //初始化密码
        $scope.initNewPwd = function () {
            $scope.formData.newpassword = '123456';
            //$scope.formData.confirmPwd = '123456';
        };
        $scope.initPwd = function () {
            $scope.formData.password = '123456';
            //$scope.formData.confirmPwd = '123456';
        };
        //提交
        $scope.submit = function (isValid, $event) {
            var event = $event || window.event;
            event.preventDefault();
            if (isValid) {
                if ($('#oldpwd').val()) {
                    if (!$('#newpwd').val()) {
                        toaster.pop('error', '新密码不能为空');
                        return false
                    }
                }
                if (!$scope.formData.groupid) {
                    toaster.pop('error', '必须选择组织机构');
                    return false;
                }
                /*if ($scope.formData.roles.length <= 0) {
                    toaster.pop('error', '必须选择角色');
                    return false;
                }*/
                //console.log($scope.formData);
                $.ajax({
                    type: 'POST',
                    url: ajaxUrl,
                    contentType: 'application/json;charset=UTF-8',
                    dataType: 'json',
                    async: false,
                    data: JSON.stringify($scope.formData),
                    success: function (data) {
                        //console.log(data);
                        if (data.success) {
                            $modalInstance.close(data);
                        } else {
                            alert(data.msg)
                        }
                    }
                })
            }
        };//submit end
        //取消
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }//controller end
]);
app.controller('rolesModalInstanceCtrl', function ($scope, $modalInstance, items, toaster) {
    console.log(items);
    $scope.roles = items.availableRoles;
    $scope.selectedItem = items.selectedRoles;
    //$scope.selected={};
    var ids = [];
    for (var a = 0; a < $scope.selectedItem.length; a++) {
        ids.push($scope.selectedItem[a].roleid);
    }
    angular.forEach($scope.roles, function (value) {
        //console.log(id,value.roleid);
        value.checked = ischecked(value.roleid);

        function ischecked(id) {
            var flag = false;
            if (ids.indexOf(id) > -1) {
                flag = true;
            }
            return flag;
        }
    });

    $scope.submit = function () {
        var checkedRole = [];
        angular.forEach($scope.roles,function (value) {
            if(value.checked){
                checkedRole.push(value)
            }
        });
        /*console.log(checkedRole);
        if (checkedRole.length <= 0) {
            toaster.pop('error', '至少选择一个角色');
            return false
        } else {
            $modalInstance.close($scope.roles);
        }*/
        $modalInstance.close($scope.roles);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
app.controller('confirmModalInstanceCtrl', function ($scope, $modalInstance) {

    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});