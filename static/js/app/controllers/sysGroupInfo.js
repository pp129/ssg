app.controller('groupInfo', ['$scope','toaster','$modal',
    function($scope, toaster, $modal) {
    	
        $scope.allData = [{
            cdesc: '机构代码',
            key: 'g.groupcode',
            iscombo:false,
            istree:false
        }, {
            cdesc: '机构名称',
            key: 'g.groupname',
            iscombo:false,
            istree:false
        },{
        	cdesc: '上级机构',
            key: 'g.parentid',
            iscombo:false,
            istree:true
        }];
        
        $scope.searchArr=[];
        $.ajax({
            type: 'GET',
            url: '../sys/groupinfo/treelist',
            success: function(data) {
                var jsonstr='[{name:"无",id:0},';
                for(var i=0;i<data.length;i++){
                	jsonstr+='{name:\''+data[i].groupname+'\',id:'+data[i].groupid;
                	//jsonstr+='label:\''+data[i].funname+'\',funid:'+JSON.stringify(data[i])+',selected:'+checkSelected(data[i].funid,items.form.functions);
                	if(data[i].childgroupList&&data[i].childgroupList.length>0){
                		jsonstr+=',children:['+aaa(data[i].childgroupList)+']';
                	}
                	jsonstr+='},';
    			}
                jsonstr=jsonstr.substring(0,jsonstr.length-1)+']';
                $scope.searchStuff=eval(jsonstr);
            }
        });
    	
        function aaa(item){
        	var tempjson='';
			for(var i=0;i<item.length;i++){
				var temppppjson=',{';
				temppppjson += 'name:\''+item[i].groupname+'\',id:'+item[i].groupid;
				//temppppjson += 'label:\''+item[i].funname+'\',funid:'+JSON.stringify(item[i])+',selected:'+checkSelected(item[i].funid,funs);
				if(item[i].childgroupList&&item[i].childgroupList.length>0){
					temppppjson+=',children:['+aaa(item[i].childgroupList)+']';
				}
				temppppjson+='}';
				tempjson+=temppppjson;
			}
    		return tempjson.substring(1);
    	}
        $scope.SearchCallback = function() {
            //$scope.formData.parentid = $scope.checkfunsArr[0].id
        	$scope.allData[2].filter =JSON.stringify($scope.searchArr[0].id)
            $scope.parentid = $scope.searchArr[0].name
        };
        
        //限制表格高度以保证完整显示
        var winHeight,
        	tableHeight;
        if (window.innerWidth)
        	winHeight = window.innerHeight;
        else if ((document.body) && (document.body.clientHeight))
        	winHeight = document.body.clientHeight;
        if(winHeight<=640){
        	//tableHeight = winHeight-248
        	$scope.screensm = true;
        	$scope.screensmHeight = {
        		"height":"515px"
        	}
        }else if(winHeight>640&&winHeight<=683){
        	//tableHeight = winHeight-220
        	$scope.screensm = true;
        	$scope.screensmHeight = {
        		"height":"555px"
        	}
        }else if(winHeight>683){
        	$scope.screensm = false
        }
        //console.log(winHeight+'------网页高度:360浏览器应该是640，chrome683',tableHeight);
        var json = '';
        var tableOption = {
            locale: 'zh-CN',
            method: 'GET',
            cache: false,
            //height:tableHeight,
            contentType: 'application/x-www-form-urlencoded',
            url: '../sys/groupinfo/pageVoList',
            clickToSelect: true,
            singleSelect: false,
            pagination: true,
            sidePagination: 'server',
            pageNumber: 1,
            pageSize: 10,
            pageList: [10, 15, 20, 25, 50, 100],
            queryParamsType: '',
            queryParams: function(params) {
                return {
                    pagesize: params.pageSize, // 页面大小
                    pageindex: params.pageNumber, // 页码
                    whereJson: json
                }
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
            rowStyle:function(row){
            	//['active', 'success', 'info', 'warning', 'danger'];
            	var strclass = "";
                if (row.cancelflag === "无效") {
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
                field: 'groupcode',
                title: '机构代码',
                halign: 'center',
                align: 'left',
                width:120
            }, {
                field: 'shortname',
                title: '机构简称',
                halign: 'center',
                align: 'left',
                width:160
            }, {
                field: 'groupname',
                title: '机构名称',
                halign: 'center',
                align: 'left',
            }, {
                field: 'grouptype',
                title: '机构类型',
                halign: 'center',
                align: 'left',
                width:110
            }, {
                field: 'parentid',
                title: '上级机构',
                halign: 'center',
                align: 'left',
                width:140
            }, {
                field: 'cancelflag',
                title: '有效否',
                halign: 'center',
                align: 'center',
                width:60
            }],
            onLoadSuccess:function(data){console.log(data)}
        };
        
        $scope.init = function() {
            $("#table").bootstrapTable(tableOption);
        };
        
        $scope.query = function() {
        	var filters = [];
            angular.forEach($scope.allData, function(value) {
            	if(value.filter){
            		//console.log(value)
    				if (value.iscombo || value.istree) {
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
            //console.log(json)
            $("#table").bootstrapTable('destroy').bootstrapTable(tableOption);
        }; // query end
        
        $scope.clear = function(){
        	angular.forEach($scope.allData,function(value){
        		if(value.filter){
        			value.filter = null
        		}
        		if(value.istree){
        			$scope.parentid = null
        		}
        	});
        	json=[];
        	$("#table").bootstrapTable('destroy').bootstrapTable(tableOption);
        };
        
        $scope.add = function(windowClass, templateUrl, size) {
            $.ajax({
                url: '../sys/groupinfo/edit',
                type: 'GET',
                async: false,
                data: { groupid: '' },
                success: function(data) {
                    $scope.userarr = { form: data,type: 'add' }
                }
            });
            var modalInstance = $modal.open({
                windowClass: windowClass,
                templateUrl: templateUrl,
                controller: 'groupModalInstanceCtrl',
                size: size,
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
                // $log.info('Modal dismissed at: ' + new Date());
            });
        };//add end
        
        $scope.deleteList = function(){
        	var getSelectedRow = $("#table").bootstrapTable('getAllSelections');
        	var deleteIDs = [];
        	angular.forEach(getSelectedRow,function(value){
        		deleteIDs.push(value.groupid);
        	});
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
                modalInstance.result.then(function() { // 确定后操作
                	$.ajax({
                        url: '../sys/groupinfo/delete',
                        type: 'POST',
                        async: false,
                        data: { groupids : deleteIDs },
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
        	
        };//delete end
        
        $scope.batchcancel = function(){
        	var getSelectedRow = $("#table").bootstrapTable('getAllSelections');
        	var ids = [];
        	angular.forEach(getSelectedRow,function(value){
        		ids.push(value.groupid);
        	});
        	if(ids.length<=0){
        		toaster.pop('error', '未选择数据');
        		
        	}else if(ids.length>1){
        		toaster.pop('error', '只能选择一条数据恢复');
        	}else{
        		$.ajax({
                    url: '../sys/groupinfo/batchcancel',
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
        };//batchcancel end
        
        $scope.edit = function(){
        	var getSelectedRow = $("#table").bootstrapTable('getAllSelections');
        	var ids = [];
        	angular.forEach(getSelectedRow,function(value){
        		ids.push(value.groupid);
        	});
        	if(ids.length<=0){
        		toaster.pop('error', '未选择数据');
        	}else if(ids.length>1){
        		toaster.pop('error', '只能选择一条数据编辑');
        	}else{
        		rowEdit(getSelectedRow[0])
        	}
        };
        
        function rowEdit(row) {
            // console.log(row);
        	//if($("#editPermit") && $("#editPermit").val()=="1"){
        		$.ajax({
                    url: '../sys/groupinfo/edit',
                    type: 'GET',
                    async: false,
                    data: { groupid: row.groupid },
                    success: function(data) {
                    	//console.log(data)
                        $scope.userarr = { form: data, type: 'update' }
                    }
                });
                var modalInstance = $modal.open({
                    windowClass: 'edit',
                    templateUrl: 'groupForm.html',
                    controller: 'groupModalInstanceCtrl',
                    size: 'lg',
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
                    //console.log(selectedItem)
                    // $log.info('Modal dismissed at: ' + new Date());
                });
        	//}else{
        	//	toaster.pop('error', '操作失败','当前帐号没有编辑操纵权限');
        	//}
            
        }// rowEdit end
    
    }//groupInfo controller end
]);
app.controller('groupModalInstanceCtrl', ['$scope','$modalInstance','items',
    function($scope, $modalInstance, items) {
        console.log(items);
        
	    $scope.formData = items.form;
        $scope.checkfunsArr=[];
        $.ajax({
            type: 'GET',
            url: '../sys/groupinfo/treelist',
            success: function(data) {
                var jsonstr='[{name:"无",id:0},';
                for(var i=0;i<data.length;i++){
                	jsonstr+='{name:\''+data[i].groupname+'\',id:'+data[i].groupid+',selected:'+checkSelected(data[i],items.form);
                	//jsonstr+='label:\''+data[i].funname+'\',funid:'+JSON.stringify(data[i])+',selected:'+checkSelected(data[i].funid,items.form.functions);
                	if(data[i].childgroupList&&data[i].childgroupList.length>0){
                		jsonstr+=',children:['+aaa(data[i].childgroupList,items.form)+']';
                	}
                	jsonstr+='},';
    			}
                jsonstr=jsonstr.substring(0,jsonstr.length-1)+']';
                $scope.stuff=eval(jsonstr);
            }
        });
        function checkSelected(fun,funform){
			if(fun.groupid === funform.parentid){
				$scope.parentid = fun.groupname;
				return true;
			}
    		return false;
    	}
    	
        function aaa(item,funs){
        	var tempjson='';
			for(var i=0;i<item.length;i++){
				var temppppjson=',{';
				temppppjson += 'name:\''+item[i].groupname+'\',id:'+item[i].groupid+',selected:'+checkSelected(item[i],funs);
				//temppppjson += 'label:\''+item[i].funname+'\',funid:'+JSON.stringify(item[i])+',selected:'+checkSelected(item[i].funid,funs);
				if(item[i].childgroupList&&item[i].childgroupList.length>0){
					temppppjson+=',children:['+aaa(item[i].childgroupList,funs)+']';
				}
				temppppjson+='}';
				tempjson+=temppppjson;
			}
    		return tempjson.substring(1);
    	}
        $scope.CustomCallback = function() {
        	//console.log($scope.checkfunsArr)
            $scope.formData.parentid = $scope.checkfunsArr[0].id
            $scope.parentid = $scope.checkfunsArr[0].name
        };
        
        //下拉选择处理
        $scope.combo = {}; //字典表
        $scope.combox = ['cancelflag', 'grouptype']; //字典表索引
        angular.forEach($scope.combox, function(value) {
            $.ajax({
                url: '../common/comdict/type',
                type: 'GET',
                async: false,
                data: { type: value },
                success: function(data) {
                    //console.log(data)
                    $scope.combo[value] = data;
                }
            });
        });
        var ajaxUrl = '';
        if (items.type === 'add'){
        	ajaxUrl = '../sys/groupinfo/add';
        	$scope.formData.cancelflag = $scope.combo.cancelflag[0].value
        }    
        if (items.type === 'update'){
        	ajaxUrl = '../sys/groupinfo/update'
        }
        
        
        if(items.form.parentid){
        	if(items.form.parentid==='0'){
            	$scope.parentid = '无';
            }
        }else{
        	$scope.parentid = '无';
        	$scope.formData.parentid='0';
        }
        
        $scope.submit = function(isValid, $event) {
            var event = $event || window.event;
            event.preventDefault();
            
            if (isValid) {
            	console.log($scope.formData);
                $.ajax({
                    type: 'POST',
                    url: ajaxUrl,
                    contentType:'application/json;charset=UTF-8',
                    dataType:'json',
                    data: JSON.stringify($scope.formData),
                    success: function(data) {
                        if(data.success){
                        	$modalInstance.close(data);
                        }else{
                        	alert(data.msg);
                        	return false
                        }
                    }
                })
            }
        };
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