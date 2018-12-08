// $.each(GasModSys.areaHelper.getRawData(), function (idx, row) {
//     $('#find_unit').append('<option value="' + row.areaId + '" name="' + row.areaId + '">' + row.areaName + '</option>');
// });

$('#find_unit').on('change', function (e) {
    console.log("change area:" + e + "." + $('#find_unit').val());
    // if (!$('#find_unit').val()) {
    $("#find_countPer").html("<option value=''>全部</option>").trigger("change");
    // return false;
    // }
    GasModSys.counterUsersInArea({
        "areaId": $('#find_unit').val(),
        "cb": function (data) {
            if (data.length) {
                var inhtml = "<option value=''>全部</option>";
                $.each(data, function (idx, row) {
                    inhtml += '<option value="' + row.userId + '">' + row.employeeName + '</option>';
                })
                $("#find_countPer").html(inhtml);
                $("#find_countPer").val("").change();
            };

        }
    })
});

$('#find_countPer').on('change', function (e) {
    console.log("change counter:" + e + "." + $('#find_countPer').val());
    $("#find_servicePer").html("");
    $("#find_servicePer").html("<option value=''>全部</option>").trigger("change");
    GasModSys.copyUsersInArea({
        "areaId": $('#find_unit').val(),
        "countperId": $('#find_countPer').val(),
        "cb": function (data) {
            if (data) {
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
/*var protocolvolume = function(){
    var moneyFormat = function () {
        return {
            f: function (val) {
                if (val) {
                    val = val.toFixed(2);
                }
                return val;
            },
        }
    }();
    var dateFormat = function () {
        return {
            f: function (val) {
                if (val) {
                    var date = val.substring(0, 10);
                    return date;
                }

            }
        }
    }();
    return {
        init:function(){
            this.reload()
        },
        reload:function(){
            $("#divtable").html("");
            var bd={
                "cols":"a.*,b.customer_code,b.customer_name,c.book_code,c.countper_id,c.serviceper_id",
                "froms":"gas_act_agree_gas_flow a left join gas_ctm_archive b on b.ctm_archive_id =a.ctm_archive_id left join gas_mrd_book c on c.book_id=b.book_id",
                "wheres":"1=1",
                "page":true,
                "limit":50
            }
            var userHelper = RefHelper.create({
                ref_url: "gassysuser",
                ref_col: "userId",
                ref_display: "employeeName"
            });
            var userFormat = function () {
                return {
                    f: function (val) {
                        return userHelper.getDisplay(val)
                    },
                }
            }();
            XWATable.init({
                divname: "divtable",
                //----------------table的选项-------
                pageSize: 10,
                columnPicker: true,
                transition: 'fade',
                tableId: "divtable",
                checkAllToggle: true,
                //----------------基本restful地址---
                // restbase: 'gasactagreegasflow',
                restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
                key_column: 'actAgreegasFlowId',
                coldefs: [

                    {
                        col: "customerCode",
                        friendly: "客户编号",
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
                        col: "countperId",
                        friendly: "核算员",
                        format:userFormat,
                        sorting: true,
                        index: 3
                    },
                    {
                        col: "serviceperId",
                        friendly: "抄表员",
                        format:userFormat,
                        sorting: true,
                        index: 4
                    },
                    {
                        col: "bookCode",
                        friendly: "抄表本",
                        sorting: true,
                        index: 5
                    },
                    {
                        col: "applyCode",
                        friendly: "申请单号",
                        sorting: true,
                        index: 6
                    },
                    {
                        col: "agreeGas",
                        friendly: "协议气量",
                        sorting: true,
                        index: 7
                    },
                    {
                        col: "agreeMon",
                        friendly: "协议金额",
                        format: moneyFormat,
                        sorting: true,
                        index: 8
                    },
                    {
                        col: "argeeReason",
                        friendly: "协议原因",
                        sorting: true,
                        index: 9
                    },
                    {
                        col: "measurePrice",
                        friendly: "阶梯和气价",
                        sorting: true,
                        index: 10
                    },
                    {
                        col: "startTime",
                        friendly: "开始时间",
                        format: dateFormat,
                        sorting: true,
                        index: 11
                    },
                    {
                        col: "endTime",
                        friendly: "截止时间",
                        format: dateFormat,
                        sorting: true,
                        index: 12
                    },
                    {
                        col: "remark",
                        friendly: "备注",
                        sorting: true,
                        index: 13
                    }

                ],
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
                        console.log($("#find_bookcode").val())
                        whereinfo += " b.book_code like '%" + $('#find_bookcode').val() + "%' and ";
                    }
                    if ($("#find_tel").val()) {
                        whereinfo += " ca.tel like '%" + $('#find_tel').val() + "%' and ";
                    }

                    if ($('#find_customerCode').val()) {
                        whereinfo += " ca.customer_code like '%" + $('#find_customerCode').val() + "%' and ";
                    }
                    if ($('#find_customerName').val()) {
                        whereinfo += " ca.customer_name like '%" + $('#find_customerName').val() + "%' and ";
                    }
                    if ($('#find_idcardno').val()) {
                        console.log($('#find_idcardno').val())
                        whereinfo += " ca.idcard like '%" + $('#find_idcardno').val() + "%' and ";
                    }
                    if ($('#find_customerState').val()) {
                        whereinfo += " ca.customer_state = '" + $('#find_customerState').val() + "' and ";
                    }

                    if ($('#find_gasTypeId').val() && !$('#find_gasTypeId1').val() && !$('#find_gasTypeId2').val()) {
                        // console.log($('#find_gasTypeId').val())
                        // whereinfo += " ca.gas_type_id  like '" + $('#find_gasTypeId').val() + "%' and ";
                        if ($('#find_gasTypeId').val() == "2") {
                            whereinfo += " ca.customer_kind='1' and ";
                        } else {
                            whereinfo += " ca.customer_kind='9' and ";
                        }


                    } else if ($('#find_gasTypeId').val() && $('#find_gasTypeId1').val() && !$('#find_gasTypeId2').val()) {
                        console.log($('#find_gasTypeId1').val())
                        whereinfo += " ca.gas_type_id like '" + $('#find_gasTypeId1').val() + "%' and ";
                    } else if ($('#find_gasTypeId').val() && $('#find_gasTypeId1').val() && $('#find_gasTypeId2').val()) {
                        console.log($('#find_gasTypeId2').val())
                        whereinfo += " ca.gas_type_id = '" + $('#find_gasTypeId2').val() + "' and ";
                    }

                    if ($('#find_customerType').val()) {
                        whereinfo += " ca.customer_type = '" + $('#find_customerType').val() + "' and ";
                    }

                    if ($('#find_customerAddress').val()) {
                        whereinfo += " ca.customer_address like'%" + $('#find_customerAddress').val() + "%' and ";
                    }


                    if ($('#find_booktype').val()) {
                        whereinfo += " b.book_type = '" + $('#find_booktype').val() + "' and ";
                    }

                    if ($("#find_start_date1").val() && $("#find_end_date1").val()) {
                        whereinfo += " to_char(ca.unbolt_time,'yyyy-mm-dd')  between '" + $('#find_start_date1').val() + "' and '" + $("#find_end_date1").val() + "' and ";
                    } else if ($("#find_start_date1").val() && !$("#find_end_date1").val()) {
                        bootbox.alert("请输入截止日期")
                    } else if (!$("#find_start_date1").val() && $("#find_end_date1").val()) {
                        bootbox.alert("请输入起始日期")
                    }

                    if ($("#find_start_date").val() && $("#find_end_date").val()) {
                        whereinfo += " to_char(ca.created_time,'yyyy-mm-dd')  between '" + $('#find_start_date').val() + "' and '" + $("#find_end_date").val() + "' and ";
                    } else if ($("#find_start_date").val() && !$("#find_end_date").val()) {
                        bootbox.alert("请输入截止日期")
                    } else if (!$("#find_start_date").val() && $("#find_end_date").val()) {
                        bootbox.alert("请输入起始日期")
                    }
                    // console.log(whereinfo)
                    var bd={
                        "cols":"a.*,b.customer_code,b.customer_name,c.book_code,c.countper_id,c.serviceper_id",
                        "froms":"gas_act_agree_gas_flow a left join gas_ctm_archive b on b.ctm_archive_id =a.ctm_archive_id left join gas_mrd_book c on c.book_id=b.book_id",
                        "wheres":whereinfo + "1=1 order by ",
                        "page":true,
                        "limit":50
                    }
                    wx.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)));
                }

            })
        }
    }
}()*/


var loginarea = [];
var areaId = JSON.parse(localStorage.getItem("user_info")).area_id
GasModSys.areaList({
    "areaId":areaId,
    "cb":function(data){
        console.log(data)
        $.each(data,function(key,val){
            loginarea.push("'"+val.areaId+"'");
            $('#find_unit').append('<option value="' + val.areaId + '" name="' + val.areaId + '">' + val.areaName + '</option>');
        })
    }
});



/**
 * Created by anne on 2017/6/11.
 */

//当日
$("#find_today_sign3").click(function(){
    $("#find_start_date3").val(date_format(new Date(),"yyyy-MM-dd"));
    $("#find_end_date3").val(date_format(new Date(),"yyyy-MM-dd"));
});
//近一周
$("#find_this_week_sign3").click(function(){
    var date = new Date();
    $("#find_end_date3").val(date_format(date,"yyyy-MM-dd"));
    date.setDate(date.getDate()-6);
    $("#find_start_date3").val(date_format(date,"yyyy-MM-dd"));
});
// 近一月
$("#find_this_month_sign3").click(function(){
    var date = new Date();
    $("#find_end_date3").val(date_format(date,"yyyy-MM-dd"));
    date.setMonth(date.getMonth()-1);
    date.setDate(date.getDate()+1);
    $("#find_start_date3").val(date_format(date,"yyyy-MM-dd"));
});
// 近三月
$("#find_three_month_sign3").click(function(){
    var date = new Date();
    $("#find_end_date3").val(date_format(date,"yyyy-MM-dd"));
    date.setMonth(date.getMonth()-3);
    date.setDate(date.getDate()+1);
    $("#find_start_date3").val(date_format(date,"yyyy-MM-dd"));
});
// 近一年
$("#find_this_year_sign3").click(function(){
    var date = new Date();
    $("#find_end_date3").val(date_format(date,"yyyy-MM-dd"));
    date.setMonth(date.getMonth()-12);
    date.setDate(date.getDate()+1);
    $("#find_start_date3").val(date_format(date,"yyyy-MM-dd"));

});
// 不限
$("#find_anyway_sign3").click(function(){
    $("#find_start_date3").val("");
    $("#find_end_date3").val("");
});



var accountAgreeAction = function () {

    var xw ;

    //用户helper
    var userHelper=RefHelper.create({
        ref_url:"gassysuser",
        ref_col:"userId",
        ref_display:"employeeName",
    });

    var userHelperFormat=function () {
        return{
            f:function(val){
                return userHelper.getDisplay(val)
            }
        }
    }();
    var areaHelper = RefHelper.create({
        ref_url: "gasbizarea/?query={\"status\":\"1\"}",
        ref_col: "areaId",
        ref_display: "areaName",
        sort: "posCode"
    });
    var areaFormat = function () {
        return {
            f: function (val) {
                return areaHelper.getDisplay(val);
            },
        }
    }();
    var dateFormat = function () {
        return{
            f: function (val) {
                if(val){
                    var data= val.substring(0,10);
                    return data;
                }
            }
        }
    }();

   /* var gotoDetail = function () {
        return {
            f : function (val,row) {
                return "<a href='accountManage/agreeGas_detail.html?"+row["actAgreegasFlowId"]+"\'>" + "&nbsp详情"+ "</a><br>"+
                    "<a  href='javascript:void(0)' id = 'recall'   onclick='accountAgreeAction.recall(\""+row["status"]+"\",\""+row["actAgreegasFlowId"]+"\")' data-toggle='modal'>&nbsp;撤回</a>";

            }
        }
    }();*/

    //审核状态
    var examineState= function () {
        return {
            f: function (val) {
                if(val==="1") return "<font color='blue'>审核中</font>";
                else if(val==="2") return "<font>审核通过</font>";
                else if(val==="3") return "<font color='green'>审核未通过</font>";
                else if(val==="4") return "<font color='#ff1493'>待审批</font>";
                else if(val==="5") return "<font color='black'>已撤销</font>";
                else return "error";
            }
        }
    }();

    var stepAndPriceFormat = function () {


        return {
            f : function (val,row) {
                var stepStr = "";
                $.ajax({
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    url: '/hzqs/bil/pbpri.do?fh=VFLSCGC000000J00&resp=bd&bd={"gas_type_id":'+row["gasTypeId"]+'}',
                    type:"GET",
                    async: false,
                    datatype:"json",
                    success:function(e){
                        if(e.ret_code == '1'){
                            if(e.price_type ==2){ //固定价格
                                stepStr = "周期价:"+ e.price1;
                            }else{
                                for(var i=1;i<=5;i++) {
                                    var measurefrom = "measure_from"+i;
                                    var measureto = "measure_to"+i;
                                    var price  = "price"+i;

                                    if((e[measurefrom]==0 ||e[measurefrom]) && e[measureto] && e[price]){
                                        stepStr=stepStr +"第"+i+"阶梯:"+e[measurefrom]+ "~"+e[measureto]+"&nbsp价格:" +e[price]+"<br/>";
                                    }
                                }
                                return stepStr;
                            }
                        }
                    }
                })
                return stepStr;
            }
        }
    }();
    return {


        init: function () {

            this.reload();
        },

        reload:function(){

            $('#divtable').html('');

            var cols = "agreegas.*,archive.customer_name,archive.gas_type_id,archive.customer_address,archive.customer_code,book.countper_id,book.serviceper_id";
            var bd = {"cols":cols,
                "froms":" gas_act_agree_gas_flow agreegas left join gas_ctm_archive archive on " +
                " agreegas.ctm_archive_id = archive.ctm_archive_id  left join gas_mrd_book book on book.book_id=archive.book_id" ,
                "wheres":"agreegas.status = '2' and agreegas.area_id in ("+loginarea.join()+")   order by agreegas.created_time desc ",
                "page":true,
                "limit":50};

            var remarkFormat = function(){
                return{
                    f:function(val){
                        return "<a href='javascript:;' class='remarks' data-remark='"+val+"' >查看</a>";
                    }
                }
            }()
            xw=XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize:10,
                    columnPicker: true,
                    transition: 'fade',
                    checkboxes: true,
                    checkAllToggle:true,
                    //----------------基本restful地址---
                    restURL : "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd="+encodeURIComponent(JSON.stringify(bd)),
                    key_column:'actAgreeGasFlowId',
                    coldefs:[
                       /* {
                            col:"actAgreeGasFlowId",
                            friendly:"协议气量流程ID",
                            hidden:true,
                            unique:"true",
                            readonly:"readonly",
                            nonedit:"nosend",
                            index:1
                        },*/
                        {
                            col:"applyCode",
                            friendly:"申请单号",
                            index:2
                        },
                        {
                            col:"customerCode",
                            friendly:"客户编号",
                            index:3
                        },
                        {
                            col:"areaId",
                            friendly:"供气区域",
                            format:areaFormat,
                            index:4
                        },
                        {
                            col:"customerName",
                            friendly:"客户名称",
                            index:5
                        },
                        {
                            col:"customerAddress",
                            friendly:"客户地址",
                            index:6
                        },
                        {
                            col: "countperId",
                            friendly: "核算员",
                            format:userHelperFormat,
                            sorting: true,
                            index: 7
                        },
                        {
                            col: "serviceperId",
                            friendly: "抄表员",
                            format:userHelperFormat,
                            sorting: true,
                            index: 7
                        },
                        {
                            col:"measurePrice",
                            friendly:"阶梯和气价",
                            format:stepAndPriceFormat,
                            index:8
                        },
                        {
                            col:"argeeReason",
                            friendly:"协议原因",
                            index:9

                        },
                        {
                            col:"agreeGas",
                            friendly:"协议气量",
                            index:10
                        },
                        {
                            col:"agreeMon",
                            friendly:"协议金额",
                            index:11
                        },
                        {
                            col:"startTime",
                            format:dateFormat,
                            friendly:"开始时间",
                            index:12
                        },
                        {
                            col:"endTime",
                            format:dateFormat,
                            friendly:"结束时间",
                            index:13
                        },
                        {
                            col:"status",
                            format:examineState,
                            friendly:"审核状态",
                            index:14
                        },

                        {
                            col:"createdTime",
                            format:dateFormat,
                            friendly:"申请时间",
                            index:16
                        },
                        {
                            col:"createdBy",
                            friendly:"申请人",
                            format:userHelperFormat,
                            index:17
                        },
                        {
                            col:"remark",
                            friendly:"备注",
                            format:remarkFormat,
                            index:17
                        },
                       /* {
                            col:"modifiedTime",
                            format:gotoDetail,
                            friendly:"操作",
                            index:18
                        }*/

                    ],
                    // 查询过滤条件

                    findFilter : function(){
                        var sql= " 1=1 ";

                        if ($('#find_customerCode').val()) {
                            sql+=" and archive.customer_code like '%"+$('#find_customerCode').val()+"%'";
                        }
                        if ($('#find_customerName').val()) {
                            sql+=" and archive.customer_name like '%"+$('#find_customerName').val()+"%'";
                        }

                        var areaId_select = $('#find_unit option:selected').val(),
                            find_countPer = $('#find_countPer option:selected').val();
                        // var copyerid = $("find_countperId").val()

                        if (areaId_select) {
                            sql += " and archive.area_id = '" + areaId_select + "'";
                        }else{
                            sql +=" and archive.area_id in ("+loginarea.join()+")";
                        }
                        if (find_countPer) {
                            sql += " and book.countper_id = '" + find_countPer + "'";
                        }
                        //添加抄表员的
                        if ($("#find_servicePer option:selected").val()) {
                            sql += " and book.serviceper_id = '" + $("#find_servicePer option:selected").val() + "'";
                        }
                        if ($("#find_customerKind").val()) {
                            sql+= " and archive.customer_kind = '"+$("#find_customerKind").val()+"'"
                        }


                        if ($("#find_start_date1").val()) {
                            console.log($("#find_start_date1").val())
                            sql += " and to_char(agreegas.start_time,'yyyy-mm-dd') >= '"+ $('#find_start_date1').val()+"'";
                        }
                        if ($("#find_end_date1").val()) {
                            console.log($("#find_end_date1").val())
                            sql += " and to_char(agreegas.end_time,'yyyy-mm-dd') <= '"+ $('#find_end_date1').val()+"'";
                        }

                        if ($("#find_start_date3").val() && $("#find_end_date3").val()) {
                            sql += " and to_char(agreegas.created_time,'yyyy-mm-dd')  between '" + $('#find_start_date3').val() + "' and '" + $("#find_end_date3").val() + "'";
                        } else if ($("#find_start_date3").val() && !$("#find_end_date3").val()) {
                            bootbox.alert("请输入截止日期")
                        } else if (!$("#find_start_date3").val() && $("#find_end_date3").val()) {
                            bootbox.alert("请输入起始日期")
                        }

                        var bd={
                            "cols":cols,
                            "froms":" gas_act_agree_gas_flow agreegas left join gas_ctm_archive archive on " +
                            " agreegas.ctm_archive_id = archive.ctm_archive_id left join gas_mrd_book book on book.book_id=archive.book_id" ,
                            "wheres":sql+" and agreegas.status = '2' order by agreegas.created_time desc ",
                            "page":true,
                            "limit":50
                        };

                        xw.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd="+encodeURIComponent(JSON.stringify(bd)));
                        return null;
                    }


                }) //--init
        }
    }
}();
$(document).on("click",".remarks",function(){
    bootbox.alert("<h4 style='line-height: 30px;'>"+$(this).attr("data-remark")+"</h4>")
})