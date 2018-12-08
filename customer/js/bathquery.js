$(document).on("click", ".cancel", function () {
    var archive = $(this).attr("data-archive");
    bootbox.confirm("<center><h4>确定删除吗?</h4></center>", function (result) {
        if (result === false) {
        } else {
            var submitJson = {
                "sets": [
                    { "txid": "1", "body": { "status": "3", "modifiedBy": JSON.parse(localStorage.getItem("user_info")).userId, "modifiedTime": new Date(moment().format("YYYY-MM-DDTHH:mm:ss") + "-00:00") }, "path": "/gasctmarchivebath/" + archive, "method": "PUT" },
                ]
            }
            console.log(submitJson)
            var result = Restful.insert("/hzqs/dbc/pbtxs.do?fh=SELDBC0000000J00&resp=bd", submitJson)
            console.log(result)
            if (result.success == false) {
                bootbox.alert("<center><h4>删除失败。</h4></center>");
            } else if (result.success == undefined) {
                if (result.results[0]["result"]['success']) {
                    bootbox.alert("<center><h4>删除成功。</h4></center>", function () {
                        window.location.reload();
                    });
                }
            }

        }

    })
})
$(document).on("click", "#updatebath", function () {
    var archive = $("#hide").val();

    var code = $("#cCode1").val();
    var name = $("#cName1").val();
    var mcode = $("#meterCode1").val();

    var mmodel = $("#meterModel1").val();

    var install = $("#installation1").val();
    var is = $("#find_ischeck1").val();

    var kind = $("#find_ckind1").val();
    var type = $("#find_cType1").val();
    var mark = $("#mark1").html();

    var addr = $("#cAddress1").val();
    var updateall = {};
    updateall.customerCode = $("#cCode1").val();
    updateall.customerName = $("#cName1").val();
    updateall.customerAddress = $("#cAddress1").val();
    updateall.meterNo = $("#meterCode1").val();
    updateall.meterModel = $("#meterModel1").val();
    updateall.installation = $("#installation1").val();
    updateall.isCheck = $("#find_ischeck1").val();
    updateall.customerKind = $("#find_ckind1").val();
    updateall.customerType = $("#find_cType1").val();
    updateall.mark = $("#mark1").val();
    updateall.modifiedBy = JSON.parse(localStorage.getItem("user_info")).userId;
    updateall.modifiedTime = new Date(moment().format("YYYY-MM-DDTHH:mm:ss") + "-00:00") ;
    console.log(updateall);
    var submitJson = {
        "sets": [
            { "txid": "1", "body": updateall, "path": "/gasctmarchivebath/" + archive, "method": "PUT" },
        ]
    }



    var result = Restful.insert("/hzqs/dbc/pbtxs.do?fh=SELDBC0000000J00&resp=bd", submitJson)

    if (result.success == false) {
        bootbox.alert("<center><h4>修改失败。</h4></center>");
    } else if (result.success == undefined) {
        if (result.results[0]["result"]['success']) {
            bootbox.alert("<center><h4>修改成功。</h4></center>", function () {
                window.location.reload();
               
            });
        }
    }

});

$(document).on("click", ".update", function () {
    var archive = $(this).attr("data-archive");

    $.ajax({
        url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
        type: "POST",
        async: false,
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({
            cols: "a.*",
            froms: "gas_ctm_archive_bath a",
            wheres: "a.batId ='" + archive + "'",
            page: "false",
            limit: 1
        }),
        dataType: "json",
        success: function (data) {

            if (data && data.rows && data.rows.length > 0) {

                var data = data.rows[0];
                console.log(data);
                console.log($("#find_ischeck1"));

                $("#hide").val(archive);

                $("#cCode1").val(data.customerCode);
                $("#cName1").val(data.customerName);
                $("#meterCode1").val(data.meterNo);

                $("#meterModel1").val(data.meterModel);

                $("#installation1").val(data.installation);
                $("#find_ischeck1").val(data.isCheck).trigger("change");

                $("#find_ckind1").val(data.customerKind).trigger("change");
                $("#find_cType1").val(data.customerType).trigger("change");
                $("#mark1").html(data.mark);

                $("#cAddress1").val(data.customerAddress);
                $("#area1").val(data.areaId).trigger("change");

            } else {
            }
        },
        error: function () {
        }
    });




})

