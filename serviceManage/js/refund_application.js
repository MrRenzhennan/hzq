SideBar.init();
SideBar.activeCurByPage("business_process.html");
var pid;
var xwdata;
var	occurrencetime;
var	customerCode;
var customerAddress;
var customerName;
var customerKind;
var customerTel;
var ctmArchiveId;
var idcard;
var linkman;
var linktel;
var linkidcard;
var bankCardNo;
var bankCardName;
var bankName;
var otherBankName;
var opertor;
var filesid;
var money;
var refundType;
var reason;
var xdata;
var customerKindEmnu={
	"1":"居民",
	"9":"非居民"
}
var userinfo = JSON.parse(localStorage.getItem('user_info'));
$("#idcardread").on("click",function(){
    $.ajax({
        url:'http://127.0.0.1:9000/?data={"cmdheader":{"cmdtype":"23"}}',
        type:"get",
        jsonp: "callfuncname",
        dataType: "JSONP",
        async: false,
        success:function(data){
            console.log(data);
            if(data.result.resultcode !="1"){
                idcardinformation = data.result;
                $(".idcards").val(idcardinformation.code)
                $(".customerNames").val(idcardinformation.name)

            }

        }
    })
})
var bankMap={};
bankMap['工商银行']='工商银行';
bankMap['农业银行']='农业银行';
bankMap['中国银行']='中国银行';
bankMap['建设银行']='建设银行';
bankMap['招商银行']='招商银行';
bankMap['邮政储蓄']='邮政储蓄';
bankMap['交通银行']='交通银行';
bankMap['浦发银行']='浦发银行';
bankMap['光大银行']='光大银行';
bankMap['龙江银行']='龙江银行';
bankMap['哈尔滨银行']='哈尔滨银行';
bankMap['其他银行']='其他银行';
console.log(bankMap)
$.map(bankMap,function(key,val){
	$("#bankName").append('<option  value="' + val + '">' + key + '</option>')
})
$("#bankName").change(function(data){
	if(data.val=="其他银行"){
		$("#otherBank").show();
	}else{
		$("#otherBank").hide();
	}
})
$("#save_btn").click("on",function () {
	xwdata =xw.getTable().getData(true);
    if(!xwdata.rows.length){
    	xwdata =xw.getTable().getData();
    	if(!xwdata.rows.length||xwdata.rows.length>1){
    		bootbox.alert("请选择一个客户");
    		return;
    	}
    }
    
	occurrencetime = new Date().toLocaleString();
	customerCode = xwdata.rows[0].customerCode;
	customerAddress = xwdata.rows[0].customerAddress;
	customerName =xwdata.rows[0].customerName;
	customerKind =xwdata.rows[0].customerKind;
	customerTel =xwdata.rows[0].tel;
	ctmArchiveId =xwdata.rows[0].ctmArchiveId;
	idcard = xwdata.rows[0].idcard;
	
	linkman=$("#linkman").val();
	linktel=$("#linktel").val();
	linkidcard=$("#linkidcard").val();
	bankCardNo=$("#bankCardNo").val();
	bankCardName=$("#bankCardName").val();
	bankName=$("#bankName").val();
	otherBankName=$("#otherBankName").val();
	reason=$("#reason").val();
	refundType=$("#refundType").val();
	money=$("#money").val();
	
	//校验是否有退款记录
	var status=["1","2","4"];
	var xwQuery = RQLBuilder.and([
	    RQLBuilder.equal("customerCode", customerCode),RQLBuilder.condition_fc("status","$in", JSON.stringify(status))
	]).rql();
	var refundData=Restful.findNQ(hzq_rest+'gaschgrefund?query='+xwQuery);
	console.log(refundData)
	if(refundData&&refundData.length>0){
		bootbox.alert("<br><center><h4>该用户已申请退款，请核实退款进度</h4></center><br>");
        return;
	}
	if(!linkman){
        bootbox.alert("<br><center><h4>请填写申请人</h4></center><br>");
        return;
    }
    if(!linktel){
        bootbox.alert("<br><center><h4>请填写申请人电话</h4></center><br>");
        return;
    }
    if(!linkidcard){
        bootbox.alert("<br><center><h4>请填写申请人身份证号码</h4></center><br>");
        return;
    }
    if(!refundType){
        bootbox.alert("<br><center><h4>请填写退款类型</h4></center><br>");
        return;
    }
    if(!reason){
        bootbox.alert("<br><center><h4>请选择申请原因</h4></center><br>");
        return;
    }
    
	
	bankCardNo=$("#bankCardNo").val();
	bankCardName=$("#bankCardName").val();
	bankName=$("#bankName").val();
	otherBankName=$("#otherBankName").val();
	
	if(!bankCardNo){
		bankCardNo="";
	}
	if(!bankCardName){
		bankCardName="";
	}
	if(!bankName){
		bankName="";
		otherBankName="";
	}else{
		if(bankName=="其他银行"){
			if(!otherBankName){
				bootbox.alert("<br><center><h4>请填写其他银行名称</h4></center><br>");
        		return;
			}else{
				bankName=otherBankName;
			}
		}
	}
	
    if (userinfo.employee_name) {
        opertor = userinfo.employee_name;
    } else {
        opertor = userinfo.userId;
    }
	
	var printcontent={
		"occurrencetime":occurrencetime,
        "opertor":opertor,
        "customtype":"客户类型: " + customerKindEmnu[customerKind],
        "customercode":"客户号: " + customerCode,
        "customname":"客户姓名: " + customerName,
        "customtel":"电话: " + (customerTel?customerTel:""),
        "customic":"证件号码: " + (idcard?idcard:""),
        "customaddress":"地址: " + (customerAddress?customerAddress:""),
        "linkman":"申请人: "+linkman,
        "linkidcard":"身份证号码: "+linkidcard,
        "linktel":"申请人电话: "+linktel,
        "reason":"申请原因: "+(reason==1?"用户注销":"暂停用气"),
        "bankcardno":"领款银行账号: "+bankCardNo,
        "bankcardname":"银行账号姓名: "+bankCardName,
        "bankname":"银行名称: "+bankName,
        "refundtype":"退款类型: "+(refundType==1?"燃气费":"垃圾费"),
        "money":"退款金额: "+money,
        "businessname":"退款申请"
	}
    var parameter = {
        "businesstype":"tksq",
        "printcontent":JSON.stringify(printcontent)
    };
    pid=$.md5(JSON.stringify(parameter)+new Date().getTime());
    parameter.pid = pid;
    console.log(parameter)
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: '/hzqs/spt/pbprt.do?fh=PRTSPT0000000J00&resp=bd',
        type:"POST",
        datatype:"json",
        data:JSON.stringify(parameter),
        success:function(e){
			console.log(e)
            if(e.errCode=='1'){
                bootbox.alert("<br><center><h4>保存成功！</h4></center><br>");

                $('.btn-primary').on('click',function(){
                    $('#save_btn').addClass('disabled');
                    $('#print_btn').removeClass('disabled');
                })
            }else{
                bootbox.alert("<br><center><h4>保存失败！</h4></center><br>");
            }
        }
    })
});

