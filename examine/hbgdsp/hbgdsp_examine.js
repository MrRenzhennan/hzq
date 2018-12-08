var RefundAction=function(){
	return {
        init: function () {
            this.reload();
        },
        reload: function () {
        	console.log(step);
        	var retstr = JSON.stringify(step.propstr2048);
            console.log("retstr="+retstr);
            var obret =  JSON.parse(JSON.parse(retstr));
            $('#customerCode').val(obret.customerCode);
            $('#customerName').val(obret.customerName);

            var result = Restful.findNQ(hzq_rest + 'gasctmarchive/?query={"customerCode":"'+obret.customerCode+'"}')
            console.log(result[0].ctmarchiveId)
            if(obret.customerKind=='1'){
                $('#customerKind').val("居民");
                $("#customerMation").html("<a class=\"btn btn-md btn-circle blue information\"  data-kind='" + JSON.stringify(result[0])+"' href=\"javascript:;\">客户详细信息</a>");
                $('#navtab li').data({
                    'ctmArchiveId': result[0].ctmArchiveId,
                    'customerCode': result[0].customerCode,
                    'customerKind': "1"
                });
            }else{
                $('#customerKind').val("非居民");
                $("#customerMation").html("<a class=\"btn btn-md btn-circle blue noninformation\" data-kind='" + JSON.stringify(result[0])+"' href=\"javascript:;\">客户详细信息</a>");
                $('#navtab1 li').data({
                    'ctmArchiveId': result[0].ctmArchiveId,
                    'customerCode': result[0].customerCode,
                    'customerKind': "9",
                });
            }
            $('#userTel1').val(obret.customerTel);
            $('#idCard').val(obret.idcard);
            $('#btName').val(obret.busitype);
            $('#customerAddress').val(obret.customerAddress);

            // basic info end
            //business info start
            workBillId=obret.workBillId;
            console.log(workBillId);
        }
    }
}();
var userinfo = JSON.parse(localStorage.getItem('user_info'));
var workBillId;
var doBusi = function(step){
	if(step.results=="0"){
		var param = {
			"workBillId":workBillId,
			"billState":"3"
		}
		var ret = Restful.update(hzq_rest+"/gascsrworkbill",workBillId,param);
	}else{
		var param = {
			"workBillId":workBillId,
			"billState":"7"
		}
		var ret = Restful.update(hzq_rest+"/gascsrworkbill",workBillId,param);
		var param2 = {
			"csrWorkBillResultId":workBillId,
			"backReason":step.propstr256
		}
		var ret = Restful.update(hzq_rest+"/gascsrworkbillresult",workBillId,param2);
	}
}
var doNext = function(step){
	if(step.results=="1"){
		var param = {
			"workBillId":workBillId,
			"billState":"7"
		}
		var ret = Restful.update(hzq_rest+"/gascsrworkbill",workBillId,param);
		var param2 = {
			"csrWorkBillResultId":workBillId,
			"backReason":step.propstr256
		}
		var ret = Restful.update(hzq_rest+"/gascsrworkbillresult",workBillId,param2);
	}
}
