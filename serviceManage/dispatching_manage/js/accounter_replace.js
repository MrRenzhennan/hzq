/**
 * Created by Administrator on 2017/6/30 0030.
 */

var ctmArchive ;
var workBillId ;
var workBill;
var meterId;
var meterKind;
var ctmMeter;
var date = new Date();
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
            });
            //初始化进气方向
            var directionEnum={"L":"左进","R":"右进"};
            $.map(directionEnum, function (key, val) {
                $('#direction').append('<option  value="' + val + '">' + key + '</option>');
                $('#direction2').append('<option  value="' + val + '">' + key + '</option>');
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
                        $('#meterModelId2').append('<option  value="' + data[o].meterModelId + '">' + data[o].meterModelName + '</option>');
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
                        $('#factoryId2').append('<option  value="' + data[o].factoryId + '">' + data[o].factoryName + '</option>');
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
                url: hzq_rest+'gasbizgastype',
                success: function (data) {
                    for(var o in data){
                        $('#gasTypeId').append('<option  value="' + data[o].gasTypeId + '">' + data[o].gasTypeName + '</option>');
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
                    console.log(workBill)
                    customerCode=data.customerCode;
                    $("#customerCode").val(data.customerCode);
                    $("#customerName").val(data.customerName);
                    $("#customerAddress").val(data.customerAddress);
                    $("#createdTime").val(data.createdTime);
                    $("#sendDate").val(data.sendDate);
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
                        $("#arriveTime").val(data[0].arriveTime);
                        $("#finishTime").val(data[0].finishTime);
                    }
                }
            })
            console.log(customerCode)
            $.ajax({
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                type: 'get',
                async: false,
                url: hzq_rest+'gasctmarchive?query={"customerCode":"'+customerCode+'"}',
                success: function (data) {
                    console.log(data)
                    if(data.length>0){
                        ctmArchive= data[0] ;

                        $("#idcard").val(data[0].idcard);
                        $("#tel").val(data[0].tel);
                    }
                }
            })
            ctmMeter=queryCtmMeter(ctmArchive.ctmArchiveId);
            //查询下线表信息
            var downMeter = Restful.getByID(hzq_rest+"gasmtrmeter",ctmMeter.meterId);
            console.log(downMeter)
            $.each(downMeter, function(key,val) {
                $("form[name='meterForm'] input[name='"+key+"']").val(val);
                $("form[name='meterForm'] select[name='"+key+"']").val(val).trigger("change");
            });

            if(!ctmMeter.reviseMeterId){
                console.log(ctmMeter.reviseMeterId)
                $(".secondary").hide();
                $("#tab22").hide()
            }


            var downMeter2 = Restful.getByID(hzq_rest+"gasmtrmeter",ctmMeter.reviseMeterId);
            console.log(downMeter)
            $.each(downMeter2, function(key,val) {
                $("form[name='meterForm2'] input[name='"+key+"']").val(val);
                $("form[name='meterForm2'] select[name='"+key+"']").val(val).trigger("change");
            });
        }
    }
}()

$("#save_btn").click(function(){

    var gasTypeId = $("#gasTypeId").val();
    var vbVbt = $("#vbVbt").val();
    var meterFlag = $("#meterFlag").val();
    var jsondata ;
    var jsondata2 ;
    if(vbVbt!=""&&vbVbt!="undefined"&&vbVbt!=undefined){
        ctmMeter.vbVbt=vbVbt;
    }
    if(gasTypeId!=""&&gasTypeId!="undefined"&&gasTypeId!=undefined){
        ctmArchive.gasTypeId = gasTypeId;
    }

    if(meterFlag!=""&&meterFlag!="undefined"&&meterFlag!=undefined){
        ctmMeter.meterFlag=meterFlag;
    }
    ctmMeter.modifiedTime=date;
    ctmMeter.modifiedBy=userinfo.userId;
    ctmArchive.modifiedTime=date;
    ctmArchive.modifiedBy=userinfo.userId;

    workBill.billState = "4";
    workBill.modifiedBy==userinfo.userId;
    workBill.modifiedTime=date;
    var submitJson = {"sets":[
        {"txid":"1","body":ctmMeter,"path":"/gasctmmeter/","method":"PUT"},
        {"txid":"2","body":ctmArchive,"path":"/gasctmarchive/","method":"PUT"},
        {"txid":"3","body":workBill,"path":"/gascsrworkbill/","method":"PUT"}
    ]}

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
            window.location.replace("/serviceManage/dispatching_Manage/repair_order_perform.html");
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




$("#meterNo").blur(function(){
    var results = Restful.findNQ(hzq_rest+'gasmtrmeter/?query={"meterNo":"'+$("#meterNo").val()+'"}');
    console.log(results);
    if(results&&results.length>0){
        var data = results[0];
        $.each(data, function(key,val) {
            $("input[name="+key+"]").val(val);
            $("select[name='"+key+"']").val(val).trigger("change");
        });
        meterId=data.meterId;
        meterKind=data.meterKind;
    }else{
        bootbox.alert('<div style="text-align:center"><h4>系统中无此表信息，请对该表具进行开栓补录</h4></div>');
    }
})
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