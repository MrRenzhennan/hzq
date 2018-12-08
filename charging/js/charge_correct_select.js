/**
 * Created by anne on 2017/6/3.
 */


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
    var bookHelper=RefHelper.create({
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
                if(val==="1") return "<font color='blue'>审核中</font>";
                else if(val==="2") return "<font color='fuchsia'>审核通过</font>";
                else if(val==="3") return "<font color='green'>审核未通过</font>";
                else if(val==="4") return "<font color='#ff1493'>待审批</font>";
                else if(val==="5") return "<font color='black'>已撤销</font>";
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
            var data={"表具损坏":"表具损坏","重新开栓":"重新开栓","换表下线":"换表下线","抄串户":"抄串户","预估气量过高":"预估气量过高","操作错误":"操作错误","价格变更":"价格变更","其他":"其他"}
            $.map(data, function (key, val) {
                $('#correct_reason').append('<option  value="' + val + '">' + key + '</option>');
            });

            // 供气区域 select init
            $.map(GasModSys.areaHelper.getData(), function(value, key) {
                $('#find_areaId').append('<option value="'+key+'">'+value+'</option>');
            });

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

            // $('#find_today_sign').on('click',function(e){setStartEnd(0,'d')})
            // $('#find_this_week_sign').on('click',function(e){setStartEnd(-7,'d')})
            // $('#find_this_month_sign').on('click',function(e){setStartEnd(-1,'M')})
            // $('#find_three_month_sign').on('click',function(e){setStartEnd(-3,'M')})
            // $('#find_this_year_sign').on('click',function(e){setStartEnd(-1,'y')})
            // $('#find_anyway_sign').on('click',function(e){
            //     $('#createtimeto').val("");$('#createtimefrom').val("");
            // })
            // $('ul.copystate').on('click',function(e){
            //     console.log("change!:"+$('ul.copystate > li.active').attr('cp')+",,to >>"+$(e.target).parent().attr('cp'))
            //     setTimeout(function(e){
            //
            //
            //         xw.autoResetSearch();
            //     },100)
            // })
        },



        reload : function(){
            var login_user = localStorage.getItem("user_info");
            console.log(login_user.userId);
            var loginuser_area_id = '1';
            $('#divtable').html('');
            var cols = "correct.ctm_archive_id,correct.correct_flow_id,correct.created_time,correct.area_id,correct.correct_reason," +
                       "correct.correct_gas,correct.correct_mon,correct.status,archive.customer_code," +
                       "archive.customer_name,archive.book_id,book.serviceper_id,book.countper_id";
            var bd = {"cols":cols,
                       "froms":"gas_bll_correct_flow correct left join gas_ctm_archive archive on " +
                               "correct.ctm_archive_id = archive.ctm_archive_id left join gas_mrd_book book on " +
                               "archive.book_id = book.book_id order by  correct.created_time desc ",
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
                    restURL : "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd="+encodeURIComponent(JSON.stringify(bd)),
                    coldefs:[
                        {
                            col : 'correctFlowId',
                            friendly : '计费更正Id',
                            hidden:true,
                            unique:"true",
                            readonly:"readonly",
                            nonedit:"nosend",
                            index:1

                        },
                        {
                            col : 'customerCode',
                            friendly : '客户编号',
                            sorting:false,
                            index : 2
                        },
                        {
                            col : 'customerName',
                            friendly : '客户名称',
                            nonendit : 'nosend',
                            readonly : 'readonly',
                            sorting : false,
                            index : 3
                        },
                        {
                            col : 'areaId',
                            format:areaHelperFormat,
                            friendly : '供气区域',
                            sorting:false,
                            index : 4
                        },
                        {
                            col : 'bookId',
                            format:bookHelperFormat,
                            friendly : '抄表本编号',
                            sorting:false,
                            index : 5
                        },
                        {
                            col : 'countperId',
                            format:userHelperFormat,
                            friendly : '核算员',
                            sorting:false,
                            index : 6
                        },
                        {
                            col : 'serviceperId',
                            format:userHelperFormat,
                            friendly : '抄表员',
                            sorting:false,
                            index : 7
                        },
                        {
                            col : 'correctReason',
                            friendly : '更正原因',
                            sorting:false,
                            index : 8
                        },
                        {
                            col : 'status',
                            format:examineState,
                            friendly : '审批状态',
                            sorting:false,
                            index : 9
                        },
                        {
                            col : 'createdTime',
                            format:dateFormat,
                            friendly : '申请时间',
                            sorting:false,
                            index : 10
                        },
                        {
                            col : 'modifiedTime',
                            format:gotoDetail,
                            friendly : '操作',
                            sorting:false,
                            index : 11
                        }

                    ],
                    // 查询过滤条件
                    findFilter : function(){
                        var sql= " 1=1 ";
                        // if ($('#find_customerName').val()) {
                        //     sql+=" and archive.customerName like '"+$('#find_customerName').val()+"%'";
                        // }
                        if ($('#find_customerCode').val()) {
                            sql+=" and archive.customerCode like '"+$('#find_customerCode').val()+"%'";
                        }
                        if ($('#find_areaId option:selected').val()) {
                            sql+= " and correct.area_id like '"+$('#find_areaId option:selected').val()+"%'"
                        }
                        if ($("#find_countperId").val()) {
                            sql+= " and book.countper_id like '"+$("#find_countperId").val()+"%'"
                        }
                        if ($("#find_serviceperId").val()) {
                            sql+= " and book.serviceper_id like '"+$("#find_serviceperId").val()+"%'"
                        }
                        if ($("#correct_reason").val()) {
                            sql+= " and correct.correct_reason like '"+$("#correct_reason").val()+"%'"
                        }
                        if ($("#status").val()) {
                            sql+= " and correct.status ='"+$("#status").val()+"'"
                        }

                        if ($("#book_code").val()) {
                            var queryCondion = RQLBuilder.and([
                                RQLBuilder.equal("bookCode",$("#book_code").val()),
                            ]).rql();
                            var queryUrl =  hzq_rest + 'gasmrdbook?fields={"bookId":"1"}&query='+ queryCondion;
                            console.log(Restful.findNQ(queryUrl)[0]);
                            sql+= " and book.book_id like '"+Restful.findNQ(queryUrl)[0].bookId+"%'"
                        }
                        var bd={
                            "cols":cols,
                            "froms":"gas_bll_correct_flow correct left join gas_ctm_archive archive on " +
                            "correct.ctm_archive_id = archive.ctm_archive_id left join gas_mrd_book book on " +
                            "archive.book_id = book.book_id",
                            "wheres":sql,
                            "page":true
                        };

                        xw.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd="+encodeURIComponent(JSON.stringify(bd)));
                        return null;
                    }
                }); // --init

        },


        recall: function (status,correctFlowId){
        bootbox.confirm("确定撤销吗?", function (result) {
                if (result == false) {
                } else {
                    if(status == '4'){
                        bootbox.alert("撤回成功");
                        var up = Restful.update(hzq_rest+"gasbllcorrectflow", correctFlowId, {
                            "status":"5"
                        })
                        var up1 = Restful.update(hzq_rest+"psmflowinst", correctFlowId, {
                            "flowStatus":"9"
                        })
                        var up2= Restful.update(hzq_rest+"psmstepinst", correctFlowId, {
                            "stepStatus":"9"
                        })
                        window.location = "charging/charge_correct_select.html";

                    }else if(status == '5'){
                        bootbox.alert("已撤销不能在撤销");
                    }else{
                        bootbox.alert("流程已审批撤回失败");
                    }
                }
            });
        }
    }
}();




