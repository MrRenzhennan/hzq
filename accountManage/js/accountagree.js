/**
 * Created by anne on 2017/6/11.
 */
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
                return "<a href='accountManage/agreeGas_detail.html?"+row["actAgreegasFlowId"]+"\'>" + "&nbsp详情"+ "</a><br>"+
                    "<a  href='javascript:void(0)' id = 'recall'   onclick='accountAgreeAction.recall(\""+row["status"]+"\",\""+row["actAgreegasFlowId"]+"\")' data-toggle='modal'>&nbsp;撤回</a>";

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

    //阶梯和气价
    // var stepAndPriceFormat = function () {
    //     return {
    //
    //         f : function (val,row) {
    //             var stepStr = "";
    //             // if(row["ctmArchiveId"]){ //固定价格
    //             //     // 用气性质helper
    //             //     var gasTypeHelper=RefHelper.create({
    //             //         ref_url:"gasctmarchive",
    //             //         ref_col:"ctmArchiveId",
    //             //         ref_display:"gasTypeId",
    //             //     });
    //             //     var gasTypeId = gasTypeHelper.getDisplay(row["ctmArchiveId"]);
    //
    //
    //                 $.ajax({
    //                     headers: {
    //                         'Accept': 'application/json',
    //                         'Content-Type': 'application/json'
    //                     },
    //                     url: '/hzqs/bil/pbpri.do?fh=VFLSCGC000000J00&resp=bd&bd={"gas_type_id":'+gasTypeId+'}',
    //                     type:"GET",
    //                     datatype:"json",
    //                     success:function(e){
    //                         if(e.ret_code == '1'){
    //                             if(row["priceType"] ==2){ //固定价格
    //                                 stepStr = "周期价:"+ row["price1"];
    //                             }else{
    //                                 for(var i=1;i<=5;i++) {
    //                                     var measureFrom = "measureFrom"+i ;
    //                                     var measureTo = "measureTo"+i ;
    //                                     var price = "price"+i ;
    //                                     if((row[measureFrom]==0 ||row[measureFrom]) && row[measureTo] && row[price]){
    //                                         stepStr=stepStr +"第"+i+"阶梯:"+row[measureFrom]+ "~"+row[measureTo]+"&nbsp价格:" +row[price]+"<br/>";
    //                                     }
    //                                 }
    //                             }
    //                         }
    //                     }
    //                 })
    //
    //             }
    //             return stepStr;
    //         }
    //     }
    // }();


    return {


        init: function () {
            // 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)
            this.reload();
            this.initHelper();
        },
    //     var data={"表具损坏":"表具损坏","指针损坏":"指针损坏","疑似窃气":"疑似窃气"}
    //     $.map(data, function (key, val) {
    //     $('#argeeReason').append('<option  value="' + val + '">' + key + '</option>');
    // });

        initHelper:function(){
            //审批状态 select init
            var data={"1":"审批中","2":"审批成功","3":"审批失败","4":"待审批","5":"已撤销"}
            $.map(data, function (key, val) {
                $('#find_status').append('<option  value="' + val + '">' + key + '</option>');
            });

        },

        reload:function(){

            $('#divtable').html('');

            var cols = "agreegas.*,meter.address,meter.meter_user_name ,archive.customer_name,archive.gas_type_id,archive.customer_address,archive.customer_code ";
            var bd = {"cols":cols,
                "froms":" gas_act_agree_gas_flow agreegas left join gas_ctm_meter meter on " +
                " agreegas.ctm_archive_id = meter.ctm_archive_id  left join gas_ctm_archive archive on " +
                " agreegas.ctm_archive_id = archive.ctm_archive_id order by agreegas.created_time desc " ,
                "page":"true",
                "limit":50};
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
                        {
                            col:"actAgreeGasFlowId",
                            friendly:"协议气量流程ID",
                            hidden:true,
                            unique:"true",
                            readonly:"readonly",
                            nonedit:"nosend",
                            index:1
                        },
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
                            col:"customerName",
                            friendly:"客户名称",
                            index:4
                        },
                        {
                            col:"meterUserName",
                            friendly:"表户名称",
                            index:5
                        },
                        {
                            col:"address",
                            friendly:"表户地址",
                            index:6
                        },
                        {
                            col:"customerAddress",
                            friendly:"客户地址",
                            index:7
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
                            col:"modifiedTime",
                            format:gotoDetail,
                            friendly:"操作",
                            index:18
                        }

                    ],
                    // 查询过滤条件

                    findFilter : function(){
                        var sql= " 1=1 ";

                        if ($('#find_customerCode').val()) {
                            sql+=" and archive.customerCode like '"+$('#find_customerCode').val()+"%'";
                        }
                        if ($('#find_status option:selected').val()) {
                            sql+= " and agreegas.status like '"+$('#find_status option:selected').val()+"%' "
                        }
                        if ($('#find_start_date').val()) {
                            sql+= " and agreegas.startTime > to_date('"+ $('#find_start_date').val() +"','yyyy-MM-dd') "
                        }

                        if ($('#find_end_date').val()) {
                            sql+= " and agreegas.startTime < to_date('"+ $('#find_end_date').val() +"','yyyy-MM-dd') "
                        }
                        var bd={
                            "cols":cols,
                            "froms":" gas_act_agree_gas_flow agreegas left join gas_ctm_meter meter on " +
                            " agreegas.ctm_archive_id = meter.ctm_archive_id  left join gas_ctm_archive archive on " +
                            " agreegas.ctm_archive_id = archive.ctm_archive_id " ,
                            "wheres":sql+"order by agreegas.created_time desc ",
                            "page":true
                        };

                        xw.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd="+encodeURIComponent(JSON.stringify(bd)));
                        return null;
                    }


                }) //--init
        },

        recall: function (status,actAgreegasFlowId){
            bootbox.confirm("确定撤销吗?", function (result) {
                if (result == false) {
                } else {
                    if(status == '4'){
                        bootbox.alert("撤回成功");
                        var up = Restful.update(hzq_rest+"gasactagreegasflow", actAgreegasFlowId, {
                            "status":"5"
                        })
                        var up = Restful.update(hzq_rest+"psmflowinst", actAgreegasFlowId, {
                            "flowStatus":"9"
                        })
                        window.location = "accountManage/accountagree.html";

                    }else{
                        bootbox.alert("流程已审批撤回失败");
                    }
                }
            });
        }
    }
}();
