var ctmArchive ;
var workBillId ;
var workBill ;
var ctmMeter ;
var mrdMeterReading;
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
			var froms = "(select ctm_archive_id,meter_reading,meter_reading_id,copy_time,row_number() over (partition by ctm_archive_id order by copy_time desc )as rn1 from gas_mrd_meter_reading where ctm_archive_id='" + ctmArchive.ctmArchiveId + "' and is_mrd='1' and is_bll='1' and copy_state = '6') d";
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
			    RQLBuilder.equal("stationId","54"),
			    RQLBuilder.equal("status","1")
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
            if(workBill.billState==7){
            	$("#showReasonId").show();
				$.ajax({
	                headers: {
	                    'Accept': 'application/json',
	                    'Content-Type': 'application/json'
	                },
	                type: 'get',
	                async: false,
	                url: hzq_rest+'gascsrworkbillresult?query={"workBillId":"'+workBillId+'"}',
	                success: function (data) {
	                    if(data.length>0){
	                    	workbillresult=data[0];
	                        $("#arriveTime").val(data[0].arriveTime);
	                        $("#finishTime").val(data[0].finishTime);
	                        $("#sendPerson").val(data[0].sendPerson).trigger("change");
	                        $("#changeMeter").val(data[0].changeMeter).trigger("change");
	                        $("#backReason").val(data[0].backReason);
	                        $("#hiddenDangerPosition").val(data[0].hiddenDangerPosition);
	                        $("#checkMaintenanceContents").val(data[0].checkMaintenanceContents);
	                        if(data[0].downMeterReading){
	                        	$("#reading").val(data[0].downMeterReading);
	                        }
	                        if(data[0].downMeterReading){
	                        	$("#reviseReading").val(data[0].downMeterReviseReading);
	                        }
	                        
	                        $.each(data[0], function(key,val) {
				            	$("form[name='resultForm'] input[name='"+key+"']").val(val);
				            	$("form[name='resultForm'] select[name='"+key+"']").val(val).trigger("change");
				            });
				            
				            if(data[0].repairResult){
				            	var checks=$('input.fors');
								for(var i=0;i<checks.length;i++){
//									checks[i].index=i+1;
									if(data[0].repairResult.indexOf(checks[i].value)>=0){
										$(checks[i]).parent("span").attr("class","checked");
									}
									
								}
				            }
				            if(data[0].suppressMmho){
				            	$("#suppressMmho").text(data[0].suppressMmho);
				            }
				            if(data[0].stovePressureMmho){
				            	$("#stovePressureMmho").text(data[0].stovePressureMmho);
				            }
				            if(data[0].suppressQualified){
				            	$("#suppressQualified").text(data[0].suppressQualified);
				            }
				            if(data[0].upMeterNo){
				            	$("#meterNo").val(data[0].upMeterNo).trigger("blur");
				            }
				            if(data[0].upMeterReading){
				            	$("#reading1").val(data[0].upMeterReading);
				            }
				            if(data[0].upReviseMeterNo){
				            	$("#reviseMeterNo").val(data[0].upReviseMeterNo).trigger("blur");
				            }
				            if(data[0].upReviseMeterReading){
				            	$("#reviseReading").val(data[0].upReviseMeterReading);
				            }
				            if(data[0].icFullgas){
				            	$("#fullgas").val(data[0].icFullgas);
				            }
				            if(data[0].icSurgas){
				            	$("#surgas").val(data[0].icSurgas);
				            }
	                    }
	                }
	            })
			}
        }
    }
}()		

		
$("#save_btn").click(function(){

    var checkreading = $("#reading").val();
    if(!checkreading){
    	bootbox.alert("<center><h4>请填写一次表读数</h4></center>");
		return;
    }
	var checkrevisereading = $("#reviseReading").val();
	if(ctmMeter.reviseMeterId){
		if(!checkrevisereading){
	    	bootbox.alert("<center><h4>请填写修正表读数</h4></center>");
			return;
	    }
	}
	var checkvreading = $("#vreading").val();
	var checkvrevisereading = $("#vreviseReading").val();
	var surgas = $("#surgas").val();
	if(downMeter.mterKind=="02"||downMeter.mterKind=="03"){
		if(!surgas){
			bootbox.alert("<center><h4>IC卡表请填写IC卡剩余气量</h4></center>");
			return;
		}
	}
	var chargeMeterReading;
	var quotiety;
	var chargeFlag;
	if(ctmMeter.reviseMeterState&&(ctmMeter.reviseMeterState=='01'||ctmMeter.reviseMeterState=='06')){
		chargeFlag="2";
	}else if(ctmMeter.reviseMeterState&&(ctmMeter.reviseMeterState=='07'||ctmMeter.reviseMeterState=='09')){
		chargeFlag="1";
	}else if(!ctmMeter.reviseMeterState&&ctmMeter.meterFlag=="2"){
		chargeFlag="2";
	}else{
		chargeFlag="1";
	}
	if(chargeFlag=="2"){
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
    
	var meterId =ctmMeter.meterId;
	var reviseMeterId = ctmMeter.reviseMeterId ;//修正表id
	//使用restful批量操作接口，保证同一事务控制
	var billType=workBill.billType;
	var copyType;
	
    //工单处理结果录入
    var workbillresult = $("#resultForm").serializeObject();
    
    var arriveTime = $("#arriveTime").val();
    if(!arriveTime){
		bootbox.alert("<br><center>请填写到户时间</center></br>");
		return;
	}else{
		arriveTime=new Date(arriveTime+"-00:00");
	}
    var finishTime = $("#finishTime").val();
    if(!finishTime){
		bootbox.alert("<br><center>请填写维修完成时间</center></br>");
		return;
	}else{
		finishTime=new Date(finishTime+"-00:00");
	}
    var hiddenDangerPosition = $("#hiddenDangerPosition").val();
    var noUnboltReason = $("#noUnboltReason").val();
    var unauthorizedOpeningReading = $("#unauthorizedOpeningReading").val();
    var hiddenDanger = $("#hiddenDanger").val();
    var checkMaintenanceContents = $("#checkMaintenanceContents").val();
    workbillresult.revisitTime = new Date(workbillresult.revisitTime);
    workbillresult.workBillBackTime = new Date(workbillresult.workBillBackTime+"-00:00");
    workbillresult.ctmArchiveId=ctmArchive.ctmArchiveId;
    workbillresult.workBillId=workBillId;
    workbillresult.arriveTime=arriveTime;
    workbillresult.finishTime=finishTime;
    workbillresult.hiddenDangerPosition=hiddenDangerPosition;
    workbillresult.noUnboltReason=noUnboltReason;
    workbillresult.unauthorizedOpeningReading=unauthorizedOpeningReading;
    workbillresult.checkMaintenanceContents=checkMaintenanceContents;
    workbillresult.hiddenDanger=hiddenDanger;
    workbillresult.csrWorkBillResultId = workBillId;
    workbillresult.downMeterNo=downMeter.meterNo;
    if(downReviseMeter){
    	workbillresult.downReviseMeterNo=downReviseMeter.meterNo;
    }
    var sendPerson = $("#sendPerson").val();
    if(sendPerson){
    	workbillresult.sendPerson = sendPerson;
    }
    var fullgas = $("#fullgas").val();
    if(fullgas){
    	workbillresult.icFullgas=fullgas;
    }
	
	if(surgas){
		workbillresult.icSurgas=surgas;
	}
	if(checkreading){
		workbillresult.downMeterReading=checkreading;
	}
	if(checkrevisereading){
		workbillresult.downMeterReviseReading=checkrevisereading;
	}
    var suppressMmho = $("#suppressMmho").text();
	if(suppressMmho){
		workbillresult.suppressMmho=suppressMmho;
	}
    var suppressQualified = $("#suppressQualified").text();
	if(suppressQualified){
		workbillresult.suppressQualified=suppressQualified;
	}
	var stovePressureMmho = $("#stovePressureMmho").text();
	if(stovePressureMmho){
		workbillresult.stovePressureMmho=stovePressureMmho;
	}
	if (gpypictureId) {
		workbillresult.files=fileId;
        console.log(fileId);
    } else {
        fileId = "";
    }
    
    var unboltJson6 = workBill;
    unboltJson6.completeDate=date;
    unboltJson6.modifiedTime=date;
    unboltJson6.modifiedBy=userinfo.user_id;
    var submitJson;
    console.log(workbillresult)
    if(workBill.billState=="7"){
    	unboltJson6.billState="3";
    	submitJson = {"sets":[
	        {"txid":"1","body":workbillresult,"path":"/gascsrworkbillresult/","method":"PUT"},
        	{"txid":"2","body":unboltJson6,"path":"/gascsrworkbill/","method":"PUT"}
		]}
    }else{
    	unboltJson6.billState="3";
    	submitJson = {"sets":[
	        {"txid":"1","body":workbillresult,"path":"/gascsrworkbillresult/","method":"POST"},
        	{"txid":"2","body":unboltJson6,"path":"/gascsrworkbill/","method":"PUT"}
		]}
    }
	console.log(submitJson)
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
        bootbox.alert("提交成功",function(){
            if(workBill.billType=="B_REMOVEM"){
	            window.location.replace("/serviceManage/dispatching_manage/batch_repair_order_perform.html");
	        }else{
	            window.location.replace("/serviceManage/dispatching_manage/repair_order_perform.html");
	        }
        });
        
    }else{
        bootbox.alert("提交失败");
    }

})

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
				$("#save_btn").addClass("disabled");
				return;
			}else{
				$("#save_btn").removeClass("disabled");
			}
		}else{
			if(parseInt(vreading)>parseInt(reading)){
				bootbox.alert('<center><h4>表读数小于微机表读数，请核实该表是否已过周</h4></center>');
			}
			$("#save_btn").removeClass("disabled");
		}
	}else{
		bootbox.alert('<center><h4>请填写一次表读数</h4></center>');
		$("#save_btn").addClass("disabled");
	}
})
$("#reviseReading").blur(function(){
	var reading =$("#reviseReading").val();
	var vreading = $("#vreviseReading").val();
	if(ctmMeter.reviseMeterId){
		if(reading){
			if(parseInt(vreading)>parseInt(reading)){
				bootbox.alert('<center><h4>修正表读数小于微机表读数，请核实该表是否已过周</h4></center>');
			}
			$("#save_btn").removeClass("disabled");
		}else{
			bootbox.alert('<center><h4>请填写修正表读数</h4></center>');
			$("#save_btn").addClass("disabled");
		}
	}
})