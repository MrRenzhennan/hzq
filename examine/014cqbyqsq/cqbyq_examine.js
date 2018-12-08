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
            console.log(obret)
            $('#customerCode').val(obret.customercode);
            $('#customerName').val(obret.customername);
            if(obret.customerkind=="1"){
            	$('#customerKind').val("居民");
            }else if(obret.customerkind=="9"){
            	$('#customerKind').val("非居民");
            }else{
            	$('#customerKind').val("");
            }
            var result = Restful.findNQ(hzq_rest + 'gasctmarchive/?query={"customerCode":"'+obret.customercode+'"}')
            console.log(result[0].ctmarchiveId)
            if(obret.customerKind=='1'){
                // $('#customerKind').val("居民");
                $("#customerMation").html("<a class=\"btn btn-md btn-circle blue information\"  data-kind='" + JSON.stringify(result[0])+"' href=\"javascript:;\">客户详细信息</a>");
                $('#navtab li').data({
                    'ctmArchiveId': result[0].ctmArchiveId,
                    'customerCode': result[0].customerCode,
                    'customerKind': "1"
                });
            }else{
                // $('#customerKind').val("非居民");
                $("#customerMation").html("<a class=\"btn btn-md btn-circle blue noninformation\" data-kind='" + JSON.stringify(result[0])+"' href=\"javascript:;\">客户详细信息</a>");
                $('#navtab1 li').data({
                    'ctmArchiveId': result[0].ctmArchiveId,
                    'customerCode': result[0].customerCode,
                    'customerKind': "9",
                });
            }
            $('#userTel1').val(obret.tel);
            $('#idCard').val(obret.idcard);
            $('#btName').val(obret.busitype);
            $('#customerAddress').val(obret.address);
            // basic info end
            //business info start
            $('#linkman').val(obret.linkman); 
            $('#linktel').val(obret.linktel);
            $('#reason').val(obret.reason);
            $('#linkidcard').val(obret.idcard);
            ctmarchiveid=obret.ctmarchiveid;
            pic(obret.fileId)
        }
    }
}();
var userinfo = JSON.parse(localStorage.getItem('user_info'));
var ctmarchiveid;
var doBusi = function(step){
	if(step.results==0){
		var param = {
			"ctmArchiveId":ctmarchiveid,
			"customerState":"04",
			"modifiedTime":new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00"),
		    "modifiedBy":userinfo.userId
		}
		console.log(param)
		var ret = Restful.update(hzq_rest+"/gasctmarchive",ctmarchiveid,param);
		if(!ret){
			bootbox.alert("更新档案信息信息失败");
		}
		var regid = step.ref_no;
		var register=Restful.getByID(hzq_rest+'gascsrbusiregister',regid);
    	if(register){
    		register.finishDate = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");;
			register.modifiedTime = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");;
			register.billState = "3";
			var ret = Restful.update(hzq_rest+"/gascsrbusiregister",regid,register);
    	}
	}else{
		var regid = step.ref_no;
		var register=Restful.getByID(hzq_rest+'gascsrbusiregister',regid);
    	if(register){
			register.modifiedTime = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");;
			register.billState = "2";
			var ret = Restful.update(hzq_rest+"/gascsrbusiregister",regid,register);
    	}
	}
	
}

var doNext = function(step){
	if(step.results==1){
		var regid = step.ref_no;
		var register=Restful.getByID(hzq_rest+'gascsrbusiregister',regid);
    	if(register){
			register.modifiedTime = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");;
			register.billState = "2";
			var ret = Restful.update(hzq_rest+"/gascsrbusiregister",regid,register);
    	}
	}
	
}
