/**
 * Created by alex on 2017/6/8.
 */
ComponentsPickers.init();
var xw;
var userInfo = JSON.parse(localStorage.getItem('user_info'));
var area_id = userInfo.area_id;
var user_id = userInfo.userId;
var areas = new Array();
var where = "";
areas.push(area_id);
//查询areaId下级areaId
var queryCondion = RQLBuilder.and([
    RQLBuilder.equal("status", "1"),
    RQLBuilder.equal("parentAreaId", area_id)
]).rql();
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
var AreaHelper = RefHelper.create({
    ref_url: 'gasbizarea?query={"areaId":{"$in":' + JSON.stringify(areas) + '}}',
    ref_col: "areaId",
    ref_display: "areaName",
    "sort": "posCode"
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
var AreaFormat = function () {
    return {
        f: function (val) {
            return AreaHelper.getDisplay(val);
        }
    }
}();

$.each(AreaHelper.getRawData(), function (index, row) {
    $('#area_name').append('<option value="' + row.areaId + '">' + row.areaName + '</option>');
});
//仓库Helper
var depositoryHelper = RefHelper.create({
    ref_url: 'gasmtrdepository',
    ref_col: 'depositoryId',
    ref_display: 'depositoryName'
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
    "wheres": "func_level='2' and area_id in (" + areas + ") order by pos_code",
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
        var obj = $("#depositoryName")
        var sHtmlTest = "";
        for (var o in data.rows) {
            var listText = data.rows[o].depositoryName;
            var listValue = data.rows[o].depositoryId;
            sHtmlTest += "<option value='" + listValue + "'>" + listText + "</option>";
        }
        obj.append(sHtmlTest);
    }
});

$(document).on('click', "#stockingmeter", function () {
    var row = JSON.parse($(this).attr("data-kind"));
    var inventoryId = row.meterInventoryId;
    localStorage.setItem("meter_stocking", JSON.stringify(inventoryId));
    localStorage.setItem("meter_depository", JSON.stringify(row.depositoryId));
    window.location = "customer/dm/stocktaking_meter_plan.html"

});
var queryStockingMeterAction = function () {
    var detailedInfoFormat = function () {
        return {
            f: function (val, row) {
                if(row.status==1){
                    return "<a   id='stockingmeter' data-kind='" + JSON.stringify(row) + "'>" + '盘点' + "</a>";
                }else if(row.status==9){
                    return "<a>" + '已作废' + "</a>";
                }
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
                "cols": "*",
                "froms": "gas_mtr_meter_inventory",
                "wheres": 'area_id in(' + areas + ')',
                "page": true,
                "limit": 50
            };
            xw1 = XWATable.init(
                {
                    //----------------table的选项-------
                    pageSize: 10, 			//Initial pagesize
                    columnPicker: true,         //Show the columnPicker button
                    sorting: false,
                    transition: 'fade',  //(bounce, fade, flip, rotate, scroll, slide).
                    checkboxes: true,           //Make rows checkable. (Note. You need a column with the 'unique' property)
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
                        {
                            col: "areaId",
                            friendly: "供气区域",
                            format: AreaFormat,
                            readonly: "readonly",
                            index: 2
                        },
                        {
                            col: "createdBy",
                            friendly: "创建人",
                            readonly: "readonly",
                            index: 3
                        },
                        {
                            col: "createdTime",
                            friendly: "创建时间",
                            sorting: false,
                            index: 4
                        },
                        {
                            col: "inventoryPlanCount",
                            friendly: "计划盘点数量",
                            sorting: false,
                            index: 5
                        },
                        {
                            col: "inventoryCount",
                            friendly: "实际盘点数量",
                            readonly: "readonly",
                            index: 6
                        },
                        {
                            col: "results",
                            friendly: "盘点结果",
                            format: GasModMtr.stockTakingEnumFormat,
                            readonly: "readonly",
                            index: 7
                        },
                        {
                            col: "meterInventoryId",
                            friendly: "操作",
                            unique: true,
                            sorting: false,
                            format: detailedInfoFormat,
                            index: 23
                        }
                    ],
                    findFilter: function () {

                        var areaId = $('#area_name option:selected').val();
                        var whereinfo = "";
                        if (areaId) {
                            whereinfo += "area_id = '" + areaId + "' and ";
                        }
                        bd = {
                            "cols": "*",
                            "froms": "gas_mtr_meter_inventory",
                            "wheres": whereinfo + "area_id in(" + areas + ")",
                            "page": true,
                            "limit": 50
                        };
                        console.log(bd);
                        xw1.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)));
                    }
                }
            );


        }

    }
}();
var queryMeterAction = function () {
    return {
        init: function () {
            this.reload();
        },
        reload: function () {
            $('#divtable2').html('');
            var bd = {
                "cols": "*",
                "froms": "gas_mtr_meter",
                "wheres": '1=0',
                "page": true,
                "limit": 50
            };
            xw = XWATable.init(
                {
                    //----------------table的选项-------
                    divname: "divtable2",
                    pageSize: 10, 			//Initial pagesize
                    columnPicker: true,         //Show the columnPicker button
                    sorting: false,
                    findbtn: "find_button2",
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
                        }
                    ],
                    findFilter: function () {

                        var depositoryId = $('#depositoryName').val();
                        var whereinfo = "";
                        if (depositoryId) {
                            whereinfo += "depository_id = '" + depositoryId + "' and ";
                        }
                        bd = {
                            "cols": "*",
                            "froms": "gas_mtr_meter",
                            "wheres": whereinfo + "stock_state='1'",
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
$('#makePlan').click(function () {
    var depositoryId = $("#depositoryName").val();
    var areaName;
    var planNum = 0;
    var bd = {
        "cols": "area_id",
        "froms": "gas_mtr_depository",
        "wheres": "depository_id='" + depositoryId + "'",
        "page": false
    };
    var bd1 = {
        "cols": "*",
        "froms": "gas_mtr_meter",
        "wheres": "depository_id='" + depositoryId + "' and stock_state='1'",
        "page": false
    };
    $.ajax({
        type: 'get',
        url: '/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd&bd=' + JSON.stringify(bd),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (data) {
            console.log(data.rows[0].areaId);
            areaName = data.rows[0].areaId;
        }
    });
    $.ajax({
        type: 'get',
        url: '/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd&bd=' + JSON.stringify(bd1),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (data) {
            if (data.rows) {
                console.log(data.rows.length)
                planNum = data.rows.length
            }
            // areaName=data.rows[0].areaId;
        }
    });
    var planStock={
        "areaId": areaName,
        "remark": $('#remark').val(),
        "createdBy": user_id,
        "modifiedBy": user_id,
        "inventoryPlanCount": planNum,
        "createdTime": moment().format('YYYY-MM-DDTHH:mm:ss'),
        "modifiedTime": moment().format('YYYY-MM-DDTHH:mm:ss'),

    }
    var depositoryStatus={
        "depositoryId": depositoryId,
        "status": "3"
    }
    console.log(planStock);
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: hzq_rest + "gasmtrmeterinventory",
        type: "POST",
        dataType: "json",
        async: false,
        data: JSON.stringify(planStock),
        success: function (e) {
            console.log(e)
            if(e.success==true){
                $.ajax({
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    url: hzq_rest + "gasmtrdepository",
                    type: "put",
                    dataType: "json",
                    async: false,
                    data: JSON.stringify(depositoryStatus),
                    success: function (e) {
                        console.log(e)
                        if(e.success==true){
                            console.log(11111111111111)
                        }
                    }
                })
            }
        }
    })


});
$('#invalid').click(function () {
    var selrows = xw1.getTable().getData(true);
    if (selrows.rows.length == 0) {
        bootbox.alert("<br><center><h4>请选择一条数据！</h4></center><br>");
        return false;
    }
    if (selrows.rows.length > 1) {
        bootbox.alert("<br><center><h4>只能选择一行！</h4></center><br>");
        return false;
    }
    var primary=selrows.rows[0].meterInventoryId;
    var depositoryId=selrows.rows[0].depositoryId;
    var stockingStatus={
        "meterInventoryId": primary,
        "status": "9"
    }
    var depositoryStatus={
        "depositoryId": depositoryId,
        "status": "1"
    }
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: hzq_rest + "gasmtrmeterinventory",
        type: "put",
        dataType: "json",
        async: false,
        data: JSON.stringify(stockingStatus),
        success: function (e) {
            console.log(e)
            if(e.success==true){
                $.ajax({
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    url: hzq_rest + "gasmtrdepository",
                    type: "put",
                    dataType: "json",
                    async: false,
                    data: JSON.stringify(depositoryStatus),
                    success: function (e) {
                        console.log(e)
                        if(e.success==true){
                            console.log(11111111111111)
                        }
                    }
                })
            }
        }
    })
});
