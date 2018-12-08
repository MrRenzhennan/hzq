var ctmArchive ;
var workBillId ;
var workBill;
var meterId;
var meterKind;
var userinfo = JSON.parse(localStorage.getItem('user_info'));
var ScatteredServe = function(){
	
	return {
        init: function () {
            this.reload();
        },
        reload: function () {
        	//初始化表具类型
			var meterKindEnum={"01":"普表","02":"IC卡气量表","03":"IC卡金额表","04":"代码表","05":"远传表"};
			$.map(meterKindEnum, function (key, val) {
				$('#meterKind').append('<option  value="' + val + '">' + key + '</option>');
			});
			//初始化进气方向
			var directionEnum={"L":"左进","R":"右进"};
			$.map(directionEnum, function (key, val) {
				$('#direction').append('<option  value="' + val + '">' + key + '</option>');
			});
			//初始化规格型号
			$.ajax({
				headers: {
			      'Accept': 'application/json',
			      'Content-Type': 'application/json'
				},
				type: 'get',
				async: false,
				url: hzq_rest+'gasmtrmeterspec',
				success: function (data) {
					for(var o in data){
						$('#meterModelId').append('<option  value="' + data[o].meterModelId + '">' + data[o].meterModelName + '</option>');
					}
			    } 
			})
			//初始化生产厂家
			$.ajax({
				headers: {
			      'Accept': 'application/json',
			      'Content-Type': 'application/json'
				},
				type: 'get',
				async: false,
				url: hzq_rest+'gasmtrfactory',
				success: function (data) {
					for(var o in data){
						$('#factoryId').append('<option  value="' + data[o].factoryId + '">' + data[o].factoryName + '</option>');
					}
			    } 
			})
			
			//获取url传递的参数
			var reg = new RegExp("(^|&)" + "param" + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg);  //匹配目标参数
            workBillId = unescape(r[2]); //返回参数值
            var customerCode;
            //初始化数据
            $.ajax({
				headers: {
			      'Accept': 'application/json',
			      'Content-Type': 'application/json'
				},
				type: 'get',
				async: false,
				url: hzq_rest+'gascsrworkbill/'+workBillId,
				success: function (data) {
					workBill=data;
					customerCode=data.customerCode;
					$("#customerCode").val(data.customerCode);
					$("#customerName").val(data.customerName);
					$("#customerAddress").val(data.customerAddress);
					$("#createdTime").val(data.createdTime);
					$("#sendDate").val(data.sendDate);
					$("#bookingTime").val(data.bookingTime);
			    } 
			})
           
            var xwQuery = RQLBuilder.and([
			    RQLBuilder.equal("customerCode",customerCode)
			]).rql();			
            $.ajax({
				headers: {
			      'Accept': 'application/json',
			      'Content-Type': 'application/json'
				},
				type: 'get',
				async: false,
				url: hzq_rest+'gasctmarchive?query='+xwQuery,
				success: function (data) {
					if(data.length>0){
						ctmArchive= data[0] ;
						$("#idcard").val(data[0].idcard);
						$("#tel").val(data[0].tel);		
					}
			    } 
			}) 
			var xwQuery = RQLBuilder.and([
			    RQLBuilder.equal("unitId",workBill.ownUnit),
			]).rql();
			$.ajax({
				headers: {
			      'Accept': 'application/json',
			      'Content-Type': 'application/json'
				},
				type: 'get',
				async: false,
				url: hzq_rest+'gassysuser?query='+xwQuery,
				success: function (data) {
					console.log(data)
					if(data.length>0){
						for(var o in data){
							$('#sendPerson').append('<option value="' + data[o].userId + '">' + data[o].employeeName + '</option>');
						}
					}
			    } 
			})
			
			var xwQuery = RQLBuilder.and([
			    RQLBuilder.equal("areaId",workBill.areaId),
			    RQLBuilder.equal("stationId","54")
			]).rql();
			$.ajax({
				headers: {
			      'Accept': 'application/json',
			      'Content-Type': 'application/json'
				},
				type: 'get',
				async: false,
				url: hzq_rest+'gassysuser?query='+xwQuery,
				success: function (data) {
					console.log(data)
					if(data.length>0){
						for(var o in data){
							$('#repairer').append('<option value="' + data[o].userId + '">' + data[o].employeeName + '</option>');
						}
					}
			    } 
			})
        }
    }
}()		
function seltwo(){
	 var vs = $('select option:selected').val();	 
	$('#dt').html('')
	if(vs=="5"){		
		$('#dt').append('<div class="input-group-addon">私开表读数：</div><input id="unauthorizedOpeningReading" name="unauthorizedOpeningReading" class="inputclear form-control" type="text" value="">');		
	}else if(vs=="6"){		
		$('#dt').append('<div class="input-group-addon">存在安全隐患：</div><input id="hiddenDanger" name="hiddenDanger" class="inputclear form-control" type="text" value="">');		
	}else{
		$('#dt').html('')
	}	
}