var loginarea = [];
var areaId = JSON.parse(localStorage.getItem("user_info")).area_id
GasModSys.areaList({
    "areaId": areaId,
    "cb": function (data) {
        console.log(data)
        $.each(data, function (key, val) {
            loginarea.push(val.areaId);
            $("select[name=unit]").append('<option value="' + val.areaId + '" name="' + val.areaId + '">' + val.areaName + '</option>');
        })
    }
});

$("#cCode").blur(function () {
    $("#all").val("");
    $.ajax({
        url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
        type: "POST",
        async: false,
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({
            cols: "b.customerName,b.customerAddress,b.areaId,mm.meterNo,b.customerKind,b.customerType,mms.meterModelName,b.customerCode",
            froms: "gas_ctm_archive b inner join gas_ctm_meter cm on b.ctm_archive_id =cm.ctm_archive_id inner join  gas_mtr_meter mm on cm.meterId = mm.meterId inner join gas_mtr_meterspec mms on mm.meter_model_id = mms.meter_model_id ",
            wheres: " b.customerCode='" + $("#cCode").val() + "'",
            page: "false",
            limit: 1
        }),
        dataType: "json",
        success: function (data) {
            if (data && data.rows && data.rows.length > 0) {

                var data = data.rows[0];
                console.log(data);
                $("#cName").val(data.customerName);
                $("#cAddress").val(data.customerAddress);
                $("#linkTel").val(data.tel);
                $("#meterCode").val(data.meterNo);
                $("#meterModel").val(data.meterModelName);
                $("#find_ckind").val(data.customerKind);
                $("#find_cType").val(data.customerType);
                $("#area").val(data.customerType);

            } else {
            }
        },
        error: function () {
        }
    });

});
$('#insertId').click(function () {
    var customerCode = $("#customerCode").val();

    if (!$("#find_ischeck").val()) {
        bootbox.alert("请选择是否被稽查");
        return false;
    }
    if (!$("#area").val()) {
        bootbox.alert("请选择供气区域");
        return false;
    }
    if (!$("#mark").val()) {
        bootbox.alert("燃气设施描述不能为空");
        return false;
    }
    var apply = {
        "customerCode": $("#cCode").val(),
        "areaId": $("#area").val(),
        "mark": $("#mark").val(),
        "customerType": $("#find_cType").val(),
        "customerKind": $("#find_ckind").val(),
        "customerAddress": $("#cAddress").val(),
        "customerName": $("#cName").val(),
        "meterNo": $("#meterCode").val(),
        "meterModel": $("#meterModel").val(),
        "installation": $("#installation").val(),
        "isCheck": $("#find_ischeck").val(),
        "status": "1"
    };

    console.log(apply);
    var result = Restful.insert(hzq_rest + "gasctmarchivebath", apply)

    if (result['success']) {
        bootbox.alert("添加成功", function () {
            window.location.href = "customer/bathquery.html"
        });

    } else {
        bootbox.alert("添加失败");
    }
});



//用户helper
var userHelper = RefHelper.create({
    ref_url: "gassysuser",
    ref_col: "userId",
    ref_display: "employeeName",
});

var userHelperFormat = function () {
    return {
        f: function (val) {
            return userHelper.getDisplay(val)
        }
    }
}();
var gasTypeHelper = RefHelper.create({
    ref_url: "gasbizgastype/?query={\"parentTypeId\":\"1\"}",
    ref_col: "gasTypeId",
    ref_display: "gasTypeName",
});

