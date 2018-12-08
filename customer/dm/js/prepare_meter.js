/**
 * Created by alex on 2017/7/12.
 */
ComponentsPickers.init();
var xw;
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
    ref_display: 'meterTypeName'
});
//物品种类
var resKindIdHelper = RefHelper.create({
    ref_url: 'gasmtrreskind',
    ref_col: 'reskindId',
    ref_display: 'reskindName'
});
//流量范围
var meterFlowRangeHelper = RefHelper.create({
    ref_url: 'gasmtrmeterflow',
    ref_col: "meterFlowId",
    ref_display: "flowName",
});
//额定流量
var meterFlowHelper = RefHelper.create({
    ref_url: 'gasmtrmeterflow',
    ref_col: "meterFlowId",
    ref_display: "ratingFlux",
});
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
$('#add_meter').click(function () {
    if($('#depositoryName').val()){
        var depository_id=$('#depositoryName').val();
        window.location.href = "customer/dm/meter_input.html?"+depository_id;
    }else{
        bootbox.alert("<br><center><h4>请先选择一个入库仓库！</h4></center><br>");
    }
});
var user_id = JSON.parse(localStorage.getItem("user_info")).userId;
var update = 0;
$.ajax({
    type: 'get',
    url: hzq_rest + 'gassysuser/' + user_id,
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    async: false,
    success: function (data) {
        console.log(data);
        if (data.stationId == "39") {
            update = 1;
        }
    }
});
var depositoryId;
$.ajax({
    type: 'get',
    url: hzq_rest + 'gasmtrdepository/?query={"unitId":"12"}',
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    async: false,
    success: function (data) {
        depositoryId=data[0].depositoryId;
        $('#depositoryName').append('<option value="' + data[0].depositoryId + '">' + data[0].depositoryName + '</option>');
    }
});
$.ajax({
    type: 'get',
    url: hzq_rest + 'gassysuser/' + user_id,
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    async: false,
    success: function (data) {
        console.log(data);
        if (data.stationId == "22") {
            update = 1;
        }
    }
});
var prepareMeterAction = function () {
//仓库Helper
    var depositoryHelper = RefHelper.create({
        ref_url: "gasmtrdepository",
        ref_col: 'depositoryId',
        ref_display: 'depositoryName'
    });
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
                console.log(update)
                if (update == 1) {
                    return "<a  data-target='#meterInfo' id='meterInfo1' ' data-toggle='modal' data-kind='" + JSON.stringify(row) + "'>" + '详情' + "</a>"+"|"+
                    "<a  data-target='#updatemeter' id='update_meter' ' data-toggle='modal' data-kind='" + JSON.stringify(row) + "'>" + '修改' + "</a>";
                } else {
                    return "<a  data-target='#meterInfo' id='meterInfo1' ' data-toggle='modal' data-kind='" + JSON.stringify(row) + "'>" + '详情' + "</a>";
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
            $.map(factoryHelper.getData(), function (value, key) {
                $('select[name="factoryId"]').append('<option value="' + key + '">' + value + '</option>');
            });
            $.map(meterTypeIdHelper.getData(), function (value, key) {
                $('select[name="meterTypeId"]').append('<option value="' + key + '">' + value + '</option>');
            });
            $.map(resKindIdHelper.getData(), function (value, key) {
                $('select[name="reskindId"]').append('<option value="' + key + '">' + value + '</option>');
            });
            $.map(meterSpecIdHelper.getData(), function (value, key) {
                $('select[name="meterModelId"]').append('<option value="' + key + '">' + value + '</option>');
            });
            $.map(meterFlowRangeHelper.getData(), function (value, key) {
                $('select[name="flowRange"]').append('<option value="' + key + '">' + value + '</option>');
            });
        },
        reload: function () {
            $('#divtable').html('');
            var bd = {
                "cols": "*",
                "froms": "gas_mtr_meter",
                "wheres": "is_backup='2' and depository_id='"+depositoryId+"'",
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
                            format:meterFlowRange,
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
                            sorting: false,
                            format: detailedInfoFormat,
                            index: 23
                        }

                    ],
                    //---------------查询时过滤条件
                    findFilter: function () {
                        var depositoryId1 = $('#depositoryName option:selected').val();
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
                        if (depositoryId1) {
                            whereinfo += "depository_id = '" + depositoryId1 + "' and ";
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
                            console.log(flowRange);
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
                            "wheres": whereinfo + "is_backup='2' and depository_id='"+depositoryId+"'",
                            "page": true,
                            "limit": 50
                        };
                        console.log(bd);
                        xw.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)));
                    },//--findFilter
                }
            )
        }
    }
}();
//表具类型物品种类
$('select[name="meterTypeId"]').on("click", function () {
    $('select[name="reskindId"]').html('<option value="" selected>全部</option>').trigger("change");
    console.log($(this).val());
    $.ajax({
        type: 'get',
        url: hzq_rest + 'gasmtrmetertypereskind/?query={"meterTypeId":' + $(this).val() + '}',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (data) {
            console.log(data);
            if (data[0]) {
                var reskindId = [];
                for (var i = 0; i < data.length; i++) {
                    reskindId.push(data[i].reskindId);
                }
                console.log(reskindId);
                if (reskindId.length > 1) {
                    var reskindHelper = RefHelper.create({
                        ref_url: 'gasmtrreskind/' + reskindId,
                        ref_col: "reskindId",
                        ref_display: "reskindName",
                    });
                    console.log(reskindHelper.getData());
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
                            console.log(data);
                            $('select[name="reskindId"]').append('<option value="' + data[0].reskindId + '">' + data[0].reskindName + '</option>');
                        }
                    });
                }
            }
        }
    });
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

