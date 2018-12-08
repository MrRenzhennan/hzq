/**
 * Created by Administrator on 2017/6/17 0017.
 */



//客户档案

var loginarea = [];
var areaId = JSON.parse(localStorage.getItem("user_info")).area_id
GasModSys.areaList({
    "areaId":areaId,
    "cb":function(data){
        console.log(data)
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
    console.log("change area:" + e + "." + $('#find_unit').val());
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
});
$("#find_gasTypeId1").on("change",function(){
    console.log($(this).val())
    $('#find_gasTypeId2').html('<option value="">请选择</option>').trigger("change")
    var gasType1Helper = RefHelper.create({
        ref_url: 'gasbizgastype/?query={"parentTypeId":"'+$(this).val()+'"}',
        ref_col: "gasTypeId",
        ref_display: "gasTypeName",
    });
    $.map(gasType1Helper.getData(), function (value, key) {
        console.log(key)
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
var gasTypegasFeeAction = function () {
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
                return "<a  href='customer/gas_equipment.html?" + row.ctmArchiveId + "&"+row.customerKind+"'>" + '燃气设备' + "</a> <a href='customer/inhabitant_nonarchiveinfo.html?" + row.ctmArchiveId + "'>" + '详情' + "</a> <a href='customer/non_modify_inhabitant.html?" + row.ctmArchiveId + "'>" + '修改' + "</a>";
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


        reload : function(){
            $('#divtable').html('');
            var bd={
                "cols":"*",
                "froms":"gas_csr_busi_register a left join gas_ctm_archive b on b.customer_code = a.customer_code left join gas_mrd_book c on c.book_id=b.book_id "+
                "left join (select * from  psm_step_inst d where d.gs_ecode='PSEVEN' and d.step_status='8' and d.flow_def_id like 'CHANGEGT%' and d.results='0') d on d.flow_inst_id = a.busi_register_id " +
                "left join (select e.customer_code cuscode,f.money fMoney ,f.trade_date from gas_chg_gas_detail e left join gas_act_gasfee_atl f on f.gasfee_atl_id=e.trade_id )  g on g.cuscode = b.customer_code " ,
                "wheres":"a.business_type_id like 'CHANGEGT%'  and to_char(a.finish_date,'yyyymm') = to_char(trade_date,'yyyymm') and a.area_id in ("+loginarea.join()+")  order by a.accept_date desc,a.finish_date desc",
                // "wheres":"a.business_type_id like 'CHANGEGT%' and a.area_id in ("+loginarea.join()+") order by a.accept_date desc,a.finish_date desc",

                "page":true,
                "limit":50
            }
            /* rf= RFTable.init(*/
            $('#divtable').html('');
            var reasonTypeFormat = function () {
                return {
                    f: function (val) {
                        if (val == "1") {
                            return "死表"
                        } else if (val == "2") {
                            return "下线表用量未收回"
                        } else if (val == "3") {
                            return "其他"
                        }
                    }
                }
            }();
            var businessTypeHelper = RefHelper.create({
                ref_url: 'gascsrbusinesstype/?query={"busiType":"0"}',
                ref_col: "businessTypeId",
                ref_display: "name",
                "sort":"no"
            });
            var businessTypeFormat= function () {
                return {
                    f: function (val) {
                        return businessTypeHelper.getDisplay(val);
                    },
                }
            }();
            var gasTypeHelper = RefHelper.create({
                ref_url: "gasbizgastype",
                ref_col: "gasTypeId",
                ref_display: "gasTypeName",
            });
            var gasTypeHelperFormat= function () {
                return {
                    f: function (val) {
                        return gasTypeHelper.getDisplay(val);
                    },
                }
            }();
            var oldFormat= function () {
                return {
                    f: function (val,row) {
                        var oldGsatype = JSON.parse(row.reservedField1).oldGT
                        return gasTypeHelper.getDisplay(oldGsatype);
                    },
                }
            }();

            var global_remap = {
                "businessTypeId":"CHANGEGT:用气性质变更,CHANGEGT2B:用气性质变更转商,CHANGEGT2R:用气性质变更转民",
                "gasTypeId":"db@GAS_BIZ_GAS_TYPE,gasTypeId,gasTypeName"
            }
            // xw=XWATable.init(
            xw = XWATable.init(
                {
                    divname : "divtable",
                    //----------------table的选项-------
                    pageSize : 10,
                    // pageSize : 200,
                    columnPicker : true,
                    transition : 'fade',
                    checkAllToggle:true,
                    exportxls: {
                        title:"用气性质变更",
                        remap:global_remap,
                        hidden:false,
                        ci:{}
                    },
                    restURL : "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd="+encodeURIComponent(JSON.stringify(bd)),
                    coldefs:[
                        {
                            col: "areaId",
                            friendly: "供气区域",
                            format:areaFormat,
                            sorting: false,
                            index: 1
                        },
                        {
                            col: "businessTypeId",
                            friendly: "类型",
                            sorting: false,
                            format:businessTypeFormat,
                            index: 2
                        },
                        {
                            col: "customerName",
                            friendly: "客户名称",
                            sorting: false,
                            index: 4
                        },
                        {
                            col: "customerCode",
                            friendly: "客户编号",
                            sorting: false,
                            index: 5
                        },
                        {
                            col : 'countperId',
                            format:countperFormat,
                            friendly : '核算员',
                            sorting:false,
                            index : 5
                        },
                        {
                            col : 'serviceperId',
                            format:serviceFormat,
                            friendly : '抄表员',
                            sorting:false,
                            index : 6
                        },
                        {
                            col: "bookCode",
                            friendly: "抄表本",
                            sorting: false,
                            index: 6
                        },
                        {
                            col: "customerAddr",
                            friendly: "客户地址",
                            sorting: false,
                            index: 7
                        },
                        {
                            col: "customerAddr",
                            friendly: "客户地址",
                            sorting: false,
                            index: 7
                        },
                        {
                            col: "gasTypeId",
                            friendly: "新用气性质",
                            format:gasTypeHelperFormat,
                            sorting: false,
                            index: 7
                        },
                        {
                            col: "oldgasTypeId",
                            friendly: "老用气性质",
                            format:oldFormat,
                            sorting: false,
                            index: 7
                        },
                        {
                            col: "acceptDate",
                            friendly: "受理时间",
                            format:dateFormat,
                            index: 8
                        },
                        {
                            col: "finishDate",
                            friendly: "完成时间",
                            format:dateFormat,
                            index: 9
                        },
                        {
                            col: "linkMan",
                            friendly: "联系人",
                            sorting: false,
                            index: 10
                        },
                        {
                            col: "linkPhone",
                            friendly: "联系电话",
                            sorting: false,
                            index: 11
                        },
                        {
                            col: "money",
                            friendly: "金额",
                            sorting: false,
                            index: 12
                        },
                        {
                            col: "tradeDate",
                            friendly: "交易时间",
                            format:dateFormat,
                            sorting: false,
                            index: 13
                        },
                        {
                            col: "description",
                            friendly: "备注",
                            sorting: false,
                            index: 14
                        }

                    ],
                    // 查询过滤条件
                    findFilter : function(){
                        var areaId_select = $('#find_unit option:selected').val(),
                            find_countPer = $('#find_countPer option:selected').val();
                        var whereinfo = "";
                        if (areaId_select) {
                            whereinfo += " a.area_id = '" + areaId_select + "' and ";
                        }
                        if (find_countPer) {
                            whereinfo += " b.countper_id = '" + find_countPer + "' and ";
                        }
                        //添加抄表员的
                        if ($("#find_servicePer option:selected").val()) {
                            whereinfo += " b.serviceper_id = '" + $("#find_servicePer option:selected").val() + "' and ";
                        }
                        if ($("#find_bookcode").val()) {
                            whereinfo += " c.book_code='" + $('#find_bookcode').val() + "' and ";
                        }

                        if ($('#find_customerCode').val()) {
                            whereinfo += " a.customer_code like '%" + $('#find_customerCode').val() + "%' and ";
                        }
                        if ($('#find_customerName').val()) {
                            whereinfo += " a.customer_name like '%" + $('#find_customerName').val() + "%' and ";
                        }
                        if ($('#find_customerState').val()) {
                            whereinfo += " b.customer_state like '%" + $('#find_customerState').val() + "%' and ";
                        }

                        if ($('#find_gasTypeId').val() && !$('#find_gasTypeId1').val() && !$('#find_gasTypeId2').val()) {
                            // console.log($('#find_gasTypeId').val())
                            if($('#find_gasTypeId').val()=="2"){
                                whereinfo += " a.customer_kind='1' and ";
                            }else{
                                whereinfo += " a.customer_kind='9' and ";
                            }
                        }else if ( $('#find_gasTypeId').val() && $('#find_gasTypeId1').val() && !$('#find_gasTypeId2').val() ){
                            console.log($('#find_gasTypeId1').val())
                            whereinfo += " a.gas_type_id like '" + $('#find_gasTypeId1').val() + "%' and ";
                        }else if ( $('#find_gasTypeId').val() && $('#find_gasTypeId1').val()  && $('#find_gasTypeId2').val() ){
                            console.log($('#find_gasTypeId2').val())
                            whereinfo += " a.gas_type_id like '" + $('#find_gasTypeId2').val() + "' and ";
                        }
                        if ($('#find_customerType').val()) {
                            whereinfo += " b.customer_type like '%" + $('#find_customerType').val() + "%' and ";
                        }

                        if ($('#find_customerAddress').val()) {
                            whereinfo += " b.customer_address like'%" + $('#find_customerAddress').val() + "%' and ";
                        }


                        if ($("#find_start_date1").val() && $("#find_end_date1").val()) {
                            whereinfo += " to_char(a.accept_date,'yyyy-mm-dd')  between '" + $('#find_start_date1').val() + "' and '" + $("#find_end_date1").val() + "'and";
                        } else if ($("#find_start_date1").val() && !$("#find_end_date1").val()) {
                            bootbox.alert("请输入截止日期")
                        } else if (!$("#find_start_date1").val() && $("#find_end_date1").val()) {
                            bootbox.alert("请输入起始日期")
                        }

                        bd={
                            "cols":"*",
                            "froms":"gas_csr_busi_register a left join gas_ctm_archive b on b.customer_code = a.customer_code left join gas_mrd_book c on c.book_id=b.book_id "+
                            "left join (select * from  psm_step_inst d where d.gs_ecode='PSEVEN' and d.step_status='8' and d.flow_def_id like 'CHANGEGT%' and d.results='0') d on d.flow_inst_id = a.busi_register_id " +
                            "left join (select e.customer_code cuscode,f.money fMoney ,f.trade_date from gas_chg_gas_detail e left join gas_act_gasfee_atl f on f.gasfee_atl_id=e.trade_id )  g on g.cuscode = b.customer_code " ,
                            "wheres":whereinfo+" a.business_type_id like 'CHANGEGT%'  and to_char(a.finish_date,'yyyymm') = to_char(trade_date,'yyyymm') and a.area_id in ("+loginarea.join()+") order by a.accept_date desc,a.finish_date desc",

                            // "wheres":"a.business_type_id like 'CHANGEGT%' and a.area_id in ("+loginarea.join()+") order by a.accept_date desc,a.finish_date desc",
                            "page":true,
                            "limit":50
                        }


                        xw.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd="+encodeURIComponent(JSON.stringify(bd)));
                        return null;
                    }
                }); // --init

        }

    }

}();
