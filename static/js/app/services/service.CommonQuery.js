app.service('CommonQuery', function ($q, $http, $stateParams) {
    /*--- 通用查询界面查的询条件 ---*/
    this.getAllData = function () {
        return $http({
            method: 'GET',
            url: './statistic/commonquery',
            params: {
                param: $stateParams.param
            }
        }).then(function successCallback(res) {
            // 请求成功执行代码
            return eval(res.data)
        }, function errorCallback(res) {
            // 请求失败执行代码
            return eval(res.data)
        });
    };
    /*--- 日期格式化 ---*/
    this.formatDate = function (date, dateFormat) {
        if (!date) {
            return '';
        }
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
        if (dateFormat === 'yyyy-MM-dd' || !dateFormat) {
            return y + '-' + m + '-' + d
        }
        if (dateFormat === 'yyyy-MM-dd HH24:mi:ss') {
            return y + '-' + m + '-' + d + ' ' + h + ':' + mm + ':' + ss;
        }
    };
    /*--- echarts 参数 ---*/
    this.chartsOptions = function (opts) {
        //console.log(opts);
        if (opts.type === 'pie') {
            return {
                title: {
                    text: opts.title.text,
                    subtext: opts.title.subtext,
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: opts.data
                },
                series: [{
                    name: '',
                    type: 'pie',
                    radius: '55%',
                    center: ['70%', '60%'],
                    data: opts.data,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }]
            }
        } else if (type === 'bar') {
            return {
                title: {
                    text: opts.title.text,
                    subtext: opts.title.subtext,
                    x: 'center'
                },
                tooltip: {},
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: opts.data
                },
                xAxis: {
                    data: opts.xAxis
                },
                yAxis: {},
                series: opts.data
            };
        } else if (type === 'line') {
            return {
                title: {
                    text: opts.title.text,
                    subtext: opts.title.subtext,
                    x: 'center'
                },
                xAxis: {
                    type: 'category',
                    show: true,
                    boundaryGap: false,
                    data: opts.xAxis
                },
                yAxis: {
                    type: 'value'
                },
                series: opts.data
            }
        } else if (type === 'lines') {
            var optionLines = {
                tooltip: {
                    trigger: 'none',
                    axisPointer: {
                        type: 'cross'
                    }
                },
                legend: {
                    data: opts.title.text
                },
                grid: {
                    top: 110,
                    bottom: 50
                    //containLabel: true
                },
                xAxis: opts.xAxis,
                yAxis: [
                    {
                        type: 'log'
                    }
                ],
                series: opts.data
            };
            optionLines.xAxis[0].show = true;
            return optionLines
        }
    }
});