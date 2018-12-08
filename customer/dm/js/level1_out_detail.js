/**
 * Created by alex on 2017/6/15.
 */
/**
 * Created by alex on 2017/3/14.
 */
SideBar.init();

var href = document.location.href;
var applyId = Metronic.getURLParameter("refno");
var stepid = Metronic.getURLParameter("stepid");
var factoryHelper = RefHelper.create({
    ref_url: 'gasmtrfactory',
    ref_col: 'factoryId',
    ref_display: 'factoryName'
});
//表具规格型号
var meterspecIdHelper = RefHelper.create({
    ref_url: 'gasmtrmeterspec',
    ref_col: 'meterModelId',
    ref_display: 'meterModelName'
});
//表具类型
var meterTypeIdHelper = RefHelper.create({
    ref_url: 'gasmtrmetertype',
    ref_col: 'meterTypeId',
    ref_display: 'meterTypeName'
});
// if(stepid){
//     $("#delete").show();
//     $("#agree").show();
//     $("#opinion").show();
//     SideBar.activeCurByPage();
// }else{
//     SideBar.activeCurByPage("inhabitant_open_boltManagement.html");
// }
// console.log("unboltid="+unboltId)
var step_result ;


level1_out_detailAction = function () {
    return {
        init: function () {

            this.findFilter()

            //获取流程任务
            step_result = Restful.insert("/hzqs/psm/pbget.do?fh=VFLSCGC000000J00&bd={}&resp=bd",{
                "be_role":"YINGYEBU","flow_inst_id":applyId,"step_status":"2",
                "do_operator":UserInfo.userId()
            })
            console.log("step_result=="+JSON.stringify(step_result)+"::"+step_result.rowcount)

            if(step_result.rowcount==0){
                step_result = Restful.insert("/hzqs/psm/pbget.do?fh=VFLSCGC000000J00&bd={}&resp=bd",{
                    "be_role":"YINGYEBU","flow_inst_id":applyId,"step_status":"1",
                    "do_operator":UserInfo.userId()
                })
            }
            if(step_result.rowcount&&step_result.rowcount==1){

            }else{
                if(Metronic.getURLParameter("stepid")){
                    console.log("未找到对应的审批流程");
                    bootbox.alert("未找到对应的审批流程");
                }
            }
            // http://localhost:8000/hzqs/psm/pbget.do?fh=VFLSCGC000000J00&bd={}&resp=bd

        },
        findFilter: function () {
            $(function () {
                $.ajax(
                    {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        type: 'get',
                        url: hzq_rest + 'gasmtrapply/' + applyId,
                        dataType: 'json',
                        data: "",
                        success: function (data) {
                            var depositoryHelper=RefHelper.create({
                                ref_url:"gasmtrdepository",
                                ref_col:"depositoryId",
                                ref_display:"depositoryName",
                            });
                            console.log(data);
                            var json = eval(data);
                            $("#applyCode").val(json.applyCode);
                            $("#sourceDepositoryId").val(depositoryHelper.getDisplay(json.sourceDepositoryId));
                            $("#targetDepositoryId").val(depositoryHelper.getDisplay(json.targetDepositoryId));
                            $("#applyUserName").val(json.applyUserName);
                            var lastUseDate=json.lastUseDate;
                            if(lastUseDate){
                                $("#lastUseDate").val(lastUseDate.substring(0,10));
                            }
                            $("#applyType").val(json.applyType);
                            if(json.fileId){
                                $("#picture").css("display","block");
                                pic(json.fileId);
                            }else{
                                $("#picture").css("display","none")
                            }

                        },
                        error: function(err) {
                            //console.log("error:"+JSON.stringify(err))
                            if( err.status==401){
                                //need to login
                                if(window.location.pathname.indexOf('/login.html')<0)
                                {
                                    window.location.replace("/login.html?redirect="+window.location.pathname);
                                }

                            }

                        }
                    }
                )
                $.ajax(
                    {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        type: 'get',
                        url: hzq_rest + 'gasmtrmeterapplydetail/?query={"applyId":"' + applyId + '"}',
                        dataType: 'json',
                        data: "",
                        success: function (data) {
                            console.log(data);
                            var json = eval(data);
                            // var totalPerson = 0;
                            for (var i = 0; i < json.length; i++) {
                                $('#applyDetail').append('<tr>' +
                                    '<td>' + factoryHelper.getDisplay(json[i].factoryId)  + '</td>' +
                                    '<td>' + meterspecIdHelper.getDisplay(json[i].meterModelId) + '</td>' +
                                    '<td>' + meterTypeIdHelper.getDisplay(json[i].meterTypeId)  + '</td>' +
                                    '<td>' + json[i].meterCount + '</td>' +
                                    '</tr>'
                                );
                                // totalPerson += json[i].roomCount;
                                // $('#totalPerson').text("总户数:" + totalPerson);
                            }
                        }
                    }
                )
            });
        }
    }
}();
$('#cancel').click(function () {
    // window.location = "customer/inhabitant_open_boltManagement.html";
    history.go("-1")
});


