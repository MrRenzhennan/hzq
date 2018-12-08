var ctmArchive ;
var workBillId ;
var workBill;
var depository;
var userinfo = JSON.parse(localStorage.getItem('user_info'));
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
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
var ScatteredLsksServe = function(){
	return {
        init: function () {
            this.reload();
        },
        reload: function () {
        	//初始化表具类型
			var meterKindEnum={"01":"普表","02":"IC卡气量表","03":"IC卡金额表","04":"代码表","05":"远传表"};
			$.map(meterKindEnum, function (key, val) {
				$('#oldMeterKind').append('<option  value="' + val + '">' + key + '</option>');
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
						$('#newMeterModelId').append('<option  value="' + data[o].meterModelId + '">' + data[o].meterModelName + '</option>');
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
						$('#newFactoryId').append('<option  value="' + data[o].factoryId + '">' + data[o].factoryName + '</option>');
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
				if(ctmArchive.customerState!='00'){
                	bootbox.alert('<center><h4>该用户不是未开栓用户，请检查客户档案信息中客户状态</h4></center>');
					$("#save_btn").addClass("disabled");
                }
				$("#idcard").val(archiveData[0].idcard);
				$("#tel").val(archiveData[0].tel);
				$("#save_btn").removeClass("disabled");
			}else{
				bootbox.alert("<br><center>系统无此客户</center></br>");
				$("#save_btn").addClass("disabled");
			}
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
				            if(data[0].downMeterNo){
				            	$("#_meterNo").val(data[0].downMeterNo).trigger("blur");
				            }
				            if(data[0].upMeterReading){
				            	$("#reading").val(data[0].upMeterReading);
				            }
				            if(data[0].downMeterReading){
	                        	$("#_reading").val(data[0].downMeterReading);
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
            $("#vreading").val("0");
        }
    }
}()
			
$("#save_btn").click(function(){
	$("#save_btn").addClass("disabled");
	if(ctmArchive.customerState!='00'){
    	bootbox.alert('<center><h4>该用户不是未开栓用户，请检查客户档案信息中客户状态</h4></center>');
		$("#save_btn").addClass("disabled");
		return;
    }
	var _checkmeterNo= $("#_meterNo").val();
	if(!_checkmeterNo){
		bootbox.alert("<br><center>请填写下线表编号</center></br>");
		$("#save_btn").removeClass("disabled");
		return;
	}
	var checkmeterNo = $("#meterNo").val();
	if(!checkmeterNo){
		bootbox.alert("<br><center>请填写新燃气表编号</center></br>");
		$("#save_btn").removeClass("disabled");
		return;
	}
	
	var checkreading = $("#reading").val();
	var _checkreading = $("#_reading").val();
	if(!checkreading){
		bootbox.alert("<center><h4>请填写新燃气表读数</h4></center>");
		$("#save_btn").removeClass("disabled");
		return;
	}
	if(!_checkreading){
		bootbox.alert("<center><h4>请填写下线表读数</h4></center>");
		$("#save_btn").removeClass("disabled");
		return;
	}
    //工单处理结果录入
    var unboltJson5 = $("#resultForm").serializeObject();
    var arriveTime = $("#arriveTime").val();
    var finishTime = $("#finishTime").val();
    if(!arriveTime){
		bootbox.alert("<br><center>请填写到户时间</center></br>");
		$("#save_btn").removeClass("disabled");
		return;
	}else{
		arriveTime=new Date(arriveTime+"-00:00");
	}
    if(!finishTime){
		bootbox.alert("<br><center>请填写维修完成时间</center></br>");
		$("#save_btn").removeClass("disabled");
		return;
	}else{
		finishTime=new Date(finishTime+"-00:00");
	}
    var hiddenDangerPosition = $("#hiddenDangerPosition").val();
    unboltJson5.ctmArchiveId=ctmArchive.ctmArchiveId;
    unboltJson5.workBillId=workBillId;
    unboltJson5.arriveTime=arriveTime;
    unboltJson5.finishTime=finishTime;
    unboltJson5.hiddenDangerPosition=hiddenDangerPosition;
    unboltJson5.csrWorkBillResultId = workBillId;
    var sendPerson = $("#sendPerson").val();
    unboltJson5.sendPerson = sendPerson;
    unboltJson5.upMeterNo=checkmeterNo;
    unboltJson5.downMeterNo=_checkmeterNo;
    unboltJson5.upMeterReading=checkreading;
    unboltJson5.downMeterReading=_checkreading;
    unboltJson5.vmeterReading="0";
    unboltJson5.createdBy=userinfo.userId;
    unboltJson5.modifiedBy=userinfo.userId;
    if (gpypictureId) {
		unboltJson5.files=fileId;
        console.log(fileId);
    } else {
        fileId = "";
    }
    var surgas = $("#surgas").val();
	if(surgas){
		unboltJson5.icSurgas=surgas;
	}
    var fullgas = $("#fullgas").val();
	if(fullgas){
		unboltJson5.icFullgas=fullgas;
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
    //更改工单信息
    workBill.modifiedTime=new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
    workBill.modifiedBy=userinfo.user_id;
    var submitJson;
    if(workBill.billState=="7"){
    	workBill.billState="3";
    	unboltJson5.modifiedBy=userinfo.userId;
    	unboltJson5.modifiedTime=new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
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
    
	console.log(submitJson)
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
		        bootbox.alert("提交成功",function(){
		            window.location.replace("/serviceManage/dispatching_manage/repair_order_perform.html");
		        });
		    }else{
		    	$("#save_btn").removeClass("disabled");
		        bootbox.alert("提交失败");
		    }
        },
        error: function(err) {
        	$("#save_btn").removeClass("disabled");
            bootbox.alert("提交失败");
            if( err.status==406){
                //need to login
                if(window.location.pathname.indexOf('/login.html')<0)
                {
                    window.location.replace("/login.html?redirect="+window.location.pathname);
                }
            }
        }
    });
})	

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
	if(!_no){
		bootbox.alert('<center><h4>上线表编号不能为空</h4></center>');
		$("#save_btn").addClass("disabled");
		$("form[name='newMeterForm'] input").val("");
		$("form[name='newMeterForm'] select").val("").trigger("change");
    	return;
	}else{
		$("#save_btn").removeClass("disabled");
	}
	var _ckeckno = $("#_meterNo").val();
	if(_no==_ckeckno){
		bootbox.alert('<center><h4>上线表编号与下线表编号不能相同</h4></center>');
		$("#save_btn").addClass("disabled");
		return;
	}else{
		$("#save_btn").removeClass("disabled");
	}
	var results = Restful.findNQ(hzq_rest+'gasmtrmeter/?query={"meterNo":"'+_no+'"}');
    console.log(results);
    if(results&&results.length==1){
    	var data = results[0];
    	if(!data.meterKind){
    		bootbox.alert("<br><center>表编号为["+_no+"]的上线表没有维护表具种类，请维护该表具信息</center></br>");
            $("#save_btn").addClass("disabled");
            return;
    	}else{
    		$("#save_btn").removeClass("disabled");
    	}
    	if(data.depositoryId&&data.depositoryId!=depository.depositoryId&&data.depositoryId!='2c91808300000012015d1285db070129'){
    		bootbox.alert("<br><center>表编号为["+_no+"]的上线表不属于"+depository.depositoryName+"，请先做表具二级库入库</center></br>");
            $("#save_btn").addClass("disabled");
            return;
    	}else{
    		$("#save_btn").removeClass("disabled");
    	}
    	if(data.stockState&&data.stockState=='4'){
			bootbox.alert("<br><center>表编号为["+_no+"]的上线表已上线，换表开栓的上线表状态应为在库，请核实表具信息</center></br>");
            $("#save_btn").addClass("disabled");
            return;
    	}else{
    		$("#save_btn").removeClass("disabled");
    	}
    	if(data.stockState&&data.stockState=='5'){
			bootbox.alert("<br><center>表编号为["+_no+"]的上线表已下线，换表开栓的上线表状态应为在库，请核实表具信息</center></br>");
            $("#save_btn").addClass("disabled");
            return;
    	}else{
    		$("#save_btn").removeClass("disabled");
    	}
    	$.each(data, function(key,val) {
    		$("form[name='newMeterForm'] input[name="+key+"]").val(val);
    		$("form[name='newMeterForm'] select[name='"+key+"']").val(val).trigger("change");
    	});
    	$("#reading").val("");
    }else if(results&&results.length>1){
    	bootbox.alert('<br><center>表编号重复，系统存在多块编号为['+_no+']的燃气表，请核对表具信息</h4></center>');
    	$("#save_btn").addClass("disabled");
    	return;
    }else{
    	bootbox.alert('<center><h4>系统中无此表信息，请对该表具进行信息补录</h4></center>');
    	$("#save_btn").addClass("disabled");
    	return;
    }
})

