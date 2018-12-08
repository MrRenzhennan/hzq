/**
 * Created by alex on 2017/8/26.
 */
var xw;
var BillQueryAction = function () {
    var AreaHelper = RefHelper.create({
        ref_url: "gasbizarea",
        ref_col: "areaId",
        ref_display: "areaName"
    });
    var AreaFormat = function () {
        return {
            f: function (val) {
                return AreaHelper.getDisplay(val);
            }
        }
    }();
    var UserHelper = RefHelper.create({
        ref_url: "gassysuser",
        ref_col: "userId",
        ref_display: "employeeName"
    });
    var UserFormat = function () {
        return {
            f: function (val) {
                return UserHelper.getDisplay(val);
            }
        }
    }();
    // 供气区域helper
    // var AreaHelper = RefHelper.create({
    //     ref_url: "gasbizarea",
    //     ref_col: "areaId",
    //     ref_display: "areaName"
    // });
    // var operatorHelper = RefHelper.create({
    //     ref_url: "gassysuser",
    //     ref_col: "userId",
    //     ref_display: "employeeName"
    // });
    // var AreaFormat = function () {
    //     return {
    //         f: function (val) {
    //             return AreaHelper.getDisplay(val);
    //         }
    //     }
    // }();
    // var operatorFormat = function () {
    //     return {
    //         f: function (val) {
    //             return operatorHelper.getDisplay(val);
    //         }
    //     }
    // }();
    // var detailedInfoFormat = function () {
    //     return {
    //         f: function (val) {
    //             return '<a id="todetail" href="customer/garbage_bill_input.html?refno=' + val + '">详情</a>';
    //         }
    //     }
    // }();
    return {
        init: function () {
            this.reload();
        },
        reload: function () {
            $('#divtable').html('');
            var bd = {
                "cols": "*",
                "froms": "gas_chg_waste_invoice_stock",
                "wheres": "parentid is null",
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
                    key_column: "stockId",
                    //---------------行定义
                    coldefs: [
                        {
                            col: "invoiceAmount",
                            friendly: "发票面值",
                            sorting: true,
                            index: 1
                        },
                        {
                            col: "boxNumber",
                            friendly: "箱号",
                            sorting: true,
                            index: 2
                        },
                        {
                            col: "startNumber",
                            friendly: "起始号",
                            sorting: true,
                            index: 3
                        },
                        {
                            col: "endNumber",
                            friendly: "终止号",
                            sorting: true,
                            index: 4
                        },
                        {
                            col: "invoiceCount",
                            friendly: "发票份数",
                            sorting: false,
                            index: 5
                        },
                        {
                            col: "inDate",
                            friendly: "入库日期",
                            format: dateFormat,
                            sorting: true,
                            index: 6
                        },
                        {
                            col: "inOperator",
                            friendly: "入库人",
                            format:UserFormat,
                            sorting: false,
                            index: 7
                        }
                        // {
                        //     col: "outDate",
                        //     friendly: "出库日期",
                        //     format: dateFormat,
                        //     sorting: true,
                        //     index: 8
                        // },
                        // {
                        //     col: "outAreaId",
                        //     friendly: "供气区域",
                        //     format:AreaFormat,
                        //     sorting: true,
                        //     index: 9
                        // },
                        // {
                        //     col: "outOperator",
                        //     friendly: "领取人",
                        //     sorting: true,
                        //     index: 10
                        // }
                        // {
                        //     col: "stockId",
                        //     friendly: "操作",
                        //     unique: true,
                        //     format: detailedInfoFormat,
                        //     sorting: false,
                        //     index: 11
                        // }
                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var whereinfo = '1=1';
                        if ($('#invoice').val()) {
                            whereinfo += " and invoice_amount='" + $('#invoice').val() + "'";
                        }
                        if ($('#boxNum').val()) {
                            whereinfo += " and box_number='" + $('#boxNum').val() + "'";
                        }
                        if ($('#startNum').val()) {
                            whereinfo += " and start_number='" + $('#startNum').val() + "'";
                        }
                        if ($('#endNum').val()) {
                            whereinfo += " and end_number='" + $('#endNum').val() + "'";
                        }
                        if ($("#find_start_date").val() && $("#find_end_date").val()) {
                            whereinfo += " and to_char(inDate,'yyyy-mm-dd')  between '" + $('#find_start_date').val() + "' and '" + $("#find_end_date").val() + "'";
                        } else if ($("#find_start_date").val() && !$("#find_end_date").val()) {
                            bootbox.alert("请输入截止日期")
                        } else if (!$("#find_start_date").val() && $("#find_end_date").val()) {
                            bootbox.alert("请输入起始日期")
                        }
                        bd = {
                            "cols": "*",
                            "froms": " gas_chg_waste_invoice_stock",
                            "wheres": whereinfo + "and parentid is null",
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
$("#add").click("on", function () {
    if (!$('#invoice').val()) {
        bootbox.alert("<br><center><h4>请先选择入库发票面值</h4></center><br>");
        return;
    }
    window.location.href="customer/garbage_bill/garbage_bill_input.html?"+$('#invoice').val()
});