/**
 * Created by anne on 2017/6/14.
 */


SideBar.init();
SideBar.activeCurByPage("accountManage/accountagree.html");
var agreeGasApplyAction= function () {
    var user = JSON.parse(localStorage.getItem("user_info"));
    var loginName;
    if(user.employee_name){
        loginName =user.employee_name;
    }else{
        loginName = UserInfo.userId();
    }
    return {
        init: function () {
            // 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)
            this.initAction();
        },
        initAction:function () {

            var data={"表具故障":"表具故障","二次表不显示":"二次表不显示","疑似窃气":"疑似窃气","缺电":"缺电","其他":"其他"}
            $.map(data, function (key, val) {
                $('#argeeReason').append('<option  value="' + val + '">' + key + '</option>');
            });
            $("#operate").val(loginName);
            $('#submit_bll').click(function () {
                var customerCode = $("#find_key").val()
                var queryCondion = RQLBuilder.and([
                    RQLBuilder.equal("customerCode",customerCode),
                ]).rql()
                var queryUrl =  hzq_rest + 'gasctmarchive?fields={}&query='+ queryCondion;
                var queryCondion1 = RQLBuilder.and([
                    RQLBuilder.equal("userId",UserInfo.userId()),
                ]).rql()
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

                var regu = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,4})))$/;
                var re = new RegExp(regu);
                if(!$("#agreeGas").val()){
                    bootbox.alert("协议气量不能空！");
                    return false;
                }else{
                    if (re.test($("#agreeGas").val())) {

                    } else {
                        bootbox.alert("协议气量为正数！");
                        return false
                    }
                }
                if(!$("#agreeMon").val()){
                    bootbox.alert("协议金额不能空！");
                    return false;
                }else{
                    if (re.test($("#agreeMon").val())) {

                    } else {
                        bootbox.alert("协议金额只能为正数！");
                        return false
                    }
                }
                if(!$("#argeeReason").val()){
                    bootbox.alert("协议原因不能空！");
                    return false;
                }
                if(!$("#startTime").val()){
                    bootbox.alert("开始时间不能空！");
                    return false;
                }
                if(!$("#endTime").val()){
                    bootbox.alert("截止时间不能空！");
                    return false;
                }
                if($("#startTime").val() > $("#endTime").val()){
                    bootbox.alert("开始时间不能大于截止时间！");
                    return false;
                }
                if(!$("#remark").val()){
                    bootbox.alert("业务说明不能空！");
                    return false;
                }

                var agreeGasFlow ={};
                //生产UUID
                actAgreegasFlowId = $.md5(ctmArchiveId+new Date().getTime());
                agreeGasFlow.actAgreegasFlowId = actAgreegasFlowId;
                agreeGasFlow.ctmArchiveId = ctmArchiveId;
                agreeGasFlow.status = "4";
                // var user = JSON.parse(localStorage.getItem("user_info"));
                agreeGasFlow.createdBy=UserInfo.userId();
                agreeGasFlow.areaId=areaId;
                console.log(" agreeGasFlow.areaId:"+ agreeGasFlow.areaId);
                agreeGasFlow.applyCode = GasModBil.date_format(new Date(),'yyyyMMdd')+GasModBil.RndNum.f(4);
                agreeGasFlow.agreeGas = $("#agreeGas").val();
                agreeGasFlow.agreeMon = "-"+$("#agreeMon").val();
                agreeGasFlow.argeeReason = $("#argeeReason").val();
                agreeGasFlow.payStatus = $("#payStatus").val();
                agreeGasFlow.startTime = $("#startTime").val();
                agreeGasFlow.endTime = $("#endTime").val();
                agreeGasFlow.measurePrice = "";
                agreeGasFlow.remark = $("#remark").val();
                agreeGasFlow.createdTime = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
                agreeGasFlow.atlId = GasModService.getUuid();
                if(!fileId){
                    fileId="";
                }
                agreeGasFlow.fileId =fileId;

                //创建业务受理
                var reservedField1  = {};
                reservedField1.agreeGas = $("#agreeGas").val();
                reservedField1.agreeMon = "-"+$("#agreeMon").val();
                reservedField1.argeeReason = $("#argeeReason").val();
                reservedField1.payStatus = $("#payStatus").val();
                reservedField1.startTime = $("#startTime").val();
                reservedField1.endTime = $("#endTime").val();
                reservedField1.measurePrice = "";
                reservedField1.operate = $("#operate").val();
                reservedField1.remark = $("#remark").val();
                reservedField1.averageGas = $("#averageGas").val();
                reservedField1.fileId = fileId;

                var gascsrbusiregister ={};
                gascsrbusiregister.busiRegisterId=actAgreegasFlowId;//业务登记ID
                gascsrbusiregister.businessTypeId = "XYQL";
                gascsrbusiregister.ctmArchiveId=ctmArchiveId;//档案ID
                gascsrbusiregister.ctmMeterId=bookId;
                gascsrbusiregister.areaId=user.area_id;
                gascsrbusiregister.customerCode=customerCode;//客户编号
                gascsrbusiregister.customerName=customerName;//客户姓名
                gascsrbusiregister.customerAddr=customerAddress;//客户地址
                gascsrbusiregister.linkMan=linkMan;//联系人
                gascsrbusiregister.linkPhone=linkMantel;//联系人电话
                gascsrbusiregister.acceptDate=new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");//受理时间
                gascsrbusiregister.description=agreeGasFlow.remark;//备注
                gascsrbusiregister.flowInstance=actAgreegasFlowId;//流程实例ID
                gascsrbusiregister.blankOutSign="N";
                gascsrbusiregister.busiAcceptCode=gascsrbusiregister.busiRegisterId.substring(20);//受理单号 暂定
                gascsrbusiregister.billState="0";
                gascsrbusiregister.createdTime=new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");//创建时间
                gascsrbusiregister.createdBy=UserInfo.userId();//创建人
                gascsrbusiregister.modifiedTime=new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");//变更时间
                gascsrbusiregister.reservedField1=JSON.stringify(reservedField1);//预留字段1当初状态
                gascsrbusiregister.reservedField2=agreeGasFlow.fileId;//预留字段2当成业务中文件busiid

                var submitJson;
                submitJson = {"sets":[
                    {"txid":"1","body":gascsrbusiregister,"path":"/gascsrbusiregister/","method":"POST"},
                    {"txid":"2","body":agreeGasFlow,"path":"/gasactagreegasflow/","method":"POST"}
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
                    //流程的sql
                    var flow_sql = {};
                    flow_sql.actAgreegasFlowId=actAgreegasFlowId;
                    flow_sql.ctmArchiveId = ctmArchiveId;
                    flow_sql.createdBy=UserInfo.userId();
                    flow_sql.customerCode=customerCode;
                    flow_sql.userId=UserInfo.userId();
                    flow_sql.gasTypeId=gasTypeId;
                    flow_sql.customerKind=customerKind;
                    flow_sql.chargeUnitId=chargeUnitId;
                    flow_sql.areaId=user.area_id;
                    flow_sql.agreeGas=agreeGasFlow.agreeGas;
                    flow_sql.agreeMon=agreeGasFlow.agreeMon;
                    flow_sql.argeeReason=agreeGasFlow.argeeReason;
                    flow_sql.applyCode=agreeGasFlow.applyCode;
                    flow_sql.payStatus=agreeGasFlow.payStatus;
                    flow_sql.createdBy=agreeGasFlow.createdBy;
                    flow_sql.startTime=agreeGasFlow.startTime;
                    flow_sql.endTime=agreeGasFlow.endTime;
                    flow_sql.remark=agreeGasFlow.remark;
                    flow_sql.fileId=agreeGasFlow.fileId;
                    flow_sql.atlId=agreeGasFlow.atlId;
                    console.log("flow_sql=="+JSON.stringify(flow_sql));

                    flowjson = {"flow_def_id":"XYQL","ref_no":actAgreegasFlowId,"operator":agreeGasFlow.createdBy,"be_orgs":user.area_id,
                        "flow_inst_id":actAgreegasFlowId,
                        "propstr2048":{"flow_sql":flow_sql,"busitype":"协议气量"},
                        "prop1str64":moment().format("YYYY-MM-DD HH:mm:ss"),
                        "prop2str64":customerName+"("+customerCode+")",
                        "propstr128":loginName,
                        "propstr256":"",
                        "override_exists":false}

                    var flow_result = Restful.insert("/hzqs/psm/pbisn.do?fh=VFLSCGC000000J00&bd={}&resp=bd",flowjson);

                    bootbox.alert("提交成功",function () {
                        window.location.href="accountManage/accountagree.html"
                    });

                }else{
                    var result = Restful.delByID(hzq_rest + "gasactagreegasflow",agreeGasFlow.actAgreegasFlowId);
                    var result1 = Restful.delByID(hzq_rest + "gascsrbusiregister",gascsrbusiregister.busiRegisterId);
                    bootbox.alert("提交失败");
                }

            });
        }


    }
}()





