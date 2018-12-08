
var xw;
$(document).on("click", "#update", function () {
    var archive = $(this).attr("data-kind");
    var data = JSON.parse(archive);
                $("#hide").val(data.levelId);

                $("#customerCode").val(data.customerCode);
                $("#customerName").val(data.customerName);
                $("#gas").val(data.gas);

                $("#avePrice").val(data.avePrice);

                $("#companyScore").val(data.companyScore);
                $("#bussScore").val(data.bussScore);
                $("#loanScore").val(data.loanScore);

});

$(document).on("click", "#save_btn", function () {
  var levelId = $("#hide").val();

    var scoreJson = {
        "companyScore": $("#companyScore").val(),
        "bussScore": $("#bussScore").val(),
        "loanScore": $("#loanScore").val(),
        "modifiedBy":JSON.parse(localStorage.getItem("user_info")).userId,
        "modifiedTime":new Date(moment().format("YYYY-MM-DDTHH:mm:ss") + "-00:00")

    }
    console.log(scoreJson);
    var result= Restful.update("hzqs/hzqrest/gasctmarchivelevel/", levelId, scoreJson);


    if (result == false) {
        bootbox.alert("<center><h4>修改失败。</h4></center>");
    } else if (result == true) {
        bootbox.alert("<center><h4>修改成功。</h4></center>", function () {
            window.location.reload();
           
        });
       
    }

});

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
    var actionFormat = function(){
        return {
            f : function(val, row){
                return "<a  data-target='#updatetable' id='update' data-toggle='modal' data-kind='" + JSON.stringify(row) + "'>" + '编辑' + "</a>";
            }
        }
    }();
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
    var levelFormat = function () {
     
        return {
          
            f: function (data, row) {
                if (data < 100 && data> 80) {
                    console.log(data)
                    return "良好";
                } else if (data > 60) {
                    return "合格";
                } else {
                    return "不合格";
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
            var bd =
            {
                "cols": "a.reportYear,a.gas,a.gasScore,a.avePrice,a.levelId,a.loan_score,a.buss_score,a.company_score,a.company_score+a.buss_score+a.loan_score as total,a.company_score+a.buss_score+a.loan_score as totall,a.customerType,a.customerKind,a.customerCode,a.customerName",
                "froms": "gasCtmArchiveLevel a",
                "wheres": "",
                "page": false
            };
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
            ]).rql()
           
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
                    restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),

                    //restbase: 'gasctmarchivelevel?query=' + queryCondion,
                    key_column: 'levelId',
                    exportxls: {
                        title: "用户列表"
                    },
                    coldefs: [
                        {
                            col: "levelId",
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
                            col: "gas",
                            friendly: "年度用气",
                            validate: "required",
                            index: 4
                        },
                        {
                            col: "gasScore",
                            friendly: "年度分值",
                            validate: "required",
                            index: 5
                        },
                        
                        {
                            col: "avePrice",
                            friendly: "平均价",
                           // validate: "required",
                            index: 6
                        },
                        {
                            col: "loanScore",
                            friendly: "贷款分值",
                            validate: "required",
                            index: 7
                        },
                        {
                            col: "bussScore",
                            friendly: "业务分值",
                            validate: "required",
                            index: 8
                        },
                        {
                            col: "companyScore",
                            friendly: "企业分值",
                            validate: "required",
                            index: 9
                        },
                        {
                            col: "total",
                            friendly: "总分",
                            validate: "required",                            
                            index: 10
                        },
                        {
                            col: "customerKind",
                            friendly: "客户类型",
                            format: customerKindFormat,
                            index: 11
                        },

                        {
                            col: "customerType",
                            friendly: "表具类型",
                            format: customerTypeFormat,
                            index: 12
                        },
                        {
                            col: "totall",
                            friendly: "账户等级类型",
                            format:levelFormat,                            
                            index: 13
                        },
                        {
                            col: "reportYear",
                            friendly: "报表年",
                            nonedit: "nosend",
                            hidden: "hidden",
                            index:  14
                        },
                        {
                            col:"aa",
                            friendly:"操作",
                            format:actionFormat,
                            unique:true,
                            index:15
                        }
                        
                    ],

                    // 查询过滤条件
                    findFilter: function () {
                       
                        var customerCode = $('#find_customerCode').val();
                        var year = $('#find_date').val();

                       

                        var whereinfo = "";
                        if (customerCode) {
                            whereinfo += " and a.customer_code  ='" + customerCode + "' ";
                        }
                        if (year) {
                            whereinfo += " and a.reportYear = " + year + "";
                        }

                      
                        bd = {
                            "cols": "a.reportYear,a.customerType,a.customerKind,a.customerName,a.gas,a.gasScore,a.avePrice,a.levelId,a.loan_score,a.buss_score,a.company_score,a.company_score+a.buss_score+a.loan_score as total,a.customerCode,a.company_score+a.buss_score+a.loan_score as totall",
                            "froms": "gasCtmArchiveLevel a",
                            "wheres": "a.status='1'" + whereinfo,
                            "page": true,
                            "limit": 50
                        }
                        xw.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)));
                        return null;
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