var xw;
var cusSatisfactionAction = function () {
    // 供气区域helper
    var areaHelper = RefHelper.create({
        ref_url: "gasbizarea",
        ref_col: "areaId",
        ref_display: "areaName",
    });
    // 用气性质helper
    var gasTypeHelper = RefHelper.create({
        ref_url: "gasbizgastype",
        ref_col: "gasTypeId",
        ref_display: "gasTypeName",
    });


    var areaFormat = function () {
        return {
            f: function (val) {
                return areaHelper.getDisplay(val) == 0 ? "" : areaHelper.getDisplay(val);
            },
        }
    }();
    var customerTypeFormat = function () {
        return {
            f: function (data, row) {
                if (data == "P") {
                    return "普表";
                } else if (data == "I") {
                    return "IC卡表";
                } else {
                    return "";
                }
            }
        }
    }();
    var isCheckFormat = function () {
        return {
            f: function (data, row) {
                if (data == "1") {
                    return "是";
                } else if (data == "0") {
                    return "否";
                } else {
                    return "";
                }
            }
        }
    }();
    var customerKindFormat = function () {
        return {
            f: function (data, row) {
                if (data == "1") {
                    return "居民";
                } else if (data == "9") {
                    return "非居民";
                } else {
                    return "";
                }
            }
        }
    }();

    //Format
    var gasTypeFormat = function () {
        return {
            f: function (val) {
                return gasTypeHelper.getDisplay(val);
            },
        }
    }();



    var detailFormat = function () {
        return {
            f: function (val, row) {
                return "<a  data-target='#meterInfo' id='meterInfo1' ' data-toggle='modal' data-kind='" + JSON.stringify(row) + "'>" + '修改' + "</a>"
            }
        }
    }();


    return {
        init: function () {
            this.initHelper();
            this.reload();
        },

        initHelper: function () {
            $.map(gasTypeHelper.getData(), function (value, key) {

                $("select[name=gasType]").append('<option value="' + key + '">' + value + '</option>');
            });
            var areaId = UserInfo.init().area_id;
            var loginarea1 = [];
            GasModSys.areaList({
                "areaId": areaId,
                "cb": function (data) {

                    $.each(data, function (key, val) {
                        loginarea1.push(val.areaId);
                        $('#area').append('<option value="' + val.areaId + '">' + val.areaName + '</option>');
                        $('#area1').append('<option value="' + val.areaId + '">' + val.areaName + '</option>');
                    })
                }
            });


        },


        reload: function () {
            $('#divtable').html('');
            var specificFormat = function () {
                return {
                    f: function (val, row) {
                        return "<button class = 'cancel' data-id='" + val + "' data-archive='" + row.batId + "'>删除</button>" + "|" + "<button class = 'update' data-toggle='modal'  data-id='" + val + "' data-target='#update_one_modal' data-archive='" + row.batId + "'>修改</button>"
                    }
                }
            }()

            var bd =
                {
                    "cols": "a.customerName,a.customerAddress,a.customerKind,a.customerType,a.batId,a.areaId,a.meterModel,a.meterNo,mms.meterModelName,a.installation,a.isCheck,a.mark,a.status,a.customerCode",
                    "froms": "gasCtmArchiveBath a left join gas_ctm_archive b on a.customer_code=b.customerCode left join gas_ctm_meter cm on b.ctm_archive_id =cm.ctm_archive_id left join  gas_mtr_meter mm on cm.meterId = mm.meterId left join gas_mtr_meterspec mms on mm.meter_model_id = mms.meter_model_id",
                    "wheres": "a.status ='1'",
                    "page": false
                };

            /* rf= RFTable.init(*/
            $('#divtable').html('');
            var gasTypeHelper = RefHelper.create({
                ref_url: "gasbizgastype",
                ref_col: "gasTypeId",
                ref_display: "gasTypeName",
            });
            var gasTypeHelperFormat = function () {
                return {
                    f: function (val) {
                        return gasTypeHelper.getDisplay(val);
                    },
                }
            }();


            // xw=XWATable.init(
            xw = XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize: 10,
                    checkboxes: true,
                    columnPicker: true,
                    transition: 'fade',
                    checkAllToggle: true,
                    restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
                    key_column: 'batId',
                    coldefs: [
                        {
                            col: "batId",
                            friendly: "操作",
                            unique: "true",
                            hidden: "hidden",
                            nonedit: "nosend",
                            format: specificFormat,
                            index: 14
                        },
                        {
                            col: "customerCode",
                            friendly: "客户编号",
                            validate: "required",
                            index: 2
                        },
                        {
                            col: "customerName",
                            friendly: "客户名称",
                            validate: "required",
                            index: 3
                        },
                        {
                            col: "areaId",
                            friendly: "供气区域",
                            inputsource: "select",
                            ref_url: 'gasbizarea?query={"status":"1"}',
                            ref_name: "areaName",
                            ref_value: "areaId",
                            validate: "required",
                            format: areaFormat,
                            index: 4
                        },
                        {
                            col: "meterModel",
                            friendly: "表规格",
                            validate: "required",
                            index: 5
                        },
                        {
                            col: "meterNo",
                            friendly: "表编号",
                            validate: "required",
                            index: 6
                        },

                        {
                            col: "installation",
                            friendly: "安装位置",
                            validate: "required",
                            index: 7
                        },
                        {
                            col: "customerAddress",
                            friendly: "客户地址",
                            validate: "required",
                            index: 8
                        },
                        {
                            col: "isCheck",
                            friendly: "是否被稽查",
                            validate: "required",
                            inputsource: "custom",
                            format: isCheckFormat,
                            inputbuilder: "isCheckBuilder",
                            index: 9
                        },
                        {
                            col: "customerKind",
                            friendly: "客户类型",
                            format: customerKindFormat,
                            hidden: true,
                            index: 10
                        },

                        {
                            col: "customerType",
                            friendly: "表具类型",

                            format: customerTypeFormat,
                            index: 11
                        },
                        {
                            col: "mark",
                            friendly: "燃气设施描述",
                            index: 12
                        },
                        {
                            col: "status",
                            friendly: "状态",
                            nonedit: "nosend",
                            hidden: "hidden",
                            index: 13
                        }

                    ],
                    // 查询过滤条件
                    findFilter: function () {

                        var customerCode = $('#find_customerCode').val();
                        var customerName = $('#find_customerName').val();

                        var areaId_select = $('#find_unit option:selected').val();

                        var whereinfo = "";
                        if (customerCode) {
                            whereinfo += " and a.customer_code  ='" + customerCode + "' ";
                        }
                        if (customerName) {
                            whereinfo += " and a.customer_name = '" + customerName + "'";
                        }

                        if (areaId_select) {
                            whereinfo += "and a.area_id = '" + areaId_select + "' ";
                        }
                        if ($("#find_start_date1").val() && $("#find_end_date1").val()) {
                            whereinfo += "and to_char(a.created_time,'yyyy-mm-dd')  between '" + $('#find_start_date1').val() + "' and '" + $("#find_end_date1").val() + "'";
                            //var find_start_date = RQLBuilder.condition("unboltTime","$gte","to_date('"+ $("#find_start_date").val()+"','yyyy-MM-dd')");
                        } else if ($("#find_start_date1").val() && !$("#find_end_date1").val()) {
                            bootbox.alert("请输入截止日期")
                        } else if (!$("#find_start_date1").val() && $("#find_end_date1").val()) {
                            bootbox.alert("请输入起始日期")
                        }


                        bd = {
                            "cols": "a.customerName,a.customerAddress,a.customerKind,a.customerType,a.batId,a.areaId,a.meterModel,a.meterNo,a.installation,a.isCheck,a.mark,a.status,a.customerCode",
                            "froms": "gasCtmArchiveBath a left join gas_ctm_archive b on a.customer_code=b.customerCode",
                            "wheres": "a.status='1'" + whereinfo,
                            "page": true,
                            "limit": 50
                        }
                        xw.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)));
                        return null;
                    }
                }); // --init

        }

    }

}();
$(document).on('click', "#meterInfo1", function () {
    var dateFormat = function (val) {
        if (val) {
            var date = val.substring(0, 10);
            return date;
        }
    };
    var row = JSON.parse($(this).attr("data-kind"));
    lookId = row.lookId;
    $("#customerCode1").val(row.customerCode);
    $("#customerName1").val(row.customerName);
    $("#customerAddress1").val(row.customerAddress);
    $("#lookDesc1").val(row.lookDesc);
    $("#lookTime1").val(row.lookTime.substring(0, 10));
    $("#lookBy1").val(row.lookBy);
    pic(row.fileId);



});
