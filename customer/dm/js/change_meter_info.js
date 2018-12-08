/**
 * Created by alex on 2017/7/29.
 */
var area_id = JSON.parse(localStorage.getItem("user_info")).area_id;
var xw;
var areas = new Array();
areas.push(area_id);
//查询areaId下级areaId
$.ajax({
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    type: 'get',
    async: false,
    url: hzq_rest + "gasbizarea?query={\"parentAreaId\":\"" + area_id + "\"}",
    success: function (data) {
        for (var i = 0; i < data.length; i++) {
            areas.push(data[i].areaId);
        }
    }
});
var AreaHelper1 = RefHelper.create({
    ref_url: 'gasbizarea?query={"areaId":{"$in":' + JSON.stringify(areas) + '}}',
    ref_col: "areaId",
    ref_display: "areaName",
    "sort": "posCode"
});
$.each(AreaHelper1.getRawData(), function (index, row) {
    $('#find_unit').append('<option value="' + row.areaId + '">' + row.areaName + '</option>');
});

var Direction = {
    "L": "左",
    "R": "右"
};
var meterStatus =
{"1": "正常", "2": "表慢", "3": "表快", "4": "死表"};


//仓库Helper
var depositoryHelper = RefHelper.create({
    ref_url: "gasmtrdepository",
    ref_col: 'depositoryId',
    ref_display: 'depositoryName'
});
//厂家
var factoryHelper = RefHelper.create({
    ref_url: 'gasmtrfactory',
    ref_col: 'factoryId',
    ref_display: 'factoryName'
});
//规格型号
var meterSpecIdHelper = RefHelper.create({
    ref_url: 'gasmtrmeterspec',
    ref_col: 'meterModelId',
    ref_display: 'meterModelName'
});
//表具类型
var meterTypeIdHelper = RefHelper.create({
    ref_url: 'gasmtrmetertype',
    ref_col: 'meterTypeId',
    ref_display: 'meterTypeName',
    "sort": 'meterTypeCode'
});
//物品种类
var resKindIdHelper = RefHelper.create({
    ref_url: "gasmtrreskind",
    ref_col: "reskindId",
    ref_display: "reskindName",
    "sort": "reskindCode"
});
//额定流量
var meterFlowHelper = RefHelper.create({
    ref_url: 'gasmtrmeterflow',
    ref_col: "meterFlowId",
    ref_display: "ratingFlux",
});
//流量范围
var meterFlowRangeHelper = RefHelper.create({
    ref_url: 'gasmtrmeterflow',
    ref_col: "meterFlowId",
    ref_display: "flowName"
});
//Format
//厂家
var depositoryFormat = function () {
    return {
        f: function (val) {
            return depositoryHelper.getDisplay(val);
        }
    }
}();
//厂家
var factoryFormat = function () {
    return {
        f: function (val) {
            return factoryHelper.getDisplay(val);
        }
    }
}();
// var dateFormat = function (val) {
//     if (val) {
//         var date = val.substring(0, 10);
//         return date;
//     }
// };
//规格型号
var meterSpecIdFormat = function () {
    return {
        f: function (val) {
            return meterSpecIdHelper.getDisplay(val);
        }
    }
}();
//表具类型
var meterTypeIdFormat = function () {
    return {
        f: function (val) {
            return meterTypeIdHelper.getDisplay(val);
        }
    }
}();
//物品种类
var resKindIdFormat = function () {
    return {
        f: function (val) {
            return resKindIdHelper.getDisplay(val);
        }
    }
}();
//额定流量
var meterFlowRange = function () {
    return {
        f: function (val) {
            return meterFlowHelper.getDisplay(val);
        }
    }
}();
//流量范围
var meterFlowRangeFormat = function () {
    return {
        f: function (val) {
            return meterFlowRangeHelper.getDisplay(val);
        }
    }
}();
ComponentsPickers.init();
var gasTypeHelper1 = RefHelper.create({
    ref_url: 'gasbizgastype',
    ref_col: "gasTypeId",
    ref_display: "gasTypeName",
});
var gasTypeFormat = function () {
    return {
        f: function (val) {
            return gasTypeHelper1.getDisplay(val);
        }
    }
}();
//供气区域级联
$('#find_unit').on('change', function (e) {
    console.log("change area:" + e + "." + $('#find_unit').val());
    GasModSys.counterUsersInArea({
        "areaId": $('#find_unit').val(),
        "cb": function (data) {
            var inhtml = "<option value=''>全部</option>";
            $.each(data, function (idx, row) {
                inhtml += '<option value="' + row.userId + '">' + row.employeeName + '</option>';
            });
            $("#find_countPer").html(inhtml);
            $("#find_countPer").val("").change();

        }
    })
});
$('#find_countPer').on('change', function (e) {
    console.log("change counter:" + e + "." + $('#find_countPer').val());
    $("#find_servicePer").html("");
    $("#find_servicePer").html("<option value=''>全部</option>");
    GasModSys.copyUsersInArea({
        "areaId": $('#find_unit').val(),
        "countperId": $('#find_countPer').val(),
        "cb": function (data) {
            var inhtml = "<option value=''>全部</option>";
            $.each(data, function (idx, row) {
                inhtml += '<option value="' + row.userId + '">' + row.employeeName + '</option>';
            })
            $("#find_servicePer").html(inhtml);
            $("#find_servicePer").val("").change();

        }
    })
});

