/**
 * Created by Administrator on 2017/8/26.
 */
/**
 * Created by alex on 2017/8/26.
 */
var xw;
ComponentsPickers.init();
var loginarea = [];
var areaId = JSON.parse(localStorage.getItem("user_info")).area_id
GasModSys.areaList({
    "areaId": areaId,
    "cb": function (data) {
        console.log(data)
        $.each(data, function (key, val) {
            loginarea.push(val.areaId);
            $('#find_area').append('<option value="' + val.areaId + '" name="' + val.areaId + '">' + val.areaName + '</option>');
            $('#find_area1').append('<option value="' + val.areaId + '" name="' + val.areaId + '">' + val.areaName + '</option>');
        })
    }
});
var BillOutQueryAction = function () {

    var AreaHelper = RefHelper.create({
        ref_url: "gasbizarea",
        ref_col: "areaId",
        ref_display: "areaName"
    });
    var UserHelper = RefHelper.create({
        ref_url: "gassysuser",
        ref_col: "userId",
        ref_display: "employeeName"
    });
    var AreaFormat = function () {
        return {
            f: function (val) {
                return AreaHelper.getDisplay(val);
            }
        }
    }();
    var UserFormat = function () {
        return {
            f: function (val) {
                return UserHelper.getDisplay(val);
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
    var detailedInfoFormat = function () {
        return {
            f: function (val, row) {
                if (row.reservedField2 == 1) {
                    return "<a  data-target='#outDepository' id='todetail' data-toggle='modal' data-kind='" + JSON.stringify(row) + "'>" + '出库' + "</a>";
                } else if (row.reservedField2 == 2) {
                    return "<a  data-target='#detailInfo' id='detail' data-toggle='modal' data-kind='" + JSON.stringify(row) + "'>" + '<font style="color:red">详情</font>' + "</a>";
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
                "froms": "gas_chg_waste_invoice_stock",
                "wheres": "parentid is null order by reservedField2",
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
                            format: UserFormat,
                            sorting: false,
                            index: 7
                        },
                        // {
                        //     col: "outDate",
                        //     friendly: "出库日期",
                        //     format: dateFormat,
                        //     sorting: true,
                        //     index: 8
                        // },
                        // {
                        //     col: "outAreaId",
                        //     friendly: "出库供气区域",
                        //     format: AreaFormat,
                        //     sorting: true,
                        //     index: 9
                        // },
                        // {
                        //     col: "outOperator",
                        //     friendly: "领取人",
                        //     sorting: true,
                        //     index: 10
                        // },
                        {
                            col: "stockId",
                            friendly: "操作",
                            unique: true,
                            format: detailedInfoFormat,
                            sorting: false,
                            index: 11
                        }
                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var whereinfo = '1=1';
                        if ($('#find_area1').val()) {
                            whereinfo += " and outAreaId='" + $('#find_area1').val() + "'";
                        }
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
                        var bd = {
                            "cols": "*",
                            "froms": "gas_chg_waste_invoice_stock",
                            "wheres": whereinfo + "and parentid is null order by reservedField2",
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
var updateStock;
var parentId;
$(document).on('click', "#todetail", function () {
    updateStock = JSON.parse($(this).attr("data-kind"));
    $('#invoiceAmount').val(updateStock.invoiceAmount);
    $('#startNumber').val(updateStock.startNumber);
    $('#endNumber').val(updateStock.endNumber);
    $('#invoiceNum').val(updateStock.surplusCount);
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: hzq_rest + 'gaschgwasteinvoicestock/?query={"parentid":"' + updateStock.stockId + '"}',
        type: "get",
        dataType: "json",
        async: false,
        data: '',
        success: function (data) {
            if(data.length>0){
                parentId=updateStock.stockId;
                $("#child").css("display", "block");
                // document.getElementById('#').style.display='block';
                BillOutQueryDetailAction.init();
            }
        }
    });
    $("#save_btn").click("on", function () {
        $("#save_btn").attr({"disabled":"disabled"});
        if (parseInt($('#startNumber1').val()) >= parseInt(updateStock.startNumber)) {
            if (parseInt($('#invoiceNum').val()) >= parseInt($('#invoiceCount').val())) {
                var invoiceNumber = parseInt($('#endNumber1').val()) - parseInt($('#startNumber1').val()) + parseInt(1);
                $('#invoiceCount').val(invoiceNumber);
                var BillJson = $("form").serializeObject();
                console.log(BillJson);
                var stockId = $.md5(JSON.stringify($("form").serializeObject()) + new Date().getTime());
                BillJson['stockId'] = stockId;
                BillJson['parentid'] = updateStock.stockId;
                BillJson['invoiceCount'] = invoiceNumber;
                BillJson['invoiceAmount'] = updateStock.invoiceAmount;
                BillJson['boxNumber'] = updateStock.boxNumber;
                BillJson['inOperator'] = updateStock.inOperator;
                BillJson['inDate'] = updateStock.inDate;
                BillJson["reservedField2"] = "2";
                console.log(BillJson);
                var result = false;
                $.ajax({
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    url: hzq_rest + "gaschgwasteinvoicestock",
                    type: "POST",
                    dataType: "json",
                    async: false,
                    data: JSON.stringify(BillJson),
                    success: function (e) {
                        result = e.success;
                    }
                });
                if (result == true) {
                    var syNum = parseInt(updateStock.surplusCount) - parseInt($('#invoiceCount').val());
                    console.log("syNum" + syNum)
                    if (syNum == 0) {
                        updateStock["reservedField2"] = "2";
                    }
                    updateStock["surplusCount"] = parseInt(syNum);
                    console.log(updateStock);
                    $.ajax({
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        url: hzq_rest + "gaschgwasteinvoicestock",
                        type: "PUT",
                        dataType: "json",
                        async: false,
                        data: JSON.stringify(updateStock),
                        success: function (e) {
                            if (e.success == true) {
                                bootbox.alert("提交成功", function () {
                                    location.reload();
                                });
                            }

                        }
                    })
                }

            } else {
                $('#invoiceCount').val("");
                $('#endNumber1').val("");
                $("#save_btn").removeAttr("disabled");
                bootbox.alert("<br><center><h4>领取数量大于未领取数量，请校验后重新输入！</h4></center><br>");
                return;
            }
        } else {
            $('#startNumber1').val();
            $("#save_btn").removeAttr("disabled");
            bootbox.alert("<br><center><h4>起始号与领取的起始号不匹配，请重新输入起始号！</h4></center><br>");
            return;
        }
    });
});
$('#endNumber1').blur(function () {
    var receiveNum = parseInt($('#endNumber1').val()) - parseInt($('#startNumber1').val()) + parseInt(1);
    $('#invoiceCount').val(receiveNum);
});
$(document).on('click', "#batchOut", function () {
    var data = xw.getTable().getData(true);
    if (data.rows.length == 0) {
        bootbox.alert("<br><center><h4>请选择一条数据！</h4></center><br>");
        return;
    }
    if (data.rows.length > 1) {
        console.log(data);
        $("#save_btn1").click("on", function () {
            console.log(11111111111111111);
            var area_id = $('#find_area2').val();
            var out_operator = $('#outOperator1').val();
            var out_date = $('#outDate1').val();
            var result;
            for (var i = 0; i < data.rows.length; i++) {
                data.rows[i]["stockId"] = $.md5(JSON.stringify(data.rows[i].stockId) + new Date().getTime());
                data.rows[i]["parentid"] = data.rows[i].stockId;
                data.rows[i]["outAreaId"] = area_id;
                data.rows[i]["outOperator"] = out_operator;
                data.rows[i]["outDate"] = out_date;
                data.rows[i]["surplusCount"] = "0";
                data.rows[i]["reservedField2"] = "2";
                console.log(data.rows[i]);
                $.ajax({
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    url: hzq_rest + "gaschgwasteinvoicestock",
                    type: "POST",
                    dataType: "json",
                    async: false,
                    data: JSON.stringify(data.rows[i]),
                    success: function (e) {
                        if (e.success == true) {
                            result = true;
                        }
                    }
                })
            }
            if (result == true) {
                bootbox.alert("提交成功", function () {
                    location.reload();
                });
            }
        });
    }
});


$(document).on('click', "#detail", function () {
    var stockInfo = JSON.parse($(this).attr("data-kind"));
    $('#divtable2').html('');
    $("#child1").css("display", "none");
    console.log(stockInfo);
    $('#invoiceAmount1').val(stockInfo.invoiceAmount);
    $('#startNumber2').val(stockInfo.startNumber);
    $('#endNumber2').val(stockInfo.endNumber);
    $('#invoiceNum1').val(stockInfo.surplusCount);
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: hzq_rest + 'gaschgwasteinvoicestock/?query={"parentid":"' + stockInfo.stockId + '"}',
        type: "get",
        dataType: "json",
        async: false,
        data: '',
        success: function (data) {
            if(data.length>0){
                parentId=stockInfo.stockId;
                $("#child1").css("display", "block");
                // document.getElementById('#').style.display='block';
                BillOutQueryDetailAction1.init();
            }
        }
    });
});
var BillOutQueryDetailAction = function () {

    var AreaHelper = RefHelper.create({
        ref_url: "gasbizarea",
        ref_col: "areaId",
        ref_display: "areaName"
    });
    var UserHelper = RefHelper.create({
        ref_url: "gassysuser",
        ref_col: "userId",
        ref_display: "employeeName"
    });
    var AreaFormat = function () {
        return {
            f: function (val) {
                return AreaHelper.getDisplay(val);
            }
        }
    }();
    var UserFormat = function () {
        return {
            f: function (val) {
                return UserHelper.getDisplay(val);
            }
        }
    }();
    return {
        init: function () {
            this.reload();
        },
        reload: function () {
            $('#divtable1').html('');
            var bd = {
                "cols": "*",
                "froms": "gas_chg_waste_invoice_stock",
                "wheres": "parentid='"+parentId+"'",
                "page": true,
                "limit": 50
            };
            xw = XWATable.init(
                {
                    divname: "divtable1",
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
                            format: UserFormat,
                            sorting: false,
                            index: 7
                        },
                        {
                            col: "outDate",
                            friendly: "出库日期",
                            format: dateFormat,
                            sorting: true,
                            index: 8
                        },
                        {
                            col: "outAreaId",
                            friendly: "出库供气区域",
                            format: AreaFormat,
                            sorting: true,
                            index: 9
                        },
                        {
                            col: "outOperator",
                            friendly: "领取人",
                            sorting: true,
                            index: 10
                        }
                    ]
                }
            );
        }

    }
}();
var BillOutQueryDetailAction1 = function () {

    var AreaHelper = RefHelper.create({
        ref_url: "gasbizarea",
        ref_col: "areaId",
        ref_display: "areaName"
    });
    var UserHelper = RefHelper.create({
        ref_url: "gassysuser",
        ref_col: "userId",
        ref_display: "employeeName"
    });
    var AreaFormat = function () {
        return {
            f: function (val) {
                return AreaHelper.getDisplay(val);
            }
        }
    }();
    var UserFormat = function () {
        return {
            f: function (val) {
                return UserHelper.getDisplay(val);
            }
        }
    }();
    return {
        init: function () {
            this.reload();
        },
        reload: function () {
            $('#divtable2').html('');
            var bd = {
                "cols": "*",
                "froms": "gas_chg_waste_invoice_stock",
                "wheres": "parentid='"+parentId+"'",
                "page": true,
                "limit": 50
            };
            xw = XWATable.init(
                {
                    divname: "divtable2",
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
                            format: UserFormat,
                            sorting: false,
                            index: 7
                        },
                        {
                            col: "outDate",
                            friendly: "出库日期",
                            format: dateFormat,
                            sorting: true,
                            index: 8
                        },
                        {
                            col: "outAreaId",
                            friendly: "出库供气区域",
                            format: AreaFormat,
                            sorting: true,
                            index: 9
                        },
                        {
                            col: "outOperator",
                            friendly: "领取人",
                            sorting: true,
                            index: 10
                        }
                    ]
                }
            );
        }

    }
}();