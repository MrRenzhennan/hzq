/**
 * Created by anne on 2017/12/5.
 */
ComponentsPickers.init();
var xw;
var userInfo = JSON.parse(localStorage.getItem('user_info'));
var area_id = userInfo.area_id;
var user_id = userInfo.userId;
var areaHelper = RefHelper.create({
    ref_url: "gasbizarea",
    ref_col: "areaId",
    ref_display: "areaName"
});

var AreaHelper = RefHelper.create({
    ref_url: "gasbizarea",
    ref_col: "areaId",
    ref_display: "areaName"
});
var AreaFormat = function () {
    return {
        f: function (val) {
            return AreaHelper.getDisplay(val);
        }
    }
}();


/**
 * 点击录入跳转页面
 */
$('#input_one').click(function () {
        window.location.href = "customer/dm/meter_repair_detail.html";
});


var meterRepairAction = function () {


    var detailedInfoFormat = function () {
        return {
            f: function (val, row) {
                    return "<a  href='' id='damageInfo1' ' data-toggle='modal' data-kind='" + JSON.stringify(row) + "'>" + '详情' + "</a>";
            }
        }
    }();


    var customerKindFormat = function () {
        return {
            f: function (data, row) {
                if (data == "1") {
                    return "居民";
                } else if (data == "9") {
                    return "非居民";
                } else {
                    return "";
                }
            }
        }
    }()
    return {
        init: function () {
            this.initHelper();
            this.reload();
        },
        initHelper: function () {
            $.map(GasModCtm.enumCustomerKind,function(value,key){
                $('#find_customerkind').append('<option value="' + key + '">' + value + '</option>');
            });
            // $.map(factoryHelper.getData(), function (value, key) {
            //     $('select[name="factoryId"]').append('<option value="' + key + '">' + value + '</option>');
            // });
            // $.each(meterTypeIdHelper.getRawData(), function (index, row) {
            //     $('select[name="meterTypeId"]').append('<option value="' + row.meterTypeId + '">' + row.meterTypeName + '</option>');
            // });
            // $.each(resKindIdHelper.getRawData(), function (index, row) {
            //     $('select[name="reskindId"]').append('<option value="' + row.reskindId + '">' + row.reskindName + '</option>');
            // });
            // $.map(meterFlowRangeHelper.getData(), function (value, key) {
            //     $('select[name="flowRange"]').append('<option value="' + key + '">' + value + '</option>');
            // });
            // $.map(meterSpecIdHelper.getData(), function (value, key) {
            //     $('select[name="meterModelId"]').append('<option value="' + key + '">' + value + '</option>');
            // });
        },
        reload:function(){

            $('#divtable').html('');


            var bd = {
                "cols": "repair.*,archive.link_mantel,archive.customer_name，archive.customer_kind,archive.area_id,archive.ctm_archive_id",
                "froms": "gas_mtr_meter_repair repair left join gas_ctm_archive archive on repair.customer_code = archive.customer_code",
                "wheres": "",
                "pade": true,
                "limit":50
            }
            var detailedInfoFormat = function () {
                return {
                    f: function (val, row) {
                        return "<a  href='customer/dm/meter_repair_detail.html?" + row.meterRepairId + "?"+row.customerCode+"?"+row.ctmArchiveId+"?"+row.customerName+"?detail'>" + '详情' + "</a> " ;

                    }
                }
            }();


            xw=XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize:10,
                    columnPicker: true,
                    transition: 'fade',
                    checkboxes: true,
                    checkAllToggle:true,
                    //----------------基本restful地址---
                    restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
                    key_column: "meterRepairId",
                    //---------------行定义
                    coldefs: [
                        {
                            col:"customerCode",
                            friendly:"客户编号",
                            validate:"required",
                            index:1
                        },
                        {
                            col:"customerName",
                            friendly:"客户姓名",
                            validate:"required",
                            index:2
                        },
                        {
                            col:"customerAddress",
                            friendly:"客户地址",
                            validate:"required",
                            index:3
                        },
                        {
                            col:"linkMantel",
                            friendly: "联系电话",
                            validate:"required",
                            index:4
                        },
                        {
                            col:"customerKind",
                            friendly: "客户类型",
                            format:customerKindFormat,
                            validate:"required",
                            index:5
                        },
                        {
                            col:"areaId",
                            friendly: "供气区域",
                            format:AreaFormat,
                            validate:"required",
                            index:6
                        },
                        {
                            col:"repairContent",
                            friendly:"报修内容",
                            nonedit:"nosend",
                            index:7
                        },
                        {
                            col:"repairDate",
                            friendly:"报修时间",
                            format:dateFormat,
                            validate:"required",
                            index:8
                        },
                        {
                            col:"sendPerson",
                            friendly:"派工人员",
                            nonedit:"nosend",
                            index:9
                        },
                        {
                            col:"modifiedBy",
                            friendly:"变更人",
                            hidden:true,
                            nonedit:"nosend",
                            index:10
                        },
                        {
                            col:"status",
                            format:GasSysBasic.StatusFormat,
                            inputsource: "custom",
                            inputbuilder: "statusEditBuilder",
                            validate:"required",
                            friendly:"状态",
                            index:11
                        },

                        {
                            col:"meterRepairId",
                            friendly:"操作",
                            nonedit: "nosend",
                            format: detailedInfoFormat,
                            sorting:false,
                            index:12


                        }

                    ],

                    // 查询过滤条件

                    findFilter: function(){
                        var customerCode =  $('#customerCode').val();
                        var customerName =  $('#customerName').val();
                        var find_customerkind = $('#find_customerkind option:selected').val();
                        var whereinfo = "";
                        if (customerCode) {
                            whereinfo += " repair.customer_code like  '%" + customerCode + "%' and ";
                        }
                        if (customerName) {
                            whereinfo += "archive.customer_name like  '%" + customerName + "%' and ";
                        }
                        if (find_customerkind) {
                            whereinfo += "customer_kind = '" + find_customerkind + "' and ";
                        }
                        if ($("#find_start_date").val() && $("#find_end_date").val()) {
                            whereinfo += " to_char(repair.created_time,'yyyy-mm-dd')  between '" + $('#find_start_date').val() + "' and '" + $("#find_end_date").val() + "' and ";
                        } else if ($("#find_start_date").val() && !$("#find_end_date").val()) {
                            bootbox.alert("请输入截止日期")
                        } else if (!$("#find_start_date").val() && $("#find_end_date").val()) {
                            bootbox.alert("请输入起始日期")
                        }

                        bd = {
                            "cols": "repair.*,archive.link_mantel,archive.customer_name，archive.customer_kind",
                            "froms": "gas_mtr_meter_repair repair left join gas_ctm_archive archive on repair.customer_code = archive.customer_code",
                            "wheres": whereinfo+" 1=1",
                            "pade": true,
                            "limit":50
                        }


                        xw.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)));
                        return "";
                    }


                })
        }

    }
}();

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
$(document).on('click', "#damageInfo1", function () {
    var dateFormat = function (val) {
        if (val) {
            var date = val.substring(0, 10);
            return date;
        }
    };
    var statusFormat = function () {
        return {
            f: function (val) {
                if (val == "1") {
                    return "启用"
                } else if (val == "2") {
                    return "停用"
                } else if (val == "3") {
                    return "已删除"
                }else{
                    return "异常状态"
                }
            }
        }
    }()
    var row = JSON.parse($(this).attr("data-kind"));
    ctmArchiveId = row.ctmArchiveId;
    $('#remark_info').val(row.remark)

    $.ajax({
        url: hzq_rest + 'gasctmarchive?query={"ctmArchiveId":"' + ctmArchiveId + '"}',
        type: "get",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (data) {
            console.log(data)
            if (data.length) {
                $('#info input').each(function (index) {
                    $(this).attr("name");

                    $('#info input').each(function (index) {
                        var data = $(this).attr("name");
                        if($(this).attr("name") == "meterNo"){
                            $(this).val(row.meterNo)
                        }else if($(this).attr("name") == "payWay"){
                            $(this).val(row.payWay)
                        }else if($(this).attr("name") == "findResource"){
                            $(this).val(row.findResource)
                        }else if($(this).attr("name") == "money"){
                            $(this).val(row.money)
                        }else if($(this).attr("name") == "securityInspector"){
                            $(this).val(row.securityInspector)
                        }
                    });

                    if ($(this).attr('name') == "areaId") {
                        $(this).val(areaHelper.getDisplay(data[0][$(this).attr('name')]))
                        // $(this).val(dateFormat(data[0][$(this).attr('name')]))
                    } else if($(this).attr("name") == "createdTime"){
                        $(this).val(dateFormat(row.createdTime))
                    }else if($(this).attr("name") == "createdBy"){
                        $(this).val(row.createdBy)
                    }else if($(this).attr("name") == "status"){
                        $(this).val(statusFormat.f(row.status))
                    }else {
                    $(this).val(data[0][$(this).attr('name')]);
                }
                });

            }
        }
    });
});



