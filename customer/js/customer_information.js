/**
 * Created by Administrator on 2017/6/17 0017.
 */



//客户档案

var loginarea = [];
var areaId = JSON.parse(localStorage.getItem("user_info")).area_id;
var userId = JSON.parse(localStorage.getItem("user_info")).userId;

GasModSys.areaList({
    "areaId":areaId,
    "cb":function(data){
        // console.log(data)
        $.each(data,function(key,val){
            loginarea.push(val.areaId);
            $('#find_unit').append('<option value="'+val.areaId+'" name="'+val.areaId+'">'+val.areaName+'</option>');
        })
    }
});
/*
$.each(GasModSys.areaHelper.getRawData(), function(idx, row) {
    $('#find_unit').append('<option value="'+row.areaId+'" name="'+row.areaId+'">'+row.areaName+'</option>');
});

*/


$('#find_unit').on('change', function (e) {
    // console.log("change area:" + e + "." + $('#find_unit').val());
    GasModSys.counterUsersInArea({
        "areaId": $('#find_unit').val(),
        "cb": function (data) {
            if(data.length){
                var inhtml = "<option value=''>全部</option>";
                $.each(data, function (idx, row) {
                    inhtml += '<option value="' + row.userId + '">' + row.employeeName + '</option>';
                })
                $("#find_countPer").html(inhtml);
                $("#find_countPer").val("").change();
            }


        }
    })
});

$('#find_countPer').on('change', function (e) {
    console.log("change counter:" + e + "." + $('#find_countPer').val());
    $("#find_servicePer").val("").change();
    $("#find_servicePer").html("");
    $("#find_servicePer").html("<option value=''>全部</option>");
    GasModSys.copyUsersInArea({
        "areaId": $('#find_unit').val(),
        "countperId": $('#find_countPer').val(),
        "cb": function (data) {
            if(data){
                var inhtml = "<option value=''>全部</option>";
                $.each(data, function (idx, row) {
                    inhtml += '<option value="' + row.userId + '">' + row.employeeName + '</option>';
                })
                $("#find_servicePer").html(inhtml);
                $("#find_servicePer").val("").change();

            }

        }
    })
})

// 用气性质级联

var gasTypeHelper = RefHelper.create({
    ref_url: "gasbizgastype/?query={\"parentTypeId\":\"1\"}",
    ref_col: "gasTypeId",
    ref_display: "gasTypeName",
});
$.map(gasTypeHelper.getData(), function (value, key) {
    // console.log(key)
    $('#find_gasTypeId').append('<option value="' + key + '">' + value + '</option>');
});
$("#find_gasTypeId").on("change",function(){
    // console.log($(this).val())
    $('#find_gasTypeId1').html('<option value="">请选择</option>').trigger("change")
    var gasType1Helper = RefHelper.create({
        ref_url: 'gasbizgastype/?query={"parentTypeId":"'+$(this).val()+'"}',
        ref_col: "gasTypeId",
        ref_display: "gasTypeName",
    });
    $.map(gasType1Helper.getData(), function (value, key) {
        // console.log(key)
        $('#find_gasTypeId1').append('<option value="' + key + '">' + value + '</option>');
    });
});
$("#find_gasTypeId1").on("change",function(){
    // console.log($(this).val())
    $('#find_gasTypeId2').html('<option value="">请选择</option>').trigger("change")
    var gasType1Helper = RefHelper.create({
        ref_url: 'gasbizgastype/?query={"parentTypeId":"'+$(this).val()+'"}',
        ref_col: "gasTypeId",
        ref_display: "gasTypeName",
    });
    $.map(gasType1Helper.getData(), function (value, key) {
        // console.log(key)
        $('#find_gasTypeId2').append('<option value="' + key + '">' + value + '</option>');
    });
});



$('#input_many').click(function () {
    window.location = "customer/select_mrdBook.html";
});
$('#input_one').click(function () {
    window.location = "customer/inhabitant_establish.html";
});

$('#input_one1').click(function () {
    window.location = "customer/non_inhabitant_establish.html";
    // window.location = "customer/input_non_inhabitant_archive.html";
});

$('#add_btn').click(function () {
    window.location = "customer/add_union_collectFee.html";
});


