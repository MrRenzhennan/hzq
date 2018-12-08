/**
 * Created by Administrator on 2017/8/17.
 */
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
var RefundPriceFlag = function () {
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
            f: function (val) {
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

                } else {
                    return "<a id='flag'  data-kind='" + JSON.stringify(row) + "'>" + '标记  ' + "</a>";
                }

            }
        }
    }();
    var detailedInfoFormat2 = function () {
        return {
            f: function (val, row) {
                if (row.reservedField2 == 1) {
                    return "";

                } else {
                    return "<a id='cancel'  data-kind='" + JSON.stringify(row) + "'>" + '作废' + "</a>";
                }

            }
        }
    }();
    // var detailedInfoFormats = function () {
    //     return {
    //         f: function (val, row) {
    //             if (row.reservedField2 == 0) {
    //                 return '<a id="todetail" href="collectfee/refund_mgr_details.html?refundId=' + row.ctmArchiveId + '&code=' + row.refundId + '">详情</a>';
    //             } else {
    //                 return "已登记";
    //             }
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
                "froms": "gas_chg_refund",
                "wheres": "receive_flag='0' and status='2' and area_id in(" + areas + ")",
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
            }();
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
                        return val.toFixed(2)
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
                        }else if (val == "3") {
                            return "其他"
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
                            col: "receiveFlag",
                            friendly: "领取标识",
                            format: receiveFlagFormat,
                            sorting: false,
                            index: 10
                        },
                        {
                            col: "status",
                            friendly: "退款状态",
                            format: statusFormat,
                            sorting: false,
                            index: 11
                        },
                        {
                            col: "refundIds",
                            friendly: "退款单",
                            sorting: false,
                            format: detailedInfoFormat,
                            index: 12
                        }
                       ,{
                           col: "modifiedTime",
                           friendly: "作废",
                           sorting: false,
                           format: detailedInfoFormat2,
                           index: 13
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
                            whereinfo += " and area_id='" + areaId + "'";
                        }
                        if (refundType) {
                            whereinfo += " and refund_type='" + refundType + "'";
                        }
                        if (receiveWay) {
                            whereinfo += " and receive_way='" + receiveWay + "'";
                        }
                        if ($('#customerCode').val()) {
                            whereinfo += " and customer_code='" + $('#customerCode').val() + "'";
                        }
                        if ($('#customerName').val()) {
                            whereinfo += " and customer_name='" + $('#customerName').val() + "'";
                        }
                        if ($('#reservedField1').val()) {
                            whereinfo += " and reserved_field1='" + $('#reservedField1').val() + "'";
                        }
                        if (status) {
                            whereinfo += " and status='" + status + "'";
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
                        bd = {
                            "cols": "*",
                            "froms": "gas_chg_refund",
                            "wheres": whereinfo + "and receive_flag='0' and status='2' and area_id in(" + areas + ")",
                            "page": true,
                            "limit": 50
                        };
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
$(document).on('click', "#flag", function () {
			var row = JSON.parse($(this).attr("data-kind"));
		    console.log(row);
		    //清空账户余额
		    var chargeunitid = Restful.findNQ(hzq_rest+'gassysuser/?query={"userId":"'+UserInfo.userId()+'"}')[0].chargeUnitId;
			var ctmArchive = Restful.getByID(hzq_rest+'gasctmarchive',row.ctmArchiveId);
			var refundType = row.refundType;
			var money = row.money;
			if(refundType == "1"){
		        var account;
		        var par3 = {
		            "cols":"b.chg_account_id,b.gasfee_account_id,b.ic_balance",
		            "froms":"gas_chg_account a,gas_act_gasfee_account b",
		            "wheres":"a.chg_account_id=b.chg_account_id and a.ctm_archive_id='"+ctmArchive.ctmArchiveId+"'",
		            "page":true,
		            "limit":1
		        }
		        var accountRet=Restful.insert("/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",par3);
		
		        if(accountRet&&accountRet.rows&&accountRet.rows.length>0){
		            account=accountRet.rows[0];
		        }
		        console.log(account)
		        var gasatl = {
		            "gasfeeAccountId":account.gasfeeAccountId,
		            "chgAccountId":account.chgAccountId,
		            "customerCode":ctmArchive.customerCode,
		            "tradeType":"RFD",
		            "tradeTypeDesc":"RFDRESIVE",
		            "money":-(Number(money)),
		            "clrTag":"0",
		            "createTime":new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00"),
		            "modifiedTime":new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00"),
		            "tradeDate":new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00"),
		            "createdBy":UserInfo.userId(),
		            "modifiedBy":UserInfo.userId(),
		            "userId":UserInfo.userId(),
		            "areaId":ctmArchive.areaId,
		            "chargeUnitId":chargeunitid,
		            "customerKind":ctmArchive.customerKind,
		            "gasTypeId":ctmArchive.gasTypeId,
		            "customerType":ctmArchive.customerType
		        }
		        console.log(gasatl)
		        Restful.insert(hzq_rest+"gasactgasfeeatl",gasatl);
			}else if(refundType == "2"){
		        //退垃圾费
		        var accountwas;
		        var par2 = {
		            "cols":"b.chg_account_id,b.wastefee_account_id",
		            "froms":"gas_chg_account a,gas_act_wastefee_account b",
		            "wheres":"a.chg_account_id=b.chg_account_id and a.ctm_archive_id='"+ctmArchive.ctmArchiveId+"'",
		            "page":true,
		            "limit":1
		        }
		        var accountRetwas=Restful.insert("/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",par2);
		
		        if(accountRetwas&&accountRetwas.rows&&accountRetwas.rows.length>0){
		            accountwas=accountRetwas.rows[0];
		        }
		        console.log(accountwas)
		        var wasatl = {
		            "wastefeeAccountId":accountwas.wastefeeAccountId,
		            "chgAccountId":accountwas.chgAccountId,
		            "customerCode":ctmArchive.customerCode,
		            "tradeType":"RFD",
		            "tradeTypeDesc":"RFDRESIVE",
		            "money":-(Number(money)),
		            "clrTag":"0",
		            "createTime":new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00"),
		            "modifiedTime":new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00"),
		            "tradeDate":new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00"),
		            "createdBy":UserInfo.userId(),
		            "modifiedBy":UserInfo.userId(),
		            "userId":UserInfo.userId(),
		            "areaId":ctmArchive.areaId,
		            "chargeUnitId":chargeunitid,
		            "customerKind":ctmArchive.customerKind,
		            "gasTypeId":ctmArchive.gasTypeId,
		            "customerType":ctmArchive.customerType
		        }
		        console.log(wasatl);
		        Restful.insert(hzq_rest+"gasactwastefeeatl",wasatl);
		    }
		    
		    
		    
		    row.reservedField2 = '1';
		    row.modifiedTime=new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
		    $.ajax({
		        headers: {
		            'Accept': 'application/json',
		            'Content-Type': 'application/json'
		        },
		        url: hzq_rest + "gaschgrefund/",
		        type: "PUT",
		        dataType: "json",
		        async: false,
		        data: JSON.stringify(row),
		        success: function (e) {
		            console.log(e);
		            location.reload();
		        }
		    });
    


});
$(document).on('click', "#cancel", function () {
			var row = JSON.parse($(this).attr("data-kind"));
		    console.log(row);
		    
		    row.status = '4';
		    row.modifiedTime=new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
		    $.ajax({
		        headers: {
		            'Accept': 'application/json',
		            'Content-Type': 'application/json'
		        },
		        url: hzq_rest + "gaschgrefund/",
		        type: "PUT",
		        dataType: "json",
		        async: false,
		        data: JSON.stringify(row),
		        success: function (e) {
		            console.log(e);
		            location.reload();
		        }
		    });
    


});
// $("#flag").on("click", function () {
//     var selrows = xw.getTable().getData(true);
//     console.log(selrows.rows)
//     var refundId = [];
//     $.each(selrows.rows, function (idx, row) {
//         refundId.push("'" + row.refundId + "'")
//     })
//     localStorage.setItem("ptint_info", JSON.stringify(refundId));
//     window.location = "collectfee/printtuimoney.html"
// })
