/**
 * Created by alex on 2017/6/8.
 */
ComponentsPickers.init();
var xw;
var userInfo = JSON.parse(localStorage.getItem('user_info'));
var area_id = userInfo.area_id;
var user_id = userInfo.userId;
var areas = new Array();
areas.push(area_id);
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
//供电方式
$.ajax({
    type: 'get',
    url: hzq_rest + 'gassysdict/?query={"code":"gdfs"}',
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    async: false,
    success: function (data) {
        var dictId = [];
        for (var i = 0; i < data.length; i++) {
            dictId.push(data[i].dictId);
        }
        var powerTypeHelper = RefHelper.create({
            ref_url: 'gassysdict/?query={"parentDictId":"' + dictId + '"}',
            ref_col: "code",
            ref_display: "name",
        });
        $.map(powerTypeHelper.getData(), function (value, key) {
            $('select[name="powerType"]').append('<option value="' + key + '">' + value + '</option>');
        });
    }
});
//信控模式
$.ajax({
    type: 'get',
    url: hzq_rest + 'gassysdict/?query={"code":"xkms"}',
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    async: false,
    success: function (data) {
        var dictId = [];
        for (var i = 0; i < data.length; i++) {
            dictId.push(data[i].dictId);
        }
        var controlTypeHelper = RefHelper.create({
            ref_url: 'gassysdict/?query={"parentDictId":"' + dictId + '"}',
            ref_col: "code",
            ref_display: "name"
        });
        $.map(controlTypeHelper.getData(), function (value, key) {
            $('select[name="controlType"]').append('<option value="' + key + '">' + value + '</option>');
        });
    }
});
//显示方式
$.ajax({
    type: 'get',
    url: hzq_rest + 'gassysdict/?query={"code":"xsfs"}',
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    async: false,
    success: function (data) {
        var dictId = [];
        for (var i = 0; i < data.length; i++) {
            dictId.push(data[i].dictId);
        }
        var displayTypeHelper = RefHelper.create({
            ref_url: 'gassysdict/?query={"parentDictId":"' + dictId + '"}',
            ref_col: "code",
            ref_display: "name"
        });
        $.map(displayTypeHelper.getData(), function (value, key) {
            $('select[name="displayType"]').append('<option value="' + key + '">' + value + '</option>');
        });
    }
});
//表体材质
$.ajax({
    type: 'get',
    url: hzq_rest + 'gassysdict/?query={"code":"btcz"}',
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    async: false,
    success: function (data) {
        var dictId = [];
        for (var i = 0; i < data.length; i++) {
            dictId.push(data[i].dictId);
        }
        var meterMaterialHelper = RefHelper.create({
            ref_url: 'gassysdict/?query={"parentDictId":"' + dictId + '"}',
            ref_col: "code",
            ref_display: "name"
        });
        $.map(meterMaterialHelper.getData(), function (value, key) {
            $('select[name="meterMaterial"]').append('<option value="' + key + '">' + value + '</option>');
        });
    }
});
//阀门情况
$.ajax({
    type: 'get',
    url: hzq_rest + 'gassysdict/?query={"code":"fmqk"}',
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    async: false,
    success: function (data) {
        var dictId = [];
        for (var i = 0; i < data.length; i++) {
            dictId.push(data[i].dictId);
        }
        var valveInfoHelper = RefHelper.create({
            ref_url: 'gassysdict/?query={"parentDictId":"' + dictId + '"}',
            ref_col: "code",
            ref_display: "name"
        });
        $.map(valveInfoHelper.getData(), function (value, key) {
            $('select[name="valveInfo"]').append('<option value="' + key + '">' + value + '</option>');
        });
    }
});
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
var param = {
    "cols": "depository_id,depository_name",
    "froms": "gas_mtr_depository",
    "wheres": "func_level='1' and area_id in (" + areas + ") order by pos_code",
    "page": false
};
$.ajax({
    type: 'get',
    url: '/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd&bd=' + JSON.stringify(param),
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    async: false,
    success: function (data) {
        console.log(data);
        var obj = $('select[name="depositoryId"]');
        var sHtmlTest = "";
        for (var o in data.rows) {
            var listText = data.rows[o].depositoryName;
            var listValue = data.rows[o].depositoryId;
            sHtmlTest += "<option value='" + listValue + "'>" + listText + "</option>";
        }
        obj.append(sHtmlTest);
    }
});
//厂家级联
var factory;
var model;
$('select[name="factoryId"]').on("click", function () {
    $('select[name="meterModelId"]').html('<option value="" selected>全部</option>').trigger("change");
    factory = $(this).val();
    $.ajax({
        type: 'get',
        url: hzq_rest + 'gasmtrmeterfactoryspec/?query={"factoryId":' + $(this).val() + '}',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (data) {
            console.log(data)
            var meterModel = [];
            for (var i = 0; i < data.length; i++) {
                meterModel.push(data[i].meterModelId);
            }
            console.log(meterModel)
            var meterSpecHelper = RefHelper.create({
                ref_url: 'gasmtrmeterspec?query={"meterModelId":{"$in":' + JSON.stringify(meterModel) + '}}',
                ref_col: "meterModelId",
                ref_display: "meterModelName",
            });
            console.log(meterSpecHelper.getData())
            $.map(meterSpecHelper.getData(), function (value, key) {
                $('select[name="meterModelId"]').append('<option value="' + key + '">' + value + '</option>');
            });
        }
    });
});
$('select[name="meterModelId"]').on("click", function () {
    $('select[name="flowRange"]').html('<option value="">全部</option>').trigger("change");
    model = $(this).val();
    var selectQuery = RQLBuilder.and([
        RQLBuilder.equal("factoryId", factory),
        RQLBuilder.equal("meterModelId", model)
    ]).rql();
    $.ajax({
        type: 'get',
        url: hzq_rest + 'gasmtrmeterfactoryspec/?query=' + selectQuery,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (data) {
            if (data[0]) {
                var meterFlowId = data[0].meterFlowId;
                var meterFlow = Restful.findNQ(hzq_rest + 'gasmtrmeterflow?query={"meterFlowId":"' + meterFlowId + '"}');
                console.log(meterFlow[0].flowCode);
                $('select[name="flowRange"]').val(meterFlow[0].flowName);
                $('select[name="flowRange"]').html('<option value="">全部</option>' +
                    '<option value="' + meterFlowId + '">' + meterFlow[0].flowName + '</option>')
            }
        }
    });
});
$('select[name="flowRange"]').on("change", function () {
    $.ajax({
        type: 'get',
        url: hzq_rest + 'gasmtrmeterflow/?query={"meterFlowId":' + $(this).val() + '}',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (data) {
            console.log(data.ratingFlux);
            for (var i = 0; i < data.length; i++) {
                $('#flow').val(data[i].ratingFlux);
            }

        }
    });
});