function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
//          + " " + date.getHours() + seperator2 + date.getMinutes()
//          + seperator2 + date.getSeconds();
    return currentdate;
    
}			
var nowdate=getNowFormatDate();
$("#save_btn").click(function(){

    $("select").change(function(){
        $("#meterForm").valid();
    })

    if(!$("#meterForm").valid()){
        return false;
    }
	var arriveTime = $("#arriveTime").val();
    if(!arriveTime){
		bootbox.alert("<br><center>请填写到户时间</center></br>");
		return;
	}else{
		arriveTime=new Date(arriveTime);
	}
    var finishTime = $("#finishTime").val();
    if(!finishTime){
		bootbox.alert("<br><center>请填写维修完成时间</center></br>");
		return;
	}else{
		finishTime=new Date(finishTime);
	}

	//使用restful批量操作接口，保证同一事务控制
	//表具信息录入
    var date = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");


    var unboltJson1 = $("#meterForm").serializeObject();
    if(unboltJson1.reading.length > unboltJson1.meterDigit){
    	bootbox.alert("<h4>表读数长度不能超过表位数，请核实！</h4>");
		return false;
	}
	if(!meterId||meterId==""||meterId=="undefined"){
		bootbox.alert('<div style="text-align:center"><h4>请填写正确的表具编号</h4></div>');
		return false;
	}
	unboltJson1.meterId=meterId;
	var read = $("#reading").val();
	//更新表具状态为上线
	var mtrMeter = {
		"meterId":meterId,
		"reading":read,
		"stockState":"4"
	}
	//插入库存GAS_MTR_STOCK_HISTORY
	var mtrStockHistory={
		"meterId":meterId,
		"createTime":new Date(),
		"stockState":"4",
		"changeDate":new Date(),
		"areaId":ctmArchive.areaId
	}
	var mtrStockHistoryId = $.md5(JSON.stringify(mtrStockHistory)+new Date().getTime());
	mtrStockHistory.stockHistoryId=mtrStockHistoryId;
	//抄表信息录入
	
	var book = queryMdrBook();
	var mrdMeterReading={
		"meterReadingId":"S"+ nowdate + meterId,  
		"operate":"S",
		"meterReading":read,
		"meterId":meterId,
		"chargingMeter":"1",
		"isMrd":"1",
		"dataSource":"1",
		"copyState":"6",
		"chargeMeterReading":0,
		"ctmArchiveId":ctmArchive.ctmArchiveId,
		"bookId":ctmArchive.bookId,
		"areaId":ctmArchive.areaId,
		"copyType":"70",
		"gasTypeId":ctmArchive.gasTypeId,
		"countperId":book.countperId,
		"serviceperId":book.serviceperId,
		"copyTime":new Date(finishTime+"-00:00")
	}
	ctmArchive.customerType="P";
	if(meterKind=="02"){
		mrdMeterReading.remaingAsnum=0;
		ctmArchive.customerType="I";
	}else if(meterKind=="03"){
		mrdMeterReading.cardBalancEsum=0;
		ctmArchive.customerType="I";
	}
	ctmArchive.unboltTime=date;
	ctmArchive.modifiedTime=date;
	ctmArchive.modifiedBy=userinfo.userId;
	//建立ctm_meter关系
	var ctmMeter = {
		"ctmArchiveId":ctmArchive.ctmArchiveId,
		"meterId":meterId,
		"meterUserName":ctmArchive.customerName,
		"meterUserState":"01",
		"gasAlarmFlag":"N",
		"address":ctmArchive.customerAddress,
		"isOnline":"1",
		"meterFlag":"1",
		"unboltTime":date,
		"createdTime":new Date(),
		"modifiedTime":date
	};
	var ctmMeterId = $.md5(JSON.stringify(ctmMeter)+new Date().getTime());
	ctmMeter.ctmMeterId=ctmMeterId;
	
    //更新档案表客户状态为01
    ctmArchive.customerState="01";
    //工单处理结果录入
    var workBillResult = $("#resultForm").serializeObject();
    var hiddenDangerPosition = $("#hiddenDangerPosition").val();
    var noUnboltReason = $("#noUnboltReason").val();
    var unauthorizedOpeningReading = $("#unauthorizedOpeningReading").val();
    var hiddenDanger = $("#hiddenDanger").val();
    var sendPerson = $("#sendPerson").val();
    workBillResult.ctmArchiveId=ctmArchive.ctmArchiveId;
    workBillResult.workBillId=workBillId;
    workBillResult.arriveTime=arriveTime;
    workBillResult.finishTime=finishTime;
    workBillResult.hiddenDangerPosition=hiddenDangerPosition;
    workBillResult.noUnboltReason=noUnboltReason;
    workBillResult.unauthorizedOpeningReading=unauthorizedOpeningReading;
    workBillResult.hiddenDanger=hiddenDanger;
    var csrWorkBillResultId = $.md5(JSON.stringify(workBillResult)+new Date().getTime())
    workBillResult.csrWorkBillResultId = csrWorkBillResultId;
    workBillResult.sendPerson = sendPerson;
    
    //更新工单状态
    workBill.completeDate=date;
    workBill.modifiedTime=date;
    workBill.modifiedBy=userinfo.user_id;
    workBill.billState="3";

	var alarm = $("#alarm").val();
	var alarmType = $("#alarmType").val();
	
	var profitlossapply={
		"ctmArchiveId":ctmArchive.ctmArchiveId,
		"alarm":alarm,
		"alarmType":alarmType
	}
	var meterArchiveId = $.md5(JSON.stringify(profitlossapply)+new Date().getTime())
	profitlossapply.meterArchiveId = meterArchiveId;

    var submitJson = {"sets":[
        {"txid":"1","body":mrdMeterReading,"path":"/gasmrdmeterreading/","method":"POST"},
        {"txid":"2","body":ctmMeter,"path":"/gasctmmeter/","method":"POST"},
        {"txid":"3","body":ctmArchive,"path":"/gasctmarchive/","method":"PUT"},
        {"txid":"4","body":workBillResult,"path":"/gascsrworkbillresult/","method":"POST"},
        {"txid":"5","body":workBill,"path":"/gascsrworkbill/","method":"PUT"},
        {"txid":"6","body":mtrMeter,"path":"/gasmtrmeter/","method":"PUT"},
        {"txid":"7","body":mtrStockHistory,"path":"/gasmtrstockhistory/","method":"POST"}
    ]}

	var brand1 = $("#brand1").val();
	var model1 = $("#model1").val();
	var count1 = $("#count1").val();
	if(brand1!=""||model1!=""||count1!=""){
		var nonrsdtdevicedetail={
			"nonrsdtArchiveId":meterArchiveId,
			"name":"燃气热水器",
			"brand":brand1,
			"model":model1,
			"count":count1
		}
		var nonrsdtdevicedetailid = $.md5(JSON.stringify(nonrsdtdevicedetail)+new Date().getTime())
		nonrsdtdevicedetail.nonrsdtArchiveDetailId = nonrsdtdevicedetailid;
		submitJson.sets.push({"txid":"8","body":nonrsdtdevicedetail,"path":"/gasctmnonrsdtdevicedetail/","method":"POST"});
	}
	var brand2 = $("#brand2").val();
	var model2 = $("#model2").val();
	var count2 = $("#count2").val();
	if(brand2!=""||model2!=""||count2!=""){
		var nonrsdtdevicedetail2={
			"nonrsdtArchiveId":meterArchiveId,
			"name":"燃气热水器",
			"brand":brand2,
			"model":model2,
			"count":count2
		}
		var nonrsdtdevicedetailid2 = $.md5(JSON.stringify(nonrsdtdevicedetail2)+new Date().getTime())
		nonrsdtdevicedetail2.nonrsdtArchiveDetailId = nonrsdtdevicedetailid2;
		submitJson.sets.push({"txid":"9","body":nonrsdtdevicedetail2,"path":"/gasctmnonrsdtdevicedetail/","method":"POST"});
	}
	
	var brand3 = $("#brand3").val();
	var model3 = $("#model3").val();
	var count3 = $("#count3").val();
	if(brand3!=""||model3!=""||count3!=""){
		var nonrsdtdevicedetail3={
			"nonrsdtArchiveId":meterArchiveId,
			"name":"燃气热水器",
			"brand":brand3,
			"model":model3,
			"count":count3
		}
		var nonrsdtdevicedetailid3 = $.md5(JSON.stringify(nonrsdtdevicedetail3)+new Date().getTime())
		nonrsdtdevicedetail3.nonrsdtArchiveDetailId = nonrsdtdevicedetailid3;
		submitJson.sets.push({"txid":"10","body":nonrsdtdevicedetail3,"path":"/gasctmnonrsdtdevicedetail/","method":"POST"});
	}
	var brand4 = $("#brand4").val();
	var model4 = $("#model4").val();
	var count4 = $("#count4").val();
	console.log(count4=="")
	if(brand4!=""||model4!=""||count4!=""){
		var nonrsdtdevicedetail4={
			"nonrsdtArchiveId":meterArchiveId,
			"name":"燃气热水器",
			"brand":brand4,
			"model":model4,
			"count":count4
		}
		var nonrsdtdevicedetailid4 = $.md5(JSON.stringify(nonrsdtdevicedetail4)+new Date().getTime())
		nonrsdtdevicedetail4.nonrsdtArchiveDetailId = nonrsdtdevicedetailid4;
		submitJson.sets.push({"txid":"11","body":nonrsdtdevicedetail4,"path":"/gasctmnonrsdtdevicedetail/","method":"POST"});
	}
	
	var result = Restful.insert("/hzqs/dbc/pbtxs.do?fh=SELDBC0000000J00&resp=bd",submitJson)

    console.log("submit:result:"+JSON.stringify(result));
    console.log(result);


    var retFlag=true;
    // console.log(result.success)
    if(result.success&&result.success==false){
        retFlag=false;
    }else{
        for(var i=0;i<result.results.length;i++){
            if(!result.results[i].result.success){
                retFlag=false;
                break;
            }
        }
    }

    if(retFlag){
        bootbox.alert("提交成功",function(){
            if(workBill.billType=="B_LSKS"){
        		window.location.replace("/serviceManage/dispatching_manage/batch_repair_order_perform.html");
        	}else if(workBill.billType=="WB_LSKS"){
        		window.location.replace("/serviceManage/dispatching_manage/repair_order_perform.html");
        	}
        });

    }else{
        bootbox.alert("提交失败");
    }

})
var queryMdrBook = function(){
	var a;
	$.ajax({
		headers: {
	      'Accept': 'application/json',
	      'Content-Type': 'application/json'
		},
		type: 'get',
		async: false,
		url: hzq_rest+'gasmrdbook/'+ctmArchive.bookId,
		success: function (data) {	
			a= data;
	    } 
	})
	return a;
}



