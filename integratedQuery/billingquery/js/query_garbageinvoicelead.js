/**
 * Created by anne on 2017/6/3.
 */
var loginarea = [];
var areaId = JSON.parse(localStorage.getItem("user_info")).area_id
GasModSys.areaList({
    "areaId":areaId,
    "cb":function(data){
        console.log(data)
        $.each(data,function(key,val){
            loginarea.push("'"+val.areaId+"'");
            $('#find_areaId').append('<option value="' + val.areaId + '" name="' + val.areaId + '">' + val.areaName + '</option>');
        })
    }
});
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
//抄表本helper
var bookHelper=RefHelper.create2({
    ref_url:"gasmrdbook",
    ref_col:"bookId",
    ref_display:"bookCode",
});

var bookHelperFormat=function () {
    return{
        f:function(val){
            return bookHelper.getDisplay(val)
        }
    }
}();
//供气区域helper
var areaHelper=RefHelper.create({
    ref_url:"gasbizarea",
    ref_col:"areaId",
    ref_display:"areaName",
});

var areaHelperFormat=function () {
    return{
        f:function(val){
            return areaHelper.getDisplay(val)
        }
    }
}();

//收费方式
var chgtypeHelper=RefHelper.create({
    ref_url:"gaschgtype",
    ref_col:"chgTypeId",
    ref_display:"chargeTypeName",
});

var chgtypeFormat=function () {
    return{
        f:function(val){
            return chgtypeHelper.getDisplay(val)
        }
    }
}();

var changeUnitHelper=RefHelper.create({
    ref_url:"gasbizchargeunit",
    ref_col:"chargeUnitId",
    ref_display:"chargeUnitName",
});

var changeUnitFormat=function () {
    return{
        f:function(val){
            return changeUnitHelper.getDisplay(val)
        }
    }
}();

