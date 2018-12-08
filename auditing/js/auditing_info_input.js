/**
 * Created by alex on 2017/8/5.
 */
var filesid;
var cardTypeEnum = {"1": "营业执照", "2": "法人身份证", "3": "房产证", "4": "租房合同", "5": "居民身份证"};
var userInfo = JSON.parse(localStorage.getItem('user_info'));
console.log(userInfo);
var cardTypeFM = function () {
    return {
        f: function (val) {
            return cardTypeEnum[val];
        },
    }
}();
var AreaHelper = RefHelper.create({
    ref_url: "gasbizarea",
    ref_col: "areaId",
    ref_display: "areaName",
});
var UseHelper = RefHelper.create({
    ref_url: "gassysuser",
    ref_col: "userId",
    ref_display: "employeeName",
});
var AreaFormat = function () {
    return {
        f: function (val) {
            return AreaHelper.getDisplay(val);
        }
    }
}();
jQuery(document).ready(function () {
    queryCustomerList.init();
    ComponentsPickers.init();
    $('#paperNo').hide();
});
$("#inlineCheckbox2").click(function () {
    $('#paperNo').show();
    // $('#project').show();
});
$("#inlineCheckbox1").click(function () {
    $('#paperNo').hide();
    // $('#project').show();
});
$("#inlineCheckbox3").click(function () {
    $('#paperNo').hide();
    // $('#project').show();
});
var userInfo = JSON.parse(localStorage.getItem('user_info'));
var area_id = userInfo.area_id;
var user_id = userInfo.userId;
$("#find_hight_user").click(function () {
    $("#lay input").val("");
    if ($("#lay").css("display") == "block") {
        $("#lay").css("display", "none");
        $("#ib").attr("class", "fa fa-angle-double-down");
    } else if ($("#lay").css("display") == "none") {

        $("#lay").css("display", "block");
        $("#ib").attr("class", "fa fa-angle-double-up");

    }
});

var customerFlag = "1";
$("#find_user_btn").click(function () {
    var queryUrl = hzq_rest + "gasctmarchive";
    var querys = new Array();
    if ($('#find_key').val()) {
        querys.push(RQLBuilder.like("customerCode", $('#find_key').val()));
    }

    if ($('#customerName1').val()) {
        querys.push(RQLBuilder.like("customerName", $('#customerName1').val()));
    }
    if ($('#tel1').val()) {
        querys.push(RQLBuilder.like("tel", $('#tel1').val()));
    }
    if ($('#customerAddress1').val()) {
        querys.push(RQLBuilder.like("customerAddress", $('#customerAddress1').val()));
    }
    console.log(querys)
    if (querys.length > 0) {
        queryUrl += "?query=" + RQLBuilder.and(querys).rql();
    }
    xw.setRestURL(queryUrl);
    xw.update()
    var data = xw.getTable().getData();
    $("#pdivtable p").html('');
    if (data.total_rows > 0) {
        $('#pdivtable').css("display", "block");
        $("#pdivtable").prepend("<p>请选择一条符合条件的记录   <button id='confirm_btn' class='btn blue'>确定</button></p>");

    } else {
        bootbox.alert("<br><center><h4>系统中无此用户档案，请输入客户基本信息！</h4></center><br>");
    }
    $("#confirm_btn").on('click', function () {
        var data = xw.getTable().getData(true);
        console.log(data);
        if (data.rows.length == 0) {
            bootbox.alert("<br><center><h4>请选择一条数据！</h4></center><br>");
            return false;
        }
        if (data.rows.length > 1) {
            bootbox.alert("<br><center><h4>只能选择一行！</h4></center><br>");
            return false;
        }
        if (data.rows.length == 1) {
            customerFlag = "2";
            $("#pdivtable").css("display", "none");
            $("#cus").css("display", "none");
            $("#info").css("display", "block");
            $("#customerCode").val(data.rows[0].customerCode);
            console.log(data.rows[0].customerCode)
            $("#customerName").val(data.rows[0].customerName);
            $("#tel").val(data.rows[0].tel);
            $("#customerAddress").val(data.rows[0].customerAddress);
        }
    });
    //return "";
});
$("#cancel_btn").click(function () {
    $("#cus").css("display", "block");
    $("#info").css("display", "none");
    $("#customerCode").val("");
    $("#customerName").val("");
    $("#tel").val("");
    $("#customerAddress").val("");
});
$("#add").click(function () {
    $("#cus").css("display", "none");
    $("#info").css("display", "block");
});