var meterId
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
    if (!$('#meterTypeId option:selected').val()) {
        bootbox.alert("<br><center><h4>表具类型不能为空,请重试</h4></center><br>");
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
        bootbox.alert("<br><center><h4>流量范围不能为空,请重试</h4></center><br>");
        return;
    }
    if (!$('#meterDigit1').val()) {
        bootbox.alert("<br><center><h4>表位数不能为空,请重试</h4></center><br>");
        return;
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
                if (e.success == true) {
                    bootbox.alert("<br><center><h4>修改成功</h4></center><br>");
                    location.reload();
                }

            }
        }
    })
});
var upMeterNo="";
$("#findMeter").click("on", function () {
    console.log(1);
    var meterNo = $('#meterNo1').val();
    if(meterNo){
    $.ajax({
        type: 'get',
        url: hzq_rest + 'gasmtrmeter/?query={"meterNo":' + meterNo + '}',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (data) {
            if (data[0]) {
                upMeterNo=data[0].meterId;
                var item = "" +
                    "<tr>" +
                    "<td>" + data[0].meterNo + "</td>" +
                    "<td>" + factoryHelper.getDisplay(data[0].factoryId) + "</td>" +
                    "<td>" + meterSpecIdHelper.getDisplay(data[0].meterModelId) + "</td>" +
                    "<td>" + meterFlowRangeHelper.getDisplay(data[0].flowRange) + "</td>" +
                    "<td>" + meterFlowHelper.getDisplay(data[0].flow) + "</td>" +
                    "<td>" + meterTypeIdHelper.getDisplay(data[0].meterTypeId) + "</td>" +
                    "<td>" + resKindIdHelper.getDisplay(data[0].reskindId) + "</td>" +
                    "<td>" + data[0].meterDigit + "</td>" +
                    "</tr>";
                $('#tbody').append(item);
            } else {
                bootbox.alert("<br><center><h4>表具信息不存在，请核对你输入的表编号是否有误</h4></center><br>");
                return false;
            }
        }
    });
    }else{
        bootbox.alert("<br><center><h4>请输入表具编号</h4></center><br>");
    }
});
$('#insertId').click(function () {
    var insertStock = new Array();
    insertStock.push({"depositoryId":depositoryId,"meterId": upMeterNo,"isBackup":"1"});
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: hzq_rest + "gasmtrmeter/",
        type: "PUT",
        dataType: "json",
        async: false,
        data: JSON.stringify(insertStock),
        success: function (e) {
            console.log(e);
            if (e.success == true) {
                upMeterNo="";
                $('#tbody').html('');
                location.reload();
            }
        }
    })


});
var GasModCtms = function () {
    var direction={"L":"左","R":"右"};
    var  meterStatus = {"1":"正常","2":"表慢","3":"表快","4":"死表"};
    var meterMaterial={"1":"铁","2":"铝"};
    var baseMeterVender={"1":"金卡","2":"松川","3":"蓝宝石"};
    var displayType={"1":"机械","2":"电子","3":"机械+电子"};
    var controlType={"1":"远传阀控","2":"远传IC卡","3":"IC卡气量","4":"IC卡金额"};
    var chipType={"1":"102卡 气量卡","2":"102卡 金额卡","3":"4442卡 气量卡","4":"4442卡 金额卡"};
    var valveInfo = {"1": "正常", "2": "异常"};
    var powerType = {"1": "干电池", "2": "锂电池"};
    var meterKind =  {"01":"普通表","02":"IC卡气量表","03":"IC卡金额表","04":"代码表","05":"远传表"};
    var meterFlag={"1": "否", "2": "是"};
    return {
        directionFormat:function(val){
            return direction[val];
        },
        meterMaterialFormat:function(val){
            return meterMaterial[val];
        },
        displayTypeFormat:function(val){
            return displayType[val];
        },
        chipTypeFormat:function(val){
            return chipType[val];
        },
        controlTypeFormat:function(val){
            return controlType[val];
        },
        baseMeterVenderFormat:function(val){
            return baseMeterVender[val];
        },
        valveInfoFormat:function(val){
            return valveInfo[val];
        },
        powerTypeFormat:function(val){
            return powerType[val];
        },
        meterStatusFormat:function(val){
            return meterStatus[val];
        },
        meterKindFormat:function(val){
            return meterKind[val];
        },
        meterFlagFormat:function(val){
            return meterFlag[val];
        }
    }
}();
$(document).on('click', "#meterInfo1", function () {
    var dateFormat = function (val) {
        if (val) {
            var date = val.substring(0, 10);
            return date;
        }
    };
    var row = JSON.parse($(this).attr("data-kind"));
    meterId = row.meterId;
    $.ajax({
        url: hzq_rest + 'gasmtrmeter?query={"meterId":"' + meterId + '"}',
        type: "get",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (data) {
            console.log(data)
            if (data.length) {
                $('#archive1 input').each(function (index) {
                    $(this).attr("name");
                    if ($(this).attr('name') == "productionDate") {
                        $(this).val(dateFormat(data[0][$(this).attr('name')]))
                    }
                    else if ($(this).attr('name') == "direction") {
                        $(this).val(GasModCtms.directionFormat(data[0][$(this).attr('name')]))
                    }
                    else if ($(this).attr('name') == "meterTypeId") {
                        $(this).val(meterTypeIdHelper.getDisplay(data[0][$(this).attr('name')]))
                    }
                    else if ($(this).attr('name') == "reskindId") {
                        $(this).val(resKindIdHelper.getDisplay(data[0][$(this).attr('name')]))
                    }
                    else if ($(this).attr('name') == "meterStatus") {
                        $(this).val(GasModCtms.meterStatusFormat(data[0][$(this).attr('name')]))
                    }
                    else if ($(this).attr('name') == "factoryId") {
                        $(this).val(factoryHelper.getDisplay(data[0][$(this).attr('name')]))
                    }
                    else if ($(this).attr('name') == "meterModelId") {
                        $(this).val(meterSpecIdHelper.getDisplay(data[0][$(this).attr('name')]))
                    }
                    else if ($(this).attr('name') == "flowRange") {
                        $(this).val(meterFlowRangeHelper.getDisplay(data[0][$(this).attr('name')]))
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
                    else if ($(this).attr('name') == "meterMaterial") {
                        $(this).val(GasModCtms.meterMaterialFormat(data[0][$(this).attr('name')]))
                    }
                    else if ($(this).attr('name') == "meterKind") {
                        $(this).val(GasModCtms.meterKindFormat(data[0][$(this).attr('name')]))
                    }
                    else if ($(this).attr('name') == "baseMeterVender") {
                        $(this).val(GasModCtms.baseMeterVenderFormat(data[0][$(this).attr('name')]))
                    }
                    else if ($(this).attr('name') == "displayType") {
                        $(this).val(GasModCtms.displayTypeFormat(data[0][$(this).attr('name')]))
                    }

                    else if ($(this).attr('name') == "controlType") {
                        $(this).val(GasModCtms.controlTypeFormat(data[0][$(this).attr('name')]))
                    }
                    else if ($(this).attr('name') == "chipType") {
                        $(this).val(GasModCtms.chipTypeFormat(data[0][$(this).attr('name')]))
                    }
                    else if ($(this).attr('name') == "valveInfo") {
                        $(this).val(GasModCtms.valveInfoFormat(data[0][$(this).attr('name')]))
                    }
                    else if ($(this).attr('name') == "powerType") {
                        $(this).val(GasModCtms.powerTypeFormat(data[0][$(this).attr('name')]))
                    }
                    else if ($(this).attr('name') == "meterFlag") {
                        $(this).val(GasModCtms.meterFlagFormat(data[0][$(this).attr('name')]))
                    }
                    else if ($(this).attr('name') == "isBackup") {
                        $(this).val(GasModCtms.meterFlagFormat(data[0][$(this).attr('name')]))
                    }
                    else if ($(this).attr('name') == "batteryDate") {
                        $(this).val(dateFormat(data[0][$(this).attr('name')]))
                    } else if ($(this).attr('name') == "lastContainersDate") {
                        $(this).val(dateFormat(data[0][$(this).attr('name')]))
                    } else {
                        $(this).val(data[0][$(this).attr('name')]);
                    }
                });
            }
        }
    });
});
