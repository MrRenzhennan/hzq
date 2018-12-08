/**
 * Created by alex on 2017/7/14.
 */
var xw;
var area_id = JSON.parse(localStorage.getItem("user_info")).area_id;
var userId = JSON.parse(localStorage.getItem("user_info")).userId;
var station_id = JSON.parse(localStorage.getItem("user_info")).station_id;
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
console.log("111111111111111"+areas);
var AreaHelper1 = RefHelper.create({
    ref_url: 'gasbizarea?query={"areaId":{"$in":' + JSON.stringify(areas) + '}}',
    ref_col: "areaId",
    ref_display: "areaName",
    "sort": "posCode"
});
$.each(AreaHelper1.getRawData(), function (index, row) {
    $('#find_area').append('<option value="' + row.areaId + '">' + row.areaName + '</option>');
});
var UnitHelper = RefHelper.create({
    ref_url: "gassysunit",
    ref_col: "unitId",
    ref_display: "unitName"
});
var UnitFormat = function () {
    return {
        f: function (val) {
            return UnitHelper.getDisplay(val);
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


var batchTaskAction = function () {
    // 供气区域helper
    var AreaHelper = RefHelper.create({
        ref_url: "gasbizarea",
        ref_col: "areaId",
        ref_display: "areaName"
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
    var bookFormat = function () {
        return {
            f: function (val) {
                return BookHelper.getDisplay(val);
            }
        }
    }();
    var batchTypeEnum = {"B_LSKS": "批量开栓", "B_CHANGEM": "批量换表","B_REMOVEM":"批量拆除"};
    var billTypeFormat = function () {
        return {
            f: function (val) {
                return batchTypeEnum[val];
            },
        }
    }();
    return {
        init: function () {
            this.initHelper();
            this.reload();
        },
        initHelper: function () {
            // // 分公司 select init
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
var querys = new Array();
querys.push(RQLBuilder.condition_fc("areaId", "$in", JSON.stringify(areas)));
var selectQuery = RQLBuilder.and([
    RQLBuilder.equal("areaId", area_id),
    RQLBuilder.equal("bookType", "1"),
    RQLBuilder.equal("countperId", userId)
]).rql();
//抄表本Helper
var bookIdHelper = RefHelper.create({
    ref_url: "gasmrdbook/?query=" + selectQuery,
    ref_col: 'bookId',
    ref_display: 'bookCode'
});
console.log(bookIdHelper);
$.map(bookIdHelper.getData(), function (value, key) {
    $('select[name="bookId"]').append('<option value="' + key + '">' + value + '</option>');
});
$("#save").click("on", function () {
    var batchType = $("input[name='batchType']:checked").val();
    console.log(batchType);
    if (batchType) {
        if (batchType == "B_LSKS") {
            if ($('#bookId').val()) {
                var batchBillJson = $("form").serializeObject();
                console.log(batchBillJson);
                batchBillJson['workBillBatchId'] = $.md5(JSON.stringify(batchBillJson) + new Date().getTime());
                batchBillJson['areaId'] = area_id;
                var batchCode = new Date().Format("yyyyMMddhhmmssSSS");
                batchBillJson['batchCode'] = batchCode;
                batchBillJson['bizName'] = batchType;
                batchBillJson['batchState'] = "5";
                $.ajax({
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    url: hzq_rest + "gascsrworkbillbatch",
                    type: "POST",
                    dataType: "json",
                    async: false,
                    data: JSON.stringify(batchBillJson),
                    success: function (e) {
                        if (e.success == true) {
                            bootbox.alert("<br><center><h4>添加成功</h4></center><br>",function(){
                            	location.reload();
                            });
                        }
                    }
                })
            } else {
                bootbox.alert("<br><center><h4>请选择抄表本号</h4></center><br>");
                return;
            }
        } else if (batchType == "B_CHANGEM") {
            var effective = 0;
            var sum = 0;
            var num;
            if ($('#bookId').val()) {
                // var bookId = $('#bookId').val();
                // var bd = {
                //     "cols": "b.*,case when copy_time>d then '1'when copy_time<d then '2' end judge",
                //     "froms": "(select sysdate - interval '30' day as d from dual)t,(select ctm_archive_id,copy_time,row_number() over (partition by ctm_archive_id order by copy_time desc)as rn1 from gas_mrd_meter_reading where is_mrd='1' and copy_state in('2','3','4','5','6') and book_id='" + bookId + "')b",
                //     "wheres": "rn1='1'",
                //     "page": false
                // };
                // $.ajax({
                //     type: 'get',
                //     url: '/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd&bd=' + JSON.stringify(bd),
                //     dataType: 'json',
                //     contentType: "application/json; charset=utf-8",
                //     async: false,
                //     success: function (data) {
                //         console.log(data);
                //         if (data.rows) {
                //             sum = data.rows.length;
                //             for (var i = 0; i < data.rows.length; i++) {
                //                 if (data.rows[i].judge == "1") {
                //                     effective += 1;
                //                 }
                //             }
                //         }
                //     }
                // });
                // console.log("effective"+effective);
                // num = ((effective / sum).toFixed(2))*100;
                // if(num>60){
                    var batchBillJson = $("form").serializeObject();
                    console.log(batchBillJson);
                    batchBillJson['workBillBatchId'] = $.md5(JSON.stringify(batchBillJson) + new Date().getTime());
                    batchBillJson['areaId'] = area_id;
                    var batchCode = new Date().Format("yyyyMMddhhmmssSSS");
                    batchBillJson['batchCode'] = batchCode;
                    batchBillJson['bizName'] = batchType;
                    batchBillJson['batchState'] = "5";
                    $.ajax({
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        url: hzq_rest + "gascsrworkbillbatch",
                        type: "POST",
                        dataType: "json",
                        async: false,
                        data: JSON.stringify(batchBillJson),
                        success: function (e) {
                            if (e.success == true) {
                                bootbox.alert("<br><center><h4>添加成功</h4></center><br>",function(){
                                	location.reload();
                                });
                            }
                        }
                    })
            }
            // else{
            //         bootbox.alert("<br><center><h4>该抄表本抄表户数为达到要求，请重新选择抄表本</h4></center><br>");
            //     }
            //     console.log("num"+num);
            // }
                else {
                bootbox.alert("<br><center><h4>请选择抄表本号</h4></center><br>");
                return;
            }
        }else if(batchType == "B_REMOVEM"){
            var batchBillJson = $("form").serializeObject();
            console.log(batchBillJson);
            batchBillJson['workBillBatchId'] = $.md5(JSON.stringify(batchBillJson) + new Date().getTime());
            batchBillJson['areaId'] = area_id;
            var batchCode = new Date().Format("yyyyMMddhhmmssSSS");
            batchBillJson['batchCode'] = batchCode;
            batchBillJson['bizName'] = batchType;
            batchBillJson['batchState'] = "5";
            $.ajax({
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                url: hzq_rest + "gascsrworkbillbatch",
                type: "POST",
                dataType: "json",
                async: false,
                data: JSON.stringify(batchBillJson),
                success: function (e) {
                    if (e.success == true) {
                        bootbox.alert("<br><center><h4>添加成功</h4></center><br>",function(){
                        	location.reload();
                        });
                    }
                }
            })
        }
    } else {
        bootbox.alert("<br><center><h4>请先选择批量业务类型</h4></center><br>");
        return;
    }
});