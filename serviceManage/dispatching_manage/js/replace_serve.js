var ctmArchive ;
var ctmMeter ;
var workBillId ;
var workBill;
var mrdMeterReading;
var meterId;
var reviseMeterId="";
var meterKind;
var ctmHouse;
var downMeter;
var downReviseMeter;
var date=new Date();
var userinfo = JSON.parse(localStorage.getItem('user_info'));
var changeMeterReason={
    	"0":"故障",
    	"1":"维修",
    	"2":"检表",
        "3":"改造",
        "4":"慢表",
        "5":"表堵",
        "6":"漏气",
        "7":"变向",
        "8":"变容",
        "9":"改型",
        "10":"死表",
        "11":"快表",
        "12":"窃气",
        "13":"A级表",
        "14":"超期表",
        "15":"开栓换表",
        "16":"其他"    }
var ScatteredServe = function(){
	return {
        init: function () {
            this.reload();
        },
        reload: function () {
        	//初始化表具类型
			var meterKindEnum={"01":"普表","02":"IC卡气量表","03":"IC卡金额表","04":"代码表","05":"远传表"};
			$.map(meterKindEnum, function (key, val) {
				$('#newMeterKind').append('<option  value="' + val + '">' + key + '</option>');
			});
			//初始化进气方向
			var directionEnum={"L":"左进","R":"右进"};
			$.map(directionEnum, function (key, val) {
				$('#oldDirection').append('<option  value="' + val + '">' + key + '</option>');
				$('#newDirection').append('<option  value="' + val + '">' + key + '</option>');
			});
			$.map(changeMeterReason, function (key, val) {
				$('#changeMeterReason').append('<option  value="' + val + '">' + key + '</option>');
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
						$('#oldMeterModelId').append('<option  value="' + data[o].meterModelId + '">' + data[o].meterModelName + '</option>');
						$('#oldReviseMeterModelId').append('<option  value="' + data[o].meterModelId + '">' + data[o].meterModelName + '</option>');
						$('#newMeterModelId').append('<option  value="' + data[o].meterModelId + '">' + data[o].meterModelName + '</option>');
						$('#newReviseMeterModelId').append('<option  value="' + data[o].meterModelId + '">' + data[o].meterModelName + '</option>');
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
						$('#oldFactoryId').append('<option  value="' + data[o].factoryId + '">' + data[o].factoryName + '</option>');
						$('#oldReviseFactoryId').append('<option  value="' + data[o].factoryId + '">' + data[o].factoryName + '</option>');
						$('#newFactoryId').append('<option  value="' + data[o].factoryId + '">' + data[o].factoryName + '</option>');
						$('#newReviseFactoryId').append('<option  value="' + data[o].factoryId + '">' + data[o].factoryName + '</option>');
					}
			    } 
			})
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
						$('#factoryId1').append('<option value="' + data[o].factoryId1 + '">' + data[o].factoryName + '</option>');
					}
			    } 
			})
			//获取url传递的参数
			var reg = new RegExp("(^|&)" + "param" + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg);  //匹配目标参数
            var workBillId = unescape(r[2]); //返回参数值
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
					$("#tel2").val(data.phone);
					$("#bookingTime").val(data.bookingTime);
			    } 
			})
            
            var xwQuery = RQLBuilder.and([
			    RQLBuilder.equal("customerCode",customerCode)
			]).rql();
			var archiveData = Restful.findNQ(hzq_rest+"gasctmarchive?query="+xwQuery);
			console.log(archiveData)
			if(archiveData.length>0){
				ctmArchive= archiveData[0];
				$("#idcard").val(archiveData[0].idcard);
				$("#tel").val(archiveData[0].tel);
			}
            
            ctmMeter=queryCtmMeter(ctmArchive.ctmArchiveId);
            //查询下线表信息
            console.log(ctmMeter)
            downMeter = Restful.getByID(hzq_rest+"gasmtrmeter",ctmMeter.meterId);
            console.log(downMeter)
            $.each(downMeter, function(key,val) {
            	$("form[name='oldMeterForm'] input[name='"+key+"']").val(val);
            	$("form[name='oldMeterForm'] select[name='"+key+"']").val(val).trigger("change");
            });
            if(ctmMeter.reviseMeterId){
            	downReviseMeter = Restful.getByID(hzq_rest+"gasmtrmeter",ctmMeter.reviseMeterId);
            	console.log(downReviseMeter)
            	$.each(downReviseMeter, function(key,val) {
	            	$("form[name='oldMeterForm2'] input[name='"+key+"']").val(val);
	            	$("form[name='oldMeterForm2'] select[name='"+key+"']").val(val).trigger("change");
	            });
            }
            //查询下线表最后一次表读数
			var paramurl = "/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd";
			var froms = "(select ctm_archive_id,meter_reading,revise_reading,meter_reading_id,copy_time,row_number() over (partition by ctm_archive_id order by copy_time desc )as rn1 from gas_mrd_meter_reading where ctm_archive_id='" + ctmArchive.ctmArchiveId + "'and is_mrd=1 and copy_state in ('2','3','4','5','6')) d";
            var params = {
				"cols": "d.*",
				"froms": froms,
				"wheres": "d.rn1=1",
				"page": true,
				"limit": 1
			}
            var readingData = Restful.insert(paramurl,params);
            if(readingData.rows&&readingData.rows.length>0){
            	mrdMeterReading=readingData.rows[0];
            	$("#vreading").val(readingData.rows[0].meterReading);
            	if(downMeter.reviseMeterId){
            		$("#vrevisereading").val(readingData.rows[0].reviseReading);
            	}
            }
            //查询ctm_house信息供抄表使用
            ctmHouse = Restful.getByID(hzq_rest+"gasctmhouse",ctmArchive.houseId);
            
            var xwQuery = RQLBuilder.and([
			    RQLBuilder.equal("unitId",workBill.ownUnit)
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
			
			//清空下线表读数
			$("#reading").val("");
			$("#revisereading").val("");
        }
    }
}()
			
