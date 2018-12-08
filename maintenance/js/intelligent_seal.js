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

    var areaFormat = function () {
        return {
            f: function (val) {
                return areaHelper.getDisplay(val) == 0 ? "" : areaHelper.getDisplay(val);
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

    return {
        init: function () {
            this.reload();
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
            // <option value="00">未开栓</option>
            // <option value="01">正常</option>
            // <option value="02">暂停用气</option>
            // <option value="03">拆除状态</option>
            // <option value="04">长期不用</option>
            // <option value="99">删除</option>
            var global_remap = {
                "customerState":"00:未开栓,01:正常,02:暂停用气,03:拆除状态,04:长期不用,99:删除",
                "gasTypeId":"db@GAS_BIZ_GAS_TYPE,gasTypeId,gasTypeName",
                "areaId":"db@GAS_BIZ_AREA,areaId,areaName",
                "customerType":"I:IC卡表,P:普表",
            }
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
                    exportxls: {
                        title:"智能封印",
                        remap:global_remap,
                        hidden:false,
                        ci:{}
                    },
                    // restbase: 'gasctmarchive',
                    restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
                    key_column: 'ctmArchiveId',
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
                            col: "customerState",
                            friendly: "客户状态",
                            readonly: "readonly",
                            format:GasModCtm.customerStateFormat,
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

                        // if ($("#find_start_date1").val() && $("#find_end_date1").val()) {
                        //     whereinfo += " to_char(ca.unbolt_time,'yyyy-mm-dd')  between '" + $('#find_start_date1').val() + "' and '" + $("#find_end_date1").val() + "' and ";
                        //     //var find_start_date = RQLBuilder.condition("unboltTime","$gte","to_date('"+ $("#find_start_date").val()+"','yyyy-MM-dd')");
                        // } else if ($("#find_start_date1").val() && !$("#find_end_date1").val()) {
                        //     bootbox.alert("请输入截止日期")
                        // } else if (!$("#find_start_date1").val() && $("#find_end_date1").val()) {
                        //     bootbox.alert("请输入起始日期")
                        // }

                        bd = {
                            "cols": "ca.*"
                            , "froms": "gas_ctm_archive ca"
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
