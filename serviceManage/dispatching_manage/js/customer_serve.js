var ctmArchive ;
var workBillId ;
var workBill ;
var ctmMeter ;
var mrdMeterReading;
var ctmHouse;
var downMeter;
var downReviseMeter;
var date = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");

var userinfo = JSON.parse(localStorage.getItem('user_info'));
var CustomerServe = function(){
	
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
				$('#reviseDirection').append('<option  value="' + val + '">' + key + '</option>');
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
						$('#reviseMeterModelId').append('<option  value="' + data[o].meterModelId + '">' + data[o].meterModelName + '</option>');
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
						$('#reviseFactoryId').append('<option  value="' + data[o].factoryId + '">' + data[o].factoryName + '</option>');
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
					console.log(workBill);
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
			//查询下线表最后一次表读数
			var paramurl = "/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd";
			var froms = "(select ctm_archive_id,meter_reading,meter_reading_id,copy_time,row_number() over (partition by ctm_archive_id order by copy_time desc )as rn1 from gas_mrd_meter_reading where ctm_archive_id='" + ctmArchive.ctmArchiveId + "'and is_mrd=1 and copy_state in ('2','3','4','5','6')) d";
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
            }
			 //查询ctm_house信息供抄表使用
            ctmHouse = Restful.getByID(hzq_rest+"gasctmhouse",ctmArchive.houseId);
            
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
			
			ctmMeter=queryCtmMeter(ctmArchive.ctmArchiveId);
            //查询下线表信息
            console.log(ctmMeter)
            downMeter = Restful.getByID(hzq_rest+"gasmtrmeter",ctmMeter.meterId);
            console.log(downMeter)
            $.each(downMeter, function(key,val) {
            	$("form[name='meterForm'] input[name='"+key+"']").val(val);
            	$("form[name='meterForm'] select[name='"+key+"']").val(val).trigger("change");
            });
            $("#reading").val("");
            if(ctmMeter.reviseMeterId){
            	downReviseMeter = Restful.getByID(hzq_rest+"gasmtrmeter",ctmMeter.reviseMeterId);
            	console.log(downReviseMeter)
            	$.each(downReviseMeter, function(key,val) {
	            	$("form[name='meterForm2'] input[name='"+key+"']").val(val);
	            	$("form[name='meterForm2'] select[name='"+key+"']").val(val).trigger("change");
	            });
            }
            $("#reviseReading").val("");
        }
    }
}()		

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

