/**
 * Created by jack on 2017/3/8.
 */
//联动！！


var loginarea = [];
var areaId = JSON.parse(localStorage.getItem("user_info")).area_id
var query = {
    "cols":" area_id,area_name ",
    //+ " SELECT AREA_ID FROM GAS_SYS_AREA START WITH AREA_ID=#{area_id,jdbcType=VARCHAR} CONNECT BY PRIOR PARENTID=AREA_ID) A ",
    "froms":" gas_biz_area where parent_area_id='"+areaId+"' union" +
    " select area_id,area_name from gas_biz_area start with area_id='"+areaId+"' connect by prior area_id=parent_area_id " ,
    "where":"1=1",
    "page":false
}
$.ajax({
    //url: Utils.queryURL(hzq_rest+ "gassysuser")+'fields={"userId":1,"employeeName":1,'+
    //'"stationId":1,"chargeUnitId":1}&query='+query,
    url:'/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00',
    dataType: 'json',
    type: 'POST',
    contentType: "application/json; charset=utf-8",
    data:JSON.stringify(query),
    async: false,
}).done(function(data,retcode) {
    console.log(data.rows);
    $.each(data.rows,function(key,val){
        loginarea.push(val.areaId);
        $('#find_unit').append('<option value="' + val.areaId + '">' + val.areaName + '</option>');
    })

});



$('#find_unit').on('change', function (e) {
    console.log("change area:" + e + "." + $('#find_unit').val());
    GasModSys.counterUsersInArea({
        "areaId": $('#find_unit').val(),
        "cb": function (data) {
            var inhtml = "<option value=''>全部</option>";
            $.each(data, function (idx, row) {
                inhtml += '<option value="' + row.userId + '">' + row.employeeName + '</option>';
            })
            $("#find_countPer").html(inhtml);
            $("#find_countPer").val("").change();

        }
    })
});

$('#find_countPer').on('change', function (e) {
    console.log("change counter:" + e + "." + $('#find_countPer').val());
    $("#select2-chosen-3").html("")
    $("#find_servicePer").html("<option value=''>全部</option>");
    GasModSys.copyUsersInArea({
        "areaId": $('#find_unit').val(),
        "countperId": $('#find_countPer').val(),
        "cb": function (data) {
            var inhtml = "<option value=''>全部</option>";
            $.each(data,function (idx,row) {
                inhtml += '<option value="' + row.userId + '">' + row.employeeName + '</option>';
            })
            $("#find_servicePer").html(inhtml);
            $("#find_servicePer").val("").change();

        }
    })
});


var gasTypeHelper = RefHelper.create({
    ref_url: "gasbizgastype/?query={\"parentTypeId\":\"3\"}",
    ref_col: "gasTypeId",
    ref_display: "gasTypeName",
});
$.map(gasTypeHelper.getData(), function (value, key) {
    console.log(key)
    $('#find_gasTypeId').append('<option value="' + key + '">' + value + '</option>');
});
$("#find_gasTypeId").on("change",function(){
    console.log($(this).val())
    $('#find_gasTypeId1').html('<option value="">请选择</option>').trigger("change")
    var gasType1Helper = RefHelper.create({
        ref_url: 'gasbizgastype/?query={"parentTypeId":"'+$(this).val()+'"}',
        ref_col: "gasTypeId",
        ref_display: "gasTypeName",
    });
    $.map(gasType1Helper.getData(), function (value, key) {
        console.log(key)
        $('#find_gasTypeId1').append('<option value="' + key + '">' + value + '</option>');
    });
})



/*var dateFormat = function () {
    return {
        f: function (val) {
            console.log(val)
            var date = val.substring(0,10);
            return date;
        }
    }
}();*/

var xw;

