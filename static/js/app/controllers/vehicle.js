app.controller('vehicle', ['$scope', 'toaster', '$modal','commonTools',
    function ($scope, toaster, $modal,commonTools) {

        $scope.allData = [{
            cdesc: '车队',
            key: 'haulier',
            iscombo: false,
            isdate: false,
            istree: true,
            url:''
        },{
            cdesc: '车号',
            key: 'truckno',
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
            url: '/common/truckno/page',
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
                field: 'flag',
                title: '有效否',
                halign: 'center',
                align: 'center'
            }, {
                field: 'haulier',
                title: '车队',
                halign: 'center',
                align: 'left'
            }, {
                field: 'truckno',
                title: '车号',
                halign: 'center',
                align: 'center'
            }, {
                field: 'trstatus',
                title: '车辆状态',
                halign: 'center',
                align: 'center'
            }, {
                field: 'trmodel',
                title: '车型',
                halign: 'center',
                align: 'center'
            }, {
                field: 'maketime',
                title: '登记时间',
                halign: 'center',
                align: 'center'
            }, {
                field: 'makeman',
                title: '登记人',
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
        
        //打开车队弹框
        $scope.open = function(item,windowClass,templateUrl, size){
        	console.log(item)
        	item = eval("("+item+")")
            console.log(item)
        	var modalInstance = $modal.open({
                windowClass: windowClass,
                templateUrl: templateUrl,
                controller: 'searchModalCtrl',
                size: size,
                resolve: { // 把数据传入弹框控制器
                    items: function() {
                        return item
                    }
                }
            });
            modalInstance.result.then(function(selectedItem) { // 确定后操作
//            	if(selectedItem.success){
//            		$("#table").bootstrapTable('destroy').bootstrapTable(tableOption);
//            	}
            	console.log(selectedItem,item);
            	angular.forEach($scope.allData,function (value) {
                    if(value.key===item.key){
                        value.filter =selectedItem.value;
                        value.value = selectedItem.name;
                    }
//                    console.log(value)
                })

            }, function() { // 关闭后操作
//                 $log.info('Modal dismissed at: ' + new Date());
            });
        }

        $scope.add = function (all,windowClass, templateUrl, size) {
        	console.log(all)               //全部数据
        	all = eval("("+all+")")
//        	console.log(all)
            var modalInstance = $modal.open({
                windowClass: windowClass,
                templateUrl: templateUrl,
                controller: 'funModalInstanceCtrl',
                size: size,
                resolve: { // 把数据传入弹框控制器
                    items: function () {
                        return {type: 'add',all: all};
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
                deleteIDs.push(value.trucknoid);
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
                        url: '../common/truckno/delete',
                        type: 'POST',
                        async: false,
                        data: {trucknoids: deleteIDs},
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
                ids.push(value.trucknoid);
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
                url: '../common/truckno/edit',
                type: 'GET',
                async: false,
                data: {trucknoid: row.trucknoid},
                success: function (data) {
                	console.log(data);
                    $scope.userarr = {form: data, type: 'update',all:$scope.allData}
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
app.controller('funModalInstanceCtrl', ['$scope', '$modalInstance', 'items','$modal',
    function ($scope, $modalInstance, items,$modal) {
        console.log(items.all[1]);
        $scope.track = items.all[1];
        var ajaxUrl = '';
        $scope.disabled = false;
        $scope.formData = {};
        if (items.type === 'add') {
            ajaxUrl = '../common/truckno/save';
        } else if (items.type === 'update') {
            ajaxUrl = '../common/truckno/update';
            $scope.formData = items.form;
            $scope.disabled = true;
        }
        
        //打开车队弹框
        $scope.open = function(track,windowClass,templateUrl, size){
        	console.log(track)
        	track = eval("("+track+")")
            console.log(track)
        	var modalInstance = $modal.open({
                windowClass: windowClass,
                templateUrl: templateUrl,
                controller: 'searchModalCtrl',
                size: size,
                resolve: { // 把数据传入弹框控制器
                    items: function() {
                        return track
                    }
                }
            });
            modalInstance.result.then(function(selectedItem) { // 确定后操作
//            	if(selectedItem.success){
//            		$("#table").bootstrapTable('destroy').bootstrapTable(tableOption);
//            	}
            	console.log(selectedItem,item);
            	angular.forEach($scope.allData,function (value) {
                    if(value.key===item.key){
                        value.filter =selectedItem.value;
                        value.value = selectedItem.name;
                    }
//                    console.log(value)
                })

            }, function() { // 关闭后操作
//                 $log.info('Modal dismissed at: ' + new Date());
            });
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
//车队弹框 
app.controller('searchModalCtrl', ['$scope', '$modalInstance', 'items', 'toaster', 'commonTools',
    function ($scope, $modalInstance, items, toaster, commonTools) {
       var data = items;
       console.log(data)
//        $scope.boxWidth = function (item) {
//            item = eval('[' + item + ']')[0];
//            if (item.isdate || item.istree) {
//                return {
//                    "width": "250px"
//                }
//            } else {
//                return {
//                    "width": "180px"
//                }
//            }
//        };
//        var tableTata=[];
//        var cols=[];
//       $.ajax({
//    	   url:data.url,
//    	   data:data.key,
//    	   type:'get',
//    	   async:false,
//    	   success:function(res){
////    		   var data=JSON.stringify(data);
////    		   console.log(res);
//    		   tableTata = res;
//               cols = [{
//                   field: 'index',
//                   title: '#',
//                   width: 36,
//                   halign: 'center',
//                   align: 'center',
//                   formatter: function (value, row, index) {
//                       return '<div>' + (index + 1) + '</div>';
//                   }
//               }, {
//                   checkbox: true
//               }];
//               if(data.vessel){
//                   cols.push({
//                       field: 'vesselcn',
//                       title:data.cdesc,
//                       halign: 'center',
//                       align: 'center'
//                   })
//               }else{
//                   cols.push({
//                       field: 'abbname',
//                       title:data.cdesc,
//                       halign: 'center',
//                       align: 'center'
//                   })
//               }
//
//    	   }
//       })
//        //table options
//        var filters = [];
//        filters.push({
//            colname: 'cancelflag',
//            operator: '=',
//            isbetween: false,
//            value: '0'
//        });
//        var json = JSON.stringify(filters);
//        var tableOption = {
//            locale: 'zh-CN',
//            clickToSelect: true,
//            singleSelect: true,
//            pagination: true,
//            pageNumber: 1,
//            pageSize: 10,
//            pageList: [10, 15, 20, 25, 50, 100],
//            columns: cols,     //调用cols
//            data:tableTata
//        };
//        $scope.userInit = function () {
//            $("#tableDisInfo").bootstrapTable(tableOption);
//        };
//        $scope.submit = function () {
//            var getSelectedRow = $("#tableDisInfo").bootstrapTable('getAllSelections');
//            console.log(getSelectedRow)
//            if(getSelectedRow.length <= 0){
//                toaster.pop('error', '未选择');
//                return false
//            }
//            var output={};
//            if(data.vessel){
//                output = {
//                    name:getSelectedRow[0].vesselcn,
//                    value:getSelectedRow[0].vessel
//                }
//            }else{
//                output = {
//                    name:getSelectedRow[0].abbname,
//                    value:getSelectedRow[0].client
//                }
//            }
//            if (getSelectedRow.length > 0) {
//                    $modalInstance.close(output);
//            }
//        };
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