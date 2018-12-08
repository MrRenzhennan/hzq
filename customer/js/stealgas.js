
var xw;

$("#find_area").on("change", function () {
    $('#find_unit').html("<option value=''>请选择</option>").trigger("change")
    var station = $(this).val();
    console.log(station)
    var restatus = Restful.findNQ(hzq_rest + 'gassysunit/?query={"areaId":"' + station + '"}');
    console.log(restatus)
    $.each(restatus, function (index, row) {
        $('#find_unit').append('<option value="' + row.unitId + '" name="' + row.areaId + '">' + row.unitName + '</option>');
    })
})

var isCheckBuilder = function(val){
    if(val=="1"){
        return "<select id='isCheck' name='isCheck' class='form-control select2me'>" +
            "<option value='1' selected>是</option>" +
            "<option value='0' >否</option></select>" ;
    }else if(val=="0"){
        return "<select id='isCheck' name='isCheck' class='form-control select2me'>" +
            "<option value='1' >是</option>" +
            "<option value='0' selected>否</option></select>" ;
    }else{
        return "<select id='isCheck' name='isCheck' class='form-control select2me'>" +
            "<option value='1' selected>是</option>" +
            "<option value='0' >否</option></select>" ;
    }
};
var customerKindBuilder = function(val){
    if(val=="1"){
        return "<select id='customerKind' name='customerKind' class='form-control select2me'>" +
            "<option value='1' selected>居民</option>" +
            "<option value='9' >非居民</option></select>" ;
    }else if(val=="9"){
        return "<select id='customerKind' name='customerKind' class='form-control select2me'>" +
            "<option value='1' >居民</option>" +
            "<option value='9' selected>非居民</option></select>" ;
    }else{
        return "<select id='customerKind' name='customerKind' class='form-control select2me'>" +
            "<option value='1' selected>居民</option>" +
            "<option value='9' >非居民</option></select>" ;
    }
};
var customerTypeBuilder = function(val){
    if(val=="I"){
        return "<select id='customerType' name='customerType' class='form-control select2me'>" +
            "<option value='I' selected>IC卡表</option>" +
            "<option value='P' >普表</option></select>" ;
    }else if(val=="P"){
        return "<select id='customerType' name='customerType' class='form-control select2me'>" +
            "<option value='I' >IC卡表</option>" +
            "<option value='P' selected>普表</option></select>" ;
    }else{
        return "<select id='customerType' name='customerType' class='form-control select2me'>" +
            "<option value='I' selected>IC卡表</option>" +
            "<option value='P' >普表</option></select>" ;
    }
};

