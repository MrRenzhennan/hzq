/**
 * Created by anne on 2017/12/25.
 * 年计划任务生成
 */
var loginarea = [];
var areaId = JSON.parse(localStorage.getItem("user_info")).area_id
GasModSys.areaList({
    "areaId":areaId,
    "cb":function(data){
        console.log(data)
        $.each(data,function(key,val){
            loginarea.push("'"+val.areaId+"'");
            $('#find_areaId').append('<option value="' + val.areaId + '">' + val.areaName + '</option>');
        })
    }
});

var MrdYearPlanSearchAction= function () {
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
//  var examineState= function () {
//      return {
//          f: function (val) {
//              if(val==="1") return "<font color=''>审核中</font>";
//              else if(val==="2") return "<font color=''>审核通过</font>";
//              else if(val==="3") return "<font color=''>审核未通过</font>";
//              else if(val==="4") return "<font color=''>待审批</font>";
//              else if(val==="5") return "<font color=''>已撤销</font>";
//              else return "error";
//          }
//      }
//  }()
var mrdTaskStateFormat = function(){
		return {
			f:function(val){
				if(val =='1'){
					return "未开始";
				}else if(val == '2'){
					return "进行中";
				}else if(val == '3'){
					return "已完成";
				}
			}
		}
}();

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


            $.each(GasModSys.areaHelper.getRawData(), function (idx, row) {

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

        },


        reload : function(){
            var login_user = localStorage.getItem("user_info");
            console.log(login_user.userId);
            var loginuser_area_id = '1';
            $('#divtable').html('');
//          var cols = "correct.ctm_archive_id,correct.correct_flow_id,correct.created_time,correct.area_id,correct.correct_reason," +
//              "correct.correct_gas,correct.correct_mon,correct.status,archive.customer_code," +
//              "archive.customer_name,archive.book_id,book.serviceper_id,book.book_code,book.countper_id";
//          var bd = {"cols":cols,
//              "froms":"gas_bll_correct_flow correct left join gas_ctm_archive archive on " +
//              "correct.ctm_archive_id = archive.ctm_archive_id left join gas_mrd_book book on " +
//              "archive.book_id = book.book_id",
//              "wheres":" correct.status='2' and archive.area_id in ("+loginarea.join()+") order by  correct.created_time desc ",
//              "page":"true",
//              "limit":50};


var bd={
	"cols":"t.book_id,br.book_code,br.countper_id,br.area_id,br.serviceper_id,t.created_num,t.mrd_task_status,t.created_time,t.plan_year,t.defeated_num",
	"froms":"gas_mrd_book b left join gas_mrd_plan_job t on t.book_id=b.book_id ",
	"wheres":"1=0  ",//and  b.status='1' and t.status='1'
	"page":"false"
}
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
                            col: "correctGas",
                            friendly: "更正气量",
                            sorting: true,
                            index: 7
                        },
                        {
                            col: "correctMon",
                            friendly: "更正金额",
                            sorting: true,
                            index:8
                        },
                        {
                            col : 'correctReason',
                            friendly : '更正原因',
                            sorting:false,
                            index : 9
                        },
                        {
                            col : 'status',
                            format:examineState,
                            friendly : '审批状态',
                            sorting:false,
                            index : 10
                        },
                        {
                            col : 'createdTime',
                            format:dateFormat,
                            friendly : '申请时间',
                            sorting:false,
                            index : 11
                        }

                    ],
                    // 查询过滤条件
                    findFilter : function(){
                        var sql= " 1=1 ";

//                      if ($('#find_customerCode').val()) {
//                          sql+=" and archive.customer_code like '%"+$('#find_customerCode').val()+"%'";
//                      }
//                      if ($('#find_customerName').val()) {
//                          sql+=" and archive.customer_name like '%"+$('#find_customerName').val()+"%'";
//                      }
//                      if ($('#find_areaId option:selected').val()) {
//                          sql+= " and correct.area_id = '"+$('#find_areaId option:selected').val()+"'"
//                      }else{
//                          sql+= " and archive.area_id in ("+loginarea.join()+") "
//                      }
//                      if ($("#find_currect").val() && $("#find_currect").val() == "2") {
//                          sql+= " and correct.correct_type = '"+$("#find_currect").val()+"'"
//                      }else if($("#find_currect").val() && $("#find_currect").val() == "1"){
//                          sql+= " and correct.correct_type ='1'"
//                      }
//
//                      if ($("#find_countperId").val()) {
//                          sql+= " and book.countper_id = '"+$("#find_countperId").val()+"'"
//                      }
//                      if ($("#find_customerKind").val()) {
//                          sql+= " and archive.customer_kind = '"+$("#find_customerKind").val()+"'"
//                      }
//                      if ($("#find_serviceperId").val()) {
//                          sql+= " and book.serviceper_id = '"+$("#find_serviceperId").val()+"'"
//                      }
//                      if ($("#correct_reason").val()) {
//                          sql+= " and correct.correct_reason like '%"+$("#correct_reason").val()+"%'"
//                      }
//                      if ($("#status").val()) {
//                          sql+= " and correct.status ='"+$("#status").val()+"'"
//                      }
//
//
//                      if ($("#find_start_date1").val() && $("#find_end_date1").val()) {
//                          sql += " and to_char(correct.created_time,'yyyy-mm-dd')  between '" + $('#find_start_date1').val() + "' and '" + $("#find_end_date1").val() + "'";
//                      } else if ($("#find_start_date1").val() && !$("#find_end_date1").val()) {
//                          bootbox.alert("请输入截止日期")
//                      } else if (!$("#find_start_date1").val() && $("#find_end_date1").val()) {
//                          bootbox.alert("请输入起始日期")
//                      }
//
//                      if ($("#book_code").val()) {
//                          var queryCondion = RQLBuilder.and([
//                              RQLBuilder.equal("bookCode",$("#book_code").val()),
//                          ]).rql();
//                          var queryUrl =  hzq_rest + 'gasmrdbook?fields={"bookId":"1"}&query='+ queryCondion;
//                          console.log(Restful.findNQ(queryUrl)[0]);
//                          sql+= " and book.book_id like '"+Restful.findNQ(queryUrl)[0].bookId+"%'"
//                      }
//                      var bd={
//                          "cols":cols,
//                          "froms":"gas_bll_correct_flow correct left join gas_ctm_archive archive on " +
//                          "correct.ctm_archive_id = archive.ctm_archive_id left join gas_mrd_book book on " +
//                          "archive.book_id = book.book_id",
//                          "wheres":sql + "and  correct.status='2' order by  correct.created_time desc ",
//                          "page":true
//                      };
var whereinfo ='';
if($('#find_areaId').val()){//供气区域额
	whereinfo +=" and br.area_id='"+$('#find_areaId').val()+"' " ;
}
if($('#find_countperId').val()){//核算员
	whereinfo +=" and br.countper_id='"+$('#find_countperId').val()+"' ";
}
if($('#find_serviceperId').val()){//客户服务员
	whereinfo +=" and br.serviceper_id='"+$('#find_serviceperId').val()+"' ";
}
if($('#find_bookCode').val()){//抄表本编号
	whereinfo +=" and br.book_code='"+$('#find_bookCode').val()+"' ";
}
if($('#find_mrdTaskStatus').val()){//年计划任务状态
	whereinfo +=" and t.mrd_task_status='"+$('#find_mrdTaskStatus').val()+"' ";
}
if($('#find_planYear').val()){//年计划计划年份
	whereinfo +=" and t.plan_year ='"+$('#find_planYear').val()+"' ";
}
//if($('#find_createdTime').val()){//年计划任务生成创建时间
//	whereinfo +='';
//}
whereinfo +=" and br.area_id ='"+$('#find_areaId').val()+"' ";
var bd={
	"cols":"t.book_id,br.book_code,br.countper_id,br.area_id,br.serviceper_id,t.created_num,t.mrd_task_status,t.created_time,t.plan_year,t.defeated_num",
	"froms":"gas_mrd_book b left join gas_mrd_plan_job t on t.book_id=b.book_id ",
	"wheres":" b.status='1' and t.status='1'  "+whereinfo,//and 
	"page":"false"
}

                        xw.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd="+encodeURIComponent(JSON.stringify(bd)));
                        return null;
                    }
                }); // --init

        }

    }
}();





