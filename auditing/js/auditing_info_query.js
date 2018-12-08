/**
 * Created by alex on 2017/8/6.
 */
var receiveTypeEnum = {"1": "现金", "2": "支票", "3": "其他"};
ComponentsPickers.init();
var receiveTypeFM = function () {
    return {
        f: function (val) {
            return receiveTypeEnum[val];
        },
    }
}();
var receiveTypeAction = function () {
    var detailedInfoFormat = function () {
        return {
            f: function (val, row) {
                return "<a id='examinerInfo' data-target='#examiner' data-toggle='modal' data-kind='" + JSON.stringify(row) + "'>" + '详情' + "</a>" + "|" +
                    "<a id='print' data-toggle='modal' data-kind='" + JSON.stringify(row) + "'>" + '打印' + "</a>";
            }
        }
    }();
    return {
        init: function () {
            this.reload();
        },
        reload: function () {

            $('#divtable').html('');

            xw = XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize: 10,
                    columnPicker: true,
                    transition: 'fade',
                    checkboxes: true,
                    checkAllToggle: true,
                    //----------------基本restful地址---
                    restbase: 'gaschgexaminer/?sort=-createdTime',
                    key_column: 'examinerId',
                    coldefs: [
                        {
                            col: "customerCode",
                            friendly: "客户编号",
                            sorting: true,
                            index: 1
                        },
                        {
                            col: "customerName",
                            friendly: "客户姓名",
                            sorting: true,
                            index: 2
                        },
                        {
                            col: "address",
                            friendly: "客户地址",
                            index: 3
                        },
                        {
                            col: "chtType",
                            friendly: "收费方式",
                            format: receiveTypeFM,
                            sorting: false,
                            index: 4
                        },
                        {
                            col: "chgDate",
                            friendly: "收费日期",
                            sorting: true,
                            index: 5
                        },
                        {
                            col: "chgMoney",
                            friendly: "收费金额",
                            sorting: false,
                            index: 6
                        },
                        {
                            col: "operator",
                            friendly: "经手人",
                            index: 7
                        },

                        {
                            col: "ticketNo",
                            friendly: "票据单号",
                            sorting: false,
                            index: 8
                        },
                        {
                            col: "reservedField2",
                            friendly: "气量",
                            sorting: false,
                            index: 9
                        },
                        {
                            col: "remark",
                            friendly: "备注",
                            sorting: false,
                            index: 10
                        },
                        {
                            col: "examinerId",
                            friendly: "操作",
                            format: detailedInfoFormat,
                            hidden: false,
                            sorting: false,
                            index: 11
                        }


                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var customerCode, customerName, customerAddress, receiveType;
                        var querys = new Array();
                        if ($('#customerCode').val()) {
                            querys.push(RQLBuilder.equal("customerCode", $.trim($('#customerCode').val())));
                        }
                        if ($('#customerName1').val()) {
                            querys.push(RQLBuilder.like("customerName", $.trim($('#customerName1').val())));
                        }
                        if ($('#customerAddress1').val()) {
                            querys.push(RQLBuilder.like("address", $.trim($('#customerAddress1').val())));
                        }
                        if ($('#receiveType').val()) {
                            querys.push(RQLBuilder.equal("chtType", $.trim($('#receiveType').val())));
                        }
                        if ($('#find_start_date1').val()) {
                            querys.push(RQLBuilder.condition("chgDate", "$gte", "to_date('" + $('#find_start_date1').val() + " 00:00:00" + "','yyyy-MM-dd HH24:mi:ss')"));
                        }
                        if ($('#find_end_date1').val()) {
                            querys.push(RQLBuilder.condition("chgDate", "$lte", "to_date('" + $('#find_end_date1').val() + " 23:59:59" + "','yyyy-MM-dd HH24:mi:ss')"));
                        }
                        xw.setRestURL(hzq_rest + 'gaschgexaminer/?sort=createdTime');
                        return RQLBuilder.and(querys).rql();
                    }
                });
        }

    }
}();
$(document).on('click', "#examinerInfo", function () {
    var row = JSON.parse($(this).attr("data-kind"));
    $('#archive input').each(function (index) {
        $(this).attr("name");
        if ($(this).attr('name') == "chtType") {
            $(this).val(receiveTypeEnum[row[$(this).attr('name')]])
        }
        // else if ($(this).attr('name') == "direction") {
        //     $(this).val(GasModCtms.directionFormat(data[0][$(this).attr('name')]))
        // }
       else {
            $(this).val(row[$(this).attr('name')]);
        }
    });
    if(row.fileId){
        var picpath = row.fileId.split(",");
        console.log(picpath)
        $.each(picpath,function(index){
            pic(picpath[index]);
        });
    }

});
$('#examiner').on('hide.bs.modal', function () {
    $("#grid").html("");
    $("#slideId").html("");
});
$(document).on('click', "#print", function () {
    var row = JSON.parse($(this).attr("data-kind"));
    var pid = row.reservedField1;
    console.log(pid)
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
});
function pic(busiId) {
    console.log(busiId);
    $.ajax({
        url: hzq_rest + "gasbasfile?fields={}&query={\"busiId\":\"" + busiId + "\"}",
        method: "get",
        async: false,
        dataType: "json",
        success: function (data) {
            if (data && data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    var datali = data[i];
                    $("#grid").append("<li><figure><img src='/hzqs/sys/download.do?fileId=" + datali.fileId + "&w=300' alt='" + datali.fileName + "'/></figure></li>")
                    $("#slideId").append("<li><figure><img src='/hzqs/sys/download.do?fileId=" + datali.fileId + "' alt='" + datali.fileName + "'/></figure></li>")
                }
            }

            // console.log("ssdsds"+JSON.stringify(data));
        },
        error: function (data) {
            bootbox.alert(data);

        }

    });
}