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
var workbillresult;
var date = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
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
var unique_id;
$("#save_btn").click(function(){
	$("#save_btn").addClass("disabled");
	if(unique_id){
		return;
	}else{
		unique_id=$.md5(new Date().getTime());
	}
	//需要根据换表信息判断新表抄表信息
	var finishTime=$("#finishTime").val();
	if(!finishTime){
		bootbox.alert("<br><center>该工单未填写完成时间，请驳回重新填写</center></br>");
		return;
	}else{
		finishTime=new Date(finishTime+"-00:00");
	}
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
		var checkrevisemeterNo = $("#reviseMeterNo").val();
		if(!checkrevisemeterNo){
			bootbox.alert("<br><center>更换二次表请填写新修正表编号</center></br>");
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
	var fullgas = $("#fullgas").val();
	var surgas = $("#surgas").val();
	if(downMeter.meterKind=="02"||downMeter.meterKind=="03"){
		if(!surgas){
			bootbox.alert("<br><center>下线表是IC表，请填写IC卡表剩余气量</center></br>");
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
	//如果是普表，需要判断是否过周
	if(chargeFlag=="2"){
		var rxs;//修正计费读数
		var xs;//一次表计费读数
		if(!checkrevisereading){
			bootbox.alert("<center><h4>请填写修正表读数</h4></center>");
			return;
		}
		if(!checkreading){
			bootbox.alert("<center><h4>请填写一次表读数</h4></center>");
			return;
		}
		//修正表读数小于微机表读数，提示是否过周
		
		if(!checkvrevisereading){
			rxs=parseInt(checkrevisereading);
		}else{
			if(parseInt(checkvrevisereading)>parseInt(checkrevisereading)){
				var readmax="";
				for(var j=0;j < parseInt(downReviseMeter.meterDigit);j++){
					rmax+="9";
				}
				rxs = parseInt(readmax)+1+ parseInt(checkrevisereading)-parseInt(checkvrevisereading);
			}else{
				rxs = parseInt(checkrevisereading)-parseInt(checkvrevisereading);
			}
		}
		chargeMeterReading=rxs;
	}else{
		var xs;
		
		if(!checkreading){
			bootbox.alert("<center><h4>请填写一次表读数</h4></center>");
			return;
		}
		//一次表读数小于微机表读数，提示是否过周
		if(parseInt(checkvreading)>parseInt(checkreading)){
        	var rmax="";
			for(var j=0;j < parseInt(downMeter.meterDigit);j++){
				rmax+="9";
			}
			xs =parseInt(rmax)+1+parseInt(checkreading)-parseInt(checkvreading);
		}else{
			xs = parseInt(checkreading)-parseInt(checkvreading);
		}
		//判断是否有修正表，且计费表使用一次表，需要系数
		if(ctmMeter.reviseMeterId){
			var rxs;//修正计费读数
			if(!checkrevisereading||checkrevisereading==""||checkrevisereading==undefined||checkrevisereading=="undefined"){
				bootbox.alert("<center><h4>请填写修正表读数</h4></center>");
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
					rxs = parseInt(readmax)+1+ parseInt(checkrevisereading)-parseInt(checkvrevisereading);
				}else{
					rxs = parseInt(checkrevisereading)-parseInt(checkvrevisereading);
				}
			}
			quotiety=rxs/xs;
		}
		chargeMeterReading=xs;
	}
	
    //使用restful批量操作接口，保证同一事务控制
	//建立ctm_meter关系
	var unboltJson4 = ctmMeter;
	unboltJson4.modifiedTime=new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");;
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
			"meterReading":0,
			"reviseReading":0,
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
		"bookCode":book.bookCode,
		"customerKind":ctmArchive.customerKind,
		"customerType":ctmArchive.customerType,
		"areaId":ctmArchive.areaId,
		"copyType":"82",
		"gasTypeId":ctmArchive.gasTypeId,
		"countperId":book.countperId,
		"serviceperId":book.serviceperId,
		"isMrd":"1",
		"isBll":"0",
		"dataSource":"1",
		"copyState":"4",
		"chargingMeter":chargeFlag,
		"lastMeterReading":mrdMeterReading.meterReading,
		"copyTime":new Date(finishTime),
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
		unboltJson3.reviseReading=oldMeter2.reading;
		unboltJson3.reviseMeterId=ctmMeter.reviseMeterId;
		unboltJson3.lastReviseReading=mrdMeterReading.reviseReading;
	}
	//如果是普表，需要判断是否过周
	if(ctmMeter.meterFlag=="2"){
		unboltJson3.chargeMeterReading=chargeMeterReading;
	}else{
		unboltJson3.chargeMeterReading=chargeMeterReading;
		if(ctmMeter.reviseMeterId){
			unboltJson3.quotiety=quotiety;
		}
	}
	
	var chargingMeter;
	if(changeMeter=="1"){//计费表不变
		chargingMeter="1";
		unboltJson4.meterId=meterId;
		if(meterKind=="02"||meterKind=="03"){
			unboltJson4.meterFlag=chargingMeter;
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
		unboltJson4.reviseMeterState='01';
	}else if(changeMeter=="3"){
		chargingMeter="2";
		if(!reviseMeterId){
			chargingMeter="1";
			unboltJson4.reviseMeterState='09';
		}else{
			unboltJson4.reviseMeterState='01';
			unboltJson4.reviseMeterId=reviseMeterId;
			ctmArchive.customerType="P"
		}
		
		unboltJson4.meterId=meterId;
		
		unboltJson4.meterFlag=chargingMeter;
	}
	ctmArchive.modifiedTime=date;
	ctmArchive.modifiedBy=userinfo.userId;
	//抄表信息录入(新表)
	 
	var t=finishTime;//你已知的时间
	var t_s=t.getTime();//转化为时间戳毫秒数
	var nt=finishTime;//定义一个新时间
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
		"bookCode":book.bookCode,
		"customerKind":ctmArchive.customerKind,
		"customerType":ctmArchive.customerType,
		"areaId":ctmArchive.areaId,
		"copyType":"72",
		"gasTypeId":ctmArchive.gasTypeId,
		"countperId":book.countperId,
		"dataSource":"1",
		"copyState":"6",
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
		newMeterReading.accumulatedGas=read;
	}else if(meterKind=="03"){//IC金额
		newMeterReading.cardBalancEsum=0;
		newMeterReading.accumulatedGas=read;
	}
	
    //更改工单信息
    var unboltJson6 = workBill;
    unboltJson6.modifiedTime=new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
    unboltJson6.modifiedBy=userinfo.user_id;
    unboltJson6.billState="4";
    
    var vbVbt = $("#vbVbt").val();
    var meterFlag = $("#meterFlag").val();
    if(vbVbt){
        unboltJson4.vbVbt=vbVbt;
    }

    if(meterFlag){
        unboltJson4.meterFlag=meterFlag;
    }

    var submitJson;
    
    if(changeMeter=="1"){
    	submitJson = {"sets":[
	        {"txid":"1","body":unboltJson4,"path":"/gasctmmeter/","method":"PUT"},
	        {"txid":"2","body":newMeterReading,"path":"/gasmrdmeterreading/","method":"POST"},
	        {"txid":"3","body":unboltJson3,"path":"/gasmrdmeterreading/","method":"POST"},
	        {"txid":"5","body":unboltJson6,"path":"/gascsrworkbill/","method":"PUT"},
	        {"txid":"6","body":oldMtrMeter,"path":"/gasmtrmeter/","method":"PUT"},
	        {"txid":"7","body":newMtrMeter,"path":"/gasmtrmeter/","method":"PUT"},
	        {"txid":"8","body":oldMtrStockHistory,"path":"/gasmtrstockhistory/","method":"POST"},
	        {"txid":"9","body":newMtrStockHistory,"path":"/gasmtrstockhistory/","method":"POST"}
    	]}
    }else if(changeMeter=="2"){
    	submitJson = {"sets":[
	        {"txid":"1","body":unboltJson4,"path":"/gasctmmeter/","method":"PUT"},
	        {"txid":"2","body":newMeterReading,"path":"/gasmrdmeterreading/","method":"POST"},
	        {"txid":"3","body":unboltJson3,"path":"/gasmrdmeterreading/","method":"POST"},
	        {"txid":"5","body":unboltJson6,"path":"/gascsrworkbill/","method":"PUT"},
	        {"txid":"6","body":oldReviseMtrMeter,"path":"/gasmtrmeter/","method":"PUT"},
	        {"txid":"7","body":newReviseMtrMeter,"path":"/gasmtrmeter/","method":"PUT"},
	        {"txid":"8","body":oldReviseMtrStockHistory,"path":"/gasmtrstockhistory/","method":"POST"},
	        {"txid":"9","body":newReviseMtrStockHistory,"path":"/gasmtrstockhistory/","method":"POST"}
    	]}
    }else{
    	submitJson = {"sets":[
	        {"txid":"1","body":unboltJson4,"path":"/gasctmmeter/","method":"PUT"},
	        {"txid":"2","body":newMeterReading,"path":"/gasmrdmeterreading/","method":"POST"},
	        {"txid":"3","body":unboltJson3,"path":"/gasmrdmeterreading/","method":"POST"},
	        {"txid":"5","body":unboltJson6,"path":"/gascsrworkbill/","method":"PUT"},
    		{"txid":"10","body":oldMtrMeter,"path":"/gasmtrmeter/","method":"PUT"},
	        {"txid":"11","body":newMtrMeter,"path":"/gasmtrmeter/","method":"PUT"},
	        {"txid":"12","body":oldMtrStockHistory,"path":"/gasmtrstockhistory/","method":"POST"},
	        {"txid":"13","body":newMtrStockHistory,"path":"/gasmtrstockhistory/","method":"POST"}
    	]}
    	if(oldReviseMtrMeter){
    		submitJson.sets.push({"txid":"6","body":oldReviseMtrMeter,"path":"/gasmtrmeter/","method":"PUT"});
			submitJson.sets.push({"txid":"8","body":oldReviseMtrStockHistory,"path":"/gasmtrstockhistory/","method":"POST"});
    	}
    	if(newReviseMtrMeter){
    		submitJson.sets.push({"txid":"7","body":newReviseMtrMeter,"path":"/gasmtrmeter/","method":"PUT"});
			submitJson.sets.push({"txid":"9","body":newReviseMtrStockHistory,"path":"/gasmtrstockhistory/","method":"POST"});
    	}
    }
    var account;
	if(downMeter.meterKind=="02"||downMeter.meterKind=="03"){
		var par3 = {
	      	"cols":"b.chg_account_id,b.gasfee_account_id,b.ic_balance",
	      	"froms":"gas_chg_account a,gas_act_gasfee_account b",
	      	"wheres":"a.chg_account_id=b.chg_account_id and a.ctm_archive_id='"+ctmArchive.ctmArchiveId+"'",
	      	"page":true,
	      	"limit":1
		}
		var accountRet=Restful.insert("/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",par3);
		console.log(accountRet)
		if(accountRet&&accountRet.rows&&accountRet.rows.length>0){
			account=accountRet.rows[0];
		}
		if(!account.icBalance){
			account.icBalance=0;
		}
//		var par2 = {
//			"customer_code":ctmArchive.customerCode,
//			"money":parseFloat(account.icBalance)
//		}
//		console.log(par2)
//		var par1Ret=Restful.insert("/hzqs/bil/pbmtg.do?fh=MTGBIL0000000J00&resp=bd",par2);
//		console.log(par1Ret)
//		var measure;
//		if(par1Ret.ret_code&&par1Ret.ret_code=="1"){
//	  		measure=par1Ret.measure;
//	  	}
//		unboltJson3.chargeMeterReading =parseInt(measure);
//		unboltJson3.lastMeterReading =parseInt(unboltJson3.meterReading)-parseInt(unboltJson3.chargeMeterReading);
		var money=0;
		if(unboltJson3.chargeMeterReading>0){
			var par = {
				"customer_code":ctmArchive.customerCode,
				"measure":unboltJson3.chargeMeterReading
			}
			var parRet = Restful.insert("/hzqs/bil/pbgtm.do?fh=GTMBIL0000000J00&resp=bd",par);
			console.log(parRet)
			if(parRet.ret_code&&parRet.ret_code=="1"){
				money = parRet.money;
			}
		}
		
		var xwQuery = RQLBuilder.and([
		    RQLBuilder.equal("ctmArchiveId",ctmArchive.ctmArchiveId),RQLBuilder.equal("iccardState","1")
		]).rql();
		var iccardRet = Restful.findNQ(hzq_rest+"gaschgiccard?query="+xwQuery);
		if(iccardRet&&iccardRet.length>0){
			var iccard = iccardRet[0];
			iccard.iccardState="4";
			submitJson.sets.push({"txid":"14","body":iccard,"path":"/gaschgiccard/","method":"PUT"});
		}
		
		var par5 = {
			"gasfeeAccountId":account.gasfeeAccountId,
			"chgAccountId":account.chgAccountId,
			"customerCode":ctmArchive.customerCode,
			"tradeType":"ICB",
			"tradeTypeDesc":"ICBCLEAR",
			"money":-(parseFloat(account.icBalance)-parseFloat(money)),
			"clrTag":"0",
			"createdTime":new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00"),
			"modifiedTime":new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00"),
			"tradeDate":new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00"),
			"createdBy":userinfo.userId,
			"modifiedBy":userinfo.userId,
			"areaId":ctmArchive.areaId,
			"customerKind":ctmArchive.customerKind,
			"gasTypeId":ctmArchive.gasTypeId,
			"customerType":ctmArchive.customerType
		}
		if(meterKind!="02"&&meterKind!="03"){
			submitJson.sets.push({"txid":"18","body":par5,"path":"/gasactgasfeeatl/","method":"POST"});
		}
		
		var regid=workBill.billTitle;
	    var register=Restful.getByID(hzq_rest+'gascsrbusiregister',regid);
	    
	    if(register){
			register.finishDate = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");;
			register.modifiedTime = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");;
			register.modifiedBy=userinfo.userId;
			register.billState = "3";
			submitJson.sets.push({"txid":"19","body":register,"path":"/gascsrbusiregister/","method":"PUT"});
		}
		
//		var par4;
//		if(surgas){
//			var par = {
//				"customer_code":ctmArchive.customerCode,
//				"measure":surgas
//			}
//			var money;
//			var parRet = Restful.insert("/hzqs/bil/pbgtm.do?fh=GTMBIL0000000J00&resp=bd",par);
//			console.log(parRet)
//			if(parRet.ret_code&&parRet.ret_code=="1"){
//				money = parRet.money;
//			}
//			par4 = {
//				"gasfeeAccountId":account.gasfeeAccountId,
//				"chgAccountId":account.chgAccountId,
//				"customerCode":ctmArchive.customerCode,
//				"tradeType":"BLL",
//				"tradeTypeDesc":"CHANGEMBLL",
//				"money":money,
//				"clrTag":"0",
//				"createTime":new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00"),
//				"modifiedTime":new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00"),
//				"createdBy":userinfo.userId,
//				"modifiedBy":userinfo.userId
//			}
//			var atlId = $.md5(JSON.stringify(par4)+new Date().getTime());
//			par4.gasfeeAtlId=atlId;
//			submitJson.sets.push({"txid":"15","body":par4,"path":"/gasactgasfeeatl/","method":"POST"});
//			var par6 = {
//				"gasfeeAccountId":account.gasfeeAccountId,
//				"chgAccountId":account.chgAccountId,
//				"customerCode":ctmArchive.customerCode,
//				"tradeType":"RFD",
//				"money":money,
//				"clrTag":"2",
//				"createTime":new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00"),
//				"modifiedTime":new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00"),
//				"createdBy":userinfo.userId,
//				"modifiedBy":userinfo.userId
//			}
//			var atlId6 = $.md5(JSON.stringify(par6)+new Date().getTime());
//			par6.gasfeeAtlId=atlId6;
//			submitJson.sets.push({"txid":"16","body":par6,"path":"/gasactgasfeeatl/","method":"POST"});
//		
//		}
	}
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
		var bll_date = new Date($("#finishTime").val()).Format('yyyy-MM-dd');
		var bllret=Restful.findNQ('/hzqs/bil/pbbll.do?fh=BLLBIL0000000J00&resp=bd&bd={"customer_code":"'+ctmArchive.customerCode+'","bll_date":"'+bll_date+'"}');
    	console.log(bllret);
//  	if(downMeter.meterKind=="02"||downMeter.meterKind=="03"){
//  		var submitJson2 = {"sets":[]};
//			
//			var par5 = {
//				"gasfeeAccountId":account.gasfeeAccountId,
//				"modifiedTime":new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00"),
//				"modifiedBy":userinfo.userId,
//				"icBalance":0
//			}
//			
//			submitJson2.sets.push({"txid":"4","body":par5,"path":"/gasactgasfeeaccount/","method":"PUT"});
//			var result = Restful.insert("/hzqs/dbc/pbtxs.do?fh=SELDBC0000000J00&resp=bd",submitJson2);
//
//  	}
    	var archiveRet=Restful.updateNQ(hzq_rest+"/gasctmarchive",JSON.stringify(ctmArchive));
        //用气性质变更换表需要处理业务
        if(workBill.billType=="WB_CHANGEGTM"){
        	var regid=workBill.billTitle;
        	var register=Restful.getByID(hzq_rest+'gascsrbusiregister',regid);
        	var newgt;
        	if(register){
        		var params = register.reservedField1;
        		var param=JSON.parse(params);
        		newgt=param.newGT;
        	}
        	var parameter = {
		        "customcode":""+ctmArchive.customerCode+"",
		        "newgt":""+newgt+"",
		        "busiflag":"1"
		    }
		    console.log(JSON.stringify(parameter));
		    $.ajax({
		        headers: {
		            'Accept': 'application/json',
		            'Content-Type': 'application/json'
		        },
		        url: '/hzqs/ser/pbcgt.do?fh=VFLSCGC000000J00&resp=bd',
		        type:"POST",
		        datatype:"json",
		        data:JSON.stringify(parameter),
		        success:function(e){
		        }
		    })
        }
        
        bootbox.alert("提交成功",function(){
        	if(workBill.billType=="B_CHANGEM"){
        		window.location.replace("/serviceManage/dispatching_manage/batch_repair_order_examine.html");
        	}else{
        		window.location.replace("/serviceManage/dispatching_manage/repair_order_examine.html");
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
var queryMrdMeterReading = function(ctmArchiveId){
	var a;
	var paramurl = "/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd";
	var params = {
      	"cols":"*",
      	"froms":"(select meter_reading,revise_reading, row_number() over (partition by ctm_archive_id order by plan_copy_time desc )as rn1 , meter_reading_id, copy_time from gas_mrd_meter_reading where is_mrd='1' and is_bill='1' and ctm_archive_id ='"+ctmArchiveId+"' and copy_state ='6')",
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

$("#bak_btn").click(function(){
	var param1 = {
		"workBillId":workBillId,
		"billState":"7",
		"modifiedTime":date,
		"modifiedBy":userinfo.userId
	}
	console.log(param1)
	var backReason = $("#backReason").val();
	if(!backReason){
		bootbox.alert('<center><h4>请填写驳回原因</h4></center>');
		return;
	}
	console.log(workbillresult)
	workbillresult.backReason=backReason;
	workbillresult.modifiedTime=date;
	workbillresult.modifiedBy=userinfo.userId;
	var submitJson = {"sets":[
        {"txid":"1","body":param1,"path":"/gascsrworkbill/","method":"PUT"},
        {"txid":"2","body":workbillresult,"path":"/gascsrworkbillresult/","method":"PUT"}
	]}
	var result = Restful.insert("/hzqs/dbc/pbtxs.do?fh=SELDBC0000000J00&resp=bd",submitJson);
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
    	bootbox.alert("驳回成功",function(){
    		if(workBill.billType=="B_CHANGEM"){
        		window.location.replace("/serviceManage/dispatching_manage/batch_repair_order_examine.html");
        	}else{
        		window.location.replace("/serviceManage/dispatching_manage/repair_order_examine.html");
        	}
        });
    }else{
    	bootbox.alert('<center><h4>驳回失败，请联系系统管理员</h4></center>');
    }
})