//表具类型物品种类
$('select[name="meterTypeId"]').on("click", function () {
    $('select[name="reskindId"]').html('<option value="" selected>全部</option>').trigger("change");
    $.ajax({
        type: 'get',
        url: hzq_rest + 'gasmtrmetertypereskind/?query={"meterTypeId":' + $(this).val() + '}',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (data) {
            if (data[0]) {
                var reskindId = [];
                for (var i = 0; i < data.length; i++) {
                    reskindId.push(data[i].reskindId);
                }
                if (reskindId.length > 1) {
                    var reskindHelper = RefHelper.create({
                        ref_url: 'gasmtrreskind/' + reskindId,
                        ref_col: "reskindId",
                        ref_display: "reskindName",
                    });
                    $.map(reskindHelper.getData(), function (value, key) {
                        $('select[name="reskindId"]').append('<option value="' + key + '">' + value + '</option>');
                    });
                } else {
                    $.ajax({
                        type: 'get',
                        url: hzq_rest + 'gasmtrreskind/?query={"reskindId":' + reskindId + '}',
                        dataType: 'json',
                        contentType: "application/json; charset=utf-8",
                        async: false,
                        success: function (data) {
                            $('select[name="reskindId"]').append('<option value="' + data[0].reskindId + '">' + data[0].reskindName + '</option>');
                        }
                    });
                }
            }
        }
    });
});
$('#input_one').click(function () {
    if ($('#depositoryName').val()) {
        var depository_id = $('#depositoryName').val();
        window.location.href = "customer/dm/meter_input.html?" + depository_id;
    } else {
        bootbox.alert("<br><center><h4>请先选择一个入库仓库！</h4></center><br>");
    }
});
// $('#factoryId').on("change", function () {
//     $('#meterModelId').html('<option value="">全部</option>');
//     var meterSpecHelper = RefHelper.create({
//         ref_url: 'gasmtrmeterspec/?query={"factoryId":"' + $(this).val() + '"}',
//         ref_col: "meterModelId",
//         ref_display: "meterModelName",
//     });
//     $.map(meterSpecHelper.getData(), function (value, key) {
//         $('#meterModelId').append('<option value="' + key + '">' + value + '</option>');
//     });
// });
$('#input_many_modal').on('show.bs.modal', function (e) {
    // $.map(factoryHelper.getData(), function (value, key) {
    //     $('#factoryId1').append('<option value="' + key + '">' + value + '</option>');
    // });
    // $.map(meterTypeIdHelper.getData(), function (value, key) {
    //     $('#meterTypeId1').append('<option value="' + key + '">' + value + '</option>');
    // });
    // $.map(meterSpecIdHelper.getData(), function (value, key) {
    //     $('#meterModelId1').append('<option value="' + key + '">' + value + '</option>');
    // });
});
var depository1SelectAction = function () {
    var depositoryFormat = function () {
        return {
            f: function (val) {
                return depositoryHelper.getDisplay(val);
            }
        }
    }();
    var detailedInfoFormat = function () {
        return {
            f: function (val, row) {
                return "<a  data-target='#updatemeter' id='update_meter' data-toggle='modal' data-kind='" + JSON.stringify(row) + "'>" + '修改' + "</a>";

            }
        }
    }();
    return {
        init: function () {
            this.initHelper();
            this.reload();
        },
        initHelper: function () {
            $.map(factoryHelper.getData(), function (value, key) {
                $('select[name="factoryId"]').append('<option value="' + key + '">' + value + '</option>');
            });
            $.each(meterTypeIdHelper.getRawData(), function (index, row) {
                $('select[name="meterTypeId"]').append('<option value="' + row.meterTypeId + '">' + row.meterTypeName + '</option>');
            });
            $.each(resKindIdHelper.getRawData(), function (index, row) {
                $('select[name="reskindId"]').append('<option value="' + row.reskindId + '">' + row.reskindName + '</option>');
            });
            $.map(meterFlowRangeHelper.getData(), function (value, key) {
                $('select[name="flowRange"]').append('<option value="' + key + '">' + value + '</option>');
            });
            $.map(meterSpecIdHelper.getData(), function (value, key) {
                $('select[name="meterModelId"]').append('<option value="' + key + '">' + value + '</option>');
            });
        },
        reload: function () {
            $('#divtable').html('');
            var bd = {
                "cols": "*",
                "froms": "gas_mtr_meter",
                "wheres": "depository_id in (select depository_id from gas_mtr_depository where func_level='1' and area_id in(" + areas + "))",
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
                    checkboxes: false,
                    checkAllToggle: true,
                    //----------------基本restful地址---
                    restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
                    key_column: 'meterId',
                    coldefs: [
                        {
                            col: "depositoryId",
                            friendly: "仓库名称",
                            format: depositoryFormat,
                            sorting: false,
                            index: 1
                        },
                        {
                            col: "meterNo",
                            friendly: "表编号",
                            sorting: true,
                            index: 2
                        },
                        {
                            col: "meterTypeId",
                            friendly: "表具类型",
                            format: meterTypeIdFormat,
                            sorting: true,
                            index: 3
                        },
                        {
                            col: "factoryId",
                            friendly: "厂家",
                            format: factoryFormat,
                            sorting: true,
                            index: 4
                        },
                        {
                            col: "meterModelId",
                            friendly: "表具规格型号",
                            format: meterSpecIdFormat,
                            sorting: true,
                            index: 5
                        },
                        // {
                        //     col: "meterModelId",
                        //     friendly: "额定流量",
                        //     format: meterspecIdFormat,
                        //     sorting: true,
                        //     index: 7
                        // },
                        {
                            col: "productionDate",
                            friendly: "生产日期",
                            format: dateFormat,
                            sorting: true,
                            index: 6
                        },
                        {
                            col: "meterStatus",
                            friendly: "表具状态",
                            format: GasSysBasic.meterStatus,
                            sorting: true,
                            index: 7
                        },
                        {
                            col: "flow",
                            friendly: "额定流量",
                            format: meterFlowRange,
                            sorting: true,
                            index: 8
                        },
                        {
                            col: "meterDigit",
                            friendly: "表位数",
                            sorting: true,
                            index: 9
                        },
                        {
                            col: "reading",
                            friendly: "表读数",
                            sorting: true,
                            index: 10
                        },
                        {
                            col: "onlineDate",
                            friendly: "上线日期",
                            format: dateFormat,
                            sorting: true,
                            index: 11
                        },
                        {
                            col: "direction",
                            friendly: "进气方向",
                            format: GasModCtm.meterDirectionFormat,
                            sorting: true,
                            index: 12
                        },
                        {
                            col: "meterMaterial",
                            friendly: "表体材质",
                            format: GasModCtm.meterMaterialFormat,
                            sorting: true,
                            hidden: true,
                            index: 13
                        },
                        {
                            col: "baseMeterVender",
                            friendly: "基表供应商",
                            format: GasModCtm.baseMeterVenderFormat,
                            sorting: true,
                            hidden: true,
                            index: 14
                        },
                        {
                            col: "displayType",
                            friendly: "显示方式",
                            format: GasModCtm.displayTypeFormat,
                            sorting: true,
                            hidden: true,
                            index: 15
                        },
                        {
                            col: "controlType",
                            friendly: "信控模式",
                            format: GasModCtm.controlTypeFormat,
                            sorting: true,
                            hidden: true,
                            index: 16
                        },
                        {
                            col: "chipType",
                            friendly: "芯片类型",
                            format: GasModCtm.chipTypeFormat,
                            hidden: true,
                            sorting: true,
                            index: 17
                        },
                        {
                            col: "valveInfo",
                            friendly: "阀门情况",
                            format: GasModCtm.valveInfoFormat,
                            sorting: true,
                            hidden: true,
                            index: 18
                        },
                        {
                            col: "powerType",
                            friendly: "供电方式",
                            format: GasModCtm.powerTypeFormat,
                            sorting: true,
                            hidden: true,
                            index: 19
                        },
                        {
                            col: "reskindId",
                            friendly: "物品种类",
                            format: resKindIdFormat,
                            sorting: true,
                            hidden: true,
                            index: 20
                        },
                        {
                            col: "meterKind",
                            friendly: "表具种类",
                            format: GasModCtm.meterKindFormat,
                            hidden: true,
                            index: 21
                        },
                        {
                            col: "stockState",
                            friendly: "库存状态",
                            format: GasModCtm.stockStateFormat,
                            sorting: true,
                            index: 22
                        },
                        {
                            col: "meterId",
                            friendly: "操作",
                            format: detailedInfoFormat,
                            hidden: false,
                            sorting: true,
                            index: 23
                        },

                    ],
                    //---------------查询时过滤条件
                    findFilter: function () {
                        var depositoryId = $('#depositoryName option:selected').val();
                        var factoryId = $('#factoryName option:selected').val();
                        var meterTypeId = $('#find_meterTypeId option:selected').val();
                        var stockState = $('#stockState option:selected').val();
                        var meterModel = $('#meterModelId option:selected').val();
                        var flowRange = $('#flowRange option:selected').val();
                        var meterStatus = $('#meterStatus option:selected').val();
                        var direction = $('#direction option:selected').val();
                        var meterMaterial = $('#meterMaterial option:selected').val();
                        var baseMeterVender = $('#baseMeterVender option:selected').val();
                        var displayType = $('#displayType option:selected').val();
                        var controlType = $('#controlType option:selected').val();
                        var chipType = $('#chipType option:selected').val();
                        var valveInfo = $('#valveInfo option:selected').val();
                        var powerType = $('#powerType option:selected').val();
                        var resKind = $('#resKind option:selected').val();
                        var whereinfo = "";
                        if (depositoryId) {
                            whereinfo += "depository_id = '" + depositoryId + "' and ";
                        }
                        if (factoryId) {
                            whereinfo += "factory_id = '" + factoryId + "' and ";
                        }
                        if (meterTypeId) {
                            whereinfo += "meter_type_id = '" + meterTypeId + "' and ";
                        }
                        if (stockState) {
                            whereinfo += "stock_state = '" + stockState + "' and ";
                        }
                        if (meterModel) {
                            whereinfo += "meter_model_id = '" + meterModel + "' and ";
                        }
                        if (flowRange) {
                            whereinfo += "flow_range = '" + flowRange + "' and ";
                        }
                        if (meterStatus) {
                            whereinfo += "meter_status = '" + meterStatus + "' and ";
                        }
                        if (direction) {
                            whereinfo += "direction = '" + direction + "' and ";
                        }
                        if (meterMaterial) {
                            whereinfo += "meter_material = '" + meterMaterial + "' and ";
                        }
                        if (baseMeterVender) {
                            whereinfo += "base_meter_vender = '" + baseMeterVender + "' and ";
                        }
                        if (displayType) {
                            whereinfo += "display_type = '" + displayType + "' and ";
                        }
                        if (controlType) {
                            whereinfo += "control_type = '" + controlType + "' and ";
                        }
                        if (chipType) {
                            whereinfo += "chip_type = '" + chipType + "' and ";
                        }
                        if (valveInfo) {
                            whereinfo += "valve_info = '" + valveInfo + "' and ";
                        }
                        if (powerType) {
                            whereinfo += "power_type = '" + powerType + "' and ";
                        }
                        if (resKind) {
                            whereinfo += "reskind_id = '" + resKind + "' and ";
                        }
                        if ($('#meterCode').val()) {
                            whereinfo += " meter_no='" + $('#meterCode').val() + "' and ";
                        }
                        if ($('#reading').val()) {
                            whereinfo += " meter_no='" + $('#reading').val() + "' and ";
                        }
                        if ($('#meterDigit').val()) {
                            console.log(1);
                            whereinfo += " meter_digit='" + $('#meterDigit').val() + "' and ";
                        }
                        if ($("#find_start_date").val() && $("#find_end_date").val()) {
                            whereinfo += " to_char(production_date,'yyyy-mm-dd')  between '" + $('#find_start_date').val() + "' and '" + $("#find_end_date").val() + "' and ";
                        } else if ($("#find_start_date").val() && !$("#find_end_date").val()) {
                            bootbox.alert("请输入截止日期")
                        } else if (!$("#find_start_date").val() && $("#find_end_date").val()) {
                            bootbox.alert("请输入起始日期")
                        }
                        if ($("#find_start_date1").val() && $("#find_end_date1").val()) {
                            whereinfo += " to_char(online_date,'yyyy-mm-dd')  between '" + $('#find_start_date1').val() + "' and '" + $("#find_end_date1").val() + "' and ";
                        } else if ($("#find_start_date1").val() && !$("#find_end_date1").val()) {
                            bootbox.alert("请输入截止日期")
                        } else if (!$("#find_start_date1").val() && $("#find_end_date1").val()) {
                            bootbox.alert("请输入起始日期")
                        }
                        bd = {
                            "cols": "*",
                            "froms": "gas_mtr_meter",
                            "wheres": whereinfo + "depository_id in (select depository_id from gas_mtr_depository where func_level='1' and area_id in(" + areas + "))",
                            "page": true,
                            "limit": 50
                        };
                        xw.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)));
                    },//--findFilter

                    onAdded: function (ret, jsondata) {

                    },
                    onUpdated: function (ret, jsondata) {

                    },
                    onDeleted: function (ret, jsondata) {
                    }
                }
            )
        }
    }
}();
$("#factoryId1").change(function () {
    upload();
});
$("#reskindId1").change(function () {
    upload();
});