$("#print_btn").on('click',function(){
	var urll = 'http://127.0.0.1:9000/';
    var data = {
        "cmdheader": {
            "cmdtype": "17"
        },
        "param": {
            "data": [{"ptid": pid}]
        }
    };
    console.log(pid)
    $.ajax({
		type: 'get',
		url: urll,
		async: false,
		dataType: "JSONP",
		data:"data=" + JSON.stringify(data),
		jsonp: "callfuncname",
		success: function (ret) {
			console.log(ret)
			if (ret.result.resultcode == "0") {
				bootbox.alert("<br><center><h4>打印成功！</h4></center><br>",function(){
                    $('#print_btn').addClass('disabled');
                    $('#submit_btn').removeClass('disabled');
		    	})
			}else {
		        bootbox.alert("<br><center><h4>打印失败！</h4></center><br>");
		    }
	    },
	    error:function(e){
	   		console.log(e);
	   		bootbox.alert("<br><center><h4>打印失败！</h4></center><br>");
	    }
	})
});
$("#refundType").change(function(data){
	var xdata = xw.getTable().getData(true);
    if (!xdata.rows.length) {
        xdata = xw.getTable().getData();
        if (!xdata.rows.length || xdata.rows.length > 1) {
            bootbox.alert("请选择一个客户");
            $("#refundType").val("").trigger("change");
            return;
        }
    }
	if(data.val==1){
		if(xdata.rows[0].customerState!="03"&&xdata.rows[0].customerState!="02"){
			bootbox.alert("</br><center><h4>用户必须暂停用气或拆除用户才能申请退款</h4></center>");
			$('#save_btn').addClass('disabled');
			return;
		}else{
			$('#save_btn').removeClass('disabled');
		}
		var gasBalance = $("#gasBalance").text();
		if(gasBalance>0){
			$("#money").val(gasBalance);
			$('#save_btn').removeClass('disabled');
		}else{
			bootbox.alert("</br><center><h4>用户燃气费账户无余额，不可申请退款</h4></center>");
			$('#save_btn').addClass('disabled');
			return;
		}
	}else if(data.val==2){
		var bageBalance = $("#bageBalance").text();
		if(bageBalance>0){
			$("#money").val(bageBalance);
			$('#save_btn').removeClass('disabled');
		}else{
			bootbox.alert("</br><center><h4>用户垃圾费账户无余额，不可申请退款</h4></center>");
			$('#save_btn').addClass('disabled');
			return;
		}
	}
	console.log($("#refundType").val())
	
})
var onCustomerSelected = function(){
	var xwdata = xw.getTable().getData(true);
	if(!xwdata.rows.length){
    	xwdata =xw.getTable().getData();
    }

	if(xwdata.rows[0].customerState=="03"){
		$("#reason").val("1").trigger("change");
		$("#reason").addClass("disabled");
	}else if(xwdata.rows[0].customerState=="02"){
		$("#reason").val("2").trigger("change");
		$("#reason").addClass("disabled");
	}else{
		$("#reason").val("3").trigger("change");
		$("#reason").addClass("disabled");
	}
}
$("#submit_btn").on('click',function(){
    if(gpypictureId){
        filesid = fileId;
    }else{
        filesid="";
    }
    var refundParam={
        "customerCode":customerCode,
        "ctmArchiveId":ctmArchiveId,
        "money":money,
        "status":"1",
        "refundType":refundType,
        "receiveFlag":"0",
        "createdTime":new Date(moment().format('yyyy-MM-dd hh:mm:ss')+"-00:00"),
        "createdBy":userinfo.userId,
        "modifiedTime":new Date(moment().format('yyyy-MM-dd hh:mm:ss')+"-00:00"),
        "modifiedBy":userinfo.userId,
        "reservedField1":reason,
        "bankCardNo":bankCardNo,
        "bankCardName":bankCardName,
        "bankName":bankName,
        "areaId":xwdata.rows[0].areaId
    }
    var refundId=$.md5(JSON.stringify(refundParam)+new Date().getTime());
    refundParam.refundId=refundId;
    var refundRet = Restful.insert(hzq_rest+"/gaschgrefund/?retobj=2",refundParam);
    if(!refundRet.success){
    	bootbox.alert("<br><center><h4>保存退款信息失败,请重新核实退款信息</h4></center><br>",function(){
            $('#save_btn').removeClass('disabled');
            $('#submit_btn').addClass('disabled');
            return;
    	})
    }
    //发退款流程
    var busiData={
    	"customerCode":customerCode,
    	"customerName":customerName,
    	"customerTel":customerTel,
    	"customerAddress":customerAddress,
    	"idcard":idcard,
    	"customerKind":customerKind,
    	"busitype":"退款申请",
    	"linkman":linkman,
    	"linktel":linktel,
    	"linkidcard":linkidcard,
    	"reason":reason,
    	"money":money,
    	"bankCardNo":bankCardNo,
        "bankCardName":bankCardName,
        "bankName":bankName,
    	"refundId":refundId,
    	"refundType":refundType,
    	"fileId":filesid
    }
    flowjson = {
        "flow_def_id":"TKSQ",
        "ref_no":refundId,
        "be_orgs":userinfo.area_id,
        "operator":userinfo.userId,
        "flow_inst_id":refundId,
        "prop1str64":moment().format("YYYY-MM-DD HH:mm:ss"),
        "prop2str64":customerName+"("+customerCode+")",
        "propstr128":"营业部",
        "propstr2048":busiData,
        "override_exists":false
    }
    //创建业务受理
    var gascsrbusiregister ={};
    gascsrbusiregister.busiRegisterId=refundId;//业务登记ID
    gascsrbusiregister.businessTypeId = "TKSQ";
    gascsrbusiregister.ctmArchiveId=ctmArchiveId;//档案ID
    $.ajax({
        type: 'get',
        url: hzq_rest + 'gasctmmeter/?query={"ctmArchiveId":"'+ctmArchiveId+'"}' ,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (data) {
            if (data[0]) {
                gascsrbusiregister.ctmMeterId=data[0].bookId;
            }
        }
    });
    gascsrbusiregister.areaId=userinfo.area_id;
    gascsrbusiregister.customerCode=customerCode;//客户编号
    gascsrbusiregister.customerName=customerName;//客户姓名
    gascsrbusiregister.customerAddr=customerAddress;//客户地址
    gascsrbusiregister.linkMan=linkman;//联系人
    gascsrbusiregister.linkPhone=linktel;//联系人电话
    gascsrbusiregister.acceptDate=new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");//受理时间
    gascsrbusiregister.flowInstance=refundId;//流程实例ID
    gascsrbusiregister.blankOutSign="N";
    gascsrbusiregister.busiAcceptCode=refundId.substring(20);//受理单号 暂定
    gascsrbusiregister.billState="0";
    gascsrbusiregister.createdTime=new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");//创建时间
    gascsrbusiregister.createdBy=UserInfo.userId();//创建人
    gascsrbusiregister.modifiedTime=new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");//变更时间
    gascsrbusiregister.reservedField1=JSON.stringify(busiData);//预留字段1当初状态
    gascsrbusiregister.reservedField2=filesid;//预留字段2当成业务中文件busiid
    gascsrbusiregister.printId=pid;
    $.ajax({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            url:hzq_rest+ 'gascsrbusiregister',
            type:"POST",
            datatype:"json",
            data:JSON.stringify(gascsrbusiregister),
            success:function(e){

            }
        })
    var flow_result = Restful.insert("/hzqs/psm/pbisn.do?fh=VFLSCGC000000J00&bd={}&resp=bd",flowjson);
    console.log("flow_result:"+JSON.stringify(flowjson));
    console.log("flow_result:"+JSON.stringify(flow_result));
    if(flow_result.retmsg == "SUCCESS:1"){
        
    	bootbox.alert("<br><center><h4>流程提交成功</h4></center><br>",function(){
    		window.location.reload();
    	})
    }else{
         var ss = Restful.delByIDR(hzq_rest + "/gaschgrefund",refundId);
         var ss2 = Restful.delByIDR(hzq_rest + "/gascsrbusiregister",refundId);
         bootbox.alert("<br><center><h4>流程提交失败</h4></center><br>")
    }
});