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

var ChargeCorrectAction= function () {
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
                return "<a href='charging/charge_correct_detail.html?"+row["correctFlowId"]+"?"+row["countperId"]+"?"+row["serviceperId"]+"?"+row["bookId"]+"\'>" + "&nbsp详情"+ "</a><br>"+
                    "<a  href='javascript:void(0)' id = 'recall'   onclick='ChargeCorrectAction.recall(\""+row["status"]+"\",\""+row["correctFlowId"]+"\")' data-toggle='modal'>&nbsp;撤回</a>";

            }
        }
    }();
    //审核状态
    var examineState= function () {
        return {
            f: function (val) {
                if(val==="0") return "<font color=''>审核中</font>";
                else if(val==="1") return "<font color=''>审核通过</font>";
                else if(val==="2") return "<font color=''>审核未通过</font>";

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


            // $.each(GasModSys.areaHelper.getRawData(), function (idx, row) {
            //     $('#find_areaId').append('<option value="' + row.areaId + '" name="' + row.areaId + '">' + row.areaName + '</option>');
            // });

            $('#find_areaId').on('change',function(e){
                console.log("change area:"+e+"."+$('#find_areaId').val());
                GasModSys.counterUsersInArea({
                    "areaId":$('#find_areaId').val(),
                    "cb":function(data){
                        var inhtml = "<option value=''>全部</option>";
                        $.each(data,function(idx,row){
                            inhtml += '<option value="'+row.userId+'">'+row.employeeName+'</option>';
                        })
                        $("#find_countperId").html(inhtml);
                        $("#find_countperId").val("").change();

                    }
                })
                xw.autoResetSearch();
            })

            $('#find_countperId').on('change',function(e){
                console.log("change counter:"+e+"."+$('#find_countperId').val());
                GasModSys.copyUsersInArea({
                    "areaId":$('#find_areaId').val(),
                    "countperId":$('#find_countperId').val(),
                    "cb":function(data){
                        var inhtml = "<option value=''>全部</option>";
                        if(data){
                            $.each(data,function(idx,row){
                                inhtml += '<option value="'+row.userId+'">'+row.employeeName+'</option>';
                            })
                        }
                        $("#find_serviceperId").html(inhtml);
                        $("#find_serviceperId").val("").change();

                    }
                })
                xw.autoResetSearch();
            })
            $('#find_serviceperId').on('change',function(e){
                xw.autoResetSearch();
            });

        },


        reload : function(){
            var login_user = localStorage.getItem("user_info");
            console.log(login_user.userId);
            var loginuser_area_id = '1';
            $('#divtable').html('');
            var cols = "*";
            var bd = {"cols":cols,
                "froms":"gas_chg_error a left join gas_ctm_archive b on " +
                "b.customer_code= a.customer_code left join gas_mrd_book c on " +
                "c.book_id = b.book_id",
                "wheres":" a.error_type='2' and b.area_id in ("+loginarea.join()+") order by  a.opt_date desc,a.apply_date desc ",
                // "wheres":" a.error_type='2' and a.opt_result = '1' and b.area_id in ("+loginarea.join()+") order by  a.opt_date desc,a.apply_date desc ",
                "page":true,
                "limit":50};
            /* rf= RFTable.init(*/
            var gaschgtypeHelper = RefHelper.create({
                ref_url: "gaschgtype",
                ref_col: "chgTypeId",
                ref_display: "chargeTypeName"
            })
            var chargeTypeNameFormat = function () {
                return {
                    f: function (val) {
                        return gaschgtypeHelper.getDisplay(val)
                    },
                }
            }();
            var detailedInfoFormat1 = function () {
                return {
                    f:function(val,row){
                        return "<a class='process' data-id='"+row.wfId+"' data-row='"+JSON.stringify(row)+"'>查看</a>"
                    }
                }
            }()
            $('#divtable').html('');
            // xw=XWATable.init(
            xw = XWATable.init(
                {
                    divname : "divtable",
                    //----------------table的选项-------
                    pageSize : 10,
                    findbtn:"find_button",
                    // pageSize : 200,
                    columnPicker : true,
                    transition : 'fade',
                    checkAllToggle:true,
                    restURL : "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd="+encodeURIComponent(JSON.stringify(bd)),
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
                            sorting : false,
                            index : 2
                        },
                        {
                            col : 'areaId',
                            format:areaHelperFormat,
                            friendly : '供气区域',
                            sorting:false,
                            index : 3
                        },
                        {
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
                        },
                        {
                            col : 'chgType',
                            format:function(){
                                return{
                                    f:function(val){
                                        if(val=="1"){
                                            return "燃气费"
                                        }else if (val=="2"){
                                            return "垃圾费"
                                        }
                                    }
                                }
                            }(),
                            friendly : '收费类型',
                            sorting:false,
                            index : 7
                        },
                        {
                            col: "beforeChange",
                            friendly: "原收费金额",
                            format:chargeTypeNameFormat,
                            sorting: false,
                            index: 8
                        },
                        {
                            col: "afterChange",
                            friendly: "现收费金额",
                            format:chargeTypeNameFormat,
                            sorting: false,
                            index:9
                        },

                        {
                            col : 'optResult',
                            format:examineState,
                            friendly : '审批状态',
                            sorting:false,
                            index : 10
                        },
                        {
                            col : 'applyDate',
                            format:dateFormat,
                            friendly : '申请时间',
                            sorting:false,
                            index : 11
                        },
                        {
                            col : 'optDate',
                            format:dateFormat,
                            friendly : '完成时间',
                            sorting:false,
                            index : 12
                        },
                        {
                            col : 'remark',
                            friendly : '业务说明',
                            sorting:false,
                            index : 13
                        },
                        {
                            col : 'remarks',
                            friendly : '查看流程',
                            format:detailedInfoFormat1,
                            sorting:false,
                            index : 14
                        },

                    ],
                    // 查询过滤条件
                    findFilter : function(){
                        var sql= " 1=1 ";

                        if ($('#find_customerCode').val()) {
                            sql+=" and a.customer_code like '%"+$('#find_customerCode').val()+"%'";
                        }
                        if ($('#find_customerName').val()) {
                            sql+=" and b.customer_name like '%"+$('#find_customerName').val()+"%'";
                        }
                         if ($('#find_chgType').val()) {
                            sql+=" and a.chg_type = '"+$('#find_chgType').val()+"'";
                        }
                        if ($('#find_areaId option:selected').val()) {
                            sql+= " and b.area_id = '"+$('#find_areaId option:selected').val()+"'"
                        }else{
                            sql+= " and b.area_id in ("+loginarea.join()+") "
                        }
                        if ($("#find_countperId").val()) {
                            sql+= " and c.countper_id = '"+$("#find_countperId").val()+"'"
                        }
                        if ($("#find_serviceperId").val()) {
                            sql+= " and c.serviceper_id = '"+$("#find_serviceperId").val()+"'"
                        }
                        if ($("#find_optResult").val()) {
                            sql+= " and a.opt_result = '"+$("#find_optResult").val()+"'"
                        }
                        if ($("#find_customerKind").val()) {
                            sql+= " and b.customer_kind = '"+$("#find_customerKind").val()+"'"
                        }

                        if ($("#find_start_date1").val() && $("#find_end_date1").val()) {
                            sql += " and to_char(a.apply_date,'yyyy-mm-dd')  between '" + $('#find_start_date1').val() + "' and '" + $("#find_end_date1").val() + "'";
                        } else if ($("#find_start_date1").val() && !$("#find_end_date1").val()) {
                            bootbox.alert("请输入截止日期")
                        } else if (!$("#find_start_date1").val() && $("#find_end_date1").val()) {
                            bootbox.alert("请输入起始日期")
                        }

                        if ($("#find_start_date").val() && $("#find_end_date").val()) {
                            sql += " and to_char(a.opt_date,'yyyy-mm-dd')  between '" + $('#find_start_date').val() + "' and '" + $("#find_end_date").val() + "'";
                        } else if ($("#find_start_date").val() && !$("#find_end_date").val()) {
                            bootbox.alert("请输入截止日期")
                        } else if (!$("#find_start_date").val() && $("#find_end_date").val()) {
                            bootbox.alert("请输入起始日期")
                        }

                        if ($("#book_code").val()) {
                            sql+= " and c.book_code like '%"+$("#book_code").val()+"%'"
                        }
                        bd = {"cols":cols,
                            "froms":"gas_chg_error a left join gas_ctm_archive b on " +
                            "b.customer_code= a.customer_code left join gas_mrd_book c on " +
                            "c.book_id = b.book_id",
                            "wheres": sql + " and a.error_type='2' order by  a.opt_date desc,a.apply_date desc",
                            // "wheres": sql + " and a.error_type='2' and a.opt_result = '1' order by  a.opt_date desc,a.apply_date desc",
                            "page":true,
                            "limit":50};

                        xw.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd="+encodeURIComponent(JSON.stringify(bd)));
                        return null;
                    }
                }); // --init

        }

    }
}();