$("#_meterNo").blur(function(){
	var _no = $("#_meterNo").val();
	if(!_no){
		bootbox.alert('<center><h4>下线表编号不能为空</h4></center>');
		$("#save_btn").addClass("disabled");
		$("form[name='oldMeterForm'] input").val("");
		$("form[name='oldMeterForm'] select").val("").trigger("change");
    	return;
	}else{
		$("#save_btn").removeClass("disabled");
	}
	var _ckeckno = $("#meterNo").val();
	if(_no==_ckeckno){
		bootbox.alert('<center><h4>下线表编号与新燃气表编号不能相同</h4></center>');
		$("#save_btn").addClass("disabled");
		return;
	}else{
		$("#save_btn").removeClass("disabled");
	}
	var results = Restful.findNQ(hzq_rest+'gasmtrmeter/?query={"meterNo":"'+_no+'"}');
    console.log(results);
    if(results&&results.length==1){
    	var data = results[0];
    	if(!data.meterKind){
    		bootbox.alert("<br><center>表编号为["+_no+"]的下线表没有维护表具种类，请维护该表具信息</center></br>");
            $("#save_btn").addClass("disabled");
            return;
    	}else{
    		$("#save_btn").removeClass("disabled");
    	}
    	if(data.depositoryId&&data.depositoryId!=depository.depositoryId&&data.depositoryId!='2c91808300000012015d1285db070129'){
    		bootbox.alert("<br><center>表编号为["+_no+"]的下线表不属于"+depository.depositoryName+"，请先做表具二级库入库</center></br>");
            $("#save_btn").addClass("disabled");
            return;
    	}else{
    		$("#save_btn").removeClass("disabled");
    	}
    	if(data.stockState&&data.stockState=='4'){
			bootbox.alert("<br><center>表编号为["+_no+"]的下线表已上线，换表开栓的下线表状态应为在库，请核实表具信息</center></br>");
            $("#save_btn").addClass("disabled");
            return;
    	}else{
    		$("#save_btn").removeClass("disabled");
    	}
    	if(data.stockState&&data.stockState=='5'){
			bootbox.alert("<br><center>表编号为["+_no+"]的下线表已下线，换表开栓的下线表状态应为在库，请核实表具信息</center></br>");
            $("#save_btn").addClass("disabled");
            return;
    	}else{
    		$("#save_btn").removeClass("disabled");
    	}
    	$.each(data, function(key,val) {
    		$("form[name='oldMeterForm'] input[name="+key+"]").val(val);
    		$("form[name='oldMeterForm'] select[name='"+key+"']").val(val).trigger("change");
    	});
    	$("#_reading").val("");
    }else if(results&&results.length>1){
    	bootbox.alert('<br><center>表编号重复，系统存在多块编号为['+_no+']的燃气表，请核对表具信息</h4></center>');
    	$("#save_btn").addClass("disabled");
    	return;
    }else{
    	bootbox.alert('<center><h4>系统中无此表信息，请对该表具进行信息补录</h4></center>');
    	$("#save_btn").addClass("disabled");
    	return;
    }
})

