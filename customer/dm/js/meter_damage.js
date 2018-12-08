/**
 * Created by anne on 2017/12/8.
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

$('#saveId').click(function () {

    var inputQuery = RQLBuilder.and([
        RQLBuilder.equal("meterNo", $("#meter_No").val())
    ]).rql();
    var mtrmeter = Restful.findNQ(hzq_rest + 'gasmtrmeter/?query=' + inputQuery);
    if(mtrmeter.length<1){
        bootbox.alert("表编号错误");
        return;
    }
    var inputQuery1 = RQLBuilder.and([
        RQLBuilder.equal("meterId", mtrmeter[0].meterId)
    ]).rql();
    var ctmmeter = Restful.findNQ(hzq_rest + 'gasctmmeter/?query=' + inputQuery1);
    console.log($('#find_resource:selected').val());

    var param={
        "damagePayId":GasModService.getUuid(),
        "ctmArchiveId":ctmmeter[0].ctmArchiveId,
        "findResource":$('#find_resource option:selected').val(),
        "securityInspector":$("#security_inspector").val(),
        "payWay":$('#pay_way option:selected').val(),
        "meterId":ctmmeter[0].meterId,
        "money":$("#amount1").val(),
        "status":"1",
        "remark":$("#remark1").val(),
        "createdTime":new Date(moment().format('yyyy-MM-dd hh:mm:ss')+"-00:00"),//userinfo.userId,
        "createdBy":userInfo.userId,
        "modifiedTime":new Date(moment().format('yyyy-MM-dd hh:mm:ss')+"-00:00"),
        "modifiedBy":userInfo.userId

    }

    var result = Restful.insert(hzq_rest + "gasmtrdamagepay", param);
    if(result['success']){
        bootbox.alert("保存成功");
        $("#cancelId").click();
        window.location.reload();

    }else{
        bootbox.alert("保存失败");
        $("#cancelId").click();
        window.location.reload();
    }

});

var meterDestoryAction = function () {
    // var depositoryFormat = function () {
    //     return {
    //         f: function (val) {
    //             return depositoryHelper.getDisplay(val);
    //         }
    //     }
    // }();
    // var detailedInfoFormat = function () {
    //     return {
    //         f: function (val, row) {
    //             return "<a  data-target='#updatemeter' id='update_meter' data-toggle='modal' data-kind='" + JSON.stringify(row) + "'>" + '修改' + "</a>";
    //
    //         }
    //     }
    // }();


    var detailedInfoFormat = function () {
        return {
            f: function (val, row) {
                    return "<a  data-target='#damageInfo' id='damageInfo1' ' data-toggle='modal' data-kind='" + JSON.stringify(row) + "'>" + '详情' + "</a>";
            }
        }
    }();
    var findResourceFormat = function () {
        return {
            f: function (val) {
                if (val == "0") {
                    return "抄表"
                } else if (val == "1") {
                    return "复核"
                } else if (val == "2") {
                    return "抽检"
                }else if (val == "3") {
                    return "安检"
                }else if (val == "4") {
                    return "巡检"
                }else if (val == "5") {
                    return "稽查"
                }else if (val == "6") {
                    return "走访"
                }else if (val == "7") {
                    return "其他"
                }else if(val == ""){
                    return ""
                }else {
                    return "异常"
                }
            }
        }
    }()
    var payWayFormat = function () {
        return {
            f: function (val) {
                if (val == "0") {
                    return "修表"
                } else if (val == "1") {
                    return "购买新表"
                }else if (val == "2") {
                    return "其他"
                }else if(val == ""){
                    return ""
                }else{
                    return "异常"
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
                "cols": "damage.*,meter.meter_no",
                "froms": "gas_mtr_damage_pay damage left join gas_mtr_meter meter on damage.meter_id = meter.meter_id",
                "wheres": "",
                "pade": true,
                "limit":50
            }
            var openButton = function() {
                return {
                    f: function() {
                        return "<a id='d_button' href='meterreading/project/meterreading9.html'>详情&nbsp;<span class='glyphicon glyphicon-pencil'></span></a> ";
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
                    key_column: "damagePayId",
                    //---------------行定义
                    coldefs: [
                        {
                            col:"meterNo",
                            friendly:"表编号",
                            validate:"required",
                            index:1
                        },
                        {
                            col:"money",
                            friendly:"赔偿金额",
                            validate:"required",
                            index:2
                        },
                        {
                            col:"payWay",
                            friendly:"赔偿方式",
                            format:payWayFormat,
                            validate:"required",
                            index:3
                        },
                        {
                            col:"findResource",
                            friendly: "数据来源",
                            format:findResourceFormat,
                            validate:"required",
                            index:4
                        },
                        {
                            col:"createdTime",
                            friendly:"创建时间",
                            format:dateFormat,
                            nonedit:"nosend",
                            index:5
                        },
                        {
                            col:"createdBy",
                            friendly:"创建人",
                            validate:"required",
                            index:6
                        },
                        {
                            col:"modifiedTime",
                            friendly:"变更时间",
                            format:dateFormat,
                            hidden:true,
                            nonedit:"nosend",
                            index:7
                        },
                        {
                            col:"modifiedBy",
                            friendly:"变更人",
                            hidden:true,
                            nonedit:"nosend",
                            index:8
                        },
                        {
                            col:"status",
                            format:GasSysBasic.StatusFormat,
                            inputsource: "custom",
                            inputbuilder: "statusEditBuilder",
                            validate:"required",
                            friendly:"状态",
                            index:9
                        },

                        {
                            col:"damagePayId",
                            friendly:"操作",
                            nonedit: "nosend",
                            format: detailedInfoFormat,
                            sorting:false,
                            index:10


                        },

                    ],

                    // 查询过滤条件

                    findFilter: function(){
                        var meterNo =  $('#meterNo').val();
                        var createdBy = $('#createdBy').val();
                        var payWay = $('#payWay option:selected').val();
                        var findResource = $('#findResource option:selected').val();
                        var whereinfo = "";
                        if (meterNo) {
                            whereinfo += " meter_no like  '%" + meterNo + "%' and ";
                        }
                        if (createdBy) {
                            whereinfo += "damage.created_by = '" + createdBy + "' and ";
                        }
                        if (payWay) {
                            whereinfo += "pay_way = '" + payWay + "' and ";
                        }
                        if (findResource) {
                            whereinfo += "find_resource = '" + findResource + "' and ";
                        }


                        if ($("#find_start_date").val() && $("#find_end_date").val()) {
                            whereinfo += " to_char(damage.created_time,'yyyy-mm-dd')  between '" + $('#find_start_date').val() + "' and '" + $("#find_end_date").val() + "' and ";
                        } else if ($("#find_start_date").val() && !$("#find_end_date").val()) {
                            bootbox.alert("请输入截止日期")
                        } else if (!$("#find_start_date").val() && $("#find_end_date").val()) {
                            bootbox.alert("请输入起始日期")
                        }

                        bd = {
                            "cols": "damage.*,meter.meter_no",
                            "froms": "gas_mtr_damage_pay damage left join gas_mtr_meter meter on damage.meter_id = meter.meter_id",
                            "wheres": whereinfo+" 1=1",
                            "page": true,
                            "limit": 50
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