$("#meterModelId1").change(function () {
    upload();
});

$("#meterTypeId1").change(function () {
    upload();
});
$("#meterKind").change(function () {
    upload();
});

var status = false;
var meterupload = new Array();
var haveMeterNo=new Array();
function upload() {
    if ($("#factoryId1").val() && $("#meterModelId1").val() && $("#meterTypeId1").val() && $("#depositoryId").val()&& $("#reskindId1").val()&&$("#meterKind").val()) {
        $("#addbtn").removeAttr("disabled")
    } else {
        $("#addbtn").attr("disabled", true)
    }
}
$('#input_many_modal').on('hide.bs.modal', function () {
    status = false;
    console.log("hide diag=======" + status);
    setTimeout(function () {
        $('#confirm').hide();
        $('#divtabledata_prev').html("");
        $('#startupload').show();
        $('#clear').show();
        $('#addbtn').show();
        $('#divtabledata_prev').html("");
    }, 1000)
    // $("#uploadbtn").css({display:"show"})

});
$('#fileId').on("change", function () {
    console.log("select file:" + $('#fileId').val())
    $(".preview").html($('#fileId').val())
    // $('#fileupload').find(".preview").html(""+$('#fileId').val());
});
$('#input_many_modal').on('shown.bs.modal', function () {
    console.log("show diag")
    // $("#uploadbtn").css({display:"show"})
    $('#confirm').hide();
    $('#divtabledata_prev').html("");
    $('#startupload').show();
    $('#clear').show();
    $('#addbtn').show();
    $('#fileupload').on("submit", function () {
        console.log("submit!!")
    })
})

