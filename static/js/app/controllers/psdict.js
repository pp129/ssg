var INTEGER_REGEXP = /^\-?\d*$/;
app.directive('integer', function() {
    return {
        require : 'ngModel',
        link : function(scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function(viewValue) {
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
}).controller('psdict', ['$scope','toaster','$modal','$http','$stateParams','$state','$rootScope','$window',
    function($scope, toaster, $modal, $http, $stateParams, $state,$rootScope,$window) {
    	
		$scope.allData = [{
			cdesc:'类型说明',
			key:'typedesc',
			iscombo:true,
			isdate:false
		}];
		
		//下拉选择处理
	    $scope.querycombo = {} //字典表
	    
        $.ajax({
            url: './common/comdict/comboxData',
            type: 'GET',
            async: false,
            success: function(data) {
                console.log(data)
                $scope.querycombo = {
                	type:data
                }
            }
        });
	   
        var tableData = [];
        var json = '';
        var tableOption = {
            locale: 'zh-CN',
            method: 'GET',
            cache: false,
            contentType: 'application/x-www-form-urlencoded',
            url: './common/comdict/getList',
            //sortable: true,
            //sortOrder:'type asc',
            clickToSelect: true,
            singleSelect: false,
            pagination: true,
            sidePagination: 'server',
            pageNumber: 1,
            pageSize: 10,
            pageList: [10, 15, 20, 25, 50, 100],
            queryParamsType: '',
            queryParams: function(params) {
                var temp = {
                    pagesize: params.pageSize, // 页面大小
                    pageindex: params.pageNumber, // 页码
                    whereJson: json
                };
                return temp;
            },
            onDblClickRow: function(row, $element) {
                rowEdit(row, $element);
            },
            responseHandler: function(res) {
                return {
                    "total": res.total, // 总页数
                    "rows": res.list// 数据
                };
            },
            rowStyle:function(row,index){
            	//['active', 'success', 'info', 'warning', 'danger'];
            	var strclass = "";
                if (row.cancelflag == "无效") {
                    strclass = 'danger';
                } else {
                    return {};
                }
                return { classes: strclass }
            },
            columns: [{
                field: 'index',
                title: '#',
                width: 36,
                halign: 'center',
                align: 'center',
                formatter: function(value, row, index) {
                    return '<div>' + (index + 1) + '</div>';
                }
            }, {
                checkbox: true
            }, {
                field: 'cancelflag',
                title: '有效否',
                halign: 'center',
                align: 'center',
                width:60
            }, {
                field: 'value',
                title: '数据值',
                halign: 'center',
                align: 'left',
            }, {
                field: 'lable',
                title: '标签值',
                halign: 'center',
                align: 'left',
            }, {
                field: 'type',
                title: '字典类型索引',
                halign: 'center',
                align: 'left'
            }, {
                field: 'typedesc',
                title: '类型说明',
                halign: 'center',
                align: 'left',
            }],
            onLoadSuccess:function(data){console.log(data)}
        }
        
        $scope.init = function() {
            $("#table").bootstrapTable(tableOption);
        }
        
        $scope.query = function() {
            var filters = [];
            angular.forEach($scope.allData, function(value, key) {
            	if(value.filter){
    				if (value.iscombo) {
    	                filters.push({
    	                    colname: value.key,
    	                    operator: '=',
    	                    isbetween: false,
    	                    value: value.filter
    	                });
    	            }else{
    	            	filters.push({
    	                    colname: value.key,
    	                    operator: 'like',
    	                    isbetween: false,
    	                    value: '%'+value.filter+'%'
    	                });
    	            }
    			}else if(value.dates){
    				filters.push({
                        colname: value.key,
                        operator: '=',
                        isbetween: true,
                        value: commonTools.formatDate(value.dates.startDate),
                        value2: commonTools.formatDate(value.dates.endDate),
                        dataformat:'yyyy-MM-dd'
                    });
    			}
            });
            json = JSON.stringify(filters)
            $("#table").bootstrapTable('destroy').bootstrapTable(tableOption);
        } // query end
        
        $scope.clear = function(){
        	var filters = [];
        	angular.forEach($scope.allData,function(value,key){
        		if(value.filter){
        			value.filter = null
        		}
        	});
        	json=[]
        	$("#table").bootstrapTable('destroy').bootstrapTable(tableOption);
        }//clear end 
        
        $scope.add = function(windowClass, templateUrl, size) {
            $.ajax({
                url: './common/comdict/edit',
                type: 'GET',
                async: false,
                data: { dictid: '' },
                success: function(data) {
                	console.log(data)
                    $scope.userarr = { form: data,type: 'add' }
                }
            })
            var modalInstance = $modal.open({
                windowClass: windowClass,
                templateUrl: templateUrl,
                controller: 'psdictModalInstanceCtrl',
                size: size,
                resolve: { // 把数据传入弹框控制器
                    items: function() {
                        return $scope.userarr;
                    }
                }
            });
            modalInstance.result.then(function(selectedItem) { // 确定后操作
            	if(selectedItem.success){
            		$("#table").bootstrapTable('destroy').bootstrapTable(tableOption);
            	}
            }, function() { // 关闭后操作
                // $log.info('Modal dismissed at: ' + new Date());
            });
        }//add end
        
        $scope.deleteList = function(){
        	var getSelectedRow = $("#table").bootstrapTable('getAllSelections');
        	var deleteIDs = [];
        	angular.forEach(getSelectedRow,function(value,key){
        		deleteIDs.push(value.dictid);
        	})
        	if(deleteIDs.length<=0){
        		toaster.pop('error', '未选中数据');
        	}else{
        		var modalInstance = $modal.open({
                    windowClass: 'modal-message modal-warning',
                    templateUrl: 'confirm.html',
                    controller: 'confirmModalInstanceCtrl',
                    size: 'sm',
                    resolve: {}
                });
                modalInstance.result.then(function(selectedItem) { // 确定后操作
                	$.ajax({
                        url: './common/comdict/delete',
                        type: 'POST',
                        async: false,
                        data: { sdids : deleteIDs },
                        success: function(data) {
                        	if(data.success){
                        		$("#table").bootstrapTable('destroy').bootstrapTable(tableOption);
                        		toaster.pop('success', '删除成功');
                        	}else{
                        		toaster.pop('error', data.msg);
                        	}
                        }
                    })
                }, function() { // 关闭后操作
                    //console.log(selectedItem)
                    // $log.info('Modal dismissed at: ' + new Date());
                });
        	}
        }//delete end
        
        //失效
        $scope.failure = function(){
        	var getSelectedRow = $("#table").bootstrapTable('getAllSelections');
        	var deleteIDs = [];
        	angular.forEach(getSelectedRow,function(value,key){
        		console.log(getSelectedRow)
        		deleteIDs.push(value.dictid);
        	})
        	if(deleteIDs.length<=0){
        		toaster.pop('error', '未选中数据');
        	}else{
        		var modalInstance = $modal.open({
                    windowClass: 'modal-message modal-warning',
                    templateUrl: 'confirms.html',
                    controller: 'confirmModalInstanceCtrls',
                    size: 'sm',
                    resolve: {}
                });
                modalInstance.result.then(function(selectedItem) { // 确定后操作
                	$.ajax({
                        url: './sys/comdict/invalid',
                        type: 'POST',
                        async: false,
                        data: { sdids : deleteIDs },
                        success: function(data) {
//                        	console.log(data)
                        	if(data.success){
                        		$("#table").bootstrapTable('destroy').bootstrapTable(tableOption);
                        		toaster.pop('success', '失效成功');
                        	}else{
                        		toaster.pop('error', data.msg);
                        	}
                        }
                    })
                }, function() { // 关闭后操作
                    //console.log(selectedItem)
                    // $log.info('Modal dismissed at: ' + new Date());
                });
        	}
        	
        }// end
        
        $scope.batchcancel = function(){
        	var getSelectedRow = $("#table").bootstrapTable('getAllSelections');
        	var ids = [];
        	angular.forEach(getSelectedRow,function(value,key){
        		ids.push(value.dictid);
        	})
        	if(ids.length<=0){
        		toaster.pop('error', '未选择数据');
        		
        	}else if(ids.length>1){
        		toaster.pop('error', '只能选择一条数据恢复');
        	}else{
        		$.ajax({
                    url: './common/comdict/batchcancel',
                    type: 'POST',
                    async: false,
                    data: { ids : ids , cancelflag : 0},
                    success: function(data) {
                    	//console.log(data)
                    	if(data.success){
                    		$("#table").bootstrapTable('destroy').bootstrapTable(tableOption);
                    		toaster.pop('success', '恢复成功');
                    	}else{
                    		toaster.pop('error', data.msg);
                    	}
                    }
                })
        	}
        	
        }//batchcancel end
        
        $scope.edit = function(){
        	var getSelectedRow = $("#table").bootstrapTable('getAllSelections');
        	var ids = [];
        	angular.forEach(getSelectedRow,function(value,key){
        		ids.push(value.dictid);
        	});
        	if(ids.length<=0){
        		toaster.pop('error', '未选择数据');
        	}else if(ids.length>1){
        		toaster.pop('error', '只能选择一条数据编辑');
        	}else{
        		rowEdit(getSelectedRow[0])
        	}
        }
        
        function rowEdit(row, $element) {
            // console.log(row);
        	if($("#editPermit") && $("#editPermit").val()=="1"){
        		$.ajax({
                    url: './common/comdict/edit',
                    type: 'GET',
                    async: false,
                    data: { dictid: row.dictid },
                    success: function(data) {
                    	console.log(data)
                        $scope.userarr = { form: data, type: 'update' }
                    }
                })
                var modalInstance = $modal.open({
                    windowClass: 'edit',
                    templateUrl: 'psdictForm.html',
                    controller: 'psdictModalInstanceCtrl',
                    size: 'lg',
                    resolve: { // 把数据传入弹框控制器
                        items: function() {
                            return $scope.userarr;
                        }
                    }
                });
                modalInstance.result.then(function(selectedItem) { // 确定后操作
                	if(selectedItem.success){
                		$("#table").bootstrapTable('destroy').bootstrapTable(
                                tableOption);
                	}
                }, function() { // 关闭后操作
                    //console.log(selectedItem)
                    // $log.info('Modal dismissed at: ' + new Date());
                });
        	}else{
        		toaster.pop('error', '操作失败','当前帐号没有编辑操纵权限');
        	}
        }// rowEdit end
    
    }//groupInfo controller end
])
app.controller('psdictModalInstanceCtrl', [
    '$scope',
    '$modalInstance',
    'items',
    'toaster',
    'CommonQuery',
    '$modal',
    '$window',
    function($scope, $modalInstance, items, toaster, CommonQuery, $modal,
        $window) {
    	
        console.log(items)
        
        $scope.formData = items.form
        //下拉选择处理
        $scope.combo={}//字典表
        $scope.combox = ['cancelflag'];//字典表索引
        angular.forEach($scope.combox,function(value,key){
        	$.ajax({
                url: './common/comdict/type',
                type: 'GET',
                async: false,
                data: {type:value},
                success: function(data) {
                    $scope.combo[value] = data;
                }
            });
        });
        //console.log($scope.combo)
        if(!$scope.formData.cancelflag){
        	$scope.formData.cancelflag = $scope.combo.cancelflag[0].value
        }
        var ajaxUrl = '';
        $scope.submit = function(isValid, $event) {
            //console.log(items)
            var event = $event || window.event;
            event.preventDefault();
            console.log($scope.formData)
            if (items.type == 'add')
                ajaxUrl = './common/comdict/save'
            if (items.type == 'update')
                ajaxUrl = './common/comdict/update'
            if (isValid) {
                $.ajax({
                    type: 'POST',
                    url: ajaxUrl,
                    contentType:'application/json;charset=UTF-8',
                    dataType:'json',
                    data: JSON.stringify($scope.formData),
                    success: function(data) {
                        console.log(data)
                        if(data.success){
                        	$modalInstance.close(data);
                        }else{
                        	alert(data.msg)
                        }
                    }
                })
            }
        }
        $scope.cancel = function() {
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
app.controller('confirmModalInstanceCtrls', function ($scope, $modalInstance) {
	
	$scope.ok = function () {
		$modalInstance.close();
	};
	
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
});