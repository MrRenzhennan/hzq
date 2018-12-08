/**
 * Created by Administrator on 2017/8/28.
 */
/**
 * Created by alex on 2017/8/26.
 */
var xw;
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
var BillCheckAction = function () {

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
    // var operatorFormat = function () {
    //     return {
    //         f: function (val) {
    //             return operatorHelper.getDisplay(val);
    //         }
    //     }
    // }();
    // var detailedInfoFormat = function () {
    //     return {
    //         f: function (val, row) {
    //             return "<a  data-target='#outDepository' id='todetail' data-toggle='modal' data-kind='" + JSON.stringify(row) + "'>" + '出库' + "</a>";
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
                "wheres": " out_area_id in(" + areas + ")",
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
                    checkboxes: true,           //Make rows checkable. (Note. You need a column with the 'unique' property)
                    checkAllToggle: true,        //Show the check-all toggle//+RQLBuilder.like("KEYY", "a").rql()
                    //----------------基本restful地址---
                    restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
                    key_column: "stockId",
                    //---------------行定义
                    coldefs: [
                        {
                            col: "stockId",
                            friendly: "操作",
                            unique: true,
                            hidden: true,
                            sorting: false,
                            index: 1
                        },
                        {
                            col: "outAreaId",
                            friendly: "供气区域",
                            format: AreaFormat,
                            sorting: true,
                            index: 2
                        },
                        {
                            col: "invoiceAmount",
                            friendly: "发票面值",
                            sorting: true,
                            index: 3
                        },
                        {
                            col: "boxNumber",
                            friendly: "箱号",
                            sorting: true,
                            index: 4
                        },
                        {
                            col: "startNumber",
                            friendly: "起始号",
                            sorting: true,
                            index: 5
                        },
                        {
                            col: "endNumber",
                            friendly: "终止号",
                            sorting: true,
                            index: 6
                        },
                        {
                            col: "invoiceCount",
                            friendly: "发票份数",
                            sorting: false,
                            index: 7
                        },
                        {
                            col: "inDate",
                            friendly: "入库日期",
                            format: dateFormat,
                            sorting: true,
                            index: 8
                        },
                        {
                            col: "inOperator",
                            friendly: "入库人",
                            sorting: false,
                            index: 9
                        },
                        {
                            col: "outDate",
                            friendly: "出库日期",
                            format: dateFormat,
                            sorting: true,
                            index: 10
                        },
                        {
                            col: "reservedField1",
                            friendly: "已查验份数",
                            sorting: true,
                            index: 11
                        },
                        {
                            col: "outOperator",
                            friendly: "领取人",
                            sorting: false,
                            index: 12
                        }
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
                            whereinfo += " and to_char(outDate,'yyyy-mm-dd')  between '" + $('#find_start_date').val() + "' and '" + $("#find_end_date").val() + "'";
                        } else if ($("#find_start_date").val() && !$("#find_end_date").val()) {
                            bootbox.alert("请输入截止日期")
                        } else if (!$("#find_start_date").val() && $("#find_end_date").val()) {
                            bootbox.alert("请输入起始日期")
                        }
                        bd = {
                            "cols": "*",
                            "froms": " gas_chg_waste_invoice_stock",
                            "wheres": whereinfo + "and out_area_id in(" + areas + ")",
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
$(document).on('click', "#check", function () {
    var data = xw.getTable().getData(true);
    if (data.rows.length == 0) {
        bootbox.alert("<br><center><h4>请选择一条数据！</h4></center><br>");
        return;
    }
    if (data.rows.length > 1) {
        bootbox.alert("<br><center><h4>只能选择一行！</h4></center><br>");
        return;
    }
    var checkInvoice;
    if (data.rows.length == 1) {
        $('#checkBill').modal('show')
        var startNum = data.rows[0].startNumber;
        var endNum = data.rows[0].endNumber;
        var invoicenum = data.rows[0].invoiceCount;
        if (data.rows[0].reservedField1) {
            checkInvoice = data.rows[0].reservedField1
        }
        else {
            checkInvoice = 0
        }
        $('#invoiceAmount').val(data.rows[0].invoiceAmount);
        $('#startNumber').val(startNum);
        $('#endNumber').val(endNum);
        $('#invoiceNum').val(parseInt(invoicenum) - parseInt(checkInvoice));
        $("#checkOut").on('click', function () {
            var checkStart = $('#startNumber1').val();
            var checkEnd = $('#endNumber1').val();
            if (!checkStart || !checkEnd) {
                bootbox.alert("<br><center><h4>请输入起始号与终止号！</h4></center><br>");
                return;
            }
            if (parseInt(checkStart) >= parseInt(startNum)) {
                var invoiceNumber = parseInt(checkEnd) - parseInt(checkStart) + parseInt(1);
                $('#invoiceNum1').val(invoiceNumber);
                return;
            } else {
                $('#startNumber1').val();
                bootbox.alert("<br><center><h4>起始号与领取的起始号不匹配，请重新输入起始号！</h4></center><br>");
                return;
            }

        });
    }
    $("#save_btn").click("on", function () {
        var checkInvoiceNum = $('#invoiceNum1').val();
        var noCheck=$('#invoiceNum').val();
        var num=parseInt(checkInvoiceNum) - parseInt(noCheck);
        if (num>0){
            bootbox.alert("<br><center><h4>校验份数大于未查验份数，请重新检查！</h4></center><br>");
            return;
        }
        console.log(checkInvoice);
        data.rows[0].reservedField1 = parseInt(checkInvoiceNum) + parseInt(checkInvoice);
        console.log(data);
        $.ajax({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            url: hzq_rest + "gaschgwasteinvoicestock",
            type: "PUT",
            dataType: "json",
            async: false,
            data: JSON.stringify(data.rows[0]),
            success: function (e) {
                if(e.success==true){
                    bootbox.alert("提交成功", function () {
                        location.reload();
                    });
                }

            }
        })
    });
});

