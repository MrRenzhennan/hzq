/**
 * Created by alex on 2017/6/9.
 */
SideBar.init();
SideBar.activeCurByPage("level2_depository.html");
var area_id = JSON.parse(localStorage.getItem("user_info")).area_id;
var href = document.location.href;
var hrefValue = href.split("?");
var depositoryId = hrefValue[1];

var xw;
var applyId;
var selectQuery = RQLBuilder.and([
    RQLBuilder.equal("areaId", area_id),
    RQLBuilder.equal("funcLevel", "1")
]).rql();
var inputQuery = RQLBuilder.and([
    RQLBuilder.equal("areaId", area_id),
    RQLBuilder.equal("approveState", "2"),
    RQLBuilder.equal("useState", "2")
]).rql();
// 已通过申请单helper
var applyHelper = RefHelper.create({
    ref_url: 'gasmtrmeterapply/?query=' + inputQuery,
    ref_col: "applyId",
    ref_display: "applyCode"
});
//供气区域Helper
var AreaHelper = RefHelper.create({
    ref_url: "gasbizarea",
    ref_col: "areaId",
    ref_display: "areaName"
});
//仓库Helper
var depositoryHelper = RefHelper.create({
    ref_url: "gasmtrdepository/?query=" + selectQuery,
    ref_col: 'depositoryId',
    ref_display: 'depositoryName'
});
//表厂家Helper
var factoryHelper = RefHelper.create({
    ref_url: 'gasmtrfactory',
    ref_col: 'factoryId',
    ref_display: 'factoryName'
});
//表具规格型号Helper
var meterModelHelper = RefHelper.create({
    ref_url: 'gasmtrmeterspec',
    ref_col: 'meterModelId',
    ref_display: 'meterModelName'
});
//表具类型Helper
var meterTypeIdHelper = RefHelper.create({
    ref_url: 'gasmtrmetertype',
    ref_col: 'meterTypeId',
    ref_display: 'meterTypeName',
    "sort": 'meterTypeCode'
});
//物品种类Helper
var resKindHelper = RefHelper.create({
    ref_url: 'gasmtrreskind',
    ref_col: 'reskindId',
    ref_display: 'reskindName',
    "sort": "reskindCode"
});
var depositoryFormat = function () {
    return {
        f: function (val) {
            return depositoryHelper.getDisplay(val);
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
$.map(factoryHelper.getData(), function (value, key) {
    $('#factoryName').append('<option value="' + key + '">' + value + '</option>');
});
$.map(meterModelHelper.getData(), function (value, key) {
    $('#meterModelId').append('<option value="' + key + '">' + value + '</option>');
});
$.each(meterTypeIdHelper.getRawData(), function (index, row) {
    $('#meterTypeId').append('<option value="' + row.meterTypeId + '">' + row.meterTypeName + '</option>');
});
$.each(resKindIdHelper.getRawData(), function (index, row) {
    $('#resKind').append('<option value="' + row.reskindId + '">' + row.reskindName + '</option>');
});
$.map(depositoryHelper.getData(), function (value, key) {
    $('#depositoryName').append('<option value="' + key + '">' + value + '</option>');
});
var choseBillsAction = function () {

    return {

        init: function () {
            // 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)
            this.initHelper();
            this.reload();
        },

        initHelper: function () {
            $.map(applyHelper.getData(), function (value, key) {
                $('#find_applyNo').append('<option value="' + key + '">' + value + '</option>');
            });
        },
        reload: function () {
            //---------------行定义
            var xwQuery = RQLBuilder.and([
                RQLBuilder.equal("areaId", area_id),
                RQLBuilder.equal("approveState", "2"),
                RQLBuilder.equal("useState", "2")
            ]).rql();

            $('#divtable').html('');

            xw = XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize: 5, 			//Initial pagesize
                    columnPicker: true,         //Show the columnPicker button
                    sorting: true,
                    transition: 'fade',  //(bounce, fade, flip, rotate, scroll, slide).
                    checkboxes: true,           //Make rows checkable. (Note. You need a column with the 'unique' property)
                    checkAllToggle: false,        //Show the check-all toggle//+RQLBuilder.like("KEYY", "a").rql()
                    //----------------基本restful地址---
                    restbase: 'gasmtrmeterapply/?query=' + xwQuery,
                    key_column: "applyId",
                    //---------------行定义
                    coldefs: [
                        {
                            col: "applyId",
                            friendly: "申请单Id",
                            unique: "true",
                            hidden: true,
                            nonedit: "nosend",
                            index: 1
                        },
                        {
                            col: "applyCode",
                            friendly: "申请单编号",
                            readonly: "readonly",
                            sorting: true,
                            index: 2
                        },
                        {
                            col: "sourceDepositoryId",
                            friendly: "源仓库",
                            format: depositoryFormat,
                            sorting: false,
                            index: 3
                        },
                        {
                            col: "targetDepositoryId",
                            friendly: "目标仓库",
                            format: depositoryFormat,
                            sorting: false,
                            index: 4
                        },
                        {
                            col: "applyType",
                            friendly: "单据类型",
                            sorting: false,
                            index: 5
                        },
                        {
                            col: "applyUserName",
                            friendly: "申请人",
                            sorting: false,
                            index: 6
                        },
                        {
                            col: "areaId",
                            friendly: "供气区域",
                            format: AreaFormat,
                            sorting: false,
                            ref_url: "gasbizarea",
                            ref_name: "areaName",
                            ref_value: "areaId",
                            index: 7
                        },
                        {
                            col: "approveState",
                            friendly: "审核状态",
                            sorting: false,
                            format: GasModCtm.applyStateFormat,
                            index: 8
                        }
                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var find_applyNo;
                        if ($('#find_applyNo').val()) {
                            find_applyNo = RQLBuilder.equal("applyId", $('#find_applyNo').val());
                        }
                        var areaId = RQLBuilder.equal("areaId", area_id);
                        var approveState = RQLBuilder.equal("approveState", "2");
                        var useState = RQLBuilder.equal("useState", "2");
                        var filter = RQLBuilder.and([
                            find_applyNo, areaId, approveState, useState
                        ]);
                        xw.setRestURL(hzq_rest + "gasmtrmeterapply")
                        return filter.rql();
                    }
                }
            );
        }

    }
}();
//厂家级联
var factory;
var model;
$('#factoryName').on("click", function () {
    $('#meterModelId').html('<option value="" selected>全部</option>').trigger("change");
    factory = $(this).val();
    $.ajax({
        type: 'get',
        url: hzq_rest + 'gasmtrmeterfactoryspec/?query={"factoryId":' + $(this).val() + '}',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (data) {
            console.log(data);
            var meterModel = [];
            for (var i = 0; i < data.length; i++) {
                meterModel.push(data[i].meterModelId);
            }
            console.log(meterModel);
            if (meterModel.length > 1) {
                var meterSpecHelper = RefHelper.create({
                    ref_url: 'gasmtrmeterspec/' + meterModel,
                    ref_col: "meterModelId",
                    ref_display: "meterModelName",
                });
                console.log(meterSpecHelper.getData());
                $.map(meterSpecHelper.getData(), function (value, key) {
                    $('#meterModelId').append('<option value="' + key + '">' + value + '</option>');
                });
            } else {
                $.ajax({
                    type: 'get',
                    url: hzq_rest + 'gasmtrmeterspec/?query={"meterModelId":' + meterModel + '}',
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8",
                    async: false,
                    success: function (data) {
                        $('#meterModelId').append('<option value="' + data[0].meterModelId + '">' + data[0].meterModelName + '</option>');
                    }
                });
            }

        }
    });
});
$('#meterModelId').on("click", function () {
    $('#flowRange').html('<option value="">全部</option>').trigger("change");
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
            if (data[0].meterFlowId) {
                var meterFlowId = data[0].meterFlowId;
                var meterFlow = Restful.findNQ(hzq_rest + 'gasmtrmeterflow?query={"meterFlowId":"' + meterFlowId + '"}');
                console.log(meterFlow[0].flowCode);
                $('#flowRange').val(meterFlow[0].flowName);
                // $('#flow').val(meterFlow[0].ratingFlux);
                $('#flowRange').html('<option value="">全部</option>' +
                    '<option value="' + meterFlowId + '">' + meterFlow[0].flowName + '</option>')
                // var meterFlowHelper = RefHelper.create({
                //     ref_url: 'gasmtrmeterflow/' + meterFlowId,
                //     ref_col: "meterFlowId",
                //     ref_display: "flowName",
                // });
                // console.log(meterFlowHelper.getData());
                // $.map(meterFlowHelper.getData(), function (value, key) {
                //     $('#flowRange').append('<option value="' + key + '">' + value + '</option>');
                // });
                // factory="";
                // model="";
            }
        }
    });
});
$('#flowRange').on("change", function () {
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
$('#meterTypeId').on("click", function () {
    $('#resKind').html('<option value="" selected>全部</option>').trigger("change");
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
                        $('#resKind').append('<option value="' + key + '">' + value + '</option>');
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
                            $('#resKind').append('<option value="' + data[0].reskindId + '">' + data[0].reskindName + '</option>');
                        }
                    });
                }
            }
        }
    });
});
var factory;
var firstMeterId;
function choseMeter(obj) {
    var value = obj.options[obj.selectedIndex].value;
    console.log(value);
    if (value == 2) {
        factory = $('#factoryName').val();
        if (factory) {
            document.getElementById("showMeter").style.display = 'block';
            firstMeterSpecAction.init();
        } else {
            // bootbox.alert("<br><center><h4>请先选择表厂家</h4></center><br>");
            bootbox.dialog({
                message: "请先选择表厂家",
                buttons: {
                    OK: {
                        label: "确定",
                        className: "btn-primary",
                        callback: function () {
                            $('#isOrNo').val("1").trigger("change");
                        }
                    }
                }
            });
        }
    } else if (value == 1) {
        document.getElementById("firstMeter").style.display = 'none';
        document.getElementById("showMeter").style.display = 'none';
        firstMeterId = "";
    }
}
$("#confirm_btn").click("on", function () {
    var data = xw.getTable().getData(true);
    if (data.rows.length == 0) {
        bootbox.alert("<br><center><h4>请选择一条数据！</h4></center><br>");
        return false;
    }
    if (data.rows.length > 1) {
        bootbox.alert("<br><center><h4>只能选择一行！</h4></center><br>");
        return false;
    }
    if (data.rows.length == 1) {
        console.log(data);
        $('#firstMeterNo').val(data.rows[0].meterNo);
        firstMeterId = data.rows[0].meterId;
        document.getElementById("firstMeter").style.display = 'block';
        document.getElementById("showMeter").style.display = 'none';
    }
});
$('#chose_bills').on('show.bs.modal', function (e) {
    choseBillsAction.init();
    $('#saveId').click(function () {
        var data = xw.getTable().getData(true);
        if ((data.rows.length) > 1) {
            bootbox.alert("<br><center><h4>只能选择一条申请单！</h4></center><br>");
        } else {
            applyId = data.rows[0].applyId;
            $('#chose_bills').modal('hide');
        }
    });
});
// $('#meterNo').blur(function(){
//     var meterNo = $('#meterNo').val();
//     $.ajax({
//         type: 'get',
//         url: hzq_rest + 'gasmtrmeter/?query={"meterNo":' + meterNo + '}',
//         dataType: 'json',
//         contentType: "application/json; charset=utf-8",
//         async: false,
//         success: function (data) {
//             if (data[0]) {
//                 bootbox.alert("<br><center><h4>表具编号存在，请检查是否输入有误</h4></center><br>");
//             }
//
//         }
//     });
// });
$("#save_btn").click("on", function () {
    if ($('#meterNo').val()) {
        var meterNo = $.trim($('#meterNo').val())
        //
        console.log(meterNo);
        var retData = Restful.findNQ(hzq_rest + 'gasmtrmeter/?query={"meterNo":"' + meterNo + '"}');
        console.log(retData);
        if (retData && retData.length > 0) {
            bootbox.alert("<br><center><h4>表具编号存在，请检查是否输入有误</h4></center><br>");
            return;
        }
    }
    else {
        bootbox.alert("<br><center><h4>表具编号不能为空,请重试</h4></center><br>");
        return;
    }
    if($('#isOrNo').val()){
        var isBack=$('#isOrNo').val();
        if(isBack==1){
            if (!$('#meterTypeId option:selected').val()) {
                bootbox.alert("<br><center><h4>一次表对应的表具类型不能为空,请重试</h4></center><br>");
                return;
            }
            if (!$('#resKind option:selected').val()) {
                bootbox.alert("<br><center><h4>物品种类不能为空,请重试</h4></center><br>");
                return;
            }
            if (!$('#factoryName option:selected').val()) {
                bootbox.alert("<br><center><h4>生产厂家不能为空,请重试</h4></center><br>");
                return;
            }
            if (!$('#meterModelId option:selected').val()) {
                bootbox.alert("<br><center><h4>规格型号不能为空,请重试</h4></center><br>");
                return;
            }
            if (!$('#flowRange option:selected').val()) {
                bootbox.alert("<br><center><h4>一次表对应的流量范围不能为空,请重试</h4></center><br>");
                return;
            }
            if (!$('#meterDigit').val()) {
                bootbox.alert("<br><center><h4>表位数不能为空,请重试</h4></center><br>");
                return;
            }
            if (!$('#productiondate').val()) {
                bootbox.alert("<br><center><h4>生产日期不能为空,请重试</h4></center><br>");
                return;
            }
            if ($('#meterKind').val()) {
                var meterKind = $('#meterKind').val();
                console.log(meterKind);
                if (meterKind == 02) {
                    if (!$('#chipType').val()) {
                        bootbox.alert("<br><center><h4>IC卡表对应的芯片类型不能为空,请重试</h4></center><br>");
                        return;
                    }
                }
            }
            else {
                bootbox.alert("<br><center><h4>一次表对应的表具种类不能为空,请重试</h4></center><br>");
                return;
            }
        }else if(isBack==2){
            if (!$('#factoryName option:selected').val()) {
                bootbox.alert("<br><center><h4>生产厂家不能为空,请重试</h4></center><br>");
                return;
            }
            if (!$('#meterModelId option:selected').val()) {
                bootbox.alert("<br><center><h4>规格型号不能为空,请重试</h4></center><br>");
                return;
            }
            if (!$('#resKind option:selected').val()) {
                bootbox.alert("<br><center><h4>物品种类不能为空,请重试</h4></center><br>");
                return;
            }
            if (!$('#meterDigit').val()) {
                bootbox.alert("<br><center><h4>表位数不能为空,请重试</h4></center><br>");
                return;
            }
            if (!$('#productiondate').val()) {
                bootbox.alert("<br><center><h4>生产日期不能为空,请重试</h4></center><br>");
                return;
            }
        }
    }else{
        bootbox.alert("<br><center><h4>修正表标记不能为空,请重试</h4></center><br>");
    }
    var meterJson = $("form").serializeObject();
    var depositoryJson = new Array();
    var date = new Date();
    //生产UUID
    var meterId = $.md5(JSON.stringify($("form").serializeObject()) + new Date().getTime());
    depositoryJson.push({
        "meterId": meterId,
        "stockStatus": "1",
        "createdTime": date,
        "lastStockStatus": "0",
        "applyId": applyId,
        "changeDate": moment().format('YYYY-MM-DDTHH:mm:ss'),
        "areaId": area_id
    });
    meterJson['meterId'] = meterId;
    meterJson['depositoryId'] = depositoryId;
    meterJson['stockState'] = "1";
    meterJson['flow'] = $('#flowRange').val();
    meterJson['isBackup'] = '1';
    meterJson['meterNo'] = $.trim($('#meterNo').val());
    meterJson['meterStatus'] = '1';
    meterJson['refMeterId']=firstMeterId;
    console.log(meterJson);
    console.log(meterNo);
    if (depositoryId == '2c91808300000012015d1285db070129') {
        meterJson['isBackup'] = '2';
    }
    console.log(meterJson);
    var submitJson = {
        "sets": [
            {"txid": "1", "body": meterJson, "path": "/gasmtrmeter/", "method": "post"},
            {"txid": "2", "body": depositoryJson, "path": "/gasmtrstockhistory/", "method": "post"}
        ]
    };
    var result = Restful.insert("/hzqs/dbc/pbtxs.do?fh=SELDBC0000000J00&resp=bd", submitJson)
    if (result.results[0]["result"]['success'] && result.results[1]["result"]['success']) {
        bootbox.dialog({
            message: "添加成功",
            buttons: {
                OK: {
                    label: "确定",
                    className: "btn-primary",
                    callback: function () {
                        history.go(-1)
                    }
                }
            }
        });
    }
});
$("#bitch_add").click("on", function () {
    if ($('#meterNo').val()) {
        var meterNo = $.trim($('#meterNo').val())
        console.log(meterNo);
        var retData = Restful.findNQ(hzq_rest + 'gasmtrmeter/?query={"meterNo":"' + meterNo + '"}')
        if (retData && retData.length > 0) {
            bootbox.alert("<br><center><h4>表具编号存在，请检查是否输入有误</h4></center><br>");
            return;
        }
    }
    else {
        bootbox.alert("<br><center><h4>表具编号不能为空,请重试</h4></center><br>");
        return;
    }
    if($('#isOrNo').val()){
        var isBack=$('#isOrNo').val();
        if(isBack==1){
            if (!$('#meterTypeId option:selected').val()) {
                bootbox.alert("<br><center><h4>表具类型不能为空,请重试</h4></center><br>");
                return;
            }
            if (!$('#resKind option:selected').val()) {
                bootbox.alert("<br><center><h4>物品种类不能为空,请重试</h4></center><br>");
                return;
            }
            if (!$('#factoryName option:selected').val()) {
                bootbox.alert("<br><center><h4>生产厂家不能为空,请重试</h4></center><br>");
                return;
            }
            if (!$('#meterModelId option:selected').val()) {
                bootbox.alert("<br><center><h4>规格型号不能为空,请重试</h4></center><br>");
                return;
            }
            if (!$('#flowRange option:selected').val()) {
                bootbox.alert("<br><center><h4>流量范围不能为空,请重试</h4></center><br>");
                return;
            }
            if (!$('#meterDigit').val()) {
                bootbox.alert("<br><center><h4>表位数不能为空,请重试</h4></center><br>");
                return;
            }
            if (!$('#productiondate').val()) {
                bootbox.alert("<br><center><h4>生产日期不能为空,请重试</h4></center><br>");
                return;
            }
            if ($('#meterKind').val()) {
                var meterKind = $('#meterKind').val();
                console.log(meterKind);
                if (meterKind == 02) {
                    if (!$('#chipType').val()) {
                        bootbox.alert("<br><center><h4>IC卡表对应的芯片类型不能为空,请重试</h4></center><br>");
                        return;
                    }
                }
            }
            else {
                bootbox.alert("<br><center><h4>表具种类不能为空,请重试</h4></center><br>");
                return;
            }
        }else if(isBack==2){
            if (!$('#factoryName option:selected').val()) {
                bootbox.alert("<br><center><h4>生产厂家不能为空,请重试</h4></center><br>");
                return;
            }
            if (!$('#meterModelId option:selected').val()) {
                bootbox.alert("<br><center><h4>规格型号不能为空,请重试</h4></center><br>");
                return;
            }
            if (!$('#resKind option:selected').val()) {
                bootbox.alert("<br><center><h4>物品种类不能为空,请重试</h4></center><br>");
                return;
            }
            if (!$('#meterDigit').val()) {
                bootbox.alert("<br><center><h4>表位数不能为空,请重试</h4></center><br>");
                return;
            }
            if (!$('#productiondate').val()) {
                bootbox.alert("<br><center><h4>生产日期不能为空,请重试</h4></center><br>");
                return;
            }
        }
    }else{
        bootbox.alert("<br><center><h4>修正表标记不能为空,请重试</h4></center><br>");
    }
    var meterJson = $("form").serializeObject();
    var depositoryJson = new Array();
    var date = new Date();
    //生产UUID
    var meterId = $.md5(JSON.stringify($("form").serializeObject()) + new Date().getTime());
    depositoryJson.push({
        "meterId": meterId,
        "stockStatus": "1",
        "createdTime": date,
        "lastStockStatus": "0",
        "applyId": applyId,
        "changeDate": moment().format('YYYY-MM-DDTHH:mm:ss'),
        "areaId": area_id
    });
    meterJson['meterId'] = meterId;
    meterJson['depositoryId'] = depositoryId;
    meterJson['stockState'] = "1";
    meterJson['flow'] = $('#flowRange').val();
    meterJson['isBackup'] = '1';
    meterJson['meterNo'] = $.trim($('#meterNo').val());
    meterJson['meterStatus'] = '1';
    meterJson['refMeterId']=firstMeterId;
    if (depositoryId == '2c91808300000012015d1285db070129') {
        meterJson['isBackup'] = '2';
    }
    // for (var key in meterJson) {
    //     if (!meterJson[key]) {
    //         console.log(0)
    //         bootbox.alert("输入项不能为空！");
    //         return false;
    //     }
    // }
    console.log(meterJson);
    var submitJson = {
        "sets": [
            {"txid": "1", "body": meterJson, "path": "/gasmtrmeter/", "method": "post"},
            {"txid": "2", "body": depositoryJson, "path": "/gasmtrstockhistory/", "method": "post"}
        ]
    };
    var result = Restful.insert("/hzqs/dbc/pbtxs.do?fh=SELDBC0000000J00&resp=bd", submitJson)
    // console.log("submit:result:" + JSON.stringify(result));
    // console.log("submit::" + JSON.stringify(submitJson));
    if (result.results[0]["result"]['success'] && result.results[1]["result"]['success']) {
        bootbox.dialog({
            message: "添加成功，是否继续添加?",
            title: "请选择",
            buttons: {
                Cancel: {
                    label: "返回",
                    className: "btn-default",
                    callback: function () {
                        history.go(-1)
                    }
                }
                , OK: {
                    label: "继续",
                    className: "btn-primary",
                    callback: function () {
                        $('#meterNo').val("");
                    }
                }
            }
        });
    }
});
$("#cancel_btn").click("on", function () {
    window.history.back(-1);
});