var ArchiveManagementAction = function () {
    // 供气区域helper
    var areaHelper = RefHelper.create({
        ref_url: "gasbizarea",
        ref_col: "areaId",
        ref_display: "areaName"
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
            }
        }
    }();

    //Format
    var gasTypeFormat = function () {
        return {
            f: function (val) {
                return gasTypeHelper.getDisplay(val);
            }
        }
    }();

    var countperFormat = function () {
        return {
            f: function (val) {
                return countperHelper.getDisplay(val);
            }
        }
    }();

    var serviceFormat = function () {
        return {
            f: function (val) {
                return serviceperHelper.getDisplay(val);
            }
        }
    }();


    var archiveIdFormat = function () {
        return {
            f: function (val, row) {
                return "<a href='customer/inhabitant_nonarchiveinfo.html?" + row.ctmArchiveId + "'>" + '详情' + "</a> <a href='customer/non_modify_inhabitant.html?" + row.ctmArchiveId + "'>" + '修改' + "</a>";
            }
        }
    }();

    return {
        init: function () {
            this.initHelper();
            this.reload();
        },

        initHelper: function () {
           /* $.map(areaHelper.getData(), function (value, key) {
                $('#find_unit').append('<option value="' + key + '">' + value + '</option>');
            });*/
           /* $.map(gasTypeHelper.getData(), function (value, key) {
                $('#find_gasTypeId').append('<option value="' + key + '">' + value + '</option>');
            });*/
        },

        reload: function () {
            $('#divtable').html('');
            var bd = {"cols":"ca.*,b.countper_id,b.serviceper_id"
                ,"froms":"gas_ctm_archive ca inner join gas_mrd_book b on b.book_id = ca.book_id "
                ,"wheres": "ca.book_id = b.book_id and ca.customer_kind = '9' and ca.area_id in ("+loginarea.join()+")",
                "page":true,
                "limit":50
            };
           /* $.ajax({
                url:"/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
                type:"post",
                data:JSON.stringify(bd),
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                async: false,
                success: function(data){
                    console.log(data)
                }
            });*/
            xw=XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize: 10, 			//Initial pagesize
                    columnPicker: true,         //Show the columnPicker button
                    sorting: true,
                    transition: 'fade',  //(bounce, fade, flip, rotate, scroll, slide).
                    checkboxes: false,           //Make rows checkable. (Note. You need a column with the 'unique' property)
                    checkAllToggle: true,        //Show the check-all toggle//+RQLBuilder.like("KEYY", "a").rql()
                    //----------------基本restful地址---
                    // restbase: 'gasctmarchive?query={"customerKind":"9"}',
                    restURL : "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd="+encodeURIComponent(JSON.stringify(bd)),
                    key_column: 'ctmArchiveId',
                    coldefs: [
                        {
                            col: "areaId",
                            friendly: "供气区域",
                            readonly: "readonly",
                            format: areaFormat,
                            ref_url: "gasbizarea",
                            ref_name: "areaName",
                            ref_value: "areaId",
                            sorting: false,
                            index: 1
                        },
                        {
                            col: "countperId",
                            friendly: "核算员",
                            format: countperFormat,
                            sorting: false,
                            index: 2
                        },
                        {
                            col: "serviceperId",
                            format: serviceFormat,
                            friendly: "抄表员",
                            sorting: false,
                            index: 3
                        },
                        {
                            col: "bookId",
                            friendly: "抄表本",
                            readonly: "readonly",
                            sorting: false,
                            index: 4
                        },
                        {
                            col: "customerCode",
                            friendly: "客户编号",
                            readonly: "readonly",
                            sorting: false,
                            index: 5
                        },
                        {
                            col: "customerName",
                            friendly: "客户名称",
                            sorting: false,
                            index: 6
                        },
                        {
                            col: "customerAddress",
                            friendly: "客户地址",
                            sorting: false,
                            index: 7
                        },
                        {
                            col: "customerState",
                            friendly: "客户状态",
                            readonly: "readonly",
                            format: GasModCtm.customerStateFormat,
                            sorting: false,
                            // hidden:true,
                            index: 8
                        },
                        {
                            col: "gasTypeId",
                            friendly: "用气性质",
                            readonly: "readonly",
                            format: gasTypeFormat,
                            ref_url: "gasbizgastype",
                            ref_name: "gasTypeName",
                            ref_value: "gasTypeId",
                            sorting: false,
                            index: 9
                        },
                        {
                            col: "unboltTime",
                            friendly: "开栓时间",
                            readonly: "readonly",
                            format: dateFormat,
                            index: 10
                        },
                        {
                            col: "customerType",
                            friendly: "客户类别",
                            readonly: "readonly",
                            sorting: false,
                            format: GasModCtm.customerTypeFormat,
                            index: 11
                        },
                        {
                            col: "ctmArchiveId",
                            friendly: "操作",
                            readonly: "readonly",
                            format: archiveIdFormat,
                            sorting: false,
                            index: 12
                        }
                    ],
                    //---------------查询时过滤条件
                    findFilter: function () {


                        var areaId_select = $('#find_unit option:selected').val(),
                            find_countPer = $('#find_countPer option:selected').val();
                        // var copyerid = $("find_countperId").val()
                        var whereinfo ="";
                        if (areaId_select) {
                            whereinfo += " ca.area_id='" + areaId_select +"' and ";
                        }

                        if(find_countPer){
                            whereinfo += " b.countper_id='" + find_countPer +"' and ";
                        }
                        //添加抄表员的
                        if($("#find_servicePer option:selected").val()){
                            whereinfo += " b.serviceper_id = '" + $("#find_servicePer option:selected").val() +"' and ";
                        }


                        if($("#find_bookcode").val()){
                            console.log($("#find_bookcode").val())
                            whereinfo += " ca.book_id like '%" + $('#find_bookcode').val() +"%' and ";
                        }
                        if($('#find_customerCode').val())
                        {
                            whereinfo += " ca.customer_code like '%" + $('#find_customerCode').val() +"%' and ";
                        }
                        if($('#find_customerState').val())
                        {
                            whereinfo += " ca.customer_state like '%" + $('#find_customerState').val() +"%' and ";
                        }


                        if ($('#find_gasTypeId').val() && !$('#find_gasTypeId1').val()) {
                            whereinfo += " ca.gas_type_id like '%" + $('#find_gasTypeId').val() + "%' and ";
                        }else if ( $('#find_gasTypeId').val() && $('#find_gasTypeId1').val() ){
                            whereinfo += " ca.gas_type_id like '%" + $('#find_gasTypeId1').val() + "%' and ";
                        }

                        if ($('#find_customerType').val()) {
                            whereinfo += " ca.customer_type like '%" + $('#find_customerType').val() +"%' and ";
                        }
                        if ($('#find_customerType').val()) {
                            whereinfo += " ca.customer_type like '%" + $('#find_customerType').val() +"%' and ";
                        }
                        if($('#find_customerAddress').val())
                        {
                            whereinfo += " ca.customer_address like'%" + $('#find_customerAddress').val() +"%' and ";
                        }

                        if($("#find_start_date").val() && $("#find_end_date").val()){
                            whereinfo += " to_char(ca.unbolt_time,'yyyy-mm-dd')  between '" + $('#find_start_date').val() +"' and '"+$("#find_end_date").val()+"' and ";
                        }else if($("#find_start_date").val() && !$("#find_end_date").val()){
                            bootbox.alert("请输入截止日期")
                        }else if(!$("#find_start_date").val() && $("#find_end_date").val()){
                            bootbox.alert("请输入起始日期")
                        }


                        bd = {"cols":"ca.*,b.countper_id,b.serviceper_id"
                            ,"froms":"gas_ctm_archive ca inner join gas_mrd_book b on b.book_id = ca.book_id "
                            ,"wheres":whereinfo+ " ca.book_id = b.book_id and ca.customer_kind = '9' and ca.area_id in ("+loginarea.join()+")",
                            "page":true,
                            "limit":50
                        };

                        console.log("findFilter::");
                        xw.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd="+encodeURIComponent(JSON.stringify(bd)));


                    }
                })
        }
    }
}();