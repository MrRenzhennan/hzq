/**
 * Created by alex on 2017/6/21.
 */
//Helper
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
    url:hzq_rest+'gassysdict/?query={"code":"gdfs"}',
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    async: false,
    success: function (data) {
        var dictId = [];
        for(var i=0;i<data.length;i++){
            dictId.push(data[i].dictId);
        }
        var powerTypeHelper = RefHelper.create({
            ref_url: 'gassysdict/?query={"parentDictId":"'+dictId+'"}',
            ref_col: "code",
            ref_display: "name",
        });
        $.map(powerTypeHelper.getData(), function (value, key) {
            $('#powerType').append('<option value="' + key + '">' + value + '</option>');
        });
    }
});
//信控模式
$.ajax({
    type: 'get',
    url:hzq_rest+'gassysdict/?query={"code":"xkms"}',
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    async: false,
    success: function (data) {
        var dictId = [];
        for(var i=0;i<data.length;i++){
            dictId.push(data[i].dictId);
        }
        var controlTypeHelper = RefHelper.create({
            ref_url: 'gassysdict/?query={"parentDictId":"'+dictId+'"}',
            ref_col: "code",
            ref_display: "name"
        });
        $.map(controlTypeHelper.getData(), function (value, key) {
            $('#controlType').append('<option value="' + key + '">' + value + '</option>');
        });
    }
});
//显示方式
$.ajax({
    type: 'get',
    url:hzq_rest+'gassysdict/?query={"code":"xsfs"}',
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    async: false,
    success: function (data) {
        var dictId = [];
        for(var i=0;i<data.length;i++){
            dictId.push(data[i].dictId);
        }
        var displayTypeHelper = RefHelper.create({
            ref_url: 'gassysdict/?query={"parentDictId":"'+dictId+'"}',
            ref_col: "code",
            ref_display: "name"
        });
        $.map(displayTypeHelper.getData(), function (value, key) {
            $('#displayType').append('<option value="' + key + '">' + value + '</option>');
        });
    }
});
//表体材质
$.ajax({
    type: 'get',
    url:hzq_rest+'gassysdict/?query={"code":"btcz"}',
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    async: false,
    success: function (data) {
        var dictId = [];
        for(var i=0;i<data.length;i++){
            dictId.push(data[i].dictId);
        }
        var meterMaterialHelper = RefHelper.create({
            ref_url: 'gassysdict/?query={"parentDictId":"'+dictId+'"}',
            ref_col: "code",
            ref_display: "name"
        });
        $.map(meterMaterialHelper.getData(), function (value, key) {
            $('#meterMaterial').append('<option value="' + key + '">' + value + '</option>');
        });
    }
});
//阀门情况
$.ajax({
    type: 'get',
    url:hzq_rest+'gassysdict/?query={"code":"fmqk"}',
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    async: false,
    success: function (data) {
        var dictId = [];
        for(var i=0;i<data.length;i++){
            dictId.push(data[i].dictId);
        }
        var valveInfoHelper = RefHelper.create({
            ref_url: 'gassysdict/?query={"parentDictId":"'+dictId+'"}',
            ref_col: "code",
            ref_display: "name"
        });
        $.map(valveInfoHelper.getData(), function (value, key) {
            $('#valveInfo').append('<option value="' + key + '">' + value + '</option>');
        });
    }
});


