/**
 * Created by alex on 2017/6/18.
 */
var xw;
//规格型号helper
var meterSpecIdHelper = RefHelper.create({
    ref_url: 'gasmtrmeterspec',
    ref_col: 'meterModelId',
    ref_display: 'meterModelName'
});
//厂家helper
var factoryHelper = RefHelper.create({
    ref_url: 'gasmtrfactory',
    ref_col: 'factoryId',
    ref_display: 'factoryName'
});
//表具类型helper
var meterTypeHelper = RefHelper.create({
    ref_url: 'gasmtrmetertype',
    ref_col: 'meterTypeId',
    ref_display: 'meterTypeName'
});
//物品种类helper
var meterKindHelper = RefHelper.create({
    ref_url: 'gasmtrreskind',
    ref_col: 'reskindId',
    ref_display: 'reskindName'
});
//额定流量helper
var meterFlowHelper = RefHelper.create({
    ref_url: 'gasmtrmeterflow',
    ref_col: 'meterFlowId',
    ref_display: 'flowName'
});
//厂家format
var factoryFormat = function () {
    return {
        f: function (val) {
            return factoryHelper.getDisplay(val);
        }
    }
}();
//表具类型format
var meterTypeFormat = function () {
    return {
        f: function (val) {
            return meterTypeHelper.getDisplay(val);
        }
    }
}();
//规格型号format
var meterModelFormat = function () {
    return {
        f: function (val) {
            return meterSpecIdHelper.getDisplay(val);
        }
    }
}();
//物品种类format
var meterKindFormat = function () {
    return {
        f: function (val) {
            return meterKindHelper.getDisplay(val);
        }
    }
}();
//额定流量format
var meterFlowFormat = function () {
    return {
        f: function (val) {
            return meterFlowHelper.getDisplay(val);
        }
    }
}();

