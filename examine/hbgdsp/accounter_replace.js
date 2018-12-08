var ctmArchive ;
var ctmMeter ;
//var workBillId ;
var workBill;
var mrdMeterReading;
var meterId;
var reviseMeterId="";
var meterKind;
var ctmHouse;
var downMeter;
var downReviseMeter;
var workbillresult;
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
					$("#customerCode2").val(data.customerCode);
					$("#customerName2").val(data.customerName);
					$("#customerAddress2").val(data.customerAddress);
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
			var froms = "(select ctm_archive_id,meter_reading,revise_reading,meter_reading_id,copy_time,row_number() over (partition by ctm_archive_id order by copy_time desc )as rn1 from gas_mrd_meter_reading where ctm_archive_id='" + ctmArchive.ctmArchiveId + "'and is_mrd='1' and is_bll='1' and copy_state ='6') d";
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
            	if(ctmMeter.reviseMeterId){
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
			
			//清空下线表读数
			$("#reading").val("");
			$("#revisereading").val("");
			//初始化结果表单
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
			            	console.log(data[0].repairResult)
			            	var checks=$('input.fors2');
							for(var i=0;i<checks.length;i++){
								checks[i].index=i;
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
			            console.log(data[0].files)
			            if(data[0].files){
			            	pic(data[0].files)
			            }
                    }
                }
            })
			
        }
    }
}()
			


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

$("#meterNo").blur(function(){
	var _no = $("#meterNo").val();
	console.log(_no)
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
    }else{
    	bootbox.alert('<center><h4>系统中无此新一次表信息，请对该表具进行开栓补录</h4></center>');
    }
})

$("#reviseMeterNo").blur(function(){
	var _no = $("#reviseMeterNo").val();
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
    }else{
    	bootbox.alert('<div style="text-align:center"><h4>系统中无此新修正表信息，请对该表具进行开栓补录</h4></div>');
    }
})