$("#save_btn").click(function(){
	//需要根据换表信息判断新表抄表信息
	var changeMeter = $("#changeMeter").val();
	if(!changeMeter||changeMeter==""||changeMeter==undefined||changeMeter=="undefined"){
		bootbox.alert("<br><center>请选择更换表</center></br>");
		return;
	}
	
	if(changeMeter=="1"){
		var checkmeterNo = $("#meterNo").val();
		if(!checkmeterNo){
			bootbox.alert("<br><center>更换一次表请填写新一次表编号</center></br>");
			return;
		}
	}else if(changeMeter=="2"){
		var checkrevisemeterNo = $("#revisemeterNo").val();
		if(!checkrevisemeterNo){
			bootbox.alert("<br><center>更换二次表请填写新修正表编号</center></br>");
			return;
		}
	}else if(changeMeter=="3"){
		var checkmeterNo = $("#meterNo").val();
		var checkrevisemeterNo = $("#revisemeterNo").val();
		if(!checkmeterNo){
			bootbox.alert("<br><center>更换一次表+二次表请填写新一次表编号</center></br>");
			return;
		}
		if(!checkrevisemeterNo){
			bootbox.alert("<br><center>更换一次表+二次表请填写新修正表编号</center></br>");
			return;
		}
	}
	
	var chargeMeterReading;
	var quotiety;
	var checkreading = $("#reading").val();
	var checkrevisereading = $("#revisereading").val();
	var checkvreading = $("#vreading").val();
	var checkvrevisereading = $("#vrevisereading").val();
	var oldMeter = $("#oldMeterForm").serializeObject();
	var oldMeter2 = $("#oldMeterForm2").serializeObject();
	//如果是普表，需要判断是否过周
	if(ctmMeter.meterFlag=="2"){
		var rxs;//修正计费读数
		var xs;//一次表计费读数
		if(!checkrevisereading||checkrevisereading==""||checkrevisereading==undefined||checkrevisereading=="undefined"){
			bootbox.alert("<center><h4>请填写修正表读数</h4></center>");
			return;
		}
		if(!checkreading||checkreading==""||checkreading==undefined||checkreading=="undefined"){
			bootbox.alert("<center><h4>请填写一次表读数</h4></center>");
			return;
		}
		//修正表读数小于微机表读数，提示是否过周
		
		if(checkvrevisereading==""){
			rxs=parseInt(checkrevisereading);
		}else{
			if(parseInt(checkvrevisereading)>parseInt(checkrevisereading)){
				var readmax="";
				for(var j=0;j < parseInt(downReviseMeter.meterDigit);j++){
					rmax+="9";
				}
				rxs = parseInt(readmax)+ parseInt(checkrevisereading)-parseInt(checkvrevisereading);
			}else{
				rxs = parseInt(checkrevisereading)-parseInt(checkvrevisereading);
			}
		}
		if(checkvreading==""){
			xs=parseInt(checkreading);
		}else{
			if(parseInt(checkvreading)>parseInt(checkreading)){
				var rmax="";
				for(var j=0;j < parseInt(downMeter.meterDigit);j++){
					rmax+="9";
				}
				xs =parseInt(rmax)+parseInt(checkreading)-parseInt(checkvreading);
			}else{
				xs = parseInt(checkreading)-parseInt(checkvreading);
			}
		}
		
		chargeMeterReading=rxs;
		quotiety=rxs/xs;
	}else{
		var xs;
		if(downMeter.meterKind=="02"||downMeter.meterKind=="03"){
			if(parseInt(checkreading)<parseInt(checkvreading)){
				bootbox.alert("<center><h4>IC卡表表读数不能小于微机表读数</h4></center>");
				return;
			}
			if(checkvreading==""){
				xs=parseInt(checkreading);
			}else{
				xs = parseInt(checkreading)-parseInt(checkvreading);
			}
		}else{
			if(!checkreading||checkreading==""||checkreading==undefined||checkreading=="undefined"){
				bootbox.alert("<center><h4>请填写一次表读数</h4></center>");
				return;
			}
			//一次表读数小于微机表读数，提示是否过周
			if(parseInt(checkvreading)>parseInt(checkreading)){
            	var rmax="";
				for(var j=0;j < parseInt(downMeter.meterDigit);j++){
					rmax+="9";
				}
				xs =parseInt(rmax)+parseInt(checkreading)-parseInt(checkvreading);
			}else{
				xs = parseInt(checkreading)-parseInt(checkvreading);
			}
		}
		chargeMeterReading=xs;
	}
	
	$("select").change(function(){
        $("#newMeterForm").valid();
	})

    if(!$("#newMeterForm").valid()){
        return;
    }
	
	
    //使用restful批量操作接口，保证同一事务控制
	//建立ctm_meter关系
	var unboltJson4 = ctmMeter;
	unboltJson4.modifiedTime=new Date();
	unboltJson4.modifiedBy=userinfo.userId;
	//获取页面表具表单信息
	var newMeterForm = $("#newMeterForm").serializeObject();  
	var newMeterForm2 = $("#newMeterForm2").serializeObject(); 
	var oldMeterForm = $("#oldMeterForm").serializeObject(); 
	var oldMeterForm2 = $("#oldMeterForm2").serializeObject(); 
	//更新旧表状态下线，记录表读数
	var oldMtrMeter={
		"meterId":ctmMeter.meterId,
		"stockState":"5",
		"reading":oldMeterForm.reading,
		"modifiedTime":date,
		"modifiedBy":userinfo.userId
	}
	//插入库存GAS_MTR_STOCK_HISTORY
	var oldMtrStockHistory={
		"meterId":ctmMeter.meterId,
		"createTime":date,
		"stockState":"5",
		"changeDate":date,
		"areaId":ctmArchive.areaId
	}
	
	var oldMtrStockHistoryId = $.md5(JSON.stringify(oldMtrStockHistory)+new Date().getTime());
	oldMtrStockHistory.stockHistoryId=oldMtrStockHistoryId;
	var oldReviseMtrMeter;
	var oldReviseMtrStockHistory;
	if(ctmMeter.reviseMeterId){
		oldReviseMtrMeter={
			"meterId":ctmMeter.reviseMeterId,
			"stockState":"5",
			"reading":oldMeterForm2.reading,
			"modifiedTime":date,
			"modifiedBy":userinfo.userId
		}
		//插入库存GAS_MTR_STOCK_HISTORY
		oldReviseMtrStockHistory={
			"meterId":ctmMeter.reviseMeterId,
			"createTime":date,
			"stockState":"5",
			"changeDate":date,
			"areaId":ctmArchive.areaId
		}
		var oldReviseMtrStockHistoryId = $.md5(JSON.stringify(oldReviseMtrStockHistory)+new Date().getTime());
		oldReviseMtrStockHistory.stockHistoryId=oldReviseMtrStockHistoryId;
	}
	//更新新表状态上线
	var newMtrMeter;
	var newMtrStockHistory;
	newMtrMeter={
		"meterId":meterId,
		"stockState":"4",
		"modifiedTime":date,
		"modifiedBy":userinfo.userId
	}
	//插入库存GAS_MTR_STOCK_HISTORY
	newMtrStockHistory={
		"meterId":meterId,
		"createTime":date,
		"stockState":"4",
		"changeDate":date,
		"areaId":ctmArchive.areaId
	}
	var newMtrStockHistoryId = $.md5(JSON.stringify(newMtrStockHistory)+new Date().getTime());
	newMtrStockHistory.stockHistoryId=newMtrStockHistoryId;
	var newReviseMtrMeter;
	var newReviseMtrStockHistory;
	if(reviseMeterId){
		newReviseMtrMeter={
			"meterId":reviseMeterId,
			"stockState":"4",
			"modifiedTime":date,
			"modifiedBy":userinfo.userId
		}
		//插入库存GAS_MTR_STOCK_HISTORY
		newReviseMtrStockHistory={
			"meterId":reviseMeterId,
			"createTime":date,
			"stockState":"5",
			"changeDate":date,
			"areaId":ctmArchive.areaId
		}
		var newReviseMtrStockHistoryId = $.md5(JSON.stringify(newReviseMtrStockHistory)+new Date().getTime());
		newReviseMtrStockHistory.stockHistoryId=newReviseMtrStockHistoryId;
	}
	//抄表信息录入(旧表)
	//查询上次抄表记录gasmrdmeterreading
	if(!mrdMeterReading){
		mrdMeterReading={
			"meterReading":"",
			"reviseReading":"",
			"meterReadingId":"",
			"copyTime":""
		}
	}
	
	var read = newMeterForm.reading;
	var reviseRead = newMeterForm2.reading;
	var book = queryMdrBook();
	var meter =ctmMeter.meterId;
	var unboltJson3={
		"operate":"S",
		"meterReading":oldMeter.reading,
		"meterId":meter,
		"lastMeterReadingId":mrdMeterReading.meterReadingId,
		"lastReadingDate":mrdMeterReading.copyTime,
		"reviseReading":"",
		"ctmArchiveId":ctmArchive.ctmArchiveId,
		"bookId":ctmArchive.bookId,
		"areaId":ctmArchive.areaId,
		"copyType":"82",
		"gasTypeId":ctmArchive.gasTypeId,
		"countperId":book.countperId,
		"serviceperId":book.serviceperId,
		"isMrd":"1",
		"isBll":"0",
		"dataSource":"1",
		"copyState":"4",
		"chargingMeter":ctmMeter.meterFlag,
		"lastMeterReading":mrdMeterReading.meterReading,
		"copyTime":date,
		"borough":ctmHouse.borough,
		"street":ctmHouse.street,
		"district":ctmHouse.district,
		"doorPlateNum":ctmHouse.doorPlateNum,
		"florNum":ctmHouse.florNum,
		"cell":ctmHouse.cell,
		"address":ctmArchive.customerAddress
	}
	var readingId1 = $.md5(JSON.stringify(unboltJson3)+new Date().getTime());
	unboltJson3.meterReadingId="S"+"1"+readingId1;
	if(ctmMeter.reviseMeterId){
		unboltJson3.reviseMeterReading=oldMeter2.reading;
		unboltJson3.reviseMeterId=ctmMeter.reviseMeterId;
		unboltJson3.lastReviseReading=mrdMeterReading.reviseReading;
	}
	//如果是普表，需要判断是否过周
	if(ctmMeter.meterFlag=="2"){
		unboltJson3.chargeMeterReading=chargeMeterReading;
		unboltJson3.quotiety=quotiety;
	}else{
		unboltJson3.chargeMeterReading=chargeMeterReading;
	}
	
	
	var chargingMeter;
	if(changeMeter=="1"){//计费表不变
		chargingMeter="1";
		unboltJson4.meterId=meterId;
		if(meterKind=="02"||meterKind=="03"){
			ctmArchive.customerType="I"
		}else{
			ctmArchive.customerType="P"
		}
	}else if(changeMeter=="2"){
		//计费表变为二次表，同时变更ctm_meter中meterFlag为二次表计费
		chargingMeter="2";
		ctmArchive.customerType="P"
		unboltJson4.reviseMeterId=reviseMeterId;
		unboltJson4.meterFlag=chargingMeter;
	}else if(changeMeter=="3"){
		chargingMeter="2";
		ctmArchive.customerType="P"
		unboltJson4.meterId=meterId;
		unboltJson4.reviseMeterId=reviseMeterId;
		unboltJson4.meterFlag=chargingMeter;
	}
//	var newCtmMeterId=$.md5(JSON.stringify(unboltJson4)+date.getTime());
//	unboltJson4.ctmMeterId=newCtmMeterId;
	ctmArchive.modifiedTime=date;
	ctmArchive.modifiedBy=userinfo.userId;
	//抄表信息录入(新表)
	//ctmMeter.meterUserState="99";
	var t=new Date();//你已知的时间
	var t_s=t.getTime();//转化为时间戳毫秒数
	var nt=new Date();//定义一个新时间
	nt.setTime(t_s+1000*60);//设置新时间比旧时间多一分钟
	var newMeterReading={
		"operate":"S",
		"meterReading":read,
		"lastMeterReadingId":unboltJson3.meterReadingId,
		"lastReadingDate":unboltJson3.copyTime,
		"meterId":meterId,
		"reviseReading":reviseMeterId==""?"":reviseRead,
		"reviseMeterId":reviseMeterId,
		"ctmArchiveId":ctmArchive.ctmArchiveId,
		"bookId":ctmArchive.bookId,
		"areaId":ctmArchive.areaId,
		"copyType":"72",
		"gasTypeId":ctmArchive.gasTypeId,
		"countperId":book.countperId,
		"dataSource":"1",
		"copyState":"4",
		"chargingMeter":chargingMeter,
		"isMrd":"1",
		"isBll":"1",
		"chargeMeterReading":0,
		"serviceperId":book.serviceperId,
		"copyTime":nt,
		"borough":ctmHouse.borough,
		"street":ctmHouse.street,
		"district":ctmHouse.district,
		"doorPlateNum":ctmHouse.doorPlateNum,
		"florNum":ctmHouse.florNum,
		"cell":ctmHouse.cell,
		"address":ctmArchive.customerAddress
	}
	var readingId2 = $.md5(JSON.stringify(newMeterReading)+new Date().getTime());
	newMeterReading.meterReadingId = "S"+"2"+readingId2;
	if(meterKind=="02"){//IC气量
		newMeterReading.remaingAsnum=0;
		//newMeterReading.accumulatedGas=read;
	}else if(meterKind=="03"){//IC金额
		newMeterReading.cardBalancEsum=0;
		//newMeterReading.accumulatedGas=read;
	}
	
	
    //工单处理结果录入
    var unboltJson5 = $("#resultForm").serializeObject();
    var arriveTime = $("#arriveTime").val();
    var finishTime = $("#finishTime").val();
    var hiddenDangerPosition = $("#hiddenDangerPosition").val();
    unboltJson5.ctmArchiveId=ctmArchive.ctmArchiveId;
    unboltJson5.workBillId=workBillId;
    unboltJson5.arriveTime=arriveTime;
    unboltJson5.finishTime=finishTime;
    unboltJson5.hiddenDangerPosition=hiddenDangerPosition;
    var csrWorkBillResultId = $.md5(JSON.stringify(unboltJson5)+new Date().getTime())
    unboltJson5.csrWorkBillResultId = csrWorkBillResultId;
    var sendPerson = $("#sendPerson").val();
    unboltJson5.sendPerson = sendPerson;
    
    //更改工单信息
    var unboltJson6 = workBill;
    unboltJson6.completeDate=new Date();
    unboltJson6.modifiedTime=new Date();
    unboltJson6.modifiedBy=userinfo.user_id;
    unboltJson6.billState="3";
    
    var submitJson;
    
    if(changeMeter=="1"){
    	submitJson = {"sets":[
	        {"txid":"1","body":unboltJson4,"path":"/gasctmmeter/","method":"PUT"},
	        {"txid":"2","body":newMeterReading,"path":"/gasmrdmeterreading/","method":"POST"},
	        {"txid":"3","body":unboltJson3,"path":"/gasmrdmeterreading/","method":"POST"},
	        {"txid":"4","body":unboltJson5,"path":"/gascsrworkbillresult/","method":"POST"},
	        {"txid":"5","body":unboltJson6,"path":"/gascsrworkbill/","method":"PUT"},
	        {"txid":"6","body":oldMtrMeter,"path":"/gasmtrmeter/","method":"PUT"},
	        {"txid":"7","body":newMtrMeter,"path":"/gasmtrmeter/","method":"PUT"},
	        {"txid":"8","body":oldMtrStockHistory,"path":"/gasmtrstockhistory/","method":"POST"},
	        {"txid":"9","body":newMtrStockHistory,"path":"/gasmtrstockhistory/","method":"POST"}
//	        {"txid":"19","body":ctmMeter,"path":"/gasctmmeter/","method":"PUT"}
    	]}
    }else if(changeMeter=="2"){
    	submitJson = {"sets":[
	        {"txid":"1","body":unboltJson4,"path":"/gasctmmeter/","method":"PUT"},
	        {"txid":"2","body":newMeterReading,"path":"/gasmrdmeterreading/","method":"POST"},
	        {"txid":"3","body":unboltJson3,"path":"/gasmrdmeterreading/","method":"POST"},
	        {"txid":"4","body":unboltJson5,"path":"/gascsrworkbillresult/","method":"POST"},
	        {"txid":"5","body":unboltJson6,"path":"/gascsrworkbill/","method":"PUT"},
	        {"txid":"6","body":oldReviseMtrMeter,"path":"/gasmtrmeter/","method":"PUT"},
	        {"txid":"7","body":newReviseMtrMeter,"path":"/gasmtrmeter/","method":"PUT"},
	        {"txid":"8","body":oldReviseMtrStockHistory,"path":"/gasmtrstockhistory/","method":"POST"},
	        {"txid":"9","body":newReviseMtrStockHistory,"path":"/gasmtrstockhistory/","method":"POST"}
//	        {"txid":"19","body":ctmMeter,"path":"/gasctmmeter/","method":"PUT"}
    	]}
    }else{
    	submitJson = {"sets":[
	        {"txid":"1","body":unboltJson4,"path":"/gasctmmeter/","method":"PUT"},
	        {"txid":"2","body":newMeterReading,"path":"/gasmrdmeterreading/","method":"POST"},
	        {"txid":"3","body":unboltJson3,"path":"/gasmrdmeterreading/","method":"POST"},
	        {"txid":"4","body":unboltJson5,"path":"/gascsrworkbillresult/","method":"POST"},
	        {"txid":"5","body":unboltJson6,"path":"/gascsrworkbill/","method":"PUT"},
	        {"txid":"6","body":oldReviseMtrMeter,"path":"/gasmtrmeter/","method":"PUT"},
	        {"txid":"7","body":newReviseMtrMeter,"path":"/gasmtrmeter/","method":"PUT"},
	        {"txid":"8","body":oldReviseMtrStockHistory,"path":"/gasmtrstockhistory/","method":"POST"},
	        {"txid":"9","body":newReviseMtrStockHistory,"path":"/gasmtrstockhistory/","method":"POST"},
    		{"txid":"10","body":oldMtrMeter,"path":"/gasmtrmeter/","method":"PUT"},
	        {"txid":"11","body":newMtrMeter,"path":"/gasmtrmeter/","method":"PUT"},
	        {"txid":"12","body":oldMtrStockHistory,"path":"/gasmtrstockhistory/","method":"POST"},
	        {"txid":"13","body":newMtrStockHistory,"path":"/gasmtrstockhistory/","method":"POST"}
//	        {"txid":"19","body":ctmMeter,"path":"/gasctmmeter/","method":"PUT"}
    	]}
    }
    var fullgas = $("#fullgas").val();
	var surgas = $("#surgas").val();
	var par4;
	var par5;
	if(downMeter.meterKind=="02"||downMeter.meterKind=="03"){
		if(!surgas){
			bootbox.alert("<center><h4>IC卡表换表需要填写IC卡表剩余气量</h4></center>");
				return;
		}
		if(meterKind=="02"||meterKind=="03"){
			var gaschgiccardcomplement={
				"approveGas":"批准气量",
				"applyState":"2",
				"useState":"0",
				"approveGas":surgas,
				"applyGas":surgas,
				"applyTime":date,
				"approveTime":date,
				"useTime":date,
				"remark":"IC卡表更换IC卡表",
				"createdTime":date,
				"createdBy":date,
				"ctmArchiveId":ctmArchive.ctmArchiveId,
				"customerCode":ctmArchive.customerCode,
				"customerName":ctmArchive.customerName
			}
			var complementId = $.md5(JSON.stringify(gaschgiccardcomplement)+date.getTime());
			gaschgiccardcomplement.complementId = complementId;
			submitJson.sets.push({"txid":"14","body":gaschgiccardcomplement,"path":"/gaschgiccardcomplement/","method":"POST"});
		}else{
			var par = {
			"customer_code":ctmArchive.customerCode,
			"measure":surgas
			}
			var money;
			var parRet = Restful.insert("/hzqs/bil/pbgtm.do?fh=GTMBIL0000000J00&resp=bd",par);
			console.log(parRet)
			if(parRet.ret_code&&parRet.ret_code=="1"){
				money = parRet.money;
			}
			var refundType="1";
//			if(meterKind=="02"||meterKind=="03"){
//				refundType="2";
//				var par2 = {
//				"customer_code":ctmArchive.customerCode,
//				"money":money
//				}
//				var par1Ret=Restful.insert("/hzqs/bil/pbmtg.do?fh=MTGBIL0000000J00&resp=bd",par2);
//				console.log(par1Ret)
//				if(par1Ret.ret_code&&par1Ret.ret_code=="1"){
//			  		money=spent_money;
//			  	}
//			}
			var par3 = {
		      	"cols":"b.chg_account_id,b.gasfee_account_id",
		      	"froms":"gas_chg_account a,gas_act_gasfee_account b",
		      	"wheres":"a.chg_account_id=b.chg_account_id and a.ctm_archive_id='"+ctmArchive.ctmArchiveId+"'",
		      	"page":true,
		      	"limit":10
		    }
			var ret3=Restful.insert("/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",par3);
			console.log(ret3)
			var par4 = {
				"gasfeeAccountId":ret3.gasfeeAccountId,
				"chgAccountId":ret3.chgAccountId,
				"customerCode":ctmArchive.customerCode,
				"tradeType":"BLL",
				"money":money,
				"clrTag":"1",
				"createTime":new Date(),
				"modifiedTime":new Date(),
				"createdBy":userinfo.userId,
				"modifiedBy":userinfo.userId
			}
			var atlId = $.md5(JSON.stringify(par4)+new Date().getTime());
			par4.gasfeeAtlId=atlId;
			par5 = {
				"gasfeeAccountId":ret3.gasfeeAccountId,
				"modifiedTime":new Date(),
				"modifiedBy":userinfo.userId,
				"icBalance":0
			}
			submitJson.sets.push({"txid":"14","body":par4,"path":"/gasactgasfeeatl/","method":"POST"});
			submitJson.sets.push({"txid":"15","body":par5,"path":"/gasactgasfeeaccount/","method":"PUT"});
		}
	}
    
	console.log(surgas)
	console.log(submitJson)
	var result = Restful.insert("/hzqs/dbc/pbtxs.do?fh=SELDBC0000000J00&resp=bd",submitJson);

    console.log("submit:result:"+JSON.stringify(result));
    console.log(result);

	var retFlag=true;
    
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
    	//变更超表本
//  	var par3 = {
//	      	"meterId":unboltJson4.meterId,
//	      	"reviseMeterId":unboltJson4.reviseMeterId,
//	      	"chargingMeter":unboltJson4.meterFlag
//	    }
//		var ret3=Restful.updateNQ(hzq_rest+'gasmrdmeterreading/?example={"ctmArchiveId":"'+ctmArchive.ctmArchiveId+'","isMrd":"0","isBll":"0","copyType":"0","planCopyTime":{"$gt":'+date+'}}',par3);
//		console.log(ret3)
    	
    	if(changeMeter=="1"){//计费表不变
			if(meterKind=="02"||meterKind=="03"){
				ctmArchive.customerType="I"
			}else{
				ctmArchive.customerType="P"
			}
		}else if(changeMeter=="2"){
			ctmArchive.customerType="P"
		}else if(changeMeter=="3"){
			ctmArchive.customerType="P"
		}
		ctmArchive.modifiedTime=date;
		ctmArchive.modifiedBy=userinfo.userId;
		//下线表抄表计费
    	if(downMeter.meterKind!="02"&&downMeter.meterKind!="03"){
			var bllret=Restful.findNQ('/hzqs/bil/pbbll.do?fh=BLLBIL0000000J00&resp=bd&bd={"customer_code":"'+ctmArchive.customerCode+'"}');
        	console.log(bllret)
        	if(bllret.ret_code=="1"){
        		var archiveRet=Restful.updateNQ(hzq_rest+"/gasctmarchive",JSON.stringify(ctmArchive));
    			console.log(archiveRet)
        	}else{
        		var archiveRet=Restful.updateNQ(hzq_rest+"/gasctmarchive",JSON.stringify(ctmArchive));
    			console.log(archiveRet)
        	}
        	
		}else{
			var archiveRet=Restful.updateNQ(hzq_rest+"/gasctmarchive",JSON.stringify(ctmArchive));
    		console.log(archiveRet)
		}
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
var queryMrdMeterReading = function(ctmArchiveId){
	var a;
	var paramurl = "/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd";
	var params = {
      	"cols":"*",
      	"froms":"(select meter_reading,revise_reading, row_number() over (partition by ctm_archive_id order by plan_copy_time desc )as rn1 , meter_reading_id, copy_time from gas_mrd_meter_reading where is_mrd='1' and ctm_archive_id ='"+ctmArchiveId+"' and copy_state in ('2','3','4','5','6'))",
      	"wheres":"rn1=1",
      	"page":true,
      	"orderby":"copyTime desc,meterReadingId desc",
      	"limit":1
    }
    $.ajax({
    	headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
    	},
    	type: 'POST',
    	url: paramurl,
    	async: false,
		data : JSON.stringify(params),
    	success: function (data) {
    		if(data.length>0){
    			a = data[0];
    		}
    	}
	})
    return a;
}
var queryCtmMeter = function(ctmArchiveId){
	var res;
	var oneQuery = RQLBuilder.and([
		    RQLBuilder.equal("ctmArchiveId",ctmArchiveId)
		]).rql();
	var ret = Restful.findNQ(hzq_rest+'gasctmmeter?query='+oneQuery)
	if(ret.length>0){
		res=ret[0];
	}
	return res;
}

function checkone(){
	var checkarr=[];
	var checks=$('input.fors');
	for(var i=0;i<checks.length;i++){
		checks[i].index=i+1;
		checks[i].onclick=function(){
			if(this.checked==true){
				checkarr.push(this.value);
			}else{
				for(var i=0;i<checkarr.length;i++){
					if(checkarr[i]==this.value){
						checkarr.splice(i,1)
					}
				}
			}
			$("#repairResult").val(checkarr.join());
		}
	}
}
checkone();




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
	var _no = $("#meterNo").val();
	if(_no==downMeter.meterNo){
		bootbox.alert('<center><h4>新燃气表编号与下线表编号相同，请核实是否不更换此表</h4></center>');
	}
	var results = Restful.findNQ(hzq_rest+'gasmtrmeter/?query={"meterNo":"'+_no+'"}');
    console.log(results);
    if(results&&results.length>0){
    	var data = results[0];
    	$.each(data, function(key,val) {
    		$("form[name='newMeterForm'] input[name="+key+"]").val(val);
    		$("form[name='newMeterForm'] select[name='"+key+"']").val(val).trigger("change");
    	});
    	meterId=data.meterId;
    	meterKind=data.meterKind;
    	bootbox.alert('<center><h4>请核对新一次表指针</h4></center>');
    }else{
    	bootbox.alert('<center><h4>系统中无此表信息，请对该表具进行开栓补录</h4></center>');
    }
})