var isBorrowBuilder=function(val){
    if(val=="Y"){
        return "<select id='lendFlag' name='lendFlag' class='form-control select2me'>" +
            "<option value='Y' selected>是</option>" +
            "<option value='N' >否</option></select>" ;
    }else if(val=="N"){
        return "<select id='lendFlag' name='lendFlag' class='form-control select2me'>" +
            "<option value='Y' >是</option>" +
            "<option value='N' selected>否</option></select>" ;
    }else{
        return "<select id='lendFlag' name='lendFlag' class='form-control select2me'>" +
            "<option value='Y' >是</option>" +
            "<option value='N' >否</option></select>" ;
    }
};
var isDirBuilder=function(val){
    if(val=="2"){
        return "<select id='isDir' name='isDir' class='form-control select2me'>" +
            "<option value='2' selected>是</option>" +
            "<option value='1' >否</option></select>" ;
    }else if(val=="1"){
        return "<select id='isDir' name='isDir' class='form-control select2me'>" +
            "<option value='2' >是</option>" +
            "<option value='1' selected>否</option></select>" ;
    }else{
        return "<select id='isDir' name='isDir' class='form-control select2me'>" +
            "<option value='2' >是</option>" +
            "<option value='1' >否</option></select>" ;
    }
};
var meterSpecAction = function () {
    return {
        init: function () {
            $.map(meterSpecIdHelper.getData(), function (value, key) {
                $('#specificationsName').append('<option value="' + key + '">' + value + '</option>');
            });
            this.reload();
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
                    tableId: "divtable",
                    findbtn: "find_button",
                    updbtn: "upd_button",
                    delbtn: "del_button",
                    addbtn: "add_button",
                    checkboxes: true,
                    checkAllToggle: true,
                    //----------------基本restful地址---
                    restbase: 'gasmtrmeterspec',
                    key_column: 'meterModelId',
                    coldefs: [
                        {
                            col: "meterModelId",
                            friendly: "表具规格型号ID",
                            unique: "true",
                            hidden: true,
                            nonedit: "nosend",
                            index: 1
                        },
                        {
                            col: "meterModelName",
                            validate: "required",
                            friendly: "表具规格型号名称",
                            index: 2
                        },
                        {
                            col: "meterIcType",
                            validate: "required",
                            format:GasModCtm.chipTypeFormat,
                            inputsource: "custom",
                            inputbuilder: "meterIcTypeBuilder",
                            friendly: "表IC卡类型",
                            index: 3
                        },
                        {
                            col: "status",
                            friendly: "状态",
                            format: GasSysBasic.StatusFormat,
                            validate: "required",
                            inputsource: "custom",
                            inputbuilder: "statusEditBuilder",
                            index: 6
                        }
                        // {
                        //  col:"createdTime",
                        //  friendly:"创建时间",
                        //  hidden:true,
                        //  index:5
                        //  },
                        //  {
                        //  col:"createdBy",
                        //  friendly:"创建人",
                        //  hidden:true,
                        //  index:6
                        //
                        //  },
                        //  {
                        //  col:"modifiedTime",
                        //  friendly:"变更时间",
                        //  hidden:true,
                        //  index:7
                        //
                        //  },
                        //  {
                        //  col:"modifiedBy",
                        //  friendly:"变更人",
                        //  hidden:true,
                        //  index:8
                        //  }

                    ],

                    // 查询过滤条件
                    findFilter: function () {
                        var specificationsId;

                        if ($('#specificationsName option:selected').val()) {
                            specificationsId = RQLBuilder.equal('meterModelId', $('#specificationsName option:selected').val());
                        }

                        var filter = RQLBuilder.and([
                            specificationsId
                        ]);
                        return filter.rql();
                    },

                    onAdded: function (ret, jsondata) {
                        return validateForm(jsondata);
                    },
                    onUpdated: function (ret, jsondata) {
                        return validateForm(jsondata);
                    },
                    onDeleted: function (ret, jsondata) {
                    }
                })
        }

    }
}();
var MeterFactoryAction = function () {
    return {
        init: function () {
            $.map(factoryHelper.getData(), function (value, key) {
                $('#factoryName').append('<option value="' + key + '">' + value + '</option>');
            });

            this.reload();
        },
        reload: function () {
            $('#divtable1').html('');
            xw = XWATable.init(
                {
                    divname: "divtable1",
                    //----------------table的选项-------
                    pageSize: 10,
                    columnPicker: true,
                    transition: 'fade',
                    tableId: "divtable1",
                    findbtn: "find_button1",
                    updbtn: "upd_button1",
                    delbtn: "del_button1",
                    addbtn: "add_button1",
                    checkboxes: true,
                    checkAllToggle: true,
                    //----------------基本restful地址---
                    restbase: 'gasmtrfactory',
                    key_column: 'factoryId',
                    coldefs: [
                        {
                            col: "factoryId",
                            friendly: "厂家Id",
                            unique: "true",
                            hidden: true,
                            nonedit: "nosend",
                            index: 1
                        },
                        {
                            col: "factoryName",
                            friendly: "厂家名称",
                            validate: "required",
                            unique: "true",
                            index: 2
                        },
                        {
                            col: "remark",
                            friendly: "备注",
                            index: 3

                        },
                        {
                            col: "status",
                            friendly: "状态",
                            format: GasSysBasic.StatusFormat,
                            validate: "required",
                            inputsource: "custom",
                            inputbuilder: "statusEditBuilder",
                            index: 4
                        }
                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var factoryName;

                        if ($('#factoryName option:selected').val()) {
                            factoryName = RQLBuilder.equal('factoryId', $('#factoryName option:selected').val());
                        }

                        var filter = RQLBuilder.and([
                            factoryName
                        ]);
                        return filter.rql();
                    },

                    onAdded: function (ret, jsondata) {
                        return validateForm(jsondata);
                    },
                    onUpdated: function (ret, jsondata) {
                        return validateForm(jsondata);
                    },
                    onDeleted: function (ret, jsondata) {
                    }
                })
        }

    }
}();
var MeterTypeAction = function () {
    return {
        init: function () {
            $.map(meterTypeHelper.getData(), function (value, key) {
                $('#meterTypeId').append('<option value="' + key + '">' + value + '</option>');
            });
            $.map(factoryHelper.getData(), function (value, key) {
                $('#factoryName1').append('<option value="' + key + '">' + value + '</option>');
            });
            this.reload();
        },
        reload: function () {

            $('#divtable2').html('');

            xw = XWATable.init(
                {
                    divname: "divtable2",
                    //----------------table的选项-------
                    pageSize: 10,
                    columnPicker: true,
                    transition: 'fade',
                    tableId: "divtable2",
                    findbtn: "find_button2",
                    updbtn: "upd_button2",
                    delbtn: "del_button2",
                    addbtn: "add_button2",
                    checkboxes: true,
                    checkAllToggle: true,
                    //----------------基本restful地址---
                    restbase: 'gasmtrmetertype',
                    key_column: 'meterTypeId',
                    coldefs: [
                        {
                            col: "meterTypeId",
                            friendly: "表具类型Id",
                            unique: "true",
                            hidden: true,
                            nonedit: "nosend",
                            index: 1
                        },
                        {
                            col: "factory",
                            friendly: "厂家",
                            format: factoryFormat,
                            inputsource: "select",
                            ref_url: "gasmtrfactory",
                            ref_name: "factoryName",
                            ref_value: "factoryId",
                            validate: "required",
                            index: 2
                        },
                        {
                            col: "meterTypeCode",
                            friendly: "表具类型代码",
                            validate: "required",
                            index: 3
                        },
                        {
                            col: "meterTypeName",
                            friendly: "表具类型名称",
                            validate: "required",
                            index: 4
                        },
                        {
                            col: "parentMeterTypeId",
                            friendly: "上级ID",
                            format: meterTypeFormat,
                            inputsource: "select",
                            ref_url: "gasmtrmetertype",
                            ref_name: "meterTypeName",
                            ref_value: "meterTypeId",
                            index: 5
                        },
                        {
                            col: "modelNumber",
                            friendly: "型号",
                            index: 6
                        },
                        {
                            col: "displayMode",
                            friendly: "显示方式",
                            index: 7
                        },
                        {
                            col: "capacity",
                            friendly: "额定流量",
                            index: 8
                        },
                        {
                            col: "flowOrder",
                            friendly: "进气方向",
                            format: GasSysBasic.directionFormat,
                            index: 9
                        },
                        {
                            col: "meterKind",
                            friendly: "表种类",
                            index: 10
                        },
                        {
                            col: "funcLevel",
                            friendly: "级别",
                            validate: "required",
                            index: 11
                        },
                        {
                            col: "measureScope",
                            friendly: "测量范围",
                            index: 12
                        },
                        {
                            col: "precision",
                            friendly: "精度",
                            index: 13
                        },
                        {
                            col: "checkCycle",
                            friendly: "检表周期",
                            index: 14
                        },
                        {
                            col: "isDir",
                            friendly: "是否目录",
                            format: GasSysBasic.isDirFormat,
                            inputsource: "custom",
                            inputbuilder: "isDirBuilder",
                            index: 15
                        }

                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var  meterTypeId;
                        if ($('#meterTypeId option:selected').val()) {
                            meterTypeId = RQLBuilder.equal('meterTypeId', $('#meterTypeId option:selected').val());
                        }
                        var filter = RQLBuilder.and([
                            meterTypeId
                        ]);
                        return filter.rql();
                    },

                    onAdded: function (ret, jsondata) {
                        return validateForm(jsondata);
                    },
                    onUpdated: function (ret, jsondata) {
                        return validateForm(jsondata);
                    },
                    onDeleted: function (ret, jsondata) {
                    }
                })
        }

    }
}();
var MeterKindAction = function () {
    return {
        init: function () {
            $.map(meterKindHelper.getData(), function (value, key) {
                $('#meterKind').append('<option value="' + key + '">' + value + '</option>');
            });
            this.reload();
        },
        reload: function () {

            $('#divtable3').html('');

            xw = XWATable.init(
                {
                    divname: "divtable3",
                    //----------------table的选项-------
                    pageSize: 10,
                    columnPicker: true,
                    transition: 'fade',
                    tableId: "divtable3",
                    findbtn: "find_button3",
                    updbtn: "upd_button3",
                    delbtn: "del_button3",
                    addbtn: "add_button3",
                    checkboxes: true,
                    checkAllToggle: true,
                    //----------------基本restful地址---
                    restbase: 'gasmtrreskind',
                    key_column: 'reskindId',
                    coldefs: [
                        {
                            col: "reskindId",
                            friendly: "物品种类Id",
                            unique: "true",
                            hidden: true,
                            nonedit: "nosend",
                            index: 1
                        },
                        {
                            col: "reskindCode",
                            friendly: "物品种类代码",
                            validate: "required",
                            sorting: false,
                            index: 2
                        },
                        {
                            col: "reskindName",
                            friendly: "物品种类名称",
                            validate: "required",
                            unique: "true",
                            sorting: false,
                            index: 3
                        },

                        {
                            col: "funcLevel",
                            friendly: "级别",
                            validate: "required",
                            sorting: false,
                            index: 4
                        },
                        {
                            col: "parentReskindId",
                            friendly: "父级",
                            validate: "required",
                            format: meterKindFormat,
                            inputsource: "select",
                            ref_url: "gasmtrreskind",
                            ref_name: "reskindName",
                            ref_value: "reskindId",
                            sorting: false,
                            index: 5
                        },
                        {
                            col: "posCode",
                            friendly: "位置码",
                            validate: "required",
                            sorting: false,
                            index: 6
                        },
                        {
                            col: "spec",
                            friendly: "规格",
                            validate: "required",
                            sorting: false,
                            index: 7
                        },
                        {
                            col: "nunit",
                            friendly: "单位",
                            sorting: false,
                            index: 8
                        },
                        {
                            col: "lendFlag",
                            friendly: "出借标志",
                            format: GasSysBasic.logFormat,
                            inputsource: "custom",
                            inputbuilder: "isBorrowBuilder",
                            sorting: false,
                            index: 9
                        },
                        {
                            col: "isDir",
                            friendly: "是否目录",
                            format: GasSysBasic.isDirFormat,
                            inputsource: "custom",
                            inputbuilder: "isDirBuilder",
                            sorting: false,
                            index: 10
                        }
                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var meterKindName;
                        if ($('#meterKind option:selected').val()) {
                            meterKindName = RQLBuilder.equal('reskindId', $('#meterKind option:selected').val());
                        }
                        var filter = RQLBuilder.and([
                            meterKindName
                        ]);
                        return filter.rql();
                    },

                    onAdded: function (ret, jsondata) {
                        return validateForm(jsondata);
                    },
                    onUpdated: function (ret, jsondata) {
                        return validateForm(jsondata);
                    },
                    onDeleted: function (ret, jsondata) {
                    }
                })
        }

    }
}();
var MeterFlowAction = function () {
    return {
        init: function () {
            $.map(meterFlowHelper.getData(), function (value, key) {
                $('#meterFlowId').append('<option value="' + key + '">' + value + '</option>');
            });
            this.reload();
        },
        reload: function () {

            $('#divtable4').html('');

            xw = XWATable.init(
                {
                    divname: "divtable4",
                    //----------------table的选项-------
                    pageSize: 10,
                    columnPicker: true,
                    transition: 'fade',
                    tableId: "divtable4",
                    findbtn: "find_button4",
                    updbtn: "upd_button4",
                    delbtn: "del_button4",
                    addbtn: "add_button4",
                    checkboxes: true,
                    checkAllToggle: true,
                    //----------------基本restful地址---
                    restbase: 'gasmtrmeterflow',
                    key_column: 'meterFlowId',
                    coldefs: [
                        {
                            col: "meterFlowId",
                            friendly: "流量ID",
                            unique: "true",
                            hidden: true,
                            nonedit: "nosend",
                            index: 1
                        },
                        {
                            col: "flowCode",
                            friendly: "流量代码",
                            validate: "required",
                            sorting: false,
                            index: 2
                        },
                        {
                            col: "flowName",
                            friendly: "流量范围",
                            validate: "required",
                            unique: "true",
                            sorting: false,
                            index: 3
                        },

                        {
                            col: "ratingFlux",
                            friendly: "额定流量",
                            validate: "required",
                            sorting: false,
                            index: 4
                        }
                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var meterFlowId;
                        if ($('#meterFlowId option:selected').val()) {
                            meterFlowId = RQLBuilder.equal('meterFlowId', $('#meterFlowId option:selected').val());
                        }
                        var filter = RQLBuilder.and([
                            meterFlowId
                        ]);
                        return filter.rql();
                    },

                    onAdded: function (ret, jsondata) {
                        return validateForm(jsondata);
                    },
                    onUpdated: function (ret, jsondata) {
                        return validateForm(jsondata);
                    },
                    onDeleted: function (ret, jsondata) {
                    }
                })
        }

    }
}();
var meterFactorySpecAction = function () {
    return {
        init: function () {
            $.map(factoryHelper.getData(), function (value, key) {
                $('#factoryId').append('<option value="' + key + '">' + value + '</option>');
            });
            $.map(meterSpecIdHelper.getData(), function (value, key) {
                $('#meterModel').append('<option value="' + key + '">' + value + '</option>');
            });
            this.reload();
        },
        reload: function () {

            $('#divtable5').html('');

            xw = XWATable.init(
                {
                    divname: "divtable5",
                    //----------------table的选项-------
                    pageSize: 10,
                    columnPicker: true,
                    transition: 'fade',
                    tableId: "divtable5",
                    findbtn: "find_button5",
                    updbtn: "upd_button5",
                    delbtn: "del_button5",
                    addbtn: "add_button5",
                    checkboxes: true,
                    checkAllToggle: true,
                    //----------------基本restful地址---
                    restbase: 'gasmtrmeterfactoryspec',
                    key_column: 'factorySpecId',
                    coldefs: [
                        {
                            col: "factorySpecId",
                            friendly: "厂家规格型号对应ID",
                            unique: "true",
                            hidden: true,
                            nonedit: "nosend",
                            index: 1
                        },
                        {
                            col: "factoryId",
                            friendly: "厂家名称",
                            format: factoryFormat,
                            inputsource: "select",
                            ref_url: "gasmtrfactory",
                            ref_name: "factoryName",
                            ref_value: "factoryId",
                            validate: "required",
                            sorting: false,
                            index: 2
                        },
                        {
                            col: "meterModelId",
                            friendly: "规格型号",
                            format: meterModelFormat,
                            inputsource: "select",
                            ref_url: "gasmtrmeterspec",
                            ref_name: "meterModelName",
                            ref_value: "meterModelId",
                            validate: "required",
                            sorting: false,
                            index: 3
                        },

                        {
                            col: "meterFlowId",
                            friendly: "流量范围",
                            format: meterFlowFormat,
                            inputsource: "select",
                            ref_url: "gasmtrmeterflow",
                            ref_name: "flowName",
                            ref_value: "meterFlowId",
                            validate: "required",
                            sorting: false,
                            index: 4
                        }
                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var factoryId, meterModel;
                        if ($('#factoryId option:selected').val()) {
                            factoryId = RQLBuilder.equal('factoryId', $('#factoryId option:selected').val());
                        }
                        if ($('#meterModel option:selected').val()) {
                            meterModel = RQLBuilder.equal('meterModelId', $('#meterModel option:selected').val());
                        }
                        var filter = RQLBuilder.and([
                            factoryId, meterModel
                        ]);
                        return filter.rql();
                    },

                    onAdded: function (ret, jsondata) {
                        return validateForm(jsondata);
                    },
                    onUpdated: function (ret, jsondata) {
                        return validateForm(jsondata);
                    },
                    onDeleted: function (ret, jsondata) {
                    }
                })
        }

    }
}();
var meterTypeReskindAction = function () {
    return {
        init: function () {
            $.map(meterTypeHelper.getData(), function (value, key) {
                $('#meterType').append('<option value="' + key + '">' + value + '</option>');
            });
            $.map(meterKindHelper.getData(), function (value, key) {
                $('#reskind').append('<option value="' + key + '">' + value + '</option>');
            });
            this.reload();
        },
        reload: function () {

            $('#divtable6').html('');

            xw = XWATable.init(
                {
                    divname: "divtable6",
                    //----------------table的选项-------
                    pageSize: 10,
                    columnPicker: true,
                    transition: 'fade',
                    tableId: "divtable6",
                    findbtn: "find_button6",
                    updbtn: "upd_button6",
                    delbtn: "del_button6",
                    addbtn: "add_button6",
                    checkboxes: true,
                    checkAllToggle: true,
                    //----------------基本restful地址---
                    restbase: 'gasmtrmetertypereskind',
                    key_column: 'relId',
                    coldefs: [
                        {
                            col: "relId",
                            friendly: "表具类型与物品种类对应Id",
                            unique: "true",
                            hidden: true,
                            nonedit: "nosend",
                            index: 1
                        },
                        {
                            col: "meterTypeId",
                            friendly: "表具类型",
                            format: meterTypeFormat,
                            inputsource: "select",
                            ref_url: "gasmtrmetertype",
                            ref_name: "meterTypeName",
                            ref_value: "meterTypeId",
                            validate: "required",
                            sorting: false,
                            index: 2
                        },
                        {
                            col: "reskindId",
                            friendly: "物品种类",
                            format: meterKindFormat,
                            inputsource: "select",
                            ref_url: "gasmtrreskind",
                            ref_name: "reskindName",
                            ref_value: "reskindId",
                            validate: "required",
                            sorting: false,
                            index: 3
                        }
                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var meterType, reskind;
                        if ($('#meterType option:selected').val()) {
                            meterType = RQLBuilder.equal('meterTypeId', $('#meterType option:selected').val());
                        }
                        if ($('#reskind option:selected').val()) {
                            reskind = RQLBuilder.equal('reskindId', $('#reskind option:selected').val());
                        }
                        var filter = RQLBuilder.and([
                            meterType, reskind
                        ]);
                        return filter.rql();
                    },

                    onAdded: function (ret, jsondata) {
                        return validateForm(jsondata);
                    },
                    onUpdated: function (ret, jsondata) {
                        return validateForm(jsondata);
                    },
                    onDeleted: function (ret, jsondata) {
                    }
                })
        }

    }
}();