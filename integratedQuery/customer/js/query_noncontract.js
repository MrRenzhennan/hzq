
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

var contractStatus = {"0": "预签", "1": "新签", "2": "正常", "3": "即将到期", "4": "到期", "5": "过期","6":"续签","7":"作废","9":"未通过"};
$.each(contractStatus,function(key,val){
    $("#find_contractState").append("<option value='"+key+"'>"+val+"</option>")
})

var loginarea = [];
var areaId = JSON.parse(localStorage.getItem("user_info")).area_id

GasModSys.areaList({
    "areaId":areaId,
    "cb":function(data){
        console.log(data)
        $.each(data,function(key,val){
            // loginarea.push(val.areaId);
            loginarea.push("'"+val.areaId+"'");
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
                return gasTypeHelper.getDisplay(val);
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
    var detailFormat=function(){
        return {
            f: function(val,row){
                return "<a href='integratedQuery/customer/query_noncontractinfo.html?refno=" + val + "'>详情</a>";
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

            var global_remap = {
                "contractState":"0:预签,1:新签,2:正常,3:即将到期,4:到期,5:过期,6:续签,7:作废,9:未通过",
                "gasType":"db@GAS_BIZ_GAS_TYPE,gasTypeId,gasTypeName",
                "areaId":"db@GAS_BIZ_AREA,areaId,areaName",
                "contractType":"1:普通合同,2:增容合同,3:减容合同,4:煤改气合同,5:养老机构合同",
                "reservedField1":"0:审批中,1:审批通过,2:审批未通过"
            }

            var queryCondion = RQLBuilder.and([
                RQLBuilder.equal("gasKind","9"),
                RQLBuilder.condition_fc("areaId","$in",JSON.stringify(loginarea))
            ]).rql()
            console.log(queryCondion)
            var bd = {"cols":"*",
                "froms":"gas_ctm_contract",
                "wheres":" gas_kind='9' and area_id in ("+loginarea.join()+") order by  signup_time desc,created_time desc ",
                "page":"true",
                "limit":50};
            xw=XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize:10,
                    columnPicker: true,
                    transition: 'fade',
                    checkAllToggle:true,
                    exportxls: {
                        title:"非居民合同",
                        remap:global_remap,
                        hidden:false,
                        ci:{}
                    },
                    //----------------基本restful地址---
                    restURL : "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd="+encodeURIComponent(JSON.stringify(bd)),
                    // restbase: 'gasctmcontract/?query='+queryCondion+"&sort=-signupTime,-createdTime",
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
                      /*  var find_areaId,find_gasTypeId,find_useGasPerson,find_contractState,find_contractCode,status,find_start_date,find_end_date,find_endTime,find_endTime1,find_contractType;
                        if ($('#find_areaId').val()) {
                            find_areaId = RQLBuilder.equal("areaId", $('#find_areaId').val());
                        }else{
                            find_areaId = RQLBuilder.condition_fc("areaId","$in",JSON.stringify(loginarea));
                        }
                        if ($('#find_gasTypeId').val()) {
                            find_gasTypeId = RQLBuilder.equal("gasType", $('#find_gasTypeId').val());
                        }
                        if ($('#find_contractState').val()) {
                            console.log($('#find_contractState').val());
                            find_contractState = RQLBuilder.equal("contractState", $('#find_contractState').val());
                        }
                        console.log(find_contractState)
                        if ($('#find_useGasPerson').val()) {
                            find_useGasPerson = RQLBuilder.like("useGasPerson", $('#find_useGasPerson').val());
                        }
                        if ($('#find_contractCode').val()) {
                            find_contractCode = RQLBuilder.like("contractNo", $('#find_contractCode').val());
                        }
                        if ($('#find_contractType').val()) {
                            find_contractType = RQLBuilder.equal("contractType", $('#find_contractType').val());
                        }

                        if ($('#status').val()) {
                            status = RQLBuilder.equal("status", $('#status').val());
                        }
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
                            contractType,find_areaId,find_gasTypeId,find_useGasPerson,find_contractState,find_contractCode,status,find_start_date,find_end_date,find_endTime,find_endTime1,find_contractType
                        ]);*/
                        var sql= " 1=1 ";

                        if ($('#find_useGasPerson').val()) {
                            sql+=" and use_gas_person like '%"+$('#find_useGasPerson').val()+"%'";
                        }
                        if ($('#find_areaId option:selected').val()) {
                            sql+= " and area_id = '"+$('#find_areaId option:selected').val()+"'"
                        }else{
                            sql+= " and area_id in ("+loginarea.join()+") "
                        }
                        if ($("#find_gasTypeId").val()) {
                            sql+= " and gas_type = '"+$("#find_gasTypeId").val()+"'"
                        }
                        if ($("#find_contractState").val()) {
                            sql+= " and contract_state = '"+$("#find_contractState").val()+"'"
                        }
                        if ($("#find_contractType").val()) {
                            sql+= " and contract_type = '"+$("#find_contractType").val()+"'"
                        }
                        if ($("#find_contractCode").val()) {
                            sql+= " and contract_no like '%"+$("#find_contractCode").val()+"%'"
                        }
                        if ($("#find_reservedField1").val()) {
                            sql+= " and reserved_field1 = '"+$("#find_reservedField1").val()+"'"
                        }


                        if ($("#find_start_date").val() && $("#find_end_date").val()) {
                            sql += " and to_char(signup_time,'yyyy-mm-dd')  between '" + $('#find_start_date').val() + "' and '" + $("#find_end_date").val() + "'";
                        } else if ($("#find_start_date").val() && !$("#find_end_date1").val()) {
                            bootbox.alert("请输入截止日期")
                        } else if (!$("#find_start_date").val() && $("#find_end_date1").val()) {
                            bootbox.alert("请输入起始日期")
                        }

                        if ($("#find_start_date1").val() && $("#find_end_date1").val()) {
                            sql += " and to_char(end_date,'yyyy-mm-dd')  between '" + $('#find_start_date1').val() + "' and '" + $("#find_end_date1").val() + "'";
                        } else if ($("#find_start_date1").val() && !$("#find_end_date1").val()) {
                            bootbox.alert("请输入截止日期")
                        } else if (!$("#find_start_date1").val() && $("#find_end_date1").val()) {
                            bootbox.alert("请输入起始日期")
                        }

                        bd = {"cols":"*",
                            "froms":"gas_ctm_contract",
                            "wheres":sql + " and gas_kind='9'  order by  signup_time desc,created_time desc ",
                            "page":"true",
                            "limit":50
                        };

                        xw.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd="+encodeURIComponent(JSON.stringify(bd)));
                        // xw.setRestURL(hzq_rest + 'gasctmcontract');
                        // return filter.rql();
                    }
                })
        }
    }
}();