$("#reviseMeterNo").blur(function(){
	var _no = $("#reviseMeterNo").val();
	if(_no==downReviseMeter.meterNo){
		bootbox.alert('<center><h4>新修正表编号与下线修正表编号相同，请核实是否不更换此表</h4></center>');
	}
	var results = Restful.findNQ(hzq_rest+'gasmtrmeter/?query={"meterNo":"'+_no+'"}');
    console.log(results);
    if(results&&results.length>0){
    	var data = results[0];
    	$.each(data, function(key,val) {
    		$("form[name='newMeterForm2'] input[name="+key+"]").val(val);
    		$("form[name='newMeterForm2'] select[name='"+key+"']").val(val).trigger("change");
    	});
    	reviseMeterId=data.meterId;
    	meterKind=data.meterKind;
    	bootbox.alert('<center><h4>请核对上线修正表指针</h4></center>');
    }else{
    	bootbox.alert('<div style="text-align:center"><h4>系统中无此表信息，请对该表具进行开栓补录</h4></div>');
    }
})

var changeIC=function(surgas){
	console.log(userinfo)
	console.log(ctmArchive)
	//判断是否修正表计费
	//燃气表
	
	var par = {
		"customer_code":ctmArchive.customerCode,
		"measure":surgas
	}
	var money;
	var parRet = Restful.insert("/hzqs/bil/pbgtm.do?fh=GTMBIL0000000J00&resp=bd",par);
	console.log(parRet)
	if(parRet.ret_code&&parRet.ret_code=="1"){
		money = parRet.money;
	}
	var refundType="1";
	if(meterKind=="2"||meterKind=="3"){
		refundType="2";
		var par2 = {
		"customer_code":ctmArchive.customerCode,
		"money":money
		}
		var par1Ret=Restful.insert("/hzqs/bil/pbmtg.do?fh=MTGBIL0000000J00&resp=bd",par2);
		console.log(par1Ret)
		if(par1Ret.ret_code&&par1Ret.ret_code=="1"){
	  		money=spent_money;
	  	}
	}
	var par3 = {
      	"cols":"b.chg_account_id,b.gasfee_account_id",
      	"froms":"gas_chg_account a,gas_act_gasfee_account b",
      	"wheres":"a.chg_account_id=b.chg_account_id and a.ctm_archive_id='"+ctmArchive.ctmArchiveId+"'",
      	"page":true,
      	"limit":10
    }
	var ret3=Restful.insert("/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",par3);
	console.log(ret3)
	var par4 = {
		"gasfeeAccountId":ret3.gasfeeAccountId,
		"chgAccountId":ret3.chgAccountId,
		"customerCode":ctmArchive.customerCode,
		"tradeType":"BLL",
		"money":money,
		"clrTag":"1",
		"createTime":new Date(),
		"modifiedTime":new Date(),
		"createdBy":userinfo.userId,
		"modifiedBy":userinfo.userId
	}
	var atlId = $.md5(JSON.stringify(par4)+new Date().getTime());
	par4.gasfeeAtlId=atlId;
	return par4
}
$("#cencel_btn").click(function(){
	history.go("-1");
})

