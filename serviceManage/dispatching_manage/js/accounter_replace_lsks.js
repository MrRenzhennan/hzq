var ctmArchive ;
var ctmMeter ;
var workBillId ;
var workBill;
var meterId;
var ctmHouse;
var downMeter;
var upMeter;
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
            console.log(workBillId)
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
            var gasTypeData=Restful.findNQ(hzq_rest+'gasbizgastype?query={"posCode":"1"}&sort=gasTypeId');
		    console.log(gasTypeData);
		    //用气性质select
		    for(var i=0; i<gasTypeData.length;i++){
		    	$('#gasTypeId').append('<option value="' + gasTypeData[i].gasTypeId + '">' + gasTypeData[i].gasTypeName + '</option>');
		    }
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
				$("#gasTypeId").val(archiveData[0].gasTypeId).trigger("change");
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
            
            $("#vreading").val("0");
            //查询ctm_house信息供抄表使用
            ctmHouse = Restful.getByID(hzq_rest+"gasctmhouse",ctmArchive.houseId);
			
			//清空下线表读数
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
	//检查是否已经表户
	var xwQuery = RQLBuilder.and([
        RQLBuilder.equal("ctmArchiveId",ctmArchive.ctmArchiveId),
        RQLBuilder.equal("meterUserState","01")
    ]).rql();
    var checkret = Restful.findNQ(hzq_rest+'gasctmmeter?query='+xwQuery)
    console.log(checkret);
    if(checkret.length>0){
    	
    	bootbox.alert('<center><h4>该用户已建立表户关系</h4></center>');
    	return;
    }
    
	if(ctmArchive.customerState!='00'){
    	bootbox.alert('<center><h4>该用户不是未开栓用户，请检查客户档案信息中客户状态</h4></center>');
		$("#save_btn").addClass("disabled");
		return;
    }
	var _checkmeterNo= $("#_meterNo").val();
	if(!_checkmeterNo){
		bootbox.alert("<br><center>请填写下线表编号</center></br>");
		return;
	}
	var checkmeterNo = $("#meterNo").val();
	if(!checkmeterNo){
		bootbox.alert("<br><center>请填写新燃气表编号</center></br>");
		return;
	}
	
	var checkreading = $("#reading").val();
	var _checkreading = $("#_reading").val();
	if(!checkreading){
		bootbox.alert("<center><h4>请填写新燃气表读数</h4></center>");
		return;
	}
	if(!_checkreading){
		bootbox.alert("<center><h4>请填写下线表读数</h4></center>");
		return;
	}
	
	var arriveTime = $("#arriveTime").val();
    var finishTime = $("#finishTime").val();
    if(!arriveTime){
		bootbox.alert("<br><center>请填写到户时间</center></br>");
		return;
	}else{
		arriveTime=new Date(arriveTime+"-00:00");
	}
    if(!finishTime){
		bootbox.alert("<br><center>请填写维修完成时间</center></br>");
		return;
	}else{
		finishTime=new Date(finishTime+"-00:00");
	}
	
	var chargeMeterReading=_checkreading;
	if(_checkreading==1){
		chargeMeterReading=0;
	}
	var gasTypeId =$("#gasTypeId").val();
	if(gasTypeId){
		ctmArchive.gasTypeId=gasTypeId;
	}else{
		bootbox.alert("<br><center>该用户没有用气性质，请选择用气性质</center></br>");
		return;
	}
	
	//建立ctm_meter关系
	ctmMeter={
		"modifiedTime":new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00"),
		"modifiedBy":userinfo.userId,
		"meterUserName":ctmArchive.customerName,
		"gasAlarmFlag":"N",
		"address":ctmArchive.customerAddress,
		"meterUserState":"01",
		"meterFlag":"1",
		"isOnline":"1",
		"meterId":upMeter.meterId,
		"ctmArchiveId":ctmArchive.ctmArchiveId,
		"createdTime":new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00"),
		"unboltTime":finishTime,
		"createdBy":userinfo.userId
	}
	var ctmMeterId = $.md5(JSON.stringify(ctmMeter)+new Date().getTime());
	ctmMeter.ctmMeterId = ctmMeterId;
	//更新旧表状态下线，记录表读数
	var oldMtrMeter={
		"meterId":downMeter.meterId,
		"stockState":"5",
		"reading":_checkreading,
		"modifiedTime":new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00"),
		"modifiedBy":userinfo.userId
	}
	//插入库存GAS_MTR_STOCK_HISTORY
	var oldMtrStockHistory={
		"meterId":downMeter.meterId,
		"createTime":new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00"),
		"stockState":"5",
		"changeDate":new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00"),
		"areaId":ctmArchive.areaId
	}
	
	var oldMtrStockHistoryId = $.md5(JSON.stringify(oldMtrStockHistory)+new Date().getTime());
	oldMtrStockHistory.stockHistoryId=oldMtrStockHistoryId;
	
	//更新新表状态上线
	var newMtrMeter={
		"meterId":upMeter.meterId,
		"stockState":"4",
		"modifiedTime":new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00"),
		"modifiedBy":userinfo.userId
	}
	//插入库存GAS_MTR_STOCK_HISTORY
	var newMtrStockHistory={
		"meterId":upMeter.meterId,
		"createTime":new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00"),
		"stockState":"4",
		"changeDate":new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00"),
		"areaId":ctmArchive.areaId
	}
	var newMtrStockHistoryId = $.md5(JSON.stringify(newMtrStockHistory)+new Date().getTime());
	newMtrStockHistory.stockHistoryId=newMtrStockHistoryId;
	//抄表信息录入(旧表)
	var book = queryMdrBook();
	var oldMeterReading={
		"operate":"S",
		"meterReading":_checkreading,
		"meterId":downMeter.meterId,
		"reviseReading":"",
		"ctmArchiveId":ctmArchive.ctmArchiveId,
		"bookId":ctmArchive.bookId,
		"areaId":ctmArchive.areaId,
		"copyType":"82",
		"gasTypeId":ctmArchive.gasTypeId?ctmArchive.gasTypeId:"",
		"countperId":book.countperId,
		"serviceperId":book.serviceperId,
		"isMrd":"1",
		"isBll":"0",
		"dataSource":"1",
		"copyState":"4",
		"chargingMeter":"1",
		"lastMeterReading":"0",
		"copyTime":finishTime,
		"borough":ctmHouse.borough,
		"street":ctmHouse.street,
		"district":ctmHouse.district,
		"doorPlateNum":ctmHouse.doorPlateNum,
		"florNum":ctmHouse.florNum,
		"cell":ctmHouse.cell,
		"address":ctmArchive.customerAddress
	}
	var readingId1 = $.md5(JSON.stringify(oldMeterReading)+new Date().getTime());
	oldMeterReading.meterReadingId="S"+"1"+readingId1;
	oldMeterReading.chargeMeterReading=chargeMeterReading;
	
	ctmArchive.modifiedTime=new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
	ctmArchive.unboltTime=new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
	ctmArchive.customerState="01";
	ctmArchive.modifiedTime=new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
	ctmArchive.modifiedBy=userinfo.userId;
	
	//抄表信息录入(新表)
	var t=finishTime;//你已知的时间
	var t_s=t.getTime();//转化为时间戳毫秒数
	var nt=finishTime;//定义一个新时间
	nt.setTime(t_s+1000*60);//设置新时间比旧时间多一分钟
	var newMeterReading={
		"operate":"S",
		"meterReading":checkreading,
		"meterId":upMeter.meterId,
		"ctmArchiveId":ctmArchive.ctmArchiveId,
		"bookId":ctmArchive.bookId,
		"areaId":ctmArchive.areaId,
		"copyType":"72",
		"gasTypeId":ctmArchive.gasTypeId,
		"countperId":book.countperId,
		"dataSource":"1",
		"copyState":"6",
		"chargingMeter":"1",
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
	if(upMeter.meterKind=="02"){//IC气量
		newMeterReading.remaingAsnum=0;
	}else if(upMeter.meterKind=="03"){//IC金额
		newMeterReading.cardBalancEsum=0;
	}
	
    //更改工单信息
    workBill.completeDate=new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
    workBill.modifiedTime=new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
    workBill.modifiedBy=userinfo.user_id;
    workBill.billState="4";
    
    
    
    var submitJson = {"sets":[
        {"txid":"1","body":newMeterReading,"path":"/gasmrdmeterreading/","method":"POST"},
        {"txid":"2","body":oldMeterReading,"path":"/gasmrdmeterreading/","method":"POST"},
        {"txid":"3","body":workBill,"path":"/gascsrworkbill/","method":"PUT"},
        {"txid":"4","body":oldMtrMeter,"path":"/gasmtrmeter/","method":"PUT"},
        {"txid":"5","body":newMtrMeter,"path":"/gasmtrmeter/","method":"PUT"},
        {"txid":"6","body":oldMtrStockHistory,"path":"/gasmtrstockhistory/","method":"POST"},
        {"txid":"7","body":newMtrStockHistory,"path":"/gasmtrstockhistory/","method":"POST"},
	    {"txid":"8","body":ctmMeter,"path":"/gasctmmeter/","method":"POST"},
	    {"txid":"9","body":ctmArchive,"path":"/gasctmarchive/","method":"PUT"}
	]}
    var regid=workBill.billTitle;
    var register=Restful.getByID(hzq_rest+'gascsrbusiregister',regid);
    
    if(register){
		register.finishDate = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");;
		register.modifiedTime = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");;
		register.modifiedBy=userinfo.userId;
		register.billState = "3";
		submitJson.sets.push({"txid":"10","body":register,"path":"/gascsrbusiregister/","method":"PUT"});
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
        	var retFlag = true;
            for(var i=0;i<data.results.length;i++){
	            if(!data.results[i].result.success){
	                retFlag=false;
	                break;
	            }
	        }
            if(retFlag){
            	if(upMeter.meterKind=="02"||upMeter.meterKind=="03"){
					ctmArchive.customerType="I"
				}else{
					ctmArchive.customerType="P"
				}
				//下线表抄表计费
				var bll_date = new Date($("#finishTime").val()).Format('yyyy-MM-dd');
				var bllret=Restful.findNQ('/hzqs/bil/pbbll.do?fh=BLLBIL0000000J00&resp=bd&bd={"customer_code":"'+ctmArchive.customerCode+'","bll_date":"'+bll_date+'"}');
		    	console.log(bllret)
		        Restful.updateNQ(hzq_rest+"/gasctmarchive",JSON.stringify(ctmArchive));	
		        bootbox.alert("<center><h4>提交成功</h4></center>",function(){
		            window.location.replace("/serviceManage/dispatching_manage/repair_order_perform.html");
		        });
            }else{
            	bootbox.alert("<center><h4>提交失败</h4></center>");
            }
        },
        error: function(err) {
            bootbox.alert("<center><h4>提交失败</h4></center>");
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
    	upMeter=data;
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
    	downMeter=data;
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

$("#bak_btn").click(function(){
	var param1 = {
		"workBillId":workBillId,
		"billState":"7",
		"modifiedTime":new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00"),
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
	workbillresult.modifiedTime=new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
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
    		window.location.replace("/serviceManage/dispatching_manage/repair_order_examine.html");
        });
    }else{
    	bootbox.alert('<center><h4>驳回失败，请联系系统管理员</h4></center>');
    }
})