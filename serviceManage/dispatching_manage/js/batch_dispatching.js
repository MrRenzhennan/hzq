/**
 * Created by alex on 2017/7/16.
 */
var xw;
var area_id = JSON.parse(localStorage.getItem("user_info")).area_id;
var userinfo=JSON.parse(localStorage.getItem("user_info"));
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
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
var batchTypeEnum = {"B_LSKS": "批量开栓", "B_CHANGEM": "批量换表","B_REMOVEM":"批量拆除"};
var billTypeFormat = function () {
    return {
        f: function (val) {
            return batchTypeEnum[val];
        }
    }
}();
var batchTaskAction = function () {

    var detailedInfoFormat = function () {
        return {
            f: function (val, row) {
                if (row.ownUnit&&row.batchState==1) {
                // class='pull-left btn btn-sm btn-circle blue'
                    return "<a   id='dispatching'    data-kind='" + JSON.stringify(row) + "'>" + "<font color='red'>派工</font>" + "</a>"
                } else if (row.ownUnit&&row.batchState==2) {
                    return "<a   id='dispatchingInfo' data-target='#allot' data-toggle='modal'   data-kind='" + JSON.stringify(row) + "'>" + '详情' + "</a>"
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
                            format: GasModCtm.batchStateFormat,
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
var batchId="";
$(document).on('click', "#dispatching", function () {
    $('#message').show();
	var result;
    var row = JSON.parse($(this).attr("data-kind"));
    batchId = row.workBillBatchId;
    var bookId = row.bookId;
    var ctmArchiveIds = new Array();
    var billCode = new Date().Format("yyyyMMddhhmmssSSS");
    $.ajax({
        type: 'get',
        url: hzq_rest + 'gasctmarchive/?query={"bookId":"' + bookId + '"}',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (data) {
            if (data[0]) {
                for (var i = 0; i < data.length; i++) {
                    ctmArchiveIds.push(data[i]);
                }

            }
        }
    });
    var workBillArrs=[];
    var error_msg;
    for (var i = 0; i < ctmArchiveIds.length; i++) {
    	var workBillObj;
        var batchDispatchJson = {
            "areaId": area_id,
            "ownUnit": row.ownUnit,
            "billCode": billCode + i + 1,
            "billState": "2",
            "billType": row.batchType,
            "bizName": row.batchType,
            "batchId": batchId,
            "isBatch": "1",
            "sendDate": new Date(),
//          "billContent":pid,
            "customerCode": ctmArchiveIds[i].customerCode,
            "customerName": ctmArchiveIds[i].customerName,
            "customerAddress": ctmArchiveIds[i].customerAddress,
            "createdBy":userinfo.userId,
            "modifiedBy":userinfo.userId
        };
        var workBillId = $.md5(JSON.stringify(batchDispatchJson)+new Date().getTime());
        batchDispatchJson.workBillId=workBillId;
        workBillObj="WORK_BILL_OBJ";
        workBillObj+="(";
        workBillObj+=("'"+batchDispatchJson.workBillId+"',");
        workBillObj+=("'"+batchDispatchJson.areaId+"',");
        workBillObj+=("'"+batchDispatchJson.ownUnit+"',");
        workBillObj+=("'"+batchDispatchJson.billCode+"',");
        workBillObj+=("'"+batchDispatchJson.billState+"',");
        workBillObj+=("'"+batchDispatchJson.billType+"',");
        workBillObj+=("'"+batchDispatchJson.bizName+"',");
        workBillObj+=("'"+batchDispatchJson.batchId+"',");
        workBillObj+=("'"+batchDispatchJson.isBatch+"',");
        workBillObj+=("'"+batchDispatchJson.customerCode+"',");
        workBillObj+=("'"+batchDispatchJson.customerName+"',");
        workBillObj+=("'"+batchDispatchJson.customerAddress+"',");
        workBillObj+=("'"+batchDispatchJson.createdBy+"',");
        workBillObj+=("'"+batchDispatchJson.modifiedBy+"'");
        workBillObj+=")";
        workBillArrs.push(workBillObj);
        if(workBillArrs.join().length>30000){
        	console.log("字符串长度过长：")
        	console.log(workBillArrs.join().length)
        	var param={
        		"pro_name":"P_WORK_BILL",
        		"pro_prop":"WORK_BILL_ARRAY("+workBillArrs.join()+")",
        		"busi_name":"P_WORK_BILL"
        	}
        	var parameterRet = Restful.insert('/hzqs/sys/pbpro.do?fh=SYSPRO0000000J00&resp=bd',param);
        	if(parameterRet.errCode==0){
        		if(error_msg){
        			error_msg+=(","+parameterRet.msg);
        		}else{
        			error_msg+=parameterRet.msg;
        		}
        	}
        	workBillArrs=[];
        }
    }
	if(workBillArrs.length>0){
		var param2={
			"pro_name":"P_WORK_BILL",
			"pro_prop":"WORK_BILL_ARRAY("+workBillArrs.join()+")",
			"busi_name":"P_WORK_BILL"
		}
		var parameterRet2 = Restful.insert('/hzqs/sys/pbpro.do?fh=SYSPRO0000000J00&resp=bd',param2);
		if(parameterRet2.errCode==0){
			if(error_msg){
				error_msg+=(","+parameterRet2.msg);
			}else{
				error_msg+=parameterRet2.msg;
			}
		}
	}
    var batchStateJson = {
        "workBillBatchId": batchId,
        "batchState": "2"
    };
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: hzq_rest + "gascsrworkbillbatch",
        type: "PUT",
        dataType: "json",
        async: false,
        data: JSON.stringify(batchStateJson),
        success: function (e) {
            $('#message').hide();
            if(error_msg){
            	bootbox.alert("工单派发完成,以下客户号生成工单失败：</br>"+error_msg, function () {
	                location.reload();
	            });
            }else{
            	bootbox.alert("工单派发成功", function () {
	                location.reload();
	            });
            }
           
        }
    })
    
});
$(document).on('click', "#dispatchingInfo", function () {
    var row = JSON.parse($(this).attr("data-kind"));
    console.log(row);
    batchId = row.workBillBatchId;
    var batchDispatchAction = function () {
        return {
            init: function () {
                this.reload();
            },
            reload: function () {
                $('#divtable1').html('');
                xw = XWATable.init(
                    {
                        divname: "divtable1",
                        //----------------table的选项-------
                        pageSize: 10, 			//Initial pagesize
                        columnPicker: true,         //Show the columnPicker button
                        sorting: true,
                        findbtn: "find_button1",
                        transition: 'fade',  //(bounce, fade, flip, rotate, scroll, slide).
                        checkboxes: false,           //Make rows checkable. (Note. You need a column with the 'unique' property)
                        checkAllToggle: false,        //Show the check-all toggle//+RQLBuilder.like("KEYY", "a").rql()
                        //----------------基本restful地址---
                        restbase: 'gascsrworkbill/?query={"batchId":"' + batchId + '"}',
                        key_column: "workBillId",
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
                                col: "ownUnit",
                                friendly: "所属机构",
                                format: UnitFormat,
                                sorting: false,
                                index: 2
                            },
                            {
                                col: "billCode",
                                friendly: "工单编号",
                                index: 3
                            },
                            {
                                col: "customerCode",
                                friendly: "客户编号",
                                index: 4
                            },
                            {
                                col: "customerName",
                                friendly: "客户姓名",
                                index: 5
                            },
                            {
                                col: "customerAddress",
                                friendly: "客户地址",
                                index: 6
                            },
                            {
                                col: "billType",
                                friendly: "工单类型",
                                format: billTypeFormat,
                                sorting: false,
                                index: 7
                            },
                            {
                                col: "billState",
                                friendly: "工单状态",
                                format: GasModCtm.batchStateFormat,
                                sorting: false,
                                index: 8
                            },
                            {
                                col: "sendDate",
                                friendly: "派工时间",
                                format: dateFormat,
                                index: 9
                            },
                            {
                                col: "complete",
                                friendly: "完成时间",
                                format: dateFormat,
                                index: 10
                            },
                            {
                                col: "cancelDate",
                                friendly: "作废时间",
                                format: dateFormat,
                                index: 11
                            }
                        ],
                        // 查询过滤条件
                        findFilter: function () {
                            var billCode, customerCode, customerName;
                            if ($('#billCode').val()) {
                                billCode = RQLBuilder.equal('billCode', $('#billCode').val());
                            }
                            if ($('#customerCode').val()) {
                                customerCode = RQLBuilder.equal('customerCode', $('#customerCode').val());
                            }
                            if ($('#customerName').val()) {
                                customerName = RQLBuilder.like('customerName', $('#customerName').val());
                            }
                            var batch= RQLBuilder.equal("batchId",batchId);
                            var filter = RQLBuilder.and([
                                batch,billCode,customerCode,customerName
                            ]);
                            xw.setRestURL(hzq_rest + "gascsrworkbill");
                            return filter.rql();
                        }
                    }
                );
            }

        }
    }();
    batchDispatchAction.init();
});




// $("#agree_btn").click("on", function () {
//     // var batchJson = new Array();
//     // batchJson['workBillBatchId'] = batchId;
//     var param = {
//         "ownUnit": $("#find_unit").val(),
//         // "billState":"1",
//         // "modifiedTime":new Date(),
//         // "modifiedBy":userinfo.userId
//     }
//     $.ajax({
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//         },
//         url: hzq_rest + "gascsrworkbillbatch/" + batchId,
//         type: "PUT",
//         dataType: "json",
//         async: false,
//         data: JSON.stringify(param),
//         success: function (e) {
//             console.log(e);
//             if (e.success == true) {
//                 bootbox.alert("<br><center><h4>修改成功</h4></center><br>");
//                 location.reload();
//             }
//         }
//     })
// });