$(document).on("click",".process",function(){
    var stepId = $(this).attr("data-id");
    console.log(stepId);
    var row = JSON.parse($(this).attr("data-row"));
    console.log(row);
    var restust = Restful.findNQ(hzq_rest + 'psmstepinst/?query={"flowInstId":"'+stepId+'"}');
    console.log(restust)

    if(restust.length){
        $("#customerNams").val(row.customerName)
        $("#customerCods").val(row.customerCode)
        $("#stepinst").modal("show");
        $("#divtableS").html("");
        var dbs={
            "cols":"case gs_ecode when 'START' then 1 when 'PTWO' then 2 when 'PTHREE' then 3 when 'PFOUR' then 4 " +
            "when 'PFIVE' then 5 when 'PSIX' then 6 when 'PSEVEN' then 7 when 'PEIGHT' then 8 when 'PNINE' then 9 when 'PTEN' then 10 " +
            "when 'PELEVEN' then 11 end as gs_ecode ,step_inst_id,gs_chcode,step_status,results,submit_time,operator,modify_time,propstr256",
            "froms":"psm_step_inst",
            "wheres":"gs_ecode <> 'END' and flow_inst_id = '"+stepId+"' order by nvl(gs_ecode,12) asc",
            "page":false
        }
        var stepStatus = {"1":"节点等待获取","2":"节点已获取","3":"节点挂起","4":"节点停止","5":"节点结束","6":"节点异常","7":"节点已提交","8":"完成","9":"无效"}
        var stepStatusFormat = function () {
            return{
                f:function(val){
                    return stepStatus[val]
                }
            }
        }()
        var resultFormat = function () {
            return{
                f:function(val){
                    if(val == "0"){
                        return "通过"
                    }else if(val == "1"){
                        return "拒绝"
                    }
                }
            }
        }()
        var userHelper = RefHelper.create({
            ref_url: "gassysuser",
            ref_col: "userId",
            ref_display: "employeeName",
        });
        var userFormat=function () {
            return{
                f:function(val){
                    console.log(val)/*12485*/
                    if(val=="AUTO"){
                        return "";
                    }else{
                        return userHelper.getDisplay(val);
                    }

                }
            }
        }();
        var postformat=function(){
            return{
                f:function(val){
                    var str = val.replace(/\//g, '');
                    console.log(str)
                    var valarr = str.split("<br>")[str.split("<br>").length-2];
                    console.log(valarr)
                    return valarr
                }
            }
        }();
        xwss = XWATable.init(
            {
                divname: "divtableS",
                //----------------table的选项-------
                pageSize: 15, 			//Initial pagesize
                columnPicker: true,         //Show the columnPicker button
                sorting: true,
                transition: 'fade',  //(bounce, fade, flip, rotate, scroll, slide).
                checkboxes: false,           //Make rows checkable. (Note. You need a column with the 'unique' property)
                checkAllToggle: false,        //Show the check-all toggle//+RQLBuilder.like("KEYY", "a").rql()
                //----------------基本restful地址---
                restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(dbs)),
                // restbase: 'gascsrbusiregister/?query={"areaId":"'+userinfo.area_id+'"}&sort=-acceptDate',
                key_column: 'stepInstId',
                //---------------行定义
                coldefs: [
                    {
                        col: "gsChcode",
                        friendly: "节点所属角色",
                        sorting: false,
                        // format:,
                        index: 1
                    },
                    {
                        col: "gsEcode",
                        friendly: "步骤",
                        sorting: false,
                        // format:,
                        index: 2
                    },
                    {
                        col: "stepStatus",
                        friendly: "状态",
                        sorting: false,
                        format:stepStatusFormat,
                        index: 3
                    },
                    {
                        col: "operator",
                        friendly: "审批人",
                        sorting: false,
                        format:userFormat,
                        index: 4
                    },
                    {
                        col:"modifyTime",
                        friendly: "审批时间",
                        sorting: false,
                        // format:stepStatusFormat,
                        index: 5
                    },
                    {
                        col: "results",
                        friendly: "流程结果",
                        format:resultFormat,
                        sorting: false,
                        index: 6
                    },
                    {
                        col: "propstr256",
                        friendly: "审批意见",
                        format:postformat,
                        sorting: false,
                        index: 7
                    },

                ]
            }
        );
    }else{
        bootbox.alert("<center><h4>该业务没有流程。</h4></center>")
    }

})