var xw;
var inhabitnatArchiveManagementAction = function () {
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

    var serviceperHelper = RefHelper.create({
        ref_url: "gassysuser",
        ref_col: "userId",
        ref_display: "employeeName",
    });


    var countperHelper = RefHelper.create({
        ref_url: "gassysuser",
        ref_col: "userId",
        ref_display: "employeeName",
    });

    var areaFormat = function () {
        return {
            f: function (val) {
                return areaHelper.getDisplay(val) == 0 ? "" : areaHelper.getDisplay(val);
            },
        }
    }();
    var bookHelper = RefHelper.create({
        ref_url: "gasmrdbook",
        ref_col: "bookId",
        ref_display: "bookCode",
    });

    var bookFormat = function () {
        return {
            f: function (val) {
                return bookHelper.getDisplay(val) == 0 ? "" : bookHelper.getDisplay(val);
            },
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

    var countperFormat = function () {
        return {
            f: function (val) {
                return countperHelper.getDisplay(val);
            },
        }
    }();

    var serviceFormat = function () {
        return {
            f: function (val) {
                return serviceperHelper.getDisplay(val);
            },
        }
    }();


    var archiveIdFormat = function () {
        return {
            f: function (val, row) {
                if(row.customerKind == "1"){
                    return "<a  href='customer/gas_equipment.html?" + row.ctmArchiveId + "&"+row.customerKind+"'>" + '燃气设备' + "</a> <a href='customer/inhabitant_archiveinfo.html?" + row.ctmArchiveId + "'>" + '详情' + "</a> <a href='customer/modify_inhabitant.html?" + row.ctmArchiveId + "'>" + '修改' + "</a>";

                }else if(row.customerKind == "9"){
                    return "<a  href='customer/gas_equipment.html?" + row.ctmArchiveId + "&"+row.customerKind+"'>" + '燃气设备' + "</a> <a href='customer/inhabitant_nonarchiveinfo.html?" + row.ctmArchiveId + "'>" + '详情' + "</a> <a href='customer/non_modify_inhabitant.html?" + row.ctmArchiveId + "'>" + '修改' + "</a>"
                    +" <a class='uploadpic' data-id='"+row.ctmArchiveId+"' data-code='"+row.customerCode+"'>上传照片</a>";
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
            // 供气区域 select init
          /*  $.map(areaHelper.getData(), function (value, key) {
                $('#find_unit').append('<option value="' + key + '">' + value + '</option>');
            });
            // 核算员 select init
            $.map(countperHelper.getData(), function (value, key) {
                $('#find_countperid').append('<option value="' + key + '">' + value + '</option>');
            });
            // 抄表员 select init
            $.map(serviceperHelper.getData(), function (value, key) {
                $('#find_serviceperid').append('<option value="' + key + '">' + value + '</option>');
            });*/
            // 用气性质 select init
        },


        reload: function () {
            $('#divtable').html('');


            var bd = {
                "cols": "*",
                "froms": "gas_ctm_archive",
                "wheres": "1=0",
                "page": true,
                "limit": 50
            };
            wx = XWATable.init(
                {
                    divname: "divtable",
                    tableId:"divtable",
                    findbtn:"find_button",
                    //----------------table的选项-------
                    pageSize: 10, 			//Initial pagesize
                    columnPicker: true,         //Show the columnPicker button
                    sorting: true,
                    transition: 'fade',  //(bounce, fade, flip, rotate, scroll, slide).
                    checkboxes: false,           //Make rows checkable. (Note. You need a column with the 'unique' property)
                    checkAllToggle: true,        //Show the check-all toggle//+RQLBuilder.like("KEYY", "a").rql()
                    //----------------基本restful地址---
                    // restbase: 'gasctmarchive/queryArchiveInfo',
                    key_column: 'ctmArchiveId',
                    // restbase: 'gasctmarchive?query={"customerKind":"1"}',
                    restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
                    coldefs: [

                        {
                            col: "customerCode",
                            friendly: "客户编号",
                            readonly: "readonly",
                            sorting: true,
                            index: 1
                        },
                        {
                            col: "customerName",
                            friendly: "客户名称",
                            sorting: true,
                            index: 2
                        },
                        {
                            col: "customerAddress",
                            friendly: "客户地址",
                            sorting: true,
                            index: 3
                        },
                        {
                            col: "areaId",
                            friendly: "供气区域",
                            readonly: "readonly",
                            format: areaFormat,
                            ref_url: "gasbizarea",
                            ref_name: "areaName",
                            ref_value: "areaId",
                            sorting: true,
                            index: 4
                        },
                        {
                            col: "countperId",
                            friendly: "核算员",
                            format: countperFormat,
                            sorting: true,
                            index: 5
                        },
                        {
                            col: "serviceperId",
                            format: serviceFormat,
                            friendly: "抄表员",
                            sorting: true,
                            index: 7
                        },
                        {
                            col: "bookId",
                            friendly: "抄表本",
                            format:bookFormat,
                            sorting: true,
                            index: 8
                        },

                        {
                            col: "customerState",
                            friendly: "客户状态",
                            readonly: "readonly",
                            format:GasModCtm.customerStateFormat    ,
                            sorting: true,
                            // hidden:true,
                            index: 9
                        },
                        {
                            col: "gasTypeId",
                            friendly: "用气性质",
                            readonly: "readonly",
                            format: gasTypeFormat,
                            ref_url: "gasbizgastype",
                            ref_name: "gasTypeName",
                            ref_value: "gasTypeId",
                            sorting: true,
                            index: 10
                        },
                        {
                            col: "unboltTime",
                            friendly: "开栓时间",
                            readonly: "readonly",
                            format: dateFormat,
                            index: 11
                        },
                        {
                            col: "customerType",
                            friendly: "表类别",
                            readonly: "readonly",
                            sorting: true,
                            format: GasModCtm.customerTypeFormat,
                            index: 12
                        },
                        {
                            col: "ctmArchiveId",
                            friendly: "操作",
                            readonly: "readonly",
                            format: archiveIdFormat,
                            sorting: false,
                            index: 13
                        }
                    ],
                    //---------------查询时过滤条件
                    findFilter: function () {
                        var areaId_select = $('#find_unit option:selected').val(),
                            find_countPer = $('#find_countPer option:selected').val();
                        // var copyerid = $("find_countperId").val()
                        var whereinfo = "";
                        if (areaId_select) {
                            whereinfo += " ca.area_id = '" + areaId_select + "' and ";
                        }
                        if (find_countPer) {
                            whereinfo += " b.countper_id = '" + find_countPer + "' and ";
                        }
                        //添加抄表员的
                        if ($("#find_servicePer option:selected").val()) {
                            whereinfo += " b.serviceper_id = '" + $("#find_servicePer option:selected").val() + "' and ";
                        }
                        if ($("#find_bookcode").val()) {
                            whereinfo += " b.book_code='" + $('#find_bookcode').val() + "' and ";
                        }

                        if ($('#find_customerCode').val()) {
                            whereinfo += " ca.customer_code = '" + $('#find_customerCode').val() + "' and ";
                        }
                         if ($('#find_customerName').val()) {
                            whereinfo += " ca.customer_name like '%" + $('#find_customerName').val() + "%' and ";
                        }
                        if ($('#find_customerState').val()) {
                            whereinfo += " ca.customer_state = '" + $('#find_customerState').val() + "' and ";
                        }

                        if ($('#find_gasTypeId').val() && !$('#find_gasTypeId1').val() && !$('#find_gasTypeId2').val()) {
                            // console.log($('#find_gasTypeId').val())
                            if($('#find_gasTypeId').val()=="2"){
                                whereinfo += " ca.customer_kind='1' and ";
                            }else{
                                whereinfo += " ca.customer_kind='9' and ";
                            }
                        }else if ( $('#find_gasTypeId').val() && $('#find_gasTypeId1').val() && !$('#find_gasTypeId2').val() ){
                            console.log($('#find_gasTypeId1').val())
                            whereinfo += " ca.gas_type_id like '" + $('#find_gasTypeId1').val() + "%' and ";
                        }else if ( $('#find_gasTypeId').val() && $('#find_gasTypeId1').val()  && $('#find_gasTypeId2').val() ){
                            console.log($('#find_gasTypeId2').val())
                            whereinfo += " ca.gas_type_id like '" + $('#find_gasTypeId2').val() + "' and ";
                        }

                        if ($('#find_customerType').val()) {
                            whereinfo += " ca.customer_type like '%" + $('#find_customerType').val() + "%' and ";
                        }

                        if ($('#find_customerAddress').val()) {
                            whereinfo += " ca.customer_address like'%" + $('#find_customerAddress').val() + "%' and ";
                        }

                        if ($("#find_start_date1").val() && $("#find_end_date1").val()) {
                            whereinfo += " to_char(ca.unbolt_time,'yyyy-mm-dd')  between '" + $('#find_start_date1').val() + "' and '" + $("#find_end_date1").val() + "' and ";
                            //var find_start_date = RQLBuilder.condition("unboltTime","$gte","to_date('"+ $("#find_start_date").val()+"','yyyy-MM-dd')");
                        } else if ($("#find_start_date1").val() && !$("#find_end_date1").val()) {
                            bootbox.alert("请输入截止日期")
                        } else if (!$("#find_start_date1").val() && $("#find_end_date1").val()) {
                            bootbox.alert("请输入起始日期")
                        }

                        bd = {
                            "cols": "ca.*,b.countper_id,b.serviceper_id"
                            , "froms": "gas_ctm_archive ca left join gas_mrd_book b on b.book_id = ca.book_id "
                            , "wheres": whereinfo + " ca.area_id in ("+loginarea.join()+") order by ca.customer_code",
                            "page": true,
                            "limit": 50
                        };
                        wx.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)));
                    }

                });
        }

    }

}();
var ctmArchiveId,customerCode;
$(document).on("click",'.uploadpic',function(){
    ctmArchiveId = $(this).attr("data-id");
    customerCode = $(this).attr("data-code");
    
    $("#photopic").modal("show")

})

$("#claimsubmit").on("click",function(){
    var submit = {};
    console.log(ctmArchiveId+"======="+customerCode)
    if(gpypictureId){
        submit['fileId'] = fileId;
    }else{
        bootbox.alert("<center><h4>请上传照片。</h4></center>")
        return false;
    }
    submit['ctmArchiveId'] = ctmArchiveId;
    submit['customerCode'] = customerCode;
    submit['modifiedTime'] = new Date(new Date()-"-00:00");
    submit['createdTime'] = new Date(new Date()-"-00:00");
    submit['createdBy'] = userId;
    submit['modifiedBy'] = userId;
    var result = Restful.insert(hzq_rest+"gasctmarchivefile",submit)
    console.log(result)
    if(result.success){
        bootbox.alert("<center><h4>提交成功。</h4></center>")
        $("#photopic").modal("hide")
    }else{
        bootbox.alert("<center><h4>提交失败。</h4></center>")
    }



})