var UserAction = function () {
    //供气区域helper
    var areaHelper = RefHelper.create({
        ref_url: "gasbizarea",
        ref_col: "areaId",
        ref_display: "areaName"
    });

    // 单位helper
    var unitHelper = RefHelper.create({
        ref_url: "gassysunit",
        ref_col: "unitId",
        ref_display: "unitName"
    });

    // 岗位helper
    var stationHelper = RefHelper.create({
        ref_url: "gasbizstation",
        ref_col: "stationId",
        ref_display: "stationName"
    });

    // 网点helper
    var chargeUnitHelper = RefHelper.create({
        ref_url: "gasbizchargeunit",
        ref_col: "chargeUnitId",
        ref_display: "chargeUnitName"
    });
    var areaFormat = function () {
        return {
            f: function (val) {
                return areaHelper.getDisplay(val);
            }
        }
    }();

    var unitFormat = function () {
        return {
            f: function (val) {
                return unitHelper.getDisplay(val);
            }
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

    var stationFormat = function () {
        return {
            f: function (val) {
                return stationHelper.getDisplay(val);
            }
        }
    }();

    var chargeUnitFromat = function () {
        return {
            f: function (val) {
                return chargeUnitHelper.getDisplay(val);
            }
        }
    }();

    return {

        init: function () {
            // 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)
            this.initHelper();
            this.reload();
            // this.initUnitTree();
        },

        initHelper: function () {

            $.map(stationHelper.getData(), function (value, key) {
                $('#find_station').append('<option value="' + key + '">' + value + '</option>');
            });
        },


        reload: function () {
            var loginarea = [];
            var areaId = JSON.parse(localStorage.getItem("user_info")).area_id
            GasModSys.areaList({
                "areaId": areaId,
                "cb": function (data) {
                    console.log(data)
                    $.each(data, function (key, val) {
                        loginarea.push(val.areaId);
                        $('#find_area').append('<option value="' + val.areaId + '">' + val.areaName + '</option>');
                    })
                }
            });


            $('#divtable').html('');
            
            var queryCondion = RQLBuilder.and([
                RQLBuilder.condition_fc("areaId", "$in", JSON.stringify(loginarea)),
                RQLBuilder.equal("status","1"),
            ]).rql()
            console.log(queryCondion)
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
                    restbase: 'gasctmarchivesteal?query=' + queryCondion,
                    key_column: 'batId',
                    exportxls: {
                        title: "用户列表"
                    },
                    coldefs: [
                        {
                            col: "batId",
                            friendly: "主键ID",
                            unique: "true",
                            hidden: "hidden",
                            nonedit: "nosend",
                            index: 1
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
                           // validate: "required",
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
                            format:isCheckFormat,                            
                            inputbuilder: "isCheckBuilder",
                            index: 9
                        },
                        {
                            col: "customerKind",
                            friendly: "客户类型",
                            inputsource: "custom",
                            inputbuilder: "customerKindBuilder",
                            format:customerKindFormat,
                            hidden: true,
                            index: 10
                        },

                        {
                            col: "customerType",
                            friendly: "表具类型",
                            inputsource: "custom",
                            inputbuilder: "customerTypeBuilder",
                            format:customerTypeFormat,
                            index: 11
                        },
                        {
                            col: "mark",
                            friendly: "认定原因",
                            validate: "required",                            
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
                       

                        var find_username, find_customerCode, find_ischeck, find_area,status,find_start_date,find_end_date;

                        status =RQLBuilder.equal("status","1");

                        if ($('#find_username').val()) {
                            find_username = RQLBuilder.like("customerName", $('#find_username').val());
                        }
                        if ($('#find_customerCode').val()) {
                            find_customerCode = RQLBuilder.like("customerCode", $('#find_customerCode').val());
                        }
                        if ($('#find_ischeck').val()) {
                            find_ischeck = RQLBuilder.equal("ischeck", $('#find_ischeck').val());
                        }
                        
                        if ($("#find_area").val()) {
                            find_area = RQLBuilder.equal("areaId", $("#find_area").val());
                        } else {
                            find_area = RQLBuilder.condition_fc("areaId", "$in", JSON.stringify(loginarea));
                        }

                        if ($("#find_start_date1").val() && $("#find_end_date1").val()) {
                            //find_end_date = RQLBuilder.condition("createdTime","$lte","to_date('"+ $("#find_end_date1").val()+"','yyyy-MM-dd')");
                            find_end_date= RQLBuilder.condition("createdTime","$lte","to_date('"+  $('#find_end_date1').val()+" 23:59:59" +"','yyyy-MM-dd HH24:mi:ss')");

                            find_start_date= RQLBuilder.condition("createdTime","$gte","to_date('"+  $('#find_start_date1').val()+" 00:00:00" +"','yyyy-MM-dd HH24:mi:ss')");
                             //find_start_date = RQLBuilder.condition("createdTime","$gte","to_date('"+ $("#find_start_date1").val()+"','yyyy-MM-dd')");
                        } else if ($("#find_start_date1").val() && !$("#find_end_date1").val()) {
                            bootbox.alert("请输入截止日期")
                        } else if (!$("#find_start_date1").val() && $("#find_end_date1").val()) {
                            bootbox.alert("请输入起始日期")
                        }
                        var filter = RQLBuilder.and([
                            find_username, find_customerCode, find_ischeck, find_area,status,find_start_date,find_end_date
                        ]);

                        xw.setRestURL(hzq_rest + 'gasctmarchivesteal');
                        return filter.rql();
                    },

                    onAdded: function (a, jsondata) {
                        jsondata['createdTime'] = new Date(new Date()+"-00:00");
                        jsondata['createdBy'] = JSON.parse(localStorage.getItem("user_info")).userId;
                        return validateForm(jsondata);
                    },
                    onUpdated: function (ret, jsondata) {
                        jsondata['modifiedTime'] = new Date(new Date()+"-00:00");
                        jsondata['modifiedBy'] = JSON.parse(localStorage.getItem("user_info")).userId;
                        return validateForm(jsondata);
                    },
                    onDeleted: function (ret, jsondata) {
                    },
                })
        }
    }
}();




$(document).on("click", "#upd_button", function () {
    $("#dg_password").hide()
    $("#password").attr("disabled", "disabled");
    $("#areaId").attr("disabled", "disabled");
})
//回显
var huixian;

$(document).on("click", "#userRole", function () {


    $("#menuRole").html("")
    $("#spRole").html("")

    var userid = $(this).attr("data-id");
    console.log(userid);
    var user = Restful.getByID(hzq_rest + "gassysuser", userid);
    $("#userName").val(user.employeeName)
    $("#userName").attr("userId", userid);

    var bd = {
        "cols": "*",
        "froms": "gas_sys_role",
        "wheres": "1=1 order by roleCode asc",
        "page": false
    }
    $.ajax({
        type: 'get',
        url: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (data) {
            console.log(data.rows)
            if (data.rows) {
                $.each(data.rows, function (index, item) {
                    if (item.roleType == "1") {
                        $("#menuRole").append('<li style="display: inline-block;width: 16%; line-height: 30px;"><input name="rolemenu" style="margin-right: 10px;" id="' + item.roleId + '" type="checkbox">' + item.roleName + '</li>')
                    } else if (item.roleType == "2") {
                        $("#spRole").append('<li style="display: inline-block;width: 16%; line-height: 30px;"><input name="rolemenu"  style="margin-right: 10px;" id="' + item.roleId + '" type="checkbox">' + item.roleName + '</li>')
                    }
                })
            }
        },
        error: function (err) {
            // alert("find all err");
        }
    });


    $.ajax({
        type: 'get',
        url: hzq_rest + 'gassysuserrole/?query={"userId":"' + userid + '"}',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (data) {
            var userroleId = [];
            console.log(data);
            huixian = data;
            $.each(data, function (index, item) {
                // userroleId.push(item.roleId);
                $(".checkRoleMenu input[id='" + item.roleId + "']").attr("checked", true);
            })

        },
        error: function (err) {
            // alert("find all err");
        }
    });

})








$('#mrd_del_btm').on('click', function (e) {
    var selrows = xw.getTable().getData(true);
    console.log(selrows)
    if (selrows.rows.length == 0) {
        bootbox.alert("<br><center><h4>请选择需要删除的行</h4></center><br>");
        return;
    }
    var batchids = new Array();
    $.each(selrows.rows, function (idx, row) {
        console.log(row)
        if (row.status != '3') {
            batchids.push(row.batId);
        } else {
            bootbox.alert("<center><h4>该人员已经是删除状态。</h4></center>")
            return false;
        }
    })
    console.log(batchids)
    if (batchids.length == selrows.rows.length) {
        var box = bootbox.confirm({
            // title: "删除未抄表记录",
            buttons: {
                confirm: {
                    label: '确认',
                    className: 'blue'
                },
                cancel: {
                    label: '取消',
                    className: 'btn-default'
                }
            },
            message: "<br><center><h4>确定删除选择（" + selrows.rows.length + "）条记录吗？</h4></center><br>",
            callback: function (result) {
                if (result) {

                    var result = Restful.updateRNQ(hzq_rest + "gasctmarchivesteal", batchids.join(','), { status: '3', "modifiedTime": new Date(moment().format("YYYY-MM-DDTHH:mm:ss") + "-00:00"), "modifiedBy": JSON.parse(localStorage.getItem("user_info")).userId })
                    console.log(result)
                    if (result && result.success) {
                        bootbox.alert("<br><center><h4>删除成功：共删除(" + result.retObj + ")条</h4></center><br>");
                        xw.update();
                    } else {
                        bootbox.alert("<br><center><h4>删除失败。</h4></center><br>")
                    }
                }
            }
        });
    }
});

