app.factory('dataDashboard',function($http,$q){
	var service = {};//this obj
	var allData = [];
	$.ajax({
	    type: "GET",
	    //url: './business/crmindex',
	    async: false,
	    success: function(res) {
	    	allData = res;
	    }
	});
	service.getAllData = function(){
		return allData;
	};
	return service;
})
app.factory('transParams', function(){
    return {};
});