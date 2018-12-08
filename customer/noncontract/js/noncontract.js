
$("#chosedate button").on('click',function(){
    $(this).addClass("blue")
    $(this).parent('div').siblings().find("button").removeClass('blue');
})

function date_format(date, fmt) {
    var dataJson = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in dataJson)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (dataJson[k]) : (("00" + dataJson[k]).substr(("" + dataJson[k]).length)));
    return fmt;
}
console.log(date_format(new Date(),"yyyy-MM-dd hh:mm:ss"))
console.log(new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00"))
console.log(moment(date_format(new Date(),"yyyy-MM-dd hh:mm:ss")).toDate())
//当日
$("#find_today_sign").click(function(){
    $("#find_start_date").val(date_format(new Date(),"yyyy-MM-dd"));
    $("#find_end_date").val(date_format(new Date(),"yyyy-MM-dd"));
});
//近一周
$("#find_this_week_sign").click(function(){
    var date = new Date();
    $("#find_end_date").val(date_format(date,"yyyy-MM-dd"));
    date.setDate(date.getDate()-6);
    $("#find_start_date").val(date_format(date,"yyyy-MM-dd"));
});
// 近一月
$("#find_this_month_sign").click(function(){
    var date = new Date();
    $("#find_end_date").val(date_format(date,"yyyy-MM-dd"));
    date.setMonth(date.getMonth()-1);
    date.setDate(date.getDate()+1);
    $("#find_start_date").val(date_format(date,"yyyy-MM-dd"));
});
// 近三月
$("#find_three_month_sign").click(function(){
    var date = new Date();
    $("#find_end_date").val(date_format(date,"yyyy-MM-dd"));
    date.setMonth(date.getMonth()-3);
    date.setDate(date.getDate()+1);
    $("#find_start_date").val(date_format(date,"yyyy-MM-dd"));
});
// 近一年
$("#find_this_year_sign").click(function(){
    var date = new Date();
    $("#find_end_date").val(date_format(date,"yyyy-MM-dd"));
    date.setMonth(date.getMonth()-12);
    date.setDate(date.getDate()+1);
    $("#find_start_date").val(date_format(date,"yyyy-MM-dd"));

});
// 不限
$("#find_anyway_sign").click(function(){
    $("#find_start_date").val("");
    $("#find_end_date").val("");
});
$("#chosedate1 button").on('click',function(){
    $(this).addClass("blue")
    $(this).parent('div').siblings().find("button").removeClass('blue');
})

function date_format(date, fmt) {
    var dataJson = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in dataJson)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (dataJson[k]) : (("00" + dataJson[k]).substr(("" + dataJson[k]).length)));
    return fmt;
}
//当日
$("#find_today_endTime").click(function(){
    $("#find_endTime").val(date_format(new Date(),"yyyy-MM-dd"));
    $("#find_endTime1").val(date_format(new Date(),"yyyy-MM-dd"));
});
//近一周
$("#find_this_week_endTime").click(function(){
    var date = new Date();
    $("#find_endTime1").val(date_format(date,"yyyy-MM-dd"));
    date.setDate(date.getDate()-6);
    $("#find_endTime").val(date_format(date,"yyyy-MM-dd"));
});
// 近一月
$("#find_this_month_endTime").click(function(){
    var date = new Date();
    $("#find_endTime1").val(date_format(date,"yyyy-MM-dd"));
    date.setMonth(date.getMonth()-1);
    date.setDate(date.getDate()+1);
    $("#find_endTime").val(date_format(date,"yyyy-MM-dd"));
});
// 近三月
$("#find_three_month_endTime").click(function(){
    var date = new Date();
    $("#find_endTime1").val(date_format(date,"yyyy-MM-dd"));
    date.setMonth(date.getMonth()-3);
    date.setDate(date.getDate()+1);
    $("#find_endTime").val(date_format(date,"yyyy-MM-dd"));
});
// 近一年
$("#find_this_year_endTime").click(function(){
    var date = new Date();
    $("#find_endTime1").val(date_format(date,"yyyy-MM-dd"));
    date.setMonth(date.getMonth()-12);
    date.setDate(date.getDate()+1);
    $("#find_endTime").val(date_format(date,"yyyy-MM-dd"));

});
// 不限
$("#find_anyway_endTime").click(function(){
    $("#find_endTime").val("");
    $("#find_endTime1").val("");
});

var contractStatus = {"0": "预签", "1": "新签", "2": "正常", "3": "即将到期", "4": "到期", "5": "过期","6":"续签","7":"作废"};
// var contractStatus = {"0": "预签", "1": "新签", "2": "正常", "3": "即将到期", "4": "到期", "5": "过期","6":"续签","7":"作废","9":"未通过"};
$.each(contractStatus,function(key,val){
    $("#find_contractState").append("<option value='"+key+"'>"+val+"</option>")
})

