/**
 * Created by anne on 2017/6/3.
 */

SideBar.init();
SideBar.activeCurByPage("charging/charge_correct_select.html");
var regu = /^(\+\d+|\d+|\-\d+|\d+\.\d+|\+\d+\.\d+|\-\d+\.\d+)$/;
var re = new RegExp(regu);
var CorrectApplyAction= function () {
    var user = JSON.parse(localStorage.getItem("user_info"));
    var loginName;
    var correctMon;
    var correctGas;
    if(user.employee_name){
        loginName =user.employee_name;
    }else{
        loginName = UserInfo.userId();
    }
    return {
        init: function () {

            var data={"表具损坏":"表具损坏","重新开栓":"重新开栓","换表下线":"换表下线","抄串户":"抄串户","预估气量过高":"预估气量过高","操作错误":"操作错误","价格变更":"价格变更","其他":"其他"}
            $.map(data, function (key, val) {
                $('#correctReason').append('<option  value="' + val + '">' + key + '</option>');
            });
            $("#correcttype").on("change",function () {
                if($(this).val()=="1"){
                    $("#correctGas").removeAttr("disabled");
                    $("#gasnumber").css({"display":""})
                    $('#correctReason').html("")
                    var data={"表具损坏":"表具损坏","重新开栓":"重新开栓","换表下线":"换表下线","抄串户":"抄串户","预估气量过高":"预估气量过高","操作错误":"操作错误","价格变更":"价格变更","其他":"其他"}
                    $.map(data, function (key, val) {
                        $('#correctReason').append('<option  value="' + val + '">' + key + '</option>');
                    });
                }else{
                    $("#correctGas").attr({"disabled":"disabled"})
                    $("#gasnumber").css({"display":"none"})
                    $('#correctReason').html("")
                    var data={"家庭人口数错误":"家庭人口数错误","特殊用户类型错误":"特殊用户类型错误","其他":"其他"}
                    $.map(data, function (key, val) {
                        $('#correctReason').append('<option  value="' + val + '">' + key + '</option>');
                    });
                }
            })
            // 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)
            this.initAction();
        },
        initAction:function () {


            $("#operate").val(loginName);
            $('#submit_bll').click(function () {
            	var data =xw.getTable().getData(true);
			    if(!data.rows.length){
			        data =xw.getTable().getData();
			        if(!data.rows.length||data.rows.length>1){
                        bootbox.alert("请选择一个客户！");
                        return;
                    }

                }
                var customerCode = data.rows[0].customerCode;
                var queryCondion = RQLBuilder.and([
                    RQLBuilder.equal("customerCode",customerCode),
                ]).rql()
                var queryCondion1 = RQLBuilder.and([
                    RQLBuilder.equal("userId",UserInfo.userId()),
                ]).rql()
                var queryUrl =  hzq_rest + 'gasctmarchive?fields={}&query='+ queryCondion;
                var queryUnitUrl =  hzq_rest + 'gassysuser?fields={}&query='+ queryCondion1;

                var ctmResult =  Restful.findNQ(queryUrl)[0];
                var unitResult = Restful.findNQ(queryUnitUrl)[0];
                var ctmArchiveId,customerName,customerKind,gasTypeId,chargeUnitId,areaId,
                    customerAddress,linkMan,linkMantel,bookId;
                if(!ctmResult){
                    bootbox.alert("客户不能空！");
                    return false;
                }else{
                    ctmArchiveId = ctmResult.ctmArchiveId;
                    customerName = ctmResult.customerName;
                    customerKind = ctmResult.customerKind;
                    gasTypeId = ctmResult.gasTypeId;
                    areaId = ctmResult.areaId;
                    customerAddress = ctmResult.customerAddress;
                    linkMan = ctmResult.linkMan;
                    linkMantel = ctmResult.linkMantel;
                    bookId = ctmResult.bookId;
                    chargeUnitId =unitResult.chargeUnitId;
                }

                var regu = /^(\+\d+|\d+|\-\d+|\d+\.\d+|\+\d+\.\d+|\-\d+\.\d+)$/;
                var re = new RegExp(regu);

                if ( $("#correctGas").val()) {
                    if(re.test($("#correctGas").val())){
                        correctGas = $("#correctGas").val();
                    }else{
                        bootbox.alert("更正气量为数字！");
                        return false
                    }
                }else{
                    correctGas = 0;
                }

                if($("#correctMon").val()){
                    if(re.test($("#correctMon").val())){
                        correctMon = $("#correctMon").val();
                    }else{
                        bootbox.alert("更正金额为数字！");
                        return false
                    }

                }else{
                    correctMon = 0;
                }
                if(!$("#correctReason").val()){
                    bootbox.alert("更正原因不能空！");
                    return false;
                }

                var chargeCorrectFlow ={};
                //生产UUID
                correctFlowId = $.md5(ctmArchiveId+new Date().getTime());
                chargeCorrectFlow.correctFlowId = correctFlowId;
                chargeCorrectFlow.ctmArchiveId = ctmArchiveId;
                chargeCorrectFlow.correctType =$("#correcttype").val();
                chargeCorrectFlow.status = "4";
                // var user = JSON.parse(localStorage.getItem("user_info"));
                chargeCorrectFlow.createdBy=UserInfo.userId();
                chargeCorrectFlow.areaId=areaId;
                console.log(" chargeCorrectFlow.areaId:"+ chargeCorrectFlow.areaId)
                chargeCorrectFlow.correctGas = correctGas;
                chargeCorrectFlow.correctMon = correctMon;
                chargeCorrectFlow.correctReason = $("#correctReason").val();
                chargeCorrectFlow.remark = $("#remark").val();
                chargeCorrectFlow.createdTime = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
                chargeCorrectFlow.atlId = correctFlowId;
                if(!gpypictureId){
                    fileId="";
                }
                chargeCorrectFlow.fileId =fileId;
				//流程的sql
                var flow_sql = {};
                flow_sql.correctFlowId=correctFlowId;
                flow_sql.ctmArchiveId = ctmArchiveId;
                flow_sql.createdBy=UserInfo.userId();
                flow_sql.customerCode=customerCode;
                flow_sql.userId=UserInfo.userId();
                flow_sql.areaId=user.area_id;
                flow_sql.gasTypeId=gasTypeId;
                flow_sql.customerKind=customerKind;
                flow_sql.chargeUnitId=chargeUnitId;
                flow_sql.correctGas=chargeCorrectFlow.correctGas;
                flow_sql.correctMon=chargeCorrectFlow.correctMon;
                flow_sql.correctReason=chargeCorrectFlow.correctReason;
                flow_sql.createdBy=chargeCorrectFlow.createdBy;
                flow_sql.remark=chargeCorrectFlow.remark;
                flow_sql.atlId=correctFlowId;
                flow_sql.fileId=chargeCorrectFlow.fileId;
                console.log("flow_sql=="+JSON.stringify(flow_sql));
                
                // 创建业务受理
                var gascsrbusiregister ={};
                var reservedField1 = {
                    "correctGas":$("#correctGas").val(),
                    "correctMon":$("#correctMon").val(),
                    "correctReason":$("#correctReason").val(),
                    "operate":$("#operate").val(),
                    "remark":$("#remark").val(),
                    "files":fileId

                }
                gascsrbusiregister.busiRegisterId=correctFlowId;//业务登记ID
                gascsrbusiregister.businessTypeId = "BLLCORRECTA";
                gascsrbusiregister.ctmArchiveId=ctmArchiveId;//档案ID
                gascsrbusiregister.ctmMeterId=bookId;
                gascsrbusiregister.areaId=user.area_id;
                gascsrbusiregister.customerCode=customerCode;//客户编号
                gascsrbusiregister.customerName=customerName;//客户姓名
                gascsrbusiregister.customerAddr=customerAddress;//客户地址
                gascsrbusiregister.linkMan=linkMan;//联系人
                gascsrbusiregister.linkPhone=linkMantel;//联系人电话
                gascsrbusiregister.acceptDate=new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");//受理时间
                gascsrbusiregister.description=chargeCorrectFlow.remark;//备注
                gascsrbusiregister.flowInstance=correctFlowId;//流程实例ID
                gascsrbusiregister.blankOutSign="N";
                gascsrbusiregister.busiAcceptCode=gascsrbusiregister.busiRegisterId.substring(20);//受理单号 暂定
                gascsrbusiregister.billState="0";
                gascsrbusiregister.createdTime=new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");//创建时间
                gascsrbusiregister.createdBy=UserInfo.userId();//创建人
                gascsrbusiregister.modifiedTime=new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");//变更时间
                gascsrbusiregister.reservedField1=JSON.stringify(reservedField1);//预留字段1当初状态
                gascsrbusiregister.reservedField2=chargeCorrectFlow.fileId;//预留字段2当成业务中文件busiid

                var submitJson;
                submitJson = {"sets":[
                    {"txid":"1","body":gascsrbusiregister,"path":"/gascsrbusiregister/","method":"POST"},
                    {"txid":"2","body":chargeCorrectFlow,"path":"/gasbllcorrectflow/","method":"POST"}
                ]}
                var submitResult = Restful.insert("/hzqs/dbc/pbtxs.do?fh=SELDBC0000000J00&resp=bd",submitJson);
                var retFlag=true;

                if(submitResult.success==false){
                    retFlag=false;
                }else{
                    for(var i=0;i<submitResult.results.length;i++){
                        if(!submitResult.results[i].result.success){
                            retFlag=false;
                            break;
                        }
                    }
                }

                if(retFlag){
                    var flow_def;
                    if($("#correcttype").val()=="1"){
                    	flow_def="BLLCORRECTA";
                    }else if($("#correcttype").val()=="2"){
                    	flow_def="BLLCORRECTA2";
                    }else{
                    	flow_def="BLLCORRECTA";
                    }

                    // var result = Restful.insert(hzq_rest + "gasbllcorrectflow",chargeCorrectFlow)
                    // console.log("submit:result:"+JSON.stringify(result));
                    // console.log("areaid:"+user.area_id);

                        flowjson = {"flow_def_id":flow_def,"ref_no":correctFlowId,"operator":chargeCorrectFlow.createdBy,"be_orgs":user.area_id,
                            "flow_inst_id":correctFlowId,
                            "propstr2048":{"flow_sql":flow_sql,"busitype":"计费更正"},
                            "prop1str64":moment().format("YYYY-MM-DD HH:mm:ss"),
                            "prop2str64":customerName+"("+customerCode+")",
                            "propstr128":loginName,
                            "propstr256":"",
                            "override_exists":false}

                        var flow_result = Restful.insert("/hzqs/psm/pbisn.do?fh=VFLSCGC000000J00&bd={}&resp=bd",flowjson)

                        bootbox.alert("提交成功",function () {
                            window.location.href="charging/charge_correct_select.html"
                        });

                        }else{
                            var result = Restful.delByID(hzq_rest + "gasbllcorrectflow",chargeCorrectFlow.correctFlowId);
                            var result1 = Restful.delByID(hzq_rest + "gascsrbusiregister",gascsrbusiregister.busiRegisterId);
                            bootbox.alert("提交失败");
                        }
            });
        }


    }
}()




