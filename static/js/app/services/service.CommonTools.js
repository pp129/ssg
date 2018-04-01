app.service('commonTools', ['$http', '$q', '$stateParams', function ($http, $q, $stateParams) {
    //未用
    /*this.uploadFileToUrl = function (file, uploadUrl) {
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).success(function () {

        }).error(function () {

        });
    };
    this.serializeData = function (data) {
        // If this is not an object, defer to native stringification.
        if (!angular.isObject(data)) {
            return ((data === null) ? "" : data.toString());
        }
        var buffer = [];
        // Serialize each key in the object.
        for (var name in data) {
            if (!data.hasOwnProperty(name)) {
                continue;
            }
            var value = data[name];
            buffer.push(
                encodeURIComponent(name) + "=" + encodeURIComponent((value === null) ? "" : value)
            );
        }
        // Serialize the buffer and clean it up for transportation.
        var source = buffer.join("&").replace(/%20/g, "+");
        return (source);
    };*/
    /*--- 菜单列表 ---*/
    this.getSubMenu = function () {
        return $http({
            method: 'GET',
            url: '../sys/function/getchildfun',
            params: {
                'parentid': $stateParams.param
            }
        }).then(function successCallback(res) {
            // 请求成功执行代码
            return res.data
        }, function errorCallback(res) {
            // 请求失败执行代码
            return res.data
        });
    };
    /*--- 日期格式化 ---*/
    var formatDate = this.formatDate = function (date, dateFormat) {
        if (date) {
            date = new Date(date);
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            m = m < 10 ? '0' + m : m;
            var d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            var h = date.getHours();
            h = h < 10 ? ('0' + h) : h;
            var mm = date.getMinutes();
            mm = mm < 10 ? ('0' + mm) : mm;
            var ss = date.getSeconds();
            ss = ss < 10 ? ('0' + ss) : ss;
            switch (dateFormat ? dateFormat : '') {
                case 'yyyy-MM-dd':
                    return y + '-' + m + '-' + d;
                case 'YYYY-MM-DD':
                    return y + '-' + m + '-' + d;
                case 'yyyy-MM-dd HH24:mi:ss':
                    return y + '-' + m + '-' + d + ' ' + h + ':' + mm + ':' + ss;
                case 'yyyy-MM-dd HH:mm':
                    return y + '-' + m + '-' + d + ' ' + h + ':' + mm;
                case 'yyyy-MM-dd HH':
                    return y + '-' + m + '-' + d + ' ' + h;
                default:
                    return y + '-' + m + '-' + d;
            }
        } else {
            return ''
        }
    };
    /*--- 日期范围插件的默认参数 ---*/
    this.defaultDateRangeOption = function (dateFormat) {
        var format = '';
        if (dateFormat) {
            format = dateFormat
        } else {
            format = 'yyyy-MM-dd'
        }
        console.log(format);
        return {
            applyClass: 'btn-success',
            format: format,
            clearLabel: '取消',
            locale: {
                separator: "～",
                applyLabel: "确定",
                fromLabel: "起始日期",
                toLabel: "结束日期",
                customRangeLabel: '自定义',
                daysOfWeek: ["日", "一", "二", "三", "四", "五", "六"],
                monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                "firstDay": 1
            },
            ranges: {
                '\u4e00\u5468\u524d': [moment().subtract(6, 'days'), moment()],
                '\u0033\u0030\u5929\u524d': [moment().subtract(29, 'days'), moment()]
            }
        };
    };
    /*--- 一般情况下查询功能 查询条件处理 ---*/
    this.queryData = function (data) {
        var filters = [];
        angular.forEach(data, function (value) {
            if (value.filter) {
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
                        value: formatDate(value.dates.startDate),
                        value2: formatDate(value.dates.endDate),
                        dataformat: 'yyyy-MM-dd'
                    });
                }
            }
        });
        return filters;
    };
    /*--- 树状结构数据处理 ---*/
    var TreeData = [];
    var childNode = '';
    var nodeName = '';
    var nodeID = '';
    var selectedItem;
    var selectedID;
    var selectedName = '';
    this.recursive = function (opts) {
        TreeData = opts.data;
        childNode = opts.childName;
        nodeName = opts.name;
        nodeID = opts.id;
        selectedItem = opts.selectedItem;
        var jsonstr = '[{name:"无",id:0},';
        angular.forEach(TreeData, function (value) {
            jsonstr += '{name:\'' + value[nodeName] + '\',id:' + value[nodeID] + ',selected:' + checkSelected(value);
            if (value[childNode] && value[childNode].length > 0) {
                jsonstr += ',children:[' + aaa(value[childNode]) + ']';
            }
            jsonstr += '},';
        });
        jsonstr = jsonstr.substring(0, jsonstr.length - 1) + ']';
        return {
            tree: jsonstr,
            selectedName: selectedName,
            selectedID: selectedID
        };
    };

    //递归
    function aaa(item) {
        var tempjson = '';
        angular.forEach(item, function (value) {
            var temppppjson = ',{';
            temppppjson += 'name:\'' + value[nodeName] + '\',id:' + value[nodeID] + ',selected:' + checkSelected(value);
            if (value[childNode] && value[childNode].length > 0) {
                temppppjson += ',children:[' + aaa(value[childNode]) + ']';
            }
            temppppjson += '}';
            tempjson += temppppjson
        });
        return tempjson.substring(1);
    }

    //检查是否已选中
    function checkSelected(data) {
        if (selectedItem) {
            if (eval(selectedItem) === data[nodeID]) {
                selectedName = data[nodeName];
                selectedID = data[nodeID];
                return true
            } else {
                return false
            }
        } else {
            return false;
        }
    }
}]);