$('#fileId').on("change", function () {
    console.log("select file:" + $('#fileId').val())
    $('#fileupload').find(".preview").html("" + $('#fileId').val());
});

//        select_mrdBookAction.init();
var uplaod_ret;
var booktable = null;

var dbcol = "meterNo,flow,flowRange,direction,meterMaterIal,controlType,chipType,powerType,meterDigit,productionDate";
var ncol = "表编号,额定流量,流量范围,进气方向,表体材质,信控模式,芯片类型,供电方式,表位数,生产年月";

var ncol_array = ncol.split(",");
var sortHeader;
var colFormat = function () {
    return {
        f: function (val, row, cell, key) {
            return JSON.parse(row.jsDatas1)[sortHeader.indexOf(key)];//.JS_DATAS1[ncol_array.indexOf(key)];
        }
    }
}();

var selectfile = function () {
    var f = $('#fileId').trigger("click")
    console.log("triger::" + JSON.stringify(f))
};

$('#clear').on('click', function () {
    $('#fileId').val("");
    $('#fileupload').find(".preview").html("");
    $('#divtabledata_prev').html("");
})


var contractFormat = function () {
    // var dbcol="meterNo,  flowRange, flow,    direction,  meterMaterIal,  controlType,  chipType,  powerType,    meterDigit,  productionDate";
    // var ncol="表编号,     流量范围,  额定流量, 进气方向,     表体材质,     信控模式,   芯片类型,  供电方式,     表位数,       生产年月";
    var direction = {"左": "L", "右": "R"};
    var controlType = {"远传阀控": "1", "远传IC卡": "2", "物联表": "3", "IC卡气量": "4", "IC卡金额": "5", "IC卡cpu": "6"};
    var displayType = {"电子": "1", "机械": "2", "电子+机械": "3"};
    var chipType = {"102卡气量卡": "1", "102卡金额卡": "2", "4442卡气量卡": "3", "4442卡金额卡": "4", "cpu卡": "5"}
    var powerType = {"干电池": "1", "锂电池": "2"};
    var baseMeterVender = {"金卡": "1", "松川": "2", "蓝宝石": "3"};
    var meterMaterIal = {"铁": "1", "铝": "2","钢":"3"};
    return {
        directionFormat: function (val) {
            return direction[val];
        },
        controlTypeFormat: function (val) {
            return controlType[val];
        },
        displayTypeFormat: function (val) {
            return displayType[val];
        },
        chipTypeFormat: function (val) {
            return chipType[val];
        },
        powerTypeFormat: function (val) {
            return powerType[val];
        },
        baseMeterVenderFormat: function (val) {
            return baseMeterVender[val];
        },
        meterMaterIalFormat: function (val) {
            return meterMaterIal[val];
        }
    }
}();

