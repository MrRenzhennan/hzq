/**
 * Created by alex on 2017/6/30.
 */
var href = document.location.href;
var meterid = href.substring(href.indexOf("?") + 1, href.lenth);
var dateFormat = function (val) {
    if(val){
    var date = val.substring(0, 10);
    return date;
    }
};
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
    ref_display: 'meterTypeName'
});
//物品种类Helper
var resKindHelper = RefHelper.create({
    ref_url: 'gasmtrreskind',
    ref_col: 'reskindId',
    ref_display: 'reskindName'
});
//流量范围Helper
var meterFlowHelper = RefHelper.create({
    ref_url: 'gasmtrmeterflow',
    ref_col: 'meterFlowId',
    ref_display: 'flowName'
});
var depositoryFormat = function () {
    return {
        f: function (val) {
            return depositoryHelper.getDisplay(val);
        }
    }
}();
$.map(factoryHelper.getData(), function (value, key) {
    $('#factoryName').append('<option value="' + key + '">' + value + '</option>');
});
$.map(meterModelHelper.getData(), function (value, key) {
    $('#meterModelId').append('<option value="' + key + '">' + value + '</option>');
});
$.map(meterTypeIdHelper.getData(), function (value, key) {
    $('#meterTypeId').append('<option value="' + key + '">' + value + '</option>');
});
$.map(resKindHelper.getData(), function (value, key) {
    $('#resKind').append('<option value="' + key + '">' + value + '</option>');
});
$.map(meterFlowHelper.getData(), function (value, key) {
    $('#flowRange').append('<option value="' + key + '">' + value + '</option>');
});
//厂家级联
var factory;
var model;
$('#factoryName').on("click", function () {
    $('#meterModelId').html('<option value="" selected>全部</option>').trigger("change");
    factory=$(this).val();
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
                ref_url: 'gasmtrmeterspec/' + meterModel,
                ref_col: "meterModelId",
                ref_display: "meterModelName",
            });
            $.map(meterSpecHelper.getData(), function (value, key) {
                $('#meterModelId').append('<option value="' + key + '">' + value + '</option>');
            });
        }
    });
});
$('#meterModelId').on("click", function () {
    $('#flowRange').html('<option value="">全部</option>').trigger("change");
    model=$(this).val();
    var selectQuery
    if(factory){
        selectQuery= RQLBuilder.and([
            RQLBuilder.equal("factoryId", factory),
            RQLBuilder.equal("meterModelId", model)
        ]).rql();
    }else{
        selectQuery= RQLBuilder.and([
            RQLBuilder.equal("meterModelId", model)
        ]).rql();
    }


    $.ajax({
        type: 'get',
        url: hzq_rest + 'gasmtrmeterfactoryspec/?query='+selectQuery,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (data) {
            var meterFlowId=data[0].meterFlowId;
            var meterFlow = Restful.findNQ(hzq_rest + 'gasmtrmeterflow?query={"meterFlowId":"'+meterFlowId+'"}');
            console.log(meterFlow[0].flowCode);
            $('#flowRange').val(meterFlow[0].flowName);
            // $('#flow').val(meterFlow[0].ratingFlux);
            $('#flowRange').html('<option value="">全部</option>'+
                '<option value="'+meterFlowId+'">'+meterFlow[0].flowName+'</option>')
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
$.ajax({
    url: hzq_rest + 'gasmtrmeter?query={"meterId":"' + meterid + '"}',
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
                    $(this).val(data[0][$(this).attr('name')]);
                }
            });
        }
    }
});
$("#save_btn").click("on", function () {
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
    if (!$('#displayType option:selected').val()) {
        bootbox.alert("<br><center><h4>显示方式不能为空,请重试</h4></center><br>");
        return;
    }
    if (!$('#controlType option:selected').val()) {
        bootbox.alert("<br><center><h4>信控模式不能为空,请重试</h4></center><br>");
        return;
    }
    // if (!$('#chipType option:selected').val()) {
    //     bootbox.alert("<br><center><h4>芯片类型不能为空,请重试</h4></center><br>");
    //     return;
    // }
    if (!$('#powerType option:selected').val()) {
        bootbox.alert("<br><center><h4>供电方式不能为空,请重试</h4></center><br>");
        return;
    }
    if (!$('#meterDigit').val()) {
        bootbox.alert("<br><center><h4>表位数不能为空,请重试</h4></center><br>");
        return;
    }
    var meterJson = $("form").serializeObject();
    //生产UUID
    meterJson['meterId'] = meterid;
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
            if(e.success==true){
                bootbox.dialog({
                    message: "修改成功?",
                    title: "提示信息",
                    buttons: {
                        OK: {
                            label: "继续",
                            className: "btn-primary",
                            callback: function () {
                                history.go(-1);
                            }
                        }
                    }
                });

            }
        }
    })
});
$("#cancel_btn").click("on", function () {
    history.go(-1);
});
