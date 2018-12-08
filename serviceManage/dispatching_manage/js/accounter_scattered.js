var ctmArchive ;
var workBillId ;
var workBill;
var meterId;
var meterKind;
var workbillresult;
var userinfo = JSON.parse(localStorage.getItem('user_info'));
var dates = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
$("input[type='text']").attr("readonly","readonly");
$("select").attr("disabled","disabled");
$("input[type='checkbox']").attr("disabled","disabled");
$("#gasTypeId").removeAttr("disabled");
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
            });
            //初始化进气方向
            var directionEnum={"L":"左进","R":"右进"};
            $.map(directionEnum, function (key, val) {
                $('#direction').append('<option  value="' + val + '">' + key + '</option>');
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
                    $("#bookingTime").val(data.bookingTime);
                }
            })
			
//			var gasTypeQuery = RQLBuilder.and([
////              RQLBuilder.equal("customerCode",customerCode)
//				RQLBuilder.like("customerName", $('#find_customername').val())
//          ]).rql();
			var gasTypeData=Restful.findNQ(hzq_rest+'gasbizgastype?query={"posCode":"1"}&sort=gasTypeId');
		    console.log(gasTypeData);
		    //用气性质select
		    for(var i=0; i<gasTypeData.length;i++){
		    	$('#gasTypeId').append('<option value="' + gasTypeData[i].gasTypeId + '">' + gasTypeData[i].gasTypeName + '</option>');
		    }
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
                        console.log(data)
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
                        $("#gasTypeId").val(ctmArchive.gasTypeId).trigger("change");
                        $("#tel").val(data[0].tel);
                    }
                }
            })
            
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
                        $("#arriveTime").val(data[0].arriveTime);
                        $("#finishTime").val(data[0].finishTime);
                        $("#noUnboltReason").val(data[0].noUnboltReason).trigger("change");
                        $("#sendPerson").val(data[0].sendPerson).trigger("change");
                        $("#changeMeter").val(data[0].changeMeter).trigger("change");
                        $("#hiddenDangerPosition").val(data[0].hiddenDangerPosition);
                        // $("#unauthorizedOpeningReading").val(data[0].unauthorizedOpeningReading);
                        // $("#unauthorizedOpeningReading").attr("readonly","readonly");
                        $("#reading").val(data[0].upMeterReading);
                        // if(data[0].downMeterReading){
                        //     $("#reading").val(data[0].downMeterReading);
                        // }
                        // if(data[0].downMeterReading){
                        //     $("#revisereading").val(data[0].downMeterReviseReading);
                        // }

                        $.each(data[0], function(key,val) {
                            $("form[name='resultForm'] input[name='"+key+"']").val(val);
                            $("form[name='resultForm'] select[name='"+key+"']").val(val).trigger("change");
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
                        
                        if(data[0].files){
                            pic(data[0].files)
                        }
                    }
                }
            })
        }
    }
}()
function seltwo(that){
    var vs = $(that).val();
    console.log(vs)
    $('#dt').html('')
    if(vs=="5"){
        $('#dt').append('<div class="input-group-addon">私开表读数：</div><input id="unauthorizedOpeningReading" name="unauthorizedOpeningReading" class="inputclear form-control" type="text" value="">');
    }else if(vs=="6"){
        $('#dt').append('<div class="input-group-addon">存在安全隐患：</div><input id="hiddenDanger" name="hiddenDanger" class="inputclear form-control" type="text" value="">');
    }else{
        $('#dt').html('')
    }
}

//新燃气表信息
$("#meterNo").blur(function(){
    var results = Restful.findNQ(hzq_rest+'gasmtrmeter/?query={"meterNo":"'+$("#meterNo").val()+'"}');
    console.log(results);
    if(results&&results.length>0){
        var data = results[0];
         delete data.reading;
        $.each(data, function(key,val) {
            $("input[name="+key+"]").val(val);
            $("select[name='"+key+"']").val(val).trigger("change");
        });
        meterId=data.meterId;
        meterKind=data.meterKind;
    }else{
        bootbox.alert('<center><h4>系统中无此表信息，请对该表具进行开栓补录</h4></center>');
    }
})

//打压  and  灶前压力
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