$(document).on("click", '#confirm', uploadmeter)

function uploadmeter() {
    if (status) {
        console.log("AAAAAAAAAAAAA" + "======" + status)
        console.log("AAAAAAAAAAAAA" + "======" + JSON.stringify(meterupload));
        var result = [];
        // var batchMeter=JSON.stringify(meterupload);
        var batchMeterObj;
        var batchMeterArr=[];
        var error_msg;
        for(var i=0;i<meterupload.length;i++){
            var meterId = $.md5(meterupload[i].meterNo+new Date().getTime());
            meterupload[i]["meterId"]=meterId;
            batchMeterObj="BATCH_METER_OBJ";
            batchMeterObj+="(";
            batchMeterObj+=("'"+meterupload[i].meterId+"',");
            batchMeterObj+=("'"+meterupload[i].meterNo+"',");
            batchMeterObj+=("'"+meterupload[i].depositoryId+"',");
            batchMeterObj+=("'"+meterupload[i].factoryId+"',");
            batchMeterObj+=("'"+meterupload[i].meterModelId+"',");
            batchMeterObj+=("'"+meterupload[i].meterTypeId+"',");
            batchMeterObj+=("'"+meterupload[i].reskindId+"',");
            batchMeterObj+=("'"+meterupload[i].meterKind+"',");
            batchMeterObj+=("'"+meterupload[i].flow+"',");
            batchMeterObj+=("'"+meterupload[i].flowRange+"',");
            batchMeterObj+=("'"+meterupload[i].direction+"',");
            batchMeterObj+=("'"+meterupload[i].meterMaterial+"',");
            batchMeterObj+=("'"+meterupload[i].controlType+"',");
            batchMeterObj+=("'"+meterupload[i].chipType+"',");
            batchMeterObj+=("'"+meterupload[i].powerType+"',");
            batchMeterObj+=("'"+meterupload[i].meterDigit+"',");
            batchMeterObj+=("'"+meterupload[i].productionDate+"',");
            batchMeterObj+=("'"+meterupload[i].stockState+"'");
            batchMeterObj+=")";
            console.log(batchMeterObj);
            batchMeterArr.push(batchMeterObj);
            if(batchMeterArr.join().length>30000){
                console.log("字符串长度过长：")
                console.log(batchMeterArr.join().length)
                var param={
                    "pro_name":"P_BATCH_METER",
                    "pro_prop":"BATCH_METER_ARRAY("+batchMeterArr.join()+")",
                    "busi_name":"P_BATCH_METER"
                }
                var parameterRet = Restful.insert('/hzqs/sys/pbpro.do?fh=SYSPRO0000000J00&resp=bd',param);
                if(parameterRet.errCode==0){
                    if(error_msg){
                        error_msg+=(","+parameterRet.msg);
                    }else{
                        error_msg+=parameterRet.msg;
                    }
                }
                batchMeterArr=[];
            }
        }
        if(batchMeterArr.length>0){
            var param2={
                "pro_name":"P_BATCH_METER",
                "pro_prop":"BATCH_METER_ARRAY("+batchMeterArr.join()+")",
                "busi_name":"P_BATCH_METER"
            }
            var parameterRet2 = Restful.insert('/hzqs/sys/pbpro.do?fh=SYSPRO0000000J00&resp=bd',param2);
            if(parameterRet2.errCode==0){
                if(error_msg){
                    error_msg+=(","+parameterRet2.msg);
                }else{
                    error_msg+=parameterRet2.msg;
                }
            }
        }
        console.log(error_msg);
        if(error_msg){
            bootbox.alert("表具导入完成,以下表具编号导入失败：</br>"+error_msg+haveMeterNo, function () {
                haveMeterNo.length=0;
                location.reload();

            });
        }else{
            bootbox.alert("表具导入完成,以下表具编号导入失败：</br>"+haveMeterNo, function () {
                haveMeterNo.length=0;
                location.reload();
            });
        }
        // $.each(meterupload, function (index, item) {
        //     $.ajax({
        //         type: 'POST',
        //         url: hzq_rest + "gasmtrmeter",
        //         dataType: 'json',
        //         contentType: "application/json; charset=utf-8",
        //         async: false,
        //         isMask: true,
        //         data: JSON.stringify(item),
        //         success: function (data) {
        //             console.log(data);
        //             bool = data;
        //             result.push(JSON.stringify(bool.success))
        //         },
        //         error: function (err) {
        //             bootbox.alert(err);
        //             return false;
        //         }
        //     });
        //     return;
        // });
        // console.log(result)
        // // var str = "第";
        // var a = [];
        // for (var i = 0; i < result.length; i++) {
        //     if (result[i] != "true") {
        //         a.push(i + 1);
        //     }
        // }
        // // str+="条入库失败！";
        // console.log(0)
        // if (!a.length) {
        //     bootbox.alert("入库成功！", function () {
        //         window.location.reload();
        //     })
        // } else {
        //     bootbox.alert("第" + a.join() + "条入库失败")
        // }
    }


}

