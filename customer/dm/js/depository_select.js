/**
 * Created by alex on 2017/6/8.
 */
ComponentsPickers.init();
var xw;

var depositorySelectAction = function () {
    var area_id = JSON.parse(localStorage.getItem("user_info")).area_id;
    //仓库Helper
    var depositoryHelper = RefHelper.create({
        ref_url: "gasmtrdepository/"+'?query={"areaId":'+area_id+'}"',
        ref_col: 'depositoryId',
        ref_display: 'depositoryName'
    });
    //厂家Helper
    var factoryHelper = RefHelper.create({
        ref_url: 'gasmtrfactory',
        ref_col: 'factoryId',
        ref_display: 'factoryName'
    });
    //表具类型
    var metertypeIdHelper = RefHelper.create({
        ref_url: 'gasmtrmetertype',
        ref_col: 'meterTypeId',
        ref_display: 'meterTypeName'
    });
    //物品种类
    var reskindIdHelper = RefHelper.create({
        ref_url: 'gasmtrreskind',
        ref_col: 'reskindId',
        ref_display: 'reskindName'
    });
    var meterspecIdHelper = RefHelper.create({
        ref_url: 'gasmtrmeterspec',
        ref_col: 'meterModelId',
        ref_display: 'meterModelName'
    });
    //format
    //表具类型
    var depositoryFromat = function () {
        return {
            f: function (val) {
                return depositoryHelper.getDisplay(val);
            }
        }
    }();
    var metertypeIdFormat = function () {
        return {
            f: function (val) {
                return metertypeIdHelper.getDisplay(val);
            }
        }
    }();

    var reskindIdFormat = function () {
        return {
            f: function (val) {
                return reskindIdHelper.getDisplay(val);
            }
        }
    }();

    var meterspecIdFormat = function () {
        return {
            f: function (val) {
                return meterspecIdHelper.getDisplay(val);
            }
        }
    }();

    var factoryFormat = function () {
        return {
            f: function (val) {
                return factoryHelper.getDisplay(val);
            }
        }
    }();

    return {
        init: function () {
            this.initHelper();
            this.reload();
        },
        initHelper: function () {
            $.map(depositoryHelper.getData(), function (value, key) {
                $('#depositoryName').append('<option value="' + key + '">' + value + '</option>');
            });
            $.map(factoryHelper.getData(), function (value, key) {
                $('#factoryName').append('<option value="' + key + '">' + value + '</option>');
            });
            $.map(metertypeIdHelper.getData(), function (value, key) {
                $('#find_meterTypeId').append('<option value="' + key + '">' + value + '</option>');
            });
        },

        reload: function () {
            $('#divtable').html('');

            xw = XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize: 10,
                    columnPicker: true,
                    transition: 'fade',
                    checkboxes: false,
                    checkAllToggle: false,
                    //----------------基本restful地址---
                    restbase: 'gasmtrmeter',
                    key_column: 'meterId',
                    coldefs: [
                        {
                            col: "depositoryId",
                            friendly: "仓库名称",
                            format: depositoryFromat,
                            sorting: false,
                            unique: "true",
                            index: 1
                        },
                        {
                            col: "meterNo",
                            friendly: "表编号",
                            sorting: false,
                            unique: "true",
                            index: 2
                        },
                        {
                            col: "meterTypeId",
                            friendly: "表具类型",
                            format: metertypeIdFormat,
                            sorting: false,
                            index: 3
                        },
                        {
                            col: "reskindId",
                            friendly: "物品种类",
                            format: reskindIdFormat,
                            sorting: false,
                            index: 4
                        },
                        {
                            col: "meterModelId",
                            friendly: "表具规格型号",
                            format: meterspecIdFormat,
                            sorting: false,
                            index: 5
                        },
                        {
                            col: "factoryId",
                            friendly: "厂家",
                            format: factoryFormat,
                            sorting: false,
                            index: 6
                        },
                        {
                            col: "productionDate",
                            friendly: "生产日期",
                            format: dateFormat,
                            sorting: false,
                            index: 7
                        },
                        {
                            col: "meterStatus",
                            friendly: "表具状态",
                            format: GasSysBasic.meterStausFormat,
                            sorting: false,
                            index: 8
                        },
                        {
                            col: "barCode",
                            friendly: "表具条码",
                            sorting: false,
                            index: 9
                        },
                        {
                            col: "flow",
                            friendly: "额定流量",
                            sorting: false,
                            index: 10
                        },
                        {
                            col: "meterDigit",
                            friendly: "表位数",
                            sorting: false,
                            index: 11
                        },
                        {
                            col: "reading",
                            friendly: "表读数",
                            sorting: false,
                            index: 12
                        },
                        {
                            col: "onlineDate",
                            friendly: "第一次上线日期",
                            format: dateFormat,
                            sorting: false,
                            index: 13
                        },
                        {
                            col: "stockState",
                            friendly: "库存状态",
                            format: GasModCtm.stockStateFormat,
                            sorting: false,

                            index: 14
                        }

                    ],
                    //---------------查询时过滤条件
                    findFilter: function () {//find function
                        if ($("#find_start_date").val()) {
                            var find_start_date = RQLBuilder.condition("onlineDate", "$gte", "to_date('" + $("#find_start_date").val() + " 00:00:00','yyyy-MM-dd HH24:mi:ss')");
                        }
                        if ($("#find_end_date").val()) {
                            var find_end_date = RQLBuilder.condition("onlineDate", "$lte", "to_date('" + $("#find_end_date").val() + " 23:59:59','yyyy-MM-dd HH24:mi:ss')");
                        }
                        var depositoryName = undefined;
                        if ($('#depositoryName option:selected').val()) {
                            depositoryName = RQLBuilder.equal('depositoryId', $('#depositoryName option:selected').val());
                        }
                        var factoryName = undefined;
                        if ($('#factoryName option:selected').val()) {
                            factoryName = RQLBuilder.equal('factoryId', $('#factoryName option:selected').val());
                        }
                        var find_meterTypeId = undefined;
                        if ($('#find_meterTypeId option:selected').val()) {
                            find_meterTypeId = RQLBuilder.equal('meterTypeId', $('#find_meterTypeId option:selected').val());
                        }
                        var meterCode;
                        if ($("#meterCode").val()) {
                            meterCode = RQLBuilder.equal("meterNo", $("#meterCode").val());
                        }
                        var stockState = undefined;
                        if ($('#stockState option:selected').val()) {
                            stockState = RQLBuilder.equal('stockState', $('#stockState option:selected').val());
                        }
                        var filter = RQLBuilder.and([
                            depositoryName, factoryName, find_meterTypeId, meterCode, stockState, find_start_date, find_end_date
                        ]);

                        xw.setRestURL(hzq_rest + 'gasmtrmeter');

                        return filter.rql();
                    },//--findFilter

                    onAdded: function (ret, jsondata) {
                        return validateForm(jsondata);
                    },
                    onUpdated: function (ret, jsondata) {
                        return validateForm(jsondata);
                    },
                    onDeleted: function (ret, jsondata) {
                    }
                }
            )
        }
    }
}();