// $('#delete').click(function () {
//     //window.location = "customer/inhabitant_open_boltManagement.html";
//
//     var up = Restful.update(hzq_rest+"gascsrunbolt", unboltId, {
//         "approveStatus":"3"
//     })
//     console.log("up=="+JSON.stringify(up));
//     console.log(step_result);
//     if(step_result.rowcount&&step_result.rowcount==1){
//         var step = step_result.steps[0]
//
//
//         var flow_result = Restful.insert("/hzqs/psm/pbput.do?fh=VPUTPSM000000J00&resp=bd",
//             {
//                 "step_inst_id": step.step_inst_id,
//                 "prop1str64": step.prop1str64,
//                 "prop2str64": step.prop2str64,
//                 "propstr128": step.propstr128,
//                 "propstr256": step.propstr256,
//                 "propstr2048": JSON.stringify($.extend({},JSON.parse(step.propstr2048),{"op":approvalopinion})),
//                 "results":"0"
//             })
//         if(flow_result.retcode=='0'&&flow_result.steps&&flow_result.steps.length>0){
//             bootbox.alert("流程已拒绝",function(){
//                 window.location.href = "index.html";
//             });
//         }else{
//             bootbox.alert("网络貌似不正常～操作失败");
//         }
//     }else{
//         if(!up){
//             bootbox.alert("未找到对应的审批流程,请重新提交流程",function(){
//                 window.location = "index.html";
//             });
//         }
//     }
//
// });

// $("#agree").on('click',function(){
//     var approvalopinion = $("#approvalopinion").val();
//     console.log(unboltId)
//
//     if(step_result.rowcount&&step_result.rowcount==1){
//         // //1.生产本编号和客户编号！
//         // var bookjson=new Array();
//         // var step = step_result.steps[0]
//         // var stepsubmit = JSON.parse(step.propstr256);
//         // $.each(stepsubmit,function(idx,row){
//         //
//         //         bookjson.push({
//         //             "area_id":step.be_orgs,
//         //             "countper_id":row.cu,
//         //             "serviceper_id":row.su,
//         //             "floornum":row.fn,
//         //             "door_count":row.rc,
//         //             "book_type":row.bt
//         //         })
//         //     }
//         // )
//         //
//         // var batch_result = Restful.insert("/hzqs/sys/pbbkx.do?fh=VBKXSYS000000J00&resp=bd",
//         //     {
//         //         "batchid": step.step_inst_id,
//         //         "customer": {"area_id":step.be_orgs,"reserved_field1":step.ref_no,"unbolt_time":step.prop1str64,"customer_kind":"1"},
//         //         "books":bookjson
//         //     })
//         //
//         // console.log("batch_result=="+JSON.stringify(batch_result));
//         // if(batch_result!=null){
//         //     if(batch_result.err_code=="0"){
//         //         console.log("New Insert OK");
//         //     }else if(batch_result.err_code=="1"){
//         //         console.log("update OK");
//         //     }else{
//         //         bootbox.alert("出错了，～\n"+batch_result.message);
//         //         return;
//         //     }
//         //
//         //     var step256json = new Array();
//         //     $.each(batch_result.books,function(idx,row){
//         //         step256json.push({
//         //             "fn":row.floornum,
//         //             "rc":row.door_count,
//         //             "bid":row.book_id,
//         //             "ai":row.area_id,
//         //             "bc":row.book_code,
//         //             "bt":row.book_type
//         //         })
//         //     })
//         //
//
//             //2.提交流程
//             var flow_result = Restful.insert("/hzqs/psm/pbput.do?fh=VPUTPSM000000J00&resp=bd",
//                 {
//                     "step_inst_id": step.step_inst_id,
//                     "prop1str64": step.prop1str64,
//                     "prop2str64": step.prop2str64,
//                     "propstr128": step.propstr128,
//                     "propstr256": JSON.stringify(step256json),
//                     "propstr2048": JSON.stringify($.extend({},JSON.parse(step.propstr2048),{"op":approvalopinion})),
//                     "results":"1"
//                 })
//             if(flow_result.retcode=='0'&&flow_result.steps&&flow_result.steps.length>0){
//                 bootbox.alert("流程审核成功",function(){
//                     window.location = "index.html";
//                 });
//             }else{
//                 bootbox.alert("网络貌似不正常～操作失败");
//             }
//         }
//         else{
//             console.log("Batch Open Exist!");
//             bootbox.alert("网络开小差～");
//             return;
//         }
//
//
//
//     }else{
//         bootbox.alert("未找到对应的审批流程,请重新提交流程");
//     }
//
// });


