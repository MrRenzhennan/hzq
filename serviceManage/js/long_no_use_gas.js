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
var opertor;
var userinfo = JSON.parse(localStorage.getItem('user_info'));
var filesid;
var linkman;
var linktel;
var linkidcard;
var reason;
var customerKindEmnu={
	"1":"居民",
	"9":"非居民"
}
function idcard(data){
    $("#linkman").val(data.name)
    $("#linkidcard").val(data.code)
}
$("#save_btn").click("on",function () {
	
	xwdata =xw.getTable().getData(true);
    if(!xwdata.rows.length){
    	xwdata =xw.getTable().getData();
    	if(!xwdata.rows.length||xwdata.rows.length>1){
    		bootbox.alert("请选择一个客户！");
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
	linkman = $('#linkman').val();
	linktel = $('#linktel').val();
	linkidcard = $('#linkidcard').val();
	reason = $('#reason').val();
    if(userinfo.employee_name){
        opertor = userinfo.employee_name;
    }else{
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
        "linkman":"联系人姓名: " + (linkman?linkman:""),
        "linktel":"联系人电话: " + (linktel?linktel:""),
        "linkidcard":"联系人身份证: " + (linkidcard?linkidcard:""),
        "businessname":"长期不用气申请"
	}
    var parameter = {
        "businesstype": "cqbyq",
        "printcontent": JSON.stringify(printcontent)
    };
    pid=$.md5(JSON.stringify(parameter)+new Date().getTime());
    parameter.pid = pid;
    console.log(JSON.stringify(parameter));
    
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
	   		console.log(e)
	    }
	})
});


$("#submit_btn").on('click',function(){
    if(gpypictureId){
        filesid = fileId;
    }else{
        filesid="";
    }
    if(!xwdata.rows.length){
    	xwdata =xw.getTable().getData();
    	if(!xwdata.rows.length||xwdata.rows.length>1){
    		bootbox.alert("请选择一个客户！");
    		return;
    	}
    }
	var linkman = $('#linkman').val();
	var linktel = $('#linktel').val();
	var linkidcard = $('#linkidcard').val();
	var reason = $('#reason').val();
	
	var busitype;
    var flow_def_id;
    if(customerKind=="1"){
    	busitype="长期不用气申请(居民)";
    	flow_def_id="CQBYQJMSQ";
    }else{
    	busitype="长期不用气申请(非居民)";
    	flow_def_id="CQBYQFJMSQ";
    }
    
	var busiData={
    	"customercode":customerCode,
    	"customername":customerName,
    	"tel":customerTel,
    	"address":customerAddress,
    	"idcard":idcard,
    	"customerkind":customerKind,
    	"busitype":busitype,
    	"linkman":linkman,
    	"linktel":linktel,
    	"reason":reason,
    	"idcard":linkidcard,
    	"fileId":filesid,
    	"ctmarchiveid":ctmArchiveId
    }
    var flow_inst_id=$.md5(JSON.stringify(busiData)+new Date().getTime())
    //创建业务受理
    var gascsrbusiregister ={};
    gascsrbusiregister.busiRegisterId=flow_inst_id;//业务登记ID
    gascsrbusiregister.businessTypeId = "CQBYQSQ";
    gascsrbusiregister.ctmArchiveId=ctmArchiveId;//档案ID
    gascsrbusiregister.ctmMeterId=xwdata.rows[0].bookId;
    gascsrbusiregister.areaId=userinfo.area_id;
    gascsrbusiregister.customerCode=customerCode;//客户编号
    gascsrbusiregister.customerName=customerName;//客户姓名
    gascsrbusiregister.customerAddr=customerAddress;//客户地址
    gascsrbusiregister.linkMan=linkman;//联系人
    gascsrbusiregister.linkPhone=linktel;//联系人电话
    gascsrbusiregister.acceptDate=new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");;//受理时间
    gascsrbusiregister.flowInstance=flow_inst_id;//流程实例ID
    gascsrbusiregister.blankOutSign="N";
    gascsrbusiregister.busiAcceptCode=gascsrbusiregister.busiRegisterId.substring(20);//受理单号 暂定
    gascsrbusiregister.billState="0";
    gascsrbusiregister.createdTime=new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");;//创建时间
    gascsrbusiregister.createdBy=UserInfo.userId();//创建人
    gascsrbusiregister.modifiedTime=new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");;//变更时间
    gascsrbusiregister.reservedField1=JSON.stringify(busiData);//预留字段1当初状态
    gascsrbusiregister.reservedField2=filesid;//预留字段2当成业务中文件busiid
    gascsrbusiregister.printId = pid;//打印id
    //发起流程
    
    
    
    flowjson = {
        "flow_def_id":flow_def_id,
        "ref_no":flow_inst_id,
        "be_orgs":userinfo.area_id,
        "operator":userinfo.userId,
        "flow_inst_id":flow_inst_id,
        "prop1str64":moment().format("YYYY-MM-DD HH:mm:ss"),
        "prop2str64":customerName+"("+customerCode+")",
        "propstr128":"营业部",
        "propstr2048":busiData,
        "override_exists":false
    }
	var busiregresult= Restful.insert(hzq_rest+"gascsrbusiregister",gascsrbusiregister);
    console.log(busiregresult);
    var flow_result = Restful.insert("/hzqs/psm/pbisn.do?fh=VFLSCGC000000J00&bd={}&resp=bd",flowjson);
    if(flow_result.retmsg == "SUCCESS:1"){
        bootbox.alert("<br><center><h4>流程提交成功！</h4></center><br>");
        $('.btn-primary').on('click',function(){
            window.location.reload();
        })
    }else{
    	var ss = Restful.delByIDR(hzq_rest + "/gascsrbusiregister",flow_inst_id);
        bootbox.alert("<br><center><h4>流程提交失败！</h4></center><br>");
    }
});

function onCustomerSelected(customerCode){
	data = xw.getTable().getData(true);
    if (!data.rows.length) {
        data = xw.getTable().getData();
    }
    if(data.rows[0].customerState!="01"){
    	$('#save_btn').addClass('disabled');
    	bootbox.alert("<br><center><h4>只有正常用气的用户才可申请长期不用气</h4></center><br>");
    }else{
    	$('#save_btn').removeClass('disabled');
    }
}
