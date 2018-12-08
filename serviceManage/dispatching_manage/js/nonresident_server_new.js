/**
 * Created by Administrator on 2017/7/25 0025.
 */
var ctmArchive ;
var workBillId ;
var workBill;
var meterId;
var depository;
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
                    console.log(data)
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
                        if(workBill.billType=='WB_REUSEGZB'){
                        	if(ctmArchive.customerState!='02'){
	                        	bootbox.alert('<center><h4>该用户不是暂停用气用户，请检查客户档案信息中客户状态</h4></center>');
								$("#save_btn").addClass("disabled");
	                        }
                        }else{
                        	if(ctmArchive.customerState!='00'){
	                        	bootbox.alert('<center><h4>该用户不是未开栓用户，请检查客户档案信息中客户状态</h4></center>');
								$("#save_btn").addClass("disabled");
	                        }
                        }
                        $("#idcard").val(data[0].idcard);
                        $("#tel").val(data[0].tel);
                    }
                }
            })
            //查询当前单位二级库
			var depositoryData =Restful.findNQ(hzq_rest+'gasmtrdepository?query={"areaId":'+userinfo.area_id+'}');
			console.log(depositoryData);
			if(depositoryData){
				depository=depositoryData[0];
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
            if(workBill.billState=="7"){
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
                            workbillresult = data[0];
                            console.log(data)
                            console.log(data[0].upMeterReading)
                            $("#arriveTime").val(data[0].arriveTime);
                            $("#finishTime").val(data[0].finishTime);
                            $("#noUnboltReason").val(data[0].noUnboltReason).trigger("change");
                            $("#sendPerson").val(data[0].sendPerson).trigger("change");
                            $("#backReason").val(data[0].backReason);
                            $("#changeMeter").val(data[0].changeMeter).trigger("change");
                            $("#hiddenDangerPosition").val(data[0].hiddenDangerPosition);
                            $("#unauthorizedOpeningReading").val(data[0].unauthorizedOpeningReading);
                            $("#unauthorizedOpeningReading").attr("readonly","readonly");
                            // $("#readingone").val(data[0].upMeterReading);
                            // $("#readings").val(data[0].upReviseMeterReading);
                            // $("#meterNo1").val(data[0].upReviseMeterNo).trigger("change");
                            if(data[0].downMeterReading){
                                $("#reading").val(data[0].downMeterReading);
                            }
                            if(data[0].downMeterReviseReading){
                                $("#revisereading").val(data[0].downMeterReviseReading);
                            }

                            $.each(data[0], function(key,val) {
                                $("form[name='meterForm2'] input[name='"+key+"']").val(val);
                                $("form[name='meterForm2'] select[name='"+key+"']").val(val).trigger("change");
                            });

                            if(data[0].unboltResult){
                                console.log(data[0].unboltResult)
                                var checks=$('input.fors');
                                for(var i=0;i<checks.length;i++){
                                    checks[i].index=i;
                                    if(data[0].unboltResult.indexOf(checks[i].value)>=0){
                                        $(checks[i]).parent("span").attr("class","checked");
                                    }

                                }
                            }
                            if(data[0].suppressMmho){
                                $("#suppressMmho").text(data[0].suppressMmho);
                            }
                            if(data[0].suppressQualified){
                                $("#suppressQualified").text(data[0].suppressQualified);
                            }
                            if(data[0].stovePressureMmho){
                                $("#stovePressureMmho").text(data[0].stovePressureMmho);
                            }
                            if(data[0].upMeterNo){
                                $("#meterNo").val(data[0].upMeterNo).trigger("blur");
                            }
                            if(data[0].upMeterReading){
                                $("#readingone").val(data[0].upMeterReading);
                            }
                            if(data[0].upReviseMeterNo){
                                $("#meterNo1").val(data[0].upReviseMeterNo).trigger("blur");
                            }
                            if(data[0].upReviseMeterReading){
                                $("#readings").val(data[0].upReviseMeterReading);
                            }
                            if(data[0].icFullgas){
                                $("#fullgas").val(data[0].icFullgas);
                            }
                            if(data[0].icSurgas){
                                $("#surgas").val(data[0].icSurgas);
                            }
                            console.log(data[0].files)
//                          if(data[0].files){
//                              pic(data[0].files)
//                          }
                        }
                    }
                })
            }
        }
    }
}()