$("#contractNo").on("blur",function(){
    console.log($(this).val())
    var resultq = Restful.findNQ( hzq_rest +'gasctmcontract/?query={"contractNo":"'+$(this).val()+'"}');
    console.log(resultq);
    if(resultq.length>0){
        bootbox.alert("<center><h4>该合同编号已经存在，请更换合同编号。</h4></center>");
        $("#addsubmit").attr("disabled","disabled")
    }else{
        $("#addsubmit").attr("disabled",false)
    }
})

$("#contracrtCustomer").hide();
$("#contractType").on("change",function(){
    console.log($(this).val())
    if($(this).val() == "1"){
        $("#contracrtCustomer").hide();
    }else if($(this).val() == "8"){
        $("#contracrtCustomer").show();
    }
})
$("#customerCode").on("blur",function(){
    console.log($(this).val())
    var resultq = Restful.findNQ( hzq_rest +'gasctmarchive/?query={"customerCode":"'+$(this).val()+'"}');
    console.log(resultq);
    if(!resultq.length){
        bootbox.alert("<center><h4>该客户不存在，请更换合同编号。</h4></center>");
        $("#addsubmit").attr("disabled","disabled")
    }else{
        $("#addsubmit").attr("disabled",false)
    }
})

var loginarea = [];
var areaId = JSON.parse(localStorage.getItem("user_info")).area_id

GasModSys.areaList({
    "areaId":areaId,
    "cb":function(data){
        console.log(data)
        $.each(data,function(key,val){
            loginarea.push(val.areaId);
            $('#find_areaId').append('<option value="' + val.areaId + '">' + val.areaName + '</option>');
        })
    }
});


