/**
 * Created by alex on 2017/6/19.
 */
ComponentsPickers.init();
SideBar.init();
var area_id = JSON.parse(localStorage.getItem("user_info")).area_id;
var inputFactoryQuery = RQLBuilder.and([
    RQLBuilder.equal("areaId", area_id),
    RQLBuilder.equal("funcLevel", "2")
]).rql();
//源仓库Helper
var sourceDepositoryHelper = RefHelper.create({
    ref_url: "gasmtrdepository/?query=" + inputFactoryQuery,
    ref_col: 'depositoryId',
    ref_display: 'depositoryName'
});
//目标仓库Helper
var targetDepositoryHelper = RefHelper.create({
    ref_url: 'gasmtrdepository',
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
    ref_display: 'meterTypeName'
});
$.map(sourceDepositoryHelper.getData(), function (value, key) {
    $('#sourceDepositoryId').append('<option value="' + key + '">' + value + '</option>');
});
$.map(targetDepositoryHelper.getData(), function (value, key) {
    $('#targetDepositoryId').append('<option value="' + key + '">' + value + '</option>');
});
$.map(meterTypeIdHelper.getData(), function (value, key) {
    $('select[name="meterTypeId"]').append('<option value="' + key + '">' + value + '</option>');
});
$.map(factoryHelper.getData(), function (value, key) {
    $('select[name="factoryId"]').append('<option value="' + key + '">' + value + '</option>');
});
$.map(meterModelHelper.getData(), function (value, key) {
    $('select[name="meterModelId"]').append('<option value="' + key + '">' + value + '</option>');
});
$(function () {
    $('.file-loading').fileinput({
        language: 'zh'
    });
    $('#add_btn').click(function () {
        var item = "" +
            "<tr>" +
            "<td width='15px' class='remove_item'><span class='glyphicon glyphicon-remove'></span></td>" +
            "<td>" +
            " <select id='meterTypeId' name='meterTypeId' class='form-control input-middle select2me' data-placeholder='表具/备件名称..'>" +
            "<option value=''></option>" +
            "</select>" +
            "<span class='inputclear glyphicon glyphicon-remove-circle hide'></span>" +
            "</td>" +
            "<td>" +
            "<select id='factoryId' name='factoryId' class='form-control input-middle select2me' data-placeholder='生产厂家..'>" +
            "<option value=''></option>" +
            "</select>" +
            "<span class='inputclear glyphicon glyphicon-remove-circle hide'></span>" +
            "</td>" +
            "<td>" +
            "<select id='meterModelId' name='meterModelId' class='form-control input-middle select2me' data-placeholder='规格型号..'>" +
            "<option value=''></option>" +
            "</select>" +
            "<span class='inputclear glyphicon glyphicon-remove-circle hide'></span>" +
            "</td>" +
            "<td>" +
            "<select id='direction' name='direction' class='form-control input-middle select2me' data-placeholder='进气方向..'>" +
            "<option value=''></option>" +
            "<option value='L'>左</option>" +
            "<option value='R'>右</option>" +
            "</select>" +
            "<span class='inputclear glyphicon glyphicon-remove-circle hide'></span>" +
            "</td>" +
            "<td><input type='text' id='meterCount' name='meterCount'class='form-control' placeholder='数量'></td>" +
            "<td><input disabled type='text' id='stockMeterCount' name='stockMeterCount'class='form-control' placeholder='库存数量'></td>" +
            "</tr>";
        $('#tbody').append(item);
        $('.remove_item').click(function () {
            $(this).parent().remove();
        });
        $.map(meterTypeIdHelper.getData(), function (value, key) {
            $('select[name="meterTypeId"]').append('<option value="' + key + '">' + value + '</option>');
        });
        $.map(factoryHelper.getData(), function (value, key) {
            $('select[name="factoryId"]').append('<option value="' + key + '">' + value + '</option>');
        });
        $.map(meterModelHelper.getData(), function (value, key) {
            $('select[name="meterModelId"]').append('<option value="' + key + '">' + value + '</option>');
        });
    });
});
$('select[name="factoryId"]').on("change",function(){
    $('select[name="meterModelId"]').html('<option value="">请选择</option>');
    var meterSpecHelper = RefHelper.create({
        ref_url: 'gasmtrmeterspec/?query={"factoryId":"'+$(this).val()+'"}',
        ref_col: "meterModelId",
        ref_display: "meterModelName",
    });
    $.map(meterSpecHelper.getData(), function (value, key) {
        $('select[name="meterModelId"]').append('<option value="' + key + '">' + value + '</option>');
    });
});
$("#save_btn").click("on", function () {
    console.log("form:" + $.toJSON($("form").serializeObject()));
    var applyJson = $("form").serializeObject();
    var applyId = $.md5(JSON.stringify($("form").serializeObject()) + new Date().getTime());
    var meterTypeId = document.getElementsByName("meterTypeId");
    var factoryId = document.getElementsByName("factoryId");
    var meterModelId = document.getElementsByName("meterModelId");
    var meterCount = document.getElementsByName("meterCount");
    var applyDeatils = new Array();
    applyJson['applyId'] = applyId;
    applyJson['areaId'] = area_id;
    //格式化日期
    if (!applyJson.lastUseDate) {
        applyJson.lastUseDate = moment().format('YYYY-MM-DDTHH:mm:ss')
    } else {
        applyJson.lastUseDate = moment(applyJson.lastUseDate, "YYYY-MM-DD").format('YYYY-MM-DDTHH:mm:ss')
    }

    for (var key in applyJson) {
        if (!applyJson[key]) {
            bootbox.alert("输入项不能为空！");
            return false;
        }
    }
    for (var i = 0; i < meterTypeId.length; i++) {
        if (meterTypeId[i].value && factoryId[i].value && meterModelId[i].value && meterCount[i].value) {
            applyDeatils.push({
                "applyId": applyId,
                "meterTypeId": meterTypeId[i].value,
                "factoryId": factoryId[i].value,
                "meterModelId": meterModelId[i].value,
                "meterCount": meterCount[i].value
            });
            //
            // flow_sql.push({"fn":mtrCount[i].value,"rc":mtrCount[i].value,"cu":$("#find_countPer").val(),
            //     "su":$("#find_servicePer").val(),"bid":""+$.md5(unboltId+new Date().getTime()+i),
            //     "ai":$("#find_unit").val(),
            //     "bc":"000"+i,"bt":"1"});

        }
        else if (meterCount[i].value) {
            bootbox.alert("燃气表:" + meterTypeId[i].value + ",对应的燃气表数量不能为空");
            return;
        } else {
            continue;
        }
    }


    if (applyDeatils.length == 0) {
        bootbox.alert("输入项不能为空！");
        return false;
    }

    var submitJson = {
        "sets": [
            {"txid": "1", "body": applyJson, "path": "/gasmtrmeterapply/", "method": "post"},
            {"txid": "2", "body": applyDeatils, "path": "/gasmtrmeterapplydetail/", "method": "post"}
        ]
    }
    console.log("submit::" + JSON.stringify(submitJson));
    var result = Restful.insert("/hzqs/dbc/pbtxs.do?fh=SELDBC0000000J00&resp=bd&retobj=1", submitJson);
    if(result.results[0]["result"]['success'] && result.results[1]["result"]['success']) {
        flowjson = {"flow_def_id":"BJCRK","ref_no":applyJson.applyId,"operator":JSON.parse(localStorage.getItem("user_info")).userId,"be_orgs":$("#find_unit").val(),
            "flow_inst_id":applyId,
            "propstr2048":{"cusotmer":"BATCH","busitype":"一级库出库神清","applyId":applyId},
            "prop1str64":moment().format("YYYY-MM-DD HH:mm:ss"),
            "prop2str64":"二级库出库申请",
            "propstr128":"计量中心管理员",
            // "propstr256":flow_sql,
            "override_exists":false}

        console.log(flowjson)
        var flow_result = Restful.insert("/hzqs/psm/pbisn.do?fh=VFLSCGC000000J00&bd={}&resp=bd",flowjson);

        console.log("flow_result:"+JSON.stringify(flow_result));
        bootbox.alert("提交成功", function () {
            window.location = "customer/dm/level1_depository.html"
        });
    }
    console.log("submit:result:" + JSON.stringify(result));

});
$("#tab11").delegate("#meterCount", "focus", function () {
    var $obj = $(this),
        $tr = $obj.closest("tr");
    var depositoryId = $('#sourceDepositoryId').val();
    var factoryId = $tr.find('select[name="factoryId"] ').val();
    var meterTypeId = $tr.find('select[name="meterTypeId"] ').val();
    var meterModelId = $tr.find('select[name="meterModelId"] ').val();
    var direction=$tr.find('select[name="direction"] ').val();
    if (depositoryId) {
        if (factoryId && meterTypeId && meterModelId) {
            var noReceiveNum = 0;
            var sumStockNum = 0;
            var bd = {
                "cols": "count(*) as num",
                "froms": "gas_mtr_meter",
                "wheres": "factory_id='" + factoryId + "' and meter_type_id='" + meterTypeId + "' and meter_model_id='" + meterModelId + "' and depository_id='" + depositoryId + "' and stock_state='1' and direction='"+direction+"'",
                "page": false
            };
            var bd1 = {
                "cols": "sum(meter_count)as num",
                "froms": "gas_mtr_meter_apply_detail",
                "wheres": "apply_id in (select apply_id from gas_mtr_meter_apply where source_depository_id='" + depositoryId + "' and use_state='1') and factory_id='" + factoryId + "' and meter_type_id='" + meterTypeId + "' and meter_model_id='" + meterModelId + "'",
                "page": false
            };
            $.ajax({
                type: 'get',
                url: '/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd&bd=' + JSON.stringify(bd),
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                async: false,
                success: function (data) {
                    sumStockNum = data.rows[0].num;
                }
            });
            $.ajax({
                type: 'get',
                url: '/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd&bd=' + JSON.stringify(bd1),
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                async: false,
                success: function (data) {
                    noReceiveNum = data.rows[0].num;
                }
            });
            var stockNum = sumStockNum - noReceiveNum;
            if (stockNum >= 0) {
                $tr.find("#stockMeterCount").attr("value", stockNum);
            } else {
                $tr.find("#stockMeterCount").attr("value", 0);
            }
        } else {
            bootbox.alert("<br><center><h4>请填写完整你要领取的表具信息！</h4></center><br>");
        }
    } else {
        bootbox.alert("<br><center><h4>请先选择源仓库！</h4></center><br>");
    }

});
$("#tab11").delegate("#meterCount", "focusout", function () {
    var $obj = $(this),
        $tr = $obj.closest("tr");
    var meterCount = $tr.find('#meterCount').val();
    var stockMeterCount = $tr.find('#stockMeterCount').val();
    if(meterCount>stockMeterCount){
        bootbox.alert("<br><center><h4>源仓库库存不足！请重新填写领取数量</h4></center><br>");
    }
});