
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


//供气区域权限
var loginarea = [];
var areaId = JSON.parse(localStorage.getItem("user_info")).area_id

GasModSys.areaList({
    "areaId":areaId,
    "cb":function(data){
        console.log(data)
        $.each(data,function(key,val){
            loginarea.push(val.areaId);
            $('#find_area').append('<option value="' + val.areaId + '">' + val.areaName + '</option>');
        })
    }
});

var ContractInhabitant = function () {
    //供气区域
    var AreaHelper = RefHelper.create({
        ref_url: "gasbizarea",
        ref_col: "areaId",
        ref_display: "areaName",
    });
    var countperHelper = RefHelper.create({
        ref_url: "gassysuser",
        ref_col: "userId",
        ref_display: "employeeName",
    });
    var gasTypeHelper = RefHelper.create({
        ref_url: "gasbizgastype",
        ref_col: "gasTypeId",
        ref_display: "gasTypeName"
    });
    var gasTypeFormat = function () {
        return {
            f: function (val) {
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
    var CountperFormat = function () {
        return {
            f: function (val) {
                return countperHelper.getDisplay(val);
            },
        }
    }();
    var detailFormat = function () {
        return {
            f: function (val,row) {/*id='modifycont' data-row='"+JSON.stringify(row)+"' data-target='#modifycontract' data-toggle='modal'*/
                if(row.contractNo){
                    return "<a href='customer/inhabitant_contract_detail.html?" + val + "'>详情</a>";
                }else {
                    return "<a href='javascript:;' class='informa'>详情</a>"
                }

            }
        }
    }();


    return {

        init: function () {
            this.initHelper();
            this.reload();

        },
        initHelper: function () {
            // 用气性质select init
            $.map(gasTypeHelper.getData(), function (value, key) {
                $('#find_gasTypeId').append('<option value="' + key + '">' + value + '</option>');
            });
        },
        reload: function () {
            $('#divtable').html('');


            var bd = {
                "cols": "ca.*,b.countper_id,b.serviceper_id,b.book_code,c.unbolt_time,c.customer_code customercode",
                "froms": "gas_ctm_archive c left join gas_ctm_contract ca on ca.customer_code = c.customer_code" +
                " left join gas_mrd_book b on b.book_id = c.book_id ",
                "wheres": "1=0 and c.customer_kind = '1' and c.area_id in ("+loginarea.join()+")",
                "page": true,
                "limit": 50
            };
            xw = XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize: 10,
                    columnPicker: true,
                    transition: 'fade',
                    tableId:"divtable",
                    checkAllToggle: true,
                    //----------------基本restful地址---
                    // restbase: 'gasctmcontract/'+'?query={"gas_kind":"1"}"',
                    restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
                    key_column: 'contractId',
                    coldefs: [
                        {
                            col: "customercode",
                            friendly: "客户编号",
                            sorting: false,
                            index: 1
                        },
                        {
                            col: "useGasPerson",
                            friendly: "客户名称",
                            sorting: false,
                            index: 2
                        },
                        {
                            col: "contractNo",
                            friendly: "合同编号",
                            sorting: false,
                            index: 3
                        },
                        {
                            col: "areaId",
                            friendly: "供气区域",
                            sorting: false,
                            format: AreaFormat,
                            index: 4
                        },
                        {
                            col: "countperId",
                            friendly: "核算员",
                            format:CountperFormat,
                            sorting: false,
                            index: 5
                        },
                        {
                            col: "serviceperId",
                            friendly: "抄表员",
                            format:CountperFormat,
                            sorting: false,
                            index: 6
                        },
                        {
                            col: "bookCode",
                            friendly: "抄表本",
                            sorting: false,
                            index: 7
                        },

                        {
                            col: "useGasAddress",
                            friendly: "客户地址",
                            sorting: false,
                            // format: GasModCtm.customerTypeFormat,
                            index: 8
                        },
                        {
                            col: "signupTime",
                            friendly: "签约日期",
                            inputsource: "datetimepicker",
                            date_format: "yyyy-mm-dd",
                            format: dateFormat,
                            readonly: "readonly",
                            sorting: false,
                            index: 9
                        },
                        {
                            col: "unboltTime",
                            friendly: "开栓时间",
                            inputsource: "datetimepicker",
                            date_format: "yyyy-mm-dd",
                            format: dateFormat,
                            readonly: "readonly",
                            sorting: false,
                            index: 10
                        },
                        {
                            col: "contractState",
                            friendly: "合同状态",
                            format: GasModCtm.contractStatusFormat,
                            sorting: false,
                            index: 10
                        },
                        {
                            col: "remark",
                            friendly: "备注",
                            sorting: false,
                            hidden: true,
                            index: 10
                        },

                        {
                            col: "contractId",
                            friendly: "操作",
                            readonly: "readonly",
                            format: detailFormat,
                            sorting: false,
                            index: 10
                        },

                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var whereinfo = "";
                        if ($('#find_customerCode').val()) {
                            whereinfo += "c.customer_code like '%" + $('#find_customerCode').val() + "%' and ";
                        }
                        if ($('#find_contract').val() && $('#find_contract').val() == "1" ) {
                            whereinfo += "ca.contract_state='" + $('#find_contract').val() + "' and ";
                        }else if ($('#find_contract').val() && $('#find_contract').val() == "2" ) {
                            whereinfo += "ca.contract_state='" + $('#find_contract').val() + "' and ";
                        }else if ($('#find_contract').val() && $('#find_contract').val() == "3" ) {
                            whereinfo += "ca.contract_state is not null and ";
                        }else if ($('#find_contract').val() && $('#find_contract').val() == "4" ) {
                            whereinfo += "ca.contract_state is null and ";
                        }

                        if ($('#find_useGasPerson').val()) {
                            whereinfo += "ca.use_gas_person like '%" + $('#find_useGasPerson').val() + "%' and ";
                        }

                        if ($('#find_contractCode').val()) {
                            whereinfo += "ca.contract_no like '%" + $('#find_contractCode').val() + "%' and ";
                        }
                        if ($('#find_customerAddress').val()) {
                            whereinfo += "ca.use_gas_address like '%" + $('#find_customerAddress').val() + "%' and ";
                        }
                        if ($("#find_bookcode").val()) {
                            whereinfo += "b.book_code like '%" + $('#find_bookcode').val() + "%' and ";
                        }
                        if ($("#find_count").val()) {
                            whereinfo += "b.countper_id like '%" + $('#find_count').val() + "%' and ";
                        }

                        if ($("#find_area").val()) {
                            whereinfo += "c.area_id='" + $('#find_area').val() + "' and ";
                        }

                        if ($("#find_start_date").val() && $("#find_end_date").val()) {
                            whereinfo += " to_char(ca.signup_time,'yyyy-mm-dd')  between '" + $('#find_start_date').val() + "' and '" + $("#find_end_date").val() + "' and ";
                        } else if ($("#find_start_date").val() && !$("#find_end_date").val()) {
                            bootbox.alert("请输入截止日期")
                        } else if (!$("#find_start_date").val() && $("#find_end_date").val()) {
                            bootbox.alert("请输入起始日期")
                        }

                        if ($("#find_endTime").val() && $("#find_endTime1").val()) {
                            whereinfo += " to_char(c.unbolt_time,'yyyy-mm-dd')  between '" + $('#find_endTime').val() + "' and '" + $("#find_endTime1").val() + "' and ";
                        } else if ($("#find_endTime").val() && !$("#find_endTime1").val()) {
                            bootbox.alert("请输入截止日期")
                        } else if (!$("#find_endTime").val() && $("#find_endTime1").val()) {
                            bootbox.alert("请输入起始日期")
                        }
                        var bd = {
                            "cols": "ca.*,b.countper_id,b.serviceper_id,b.book_code,c.unbolt_time,c.customer_code customercode",
                            "froms": "gas_ctm_archive c left join gas_ctm_contract ca on ca.customer_code = c.customer_code" +
                            " left join gas_mrd_book b on b.book_id = c.book_id ",
                            "wheres": whereinfo + " c.customer_kind = '1' and c.area_id in ("+loginarea.join()+")",
                            "page": true,
                            "limit": 50
                        };
                        xw.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)));
                    }
                })
        }

    }

}();

$(document).on("click",".informa",function(){
    bootbox.alert("<center><h4>合同未签订。</h4></center>")
})