$("#cencel_btn").click(function(){
	history.go("-1");
})

$("#reading").blur(function(){
	var _no = $("#meterNo").val();
	if(!_no){
		bootbox.alert('<center><h4>请填写新燃气表编号</h4></center>');
		return;
	}
	var reading =$("#reading").val();
	if(reading){
		if(reading!=0&&reading!=1){
			bootbox.alert('<center><h4>新燃气表读数只能是0或1</h4></center>');
			$("#save_btn").addClass("disabled");
		}else{
			$("#save_btn").removeClass("disabled");
		}
	}else{
		bootbox.alert('<center><h4>请填写新燃气表表读数</h4></center>');
		$("#save_btn").addClass("disabled");
	}
})
$("#_reading").blur(function(){
	var _no = $("#_meterNo").val();
	if(!_no){
		bootbox.alert('<center><h4>请填写下线表编号</h4></center>');
		return;
	}
	var reading =$("#_reading").val();
	if(reading){
		if(reading<0){
			bootbox.alert('<center><h4>下线表表读数不能小于0</h4></center>');
			$("#save_btn").addClass("disabled");
		}else{
			$("#save_btn").removeClass("disabled");
		}
	}else{
		bootbox.alert('<center><h4>请填写下线表表读数</h4></center>');
		$("#save_btn").addClass("disabled");
	}
})
