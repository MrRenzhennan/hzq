var archiveId = "";
var booktable;
var refundArray = new Array();
var filesid;
var xwdata;
var userinfo = JSON.parse(localStorage.getItem('user_info'));
var pid;
var customerKindEmnu={
	"1":"居民",
	"9":"非居民"
}
var refundType = {
    "1": "燃气费退款",
    "2": "垃圾费退款"
}
var staus = {
    "1": "申请中",
    "2": "审批通过",
    "3": "审批拒绝",
    "4": "已领取"
}
var receive = {
    "0": "未领取",
    "1": "已领取"
}

var chargeunitid = Restful.findNQ(hzq_rest+'gassysuser/?query={"userId":"'+userinfo.userId+'"}')[0].chargeUnitId;
console.log(chargeunitid)

var xw1;
var refund;
var refundrows;
var checkCustomerCode;
var onCustomerSelected = function(customerCodeS){
	checkCustomerCode=customerCodeS
    $("#money").val("");
    $("#refundType").val("");
	$("#divtabless").html("")
	xw1 = XWATable.init({
		divname: "divtabless",
		//----------------table的选项-------
		pageSize: 10,
		columnPicker: true,
		transition: 'fade',
		checkboxes: true,
		sorting:true,
		checkAllToggle: false,
		//----------------基本restful地址---
		restbase: 'gaschgrefund?query={"customerCode":"'+customerCodeS+'"}',
		key_column: 'refundId',
		coldefs: [
			{
				col: "refundId",
				friendly: "refundId",
				unique: true,
				hidden: true,
				nonedit: "nosend",
				readonly: "readonly",
				sorting: true,
				index: 1
			},
			{
				col: "customerCode",
				friendly: "客户编号",
				readonly: "readonly",
				sorting: true,
				index: 2
			},
			{
				col: "refundType",
				friendly: "退款类型",
				sorting: true,
				readonly: "readonly",
				format:{
					f:function(val,row,cell){
						if(val == "1"){
							return "燃气费";
						}else if(val == "2"){
							return "垃圾费";
						}else {
							return "-";
						}
					}
				},
				index: 3
			},
			{
				col: "status",
				friendly: "退款状态",
				sorting: true,
				readonly: "readonly",
				format:{
					f:function(val,row,cell){
						if(val == "1"){
							return "申请中";
						}else if(val == "2"){
							return "审批通过";
						}else if(val == "3"){
							return "审批未通过";
						}else{
							return "-";
						}
					}
				},
				index: 4
			},
			{
				col: "money",
				friendly: "退款金额",
				sorting: true,
				index: 5
			},
			{
				col: "receiveFlag",
				friendly: "是否领取",
				sorting: true,
				index: 5,
				format:{
					f:function(val,row,cell){
						if(val == "1"){
							return "是";
						}else{
							return "否";
						}
					}
				}
			}
		]
		,
		findFilter: function () {//find function
		}
	});
    $("#divtabless").prepend("<p>请选择一条记录   <button id='confirm_btnss' class='btn blue'>确定</button></p>");
}
$(document).on("click","#confirm_btnss",function(){
    var datass = xw1.getTable().getData(true);

    if (datass.rows.length == 0) {
        bootbox.alert("<br><center><h4>请选择一条数据！</h4></center><br>");
        return false;
    }
    if (datass.rows.length > 1) {
        bootbox.alert("<br><center><h4>只能选择一行！</h4></center><br>");
        return false;
    }

    if (datass.rows.length == 1) {

        if(datass.rows[0].receiveFlag == "1") {
            bootbox.alert("<center><h4>已领取的退款申请不可重复领取。</h4></center>")
            return false;
        }else if(datass.rows[0].reservedField2 != "1"){
			bootbox.alert("<center><h4>请先去营业部进行退款领取登记。</h4></center>")
			return false;
		}else if(datass.rows[0].status != "2"){
			bootbox.alert("<center><h4>审批未通过的退款申请不可领取。</h4></center>")
			return false;
		}else if(datass.rows[0].customerCode!=checkCustomerCode) {
            bootbox.alert("<center><h4>当前客户号与选择的退款信息不符。</h4></center>")
            return false;
        }else{
            refund = datass.rows[0];
            console.log(datass.rows[0]);
            refundrows = datass.rows.length;
            $("#refundType").val(datass.rows[0].refundType).trigger("change")
            $("#money").val(datass.rows[0].money)
		}


    }
})
$(document).on("click","#save_btn",function(){
	console.log(refundrows)
	if(!refundrows){
		bootbox.alert("<center><h4>请选择退款申请。</h4></center>")
		return false;
	}else{
		
		xwdata =xw.getTable().getData(true);
	    if(!xwdata.rows.length){
	    	xwdata =xw.getTable().getData();
	    	if(!xwdata.rows.length||xwdata.rows.length>1){
	    		bootbox.alert("请选择一个客户");
	    		return;
	    	}
	    }
    
	var occurrencetime = new Date().toLocaleString();
	var customerCode = xwdata.rows[0].customerCode;
	var customerAddress = xwdata.rows[0].customerAddress;
	var customerName =xwdata.rows[0].customerName;
	var customerKind =xwdata.rows[0].customerKind;
	var customerTel =xwdata.rows[0].tel;
	var idcard = xwdata.rows[0].idcard;
	
	var linkman=$("#receiveName").val();
	var linktel=$("#receiveTel").val();
	var linkidcard=$("#receiveCardNo").val();
	var ischecked=$("#ischecked").val();
	var refundType=$("#refundType").val();
	var receiveWay=$("#receiveWay").val();
	var money=$("#money").val();
	
	if(!linkman){
        bootbox.alert("<br><center><h4>请填写领款人姓名</h4></center><br>");
        return;
    }
    if(!linktel){
        bootbox.alert("<br><center><h4>请填写领款人电话</h4></center><br>");
        return;
    }
    if(!linkidcard){
        bootbox.alert("<br><center><h4>请填写领款人身份证号码</h4></center><br>");
        return;
    }
    if(!receiveWay){
        bootbox.alert("<br><center><h4>请选择领取方式</h4></center><br>");
        return;
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
        "linkman":"领款人姓名: "+linkman,
        "linkidcard":"领款人身份证号码: "+linkidcard,
        "linktel":"领款人电话: "+linktel,
        "ischecked":"是否委托: "+(ischecked==1?"是":"否"),
        "receiveway":"领款方式: "+(receiveWay==1?"银行转账":"现金"),
        "refundtype":"领款类型: "+(refundType==1?"燃气费":"垃圾费"),
        "money":"领取金额: "+money,
        "businessname":"退款领取登记"
	}
    var parameter = {
        "businesstype":"tklqdj",
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
		
		
		$("#save_btn").addClass("disabled")
		$("#submit_btn").removeClass("disabled")
		$("#print_btn").removeClass("disabled")
	}
})
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
$(document).on("click","#submit_btn",function(){
    xwdata =xw.getTable().getData(true);
    if(!xwdata.rows.length){
        xwdata =xw.getTable().getData();
        if(!xwdata.rows.length||xwdata.rows.length>1){
            bootbox.alert("请选择一个客户！");
            return;
        }
    }
    if(gpypictureId){
        filesid = fileId;
    }else{
        filesid="";
    }
    console.log(xwdata)
	var ischecked;
	if($("#ischecked").is(":checked")){
        ischecked = "1"
	}else{
        ischecked="0"
	}
	var reservedField1={
        "isEntrust":ischecked,
		"receiveName":$("#receiveName").val(),
        "receiveCardNo":$("#receiveCardNo").val(),
		"receiveTel":$("#receiveTel").val(),
        "refundType":$("#refundType").val(),
		"receiveWay":$("#receiveWay").val(),
        "money":$("#money").val(),
		"remark":$("#remark").val(),
		"receiveFlag":"1",
        "modifiedBy":userinfo.userId,
        "receiveTime":new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00")
	}
	//退燃气费
//	if(reservedField1.refundType == "1"){
//      var account;
//      var par3 = {
//          "cols":"b.chg_account_id,b.gasfee_account_id,b.ic_balance",
//          "froms":"gas_chg_account a,gas_act_gasfee_account b",
//          "wheres":"a.chg_account_id=b.chg_account_id and a.ctm_archive_id='"+xwdata.rows[0].ctmArchiveId+"'",
//          "page":true,
//          "limit":1
//      }
//      var accountRet=Restful.insert("/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",par3);
//
//      if(accountRet&&accountRet.rows&&accountRet.rows.length>0){
//          account=accountRet.rows[0];
//      }
//      console.log(account)
//      var gasatl = {
//          "gasfeeAccountId":account.gasfeeAccountId,
//          "chgAccountId":account.chgAccountId,
//          "customerCode":xwdata.rows[0].customerCode,
//          "tradeType":"RFD",
//          "tradeTypeDesc":"RFDRESIVE",
//          "money":-(Number(reservedField1.money)),
//          "clrTag":"0",
//          "createTime":new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00"),
//          "modifiedTime":new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00"),
//          "tradeDate":new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00"),
//          "createdBy":userinfo.userId,
//          "modifiedBy":userinfo.userId,
//          "userId":userinfo.userId,
//          "areaId":xwdata.rows[0].areaId,
//          "chargeUnitId":chargeunitid,
//          "customerKind":xwdata.rows[0].customerKind,
//          "gasTypeId":xwdata.rows[0].gasTypeId,
//          "customerType":xwdata.rows[0].customerType
//      }
//      console.log(gasatl)
//	}else if(reservedField1.refundType == "2"){
//      //退垃圾费
//      var accountwas;
//      var par2 = {
//          "cols":"b.chg_account_id,b.wastefee_account_id",
//          "froms":"gas_chg_account a,gas_act_wastefee_account b",
//          "wheres":"a.chg_account_id=b.chg_account_id and a.ctm_archive_id='"+xwdata.rows[0].ctmArchiveId+"'",
//          "page":true,
//          "limit":1
//      }
//      var accountRetwas=Restful.insert("/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",par2);
//
//      if(accountRetwas&&accountRetwas.rows&&accountRetwas.rows.length>0){
//          accountwas=accountRetwas.rows[0];
//      }
//      console.log(accountwas)
//      var wasatl = {
//          "wastefeeAccountId":accountwas.wastefeeAccountId,
//          "chgAccountId":accountwas.chgAccountId,
//          "customerCode":xwdata.rows[0].customerCode,
//          "tradeType":"RFD",
//          "tradeTypeDesc":"RFDRESIVE",
//          "money":-(Number(reservedField1.money)),
//          "clrTag":"0",
//          "createTime":new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00"),
//          "modifiedTime":new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00"),
//          "tradeDate":new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00"),
//          "createdBy":userinfo.userId,
//          "modifiedBy":userinfo.userId,
//          "userId":userinfo.userId,
//          "areaId":xwdata.rows[0].areaId,
//          "chargeUnitId":chargeunitid,
//          "customerKind":xwdata.rows[0].customerKind,
//          "gasTypeId":xwdata.rows[0].gasTypeId,
//          "customerType":xwdata.rows[0].customerType
//      }
//      console.log(wasatl);
//  }

    var flow_inst_id=$.md5(Math.random()+new Date().getTime())
    //创建业务受理
    var gascsrbusiregister ={};
    gascsrbusiregister.busiRegisterId=flow_inst_id;//业务登记ID
    gascsrbusiregister.businessTypeId = "TKLQ";
    gascsrbusiregister.ctmArchiveId=xwdata.rows[0].ctmArchiveId;//档案ID
    gascsrbusiregister.ctmMeterId=xwdata.rows[0].bookId;
    gascsrbusiregister.areaId=userinfo.area_id;
    gascsrbusiregister.customerCode=xwdata.rows[0].customerCode;//客户编号
    gascsrbusiregister.customerName=xwdata.rows[0].customerName;//客户姓名
    gascsrbusiregister.customerAddr=xwdata.rows[0].customerAddress;//客户地址
    gascsrbusiregister.description=$("#remark").val();//备注
    gascsrbusiregister.linkMan=$("#receiveName").val();//联系人
    gascsrbusiregister.linkPhone=$("#receiveTel").val();//联系人电话
    gascsrbusiregister.acceptDate=new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");;//受理时间
    gascsrbusiregister.flowInstance="";//流程实例ID
    gascsrbusiregister.blankOutSign="N";
    gascsrbusiregister.busiAcceptCode = gascsrbusiregister.busiRegisterId.substring(20);//受理单号 暂定
    gascsrbusiregister.billState="3";
    gascsrbusiregister.finishDate=new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
    gascsrbusiregister.createdTime=new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");//创建时间
    gascsrbusiregister.createdBy=UserInfo.userId();//创建人
    gascsrbusiregister.modifiedTime=new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");//变更时间
    gascsrbusiregister.reservedField1=JSON.stringify(reservedField1);//预留字段1当初状态
    gascsrbusiregister.reservedField2=filesid;//预留字段2当成业务中文件busiid
    gascsrbusiregister.printId = pid;//打印id
	console.log(gascsrbusiregister)

	console.log(refund)
    if(reservedField1.refundType == "1"){
        var submitJson = {"sets":[
            {"txid":"1","body":gascsrbusiregister,"path":"/gascsrbusiregister/","method":"post"},
//          {"txid":"2","body":gasatl,"path":"/gasactgasfeeatl/","method":"post"},
            {"txid":"3","body":reservedField1,"path":"/gaschgrefund/"+ refund.refundId,"method":"put"},
        ]};
	}else if(reservedField1.refundType == "2") {
        var submitJson = {"sets":[
            {"txid":"1","body":gascsrbusiregister,"path":"/gascsrbusiregister/","method":"post"},
//          {"txid":"2","body":wasatl,"path":"/gasactwastefeeatl/","method":"post"},
            {"txid":"3","body":reservedField1,"path":"/gaschgrefund/"+ refund.refundId,"method":"put"},
        ]};
    }

    console.log("submit::"+JSON.stringify(submitJson));

    var result = Restful.insert("/hzqs/dbc/pbtxs.do?fh=SELDBC0000000J00&resp=bd",submitJson);

    if(result.success == false){
        bootbox.alert("提交失败");
        return false;
    }else if(result.success == undefined){
        if(result.results[0]["result"]['success']) {
            bootbox.alert("提交成功", function () {
                window.location.reload();
            });
        }
    }

})