var ChargeCorrectAction= function () {

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

    var gotoDetail = function () {
        return {
            f : function (val,row) {
                return "<a href='javascript:;' class='information' data-row='"+JSON.stringify(row)+"'>详情</a>";

            }
        }
    }();
    //审核状态
    var examineState= function () {
        return {
            f: function (val) {
                if(val==="1") return "<font color=''>审核中</font>";
                else if(val==="2") return "<font color=''>审核通过</font>";
                else if(val==="3") return "<font color=''>审核未通过</font>";
                else if(val==="4") return "<font color=''>待审批</font>";
                else if(val==="5") return "<font color=''>已撤销</font>";
                else return "error";
            }
        }
    }()

    return {

        init: function () {
            // 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)
            this.reload();
            this.initHelper();

        },

        initHelper:function(){
            //correct_reason select init
            var data={"表具损坏":"表具损坏","重新开栓":"重新开栓","换表下线":"换表下线","抄串户":"抄串户","预估气量过高":"预估气量过高"}
            $.map(data, function (key, val) {
                $('#correct_reason').append('<option  value="' + val + '">' + key + '</option>');
            });


            $.each(GasModSys.areaHelper.getRawData(), function (idx, row) {
                // $('#find_areaId').append('<option value="' + row.areaId + '" name="' + row.areaId + '">' + row.areaName + '</option>');
            });

        },


        reload : function(){
            var login_user = localStorage.getItem("user_info");
            console.log(login_user.userId);
            var loginuser_area_id = '1';
            $('#divtable').html('');


            var bd = {"cols":"*",
                "froms":"gas_chg_waste_detail correct",
                "wheres":"1=0 and correct.area_id in ("+loginarea.join()+") order by  correct.created_time desc ",
                "page":"true",
                "limit":50};
            /* rf= RFTable.init(*/
            $('#divtable').html('');
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
                    // restbase:"gaschgwastedetail",
                    restURL : "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd="+encodeURIComponent(JSON.stringify(bd)),
                    coldefs:[

                        {
                            col : 'createdBy',
                            format:userHelperFormat,
                            friendly : '操作人',
                            sorting:false,
                            index : 1
                        },
                        {
                            col : 'areaId',
                            format:areaHelperFormat,
                            friendly : '供气区域',
                            sorting:false,
                            index : 2
                        },
                        {
                            col : 'chargeUnitId',
                            friendly : '营业网点',
                            format:changeUnitFormat,
                            sorting : false,
                            index : 3
                        },
                        {
                            col : 'customerCode',
                            friendly : '客户编号',
                            sorting:false,
                            index : 4
                        },
                        {
                            col : 'customerName',
                            friendly : '客户名称',
                            nonendit : 'nosend',
                            readonly : 'readonly',
                            sorting : false,
                            index : 5
                        },

                       /* {
                            col : 'bookCode',
                            format:bookHelperFormat,
                            friendly : '抄表本编号',
                            sorting:false,
                            index : 4
                        },
                        {
                            col : 'countperId',
                            format:userHelperFormat,
                            friendly : '核算员',
                            sorting:false,
                            index : 5
                        },
                        {
                            col : 'serviceperId',
                            format:userHelperFormat,
                            friendly : '抄表员',
                            sorting:false,
                            index : 6
                        },*/
                        {
                            col : 'money',
                            friendly : '收费金额',
                            sorting:false,
                            index : 6
                        },
                        {
                            col : 'chgTypeId',
                            friendly : '收费方式',
                            format:chgtypeFormat,
                            sorting:false,
                            index : 7
                        },
                        {
                            col: "isUse",
                            friendly: "是否已领发票",
                            format:function(){
                                return{
                                    f:function(val){
                                        if(val == "1"){
                                            return "已领"
                                        }else if(val=="0"){
                                            return "未领"
                                        }
                                    }
                                }
                            }(),
                            sorting: false,
                            index: 8
                        },
                        {
                            col: "useMoney",
                            friendly: "领用发票总额",
                            sorting: false,
                            index:9
                        },
                        {
                            col : 'useCount',
                            friendly : '领用发票张数',
                            sorting:false,
                            index : 10
                        },
                        {
                            col : 'gotoDetail',
                            friendly : '查看明细',
                            format:gotoDetail,
                            sorting:false,
                            index : 11
                        }


                    ],
                    // 查询过滤条件
                    findFilter : function(){
                        var sql= " 1=1 ";
                        if(!$('#find_areaId option:selected').val()){
                            bootbox.alert("<center><h4>请选择供气区域。</h4></center>")
                            return false;
                        }

                        if ($('#find_customerCode').val()) {
                            sql+=" and correct.customer_code like '%"+$('#find_customerCode').val()+"%'";
                        }
                        if ($('#find_customerName').val()) {
                            sql+=" and correct.customer_name like '%"+$('#find_customerName').val()+"%'";
                        }
                        if ($('#find_areaId option:selected').val()) {
                            sql+= " and correct.area_id = '"+$('#find_areaId option:selected').val()+"'"
                        }else{
                            sql+= " and correct.area_id in ("+loginarea.join()+") "
                        }
                        var bd = {"cols":"*",
                            "froms":"gas_chg_waste_detail correct",
                            "wheres":sql + " order by  correct.created_time desc ",
                            "page":"true",
                            "limit":50};

                        var areaids=[];
                        GasModSys.areaList({
                            "areaId":$('#find_areaId').val(),
                            "cb":function(data){
                                console.log(data)
                                $.each(data,function(key,val){
                                    areaids.push("'"+val.areaId+"'");
                                    console.log(areaids)
                                })
                            }
                        });
                        $("#three").html("");
                        $("#eighteen").html("");
                        $("#threesix").html("");

                        var ss = {
                            "cols":"b.money,count(b.money) counts ",
                            "froms":"gas_chg_waste_detail a inner join gas_chg_waste_invoice_detail b on a.detail_id = b.detail_id",
                            "wheres":"a.area_id in ("+areaids.join()+") group by b.money",
                            "page":false
                        }
                        $.ajax({
                            type: 'get',
                            url: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd="+encodeURIComponent(JSON.stringify(ss)),
                            dataType: 'json',
                            contentType: "application/json; charset=utf-8",
                            async: false,
                            success: function(data) {
                                $("#tables tbody tr").html("")
                               console.log(data.rows)
                                if(data.rows){

                                    $("#tables tbody tr").append('<td class="td" style="text-align:left;"><label class="label-td" style="text-align: center;font-weight: 600;">供气区域 :</label><span style="text-align:left;">'+areaHelper.getDisplay($("#find_areaId").val())+'</span></td>')
                                    $.each(data.rows,function(ind,item){
                                        $("#tables tbody tr").append('<td class="td" style="text-align:left; "><label class="label-td" style="text-align: center;font-weight: 600;">'+item.money+'元面额 :</label><span style="text-align:left;">'+item.counts+'张</span></td>')
                                    })
                                }else{
                                    $("#tables tbody tr").append('<td class="td" style="text-align:left;"><label class="label-td" style="text-align: center;font-weight: 600;">供气区域 :</label><span style="text-align:left;">'+areaHelper.getDisplay($("#find_areaId").val())+'</span></td>')
                                }
                            },
                            error: function(err) {
                                // alert("find all err");
                            }
                        });

                        xw.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd="+encodeURIComponent(JSON.stringify(bd)));
                        return null;
                    }
                }); // --init

        }

    }
}();

$(document).on("click",".information",function(){
    var row = JSON.parse($(this).attr("data-row"));
    // $("#changemtcustomerNams").val(row.customerName)
    // $("#changemtcustomerCods").val(row.customerCode)
    $("#divtablechange").html("")
    XWATable.init(
        {
            divname : "divtablechange",
            //----------------table的选项-------
            pageSize : 10,
            // pageSize : 200,
            columnPicker : true,
            transition : 'fade',
            checkAllToggle:true,
            restbase:'gaschgwasteinvoicedetail/?query={"detailId":"'+row.detailId+'"}',
            // restURL : "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd="+encodeURIComponent(JSON.stringify(bd)),
            coldefs:[

                {
                    col : 'customerCode',
                    friendly : '客户编号',
                    sorting:false,
                    index : 1
                },
                {
                    col : 'customerName',
                    friendly : '客户名称',
                    sorting:false,
                    index : 2
                },
                {
                    col : 'money',
                    friendly : '发票面额',
                    sorting:false,
                    index : 3
                },
                {
                    col : 'createdBy',
                    format:userHelperFormat,
                    friendly : '操作人',
                    sorting:false,
                    index : 5
                },
            ]
        })

    $("#changemtstepinst").modal("show");
})


