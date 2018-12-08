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

            var ctmArchives = Restful.findNQ(hzq_rest + 'gasctmarchive/?query={"customerCode":"'+obret.customerCode+'"}')
            console.log(ctmArchives[0].ctmarchiveId)
            ctmArchive=ctmArchives[0];
            if(obret.customerKind=='1'){
                $('#customerKind').val("居民");
                $("#customerMation").html("<a class=\"btn btn-md btn-circle blue information\"  data-kind='" + JSON.stringify(ctmArchives[0])+"' href=\"javascript:;\">客户详细信息</a>");
                $('#navtab li').data({
                    'ctmArchiveId': ctmArchives[0].ctmArchiveId,
                    'customerCode': ctmArchives[0].customerCode,
                    'customerKind': "1"
                });
            }else{
                $('#customerKind').val("非居民");
                $("#customerMation").html("<a class=\"btn btn-md btn-circle blue noninformation\" data-kind='" + JSON.stringify(ctmArchives[0])+"' href=\"javascript:;\">客户详细信息</a>");
                $('#navtab1 li').data({
                    'ctmArchiveId': ctmArchives[0].ctmArchiveId,
                    'customerCode': ctmArchives[0].customerCode,
                    'customerKind': "9",
                });
            }
            $('#userTel1').val(obret.customerTel);
            $('#idCard').val(obret.idcard);
            $('#btName').val(obret.busitype);
            $('#customerAddress').val(obret.customerAddress);

            // basic info end
            //business info start
            $('#linkman').val(obret.linkman); 
            $('#linktel').val(obret.linktel);
            $('#linkidcard').val(obret.linkidcard);
            $('#reason').val(obret.reason);
            $('#refundMoney').val(obret.money);
            $('#bankCardNo').val(obret.bankCardNo);
            $('#bankCardName').val(obret.bankCardName);
            $('#bankName').val(obret.bankName);
            $('#refundType').val(obret.refundType);
            refundId=obret.refundId;
            pic(obret.fileId)
        }
    }
}();
var userinfo = JSON.parse(localStorage.getItem('user_info'));
var refundId;
var ctmArchive;
var doBusi = function(step){
    var refundData=Restful.getByID(hzq_rest+'gaschgrefund',refundId);
    if(refundData){
        refundData.modifiedTime = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
        refundData.examineTime = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
        refundData.modifiedBy = userinfo.userId;
        refundData.status = (step.results==0?"2":"3");
        var ret = Restful.update(hzq_rest+"/gaschgrefund",refundId,refundData);
    }
    var regid = step.ref_no;
    var register=Restful.getByID(hzq_rest+'gascsrbusiregister',regid);
    if(register){
        register.modifiedTime = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");;
        register.finishDate = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");;
        register.billState = (step.results==0?"3":"2");
        register.modifiedBy = userinfo.userId;
        var ret2 = Restful.update(hzq_rest+"/gascsrbusiregister",regid,register);
    }

}
var doNext = function(step){
	if(step.results==1){
		var param = {
			"refundId":refundId,
			"status":"3",
			"modifiedTime":new Date(moment().format('yyyy-MM-dd hh:mm:ss')+"-00:00"),
			"examineTime":new Date(moment().format('yyyy-MM-dd hh:mm:ss')+"-00:00"),
		    "modifiedBy":userinfo.userId
		}
		var ret = Restful.update(hzq_rest+"/gaschgrefund",refundId,param);
		var regid = step.ref_no;
		var register=Restful.getByID(hzq_rest+'gascsrbusiregister',regid);
    	if(register){
			register.modifiedTime = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");;
			register.finishDate = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");;
			register.modifiedBy = userinfo.userId;
			register.billState = "2";
			var ret2 = Restful.update(hzq_rest+"/gascsrbusiregister",regid,register);
    	}
	}
}