/*
    $("select").change(function(){
        $("#meterForm").valid();
    });*/

    if(!$("#meterForm").valid()){
        return;
    }
    
    var checkreading = $("#reading").val();
	var checkrevisereading = $("#revisereading").val();
	var checkvreading = $("#vreading").val();
	var checkvrevisereading = $("#vrevisereading").val();
	var chargeMeterReading;
	var quotiety;
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
    
    //查询抄表本信息
	var book = queryMdrBook();
	var meterId =ctmMeter.meterId;
	var reviseMeterId = ctmMeter.reviseMeterId ;//修正表id
	//使用restful批量操作接口，保证同一事务控制
	//燃气表
	var unboltJson1 = $("#meterForm").serializeObject();
	//修正表
	var unboltJson1_2;
	//表户信息
	if(reviseMeterId){
		unboltJson1_2 = $("#meterForm2").serializeObject();
	}
	var billType=workBill.billType;
	var copyType;
	//建立ctm_meter关系
	ctmMeter.modifiedTime=date;
	ctmMeter.modifiedBy=userinfo.userId;
	ctmArchive.modifiedTime= date;
	ctmArchive.modifiedBy=userinfo.userId;
	if(billType=="REMOVEM"){//拆除
		copyType="89";
		ctmMeter.meterUserState="03";
		ctmArchive.customerState="03"
	}
	if(billType=="WB_STOPG"){//暂停用气
		copyType="88";
		ctmMeter.meterUserState="02";
		ctmArchive.customerState="02"
	}
	if(billType=="WB_REUSEG"){//重新用气
		copyType="81";
		ctmMeter.meterUserState="00";
		ctmArchive.customerState="00"
	}
	if(billType=="WB_ADJUSTP"){//定针
		copyType="76";
	}
	//查询上次抄表记录
	if(!mrdMeterReading){
		mrdMeterReading={
			"meterReading":"",
			"reviseReading":"",
			"meterReadingId":"",
			"copyTime":""
		}
	}
	console.log(mrdMeterReading)
	var unboltJson2={
		"operate":"S",
		"lastMeterReadingId":mrdMeterReading.meterReadingId,
		"lastReadingDate":mrdMeterReading.copyTime,
		"lastMeterReading":mrdMeterReading.meterReading,
		"reviseReading":"",
		"meterReading":unboltJson1.reading,
		"meterId":meterId,
		"ctmArchiveId":ctmArchive.ctmArchiveId,
		"bookId":ctmArchive.bookId,
		"areaId":ctmArchive.areaId,
		"copyType":copyType,
		"gasTypeId":ctmArchive.gasTypeId,
		"countperId":book.countperId,
		"serviceperId":book.serviceperId,
		"isMrd":"1",
		"isBll":"0",
		"dataSource":"1",
		"copyState":"4",
		"copyTime":date,
		"chargingMeter":ctmMeter.meterFlag,
		"borough":ctmHouse.borough,
		"street":ctmHouse.street,
		"district":ctmHouse.district,
		"doorPlateNum":ctmHouse.doorPlateNum,
		"florNum":ctmHouse.florNum,
		"cell":ctmHouse.cell,
		"address":ctmArchive.customerAddress
	}
	var meterReadingId2 = $.md5(JSON.stringify(unboltJson2+new Date().getTime()))
	unboltJson2.meterReadingId = meterReadingId2;
	//如果是普表，需要判断是否过周
	if(ctmMeter.meterFlag=="2"){
		unboltJson2.chargeMeterReading=chargeMeterReading;
		unboltJson2.quotiety=quotiety;
	}else{
		unboltJson2.chargeMeterReading=chargeMeterReading;
	}
	
	if(billType=="WB_ADJUSTP"){//定针
		unboltJson2.chargeMeterReading="0";
	}
	if(reviseMeterId!="undefined"&&reviseMeterId!=""&&reviseMeterId!=undefined){
		unboltJson2.reviseMeterId==reviseMeterId;
		unboltJson2.reviseMeterReading=unboltJson1_2.reading;
		unboltJson2.lastReviseReading=mrdMeterReading.reviseReading;
	}
	
    //工单处理结果录入
    var unboltJson5 = $("#resultForm").serializeObject();
    var arriveTime = $("#arriveTime").val();
    var finishTime = $("#finishTime").val();
    var hiddenDangerPosition = $("#hiddenDangerPosition").val();
    var noUnboltReason = $("#noUnboltReason").val();
    var unauthorizedOpeningReading = $("#unauthorizedOpeningReading").val();
    var hiddenDanger = $("#hiddenDanger").val();
    var sendPerson = $("#sendPerson").val();
    unboltJson5.ctmArchiveId=ctmArchive.ctmArchiveId;
    unboltJson5.workBillId=workBillId;
    unboltJson5.arriveTime=arriveTime;
    unboltJson5.finishTime=finishTime;
    unboltJson5.hiddenDangerPosition=hiddenDangerPosition;
    unboltJson5.noUnboltReason=noUnboltReason;
    unboltJson5.unauthorizedOpeningReading=unauthorizedOpeningReading;
    unboltJson5.hiddenDanger=hiddenDanger;
    var csrWorkBillResultId = $.md5(JSON.stringify(unboltJson5)+new Date().getTime())
    unboltJson5.csrWorkBillResultId = csrWorkBillResultId;
    unboltJson5.sendPerson = sendPerson;
    
    var unboltJson6 = workBill;
    unboltJson6.completeDate=date;
    unboltJson6.modifiedTime=date;
    unboltJson6.modifiedBy=userinfo.user_id;
    unboltJson6.billState="3";
    
    var submitJson = {"sets":[
        {"txid":"1","body":unboltJson2,"path":"/gasmrdmeterreading/","method":"POST"},
        {"txid":"2","body":ctmMeter,"path":"/gasctmmeter/","method":"PUT"},
        {"txid":"3","body":ctmArchive,"path":"/gasctmarchive/","method":"PUT"},
        {"txid":"4","body":unboltJson5,"path":"/gascsrworkbillresult/","method":"POST"},
        {"txid":"5","body":unboltJson6,"path":"/gascsrworkbill/","method":"PUT"}
    ]}
	
	var result = Restful.insert("/hzqs/dbc/pbtxs.do?fh=SELDBC0000000J00&resp=bd",submitJson)

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
    	//业务抄表需要直接计费
    	var bllret=Restful.findNQ('/hzqs/bil/pbbll.do?fh=BLLBIL0000000J00&resp=bd&bd={"customer_code":"'+ctmArchive.customerCode+'"}');
        console.log(bllret)
    	if(billType=="REMOVEM"){//拆除
	    	if(ctmMeter.mterKind=="02"||ctmMeter.mterKind=="03"){
				var icgas = $("#icgas").val();
				var par = {
					"customer_code":ctmArchive.customerCode,
					"measure":icgas
				}
				var money;
				var parRet = Restful.insert("/hzqs/bil/pbgtm.do?fh=GTMBIL0000000J00&resp=bd",par);
				if(parRet.ret_code&&parRet.ret_code=="1"){
					money = parRet.money;
				}
				var par2 = {
				"customer_code":ctmArchive.customerCode,
				"money":money
				}
				var par1Ret=Restful.insert("/hzqs/bil/pbmtg.do?fh=MTGBIL0000000J00&resp=bd",par2);
				console.log(par1Ret)
				if(par1Ret.ret_code&&par1Ret.ret_code=="1"){
			  		money=spent_money;
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
					"tradeType":"RFD",
					"money":money,
					"clrTag":"1",
					"createTime":date,
					"modifiedTime":date,
					"createdBy":userinfo.userId,
					"modifiedBy":userinfo.userId
				}
				var atlId = $.md5(JSON.stringify(par4)+new Date().getTime());
				par4.gasfeeAtlId=atlId;
			
				var par5 = {
					"gasfeeAccountId":ret3.gasfeeAccountId,
					"modifiedTime":new Date(),
					"modifiedBy":userinfo.userId,
					"icBalance":0
				}
				var submitJson2 = {"sets":[
			        {"txid":"1","body":par4,"path":"/gasactgasfeeatl/","method":"POST"},
			        {"txid":"2","body":par5,"path":"/gasactgasfeeaccount/","method":"PUT"}
			    ]}
				var result2 = Restful.insert("/hzqs/dbc/pbtxs.do?fh=SELDBC0000000J00&resp=bd",submitJson2)

			    var retFlag2=true;
				if(result2.success&&result2.success==false){
					retFlag2=false;
				}else{
					for(var i=0;i<result2.results.length;i++){
				        if(!result2.results[i].result.success){
				        	retFlag2=false;
				        	break;
				        }
				    }
				}
				if(!retFlag2){
					bootbox.alert("工单提交成功，计费失败");
					window.location.replace("/serviceManage/dispatching_manage/repair_order_perform.html");
				}
			}
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
      	"froms":"(select meter_reading,revise_reading, row_number() over (partition by ctm_archive_id order by plan_copy_time desc )as rn1, meter_reading_id, copy_time from gas_mrd_meter_reading where is_mrd='1' and ctm_archive_id ='"+ctmArchiveId+"')",
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
	var a;
	var oneQuery = RQLBuilder.and([
		    RQLBuilder.equal("ctmArchiveId",ctmArchiveId)
		]).rql();
		
    $.ajax({
		headers: {
	      'Accept': 'application/json',
	      'Content-Type': 'application/json'
		},
		type: 'get',
		async: false,
		url: hzq_rest+'gasctmmeter?query='+oneQuery,
		success: function (data) {
			if(data.length>0){
				a=data[0];
			}
	    } 
	})
	return a;
}
var removeMeter=function(){
	
	//判断是否修正表计费
	//燃气表
	var reading;
	var unboltJson1 = $("#meterForm").serializeObject();
	//修正表
	var unboltJson1_2 = $("#meterForm2").serializeObject();
	if(ctmMeter.meterFlag&&ctmMeter.meterFlag=="2"){
		reading=unboltJson1_2.reading;
	}else{
		reading=unboltJson1.reading;
	}
	var par = {
		"customer_code":ctmArchive.customerCode,
		"measure":reading
	}
	var money;
	var parRet = Restful.insert("/hzqs/bil/pbgtm.do?fh=GTMBIL0000000J00&resp=bd",par);
	console.log(parRet)
	if(parRet.ret_code&&parRet.ret_code=="1"){
		money = parRet.money;
	}
	var refundType="1";
	if(unboltJson1.meterKind=="2"||unboltJson1.meterKind=="3"){
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
		"tradeType":"RFD",
		"money":money,
		"clrTag":"1",
		"createTime":new Date(),
		"modifiedTime":new Date(),
		"createdBy":userinfo.userId,
		"modifiedBy":userinfo.userId
	}
	var atlId = $.md5(JSON.stringify(par4)+new Date().getTime());
	par4.gasfeeAtlId=atlId;

	Restful.insert(hzq_rest+"/gasactgasfeeatl/?retobj=2",par4);
	
	var par5 = {
		"gasfeeAccountId":ret3.gasfeeAccountId,
		"modifiedTime":new Date(),
		"modifiedBy":userinfo.userId,
		"icBalance":0
	}
	Restful.updateNQ(hzq_rest+"/gasactgasfeeaccount",JSON.stringify(par5));
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
			if(parseInt(vreading)>parseInt(reading)){
				bootbox.alert('<center><h4>修正表读数小于微机表读数，请核实该表是否已过周</h4></center>');
			}
		}else{
			bootbox.alert('<center><h4>请填写修正表读数</h4></center>');
		}
	}
	
})