$("#reading").blur(function(){
	var reading =$("#reading").val();
	var vreading = $("#vreading").val();
	if(reading){
		if(downMeter.meterKind=="02"&&downMeter.meterKind=="03"){
			if(parseInt(vreading)>parseInt(reading)){
				bootbox.alert('<center><h4>IC卡表一次表读数不能小于微机表读数</h4></center>');
			}
		}else{
			if(parseInt(vreading)>parseInt(reading)){
				bootbox.alert('<center><h4>表读数小于微机表读数，请核实该表是否已过周</h4></center>');
			}
			if(downMeter.meterDigit==reading.length){
				if(parseInt(vreading)>parseInt(reading)){
					bootbox.alert('<center><h4>一次表读数小于微机表读数，请核实该表是否已过周</h4></center>');
				}
			}else{
				if(parseInt(vreading)>parseInt(reading)){
					bootbox.alert('<center><h4>一次表读数小于微机表读数，产生超大计费读数，请核实该表是否已过周！</h4></center>');
				}
			}
		}
	}else{
		bootbox.alert('<center><h4>请填写一次表读数</h4></center>');
	}
})
$("#revisereading").blur(function(){
	var reading =$("#revisereading").val();
	var vreading = $("#vrevisereading").val();
	if(ctmMeter.reviseMeterId){
		if(reading){
			if(downReviseMeter.meterDigit==reading.length){
				if(parseInt(vreading)>parseInt(reading)){
					bootbox.alert('<center><h4>修正表读数小于微机表读数，请核实该表是否已过周</h4></center>');
				}
			}else{
				if(parseInt(vreading)>parseInt(reading)){
					bootbox.alert('<center><h4>修正表读数小于微机表读数，产生超大计费读数，请核实该表是否已过周！</h4></center>');
				}
			}
		}else{
			bootbox.alert('<center><h4>请填写修正表读数</h4></center>');
		}
	}
	
})
