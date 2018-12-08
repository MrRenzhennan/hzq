var ctmArchive ;
var workBillId ;
var workBill;
var meterId;
var reviseMeterId;
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
				$('#meterKind1').append('<option  value="' + val + '">' + key + '</option>');
			});
			//初始化进气方向
			var directionEnum={"L":"左进","R":"右进"};
			$.map(directionEnum, function (key, val) {
				$('#direction').append('<option  value="' + val + '">' + key + '</option>');
				$('#direction1').append('<option  value="' + val + '">' + key + '</option>');
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
						$('#meterModelId1').append('<option  value="' + data[o].meterModelId + '">' + data[o].meterModelName + '</option>');
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
						$('#factoryId1').append('<option  value="' + data[o].factoryId + '">' + data[o].factoryName + '</option>');
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
			    RQLBuilder.equal("unitId",workBill.ownUnit),
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

	//使用restful批量操作接口，保证同一事务控制
	//表具信息录入
    var date = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");

    var unboltJson1 = $("#meterForm").serializeObject();
    
    if(unboltJson1.reading.length > unboltJson1.meterDigit){
    	bootbox.alert("<center><h4>表读数长度不能超过表位数</h4></center>");
		return false;
	}
	if(!meterId||meterId==""||meterId=="undefined"){
		bootbox.alert('<center><h4>请填写正确的表具编号</h4></center>');
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
		"createTime":date,
		"stockState":"4",
		"changeDate":date,
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
		"copyState":"2",
		"chargeMeterReading":0,
		"ctmArchiveId":ctmArchive.ctmArchiveId,
		"bookId":ctmArchive.bookId,
		"areaId":ctmArchive.areaId,
		"copyType":"70",
		"gasTypeId":ctmArchive.gasTypeId,
		"countperId":book.countperId,
		"serviceperId":book.serviceperId
	}
	ctmArchive.customerType="P";
	if(meterKind=="02"){
		mrdMeterReading.cardBalancEsum=0;
		mrdMeterReading.remaingAsnum=0;
		mrdMeterReading.accumulatedGas;
		ctmArchive.customerType="I";
	}else if(meterKind=="03"){
		mrdMeterReading.cardBalancEsum=0;
		mrdMeterReading.remaingAsnum=0;
		ctmArchive.customerType="I";
	}
	
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
		"createdTime":date,
		"modifiedTime":date
	};
	var ctmMeterId = $.md5(JSON.stringify(ctmMeter)+new Date().getTime());
	ctmMeter.ctmMeterId=ctmMeterId;
	
	//有修正表，抄表需要增加修正表，表户需要加修正表，修正表需要更新状态，修正表需要增加历史出库
	if(reviseMeterId&&reviseMeterId!=""&&reviseMeterId!="undefined"){
		var unboltJson1_1 = $("#meterForm1").serializeObject();
		//更新表具状态为上线
		var mtrMeter1 = {
			"meterId":reviseMeterId,
			"reading":unboltJson1_1.reading,
			"stockState":"4"
		}
		//插入库存GAS_MTR_STOCK_HISTORY
		var mtrStockHistory1={
			"meterId":reviseMeterId,
			"createTime":date,
			"stockState":"4",
			"changeDate":date,
			"areaId":ctmArchive.areaId
		}
		var mtrStockHistoryId = $.md5(JSON.stringify(mtrStockHistory)+new Date().getTime());
		mtrStockHistory1.stockHistoryId=mtrStockHistoryId;
		
		ctmMeter.reviseMeterId=reviseMeterId;
		ctmMeter.meterFlag="";
		
		mrdMeterReading.reviseReading=unboltJson1_1.reading;
	}
	
    //更新档案表客户状态为01
    ctmArchive.customerState="01";
    //工单处理结果录入
    var workBillResult = $("#resultForm").serializeObject();
    var arriveTime = $("#arriveTime").val();
    var finishTime = $("#finishTime").val();
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

    var submitJson;
	if(reviseMeterId&&reviseMeterId!=""&&reviseMeterId!="undefined"){
		submitJson = {"sets":[
	        {"txid":"1","body":mrdMeterReading,"path":"/gasmrdmeterreading/","method":"POST"},
	        {"txid":"2","body":ctmMeter,"path":"/gasctmmeter/","method":"POST"},
	        {"txid":"3","body":ctmArchive,"path":"/gasctmarchive/","method":"PUT"},
	        {"txid":"4","body":workBillResult,"path":"/gascsrworkbillresult/","method":"POST"},
	        {"txid":"5","body":workBill,"path":"/gascsrworkbill/","method":"PUT"},
	        {"txid":"6","body":mtrMeter,"path":"/gasmtrmeter/","method":"PUT"},
	        {"txid":"7","body":mtrStockHistory,"path":"/gasmtrstockhistory/","method":"POST"},
	        {"txid":"8","body":mtrStockHistory1,"path":"/gasmtrstockhistory/","method":"POST"},
	        {"txid":"9","body":mtrMeter1,"path":"/gasmtrmeter/","method":"PUT"}
	    ]}
	}else{
		submitJson = {"sets":[
	        {"txid":"1","body":mrdMeterReading,"path":"/gasmrdmeterreading/","method":"POST"},
	        {"txid":"2","body":ctmMeter,"path":"/gasctmmeter/","method":"POST"},
	        {"txid":"3","body":ctmArchive,"path":"/gasctmarchive/","method":"PUT"},
	        {"txid":"4","body":workBillResult,"path":"/gascsrworkbillresult/","method":"POST"},
	        {"txid":"5","body":workBill,"path":"/gascsrworkbill/","method":"PUT"},
	        {"txid":"6","body":mtrMeter,"path":"/gasmtrmeter/","method":"PUT"},
	        {"txid":"7","body":mtrStockHistory,"path":"/gasmtrstockhistory/","method":"POST"}
	    ]}
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
            window.location.replace("/serviceManage/dispatching_manage/repair_order_perform.html");
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
	if($("#meterNo").val()==""||$("#meterNo").val()=="undefined"){
		bootbox.alert('<div style="text-align:center"><h4>请录入一次表编号</h4></div>');
		return;
	}
	var results = Restful.findNQ(hzq_rest+'gasmtrmeter/?query={"meterNo":"'+$("#meterNo").val()+'"}');
    console.log(results);
    if(results&&results.length>0){
    	var data = results[0];
    	$.each(data, function(key,val) {
    		$("form[name='meterForm'] input[name="+key+"]").val(val);
    		$("form[name='meterForm'] select[name='"+key+"']").val(val).trigger("change");
    	});
    	meterId=data.meterId;
    	meterKind=data.meterKind;
    }else{
    	bootbox.alert('<div style="text-align:center"><h4>系统中无此表信息，请对该表具进行开栓补录</h4></div>');
    }
})
$("#meterNo1").blur(function(){
	if($("#meterNo1").val()==""||$("#meterNo1").val()=="undefined"){
		bootbox.alert('<center><h4>如果该用户使用修正表，请录入修正表编号</h4></center>');
		return;
	}
	var results = Restful.findNQ(hzq_rest+'gasmtrmeter/?query={"meterNo":"'+$("#meterNo1").val()+'"}');
    console.log(results);
    if(results&&results.length>0){
    	var data = results[0];
    	$.each(data, function(key,val) {
    		$("form[name='meterForm1'] input[name="+key+"]").val(val);
    		$("form[name='meterForm1'] select[name='"+key+"']").val(val).trigger("change");
    	});
    	reviseMeterId=data.meterId;
    	meterKind=data.meterKind;
    }else{
    	bootbox.alert('<center><h4>系统中无此表信息，请对该表具进行开栓补录</h4></center>');
    }
})
$("#cencel_btn").click(function(){
	history.go("-1");
})