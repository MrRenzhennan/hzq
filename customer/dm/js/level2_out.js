/**
 * Created by alex on 2017/6/15.
 */
SideBar.init();
SideBar.activeCurByPage("level2_depository.html");
var area_id = JSON.parse(localStorage.getItem("user_info")).area_id;
var areas = new Array();
areas.push(area_id);
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
var applyNo = {
    "cols": "*",
    "froms": "gas_mtr_meter_apply",
    "wheres": "source_depository_id=target_depository_id and area_id in(" + areas + ")",
    "page": false
};
$.ajax({
    type: 'get',
    url: '/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd&bd=' + JSON.stringify(applyNo),
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    async: false,
    success: function (data) {
        if (data.rows) {
            for (var i = 0; i < data.rows.length; i++) {
                $('#find_applyNo').append('<option value="' + data.rows[i].applyId + '">' + data.rows[i].applyCode + '</option>');
            }
        }
    }
});
var depositoryHelper = RefHelper.create({
    ref_url: "gasmtrdepository",
    ref_col: 'depositoryId',
    ref_display: 'depositoryName'
});
var AreaHelper = RefHelper.create({
    ref_url: "gasbizarea",
    ref_col: "areaId",
    ref_display: "areaName"
});
var applyDetailHelper = RefHelper.create({
    ref_url: 'gasmtrmeterapply',
    ref_col: "applyId",
    ref_display: "applyId"
});
//厂家Helper
var factoryHelper = RefHelper.create({
    ref_url: 'gasmtrfactory',
    ref_col: 'factoryId',
    ref_display: 'factoryName'
});
//表具规格型号
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
var AreaFormat = function () {
    return {
        f: function (val) {
            return AreaHelper.getDisplay(val);
        }
    }
}();
var depositoryFormat = function () {
    return {
        f: function (val) {
            return depositoryHelper.getDisplay(val);
        }
    }
}();

var level2OutputAction = function () {
    var xw;
    var detailedInfoFormat = function () {
        return {
            f: function (val, row) {
                if (row.useState == 1 && row.approveState == 2) {
                    return '<a id="todetail" href="customer/dm/level2_out_detail1.html?refno=' + val + '">出库</a>';
                } else if(row.useState == 2){
                    return "已领取"
                }else if(row.approveState == 1){
                    return "审批中"
                }
            }
        }
    }();
    return {
        init: function () {
            this.reload();
        },
        reload: function () {
            //---------------行定义
            $('#divtable').html('');
            var bd = {
                "cols": "*",
                "froms": "gas_mtr_meter_apply",
                "wheres": "source_depository_id=target_depository_id and area_id in(" + areas + ") order by use_state asc",
                "page": true,
                "limit": 50
            };
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
                    restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
                    key_column: "applyId",
                    //---------------行定义
                    coldefs: [
                        {
                            col: "areaId",
                            friendly: "供气区域",
                            format: AreaFormat,
                            sorting: false,
                            ref_url: "gasbizarea",
                            ref_name: "areaName",
                            ref_value: "areaId",
                            index: 1
                        },
                        {
                            col: "applyCode",
                            friendly: "申请单编号",
                            readonly: "readonly",
                            sorting: false,
                            index: 2
                        },
                        {
                            col: "sourceDepositoryId",
                            friendly: "出库仓库",
                            format: depositoryFormat,
                            sorting: false,
                            index: 3
                        },
                        {
                            col: "applyUserName",
                            friendly: "申请人",
                            sorting: false,
                            index: 4
                        },
                        {
                            col: "lastUseDate",
                            friendly: "领取截止日期",
                            format: dateFormat,
                            sorting: true,
                            index: 5
                        },
                        {
                            col: "remark",
                            friendly: "领用原因",
                            sorting: false,
                            index: 6
                        },
                        {
                            col: "approveState",
                            friendly: "审核状态",
                            sorting: false,
                            format: GasModCtm.applyStateFormat,
                            index: 7
                        },
                        {
                            col: "applyId",
                            friendly: "操作",
                            sorting: false,
                            format: detailedInfoFormat,
                            index: 8
                        }
                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var find_applyNo = $('#find_applyNo option:selected').val();
                        var whereinfo = "";
                        if (find_applyNo) {
                            whereinfo += "apply_id = '" + find_applyNo + "' and ";
                        }
                        bd = {
                            "cols": "*",
                            "froms": "gas_mtr_meter_apply",
                            "wheres": whereinfo + "source_depository_id=target_depository_id and area_id in(" + areas + ") order by use_state asc",
                            "page": true,
                            "limit": 50
                        };
                        xw.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)));
                    }
                }
            );
        }
    }
}();
$('#return').click(function () {
    window.location.href = "customer/dm/level2_depository.html"
});