var ctmArchive ;
var workBillId ;
var workBill ;
var ctmMeter ;
var mrdMeterReading;
var ctmHouse;
var downMeter;
var downReviseMeter;

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
var userinfo = JSON.parse(localStorage.getItem('user_info'));
var CustomerServe = function(){
	
	return {
        init: function () {
            this.reload();
        },
        reload: function () {
        	$("input").attr("readonly",true);
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
            ctmMeter=queryCtmMeter(ctmArchive.ctmArchiveId);
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
            		$("#vreviseReading").val(readingData.rows[0].reviseReading);
            	}
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
                        if(data[0].downMeterReading){
                        	$("#reviseReading").val(data[0].downMeterReviseReading);
                        }
                        
                        $.each(data[0], function(key,val) {
			            	$("form[name='resultForm'] input[name='"+key+"']").val(val);
			            	$("form[name='resultForm'] select[name='"+key+"']").val(val).trigger("change");
			            });
			            
			            if(data[0].repairResult){
			            	console.log(data[0].repairResult)
			            	var checks=$('input.fors');
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
			            if(data[0].checkMaintenanceContents){
			            	$("#checkMaintenanceContents").val(data[0].checkMaintenanceContents);
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
    var date = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
    var checkreading = $("#reading").val();
	var checkrevisereading = $("#reviseReading").val();
	var checkvreading = $("#vreading").val();
	var checkvrevisereading = $("#vreviseReading").val();
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
			if(!checkrevisereading){
				bootbox.alert("<center><h4>请填写修正表读数</h4></center>");
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
			quotiety=rxs/xs;
		}
		chargeMeterReading=xs;
	}
    
    //查询抄表本信息
	var book = queryMdrBook();
	var meterId =ctmMeter.meterId;
	var reviseMeterId = ctmMeter.reviseMeterId ;//修正表id
	//使用restful批量操作接口，保证同一事务控制
	var billType=workBill.billType;
	var copyType;
	//建立ctm_meter关系
	ctmMeter.modifiedTime=date;
	ctmMeter.modifiedBy=userinfo.userId;
	ctmArchive.modifiedTime= date;
	ctmArchive.modifiedBy=userinfo.userId;
	if(billType=="REMOVEM"||billType=="B_REMOVEM"){//拆除
		copyType="89";
		ctmMeter.meterUserState="03";
		ctmArchive.customerState="03"
	}
	if(billType=="WB_STOPG"||billType=="WB_STOPGCB"){//暂停用气
		copyType="88";
		ctmMeter.meterUserState="02";
		ctmArchive.customerState="02"
	}
	if(billType=="WB_REUSEG"){//重新用气
		copyType="81";
		ctmMeter.meterUserState="01";
		ctmArchive.customerState="01"
	}
	if(billType=="WB_CHANGEGT"){//用气性质变更
		copyType="55";
	}
	//查询上次抄表记录
	if(!mrdMeterReading){
		mrdMeterReading={
			"meterReading":0,
			"reviseReading":0,
			"meterReadingId":"",
			"copyTime":""
		}
	}
    var finishTime=new Date($("#finishTime").val()+"-00:00");
	var unboltJson2={
		"operate":"S",
		"lastMeterReadingId":mrdMeterReading.meterReadingId,
		"lastReadingDate":mrdMeterReading.copyTime,
		"lastMeterReading":mrdMeterReading.meterReading,
		"reviseReading":"",
		"chargeMeterReading":chargeMeterReading,
		"meterReading":checkreading,
		"meterId":meterId,
		"ctmArchiveId":ctmArchive.ctmArchiveId,
		"bookId":ctmArchive.bookId,
		"areaId":ctmArchive.areaId,
		"bookCode":book.bookCode,
		"customerKind":ctmArchive.customerKind,
		"customerType":ctmArchive.customerType,
		"copyType":copyType,
		"gasTypeId":ctmArchive.gasTypeId,
		"countperId":book.countperId,
		"serviceperId":book.serviceperId,
		"isMrd":"1",
		"isBll":"0",
		"dataSource":"1",
		"copyState":"4",
		"copyTime":finishTime,
		"chargingMeter":chargeFlag,
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
	
	if(reviseMeterId){
		unboltJson2.reviseMeterId==reviseMeterId;
		unboltJson2.reviseMeterReading=checkrevisereading;
		unboltJson2.lastReviseReading=mrdMeterReading.reviseReading;
	}
    //如果是一次表计费，有二次表，记录系数
	if(chargeFlag=="1"){
		if(ctmMeter.reviseMeterId){
			unboltJson2.quotiety=quotiety;
		}
	}
	
    workBill.completeDate=date;
    workBill.modifiedTime=date;
    workBill.modifiedBy=userinfo.user_id;
    workBill.billState="4";
    
    var submitJson = {"sets":[
        {"txid":"1","body":unboltJson2,"path":"/gasmrdmeterreading/","method":"POST"},
        {"txid":"2","body":ctmMeter,"path":"/gasctmmeter/","method":"PUT"},
        {"txid":"3","body":ctmArchive,"path":"/gasctmarchive/","method":"PUT"},
        {"txid":"4","body":workBill,"path":"/gascsrworkbill/","method":"PUT"}
    ]}
	if(billType=="WB_STOPGCB"||billType=="REMOVEM"||billType=="B_REMOVEM"){//暂停用气
		var xwQuery = RQLBuilder.and([
		    RQLBuilder.equal("ctmArchiveId",ctmArchive.ctmArchiveId),RQLBuilder.equal("iccardState","1")
		]).rql();
		var iccardRet = Restful.findNQ(hzq_rest+"gaschgiccard?query="+xwQuery);
		if(iccardRet&&iccardRet.length>0){
			var iccard = iccardRet[0];
			iccard.iccardState="4";
			submitJson.sets.push({"txid":"5","body":iccard,"path":"/gaschgiccard/","method":"PUT"});
		}
		if(downMeter.meterKind=="02"||downMeter.meterKind=="03"){
			var icgas = $("#surgas").val();
			var par1 = {
		      	"cols":"b.chg_account_id,b.gasfee_account_id,b.ic_balance",
		      	"froms":"gas_chg_account a,gas_act_gasfee_account b",
		      	"wheres":"a.chg_account_id=b.chg_account_id and a.ctm_archive_id='"+ctmArchive.ctmArchiveId+"'",
		      	"page":true,
		      	"limit":1
			}
			var account;
			var accountRet=Restful.insert("/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",par1);
			console.log(account)
			if(accountRet&&accountRet.rows&&accountRet.rows.length>0){
				account=accountRet.rows[0];
			}
			
			//卡内余量退回账户
			if(icgas>0){
				var par2 = {
					"customer_code":ctmArchive.customerCode,
					"measure":icgas
				}
				var money;
				var parRet = Restful.insert("/hzqs/bil/pbgtm.do?fh=GTMBIL0000000J00&resp=bd",par2);
				console.log(parRet)
				if(parRet.ret_code&&parRet.ret_code=="1"){
					money = parRet.money;
				}
				var par3 = {
					"gasfeeAccountId":account.gasfeeAccountId,
					"chgAccountId":account.chgAccountId,
					"customerCode":ctmArchive.customerCode,
					"tradeType":"BLL",
					"tradeTypeDesc":"REMOVEMBLL",
					"money":money,
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
				var atlId = $.md5(JSON.stringify(par3)+new Date().getTime());
				par3.gasfeeAtlId=atlId;
				submitJson.sets.push({"txid":"6","body":par3,"path":"/gasactgasfeeatl/","method":"POST"});
			}
			if(!account.icBalance){
				account.icBalance=0;
			}
			var par4 = {
				"customer_code":ctmArchive.customerCode,
				"measure":chargeMeterReading
			}
			var money;
			var parRet2 = Restful.insert("/hzqs/bil/pbgtm.do?fh=GTMBIL0000000J00&resp=bd",par4);
			console.log(parRet2)
			if(parRet2.ret_code&&parRet2.ret_code=="1"){
				money = parRet2.money;
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
			var atlId5 = $.md5(JSON.stringify(par5)+new Date().getTime());
			par5.gasfeeAtlId=atlId5;
			submitJson.sets.push({"txid":"7","body":par5,"path":"/gasactgasfeeatl/","method":"POST"});
			
		}
	}
	var regid=workBill.billTitle;
    var register=Restful.getByID(hzq_rest+'gascsrbusiregister',regid);
    
    if(register){
		register.finishDate = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");;
		register.modifiedTime = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");;
		register.modifiedBy=userinfo.userId;
		register.billState = "3";
		submitJson.sets.push({"txid":"10","body":register,"path":"/gascsrbusiregister/","method":"PUT"});
	}
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
    	var bll_date = new Date($("#finishTime").val()).Format('yyyy-MM-dd');
		var bllret=Restful.findNQ('/hzqs/bil/pbbll.do?fh=BLLBIL0000000J00&resp=bd&bd={"customer_code":"'+ctmArchive.customerCode+'","bll_date":"'+bll_date+'"}');
        console.log(bllret)
    	if(billType=="WB_CHANGEGT"){
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
        	if(workBill.billType=="B_REMOVEM"){
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
//var removeMeter=function(){
//	
//	//判断是否修正表计费
//	//燃气表
//	var reading;
//	var unboltJson1 = $("#meterForm").serializeObject();
//	//修正表
//	var unboltJson1_2 = $("#meterForm2").serializeObject();
//	if(ctmMeter.meterFlag&&ctmMeter.meterFlag=="2"){
//		reading=unboltJson1_2.reading;
//	}else{
//		reading=unboltJson1.reading;
//	}
//	var par = {
//		"customer_code":ctmArchive.customerCode,
//		"measure":reading
//	}
//	var money;
//	var parRet = Restful.insert("/hzqs/bil/pbgtm.do?fh=GTMBIL0000000J00&resp=bd",par);
//	console.log(parRet)
//	if(parRet.ret_code&&parRet.ret_code=="1"){
//		money = parRet.money;
//	}
//	var refundType="1";
//	if(unboltJson1.meterKind=="2"||unboltJson1.meterKind=="3"){
//		refundType="2";
//		var par2 = {
//		"customer_code":ctmArchive.customerCode,
//		"money":money
//		}
//		var par1Ret=Restful.insert("/hzqs/bil/pbmtg.do?fh=MTGBIL0000000J00&resp=bd",par2);
//		console.log(par1Ret)
//		if(par1Ret.ret_code&&par1Ret.ret_code=="1"){
//	  		money=spent_money;
//	  	}
//	}
//	var par3 = {
//    	"cols":"b.chg_account_id,b.gasfee_account_id",
//    	"froms":"gas_chg_account a,gas_act_gasfee_account b",
//    	"wheres":"a.chg_account_id=b.chg_account_id and a.ctm_archive_id='"+ctmArchive.ctmArchiveId+"'",
//    	"page":true,
//    	"limit":10
//  }
//	var ret3=Restful.insert("/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",par3);
//	console.log(ret3)
//	var par4 = {
//		"gasfeeAccountId":ret3.gasfeeAccountId,
//		"chgAccountId":ret3.chgAccountId,
//		"customerCode":ctmArchive.customerCode,
//		"tradeType":"RFD",
//		"money":money,
//		"clrTag":"1",
//		"createTime":new Date(),
//		"modifiedTime":new Date(),
//		"createdBy":userinfo.userId,
//		"modifiedBy":userinfo.userId
//	}
//	var atlId = $.md5(JSON.stringify(par4)+new Date().getTime());
//	par4.gasfeeAtlId=atlId;
//
//	Restful.insert(hzq_rest+"/gasactgasfeeatl/?retobj=2",par4);
//	
//	var par5 = {
//		"gasfeeAccountId":ret3.gasfeeAccountId,
//		"modifiedTime":new Date(),
//		"modifiedBy":userinfo.userId,
//		"icBalance":0
//	}
//	Restful.updateNQ(hzq_rest+"/gasactgasfeeaccount",JSON.stringify(par5));
//}



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
$("#reviseReading").blur(function(){
	var reading =$("#reviseReading").val();
	var vreading = $("#vreviseReading").val();
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