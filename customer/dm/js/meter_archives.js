/**
 * Created by alex on 2017/6/26.
 */
var area_id = JSON.parse(localStorage.getItem("user_info")).area_id;
var xw;
var areas = new Array();
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
areas.push(area_id);
//查询areaId下级areaId
var queryCondion = RQLBuilder.and([
    RQLBuilder.equal("status", "1"),
    RQLBuilder.equal("parentAreaId", area_id)
]).rql()
$.ajax({
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    type: 'get',
    async: false,
    url: hzq_rest + "gasbizarea?query=" + queryCondion,
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
                ref_url: 'gasmtrmeterspec?query={"meterModelId":{"$in":' + JSON.stringify(meterModel) + '}}',
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
var meterArchivesSelectAction = function () {
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
                return "<a  data-target='#meterInfo' id='meterInfo1'  data-toggle='modal' data-kind='" + JSON.stringify(row) + "'>" + '详情' + "</a>";

            }
        }
    }();
    return {
        init: function () {
            this.initHelper();
            this.reload();
        },
        initHelper: function () {
            // $.each(GasModSys.areaHelper.getRawData(), function (idx, row) {
            //     $('#find_unit').append('<option value="' + row.areaId + '" name="' + row.areaId + '">' + row.areaName + '</option>');
            //
            // });
            $.map(factoryHelper.getData(), function (value, key) {
                $('select[name="factoryId"]').append('<option value="' + key + '">' + value + '</option>');
            });
            $.each(meterTypeIdHelper.getRawData(), function (index, row) {
                $('select[name="meterTypeId"]').append('<option value="' + row.meterTypeId + '">' + row.meterTypeName + '</option>');
            });
            $.each(resKindIdHelper.getRawData(), function (index, row) {
                $('select[name="reskindid"]').append('<option value="' + row.reskindId + '">' + row.reskindName + '</option>');
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
                "cols": "a.*,b.revise_meter_id,c.area_id,customer_address,customer_code,customer_name,gas_type_id,b.meter_user_name,b.address,b.unbolt_time",
                "froms": "gas_mtr_meter a left join gas_ctm_meter b on a.meter_id=b.meter_id " +
                " left join gas_ctm_archive c on b.ctm_archive_id=c.ctm_archive_id" +
                " left join gas_mrd_book d on c.book_id=d.book_id",
                "wheres": "1=0 and meter_user_state='01' and c.area_id in(" + areas + ")",
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
                            col: "areaId",
                            friendly: "供气区域",
                            format: AreaFormat,
                            sorting: false,
                            index: 1
                        },
                        {
                            col: "customerCode",
                            friendly: "客户编号",
                            sorting: true,
                            index: 2
                        },
                        {
                            col: "customerName",
                            friendly: "客户姓名",
                            sorting: true,
                            index: 3
                        },
                        {
                            col: "customerAddress",
                            friendly: "客户地址",
                            sorting: true,
                            index: 4
                        },
                        {
                            col: "gasTypeId",
                            friendly: "用气性质",
                            format: gasTypeFormat,
                            sorting: true,
                            index: 5
                        },
                        {
                            col: "meterUserName",
                            friendly: "表户名称",
                            sorting: true,
                            index: 6
                        },
                        {
                            col: "address",
                            friendly: "表户地址",
                            sorting: true,
                            index: 7
                        },
                        {
                            col: "unboltTime",
                            friendly: "开栓时间",
                            format: dateFormat,
                            sorting: true,
                            index: 8
                        },
                        {
                            col: "meterNo",
                            friendly: "表编号",
                            sorting: true,
                            index: 9
                        },
                        {
                            col: "factoryId",
                            friendly: "厂家",
                            format: factoryFormat,
                            sorting: true,
                            index: 10
                        },
                        {
                            col: "meterModelId",
                            friendly: "表具规格型号",
                            format: meterSpecIdFormat,
                            sorting: true,
                            index: 11
                        },
                        {
                            col: "flowRange",
                            friendly: "流量范围",
                            format: meterFlowRangeFormat,
                            sorting: true,
                            index: 12
                        },
                        {
                            col: "flow",
                            friendly: "额定流量",
                            format: meterFlowRange,
                            sorting: true,
                            index: 13
                        },
                        {
                            col: "meterTypeId",
                            friendly: "表具类型",
                            format: meterTypeIdFormat,
                            sorting: true,
                            index: 14
                        },
                        {
                            col: "reskindId",
                            friendly: "物品种类",
                            format: resKindIdFormat,
                            sorting: true,
                            index: 15
                        },
                        {
                            col: "direction",
                            friendly: "进气方向",
                            format: GasModCtm.meterDirectionFormat,
                            sorting: true,
                            index: 16
                        },
                        {
                            col: "productionDate",
                            friendly: "生产日期",
                            format: dateFormat,
                            sorting: true,
                            index: 17
                        },
                        {
                            col: "meterDigit",
                            friendly: "表位数",
                            sorting: true,
                            index: 18
                        },
                        {
                            col: "reading",
                            friendly: "表读数",
                            sorting: true,
                            index: 19
                        },

                        {
                            col: "onlineDate",
                            friendly: "上线日期",
                            format: dateFormat,
                            sorting: true,
                            index: 20
                        },
                        {
                            col: "meterStatus",
                            friendly: "表具状态",
                            format: GasSysBasic.meterStatus,
                            sorting: true,
                            index: 21
                        },
                        {
                            col: "meterMaterial",
                            friendly: "表体材质",
                            format: GasModCtm.meterMaterialFormat,
                            sorting: true,
                            hidden: true,
                            index: 22
                        },
                        {
                            col: "displayType",
                            friendly: "显示方式",
                            format: GasModCtm.displayTypeFormat,
                            sorting: true,
                            hidden: true,
                            index: 23
                        },
                        {
                            col: "controlType",
                            friendly: "信控模式",
                            format: GasModCtm.controlTypeFormat,
                            sorting: true,
                            hidden: true,
                            index: 24
                        },
                        {
                            col: "chipType",
                            friendly: "芯片类型",
                            format: GasModCtm.chipTypeFormat,
                            hidden: true,
                            sorting: true,
                            index: 25
                        },
                        {
                            col: "valveInfo",
                            friendly: "阀门情况",
                            format: GasModCtm.valveInfoFormat,
                            sorting: true,
                            hidden: true,
                            index: 26
                        },
                        {
                            col: "powerType",
                            friendly: "供电方式",
                            format: GasModCtm.powerTypeFormat,
                            sorting: true,
                            hidden: true,
                            index: 27
                        },
                        {
                            col: "stockState",
                            friendly: "库存状态",
                            format: GasModCtm.stockStateFormat,
                            sorting: true,
                            index: 28
                        },
                        {
                            col: "meterId",
                            friendly: "操作",
                            format: detailedInfoFormat,
                            hidden: false,
                            sorting: true,
                            index: 29
                        }

                    ],
                    //---------------查询时过滤条件
                    findFilter: function () {//find function
                        // if ($("#find_start_date").val()) {
                        //     var find_start_date = RQLBuilder.condition("onlineDate", "$gte", "to_date('" + $("#find_start_date").val() + " 00:00:00','yyyy-MM-dd HH24:mi:ss')");
                        // }
                        // if ($("#find_end_date").val()) {
                        //     var find_end_date = RQLBuilder.condition("onlineDate", "$lte", "to_date('" + $("#find_end_date").val() + " 23:59:59','yyyy-MM-dd HH24:mi:ss')");
                        // }
                        var areaId = $('#find_unit option:selected').val();
                        var find_countPer = $('#find_countPer option:selected').val();
                        var find_servicePer = $('#find_servicePer option:selected').val();
                        var customer_state = $('#find_customerState option:selected').val();
                        var factoryId = $('#factoryName option:selected').val();
                        var meterTypeId = $('#find_meterTypeId option:selected').val();
                        var meterModel = $('#meterModelId option:selected').val();
                        var flowRange = $('#flowRange option:selected').val();
                        var meterStatus = $('#meterStatus option:selected').val();
                        var secondMeterState = $('#secondMeter option:selected').val();
                        var direction = $('#direction option:selected').val();
                        var meterMaterial = $('#meterMaterial option:selected').val();
                        var baseMeterVender = $('#baseMeterVender option:selected').val();
                        var displayType = $('#displayType option:selected').val();
                        var controlType = $('#controlType option:selected').val();
                        var chipType = $('#chipType option:selected').val();
                        var valveInfo = $('#valveInfo option:selected').val();
                        var powerType = $('#powerType option:selected').val();
                        var resKind = $('#resKind option:selected').val();
                        var meter = $("input[name='meter']:checked").val();
                        var from = "";
                        var whereinfo = '1=1';
                        if (meter == 1 || !meter) {
                            from += "gas_mtr_meter a left join gas_ctm_meter b on a.meter_id=b.meter_id " +
                                " left join gas_ctm_archive c on b.ctm_archive_id=c.ctm_archive_id" +
                                " left join gas_mrd_book d on c.book_id=d.book_id"
                        }
                        if (meter == 2) {

                            from += "gas_mtr_meter a left join gas_ctm_meter b on a.meter_id=b.revise_meter_id " +
                                " left join gas_ctm_archive c on b.ctm_archive_id=c.ctm_archive_id" +
                                " left join gas_mrd_book d on c.book_id=d.book_id"

                        }
                        if (areaId) {
                            whereinfo += " and c.area_id='" + areaId + "'";
                        }
                        if (find_countPer) {
                            whereinfo += " and countper_id='" + find_countPer + "'";
                        }
                        if (find_servicePer) {
                            whereinfo += " and serviceper_id='" + find_servicePer + "'";
                        }
                        if ($('#find_bookCode').val()) {
                            whereinfo += " and book_code='" + $('#find_bookCode').val() + "'";
                        }
                        if ($('#find_customerCode').val()) {
                            whereinfo += " and customer_code='" + $('#find_customerCode').val() + "'";
                        }
                        if ($('#customerAddress').val()) {
                            whereinfo += " and customer_address='" + $('#customerAddress').val() + "'";
                        }
                        if ($('#find_gasTypeId').val() && !$('#find_gasTypeId1').val() && !$('#find_gasTypeId2').val()) {
                            whereinfo += " and c.gas_type_id  like '" + $('#find_gasTypeId').val() + "%'";
                        } else if ($('#find_gasTypeId').val() && $('#find_gasTypeId1').val() && !$('#find_gasTypeId2').val()) {
                            whereinfo += " and c.gas_type_id like '" + $('#find_gasTypeId1').val() + "%'";
                        } else if ($('#find_gasTypeId').val() && $('#find_gasTypeId1').val() && $('#find_gasTypeId2').val()) {
                            whereinfo += " and c.gas_type_id = '" + $('#find_gasTypeId2').val() + "'";
                        }
                        if ($('#meterCode').val()) {
                            whereinfo += " and meter_no='" + $('#meterCode').val() + "'";
                        }
                        if (customer_state) {
                            whereinfo += " and meter_user_state='" + customer_state + "'";
                        }
                        if (factoryId) {
                            whereinfo += " and factory_id='" + factoryId + "'";
                        }
                        if (meterTypeId) {
                            whereinfo += " and meter_type_id='" + meterTypeId + "'";
                        }
                        if (meterModel) {
                            whereinfo += " and meter_model_id='" + meterModel + "'";
                        }
                        if (flowRange) {
                            whereinfo += " and flow_range='" + flowRange + "'";
                        }
                        if (meterStatus) {
                            whereinfo += " and meter_status='" + meterStatus + "'";
                        }
                        if (secondMeterState) {
                            whereinfo += " and revise_meter_state='" + secondMeterState + "'";
                        }
                        if (direction) {
                            whereinfo += " and direction='" + direction + "'";
                        }
                        if (meterMaterial) {
                            whereinfo += " and meter_material='" + meterMaterial + "'";
                        }
                        if (baseMeterVender) {
                            whereinfo += " and base_meter_vender='" + baseMeterVender + "'";
                        }
                        if (displayType) {
                            whereinfo += " and display_type='" + displayType + "'";
                        }
                        if (controlType) {
                            whereinfo += " and control_type='" + controlType + "'";
                        }
                        if (chipType) {
                            whereinfo += " and chip_type='" + chipType + "'";
                        }
                        if (valveInfo) {
                            whereinfo += " and valve_info='" + valveInfo + "'";
                        }
                        if (powerType) {
                            whereinfo += " and power_type='" + powerType + "'";
                        }
                        if (resKind) {
                            whereinfo += " and reskind_id='" + resKind + "'";
                        }
                        if ($("#find_start_date").val() && $("#find_end_date").val()) {
                            whereinfo += " and to_char(production_date,'yyyy-mm-dd')  between '" + $('#find_start_date').val() + "' and '" + $("#find_end_date").val() + "'";
                        } else if ($("#find_start_date").val() && !$("#find_end_date").val()) {
                            bootbox.alert("请输入截止日期")
                        } else if (!$("#find_start_date").val() && $("#find_end_date").val()) {
                            bootbox.alert("请输入起始日期")
                        }
                        if ($("#find_start_date1").val() && $("#find_end_date1").val()) {
                            whereinfo += " and to_char(b.unbolt_time,'yyyy-mm-dd')  between '" + $('#find_start_date1').val() + "' and '" + $("#find_end_date1").val() + "'";
                        } else if ($("#find_start_date1").val() && !$("#find_end_date1").val()) {
                            bootbox.alert("请输入截止日期")
                        } else if (!$("#find_start_date1").val() && $("#find_end_date1").val()) {
                            bootbox.alert("请输入起始日期")
                        }

                        bd = {
                            "cols": "a.*,b.revise_meter_id,c.area_id,customer_address,customer_code,customer_name,gas_type_id,b.meter_user_name,b.address,b.unbolt_time",
                            "froms": from,
                            "wheres": whereinfo + " and meter_user_state='01'",
                            "page": true,
                            "limit": 50
                        };
                        xw.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)));
                    }
                }
            )
        }
    }
}();
var global_remap = {
    "areaId": "db@gas_biz_area,areaId,areaName",
    "gasTypeId": "db@gas_biz_gas_type,gasTypeId,gasTypeName",
    "depositoryId": "db@GAS_MTR_DEPOSITORY,depositoryId,depositoryName",
    "meterTypeId": "db@GAS_MTR_METER_TYPE,meterTypeId,meterTypeName",
    "reskindId": "db@GAS_MTR_RESKIND,reskindId,reskindName",
    "factoryId": "db@GAS_MTR_FACTORY,factoryId,factoryName",
    "meterModelId": "db@GAS_MTR_METERSPEC,meterModelId,meterModelName",
    "flowRange": "db@GAS_MTR_METER_FLOW,meterFlowId,flowName",
    "flow": "db@GAS_MTR_METER_FLOW,meterFlowId,ratingFlux",
    "meterStatus": "1:正常,2:表慢,3:表快,4:死表",
    "direction": "L:左,R:右",
    "meterMaterial": "1:铁,2:铝",
    "baseMeterVender": "1:金卡,2:松川,3:蓝宝石",
    "displayType": "1:机械,2:电子,3:机械+电子",
    "controlType": "1:远传阀控,2:远传IC卡,3:物联网表,4:IC卡气量,5:IC卡金额",
    "chipType": "1:102卡 气量卡,2:102卡 金额卡,3:4442卡 气量卡,4:4442卡 金额卡",
    "valveInfo": "1:正常,2:异常",
    "powerType": "1:干电池,2:锂电池",
    "meterKind": "01:普通表,02:IC卡气量表,03:IC卡金额表,04:代码表,05:远传表"
};
var GasModCtms = function () {
    var direction = {"L": "左", "R": "右"};
    var meterStatus = {"1": "正常", "2": "表慢", "3": "表快", "4": "死表"};
    var meterMaterial = {"1": "铁", "2": "铝"};
    var baseMeterVender = {"1": "金卡", "2": "松川", "3": "蓝宝石"};
    var displayType = {"1": "机械", "2": "电子", "3": "机械+电子"};
    var controlType = {"1": "远传阀控", "2": "远传IC卡", "3": "IC卡气量", "4": "IC卡金额"};
    var chipType = {"1": "102卡 气量卡", "2": "102卡 金额卡", "3": "4442卡 气量卡", "4": "4442卡 金额卡"};
    var valveInfo = {"1": "正常", "2": "异常"};
    var powerType = {"1": "干电池", "2": "锂电池"};
    var meterKind = {"01": "普通表", "02": "IC卡气量表", "03": "IC卡金额表", "04": "代码表", "05": "远传表"};
    var meterFlag = {"1": "否", "2": "是"};
    return {
        directionFormat: function (val) {
            return direction[val];
        },
        meterMaterialFormat: function (val) {
            return meterMaterial[val];
        },
        displayTypeFormat: function (val) {
            return displayType[val];
        },
        chipTypeFormat: function (val) {
            return chipType[val];
        },
        controlTypeFormat: function (val) {
            return controlType[val];
        },
        baseMeterVenderFormat: function (val) {
            return baseMeterVender[val];
        },
        valveInfoFormat: function (val) {
            return valveInfo[val];
        },
        powerTypeFormat: function (val) {
            return powerType[val];
        },
        meterStatusFormat: function (val) {
            return meterStatus[val];
        },
        meterKindFormat: function (val) {
            return meterKind[val];
        },
        meterFlagFormat: function (val) {
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
    console.log(row);
    meterId = row.meterId;
    $.ajax({
        url: hzq_rest + 'gasmtrmeter?query={"meterId":"' + meterId + '"}',
        type: "get",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (data) {
            console.log(data);
            if (data.length) {
                $('#archive input').each(function (index) {
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
            $.ajax({
                url: hzq_rest + 'gasmtrmeter?query={"MeterId":"' + data[0].reviseMeterId + '"}',
                type: "get",
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                async: false,
                success: function (data) {
                    console.log(data);
                    $('#refMeter').val(data[0].meterNo);
                }
            });

        }
    });
});