$("#save_btn").click(function(){
	$("#save_btn").addClass("disabled");
    //表具信息录入
    var date = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");

	var checkmeterNo = $("#meterNo").val();
	if(!checkmeterNo){
		bootbox.alert("<br><center>请填写一次表编号</center></br>");
		$("#save_btn").removeClass("disabled");
		return;
	}
	var checkreading = $("#reading").val();
	if(!checkreading){
		bootbox.alert("<center><h4>请填一次表读数</h4></center>");
		$("#save_btn").removeClass("disabled");
		return;
	}
	var _checkmeterNo=$("#meterNo1").val()
	var _checkreading = $("#reading1").val();
	
	if(_checkmeterNo){
		if(!_checkreading){
			bootbox.alert("<center><h4>请填修正表读数</h4></center>");
			$("#save_btn").removeClass("disabled");
			return;
		}
	}
	if(_checkreading){
		if(!_checkmeterNo){
			bootbox.alert("<center><h4>请填修正表编号</h4></center>");
			$("#save_btn").removeClass("disabled");
			return;
		}
	}
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
		bootbox.alert("<br><center>请填写开栓完成时间</center></br>");
		$("#save_btn").removeClass("disabled");
		return;
	}else{
		finishTime=new Date(finishTime+"-00:00");
	}
    //工单处理结果录入
    var workBillResult = $("#meterForm2").serializeObject();
    // var hiddenDangerPosition = $("#hiddenDangerPosition").val();
    // var noUnboltReason = $("#noUnboltReason").val();
    // var unauthorizedOpeningReading = $("#unauthorizedOpeningReading").val();
    // var hiddenDanger = $("#hiddenDanger").val();
    var sendPerson = $("#sendPerson").val();
    workBillResult.ctmArchiveId=ctmArchive.ctmArchiveId;
    workBillResult.upMeterNo=$("#meterNo").val();
    workBillResult.upReviseMeterNo=$("#meterNo1").val();
    workBillResult.upReviseMeterReading=$("#reading1").val();
    workBillResult.upMeterReading=$("#reading").val();
    workBillResult.ctmArchiveId=ctmArchive.ctmArchiveId;
    workBillResult.workBillId=workBillId;
    workBillResult.arriveTime=arriveTime;
    workBillResult.finishTime=finishTime;
    workBillResult.suppressMmho=$("#suppressMmho").html();
    workBillResult.suppressQualified=$("#suppressQualified").html();
    workBillResult.stovePressureMmho=$("#stovePressureMmho").html();
    // workBillResult.hiddenDangerPosition=hiddenDangerPosition;
    // workBillResult.noUnboltReason=noUnboltReason;
    // workBillResult.unauthorizedOpeningReading=unauthorizedOpeningReading;
    // workBillResult.hiddenDanger=hiddenDanger;
    workBillResult.csrWorkBillResultId = workBillId;
    workBillResult.sendPerson = sendPerson;

    //更新工单状态
    workBill.completeDate=date;
    workBill.modifiedTime=date;
    workBill.modifiedBy=userinfo.user_id;


    if(workBill.billState=="7"){
        workBill.billState="3";
        submitJson = {"sets":[
            {"txid":"1","body":workBillResult,"path":"/gascsrworkbillresult/","method":"PUT"},
            {"txid":"2","body":workBill,"path":"/gascsrworkbill/","method":"PUT"}
        ]}
    }else{
        workBill.billState="3";
        submitJson = {"sets":[
            {"txid":"1","body":workBillResult,"path":"/gascsrworkbillresult/","method":"POST"},
            {"txid":"2","body":workBill,"path":"/gascsrworkbill/","method":"PUT"}
        ]}
    }

    console.log(submitJson)
    var result = Restful.insert("/hzqs/dbc/pbtxs.do?fh=SELDBC0000000J00&resp=bd",submitJson)

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
        bootbox.alert("提交成功",function(){
            window.location.replace("/serviceManage/dispatching_manage/repair_order_perform.html");
        });

    }else{
        bootbox.alert("提交失败");
    }

})

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
		$("#save_btn").addClass("disabled");
		$("form[name='meterForm'] input").val("");
		$("form[name='meterForm'] select").val("").trigger("change");
    	return;
	}else{
		$("#save_btn").removeClass("disabled");
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
			bootbox.alert("<br><center>表编号为["+_no+"]的一次表已上线，零散开栓的一次表状态应为在库，请核实表具信息</center></br>");
            $("#save_btn").addClass("disabled");
            return;
    	}else{
    		$("#save_btn").removeClass("disabled");
    	}
    	if(data.stockState&&data.stockState=='5'){
			bootbox.alert("<br><center>表编号为["+_no+"]的一次表已下线，零散开栓的一次表状态应为在库，请核实表具信息</center></br>");
            $("#save_btn").addClass("disabled");
            return;
    	}else{
    		$("#save_btn").removeClass("disabled");
    	}
    	$.each(data, function(key,val) {
    		$("form[name='meterForm'] input[name="+key+"]").val(val);
    		$("form[name='meterForm'] select[name='"+key+"']").val(val).trigger("change");
    	});
    	$("#reading").val("");
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
$("#meterNo1").blur(function(){
    if(!$("#meterNo1").val()){
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
        $("#reading1").val("");
    }else{
        bootbox.alert('<center><h4>系统中无此表信息，请对该表具进行信息补录</h4></center>');
    }
})
$("#cencel_btn").click(function(){
    history.go("-1");
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
            $("#unboltResult").val(checkarr.join());
        }
    }
}
checkone();
$("#reading").blur(function(){
	var _no = $("#meterNo").val();
	if(!_no){
		bootbox.alert('<center><h4>填写一次表读数需先填写一次表编号</h4></center>');
		return;
	}
	var reading =$("#reading").val();
	if(reading){
		if(reading!=0&&reading!=1){
			bootbox.alert('<center><h4>一次表读数只能是0或1</h4></center>');
			$("#save_btn").addClass("disabled");
		}else{
			$("#save_btn").removeClass("disabled");
		}
	}else{
		bootbox.alert('<center><h4>请填写一次表表读数</h4></center>');
		$("#save_btn").addClass("disabled");
	}
})

$("#reading1").blur(function(){
	var _no = $("#meterNo1").val();
	if(!_no){
		bootbox.alert('<center><h4>填写修正表读数需先填写修正表编号</h4></center>');
		return;
	}
	var reading =$("#reading1").val();
	if(reading){
		if(reading!=0&&reading!=1){
			bootbox.alert('<center><h4>修正表读数只能是0或1</h4></center>');
			$("#save_btn").addClass("disabled");
		}else{
			$("#save_btn").removeClass("disabled");
		}
	}else{
		bootbox.alert('<center><h4>请填写修正表表读数</h4></center>');
		$("#save_btn").addClass("disabled");
	}
})
