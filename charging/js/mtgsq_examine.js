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
            $('#remark').val(obret.remark);
            $('#price').val(obret.price);
            $('#price').val(obret.price);
            $('#startDate').val(obret.treatyStartTime);
//          refundId=obret.refundId;

			//根据不同环节判断，显示价格
			if(step.be_role=='MTGSQHTGLYSH'){
				$("#priceid").css("display", "block");
			}else if(step.be_role=='MTGSQYYBZSP'){
				$("#priceid").css("display", "block");
				$("#price").attr('readonly',true);
			}
            pic(obret.fileId)
        }
    }
}();
var userinfo = JSON.parse(localStorage.getItem('user_info'));
var doBusi = function(step){
	var regid = step.ref_no;
	var register=Restful.getByID(hzq_rest+'gascsrbusiregister',regid);
	if(register){
		register.modifiedTime = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");;
		register.billState = (step.results==0?"3":"2");
		register.finishDate = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");;
		register.modifiedBy = userinfo.userId;
		var ret = Restful.update(hzq_rest+"/gascsrbusiregister",regid,register);
	}
	if(step.results==0){
		var gasbllnonrsdtdct=Restful.getByID(hzq_rest+'gasbllnonrsdtdct',regid);
		var gasbllnonrsdtdctctm=Restful.getByID(hzq_rest+'gasbllnonrsdtdctctm',regid);
		var gasbllnonrsdtdctflow=Restful.getByID(hzq_rest+'gasbllnonrsdtdctflow',regid);
		
		gasbllnonrsdtdct.status='1';
		gasbllnonrsdtdct.price1=$("#price").val();
		gasbllnonrsdtdct.modifiedTime=new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
		
		gasbllnonrsdtdctctm.modifiedTime=new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
		gasbllnonrsdtdctctm.status='1';
		
		gasbllnonrsdtdctflow.modifiedTime=new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
		gasbllnonrsdtdctflow.status='2';
		
		var submitJson = {
			"sets":[
				{"txid":"1","body":gasbllnonrsdtdct,"path":"/gasbllnonrsdtdct/","method":"PUT"},
				{"txid":"2","body":gasbllnonrsdtdctctm,"path":"/gasbllnonrsdtdctctm/","method":"PUT"},
				{"txid":"3","body":gasbllnonrsdtdctflow,"path":"/gasbllnonrsdtdctflow/","method":"PUT"}
			]
		}
		
		$.ajax({
	        type: 'POST',
	        url:  "/hzqs/dbc/pbtxs.do?fh=SELDBC0000000J00&resp=bd",
	        dataType: 'json',
	        contentType: "application/json; charset=utf-8",
	        async: false,
	        isMask: true,
	        data: JSON.stringify(submitJson),
	
	        success: function(data) {
				var retFlag=true;
		        for(var i=0;i<data.results.length;i++){
		            if(!data.results[i].result.success){
		                retFlag=false;
		                break;
		            }
		        }
			    if(retFlag){
			    	
			    }else{
			    	var ret2 = Restful.update(hzq_rest+"/gasbllnonrsdtdct",regid,gasbllnonrsdtdct);
		        	var ret3 = Restful.update(hzq_rest+"/gasbllnonrsdtdctctm",regid,gasbllnonrsdtdctctm);
		        	var ret4 = Restful.update(hzq_rest+"/gasbllnonrsdtdctflow",regid,gasbllnonrsdtdctflow);
			    }
	        },
	        error: function(err) {
	        	var ret2 = Restful.update(hzq_rest+"/gasbllnonrsdtdct",regid,gasbllnonrsdtdct);
	        	var ret3 = Restful.update(hzq_rest+"/gasbllnonrsdtdctctm",regid,gasbllnonrsdtdctctm);
	        	var ret4 = Restful.update(hzq_rest+"/gasbllnonrsdtdctflow",regid,gasbllnonrsdtdctflow);
	        }
	    });
				
	}else{
		var gasbllnonrsdtdctflow=Restful.getByID(hzq_rest+'gasbllnonrsdtdctflow',regid);
    	if(gasbllnonrsdtdctflow){
    		gasbllnonrsdtdctflow.modifiedTime=new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
			gasbllnonrsdtdctflow.status='3';
	    	var ret4 = Restful.update(hzq_rest+"/gasbllnonrsdtdctflow",regid,gasbllnonrsdtdctflow);
    	}
	}
}
var doNext = function(step){
	if(step.results==1){
		var regid = step.ref_no;
		var register=Restful.getByID(hzq_rest+'gascsrbusiregister',regid);
    	if(register){
			register.modifiedTime = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
			register.finishDate = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
			register.modifiedBy = userinfo.userId;
			register.billState = "2";
			var ret2 = Restful.update(hzq_rest+"/gascsrbusiregister",regid,register);
			
    	}
    	var gasbllnonrsdtdctflow=Restful.getByID(hzq_rest+'gasbllnonrsdtdctflow',regid);
    	if(gasbllnonrsdtdctflow){
    		gasbllnonrsdtdctflow.modifiedTime=new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
			gasbllnonrsdtdctflow.status='2';
	    	var ret4 = Restful.update(hzq_rest+"/gasbllnonrsdtdctflow",regid,gasbllnonrsdtdctflow);
    	}
    	
	}else{
		if(step.be_role=='MTGSQHTGLYSH'){
			var retstr = JSON.stringify(step.propstr2048);
            var obret =  JSON.parse(JSON.parse(retstr));
            obret.price=$("#price").val();
            var regid = step.ref_no;
			var register=Restful.getByID(hzq_rest+'gascsrbusiregister',regid);
	    	if(register){
				register.modifiedTime = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
				register.modifiedBy = userinfo.userId;
				register.reservedField1 = JSON.stringify(obret);
				var ret2 = Restful.update(hzq_rest+"/gascsrbusiregister",regid,register);
	    	}
		}
	}
}

var doCheck=function(step){
	var price = $("#price").val();
	if(step.be_role=='MTGSQHTGLYSH'){
		if(price){
			var retstr = JSON.stringify(step.propstr2048);
            console.log("retstr="+retstr);
            var obret =  JSON.parse(JSON.parse(retstr));
            obret.price=price;
            //营业部审核环节添加价格，传递进流程
            step.propstr2048=JSON.stringify(obret);
			return false;
		}else{
			bootbox.alert("<br><center><h4>请填写价格</h4></center><br>")
			return true;
		}
	}
	return false;
}
