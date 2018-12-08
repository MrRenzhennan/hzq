SideBar.init();
SideBar.activeCurByPage("big_cus_dis_rate_approval.html");
var href = document.location.href;
var nonRsdtDctFlowId = Metronic.getURLParameter("refno");
var fromDetailPage = Metronic.getURLParameter("fromDetailPage");

//console.log("unboltid="+nonRsdtDctFlowId)
var step_result ;

var bigCusApprovalStep = function () {
    var areaHelper=RefHelper.create({
        ref_url:"gasbizarea",
        ref_col:"areaId",
        ref_display:"areaName",
    });
    return {
        init: function () {
            this.findFilter();
            this.find_flow();
            this.initAction();
        },

        find_flow:function(){

            //获取流程任务
            console.log("userid:"+UserInfo.userId());
            console.log("nonRsdtDctFlowId:"+nonRsdtDctFlowId);
            step_result = Restful.insert("/hzqs/psm/pbget.do?fh=VFLSCGC000000J00&bd={}&resp=bd",{
                "flow_inst_id":nonRsdtDctFlowId,"step_status":"2",
                "do_operator":UserInfo.userId()
            })

            console.log("step_result=="+JSON.stringify(step_result)+"::"+step_result.rowcount)

            if(step_result.rowcount==0){
                step_result = Restful.insert("/hzqs/psm/pbget.do?fh=VFLSCGC000000J00&bd={}&resp=bd",{
                    "flow_inst_id":nonRsdtDctFlowId,"step_status":"1",
                    "do_operator":UserInfo.userId()
                })
            }
            if(step_result.rowcount&&step_result.rowcount==1){
                var step = step_result.steps[0]
                var flow_sql = JSON.parse(step.propstr2048);
                $("#opinion_msg").html(flow_sql.opinion_msg);
            }else{
                if(Metronic.getURLParameter("stepid")){
                    console.log("未找到对应的审批流程");
                    bootbox.alert("未找到对应的审批流程");
                }
            }
            // http://localhost:8000/hzqs/psm/pbget.do?fh=VFLSCGC000000J00&bd={}&resp=bd

        },
        findFilter: function () {
            var nonRsdtDctFlow =  Restful.findNQ(hzq_rest + "gasbllnonrsdtdctflow/"+ nonRsdtDctFlowId);
            console.log("result"+nonRsdtDctFlow);
            if(nonRsdtDctFlow.nonRsdtDctId ==undefined){
                bootbox.alert("未找到对应的审批流程");
                return false;
            }
            $(function () {
                $.ajax(
                    {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        type: 'get',
                        url: hzq_rest + 'gasbllnonrsdtdct/' + nonRsdtDctFlow.nonRsdtDctId,
                        dataType: 'json',
                        data: "",
                        success: function (data) {
                            if(data.status == "2" || fromDetailPage==1){
                                $("#agree").addClass('hidden');
                                $("#opinion").addClass('hidden');
                                $("#delete").addClass('hidden');
                            }else{
                                $("#agree").removeClass('hidden');
                                $("#opinion").removeClass('hidden')
                                $("#delete").removeClass('hidden');
                            }


                            console.log(data);
                            var json = eval(data);
                            $("#customer_name").html(json.customerName);
                            $("#customer_tel").html(json.customerTel);
                            $("#customer_address").html(json.customerAddress);
                            $("#belong_to").html(json.belongTo);
                            $("#discount_type").html(GasModBil.DiscountType.f(json.discountType));
                            $("#treaty_start_time").html(GasModBil.dateFormat.f(json.treatyStartTime));
                            $("#treaty_end_time").html(GasModBil.dateFormat.f(json.treatyEndTime));
                            $("#measure_price").html(GasModBil.measure_price(json));
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

                console.log("archiveids:"+nonRsdtDctFlow.archiveids);
                var tmpArchiveids=nonRsdtDctFlow.archiveids.split(",");
                var archiveids=[];
                $.each(tmpArchiveids,function (idx,val) {
                    archiveids.push('"'+val+'"');
                })
                var baseUrl = RQLBuilder.and([
                    RQLBuilder.condition_fc("ctmArchiveId","$in","["+archiveids.join()+"]")
                ]).rql()
                $.ajax(
                    {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        type: 'get',
                        url: hzq_rest + 'gasctmarchive/?query='+ baseUrl,
                        dataType: 'json',
                        data: "",
                        success: function (data) {
                            console.log(data);
                            var json = eval(data);
                            for (var i = 0; i < json.length; i++) {
                                $('#customerDetail').append('<tr>' +
                                    '<td>' + (json[i].customerCode ? json[i].customerCode : "") + '</td>' +
                                    '<td>' + (json[i].customerName ? json[i].customerName : "") + '</td>' +
                                    '<td>' + (json[i].customerAddress ? json[i].customerAddress : "") + '</td>' +
                                    '<td>' + (json[i].mobile ? json[i].mobile : "") + '</td>' +
                                    '<td>' + (json[i].areaId ? areaHelper.getDisplay(json[i].areaId) : "")  + '</td>' +
                                    '</tr>'
                                );
                            }
                            $('#totalPerson').text("总户数:" + json.length);
                        }
                    }
                )
            });
        },

        initAction:function(){

            $('#cancel').click(function () {
                window.location = "/index.html";
            });


            $('#delete').click(function () {
                //window.location = "customer/inhabitant_open_boltManagement.html";
                var approvalopinion = $("#approvalopinion").val();
                var up = Restful.update(hzq_rest+"gasbllnonrsdtdctflow", nonRsdtDctFlowId, {
                    "status":"3"
                })
                console.log("up=="+JSON.stringify(up));

                if(step_result.rowcount&&step_result.rowcount==1){
                	var userName=UserInfo.init().employee_name;
					if(!userName){
						userName=UserInfo.userId();
					}
                    var step = step_result.steps[0]
                    var opinion_msg = $("#opinion_msg").val();
                    var approvalopinion = step.gs_chcode+ "["+userName+"]:"+moment().format("YYYY-MM-DD HH:mm:ss")+" "+ $("#approvalopinion").val() +"<br>";
                    approvalopinion=opinion_msg+ approvalopinion;

                    var flow_result = Restful.insert("/hzqs/psm/pbput.do?fh=VPUTPSM000000J00&resp=bd",
                        {
                            "step_inst_id": step.step_inst_id,
                            "ref_no":step.ref_no,
                            "prop1str64": step.prop1str64,
                            "prop2str64": step.prop2str64,
                            "propstr128": step.propstr128,
                            "propstr256": step.propstr256,
                            "propstr2048": JSON.stringify($.extend({},JSON.parse(step.propstr2048),{"opinion_msg":approvalopinion})),
                            "results":"1"
                        })
                    if(flow_result.retcode=='0'&&flow_result.steps&&flow_result.steps.length>0){
                        bootbox.alert("流程已拒绝",function(){
                            window.location = "/index.html";
                        });
                    }else{
                        bootbox.alert("网络貌似不正常～操作失败");
                    }
                }else{
                    if(!up){
                        bootbox.alert("未找到对应的审批流程,请重新提交流程",function(){
                            window.location = "/index.html";
                        });
                    }
                }

            });


            $("#agree").on('click',function(){
                console.log(nonRsdtDctFlowId)
                if(step_result.rowcount&&step_result.rowcount==1){
                    //1.生产本编号和客户编号！
                    var step = step_result.steps[0]
                    var batch_result={};
                    if(step.gs_ecode=="PFOUR"){//参看流程定义，第四步审批之后将结束
                        var flow_sql = JSON.parse(step.propstr256);
                        var tmpArchiveids=flow_sql.archiveids.split(",");
                        var nonrsdtDctCtm =[];
                        $.each(tmpArchiveids,function (indx,val) {
                            nonrsdtDctCtm.push({
                                "ctmArchiveId":val,
                                "nonRsdtDctId":flow_sql.nonRsdtDctId,
                                "nonRsdtDctFlowId":flow_sql.nonRsdtDctFlowId,
                                "status":1,
                                "createdBy":flow_sql.createdBy,
                                "createdTime":new Date(),
                                "modifiedTime":new Date()
                            })
                        })
                        batch_result = Restful.insert(hzq_rest+"gasbllnonrsdtdctctm",nonrsdtDctCtm);
                        var up = Restful.update(hzq_rest+"gasbllnonrsdtdctflow", nonRsdtDctFlowId, {
                            "status":"2"
                        })
                    }else{
                        batch_result["success"]=true;//不是流程最后一步，直接放过流程
                    }

                    console.log("batch_result=="+JSON.stringify(batch_result));
                    if(batch_result!=null ){
                        if( batch_result["success"]){
                            console.log("New Insert OK");
                        }else{
                            bootbox.alert("出错了，～\n"+batch_result.message);
                            return;
                        }
                        var approvalopinion = $("#approvalopinion").val();
                        if(approvalopinion==undefined ||approvalopinion ==""){
                            bootbox.alert("请填写审批意见");
                            return;
                        }
                        
						var userName=UserInfo.init().employee_name;
						if(!userName){
							userName=UserInfo.userId();
						}
                        approvalopinion = step.gs_chcode+ "["+userName+"]:"+moment().format("YYYY-MM-DD HH:mm:ss")+" "+ approvalopinion +"<br>";
                        var opinion_msg = $("#opinion_msg").html();
                        approvalopinion=opinion_msg+ approvalopinion;
						console.log(approvalopinion)
                        //2.提交流程
                        var flow_result = Restful.insert("/hzqs/psm/pbput.do?fh=VPUTPSM000000J00&resp=bd",
                            {
                                "step_inst_id": step.step_inst_id,
                                "ref_no":step.ref_no,
                                "prop1str64": step.prop1str64,
                                "prop2str64": step.prop2str64,
                                "propstr128": step.propstr128,
                                "propstr256": step.propstr256,
                                "propstr2048": JSON.stringify($.extend({},JSON.parse(step.propstr2048),{"opinion_msg":approvalopinion})),
                                "results":"0"
                            })
                        if(flow_result.retcode=='0'&&flow_result.steps&&flow_result.steps.length>0){
                            bootbox.alert("流程审核成功",function(){
                                window.location = "/index.html";
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

                }else{
                    bootbox.alert("未找到对应的审批流程,请重新提交流程");
                }

            });
        }
    }
}();


