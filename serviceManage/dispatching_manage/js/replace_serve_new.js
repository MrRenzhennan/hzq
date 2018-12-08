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
var depository;
var date = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
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
				$('#oldMeterKind').append('<option  value="' + val + '">' + key + '</option>');
				$('#oldMeterKind2').append('<option  value="' + val + '">' + key + '</option>');
				$('#newMeterKind').append('<option  value="' + val + '">' + key + '</option>');
				$('#newMeterKind2').append('<option  value="' + val + '">' + key + '</option>');
			});
			//初始化进气方向
			var directionEnum={"L":"左进","R":"右进"};
			$.map(directionEnum, function (key, val) {
				$('#oldDirection').append('<option  value="' + val + '">' + key + '</option>');
				$('#oldDirection2').append('<option  value="' + val + '">' + key + '</option>');
				$('#newDirection').append('<option  value="' + val + '">' + key + '</option>');
				$('#newDirection2').append('<option  value="' + val + '">' + key + '</option>');
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
			}else{
				bootbox.alert("<br><center>系统无此客户</center></br>");
				$("#save_btn").addClass("disabled");
			}
            if(!ctmArchive.customerType){
            	bootbox.alert("<br><center>此客户没有维护是否IC信息，请完善客户信息</center></br>");
            	$("#save_btn").addClass("disabled");
            }
            ctmMeter=queryCtmMeter(ctmArchive.ctmArchiveId);
            //查询下线表信息
            console.log(ctmMeter)
            downMeter = Restful.getByID(hzq_rest+"gasmtrmeter",ctmMeter.meterId);
            console.log(downMeter)
            if(!downMeter){
            	bootbox.alert("<br><center>系统无此下线一次表信息</center></br>");
            	$("#save_btn").addClass("disabled");
            }
            if(!downMeter.meterKind){
            	bootbox.alert("<br><center>此下线一次表无表种类信息，请完善表信息</center></br>");
            	$("#save_btn").addClass("disabled");
            }
            
            if(ctmArchive.customerType=="P"&&downMeter.meterKind!="01"){
            	bootbox.alert("<br><center>此客户是普表用户，客户对应的一次表不是普表，请完核对该用户信息</center></br>");
            	$("#save_btn").addClass("disabled");
            }
            if(ctmArchive.customerType=="I"&&downMeter.meterKind=="01"){
            	bootbox.alert("<br><center>此客户是IC卡表用户，客户对应的一次表是普表，请完核对该用户信息</center></br>");
            	$("#save_btn").addClass("disabled");
            }
			
            $.each(downMeter, function(key,val) {
            	$("form[name='oldMeterForm'] input[name='"+key+"']").val(val);
            	$("form[name='oldMeterForm'] select[name='"+key+"']").val(val).trigger("change");
            });
            console.log(ctmMeter.reviseMeterId);
            if(ctmMeter.reviseMeterId){

            	downReviseMeter = Restful.getByID(hzq_rest+"gasmtrmeter",ctmMeter.reviseMeterId);
            	if(!downReviseMeter){
	            	bootbox.alert("<br><center>系统无此下线修正表信息</center></br>");
	            }
            	console.log(downReviseMeter)
            	$.each(downReviseMeter, function(key,val) {
	            	$("form[name='oldMeterForm2'] input[name='"+key+"']").val(val);
	            	$("form[name='oldMeterForm2'] select[name='"+key+"']").val(val).trigger("change");
	            });
            }
            //查询下线表最后一次表读数
			var paramurl = "/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd";
			var froms = "(select ctm_archive_id,meter_reading,revise_reading,meter_reading_id,copy_time,row_number() over (partition by ctm_archive_id order by copy_time desc )as rn1 from gas_mrd_meter_reading where ctm_archive_id='" + ctmArchive.ctmArchiveId + "'and is_mrd='1' and is_bll='1' and copy_state = '6') d";
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
            	console.log(mrdMeterReading)
            	$("#vreading").val(readingData.rows[0].meterReading);
            	if(ctmMeter.reviseMeterId){
            		console.log(readingData.rows[0].reviseReading)
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
			//查询当前单位二级库
			var depositoryData =Restful.findNQ(hzq_rest+'gasmtrdepository?query={"areaId":'+userinfo.area_id+'}');
			console.log(depositoryData);
			if(depositoryData){
				depository=depositoryData[0];
			}
			
			//清空下线表读数
			$("#reading").val("");
			$("#revisereading").val("");
			
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
	                        if(data[0].downMeterReading){
	                        	$("#reading").val(data[0].downMeterReading);
	                        }
	                        if(data[0].downMeterReviseReading){
	                        	$("#revisereading").val(data[0].downMeterReviseReading);
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
	var newMeterForm2 = $("#newMeterForm2").serializeObject();
	var newMeterForm = $("#newMeterForm").serializeObject();
	//需要根据换表信息判断新表抄表信息
	var changeMeter = $("#changeMeter").val();
	if(!changeMeter||changeMeter==""||changeMeter==undefined||changeMeter=="undefined"){
		bootbox.alert("<br><center>请选择更换表</center></br>");
		return;
	}
	if(!newMeterForm.reading){
		bootbox.alert("<br><center>请填写上线表指针</center></br>");
		return;
	}
	if(changeMeter=="1"){
		var checkmeterNo = $("#meterNo").val();
		if(!checkmeterNo){
			bootbox.alert("<br><center>更换一次表请填写新一次表编号</center></br>");
			return;
		}
		if(ctmMeter.reviseMeterId){
			if(!newMeterForm2.meterNo){
				bootbox.alert("<br><center>请在新燃气表信息中填写原修正表编号</center></br>");
				return;
			}
			if(!newMeterForm2.reading){
				bootbox.alert("<br><center>请在新燃气表信息中填写原修正表读数</center></br>");
				return;
			}
		}
	}else if(changeMeter=="2"){
		var checkrevisemeterNo = $("#reviseMeterNo").val();
		if(!checkrevisemeterNo){
			bootbox.alert("<br><center>更换二次表请填写新修正表编号</center></br>");
			return;
		}
		if(!newMeterForm.meterNo){
			bootbox.alert("<br><center>请在新燃气表信息中填写原一次表编号</center></br>");
			return;
		}
		if(!newMeterForm.reading){
			bootbox.alert("<br><center>请在新燃气表信息中填写原一次表读数</center></br>");
			return;
		}
	}else if(changeMeter=="3"){
		var checkmeterNo = $("#meterNo").val();
		var checkrevisemeterNo = $("#reviseMeterNo").val();
		if(!checkmeterNo){
			bootbox.alert("<br><center>更换一次表+二次表请填写新一次表编号</center></br>");
			return;
		}
		if(!checkrevisemeterNo&&!ctmMeter.reviseMeterId){
			bootbox.alert("<br><center>更换一次表+二次表请填写新修正表编号</center></br>");
			return;
		}
	}
	
	var checkreading = $("#reading").val().trim();
	var checkrevisereading = $("#revisereading").val().trim();
	var checkvreading = $("#vreading").val().trim();
	var checkvrevisereading = $("#vrevisereading").val().trim();
	if(!checkreading){
		bootbox.alert("<center><h4>请填写下线表或原表一次表读数</h4></center>");
		return;
	}
	if(ctmMeter.reviseMeterId){
		if(!checkrevisereading){
			bootbox.alert("<center><h4>请填写下线表或原表修正表读数</h4></center>");
			return;
		}
		
	}else{
		if(downMeter.meterKind=="02"||downMeter.meterKind=="03"){
			if(parseInt(checkreading)<parseInt(checkvreading)){
				bootbox.alert("<center><h4>IC卡表表读数不能小于微机表读数</h4></center>");
				return;
			}
		}
	}
	
    //工单处理结果录入
    var unboltJson5 = $("#resultForm").serializeObject();
    if(checkvreading){
    	unboltJson5.vmeterReading=checkvreading;
    }
    if(checkvrevisereading){
    	unboltJson5.vreviseMeterReading=checkvrevisereading;
    }
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
    unboltJson5.ctmArchiveId=ctmArchive.ctmArchiveId;
    unboltJson5.workBillId=workBill.workBillId;
    unboltJson5.arriveTime=arriveTime;
    unboltJson5.finishTime=finishTime;
    unboltJson5.hiddenDangerPosition=hiddenDangerPosition;
    unboltJson5.csrWorkBillResultId = workBill.workBillId;
    unboltJson5.changeMeter=changeMeter;
    unboltJson5.downMeterNo=downMeter.meterNo;
    if(downReviseMeter){
    	unboltJson5.downReviseMeterNo=downReviseMeter.meterNo;
    }
    var sendPerson = $("#sendPerson").val();
    if(sendPerson){
    	unboltJson5.sendPerson = sendPerson;
    }
    var surgas = $("#surgas").val();
	if(downMeter.meterKind=="02"||downMeter.meterKind=="03"){
		if(!surgas){
			bootbox.alert("<br><center>下线表是IC表，请填写IC卡表剩余气量</center></br>");
			return;
		}
	}
	var surgas = $("#surgas").val();
	if(surgas){
		unboltJson5.icSurgas=surgas;
	}
	if(checkreading){
		unboltJson5.downMeterReading=checkreading;
	}
	if(checkrevisereading){
		unboltJson5.downMeterReviseReading=checkrevisereading;
	}
	
	if(newMeterForm.meterNo){
		unboltJson5.upMeterNo=newMeterForm.meterNo;
	}
	if(newMeterForm2.meterNo){
		unboltJson5.upReviseMeterNo=newMeterForm2.meterNo;
	}
	if(newMeterForm.reading){
		unboltJson5.upMeterReading=newMeterForm.reading;
	}
	if(newMeterForm2.reading){
		unboltJson5.upReviseMeterReading=newMeterForm2.reading;
	}
	var suppressMmho = $("#suppressMmho").text();
	if(suppressMmho){
		unboltJson5.suppressMmho=suppressMmho;
	}
	var stovePressureMmho = $("#stovePressureMmho").text();
	if(stovePressureMmho){
		unboltJson5.stovePressureMmho=stovePressureMmho;
	}
	var suppressQualified = $("#suppressQualified").text();
	if(suppressQualified){
		unboltJson5.suppressQualified=suppressQualified;
	}
	if (gpypictureId) {
		unboltJson5.files=fileId;
        console.log(fileId);
    } else {
        fileId = "";
    }
	
    //更改工单信息
    workBill.completeDate=date;
    workBill.modifiedTime=date;
    workBill.modifiedBy=userinfo.user_id;
    var billState=workBill.billState+"";
    var submitJson;
    if(workBill.billState=="7"){
    	workBill.billState="3";
    	submitJson = {"sets":[
	        {"txid":"1","body":unboltJson5,"path":"/gascsrworkbillresult/","method":"PUT"},
	        {"txid":"2","body":workBill,"path":"/gascsrworkbill/","method":"PUT"}
		]}
    }else{
    	workBill.billState="3";
    	submitJson = {"sets":[
	        {"txid":"1","body":unboltJson5,"path":"/gascsrworkbillresult/","method":"POST"},
	        {"txid":"2","body":workBill,"path":"/gascsrworkbill/","method":"PUT"}
		]}
    }
    var flowjson={};
//  if(ctmArchive.customerKind=="9"){//非居民
//  	workBill.billState="6";
//  }else{//居民
//  	if(downMeter.meterKind=="02"||downMeter.meterKind=="03"){
//  		workBill.billState="6";
//  		var busiData={
//		    	"customerCode":workBill.customerCode,
//		    	"customerName":workBill.customerName,
//		    	"customerTel":ctmArchive.tel,
//		    	"customerAddress":workBill.customerAddress,
//		    	"idcard":ctmArchive.idcard,
//		    	"customerKind":ctmArchive.customerKind,
//		    	"busitype":"IC卡余量工单审批",
//		    	"workBillId":workBillId
//		    }
//			flowjson = {
//		        "flow_def_id":"HBGDSP",
//		        "ref_no":"",
//		        "be_orgs":userinfo.area_id,
//		        "operator":userinfo.userId,
//		        "flow_inst_id":"",
//		        "prop1str64":moment().format("YYYY-MM-DD HH:mm:ss"),
//		        "prop2str64":ctmArchive.customerName+"("+ctmArchive.customerCode+")",
//		        "propstr128":"计量中心",
//		        "propstr2048":busiData,
//		        "override_exists":false
//		    }
//			var instId = workBill.billTitle+"_"+new Date().getTime();
//			flowjson.ref_no=instId;
//			flowjson.flow_inst_id=instId;
//			var flow_result = Restful.insert("/hzqs/psm/pbisn.do?fh=VFLSCGC000000J00&bd={}&resp=bd",flowjson);
//		    if(flow_result.retmsg != "SUCCESS:1"){
//		        bootbox.alert("<br><center><h4>工单审核流程提交失败</h4></center><br>")
//		    	return;
//		    }
//  	}
//  }
//  if(downMeter.meterKind=="02"||downMeter.meterKind=="03"||ctmArchive.customerKind=='9'){
    if(ctmArchive.customerKind=='9'){
		workBill.billState="6";
		var busiData={
	    	"customerCode":workBill.customerCode,
	    	"customerName":workBill.customerName,
	    	"customerTel":ctmArchive.tel,
	    	"customerAddress":workBill.customerAddress,
	    	"idcard":ctmArchive.idcard,
	    	"customerKind":ctmArchive.customerKind,
	    	"busitype":"换表工单审批",
	    	"workBillId":workBillId
	    }
		flowjson = {
	        "flow_def_id":"HBGDSP",
	        "ref_no":"",
	        "be_orgs":userinfo.area_id,
	        "operator":userinfo.userId,
	        "flow_inst_id":"",
	        "prop1str64":moment().format("YYYY-MM-DD HH:mm:ss"),
	        "prop2str64":ctmArchive.customerName+"("+ctmArchive.customerCode+")",
	        "propstr128":"计量中心",
	        "propstr2048":busiData,
	        "override_exists":false
	    }
		var instId = workBill.billTitle+"_"+new Date().getTime();
		flowjson.ref_no=instId;
		flowjson.flow_inst_id=instId;
		var flow_result = Restful.insert("/hzqs/psm/pbisn.do?fh=VFLSCGC000000J00&bd={}&resp=bd",flowjson);
	    if(flow_result.retmsg != "SUCCESS:1"){
	        bootbox.alert("<br><center><h4>工单审核流程提交失败</h4></center><br>")
	    	return;
	    }
		
	}
    var result;
    $.ajax({
        type: 'POST',
        url:  "/hzqs/dbc/pbtxs.do?fh=SELDBC0000000J00&resp=bd",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        isMask: true,
        data: JSON.stringify(submitJson),
        success: function(data) {
            result = data;
            bootbox.alert("提交成功",function(){
	        	if(workBill.billType=="B_CHANGEM"){
	        		window.location.replace("/serviceManage/dispatching_manage/batch_repair_order_perform.html");
	        	}else{
	        		window.location.replace("/serviceManage/dispatching_manage/repair_order_perform.html");
	        	}
	        });
        },
        error: function(err) {
            result = new Object();
            result["success"] = false;
            result["description"]  = err.statusText ? err.statusText : "不明错误原因..";
            console.log("error:"+JSON.stringify(err))
            var ss = Restful.delByIDR(hzq_rest + "/psmflowinst",instId);
            var ss2 = Restful.delByIDR(hzq_rest + "/psmstepinst",instId);
			bootbox.alert("提交失败");
        }
    });
//	var result = Restful.insert("/hzqs/dbc/pbtxs.do?fh=SELDBC0000000J00&resp=bd",submitJson);

//  console.log("submit:result:"+JSON.stringify(result));
//  console.log(result);
//
//	var retFlag=true;
//  
//  if(result.success&&result.success==false){
//      retFlag=false;
//  }else{
//      for(var i=0;i<result.results.length;i++){
//          if(!result.results[i].result.success){
//              retFlag=false;
//              break;
//          }
//      }
//  }
//  if(retFlag){
//  	if(downMeter.meterKind=="02"||downMeter.meterKind=="03"||ctmArchive.customerKind=='9'){
//			
//  	}
//  	
//  	
//      bootbox.alert("提交成功",function(){
//      	if(workBill.billType=="B_CHANGEM"){
//      		window.location.replace("/serviceManage/dispatching_manage/batch_repair_order_perform.html");
//      	}else{
//      		window.location.replace("/serviceManage/dispatching_manage/repair_order_perform.html");
//      	}
//      });
//  }else{
//      bootbox.alert("提交失败");
//  }
})	

var queryCtmMeter = function(ctmArchiveId){
	var res;
	var oneQuery = RQLBuilder.and([
		    RQLBuilder.equal("ctmArchiveId",ctmArchiveId),RQLBuilder.equal("meterUserState","01")
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
    if(results&&results.length==1){
    	var data = results[0];
    	if(!data.meterKind){
    		bootbox.alert("<br><center>表编号为["+_no+"]的一次表没有维护表具种类，请维护该表具信息</center></br>");
            $("#save_btn").addClass("disabled");
            return;
    	}else{
    		$("#save_btn").removeClass("disabled");
    	}
    	if(data.depositoryId&&data.depositoryId!=depository.depositoryId&&data.depositoryId!='2c91808300000012015d1285db070129'){
    		bootbox.alert("<br><center>表编号为["+_no+"]的一次表不属于"+depository.depositoryName+"，请先做表具二级库入库</center></br>");
            $("#save_btn").addClass("disabled");
            return;
    	}else{
    		$("#save_btn").removeClass("disabled");
    	}
    	if(data.stockState&&data.stockState=='4'){
			bootbox.alert("<br><center>表编号为["+_no+"]的一次表已上线，请核实表具信息</center></br>");
            $("#save_btn").addClass("disabled");
            return;
    	}else{
    		$("#save_btn").removeClass("disabled");
    	}
    	if(data.stockState&&data.stockState=='5'){
    		if(data.depositoryId!="2c91808300000012015d1285db070129"){
    			if(downMeter.depositoryId=="2c91808300000012015d1285db070129"){
    				$("#save_btn").removeClass("disabled");
    			}else{
    				bootbox.alert("<br><center>表编号为["+_no+"]的一次表已下线，非备表下线表不允许上线</center></br>");
		            $("#save_btn").addClass("disabled");
		            return;
    			}
    		}
    	}else{
    		$("#save_btn").removeClass("disabled");
    	}
    	$.each(data, function(key,val) {
    		$("form[name='newMeterForm'] input[name="+key+"]").val(val);
    		$("form[name='newMeterForm'] select[name='"+key+"']").val(val).trigger("change");
    	});
    	$("#reading1").val("");
    	meterId=data.meterId;
    	meterKind=data.meterKind;
    }else if(results&&results.length>1){
    	bootbox.alert('<br><center>表编号重复，系统存在多块编号为['+_no+']的一次表，请核对表具信息</h4></center>');
    	$("#save_btn").addClass("disabled");
    	return;
    }else{
    	bootbox.alert('<center><h4>系统中无此表信息，请对该表具进行信息补录</h4></center>');
    	$("#save_btn").addClass("disabled");
    	return;
    }
})

$("#reviseMeterNo").blur(function(){

	var _no = $("#reviseMeterNo").val();
	if(downReviseMeter&&_no==downReviseMeter.meterNo){
		bootbox.alert('<center><h4>新修正表编号与下线修正表编号相同，请核实是否不更换此表</h4></center>');
	}
	var results = Restful.findNQ(hzq_rest+'gasmtrmeter/?query={"meterNo":"'+_no+'"}');
    console.log(results);
    if(results&&results.length>0){
    	var data = results[0];
    	if(!data.meterKind){
    		bootbox.alert("<br><center>表编号为["+_no+"]的修正表没有维护表具种类，请维护该表具信息</center></br>");
            $("#save_btn").addClass("disabled");
            return;
    	}else{
    		$("#save_btn").removeClass("disabled");
    	}
//  	if(data.depositoryId&&data.depositoryId=="11"){
//  		bootbox.alert("<br><center>表编号为["+_no+"]的修正表属于一级库，请先做表具二级库入库</center></br>");
//          $("#save_btn").addClass("disabled");
//          return;
//  	}else{
//  		$("#save_btn").removeClass("disabled");
//  	}
//  	if(data.stockState&&data.stockState=='4'){
//			bootbox.alert("<br><center>表编号为["+_no+"]的修正表已上线</center></br>");
//          $("#save_btn").addClass("disabled");
//          return;
//  	}else{
//  		$("#save_btn").removeClass("disabled");
//  	}
//  	if(data.stockState&&data.stockState=='5'){
//  		if(data.depositoryId!="2c91808300000012015d1285db070129"){
//  			bootbox.alert("<br><center>表编号为["+_no+"]的修正表已下线，非备表下线表不允许上线</center></br>");
//	            $("#save_btn").addClass("disabled");
//	            return;
//  		}
//  	}else{
//  		$("#save_btn").removeClass("disabled");
//  	}
    	$.each(data, function(key,val) {
    		$("form[name='newMeterForm2'] input[name="+key+"]").val(val);
    		$("form[name='newMeterForm2'] select[name='"+key+"']").val(val).trigger("change");
    	});
    	$("#reviseReading").val("");
    	reviseMeterId=data.meterId;
    	meterKind=data.meterKind;
    	bootbox.alert('<center><h4>请核对上线修正表指针</h4></center>');
    }else{
    	bootbox.alert('<div style="text-align:center"><h4>系统中无此表信息，请对该表具进行开栓补录</h4></div>');
    	$("#save_btn").addClass("disabled");
    	return;
    }
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