$("#submit_btn").click("on", function () {
    $("#submit_btn").attr({"disabled":"disabled"});
    var receiveType = $("input[name='chtType']:checked").val();
    if (receiveType == 2) {
        if(!$('#paper').val()){
            bootbox.alert("<br><center><h4>票据编号不能为空，请重新填写！</h4></center><br>");
            $("#submit_btn").removeAttr("disabled");
            return;
        }

    }
    if (!$('#money').val()) {
        bootbox.alert("<br><center><h4>收费金额不能为空，请重新填写！</h4></center><br>");
        $("#submit_btn").removeAttr("disabled");
        return;
    }
    // if (!$('#gas').val()) {
    //     bootbox.alert("<br><center><h4>气量不能为空，请重新填写！</h4></center><br>");
    //     $("#submit_btn").removeAttr("disabled");
    //     return;
    // }
    var gasfeeAtl = new Array();
    var pid = $.md5(JSON.stringify($("form").serializeObject()) + new Date().getTime());
    var date = new Date();
    var currentYear = date.getFullYear();
    console.log(currentYear)
    var currentMonth = date.getMonth() + 1;
    var currentDay = date.getDate();
    var chgUnit = AreaHelper.getDisplay(area_id);
    var customername = $('#customerName').val();
    var customercode = $('#customerCode').val();
    var customerAddress = $('#customerAddress').val();
    var money = $('#money').val();
    var moneydx = digitUppercase(money);
    var operator = $('#person').val();
    console.log(digitUppercase(money));
    var printcontent = {
        "year": currentYear + "",
        "month": currentMonth + "",
        "day": currentDay + "",
        "year": currentYear + "",
        "month": currentMonth + "",
        "day": currentDay + "",
        "chgUnit": (chgUnit ? chgUnit : ""),
        "chgUnit": (chgUnit ? chgUnit : ""),
        "customerName": (customername ? customername : ""),
        "customerCode": (customercode ? customercode : ""),
        "customerName": (customername ? customername : ""),
        "customerCode": (customercode ? customercode : ""),
        "address": (customerAddress ? customerAddress : ""),
        "address": (customerAddress ? customerAddress : ""),
        "money": money,
        "moneyDX": moneydx,
        "money": money,
        "moneyDX": moneydx,
        "contentRight": "",
        "contentLeft": "",
        "opt": UseHelper.getDisplay(user_id),
        "bil": "",
        "mrd": (operator ? operator : ""),
        "opt": UseHelper.getDisplay(user_id),
        "bil": ""
    };
    var parameter = {
        "businesstype": "chginvoice",
        "printcontent": JSON.stringify(printcontent)
    };
    parameter.pid = pid;
    console.log(parameter);
    $.ajax({
        url: "hzqs/spt/pbprt.do?fh=PRTSPT0000000J00&resp=bd",
        type: "POST",
        async: false,
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(parameter),
        dataType: "json",
        success: function (data) {
            console.log(data);
        }
    });
    var auditingJson = $("form").serializeObject();
    if (gpypictureId) {
        filesid = fileId;
    } else {
        filesid = "";
    }
    auditingJson['fileId'] = filesid;
    auditingJson['reservedField1'] = pid;
    auditingJson['createdBy'] = userInfo.userId;
    auditingJson['modifiedBy'] = userInfo.userId;
    console.log(auditingJson);
    if (customerFlag == "2") {
        var customerArchiveId;
        var chgAccountId;
        var gasfeeAccountId;
        var customerAreaId;
        var gasTypeId;
        var customerType;
        var customerKind;
        var customerNum = $('#customerCode').val();
        $.ajax({
            type: 'get',
            url: hzq_rest + 'gasctmarchive/?query={"customerCode":"' + customerNum + '"}',
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            async: false,
            success: function (data) {
                if (data[0].areaId != "23") {
                    customerAreaId = data[0].areaId;
                    gasTypeId = data[0].gasTypeId;
                    customerType = data[0].customerType;
                    customerKind = data[0].customerKind;
                    customerArchiveId = data[0].ctmArchiveId;
                }
            }
        });
        if (customerArchiveId) {
            $.ajax({
                type: 'get',
                url: hzq_rest + 'gaschgaccount/?query={"ctmArchiveId":"' + customerArchiveId + '"}',
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                async: false,
                success: function (data) {
                    chgAccountId = data[0].chgAccountId;
                    if (chgAccountId) {
                        $.ajax({
                            type: 'get',
                            url: hzq_rest + 'gasactgasfeeaccount/?query={"chgAccountId":"' + chgAccountId + '"}',
                            dataType: 'json',
                            contentType: "application/json; charset=utf-8",
                            async: false,
                            success: function (data) {
                                gasfeeAccountId = data[0].chgAccountId;
                            }
                        });
                    }
                }
            });
            var gasfeeAtlId = $.md5($.md5(gasfeeAccountId)+ Math.random() +new Date().getTime())
            gasfeeAtl.push({
                "gasfeeAtlId":gasfeeAtlId,
                "gasfeeAccountId": gasfeeAccountId,
                "customerCode": customerNum,
                "tradeType": "CHG",
                "gas": $('#gas').val(),
                "money": $('#money').val(),
                "tradeDate": moment().format('YYYY-MM-DDTHH:mm:ss'),
                "createdTime":moment().format('YYYY-MM-DDTHH:mm:ss'),
                "modifiedTime":moment().format('YYYY-MM-DDTHH:mm:ss'),
                "clrTag": "0",
                "createdBy": userInfo.userId,
                "modifiedBy": userInfo.userId,
                "reservedField2": $('#remark').val(),
                "chgAccountId": chgAccountId,
                "chargeUnitId": userInfo.charge_unit_id,
                "areaId": customerAreaId,
                "gasTypeId": gasTypeId,
                "customerType": customerType,
                "customerKind": customerKind
            });
        }
        var submitJson = {"sets":[
            {"txid":"1","body":auditingJson,"path":"/gaschgexaminer/","method":"post"},
            {"txid":"2","body":gasfeeAtl,"path":"/gasactgasfeeatl/","method":"post"}
        ]}
        console.log("submit::"+JSON.stringify(submitJson));
        var result = Restful.insert("/hzqs/dbc/pbtxs.do?fh=SELDBC0000000J00&resp=bd&retobj=1",submitJson);
        if(result.results[0]["result"]['success']){
            bootbox.dialog({
                message: "是否打印发票",
                title: "提交成功",
                buttons: {
                    Cancel: {
                        label: "取消",
                        className: "btn-default",
                        callback: function () {
                            location.reload();
                        }
                    }
                    , OK: {
                        label: "确定",
                        className: "btn-primary",
                        callback: function () {
                            var urll = 'http://127.0.0.1:9000/';
                            var data = {
                                "cmdheader": {
                                    "cmdtype": "17"
                                },
                                "param": {
                                    "data": [{"ptid": pid}]
                                }
                            };
                            $.ajax({
                                type: 'get',
                                url: urll,
                                async: false,
                                dataType: "JSONP",
                                data: "data=" + JSON.stringify(data),
                                jsonp: "callfuncname",
                                success: function (ret) {
                                    console.log(ret)
                                    if (ret.result.resultcode == "0") {
                                        bootbox.alert("<br><center><h4>打印成功！</h4></center><br>", function () {
                                            location.reload();
                                        })
                                    } else {
                                        bootbox.alert("<br><center><h4>打印失败！</h4></center><br>");
                                    }
                                },
                                error: function (e) {
                                    console.log(e)
                                }
                            })
                        }
                    }
                }
            });
        }else{
            bootbox.alert("提交失败");
        }
    }
    else if (customerFlag=="1") {
        $.ajax({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            url: hzq_rest + 'gaschgexaminer',
            type: "POST",
            datatype: "json",
            data: JSON.stringify(auditingJson),
            success: function (e) {
                console.log(e);
                if (e.success == true) {
                    bootbox.dialog({
                        message: "是否打印发票",
                        title: "提交成功",
                        buttons: {
                            Cancel: {
                                label: "取消",
                                className: "btn-default",
                                callback: function () {
                                    location.reload();
                                }
                            }
                            , OK: {
                                label: "确定",
                                className: "btn-primary",
                                callback: function () {
                                    var urll = 'http://127.0.0.1:9000/';
                                    var data = {
                                        "cmdheader": {
                                            "cmdtype": "17"
                                        },
                                        "param": {
                                            "data": [{"ptid": pid}]
                                        }
                                    };
                                    $.ajax({
                                        type: 'get',
                                        url: urll,
                                        async: false,
                                        dataType: "JSONP",
                                        data: "data=" + JSON.stringify(data),
                                        jsonp: "callfuncname",
                                        success: function (ret) {
                                            console.log(ret)
                                            if (ret.result.resultcode == "0") {
                                                bootbox.alert("<br><center><h4>打印成功！</h4></center><br>", function () {
                                                    location.reload();
                                                })
                                            } else {
                                                bootbox.alert("<br><center><h4>打印失败！</h4></center><br>");
                                            }
                                        },
                                        error: function (e) {
                                            console.log(e)
                                        }
                                    })
                                }
                            }
                        }
                    });
                    // bootbox.alert("", function () {
                    //     location.reload();
                    // });
                }
            }
        })
    }
});
var digitUppercase = function (n) {
    var fraction = ['角', '分'];
    var digit = [
        '零', '壹', '贰', '叁', '肆',
        '伍', '陆', '柒', '捌', '玖'
    ];
    var unit = [
        ['元', '万', '亿'],
        ['', '拾', '佰', '仟']
    ];
    var head = n < 0 ? '欠' : '';
    n = Math.abs(n);
    var s = '';
    for (var i = 0; i < fraction.length; i++) {
        s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
    }
    s = s || '整';
    n = Math.floor(n);
    for (var i = 0; i < unit[0].length && n > 0; i++) {
        var p = '';
        for (var j = 0; j < unit[1].length && n > 0; j++) {
            p = digit[n % 10] + unit[1][j] + p;
            n = Math.floor(n / 10);
        }
        s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
    }
    return head + s.replace(/(零.)*零元/, '元')
            .replace(/(零.)+/g, '零')
            .replace(/^整$/, '零元整');
};
queryCustomerList = function () {
    return {
        init: function () {
            this.reload();
        },
        reload: function () {
            $('#pdivtable').html('');
            xw = XWATable.init(
                {
                    divname: "pdivtable",
                    //----------------table的选项-------
                    pageSize: 10,
                    columnPicker: true,
                    transition: 'fade',
                    checkboxes: true,
                    sorting: true,
                    checkAllToggle: false,
                    //----------------基本restful地址---
                    restbase: 'gasctmarchive',
                    key_column: 'ctmArchiveId',
                    coldefs: [
                        {
                            col: "ctmArchiveId",
                            friendly: "ctmArchiveId",
                            unique: true,
                            hidden: true,
                            nonedit: "nosend",
                            readonly: "readonly",
                            sorting: true,
                            index: 1
                        },
                        {
                            col: "customerCode",
                            friendly: "客户编号",
                            readonly: "readonly",
                            sorting: true,
                            index: 2
                        },
                        {
                            col: "customerName",
                            friendly: "客户名称",
                            sorting: true,
                            readonly: "readonly",
                            index: 3
                        },
                        {
                            col: "tel",
                            friendly: "客户电话",
                            sorting: true,
                            readonly: "readonly",
                            index: 4
                        },
                        {
                            col: "customerAddress",
                            friendly: "客户地址",
                            sorting: true,
                            index: 5
                        },
                        {
                            col: "idcardType",
                            friendly: "证件类型",
                            sorting: true,
                            index: 5,
                            format: cardTypeFM
                        },
                        {
                            col: "idcard",
                            friendly: "证件号码",
                            sorting: true,
                            index: 5
                        },
                    ]
                    ,
                    findFilter: function () {//find function
                    }
                });
            //--init
        },
    }
}();