$(document).on('click', '#startupload', function () {
//表具流量
    var meterFlowHelper = RefHelper.create({
        ref_url: 'gasmtrmeterflow',
        ref_col: "flowName",
        ref_display: "meterFlowId",
    });
    var form = new FormData(document.getElementById('fileupload'));
    console.log("uploading：" + form);
    $('#divtabledata_prev').html("");
    var batchId = $.md5(JSON.stringify(form) + new Date().getTime())
    $.ajax({
        url: "/hzqs/sys/imp/blkup.do?bt=bj&batchid=" + batchId,
        data: form,
        processData: false,
        contentType: false,
        async: false,
        type: 'POST',
        success: function (data) {
            console.log("ret==" + JSON.stringify(data));
            uplaod_ret = data;
            if (data.rows) {
                meterupload = [];
                bootbox.alert('<center><h4>导入成功条数为</h4><br><h2>' + data.rows.length + '</h2></center>');
                var cols = new Array();
                sortHeader = data.headers;
                console.log(sortHeader)
                $.each(ncol_array, function (id, row) {
                    if (row == "uuid") {
                        cols.push({"col": row, index: id + 1, format: colFormat, hidden: true})
                    } else {
                        cols.push({"col": row, index: id + 1, format: colFormat})
                    }
                });

                // var aa = [];
                var archiveKey = "powerType,controlType,flowRange,productionDate,chipType,meterDigit,meterMaterial,meterNo,direction,flow";
                $.each(data.rows, function (index, item) {

                    var ss = {};
                    $.each(item.values, function (key, val) {
                        if (archiveKey.split(",")[key] == "direction") {
                            ss["direction"] = contractFormat.directionFormat(val);
                        } else if (archiveKey.split(",")[key] == "controlType") {
                            ss["controlType"] = contractFormat.controlTypeFormat(val);
                        } else if (archiveKey.split(",")[key] == "meterMaterial") {
                            ss["meterMaterial"] = contractFormat.meterMaterIalFormat(val);
                        } else if (archiveKey.split(",")[key] == "chipType") {
                            ss["chipType"] = contractFormat.chipTypeFormat(val);
                        }
                        else if (archiveKey.split(",")[key] == "powerType") {
                            ss["powerType"] = contractFormat.powerTypeFormat(val);
                        }
                        else if (archiveKey.split(",")[key] == "flowRange") {
                            ss["flowRange"] = meterFlowHelper.getDisplay(val);
                        } else if (archiveKey.split(",")[key] == "flow") {
                            ss["flow"] = ss["flowRange"];
                        }
                        // else if (archiveKey.split(",")[key] == "reskindId") {
                        //     ss["reskindId"] = resKindIdHelper.getDisplay(val);
                        // }
                        else if (archiveKey.split(",")[key] == "productionDate") {
                            var str = val.substring(0, val.length - 2) + "-" + val.substring(val.length - 2, val.length);
                            // console.log(val.substring(val.length - 2, val.length))
                            // console.log(val.substring(0, val.length - 2))
                            ss["productionDate"] = new Date(str).Format("yyyyMMdd");
                        } else {
                            ss[archiveKey.split(",")[key]] = val;
                            ss["depositoryId"] = $("#depositoryId").val();
                            ss["factoryId"] = $("#factoryId1").val();
                            ss["meterModelId"] = $("#meterModelId1").val();
                            ss["meterTypeId"] = $("#meterTypeId1").val();
                            ss["reskindId"] = $("#reskindId1").val();
                            ss["meterKind"]=$("#meterKind").val();
                        }
                        if (!ss.controlType) {
                            ss.controlType = $("#controlType2").val();
                        }
                        else if (!ss.meterMaterial) {
                            ss.meterMaterial = $("#meterMaterial2").val();
                        }
                        else if (!ss.chipType) {
                            ss.chipType = $("#chipType2").val();
                        }
                        else if (!ss.powerType) {
                            ss.chipType = $("#powerType2").val();
                        }
                        ss["stockState"] = "1";
                    });
                    meterupload.push(ss);
                    SS={};
                    $('#confirm').show();
                    $('#startupload').hide();
                    $('#addbtn').hide();
                    $('#clear').hide();
                    status = true;
                });
                var meterNo = new Array();
                for (var i = 0; i < meterupload.length; i++) {
                    meterNo.push(meterupload[i].meterNo);
                }
                console.log("meterNo" + meterNo);
                Array.prototype.del = function (index) {
                    if (isNaN(index) || index >= this.length) {
                        return false;
                    }
                    for (var i = 0, n = 0; i < this.length; i++) {
                        if (this[i] != this[index]) {
                            this[n++] = this[i];
                        }
                    }
                    this.length -= 1;
                };
                var retData = Restful.findNQ(hzq_rest + 'gasmtrmeter?query={"meterNo":{"$in":' + JSON.stringify(meterNo) + '}}');

                console.log("retData"+retData);
                // for(var i=0;i<meterNo.length;i++){
                //     for(var j=0;j<meterNo.length;j++){
                //         if(meterNo[i]==meterNo[j]){
                //             haveMeterNo.push(meterNo[i]);
                //         }
                //     }
                // }
                //
                // console.log('++++++++++++++++'+haveMeterNo);
                for (var i = 0; i < retData.length; i++) {
                    for (var j = 0; j < meterupload.length; j++) {
                        if (retData[i].meterNo == meterupload[j].meterNo) {
                            haveMeterNo.push(retData[i].meterNo);
                            meterupload.del(j);
                        }
                    }
                }
                console.log("haveMeterNo"+haveMeterNo);
                console.log("meterupload"+ JSON.stringify(meterupload[0]));
                // console.log(cols);
                booktable = XWATable.init({
                    divname: "divtabledata_prev",
                    //----------------table的选项-------
                    pageSize: 10,
                    // columnPicker: true,
                    transition: 'fade',
                    tableId: "divtabledata_prev",
                    checkAllToggle: true,
                    columnPicker: true,
                    //----------------基本restful地址---
                    restbase: 'gasimpbulksdata?query={"batchId":"' + batchId + '"}',
                    //key_column: 'bookId',
                    coldefs: cols,
                    findFilter: function () {
                    },
                    onAdded: function (ret, jsondata) {
                    },

                    onUpdated: function (ret, jsondata) {
                    },
                    onDeleted: function (ret, jsondata) {
                    }
                })
            } else {
                bootbox.alert('导入失败！');
            }
        },
        error: function (data) {
            bootbox.alert("出错了～\n" + JSON.stringify(data));
            $("#fileId").val('');
        }
    });
});//end on click
var meterId;
$(document).on('click', "#update_meter", function () {
    var dateFormat = function (val) {
        if (val) {
            var date = val.substring(0, 10);
            return date;
        }
    };
    var row = JSON.parse($(this).attr("data-kind"));
    meterId = row.meterId;
    var meterMo=row.meterModelId;
    var meterFl=row.flowRange;
    $.ajax({
        url: hzq_rest + 'gasmtrmeter?query={"meterId":"' + meterId + '"}',
        type: "get",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (data) {
            console.log(data)
            if (data.length) {
                $('#form input,#form select').each(function (index) {
                    $(this).attr("name");
                    console.log(data[0].hasOwnProperty($(this).attr('name')))
                    if ($(this).attr('name') == "lesseeCerType") {
                        console.log(data[0][$(this).attr('name')])
                        var select = $(this).find('option');
                        for (var i = 0; i < select.length; i++) {
                            if (select.eq(i).val() == data[0][$(this).attr('name')] * 1) {
                                $(this).find('option').eq(i).attr("selected", "selected");
                            }
                        }
                    }
                    else if ($(this).attr('name') == "productionDate") {
                        $(this).val(dateFormat(data[0][$(this).attr('name')]))
                    }
                    else if ($(this).attr('name') == "flow") {
                        $(this).val(meterFlowHelper.getDisplay(data[0][$(this).attr('name')]))
                    }
                    else if ($(this).attr('name') == "checkDate") {
                        $(this).val(dateFormat(data[0][$(this).attr('name')]))
                    }
                    else if ($(this).attr('name') == "oilingDate") {
                        $(this).val(dateFormat(data[0][$(this).attr('name')]))
                    }
                    else if ($(this).attr('name') == "batteryDate") {
                        $(this).val(dateFormat(data[0][$(this).attr('name')]))
                    } else if ($(this).attr('name') == "lastContainersDate") {
                        $(this).val(dateFormat(data[0][$(this).attr('name')]))
                    } else {
                        $(this).val(data[0][$(this).attr('name')]).trigger("change");
                        ;
                    }
                });
            }
        }
    });
    var factory=$("#factoryName1").val();
    console.log(factory)
    if(factory){
        console.log();
        $('#meterModelId2').html('<option value="" selected>全部</option>').trigger("change");
        $.ajax({
            type: 'get',
            url: hzq_rest + 'gasmtrmeterfactoryspec/?query={"factoryId":' + factory + '}',
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            async: false,
            success: function (data) {
                var meterModel = [];
                for (var i = 0; i < data.length; i++) {
                    meterModel.push(data[i].meterModelId);
                }
                var meterSpecHelper = RefHelper.create({
                    ref_url: 'gasmtrmeterspec?query={"meterModelId":{"$in":'+JSON.stringify(meterModel)+'}}',
                    ref_col: "meterModelId",
                    ref_display: "meterModelName",
                });
                $.map(meterSpecHelper.getData(), function (value, key) {
                    $('#meterModelId2').append('<option value="' + key + '">' + value + '</option>');
                });
            }
        });
        $("#meterModelId2").find("option[value='"+meterMo+"']").attr("selected",true).trigger("change");
    }
    var meterModel=$('#meterModelId2').val();
    console.log(meterModel);
    if(meterModel){
        $('#flowRange1').html('<option value="">全部</option>').trigger("change");
        var selectQuery = RQLBuilder.and([
            RQLBuilder.equal("factoryId", factory),
            RQLBuilder.equal("meterModelId", meterModel)
        ]).rql();
        $.ajax({
            type: 'get',
            url: hzq_rest + 'gasmtrmeterfactoryspec/?query=' + selectQuery,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            async: false,
            success: function (data) {
                if(data[0]){
                    var meterFlowId = data[0].meterFlowId;
                    var meterFlow = Restful.findNQ(hzq_rest + 'gasmtrmeterflow?query={"meterFlowId":"' + meterFlowId + '"}');
                    console.log(meterFlow[0].flowCode);
                    $('#flowRange1').val(meterFlow[0].flowName);
                    $('#flowRange1').html('<option value="">全部</option>' +
                        '<option value="' + meterFlowId + '">' + meterFlow[0].flowName + '</option>')
                }
            }
        });
        $("#flowRange1").find("option[value='"+meterFl+"']").attr("selected",true).trigger("change");
    }
    var flowRan=$('#flowRange1').val();
    if(flowRan){
        $.ajax({
            type: 'get',
            url: hzq_rest + 'gasmtrmeterflow/?query={"meterFlowId":' + flowRan + '}',
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            async: false,
            success: function (data) {
                console.log(data.ratingFlux);
                for (var i = 0; i < data.length; i++) {
                    $('#flow').val(data[i].ratingFlux);
                }

            }
        });
    }
    $('#factoryName1').on("click", function () {
        factory=$(this).val();
    });
    $('#meterModelId2').on("click", function () {
        $('select[name="flowRange"]').html('<option value="">全部</option>').trigger("change");
        model = $(this).val();
        var selectQuery = RQLBuilder.and([
            RQLBuilder.equal("factoryId", factory),
            RQLBuilder.equal("meterModelId", model)
        ]).rql();
        $.ajax({
            type: 'get',
            url: hzq_rest + 'gasmtrmeterfactoryspec/?query=' + selectQuery,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            async: false,
            success: function (data) {
                if(data[0]){
                    var meterFlowId = data[0].meterFlowId;
                    var meterFlow = Restful.findNQ(hzq_rest + 'gasmtrmeterflow?query={"meterFlowId":"' + meterFlowId + '"}');
                    console.log(meterFlow[0].flowCode);
                    $('select[name="flowRange"]').val(meterFlow[0].flowName);
                    $('select[name="flowRange"]').html('<option value="">全部</option>' +
                        '<option value="' + meterFlowId + '">' + meterFlow[0].flowName + '</option>')
                }
            }
        });
    });

});
$("#save_btn").click("on", function () {
    var isBack=$('#isOrNo').val();
    if(isBack==2){
        if (!$('#factoryName1 option:selected').val()) {
            bootbox.alert("<br><center><h4>生产厂家不能为空,请重试</h4></center><br>");
            return;
        }
        if (!$('#meterModelId2 option:selected').val()) {
            bootbox.alert("<br><center><h4>规格型号不能为空,请重试</h4></center><br>");
            return;
        }
        if (!$('#resKind1 option:selected').val()) {
            bootbox.alert("<br><center><h4>物品种类不能为空,请重试</h4></center><br>");
            return;
        }
        if (!$('#meterDigit1').val()) {
            bootbox.alert("<br><center><h4>表位数不能为空,请重试</h4></center><br>");
            return;
        }
    }else {
        if (!$('#meterTypeId option:selected').val()) {
            bootbox.alert("<br><center><h4>一次表对应的表具类型不能为空,请重试</h4></center><br>");
            return;
        }
        if (!$('#resKind1 option:selected').val()) {
            bootbox.alert("<br><center><h4>物品种类不能为空,请重试</h4></center><br>");
            return;
        }
        if (!$('#factoryName1 option:selected').val()) {
            bootbox.alert("<br><center><h4>生产厂家不能为空,请重试</h4></center><br>");
            return;
        }
        if (!$('#meterModelId2 option:selected').val()) {
            bootbox.alert("<br><center><h4>规格型号不能为空,请重试</h4></center><br>");
            return;
        }
        if (!$('#flowRange1 option:selected').val()) {
            bootbox.alert("<br><center><h4>一次表对应的流量范围不能为空,请重试</h4></center><br>");
            return;
        }
        if (!$('#meterDigit1').val()) {
            bootbox.alert("<br><center><h4>表位数不能为空,请重试</h4></center><br>");
            return;
        }
        if ($('#meterKind1').val()) {
            var meterKind = $('#meterKind1').val();
            console.log(meterKind);
            if (meterKind == 02) {
                if (!$('#chipType1').val()) {
                    bootbox.alert("<br><center><h4>IC卡表对应的芯片类型不能为空,请重试</h4></center><br>");
                    return;
                }
            }
        }
        else {
            bootbox.alert("<br><center><h4>一次表对应的表具种类不能为空,请重试</h4></center><br>");
            return;
        }
    }
    var meterJson = $("form").serializeObject();
    //生产UUID
    meterJson['meterId'] = meterId;
    // for (var key in meterJson) {
    //     if (!meterJson[key]) {
    //         console.log(0)
    //         bootbox.alert("输入项不能为空！");
    //         return false;
    //     }
    // }
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: hzq_rest + "gasmtrmeter/",
        type: "PUT",
        dataType: "json",
        async: false,
        data: JSON.stringify(meterJson),
        success: function (e) {
            if (e.success == true) {
                bootbox.alert("<br><center><h4>修改成功</h4></center><br>");
                location.reload();
            }
        }
    })
});
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