//保存
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
	if(workBill.billType=='WB_REUSEGZB'){
		//检查是否已经表户
		var xwQuery2 = RQLBuilder.and([
	        RQLBuilder.equal("ctmArchiveId",ctmArchive.ctmArchiveId),
	        RQLBuilder.equal("meterUserState","02")
	    ]).rql();
	    var checkret = Restful.findNQ(hzq_rest+'gasctmmeter?query='+xwQuery2)
	    if(checkret.length>0){
	    	var ctmParam=checkret[0];
	    	ctmParam.meterUserState="99";
	    	var rr=Restful.updateNQ(hzq_rest+'gasctmmeter',JSON.stringify(ctmParam))
	    }
	    
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
	var gasTypeId =$("#gasTypeId").val();
	if(gasTypeId){
		ctmArchive.gasTypeId=gasTypeId;
	}else{
		bootbox.alert("<br><center>该用户没有用气性质，请选择用气性质</center></br>");
		return;
	}
    //使用restful批量操作接口，保证同一事务控制
    //表具信息录入
    var date = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");


    if(!meterId||meterId==""||meterId=="undefined"){
        bootbox.alert('<div style="text-align:center"><h4>请填写正确的表具编号</h4></div>');
        return false;
    }
    var read = $("#reading").val();
    console.log(read)
    //更新表具状态为上线
    var mtrMeter = {
        "meterId":meterId,
        "reading":read,
        "stockState":"4"
    }
    //插入库存GAS_MTR_STOCK_HISTORY
    var mtrStockHistory={
        "meterId":meterId,
        "createTime":date,
        "stockStatus":"4",
        "changeDate":date,
        "areaId":ctmArchive.areaId
    }
    var mtrStockHistoryId = $.md5(JSON.stringify(mtrStockHistory)+new Date().getTime());
    mtrStockHistory.stockHistoryId=mtrStockHistoryId;
    //抄表信息录入

    var book = queryMdrBook();
    var mrdMeterReading={
        "operate":"S",
        "meterReading":read,
        "meterId":meterId,
        "chargingMeter":"1",
        "isMrd":"1",
        "isBll":"1",
        "dataSource":"1",
        "copyState":"6",
        "chargeMeterReading":0,
        "ctmArchiveId":ctmArchive.ctmArchiveId,
        "bookId":ctmArchive.bookId,
        "customerKind":ctmArchive.customerKind,
        "areaId":ctmArchive.areaId,
        "copyType":"70",
        "gasTypeId":ctmArchive.gasTypeId,
        "countperId":book.countperId,
        "serviceperId":book.serviceperId,
        "copyTime":finishTime
    }
    var meterReadingId= $.md5(JSON.stringify(mrdMeterReading)+new Date().getTime())
    mrdMeterReading.meterReadingId=meterReadingId;
    ctmArchive.customerType="P";
    if(meterKind=="02"){
        mrdMeterReading.remaingAsnum=0;
        ctmArchive.customerType="I";
    }else if(meterKind=="03"){
        mrdMeterReading.cardBalancEsum=0;
        ctmArchive.customerType="I";
    }
    mrdMeterReading.customerType=ctmArchive.customerType;
    ctmArchive.unboltTime=date;
    ctmArchive.modifiedTime=date;
    ctmArchive.modifiedBy=userinfo.userId;
    //建立ctm_meter关系
    var ctmMeter = {
        "ctmArchiveId":ctmArchive.ctmArchiveId,
        "meterId":meterId,
        "meterUserName":ctmArchive.customerName,
        "meterUserState":"01",
        "gasAlarmFlag":"N",
        "address":ctmArchive.customerAddress,
        "isOnline":"1",
        "meterFlag":"1",
        "unboltTime":finishTime,
        "createdTime":date,
        "modifiedTime":date
    };
    var ctmMeterId = $.md5(JSON.stringify(ctmMeter)+new Date().getTime());
    ctmMeter.ctmMeterId=ctmMeterId;

    //更新档案表客户状态为01
    ctmArchive.customerState="01";

    //更新工单状态
    workBill.completeDate=date;
    workBill.modifiedTime=date;
    workBill.modifiedBy=userinfo.user_id;
    workBill.billState="4";

    var alarm = $("#alarm").val();
    var alarmType = $("#alarmType").val();

    var profitlossapply={
        "ctmArchiveId":ctmArchive.ctmArchiveId,
        "alarm":alarm,
        "alarmType":alarmType
    }
    var meterArchiveId = $.md5(JSON.stringify(profitlossapply)+new Date().getTime())
    profitlossapply.meterArchiveId = meterArchiveId;

    var submitJson = {"sets":[
        {"txid":"1","body":mrdMeterReading,"path":"/gasmrdmeterreading/","method":"POST"},
        {"txid":"2","body":ctmMeter,"path":"/gasctmmeter/","method":"POST"},
        {"txid":"3","body":ctmArchive,"path":"/gasctmarchive/","method":"PUT"},
        {"txid":"5","body":workBill,"path":"/gascsrworkbill/","method":"PUT"},
        {"txid":"6","body":mtrMeter,"path":"/gasmtrmeter/","method":"PUT"},
        {"txid":"7","body":mtrStockHistory,"path":"/gasmtrstockhistory/","method":"POST"}
    ]}

    var brand1 = $("#brand1").val();
    var model1 = $("#model1").val();
    var count1 = $("#count1").val();
    if(brand1||model1||count1){
        var nonrsdtdevicedetail={
            "nonrsdtArchiveId":meterArchiveId,
            "name":"燃气热水器",
            "brand":brand1,
            "model":model1,
            "count":count1
        }
        var nonrsdtdevicedetailid = $.md5(JSON.stringify(nonrsdtdevicedetail)+new Date().getTime())
        nonrsdtdevicedetail.nonrsdtArchiveDetailId = nonrsdtdevicedetailid;
        submitJson.sets.push({"txid":"8","body":nonrsdtdevicedetail,"path":"/gasctmnonrsdtdevicedetail/","method":"POST"});
    }
    var brand2 = $("#brand2").val();
    var model2 = $("#model2").val();
    var count2 = $("#count2").val();
    if(brand2||model2||count2){
        var nonrsdtdevicedetail2={
            "nonrsdtArchiveId":meterArchiveId,
            "name":"燃气热水器",
            "brand":brand2,
            "model":model2,
            "count":count2
        }
        var nonrsdtdevicedetailid2 = $.md5(JSON.stringify(nonrsdtdevicedetail2)+new Date().getTime())
        nonrsdtdevicedetail2.nonrsdtArchiveDetailId = nonrsdtdevicedetailid2;
        submitJson.sets.push({"txid":"9","body":nonrsdtdevicedetail2,"path":"/gasctmnonrsdtdevicedetail/","method":"POST"});
    }

    var brand3 = $("#brand3").val();
    var model3 = $("#model3").val();
    var count3 = $("#count3").val();
    if(brand3||model3||count3){
        var nonrsdtdevicedetail3={
            "nonrsdtArchiveId":meterArchiveId,
            "name":"燃气热水器",
            "brand":brand3,
            "model":model3,
            "count":count3
        }
        var nonrsdtdevicedetailid3 = $.md5(JSON.stringify(nonrsdtdevicedetail3)+new Date().getTime())
        nonrsdtdevicedetail3.nonrsdtArchiveDetailId = nonrsdtdevicedetailid3;
        submitJson.sets.push({"txid":"10","body":nonrsdtdevicedetail3,"path":"/gasctmnonrsdtdevicedetail/","method":"POST"});
    }
    var brand4 = $("#brand4").val();
    var model4 = $("#model4").val();
    var count4 = $("#count4").val();
    if(brand4||model4||count4){
        var nonrsdtdevicedetail4={
            "nonrsdtArchiveId":meterArchiveId,
            "name":"燃气热水器",
            "brand":brand4,
            "model":model4,
            "count":count4
        }
        var nonrsdtdevicedetailid4 = $.md5(JSON.stringify(nonrsdtdevicedetail4)+new Date().getTime())
        nonrsdtdevicedetail4.nonrsdtArchiveDetailId = nonrsdtdevicedetailid4;
        submitJson.sets.push({"txid":"11","body":nonrsdtdevicedetail4,"path":"/gasctmnonrsdtdevicedetail/","method":"POST"});
    }

	var regid=workBill.billTitle;
    var register=Restful.getByID(hzq_rest+'gascsrbusiregister',regid);
    
    if(register){
		register.finishDate = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");;
		register.modifiedTime = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");;
		register.billState = "3";
		register.modifiedBy = userinfo.userId;
		submitJson.sets.push({"txid":"12","body":register,"path":"/gascsrbusiregister/","method":"PUT"});
	}
    var result = Restful.insert("/hzqs/dbc/pbtxs.do?fh=SELDBC0000000J00&resp=bd",submitJson)

    console.log("submit:result:"+JSON.stringify(result));
    console.log(result);


    var retFlag=true;
    // console.log(result.success)
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
            if(workBill.billType=="B_LSKS"){
                window.location.replace("/serviceManage/dispatching_manage/batch_repair_order_examine.html");
            }else if(workBill.billType=="WB_LSKS"){
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


$("#bak_btn").click(function(){
    var param1 = {
        "workBillId":workBillId,
        "billState":"7",
        "modifiedTime":dates,
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
    workbillresult.modifiedTime=dates;
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
            if(workBill.billType=="B_LSKS"){
                window.location.replace("/serviceManage/dispatching_manage/batch_repair_order_examine.html");
            }else if(workBill.billType=="WB_LSKS"){
                window.location.replace("/serviceManage/dispatching_manage/repair_order_examine.html");
            }
        });
    }else{
        bootbox.alert('<center><h4>驳回失败，请联系系统管理员</h4></center>');
    }
})