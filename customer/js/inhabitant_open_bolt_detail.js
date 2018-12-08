/**
 * Created by alex on 2017/3/14.
 */
SideBar.init();

var href = document.location.href;
var unboltId = Metronic.getURLParameter("refno");
var stepid = Metronic.getURLParameter("stepid");
if(stepid){
    $("#delete").show();
    $("#agree").show();
    $("#opinion").show();
    SideBar.activeCurByPage();
}else{
    SideBar.activeCurByPage("inhabitant_open_boltManagement.html");
}
console.log("unboltid="+unboltId)
var step_result ;
var bookjson=new Array();

inhabitantOpenBoltDetailAction = function () {
    return {
        init: function () {

            this.findFilter()

            if(stepid){
                //获取流程任务
                step_result = Restful.insert("/hzqs/psm/pbget.do?fh=VFLSCGC000000J00&bd={}&resp=bd",{
                   "flow_inst_id":unboltId,"step_status":"2",
                    "do_operator":UserInfo.userId()
                })
                console.log("step_result=="+JSON.stringify(step_result)+"::"+step_result.rowcount)

                if(step_result.rowcount==0){
                    step_result = Restful.insert("/hzqs/psm/pbget.do?fh=VFLSCGC000000J00&bd={}&resp=bd",{
                        "flow_inst_id":unboltId,"step_status":"1",
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
                            $("#projectType").val("民用");
                            $("#project_address").val(json.projectAddress);
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
                        url: hzq_rest + 'gascsrunboltrsdtdetail/?query={"unboltId":"' + unboltId + '"}',
                        dataType: 'json',
                        data: "",
                        success: function (data) {
                            console.log(data);
                            var json = eval(data);
                            var totalPerson = 0;
                            for (var i = 0; i < json.length; i++) {
                                $('#unboltDetail').append('<tr>' +
                                    '<td>' + json[i].floorNum + '</td>' +
                                    '<td>' + json[i].roomCount + '</td>' +
                                    '</tr>'
                                );
                                bookjson.push({"floornum":json[i].floorNum})
                                totalPerson += json[i].roomCount;
                                $('#totalPerson').text("总户数:" + totalPerson);
                            }
                        }
                    }
                )
            });
        }
    }
}();
$('#cancel').click(function () {
    history.go("-1")
});


$('#delete').click(function () {
    var up = Restful.update(hzq_rest+"gascsrunbolt", unboltId, {
            "approveStatus":"3"
        })
    console.log("up=="+JSON.stringify(up));
    console.log(step_result);
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
                window.location.href = "index.html";
            });
        }else{
            bootbox.alert("网络貌似不正常～操作失败");
        }
    }else{
        if(!up){
            bootbox.alert("未找到对应的审批流程,请重新提交流程",function(){
               window.location = "index.html";
            });
        }
    }

});

$("#agree").on('click',function(){
    var approvalopinion = $("#approvalopinion").val();
    console.log(unboltId)

    if(step_result.rowcount&&step_result.rowcount==1){
        //1.生产本编号和客户编号！

        var step = step_result.steps[0]
        console.log(step);
        var stepsubmit = JSON.parse(step.propstr256);
        console.log(JSON.parse(step.propstr2048))
        var oldornew = JSON.parse(step.propstr2048).oldornew
        console.log(oldornew)
        if(oldornew == "2"){
            var flow_result = Restful.insert("/hzqs/psm/pbput.do?fh=VPUTPSM000000J00&resp=bd",
                {
                    "step_inst_id": step.step_inst_id,
                    "prop1str64": step.prop1str64,
                    "prop2str64": step.prop2str64,
                    "propstr128": step.propstr128,
                    "propstr256": JSON.stringify(step256json),
                    "propstr2048": JSON.stringify($.extend({},JSON.parse(step.propstr2048),{"op":approvalopinion})),
                    "results":"0"
                })
            console.log(flow_result)
            if(flow_result.retcode=='0'&&flow_result.steps&&flow_result.steps.length>0){
                bootbox.alert("流程审核成功",function(){
                    var up = Restful.update(hzq_rest+"gascsrunbolt", unboltId, {
                        "approveStatus":"4"
                    })
                    console.log("up=="+JSON.stringify(up));
                    window.location = "index.html";
                });
            }else{
                bootbox.alert("网络貌似不正常～操作失败");
            }
        }else{
            $.each(stepsubmit,function(idx,row){
                console.log(row);
                bookjson[idx]["area_id"] = step.be_orgs;
                bookjson[idx]["door_count"] = row.rc;
                bookjson[idx]["book_type"] = row.bt;
                bookjson[idx]["area_id"] = step.be_orgs

                console.log(bookjson)
            })
            console.log(stepsubmit)
            console.log(bookjson)

            var batch_result = Restful.insert("/hzqs/sys/pbbbc.do?fh=SYSBBC0000000J00&resp=bd&bd",{
                "batchid": step.step_inst_id,
                "count":$("#unboltDetail tr").length,
                "books":bookjson
            })
            console.log("batch_result=="+JSON.stringify(batch_result));
            var result = Restful.findNQ(hzq_rest + 'gascsrunboltrsdtdetail/?query={"unboltId":"' + unboltId + '"}');
            console.log(result);

            $.each(batch_result.books,function(index){
                console.log(batch_result.books[index].book_id)
                result[index]["bookId"] = batch_result.books[index].book_id
                console.log( result[index])
                $.ajax({
                    url: hzq_rest + 'gascsrunboltrsdtdetail/'+result[index].rsdtDetailId,
                    type: 'PUT',
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8",
                    data:JSON.stringify(result[index] ),
                    async: false,
                    success: function(data) {
                        console.log(data)
                    },
                    error: function(err) {

                    }
                });
            })

            if(batch_result!=null){
                if(batch_result.err_code=="0"){
                    console.log("New Insert OK");
                }else if(batch_result.err_code=="1"){
                    console.log("update OK");
                }else{
                    bootbox.alert("出错了，～\n"+batch_result.message);
                    return;
                }

                var step256json = new Array();
                $.each(batch_result.books,function(idx,row){
                    step256json.push({
                        "fn":row.floornum,
                        "rc":row.door_count,
                        "bid":row.book_id,
                        "ai":row.area_id,
                        "bc":row.book_code,
                        "bt":row.book_type
                    })
                })
                console.log(step256json)
                //2.提交流程
                var flow_result = Restful.insert("/hzqs/psm/pbput.do?fh=VPUTPSM000000J00&resp=bd",
                    {
                        "step_inst_id": step.step_inst_id,
                        "prop1str64": step.prop1str64,
                        "prop2str64": step.prop2str64,
                        "propstr128": step.propstr128,
                        "propstr256": JSON.stringify(step256json),
                        "propstr2048": JSON.stringify($.extend({},JSON.parse(step.propstr2048),{"op":approvalopinion})),
                        "results":"0"
                    })
                console.log(flow_result)
                if(flow_result.retcode=='0'&&flow_result.steps&&flow_result.steps.length>0){
                    bootbox.alert("流程审核成功",function(){
                        var up = Restful.update(hzq_rest+"gascsrunbolt", unboltId, {
                            "approveStatus":"4"
                        })
                        console.log("up=="+JSON.stringify(up));
                        window.location = "index.html";
                    });
                }else{
                    bootbox.alert("网络貌似不正常～操作失败");
                }
            }
            else{
                console.log("Batch Open Exist!");
                bootbox.alert("网络开小差～");
                return;
            }

        }

    }else{
        bootbox.alert("未找到对应的审批流程,请重新提交流程");
    }
    
});


