/**
 * Created by alex on 2017/4/7.
 */
SideBar.init();
// SideBar.activeCurByPage("non_inhabitant_open_boltManagement.html");

var href = document.location.href;
//console.log(href)
var unboltId = Metronic.getURLParameter("refno");

var stepid = Metronic.getURLParameter("stepid");
if(stepid){
    $("#delete").show();
    $("#agree").show();
    $("#opinion").show();
    $(".fei").hide();
    SideBar.activeCurByPage();
}else{
    SideBar.activeCurByPage("non_inhabitant_open_boltmanagement.html");
}


console.log("unboltid="+unboltId)

var step_result ;
noInhabitantOpenBoltDetailAction = function () {
    return {
        init: function () {
            this.findFilter()
            if(stepid){
                step_result = Restful.insert("/hzqs/psm/pbget.do?fh=VFLSCGC000000J00&bd={}&resp=bd",{
                    "flow_inst_id":unboltId,"step_status":"2",
                    "do_operator":UserInfo.userId()
                })
                console.log("step_result=="+JSON.stringify(step_result)+"::"+step_result.rowcount)
                if(step_result.rowcount==0){
                    step_result = Restful.insert("/hzqs/psm/pbget.do?fh=VFLSCGC000000J00&bd={}&resp=bd",{
                       "flow_inst_id":unboltId,"step_status":"1",
                        "do_operator":UserInfo.userId()
                    });
                    console.log(step_result)
                }
                if(step_result.rowcount&&step_result.rowcount==1){

                }else{
                    if(Metronic.getURLParameter("stepid")){
                        console.log("未找到对应的审批流程");
                        bootbox.alert("未找到对应的审批流程");
                    }
                }
            }

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
                        url: hzq_rest + 'gascsrunbolt/' + unboltId,
                        dataType: 'json',
                        data: "",
                        success: function (data) {

                            var areaHelper=RefHelper.create({
                                ref_url:"gasbizarea",
                                ref_col:"areaId",
                                ref_display:"areaName",
                            });
                            console.log(data)

                            console.log(data);
                            var json = eval(data);
                            $("#unbolt_no").val(json.unboltNo);
                            $("#project_no").val(json.projectNo);
                            var projectDate=json.projectDate
                            if(projectDate){
                                $("#project_date").val(projectDate.substring(0,10));
                            }

                            $("#project_name").val(json.projectName);
                            $("#find_area").val(areaHelper.getDisplay(json.areaId));
                            $("#link_man").val(json.linkMan);
                            $("#link_tel").val(json.linkTel);
                            $("#build_unit").val(json.buildUnit);
                            $("#reservedField2").val(json.reservedField2);
                            if(json.projectType){
                                var projectType = json.projectType.split(",");
                                $("#projectType").val(projectType).trigger("change");
                            }

                            if(json.unboleType){
                                $("#unboltType").val(json.unboleType).trigger("change");
                            }

                            $("#project_address").val(json.projectAddress);

                            if(json.fileId){
                                $("#picture").css("display","block");
                                pic(json.fileId);
                            }else{
                                $("#picture").css("display","none")
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
                        url: hzq_rest + 'gascsrunboltnorsdtdetail/?query={"unboltId":"' + unboltId + '"}',
                        dataType: 'json',
                        data: "",
                        success: function (data) {
                            var gasTypeHelper=RefHelper.create({
                                ref_url:"gasbizgastype",
                                ref_col:"gasTypeId",
                                ref_display:"gasTypeName"
                            });
                            console.log(data);
                            var json = eval(data);
                            var totalCount = 0;
                            var totalCapacity = 0;
                            for (var i = 0; i < json.length; i++) {
                                $('#unboltDetail').append('<tr>' +
                                    '<td>' + gasTypeHelper.getDisplay(json[i].gasTypeId) + '</td>' +
                                    '<td>' + json[i].capacity + '</td>' +
                                    '<td>' + json[i].mtrCount + '</td>' +
                                    '</tr>'
                                );
                                totalCount += json[i].mtrCount;
                                totalCapacity += json[i].capacity;
                                $('#totalCapacity').text("总流量:" + totalCapacity);
                                $('#totalCount').text("总数量:" + totalCount);

                            }

                        }

                    }
                )
            });
        }
    }


}();
$('#cancel').click(function () {
    history.go("-1");
})

$('#delete').click(function () {
    var up = Restful.update(hzq_rest+"gascsrunbolt", unboltId, {
        "approveStatus":"3"
    })
    console.log("up=="+JSON.stringify(up));

    if(step_result.rowcount&&step_result.rowcount==1){
        var step = step_result.steps[0]
        var flow_result = Restful.insert("/hzqs/psm/pbput.do?fh=VPUTPSM000000J00&resp=bd",
            {
                "step_inst_id": step.step_inst_id,
                "prop1str64": step.prop1str64,
                "prop2str64": step.prop2str64,
                "propstr128": step.propstr128,
                "propstr256": step.propstr256,
                "propstr2048": JSON.stringify($.extend({},JSON.parse(step.propstr2048),{"op":approvalopinion})),
                "results":"1"
            })
        if(flow_result.retcode=='0'&&flow_result.steps&&flow_result.steps.length>0){
            bootbox.alert("流程已拒绝",function(){
                window.location = "index.html";
            });
        }else{
            bootbox.alert("网络貌似不正常～操作失败");
        }
    }else{
        if(!up){
            bootbox.alert("未找到对应的审批流程,请重新提交流程",function(){
                // window.location = "customer/inhabitant_open_boltmanagement.html";
            });
        }
    }

});


$("#agree").on('click',function(){
    var approvalopinion = $("#approvalopinion").val();
    console.log(unboltId)

    if(step_result.rowcount&&step_result.rowcount==1){
        //1.生产本编号和客户编号！
        var bookjson=new Array();
        var step = step_result.steps[0];
        console.log(step);
        var flow_result = Restful.insert("/hzqs/psm/pbput.do?fh=VPUTPSM000000J00&resp=bd",
            {
                "step_inst_id": step.step_inst_id,
                "prop1str64": step.prop1str64,
                "prop2str64": step.prop2str64,
                "propstr128": step.propstr128,
                // "propstr256": JSON.stringify(step256json),
                "propstr2048": JSON.stringify($.extend({},JSON.parse(step.propstr2048),{"op":approvalopinion})),
                "results":"0"
            })
        console.log(flow_result);
        if(flow_result.retcode=='0'&&flow_result.steps&&flow_result.steps.length>0){
            bootbox.alert("流程审核成功",function(){
                var up = Restful.update(hzq_rest+"gascsrunbolt", unboltId, {
                    "approveStatus":"4"
                })

                window.location = "index.html";
            });
        }else{
            bootbox.alert("网络貌似不正常～操作失败");
        }

    }else{
        bootbox.alert("未找到对应的审批流程,请重新提交流程");
    }

});