var nonContractAction = function () {
    //供气区域
    var AreaHelper = RefHelper.create({
        ref_url:"gasbizarea",
        ref_col:"areaId",
        ref_display:"areaName",
    });
    var gasTypeHelper = RefHelper.create({
        ref_url: "gasbizgastype/"+'?query={"parentTypeId":"3"}"',
        ref_col: "gasTypeId",
        ref_display: "gasTypeName"
    });
    var gasTypeFormat=function(){
        return {
            f: function(val){
                var str = "";
                for(var i=0;i<val.split(",").length;i++){
                    str+= gasTypeHelper.getDisplay(val.split(",")[i]) +" ";
                }
                return str;
            }
        }
    }();
    var AreaFormat = function () {
        return {
            f: function (val) {
                return AreaHelper.getDisplay(val);
            }
        }
    }();
    var dateFormat1 = function () {
        return {
            f: function (val) {
                if(val){
                    return val.split("T")[0] + " "+val.split("T")[1]
                }
            }
        }
    }();
    var contractTypeFormat = function(){
        return{
            f:function(val){
                if(val == "1"){
                    return "普通合同"
                }else if(val == "2"){
                    return "增容合同"
                }else if(val == "3"){
                    return "减容合同"
                }else if(val == "4"){
                    return "煤改气合同"
                }else if(val == "5"){
                    return "养老机构合同"
                }
            }
        }
    }();
    var detailFormat=function(){
        return{
            f: function(val,row){
                // if(row.reservedField1== "0"){
                //     return "<a href='customer/non_inhabitant_contract_detail.html?refno=" + val + "'>详情</a>";
                // }else 
                console.log(row)
                if(  row.contractState=="0" && row.reservedField1== "1"){
                    return "<a href='customer/noncontract/noncontract_makeup.html?refno=" + val + "'>补录</a>";
                }else if(  row.contractState=="0" && row.reservedField1== "0"){
                    return "<a href='customer/noncontract/noncontract_info.html?refno=" + val + "'>详情</a>";
                }else if(row.contractState=="0" && row.reservedField1== "2" ){
                    return "<a href='customer/contractnonrenew.html?refno=" + val + "'>预签未通过补录</a>";
                }else if(row.contractState == "1" && row.reservedField1=="0"){
                    return "<a href='customer/noncontract/noncontract_info.html?refno=" + val + "'>详情</a>";
                }else if(row.contractState == "1" && row.reservedField1=="1"){
                    return "<a href='customer/noncontract/noncontract_info.html?refno=" + val + "'>详情</a>";
                }else if(row.contractState == "1" && row.reservedField1=="2"){
                    return "<a href='customer/noncontract/noncontract_makeup.html?refno=" + val + "'>新签未通过补录</a>";
                }else if(row.contractState == "2"){
                    return "<a href='customer/noncontract/noncontract_info.html?refno=" + val + "'>详情</a>";
                }else if((row.contractState == "3" || row.contractState == "4" || row.contractState == "5" ) && row.reservedField1 == "1" && row.status != "9"){
                    return "<a href='customer/noncontract/renew_contract.html?refno=" + val + "'>续签</a>";
                }else if((row.contractState == "3" || row.contractState == "4" || row.contractState == "5" ) && row.reservedField1 == "1" && row.status == "9"){
                    return "<a href='customer/noncontract/noncontract_info.html?refno=" + val + "'>详情</a>";
                }else if(row.contractState == "6" && row.reservedField1== "0"){
                    return "<a href='customer/noncontract/noncontract_info.html?refno=" + val + "'>详情</a>";
                }else if(row.contractState == "6" && row.reservedField1== "1"){
                    return "<a href='customer/noncontract/noncontract_info.html?refno=" + val + "'>详情</a>";
                }else if(row.contractState == "6" && row.reservedField1== "2"){
                    return "<a href='customer/noncontract/noncontract_makeup.html?refno=" + val + "'>续签未通过补录</a>";
                }else if(row.contractState == "7"){
                    return "<a href='customer/noncontract/noncontract_info.html?refno=" + val + "'>详情</a>";
                }
                // console.log(row)
                // if(row.contractState == "0"){
                //     return "<a href='customer/non_inhabitant_contract_detail.html?refno=" + val + "'>详情</a>";

                // }else if(row.contractState == "1" && row.reservedField1 !="1" || row.contractState == "2"){
                //     return "<a href='customer/non_inhabitant_contract_detail.html?refno=" + val + "'>详情</a> ";
                // }else if(row.contractState == "1" && row.reservedField1 =="1"){
                //     return "<a href='customer/contract_noninhabitant_input.html?refno=" + val + "'>补录</a>";
                // }else if(row.contractState == "9" && row.reservedField1 =="1"){
                //     return "<a href='customer/contract_noninhabitant_input.html?refno=" + val + "'>补录</a>";
                // }else if(row.contractState == "9" && row.reservedField1 =="3"){
                //     return "<a href='customer/contract_noninhabitant_input.html?refno=" + val + "'>补录</a>";
                // }else if(row.contractState == "9" && row.reservedField1 =="4"){
                //     return "<a href='customer/contractnonrenew.html?refno=" + val + "'>补录</a>";
                // }else if(row.contractState == "6" && row.reservedField1 =="4"){
                //     return "<a href='customer/contract_noninhabitant_input.html?refno=" + val + "'>补录</a>";
                // }else if( row.contractState == "3" || row.contractState == "4" || row.contractState == "5"  ){
                //     if(row.status =="1"){
                //         return "<a href='customer/non_inhabitant_contract_detail.html?refno=" + val + "'>详情</a>"+" "+
                //             "<a href='customer/renewcontract.html?" +val+"'>续签</a>";
                //     }else{
                //         return "<a href='customer/non_inhabitant_contract_detail.html?refno=" + val + "'>详情</a>";
                //     }
                // }else if(row.contractState == "6"){
                //     return "<a href='customer/non_inhabitant_contract_detail.html?refno=" + val + "'>详情</a>";
                // }else{
                //     return "<a href='customer/non_inhabitant_contract_detail.html?refno=" + val + "'>详情</a>";
                // }

            }
        }
    }();
    return {

        init: function () {
            this.reload();
            this.initHelper();
        },
        initHelper: function () {
            // 用气性质select init
            $.map(gasTypeHelper.getData(), function (value, key) {
                $('#find_gasTypeId').append('<option value="' + key + '">' + value + '</option> ');
            });
           /* $.map(AreaHelper.getData(), function(value, key) {
                $('#find_areaId').append('<option value="'+key+'">'+value+'</option>');
            });*/
        },
        reload:function(){
            $('#divtable').html('');
            var queryCondion = RQLBuilder.and([
                RQLBuilder.equal("gasKind","9"),
                RQLBuilder.condition_fc("areaId","$in",JSON.stringify(loginarea))
            ]).rql()
            console.log(queryCondion)
            xw=XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize:10,
                    columnPicker: true,
                    transition: 'fade',
                    checkAllToggle:true,
                    //----------------基本restful地址---
                    restbase: 'gasctmcontract/?query='+queryCondion+"&sort=-createdTime",
                    key_column: 'contractId',
                    coldefs: [
                        {
                            col: "areaId",
                            friendly: "供气区域",
                            sorting: false,
                            format: AreaFormat,
                            index: 1
                        },
                        {
                            col: "gasType",
                            friendly: "用气类型",
                            format:gasTypeFormat,
                            sorting: false,
                            index: 2
                        },
                        {
                            col: "contractNo",
                            friendly: "合同编号:",
                            sorting: false,
                            index: 3
                        },
                        {
                            col: "useGasPerson",
                            friendly: "客户名称",
                            sorting: false,
                            index: 4
                        },
                        {
                            col: "signupTime",
                            friendly: "签约日期",
                            inputsource: "datetimepicker",
                            date_format: "yyyy-mm-dd",
                            format: dateFormat,
                            readonly: "readonly",
                            sorting: false,
                            index: 6
                        },
                        {
                            col: "beginDate",
                            friendly: "生效日期",
                            inputsource: "datetimepicker",
                            date_format: "yyyy-mm-dd",
                            format: dateFormat,
                            readonly: "readonly",
                            sorting: false,
                            index: 7
                        },
                        {
                            col: "endDate",
                            friendly: "到期日期",
                            inputsource: "datetimepicker",
                            date_format: "yyyy-mm-dd",
                            format: dateFormat,
                            readonly: "readonly",
                            sorting: false,
                            index: 8
                        },
                        {
                            col: "contractType",
                            friendly: "合同类别",
                            format:contractTypeFormat,
                            sorting: false,
                            index: 9
                        },
                        {
                            col: "contractState",
                            friendly: "合同状态",
                            sorting: false,
                            format:GasModCtm.contractStatusFormat,
                            index: 10
                        },
                        {
                            col: "reservedField1",
                            friendly: "审批状态",
                            sorting: false,
                            format:function(){
                                return{
                                    f:function(val){
                                        if(val == "0"){
                                            return "审批中"
                                        }else if(val == "1"){
                                            return "审批通过"
                                        }else if(val == "2"){
                                            return "审批未通过"
                                        }
                                    }
                                }
                            }(),
                            index: 11
                        },
                        {
                            col: "createdTime",
                            friendly: "创建时间",
                            sorting: true,
                            format:dateFormat1,
                            index: 12
                        },
                        {
                            col: "contractId",
                            friendly: "操作",
                            readonly: "readonly",
                            format: detailFormat,
                            sorting: false,
                            index: 13
                        },
                        {
                            col: "remark",
                            friendly: "备注",
                            sorting: false,
                            hidden: true,
                            index: 14
                        },
                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var find_areaId,find_gasTypeId,find_useGasPerson,find_contractState,find_contractCode,status,find_start_date,find_end_date,find_endTime,find_endTime1,find_contractType,find_reservedField1;
                        if ($('#find_areaId').val()) {
                            find_areaId = RQLBuilder.equal("areaId", $('#find_areaId').val());
                        }else{
                            find_areaId = RQLBuilder.condition_fc("areaId","$in",JSON.stringify(loginarea));
                        }
                        if ($('#find_gasTypeId').val()) {
                            find_gasTypeId = RQLBuilder.like("gasType", $('#find_gasTypeId').val());
                        }
                        if ($('#find_contractState').val()) {
                            console.log($('#find_contractState').val());
                            find_contractState = RQLBuilder.equal("contractState", $('#find_contractState').val());
                        }
                        if ($('#find_useGasPerson').val()) {
                            find_useGasPerson = RQLBuilder.like("useGasPerson", $('#find_useGasPerson').val());
                        }
                        if ($('#find_contractCode').val()) {
                            find_contractCode = RQLBuilder.like("contractNo", $('#find_contractCode').val());
                        }
                        if ($('#find_contractType').val()) {
                            find_contractType = RQLBuilder.equal("contractType", $('#find_contractType').val());
                        }
                        if ($('#find_reservedField1').val()) {
                            console.log($('#find_reservedField1').val())
                            find_reservedField1 = RQLBuilder.equal("reserved_field1", $('#find_reservedField1').val());
                        }

                        // if ($('#status').val()) {
                        //     status = RQLBuilder.equal("status", $('#status').val());
                        // }
                        if($("#find_start_date").val()){
                            find_start_date = RQLBuilder.condition("signupTime","$gte","to_date('"+ $("#find_start_date").val()+" 00:00:00','yyyy-MM-dd HH24:mi:ss')");
                        }
                        if($("#find_end_date").val()){
                            find_end_date = RQLBuilder.condition("signupTime","$lte","to_date('"+ $("#find_end_date").val()+" 23:59:59','yyyy-MM-dd HH24:mi:ss')");
                        }
                        if($("#find_endTime").val()){
                            find_endTime = RQLBuilder.condition("endDate","$gte","to_date('"+ $("#find_endTime").val()+" 00:00:00','yyyy-MM-dd HH24:mi:ss')");
                        }
                        if($("#find_endTime1").val()){
                            find_endTime1 = RQLBuilder.condition("endDate","$lte","to_date('"+ $("#find_endTime1").val()+" 23:59:59','yyyy-MM-dd HH24:mi:ss')");
                        }
                        var contractType = RQLBuilder.equal("gasKind","9");
                        var filter = RQLBuilder.and([
                            contractType,find_areaId,find_gasTypeId,find_useGasPerson,find_contractState,find_contractCode,status,find_start_date,find_end_date,find_endTime,find_endTime1,find_contractType,find_reservedField1
                        ]);
                        xw.setRestURL(hzq_rest + 'gasctmcontract/?sort=-createdTime');
                        return filter.rql();
                    }
                })
        }
    }
}();

