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
                    var data= val.split("T");
                    return data.join(" ");
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
                if(val==="1") return "<font color=''>审核中</font>";
                else if(val==="2") return "<font color=''>审核通过</font>";
                else if(val==="3") return "<font color=''>审核未通过</font>";
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
            // 供气区域 select init
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

            $("#divtable").html("");
            var useStateFormat = function () {
                return {
                    f: function (val) {
                        if (val == "0") {
                            return "未使用";
                        } else if (val == "1") {
                            return "已使用";
                        }
                    }
                }
            }();

            var applyReasonFormat = function () {
                return {
                    f: function (val) {
                        if (val == "1") {
                            return "丢失";
                        } else if (val == "2") {
                            return "损坏";
                        } else if (val == "3") {
                            return "其他";
                        }
                    }
                }
            }();
            var applyStatetFormat = function () {
                return {
                    f: function (val) {
                        if (val == "1") {
                            return "审批中"
                        } else if (val == "2") {
                            return "审批通过"
                        } else if (val == "3") { }
                        return "审批未通过"
                    }
                }
            }();

           /* var reamrkFormat=function(){
                return{
                    f:function(val,row){
                        return "<a href='javascript:;' data-row='"+JSON.stringify(row)+"' data-id='"+row.wfId+"'  class='stepflow' >查看</a>";
                    }
                }
            }()*/
            var bd ={
                "cols":"*",
                "froms":"gas_chg_iccard_complement a left join gas_ctm_archive b on b.ctm_archive_id=a.ctm_archive_id left join gas_mrd_book c on c.book_id=b.book_id ",
                "wheres":"a.apply_state = '2' and b.area_id in ("+loginarea.join()+") order by a.apply_time desc,a.approve_time desc",
                "page":true,
                "limit":50
            }
            xw=XWATable.init({
                divname: "divtable",
                //----------------table的选项-------
                pageSize: 10,
                columnPicker: true,
                transition: 'fade',
                tableId:"divtable",
                checkAllToggle: true,
                //----------------基本restful地址---/?query={"customerCode":"' + customerCode + '"}&sort=-applyTime
                // restbase: 'gaschgiccardcomplement',
                restURL : "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd="+encodeURIComponent(JSON.stringify(bd)),
                key_column: 'complementId',
                coldefs: [
                    {
                        col : 'customerCode',
                        friendly : '客户编号',
                        sorting:false,
                        index : 1
                    },
                    {
                        col : 'customerName',
                        friendly : '客户名称',
                        nonendit : 'nosend',
                        readonly : 'readonly',
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
                        col: "applyGas",
                        friendly: "申请气量",
                        sorting: false,
                        index: 7
                    },
                    {
                        col: "approveGas",
                        friendly: "标准气量",
                        sorting: false,
                        index: 8
                    },
                    {
                        col: "applyReason",
                        friendly: "申请原因",
                        format: applyReasonFormat,
                        sorting: false,
                        index: 9
                    },
                    {
                        col: "applyTime",
                        friendly: "申请时间",
                        format:dateFormat,
                        sorting: true,
                        index: 10
                    },
                    {
                        col: "approveTime",
                        friendly: "批准时间",
                        format:dateFormat,
                        sorting: true,
                        index: 11
                    },
                    /*{
                        col: "useTime",
                        friendly: "使用时间",
                        format:dateFormat,
                        sorting: true,
                        index: 12
                    },*/
                    {
                        col: "applyState",
                        friendly: "申请状态",
                        format: applyStatetFormat,
                        sorting: false,
                        index: 13
                    },
                    {
                        col: "useState",
                        friendly: "使用状态",
                        format: useStateFormat,
                        sorting: false,
                        index: 14
                    },
                    {
                        col: "remark",
                        friendly: "备注",
                        sorting: false,
                        index: 15
                    }/*,
                    {
                        col: "remarks",
                        friendly: "查看流程",
                        format:reamrkFormat,
                        sorting: false,
                        index: 16
                    }*/

                ],
                // 查询过滤条件
                findFilter : function(){
                    var sql= " 1=1 ";

                    if ($('#find_customerName').val()) {
                        sql+=" and a.customer_name like '%"+$('#find_customerName').val()+"%'";
                    }
                    if ($('#find_customerCode').val()) {
                        sql+=" and a.customer_code like '%"+$('#find_customerCode').val()+"%'";
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
                    if ($("#book_code").val()) {
                        sql+= " and c.book_code ='"+$("#book_code").val()+"'"
                    }
                    if ($("#find_customerKind").val()) {
                        sql+= " and b.customer_kind = '"+$("#find_customerKind").val()+"'"
                    }

                    if ($("#find_start_date").val() && $("#find_end_date").val()) {
                        sql += " and to_char(a.apply_time,'yyyy-mm-dd')  between '" + $('#find_start_date').val() + "' and '" + $("#find_end_date").val() + "'";
                    } else if ($("#find_start_date").val() && !$("#find_end_date").val()) {
                        bootbox.alert("请输入截止日期")
                    } else if (!$("#find_start_date").val() && $("#find_end_date").val()) {
                        bootbox.alert("请输入起始日期")
                    }

                    if ($("#find_start_date1").val() && $("#find_end_date1").val()) {
                        sql += " and to_char(a.approve_time,'yyyy-mm-dd')  between '" + $('#find_start_date1').val() + "' and '" + $("#find_end_date1").val() + "'";
                    } else if ($("#find_start_date1").val() && !$("#find_end_date1").val()) {
                        bootbox.alert("请输入截止日期")
                    } else if (!$("#find_start_date1").val() && $("#find_end_date1").val()) {
                        bootbox.alert("请输入起始日期")
                    }

                    bd ={
                        "cols":"*",
                        "froms":"gas_chg_iccard_complement a left join gas_ctm_archive b on b.ctm_archive_id=a.ctm_archive_id left join gas_mrd_book c on c.book_id=b.book_id ",
                        "wheres":sql + " and a.apply_state = '2'  order by a.apply_time desc,a.approve_time desc",
                        "page":true,
                        "limit":50
                    }

                    xw.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd="+encodeURIComponent(JSON.stringify(bd)));
                    return null;
                }

            })

        }

    }
}();
    /*
$(document).on("click",".stepflow",function(){
    var stepId = $(this).attr("data-id");
    console.log(stepId);
    var row = JSON.parse($(this).attr("data-row"));
    console.log(row);
    var restust = Restful.findNQ(hzq_rest + 'psmstepinst/?query={"flowInstId":"'+stepId+'"}');
    console.log(restust)



        var businessTypeHelper = RefHelper.create({
            ref_url: 'gascsrbusinesstype/?query={"validState":"1"}',
            ref_col: "businessTypeId",
            ref_display: "name",
        });

        $("#customerNams").val(row.customerName)
        $("#customerCods").val(row.customerCode)
        // $("#businessTypeId").val(businessTypeHelper.getDisplay(row.businessTypeId))
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
                f:function(val,row){
                    console.log(row)/!*12485*!/
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
                    var valarr = val.split("<br>")[val.split("<br>").length-1];
                    console.log(typeof valarr[valarr.length-1])
                    return valarr
                }
            }
        }()
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

                ],
                findFilter : function(){

                }
            }
        );


})

*/