// 用气性质级联
var gasTypeHelper = RefHelper.create({
    ref_url: "gasbizgastype/?query={\"parentTypeId\":\"1\"}",
    ref_col: "gasTypeId",
    ref_display: "gasTypeName",
});
$.map(gasTypeHelper.getData(), function (value, key) {
    console.log(key)
    $('#find_gasTypeId').append('<option value="' + key + '">' + value + '</option>');
});
$("#find_gasTypeId").on("change", function () {
    console.log($(this).val())
    $('#find_gasTypeId1').html('<option value="">请选择</option>').trigger("change")
    var gasType1Helper = RefHelper.create({
        ref_url: 'gasbizgastype/?query={"parentTypeId":"' + $(this).val() + '"}',
        ref_col: "gasTypeId",
        ref_display: "gasTypeName",
    });
    $.map(gasType1Helper.getData(), function (value, key) {
        console.log(key)
        $('#find_gasTypeId1').append('<option value="' + key + '">' + value + '</option>');
    });
});
$("#find_gasTypeId1").on("change", function () {
    console.log($(this).val())
    $('#find_gasTypeId2').html('<option value="">请选择</option>').trigger("change")
    var gasType1Helper = RefHelper.create({
        ref_url: 'gasbizgastype/?query={"parentTypeId":"' + $(this).val() + '"}',
        ref_col: "gasTypeId",
        ref_display: "gasTypeName",
    });
    $.map(gasType1Helper.getData(), function (value, key) {
        console.log(key)
        $('#find_gasTypeId2').append('<option value="' + key + '">' + value + '</option>');
    });
});
var changeMeterAction = function () {
    var AreaHelper = RefHelper.create({
        ref_url: 'gasbizarea',
        ref_col: 'areaId',
        ref_display: 'areaName'
    });
    var AreaFormat = function () {
        return {
            f: function (val) {
                return AreaHelper.getDisplay(val);
            }
        }
    }();
    var detailedInfoFormat = function () {
        return {
            f: function (val, row) {
                return "<a  data-target='#meterInfoHigh' id='meterInfo'  data-toggle='modal' data-kind='" + JSON.stringify(row) + "'>" + '详情' + "</a>";

            }
        }
    }();
    return {
        init: function () {
            this.reload();
        },
        reload: function () {
            $('#divtable').html('');
            var bd = {
                "cols": "customer_code,a.area_id,customer_name,customer_address,gas_type_id,up_meter_no,down_meter_no,finish_time,b.created_time,complete_date,change_meter_reason,m1.meter_kind upmeter,m2.meter_kind downmeter",
                "froms": "gas_csr_work_bill_result r left join (select work_bill_id,created_time,complete_date from gas_csr_work_bill where bill_state='4' and bill_type in('WB_CHANGEM','B_CHANGEM'))b on r.work_bill_id=b.work_bill_id  left join gas_ctm_archive a on r.ctm_archive_id=a.ctm_archive_id left join gas_mtr_meter m1 on r.up_meter_no=m1.meter_no left join  gas_mtr_meter m2 on r.down_meter_no=m2.meter_no",
                "wheres": "a.area_id in(" + areas + ")",
                "page": true,
                "limit": 50
            };
            xw = XWATable.init(
                {
                    //----------------table的选项-------
                    pageSize: 10, 			//Initial pagesize
                    columnPicker: true,         //Show the columnPicker button
                    sorting: false,
                    transition: 'fade',  //(bounce, fade, flip, rotate, scroll, slide).
                    checkboxes: false,           //Make rows checkable. (Note. You need a column with the 'unique' property)
                    checkAllToggle: false,        //Show the check-all toggle//+RQLBuilder.like("KEYY", "a").rql()
                    rowClicked: function (data) {
                        console.log('row clicked');   //data.event holds the original jQuery event.
                        console.log(data);            //data.row holds the underlying row you supplied.
                    },
                    //----------------基本restful地址---
                    // restbase: "gasmrdowe/queryByCondi?areaId=" + $('#findArea').val() + "&accountPerson=" + $('#accountPerson').val() + "&meterReadingPerson=" + $('#meterReadingPerson').val() + "&meterReadingCode=" + $('#meterReadingCode').val()
                    // + "&customerCode=" + $('#customerCode').val() + "&customerName=" + $('#customerName').val(),
                    // restbase:  "gasmrdowe/queryByCondi?areaId="+$('#findArea').val()+select,
                    //---------------行定义
                    restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
                    coldefs: [
                        // {
                        //     col: "ctmArchiveId",
                        //     //format: archiveIdFormat,
                        //     sorting: false,
                        //     unique: true,
                        //     hidden: true,
                        //     readonly: "readonly",
                        //     nonedit: "nosend",
                        //     index: 1
                        // },
                        {
                            col: "areaId",
                            friendly: "供气区域",
                            format: AreaFormat,
                            readonly: "readonly",
                            index: 2
                        },
                        {
                            col: "customerCode",
                            friendly: "客户编号",
                            readonly: "readonly",
                            index: 3
                        },
                        {
                            col: "customerName",
                            friendly: "客户名称",
                            readonly: "readonly",
                            index: 4
                        },
                        {
                            col: "gasTypeId",
                            friendly: "用气性质",
                            readonly: "readonly",
                            format: gasTypeFormat,
                            sorting: false,
                            index: 5
                        },
                        {
                            col: "customerAddress",
                            friendly: "客户地址",
                            readonly: "readonly",
                            sorting: false,
                            index: 6
                        },
                        {
                            col: "upMeterNo",
                            friendly: "上线表编号",
                            readonly: "readonly",
                            sorting: false,
                            index: 7
                        },
                        {
                            col: "downMeterNo",
                            friendly: "下线表编号",
                            readonly: "readonly",
                            sorting: false,
                            index: 8
                        },
                        {
                            col: "createdTime",
                            friendly: "业务受理时间",
                            format: dateFormat,
                            readonly: "readonly",
                            sorting: false,
                            index: 9
                        },
                        {
                            col: "completeDate",
                            friendly: "完成时间",
                            format: dateFormat,
                            readonly: "readonly",
                            sorting: false,
                            index: 10
                        },
                        {
                            col: "changeMeterReason",
                            friendly: "换表原因",
                            format: GasModCsr.changeMeterFormat,
                            readonly: "readonly",
                            sorting: false,
                            index: 10
                        },
                        // {
                        //     col: "modifiedTime",
                        //     friendly: "截止日期",
                        //     format: dateFormat,
                        //     readonly: "readonly",
                        //     index: 9
                        // },
                        // {
                        //     col: "meterReading",
                        //     friendly: "燃气表读数",
                        //     readonly: "readonly",
                        //     index: 10
                        // },
                        // {
                        //     col: "reviseReading",
                        //     friendly: "修正表读数",
                        //     readonly: "readonly",
                        //     index: 11
                        // },
                        // //
                        // // {
                        // //     col:"customerkind",
                        // //     friendly: "用户类型",
                        // //     readonly: "readonly",
                        // //     index:9
                        // // },
                        // {
                        //     col: "balance",
                        //     friendly: "余额",
                        //     readonly: "readonly",
                        //     index: 12
                        // },
                        // // {
                        // //     col: "tominusFee",
                        // //     friendly: "欠费金额",
                        // //     readonly: "readonly",
                        // //     index: 11
                        // // },
                        {
                            col: "workBillId",
                            friendly: "操作",
                            format: detailedInfoFormat,
                            hidden: false,
                            sorting: true,
                            index: 25
                        }

                    ],
                    findFilter: function () {
                        var whereinfo = '1=1';
                        if ($('#find_unit').val()) {
                            whereinfo += " and a.area_id='" + $('#find_unit').val() + "'";
                        }
                        if ($('#find_customerCode').val()) {
                            whereinfo += " and customer_code='" + $('#find_customerCode').val() + "'";
                        }
                        if ($('#find_customerName').val()) {
                            whereinfo += " and customer_name='" + $('#find_customerName').val() + "'";
                        }
                        if ($('#changeMeterReason').val()) {
                            whereinfo += " and change_meter_reason='" + $('#changeMeterReason').val() + "'";
                        }
                        if ($('#up_meterKind').val()) {
                            whereinfo += " and m1.meter_kind='" + $('#up_meterKind').val() + "'";
                        }
                        if ($('#down_meterKind').val()) {
                            whereinfo += " and m2.meter_kind='" + $('#down_meterKind').val() + "'";
                        }
                        if ($('#find_gasTypeId').val() && !$('#find_gasTypeId1').val() && !$('#find_gasTypeId2').val()) {
                            whereinfo += " and gas_type_id  like '" + $('#find_gasTypeId').val() + "%'";
                        } else if ($('#find_gasTypeId').val() && $('#find_gasTypeId1').val() && !$('#find_gasTypeId2').val()) {
                            whereinfo += " and gas_type_id like '" + $('#find_gasTypeId1').val() + "%'";
                        } else if ($('#find_gasTypeId').val() && $('#find_gasTypeId1').val() && $('#find_gasTypeId2').val()) {
                            whereinfo += " and gas_type_id = '" + $('#find_gasTypeId2').val() + "'";
                        }
                        if ($("#find_start_date").val() && $("#find_end_date").val()) {
                            whereinfo += " and to_char(b.created_time,'yyyy-mm-dd')  between '" + $('#find_start_date').val() + "' and '" + $("#find_end_date").val() + "'";
                        } else if ($("#find_start_date").val() && !$("#find_end_date").val()) {
                            bootbox.alert("请输入截止日期")
                        } else if (!$("#find_start_date").val() && $("#find_end_date").val()) {
                            bootbox.alert("请输入起始日期")
                        }
                        if ($("#find_start_date1").val() && $("#find_end_date1").val()) {
                            whereinfo += " and to_char(complete_date,'yyyy-mm-dd')  between '" + $('#find_start_date1').val() + "' and '" + $("#find_end_date1").val() + "'";
                        } else if ($("#find_start_date1").val() && !$("#find_end_date1").val()) {
                            bootbox.alert("请输入截止日期")
                        } else if (!$("#find_start_date1").val() && $("#find_end_date1").val()) {
                            bootbox.alert("请输入起始日期")
                        }
                        var bd = {
                            "cols": "customer_code,a.area_id,customer_name,customer_address,gas_type_id,up_meter_no,down_meter_no,finish_time,b.created_time,complete_date,change_meter_reason,m1.meter_kind upmeter,m2.meter_kind downmeter",
                            "froms": "gas_csr_work_bill_result r left join (select work_bill_id,created_time,complete_date from gas_csr_work_bill where bill_state='4' and bill_type in('WB_CHANGEM','B_CHANGEM'))b on r.work_bill_id=b.work_bill_id  left join gas_ctm_archive a on r.ctm_archive_id=a.ctm_archive_id left join gas_mtr_meter m1 on r.up_meter_no=m1.meter_no left join  gas_mtr_meter m2 on r.down_meter_no=m2.meter_no",
                            "wheres": whereinfo + "and a.area_id in(" + areas + ")",
                            "page": true,
                            "limit": 50
                        };
                        console.log(bd);
                        xw.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)));
                    }
                }
            );


        }

    }
}();
var upMeterId;
var downMeterId;
$(document).on('click', "#meterInfo", function () {
    $('#meterDetail').html("");
    $('#meterDetail1').html("");
    var row = JSON.parse($(this).attr("data-kind"));
    console.log(row)
    upMeterId = row.upMeterNo;
    downMeterId = row.downMeterNo;
    console.log("meterNo" + downMeterId);
    var bd = {
        "cols": "m.*,up_meter_reading",
        "froms": "gas_mtr_meter m,gas_csr_work_bill_result r",
        "wheres": "m.meter_no=r.up_meter_no and meter_no='" + upMeterId + "'",
        "page": false
    };
    $.ajax({
        type: 'get',
        url: '/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd&bd=' + JSON.stringify(bd),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (data) {
            var json = eval(data);
            console.log(json);
            if (json.rows) {
                var upMeterReading = json.rows[0].upMeterReading;
                var meterStatus = json.rows[0].meterStatus;
                var direction = Direction[json.rows[0].direction];
                var meterDigit = json.rows[0].meterDigit;
                var productionDate = (json.rows[0].productionDate);
                var flow = json.rows[0].flow;
                if (productionDate) {
                    productionDate = productionDate.substring(0, 10);
                }
                var isBack
                if(json.rows[0].isBackup==1){
                    isBack="否";
                }else if(json.rows[0].isBackup==2){
                    isBack="是";
                }
                $('#meterDetail').append('<tr>' +
                    '<td>' + json.rows[0].meterNo + '</td>' +
                    '<td>' + meterTypeIdHelper.getDisplay(json.rows[0].meterTypeId) + '</td>' +
                    '<td>' + factoryHelper.getDisplay(json.rows[0].factoryId) + '</td>' +
                    '<td>' + meterSpecIdHelper.getDisplay(json.rows[0].meterModelId) + '</td>' +
                    '<td>' + (productionDate ? productionDate : "") + '</td>' +
                    '<td>' + (meterStatus ? meterStatus : "") + '</td>' +
                    '<td>' + (flow ? flow : "") + '</td>' +
                    '<td>' + (meterDigit ? meterDigit : "") + '</td>' +
                    '<td>' + (upMeterReading ? upMeterReading : "") + '</td>' +
                    '<td>' + (direction ? direction : "") + '</td>' +
                    '<td>' + (isBack ? isBack : "") + '</td>' +
                    '</tr>'
                );


            }
        }
    });
    var bd1 = {
        "cols": "m.*,down_meter_reading",
        "froms": "gas_mtr_meter m,gas_csr_work_bill_result r",
        "wheres": "m.meter_no=r.down_meter_no and meter_no='" + downMeterId + "'",
        "page": false
    };
    $.ajax({
        type: 'get',
        url: '/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd&bd=' + JSON.stringify(bd1),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (data) {
            var json = eval(data);
            console.log("down" + json);
            if (json.rows) {
                var downMeterReading = json.rows[0].downMeterReading;
                var meterStatus = json.rows[0].meterStatus;
                var direction = Direction[json.rows[0].direction];
                var meterDigit = json.rows[0].meterDigit;
                var productionDate = (json.rows[0].productionDate);
                var flow = json.rows[0].flow;
                if (productionDate) {
                    productionDate = productionDate.substring(0, 10);
                }
                var isBack
                if(json.rows[0].isBackup==1){
                    isBack="否";
                }else if(json.rows[0].isBackup==2){
                    isBack="是";
                }
                $('#meterDetail1').append('<tr>' +
                    '<td>' + json.rows[0].meterNo + '</td>' +
                    '<td>' + meterTypeIdHelper.getDisplay(json.rows[0].meterTypeId) + '</td>' +
                    '<td>' + factoryHelper.getDisplay(json.rows[0].factoryId) + '</td>' +
                    '<td>' + meterSpecIdHelper.getDisplay(json.rows[0].meterModelId) + '</td>' +
                    '<td>' + (productionDate ? productionDate : "") + '</td>' +
                    '<td>' + (meterStatus ? meterStatus : "") + '</td>' +
                    '<td>' + (flow ? flow : "") + '</td>' +
                    '<td>' + (meterDigit ? meterDigit : "") + '</td>' +
                    '<td>' + (downMeterReading ? downMeterReading : "") + '</td>' +
                    '<td>' + (direction ? direction : "") + '</td>' +
                    '<td>' + (isBack ? isBack : "") + '</td>' +
                    '</tr>'
                );

            }
        }
    });

});
var global_remap = {
    "areaId": "db@gas_biz_area,areaId,areaName",
    "gasTypeId": "db@gas_biz_gas_type,gasTypeId,gasTypeName",
    "changeMeterReason": "0: 故障,1:维修, 2: 检表,3: 改造,4: 慢表,5: 表堵,6: 漏气,7: 变向,8: 变容,9: 改型,10: 死表,11: 快表,12: 窃气,13: A级表,14: 超期表,15: 开栓换表,16: 其他"
};


