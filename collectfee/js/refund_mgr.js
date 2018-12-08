/**
 * Created by alex on 2017/8/4.
 */
var xw;
var loginarea = [];
var area_id = JSON.parse(localStorage.getItem("user_info")).area_id;
var areas = new Array();
areas.push(area_id);
//查询areaId下级areaId
var queryCondion = RQLBuilder.and([
    RQLBuilder.equal("status", "1"),
    RQLBuilder.equal("parentAreaId", area_id)
]).rql()
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
            // areas.push("'"+data[i].areaId+"'")
        }
    }
});
var AreaHelper1 = RefHelper.create({
    ref_url: 'gasbizarea?query={"areaId":{"$in":' + JSON.stringify(areas) + '}}',
    ref_col: "areaId",
    ref_display: "areaName",
    "sort": "posCode"
});
$.each(AreaHelper1.getRawData(), function (index, row) {
    $('#find_area').append('<option value="' + row.areaId + '">' + row.areaName + '</option>');
});
var RefundPrice = function () {
    // 供气区域helper
    var AreaHelper = RefHelper.create({
        ref_url: "gasbizarea",
        ref_col: "areaId",
        ref_display: "areaName"
    });
    var operatorHelper = RefHelper.create({
        ref_url: "gassysuser",
        ref_col: "userId",
        ref_display: "employeeName"
    });
    var AreaFormat = function () {
        return {
            f: function (val,row) {
                console.log(row)
                return AreaHelper.getDisplay(val);
            }
        }
    }();
    var operatorFormat = function () {
        return {
            f: function (val) {
                return operatorHelper.getDisplay(val);
            }
        }
    }();
    var detailedInfoFormat = function () {
        return {
            f: function (val, row) {
                if (row.reservedField2 == 1) {
                    return "已登记";
                } else if (row.status == 2){
                    return '<a id="todetail" href="collectfee/refund_mgr_detail.html?refundId=' + row.refundId + '&code=' + row.customerCode + '">详情</a>';
                }

            }
        }
    }();
    var detailedInfoFormats = function () {
        return {
            f: function (val, row) {
                if (row.reservedField2 == 1) {
                    return "已登记";
                } else if (row.status == 2){
                    return '<a id="todetail" href="collectfee/refund_mgr_details.html?refundId=' + row.ctmArchiveId + '&code=' + row.refundId + '">详情</a>';
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
                "cols": "a.*,b.customer_name",
                "froms": "gas_chg_refund a left join gas_ctm_archive b on a.ctm_archive_id=b.ctm_archive_id",
                "wheres": "a.area_id in (" + areas + ")",
                "page": true,
                "limit": 50
            };

            var refundTypeFormat = function () {
                return {
                    f: function (val) {
                        if (val == "1") {
                            return "燃气费退款"
                        } else if (val == "2") {
                            return "垃圾费退款"
                        }
                    }
                }
            }()
            var receiveWayFormat = function () {
                return {
                    f: function (val) {
                        if (val == "1") {
                            return "银行转账"
                        } else if (val == "2") {
                            return "现金"
                        }
                    }
                }
            }()
            /*退款状态：
             1、申请中，2、审批通过，3、审批拒绝，4、已领取;*/
            var statusFormat = function () {
                return {
                    f: function (val) {
                        if (val == "1") {
                            return "申请中"
                        } else if (val == "2") {
                            return "审批通过"
                        } else if (val == "3") {
                            return "审批拒绝"
                        } else if (val == "4") {
                            return "已领取"
                        }
                    }
                }
            }()
            var receiveFlagFormat = function () {
                return {
                    f: function (val) {
                        if (val == "0") {
                            return "未领取"
                        } else if (val == "1") {
                            return "已领取"
                        }
                    }
                }
            }()
            var moneyFormat = function () {
                return {
                    f: function (val) {
                        if (val){
                            return val.toFixed(2)
                        }else{
                            return ""
                        }
                    }
                }
            }()
            var reservedField1Format = function () {
                return {
                    f: function (val) {
                        if (val == "1") {
                            return "用户注销"
                        } else if (val == "2") {
                            return "暂停用气"
                        }
                    }
                }
            }();
            // var dateFormat = function (val) {
            //     if (val) {
            //         var date = val.substring(0, 10);
            //         return date;
            //     }
            // };
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
                    key_column: "refundId",
                    //---------------行定义
                    coldefs: [
                        {
                            col: "refundId",
                            friendly: "",
                            hidden: true,
                            nonedit: "nosend",
                            unique: true,
                            sorting: false,
                            index: 1
                        },
                        {
                            col: "areaId",
                            friendly: "供气区域",
                            format: AreaFormat,
                            sorting: false,
                            index: 2
                        },
                        {
                            col: "customerCode",
                            friendly: "客户编号",
                            sorting: false,
                            index: 3
                        },
                        {
                            col: "customerName",
                            friendly: "客户姓名",
                            sorting: false,
                            index: 4
                        },
                        {
                            col: "money",
                            friendly: "退款金额",
                            format: moneyFormat,
                            sorting: false,
                            index: 5
                        },
                        {
                            col: "refundType",
                            friendly: "退款类型",
                            format: refundTypeFormat,
                            index: 6
                        },
                        {
                            col: "receiveWay",
                            friendly: "领取方式",
                            format: receiveWayFormat,
                            sorting: false,
                            index: 7
                        },
                        {
                            col: "reservedField1",
                            friendly: "退款原因",
                            format: reservedField1Format,
                            sorting: false,
                            index: 8
                        },
                        {
                            col: "examineTime",
                            friendly: "审批通过时间",
                            format:dateFormat,
                            sorting: false,
                            index: 9
                        },
                        {
                            col: "recordTime",
                            friendly: "登记时间",
                            format:dateFormat,
                            sorting: false,
                            index: 10
                        },
                        {
                            col: "receiveFlag",
                            friendly: "领取标识",
                            format: receiveFlagFormat,
                            sorting: false,
                            index: 11
                        },
                        {
                            col: "status",
                            friendly: "退款状态",
                            format: statusFormat,
                            sorting: false,
                            index: 12
                        },
                        {
                            col: "refundIds",
                            friendly: "退款单",
                            sorting: false,
                            format: detailedInfoFormat,
                            index: 13
                        }, {
                            col: "refundIdss",
                            friendly: "领取单",
                            sorting: false,
                            format: detailedInfoFormats,
                            index: 14
                        }
                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var areaId = $('#find_area').val();
                        var refundType = $('#refundType').val();
                        var receiveWay = $('#receiveWay').val();
                        var status = $('#status').val();
                        var receiveFlag = $('#receiveFlag').val();
                        var whereinfo = '1=1';
                        if (areaId) {
                            whereinfo += " and a.area_id='" + areaId + "'";
                        }
                        if (refundType) {
                            whereinfo += " and refund_type='" + refundType + "'";
                        }
                        if (receiveWay) {
                            whereinfo += " and receive_way='" + receiveWay + "'";
                        }
                        if ($('#customerCode').val()) {
                            console.log($('#customerCode').val());
                            whereinfo += " and a.customer_code='" + $('#customerCode').val() + "'";
                        }
                        if ($('#customerName').val()) {
                            whereinfo += " and b.customer_name='" + $('#customerName').val() + "'";
                        }
                        if ($('#reservedField1').val()) {
                            whereinfo += " and a.reserved_field1='" + $('#reservedField1').val() + "'";
                        }
                        if (status) {
                            whereinfo += " and a.status='" + status + "'";
                        }
                        if (receiveFlag) {
                            whereinfo += " and receive_flag='" + receiveFlag + "'";
                        }
                        if ($("#find_start_date").val() && $("#find_end_date").val()) {
                            whereinfo += " and to_char(examine_time,'yyyy-mm-dd')  between '" + $('#find_start_date').val() + "' and '" + $("#find_end_date").val() + "'";
                        } else if ($("#find_start_date").val() && !$("#find_end_date").val()) {
                            bootbox.alert("请输入截止日期")
                        } else if (!$("#find_start_date").val() && $("#find_end_date").val()) {
                            bootbox.alert("请输入起始日期")
                        }
                        if ($("#find_start_date1").val() && $("#find_end_date1").val()) {
                            whereinfo += " and to_char(record_time,'yyyy-mm-dd')  between '" + $('#find_start_date1').val() + "' and '" + $("#find_end_date1").val() + "'";
                        } else if ($("#find_start_date1").val() && !$("#find_end_date1").val()) {
                            bootbox.alert("请输入截止日期")
                        } else if (!$("#find_start_date1").val() && $("#find_end_date1").val()) {
                            bootbox.alert("请输入起始日期")
                        }
                        bd = {
                            "cols": "a.*,b.customer_name",
                            "froms": "gas_chg_refund a left join gas_ctm_archive b on a.ctm_archive_id=b.ctm_archive_id",
                            "wheres": whereinfo + " and a.area_id in (" + areas + ")",
                            "page": true,
                            "limit": 50
                        };
                        console.log(bd)
                        xw.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)));

                    },
                    onAdded: function (ret, jsondata) {

                    },

                    onUpdated: function (ret, jsondata) {

                    },

                    onDeleted: function (ret, jsondata) {
                    }
                }
            );
        }

    }
}();
/* */
$("#addPrint").on("click", function () {
    var selrows = xw.getTable().getData(true);
    var startTime=$('#find_start_date').val();
    var endTime=$('#find_end_date').val();
    console.log(selrows.rows)
    var refundId = [];
    var time=[];
    time.push(startTime);
    time.push(endTime);
    $.each(selrows.rows, function (idx, row) {
        refundId.push("'" + row.refundId + "'")
    })
    localStorage.setItem("ptint_info", JSON.stringify(refundId));
    localStorage.setItem("ptint_time", JSON.stringify(time));
    window.location = "collectfee/gas_refund_mgr.html"
});

$("#gasPrint").on("click", function () {
    var selrows = xw.getTable().getData(true);
    var startTime=$('#find_start_date').val();
    var endTime=$('#find_end_date').val();
    console.log(selrows.rows)
    var refundId = [];
    var time=[];
    time.push(startTime);
    time.push(endTime);
    time.push("1");
    $.each(selrows.rows, function (idx, row) {
        refundId.push("'" + row.refundId + "'")
    })
    localStorage.setItem("ptint_info", JSON.stringify(refundId));
    localStorage.setItem("ptint_time", JSON.stringify(time));
    window.location = "collectFee/gas_refund_mgr.html"
});
$("#garbgePrint").on("click", function () {
    var selrows = xw.getTable().getData(true);
    var startTime=$('#find_start_date').val();
    var endTime=$('#find_end_date').val();
    console.log(selrows.rows)
    var refundId = [];
    var time=[];
    time.push(startTime);
    time.push(endTime);
    time.push("2");
    $.each(selrows.rows, function (idx, row) {
        refundId.push("'" + row.refundId + "'")
    })
    localStorage.setItem("ptint_info", JSON.stringify(refundId));
    localStorage.setItem("ptint_time", JSON.stringify(time));
    window.location = "collectFee/gas_refund_mgr.html"
});