var dychecked = true;
$("#dy").on("click",function(){
    if(dychecked){
        $("#suppressMmho").attr("contenteditable","true");
        $("#suppressQualified").attr("contenteditable","true");
        dychecked =false;
    }else{
        $("#suppressMmho").attr("contenteditable","false");
        $("#suppressQualified").attr("contenteditable","false");
        dychecked =true;
    }
    console.log(dychecked)
})
var zqychecked = true;
$("#zqy").on("click",function(){
    if(zqychecked){
        $("#stovePressureMmho").attr("contenteditable","true");
        zqychecked =false;
    }else{
        $("#stovePressureMmho").attr("contenteditable","false");
        zqychecked =true;
    }
    console.log(zqychecked)
})

$("#meterNo").blur(function(){
	var results = Restful.findNQ(hzq_rest+'gasmtrmeter/?query={"meterNo":"'+$("#meterNo").val()+'"}');
    console.log(results);
    if(results&&results.length>0){
    	var data = results[0];
    	$.each(data, function(key,val) {
    		$("input[name="+key+"]").val(val);
    		$("select[name='"+key+"']").val(val).trigger("change");
    	});
    	meterId=data.meterId;
    	meterKind=data.meterKind;
    }else{
    	bootbox.alert('<center><h4>系统中无此表信息，请对该表具进行开栓补录</h4></center>');
    }
})
$("#cencel_btn").click(function(){
	history.go("-1");
})