var firstMeterSpecAction = function () {
    return {
        init: function () {
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
                    checkboxes: true,
                    checkAllToggle: true,
                    //----------------基本restful地址---
                    restbase: 'gasmtrmeter?query={"factoryId":"'+factory+'"}',
                    key_column: 'meterId',
                    coldefs: [
                        {
                            col: "meterId",
                            friendly: "表具Id",
                            unique: "true",
                            hidden: true,
                            nonedit: "nosend",
                            index: 1
                        },
                        // {
                        //     col: "depositoryId",
                        //     friendly: "仓库名称",
                        //     format: depositoryFormat,
                        //     sorting: false,
                        //     index: 2
                        // },
                        {
                            col: "meterNo",
                            friendly: "表编号",
                            sorting: true,
                            index: 3
                        },
                        {
                            col: "meterTypeId",
                            friendly: "表具类型",
                            format: meterTypeIdFormat,
                            sorting: true,
                            index: 4
                        },
                        {
                            col: "reskindId",
                            friendly: "物品种类",
                            format: resKindIdFormat,
                            sorting: true,
                            hidden: true,
                            index: 5
                        },
                        {
                            col: "factoryId",
                            friendly: "厂家",
                            format: factoryFormat,
                            sorting: true,
                            index: 6
                        },
                        {
                            col: "meterModelId",
                            friendly: "表具规格型号",
                            format: meterSpecIdFormat,
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
                            col: "direction",
                            friendly: "进气方向",
                            format: GasModCtm.meterDirectionFormat,
                            sorting: true,
                            index: 9
                        },
                        {
                            col: "productionDate",
                            friendly: "生产日期",
                            format: dateFormat,
                            sorting: true,
                            index: 10
                        },
                        {
                            col: "meterStatus",
                            friendly: "表具状态",
                            format: GasSysBasic.meterStatus,
                            sorting: true,
                            index: 11
                        },
                        {
                            col: "meterDigit",
                            friendly: "表位数",
                            sorting: true,
                            index: 12
                        },
                        {
                            col: "reading",
                            friendly: "表读数",
                            sorting: true,
                            index: 13
                        },
                        {
                            col: "onlineDate",
                            friendly: "上线日期",
                            format: dateFormat,
                            sorting: true,
                            index: 14
                        },
                        {
                            col: "meterKind",
                            friendly: "表具种类",
                            format: GasModCtm.meterKindFormat,
                            hidden: true,
                            index: 15
                        },
                        {
                            col: "stockState",
                            friendly: "库存状态",
                            format: GasModCtm.stockStateFormat,
                            sorting: true,
                            index: 16
                        }
                    ],

                    // 查询过滤条件
                    findFilter: function () {
                        var meterNo;

                        if ($('#MeterNo1').val()) {
                            meterNo = RQLBuilder.equal('meterNo', $('#MeterNo1').val());
                        }
                        var factoryId = RQLBuilder.equal("factoryId", factory);
                        var filter = RQLBuilder.and([
                            meterNo,factoryId
                        ]);
                        xw.setRestURL(hzq_rest + "gasmtrmeter")
                        return filter.rql();
                    }
                })
        }

    }
}();