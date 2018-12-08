/**
 * Created by alex on 2017/7/15.
 */
var xw;
var area_id = JSON.parse(localStorage.getItem("user_info")).area_id;
var areas = new Array();
areas.push(area_id)
//查询areaId下级areaId
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
var AreaHelper1 = RefHelper.create({
    ref_url: 'gasbizarea?query={"areaId":{"$in":' + JSON.stringify(areas) + '}}',
    ref_col: "areaId",
    ref_display: "areaName",
    "sort":"posCode"
});
$.each(AreaHelper1.getRawData(), function (index, row) {
    $('#find_area').append('<option value="' + row.areaId + '">' + row.areaName + '</option>');
});
var batchTypeEnum = {"B_LSKS": "批量开栓", "B_CHANGEM": "批量换表","B_REMOVEM":"批量拆除"};
var billTypeFormat = function () {
    return {
        f: function (val) {
            return batchTypeEnum[val];
        }
    }
}();
var batchTaskAction = function () {
    // 供气区域helper
    var AreaHelper = RefHelper.create({
        ref_url: "gasbizarea",
        ref_col: "areaId",
        ref_display: "areaName"
    });
    var UnitHelper = RefHelper.create({
        ref_url: "gassysunit",
        ref_col: "unitId",
        ref_display: "unitName"
    });
    //抄表本
    var BookHelper = RefHelper.create({
        ref_url: "gasmrdbook",
        ref_col: "bookId",
        ref_display: "bookCode"
    });
    var AreaFormat = function () {
        return {
            f: function (val) {
                return AreaHelper.getDisplay(val);
            }
        }
    }();
    var UnitFormat = function () {
        return {
            f: function (val) {
                return UnitHelper.getDisplay(val);
            }
        }
    }();
    var bookFormat = function () {
        return {
            f: function (val) {
                return BookHelper.getDisplay(val);
            }
        }
    }();
    var detailedInfoFormat = function () {
        return {
            f: function (val, row) {
                if (row.batchState!="5") {
                    // return "<a  data-target='#allot' id='distribution'  data-toggle='modal' data-kind='" + JSON.stringify(row) + "'>" + '改派' + "</a>";
                    return ""
                } else {
                    return "<a  data-target='#allot' id='distribution'  data-toggle='modal' data-kind='" + JSON.stringify(row) + "'>" + '分派' + "</a>";
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
            // 分公司 select init
            // $.each(GasModSys.areaHelper.getRawData(), function (idx, row) {
            //     $('#find_area').append('<option value="' + row.areaId + '" name="' + row.areaId + '">' + row.areaName + '</option>');
            //
            // });

        },
        reload: function () {
            areas.push(area_id)
            //查询areaId下级areaId
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
            })
            console.log(areas);
            $('#divtable').html('');
            xw = XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize: 10, 			//Initial pagesize
                    columnPicker: true,         //Show the columnPicker button
                    sorting: true,
                    transition: 'fade',  //(bounce, fade, flip, rotate, scroll, slide).
                    checkboxes: false,           //Make rows checkable. (Note. You need a column with the 'unique' property)
                    checkAllToggle: false,        //Show the check-all toggle//+RQLBuilder.like("KEYY", "a").rql()
                    //----------------基本restful地址---
                    restbase: 'gascsrworkbillbatch/?query={"areaId":{"$in":' + JSON.stringify(areas) + '}}',
                    key_column: "workBillBatchId",
                    //---------------行定义
                    coldefs: [
                        {
                            col: "areaId",
                            friendly: "供气区域",
                            format: AreaFormat,
                            sorting: false,
                            index: 1
                        },
                        {
                            col: "batchCode",
                            friendly: "批量编号",
                            index: 2
                        },
                        {
                            col: "ownUnit",
                            friendly: "所属机构",
                            format: UnitFormat,
                            sorting: false,
                            index: 3
                        },
                        {
                            col: "bookId",
                            friendly: "抄表本号",
                            format: bookFormat,
                            index: 4
                        },
                        {
                            col: "batchType",
                            friendly: "批量类型",
                            format: billTypeFormat,
                            sorting: false,
                            index: 5
                        },
                        {
                            col: "bizName",
                            friendly: "业务名称",
                            sorting: false,
                            hidden: true,
                            index: 6
                        },
                        {
                            col: "batchState",
                            friendly: "批量状态",
                            format:GasModCtm.batchStateFormat,
                            sorting: false,
                            index: 7
                        },
                        {
                            col: "sendDate",
                            friendly: "派工时间",
                            format: dateFormat,
                            index: 8
                        },
                        {
                            col: "complete",
                            friendly: "完成时间",
                            format: dateFormat,
                            index: 9
                        },
                        {
                            col: "cancelDate",
                            friendly: "作废时间",
                            format: dateFormat,
                            index: 10
                        },
                        {
                            col: "batchContent",
                            friendly: "批量内容",
                            sorting: false,
                            index: 11
                        },
                        {
                            col: "workBillBatchId",
                            friendly: "操作",
                            readonly: "readonly",
                            format: detailedInfoFormat,
                            sorting: false,
                            index: 13
                        }
                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var queryUrl = hzq_rest + "gascsrworkbillbatch";
                        var querys = new Array();
                        if ($('#find_area').val()) {
                            querys.push(RQLBuilder.like("areaId", $('#find_area').val()));
                        }
                        if ($('#find_chargeUnit').val()) {
                            querys.push(RQLBuilder.equal("ownUnit", $('#find_chargeUnit').val()));
                        }
                        if ($('#batch_code').val()) {
                            querys.push(RQLBuilder.equal("batchCode", $('#batch_code').val()));
                        }
                        if ($('#find_batchStatus').val()) {
                            querys.push(RQLBuilder.like("batchState", $('#find_batchStatus').val()));
                        }
                        if ($('#batchType').val()) {
                            querys.push(RQLBuilder.like("batchType", $('#batchType').val()));
                        }
                        if ($('#find_start_date').val()) {
                            querys.push(RQLBuilder.condition("sendDate", "$gte", "to_date('" + $('#find_start_date').val() + " 00:00:00" + "','yyyy-MM-dd HH24:mi:ss')"));
                        }
                        if ($('#find_end_date').val()) {
                            querys.push(RQLBuilder.condition("sendDate", "$lte", "to_date('" + $('#find_end_date').val() + " 23:59:59" + "','yyyy-MM-dd HH24:mi:ss')"));
                        }
                        if ($('#find_start_date1').val()) {
                            querys.push(RQLBuilder.condition("completeDate", "$gte", "to_date('" + $('#find_start_date1').val() + " 00:00:00" + "','yyyy-MM-dd HH24:mi:ss')"));
                        }
                        if ($('#find_end_date1').val()) {
                            querys.push(RQLBuilder.condition("completeDate", "$lte", "to_date('" + $('#find_end_date1').val() + " 23:59:59" + "','yyyy-MM-dd HH24:mi:ss')"));
                        }
                        console.log(querys);
                        querys.push(RQLBuilder.condition_fc("areaId", "$in", JSON.stringify(areas)));
                        xw.setRestURL(hzq_rest + 'gascsrworkbillbatch');
                        return RQLBuilder.and(querys).rql();
                    }
                }
            );
        }

    }
}();
var batchId;
$(document).on('click', "#distribution", function () {
    var paramurl = "/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd";
    var param = {
        "cols": "unit_id,unit_name",
        "froms": "gas_sys_unit",
        "wheres": "status=1 and area_id in (" + areas + ") order by unit_id",
        "page": true,
    };
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: 'POST',
        url: paramurl,
        async: false,
        data: JSON.stringify(param),
//		url: hzq_rest+'gassysunit?query={"areaId":{"$in":'+JSON.stringify(areas)+'}}',
        success: function (data) {
            var obj = $("#find_unit")
            var sHtmlTest = "";
            for (var o in data.rows) {
                var listText = data.rows[o].unitName;
                var listValue = data.rows[o].unitId;
                sHtmlTest += "<option value='" + listValue + "'>" + listText + "</option>";

            }
            obj.append(sHtmlTest);
        }
    });
    var row = JSON.parse($(this).attr("data-kind"));
    batchId = row.workBillBatchId;
    console.log(row);
    $('#sldh').val(row.batchCode);
    $('#ywmc').val(batchTypeEnum[row.bizName]);
    $('#gdlx').val(batchTypeEnum[row.batchType]);
    if(row.ownUnit){
        $("#find_unit ").val(row.ownUnit).trigger("change")
    }

});
$("#agree_btn").click("on", function () {
    // var batchJson = new Array();
    // batchJson['workBillBatchId'] = batchId;
    var param = {
        "ownUnit": $("#find_unit").val(),
        "batchState":"1",
        // "modifiedTime":new Date(),
        // "modifiedBy":userinfo.userId
    }
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: hzq_rest + "gascsrworkbillbatch/" + batchId,
        type: "PUT",
        dataType: "json",
        async: false,
        data: JSON.stringify(param),
        success: function (e) {
            console.log(e);
            if (e.success == true) {
                bootbox.alert("<br><center><h4>修改成功</h4></center><br>");
                location.reload();
            }
        }
    })
});