//  文件上传。。。
// var busiId= $.md5(JSON.stringify(document.getElementById('form'))+ new Date().getTime());
var gpypic =false;
$(document).on("click", '.fileinput-upload-button', function (e) {
    e.preventDefault();
    var form = new FormData(document.getElementById('form'));
    $.ajax({
        url: "/hzqs/sys/upload.do?busiId="+gpyphoto,
        data: form,
        dataType: 'text',
        processData: false,
        contentType: false,
        async: false,
        type: 'POST',
        success: function (data) {
            console.log(JSON.stringify(data));
            console.log(JSON.parse(data));
            if (JSON.parse(data).length != 0) {
                bootbox.alert('导入成功！');
                gpypic =true;
            } else {
                bootbox.alert("导入失败！");
            }
        },
        error: function (data) {
            console.log(data);
            if(data.status == '413'){
                bootbox.alert("文件不能超过1M");
            }
            $("#fileId").val('');
        }
    });
});
var userinfo = JSON.parse(localStorage.getItem('user_info'));
$(document).on("click","#addsubmit",function(){
    if(!$("#contractType").val()){
        bootbox.alert("<center><h4>请选择合同类别。</h4></center>")
        return false;
    }

    //发流程
    var contractId = $.md5(Math.random()*100000000000 + new Date().getTime());
    var date = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
    console.log(date)
    var form={};
    var str ="";
    form["contractId"] = contractId;

    form["contractNo"] = $("#contractNo").val();
    form["useGasPerson"] = $("#useGasPerson").val();
    if( $("#contractType").val() == "2"){
        str="增容预签"
    }else if( $("#contractType").val() == "3"){
        str="减容预签"
    }else{
        str="预签"
    }
    form["contractState"] = "0";
    form["reservedField1"] = "0";
    form["contractType"] = $("#contractType").val();
    form["gasKind"] = "9";
    form["areaId"] = JSON.parse(localStorage.getItem("user_info")).area_id;
    form["createdBy"] = JSON.parse(localStorage.getItem("user_info")).userId;
    form["sysTime"] = date;
    form["createdTime"] = date;
    form["modifiedBy"] = JSON.parse(localStorage.getItem("user_info")).userId;
    form["modifiedTime"] = date;
    form["activityInstanceId"] = contractId;
    if(gpypictureIds || gpypic){
        form["reservedField2"] = gpyphoto;
    }

    var result = Restful.postDataR( hzq_rest +"gasctmcontract",JSON.stringify(form));
    console.log(form);
    var busiData={
        "contractId":contractId,
        "reservedField2":gpyphoto
    }
    flowjson = {
        "flow_def_id":"FJMHT",
        "ref_no":contractId,
        "be_orgs":userinfo.area_id,
        "operator":userinfo.userId,
        "flow_inst_id":contractId,
        "prop1str64":moment().format("YYYY-MM-DD HH:mm:ss"),
        "prop2str64":$("#useGasPerson").val()+"(合同编号:"+$("#contractNo").val()+") — "+str,
        "propstr128":"营业部合同管理员",
        "propstr2048":busiData,
        "override_exists": false
    }

    var flow_result = Restful.insert("/hzqs/psm/pbisn.do?fh=VFLSCGC000000J00&bd={}&resp=bd",flowjson);
    console.log(flow_result)
    if(flow_result.retmsg == "SUCCESS:1"){
        bootbox.alert("<center><h4>提交成功。</h4></center>",function(){
            window.location.reload();
        });
    }else{
        var result = Restful.delByID( hzq_rest +"gasctmcontract",form.contractId);
        console.log(result)
        bootbox.alert("<center><h4>提交失败。</h4></center>",function(){
            window.location.reload();
        })
    }
});

