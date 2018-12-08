/**
 * Created by anne on 2017/6/15.
 */

SideBar.init();
SideBar.activeCurByPage("accountagree.html");
var href = document.location.href;
var actAgreegasFlowId = Metronic.getURLParameter("refno");
var fromDetailPage = Metronic.getURLParameter("fromDetailPage");


var step_result ;

var agreegasApprovalStep = function () {
    var areaHelper=RefHelper.create({
        ref_url:"gasbizarea",
        ref_col:"areaId",
        ref_display:"areaName",
    });
    return {
        init: function () {
            this.initPage();
        },
        archive: {},
        
        initPage: function () {
            var agreegasFlow =  Restful.findNQ(hzq_rest + "gasactagreegasflow/"+ actAgreegasFlowId);
            $('#agreeGas').val(agreegasFlow.agreeGas);
            $('#agreeMon').val(agreegasFlow.agreeMon);
            $('#argeeReason').val(agreegasFlow.argeeReason);
            $('#startTime').val(agreegasFlow.startTime.substring(0,10));
            $('#endTime').val(agreegasFlow.endTime.substring(0,10));
            if(agreegasFlow.payStatus=='1'){
                $('#payStatus').val("已缴费");
            }else{
                $('#payStatus').val("未缴费");
            }

            $('#remark').val(agreegasFlow.remark);
            console.log("result"+actAgreegasFlowId);
            if(agreegasFlow.actAgreegasFlowId ==undefined){
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
                        url: hzq_rest + 'gasctmarchive/' + agreegasFlow.ctmArchiveId,
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
                            archive = json;
                            $('#customerCode').val(json.customerCode);
                            $('#customerName').val(json.customerName);
                            /*if(json.customerKind=='1'){
                                $('#customerKind').val("居民");
                            }else{
                                $('#customerKind').val("非居民");
                            }*/

                            var result = Restful.findNQ(hzq_rest + 'gasctmarchive/?query={"customerCode":"'+json.customerCode+'"}')
                            console.log(result[0].ctmarchiveId)
                            if(json.customerKind=='1'){
                                $('#customerKind').val("居民");
                                $("#customerMation").html("<a class=\"btn btn-md btn-circle blue information\"  data-kind='" + JSON.stringify(result[0])+"' href=\"javascript:;\">客户详细信息</a>");
                                $('#navtab li').data({
                                    'ctmArchiveId': result[0].ctmArchiveId,
                                    'customerCode': result[0].customerCode,
                                    'customerKind': "1"
                                });
                            }else{
                                $('#customerKind').val("非居民");
                                $("#customerMation").html("<a class=\"btn btn-md btn-circle blue noninformation\" data-kind='" + JSON.stringify(result[0])+"' href=\"javascript:;\">客户详细信息</a>");
                                $('#navtab1 li').data({
                                    'ctmArchiveId': result[0].ctmArchiveId,
                                    'customerCode': result[0].customerCode,
                                    'customerKind': "9",
                                });
                            }

                            $('#userTel1').val(json.userTel1);
                            $('#idCard').val(json.idCard);
                            $('#btName').val("协议气量");
                            $('#customerAddress').val(json.customerAddress);

                            if(agreegasFlow.fileId){
                                pic(agreegasFlow.fileId);
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

            });
        }
    }
}();

var doBusi = function(step){
	if(step.results==0){
		var regid = step.ref_no;
	    var register=Restful.getByID(hzq_rest+'gascsrbusiregister',regid);
	    if(register){
	        register.modifiedTime = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");;
	        register.finishDate = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");;
	        register.billState = "3";
	        register.modifiedBy = UserInfo.userId();
	    }
		var flow_sql = JSON.parse(step.propstr2048);
        var queryCondion = RQLBuilder.and([
            RQLBuilder.equal("ctmArchiveId",flow_sql.flow_sql.ctmArchiveId),
            RQLBuilder.equal("status","1"),
        ]).rql()
        var queryUrl =  hzq_rest + 'gaschgaccount?fields={"chgAccountId":"1"}&query='+ queryCondion;

        var chgAccountId =  Restful.findNQ(queryUrl)[0].chgAccountId;

        var queryCondion1 = RQLBuilder.and([
            RQLBuilder.equal("chgAccountId",chgAccountId),
            RQLBuilder.equal("status","1"),
        ]).rql()
        var queryUrl1 =  hzq_rest + 'gasactgasfeeaccount?fields={"gasfeeAccountId":"1"}&query='+ queryCondion1;

        var gasfeeAccountId =  Restful.findNQ(queryUrl1)[0].gasfeeAccountId;
        var gasfeeatl;
        var submitJson;
        //更改工单信息
        var upAgreeFlowStatus = Restful.findNQ(hzq_rest + "gasactagreegasflow/"+ actAgreegasFlowId);
        upAgreeFlowStatus.status="2";

        gasfeeatl ={
            "gasfeeAtlId":flow_sql.flow_sql.atlId,
            "gasfeeAccountId":gasfeeAccountId,
            "chgAccountId":chgAccountId,
            "customerCode":flow_sql.flow_sql.customerCode,
            "areaId":flow_sql.flow_sql.areaId,
            "userId":flow_sql.flow_sql.userId,
            "gasTypeId":flow_sql.flow_sql.gasTypeId,
            "customerKind":flow_sql.flow_sql.customerKind,
            "chargeUnitId":flow_sql.flow_sql.chargeUnitId,
            "customerType": archive.customerType,
            "tradeType":"BLL",
            "tradeDate":new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00"),
            "clrTag":"0",
            "gas":flow_sql.flow_sql.agreeGas,
            "money":flow_sql.flow_sql.agreeMon,
            "createdBy":flow_sql.flow_sql.createdBy,
            "createdTime":new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00"),
            "modifiedTime":new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00")
        };

        submitJson = {"sets":[
            {"txid":"1","body":gasfeeatl,"path":"/gasactgasfeeatl/","method":"POST"},
            {"txid":"2","body":upAgreeFlowStatus,"path":"/gasactagreegasflow/","method":"PUT"},
            {"txid":"3","body":register,"path":"/gascsrbusiregister/","method":"PUT"}
        ]}

        var submitResult = Restful.insert("/hzqs/dbc/pbtxs.do?fh=SELDBC0000000J00&resp=bd",submitJson);

        console.log("submit:result:"+JSON.stringify(submitResult));

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

        }else{
            bootbox.alert("提交失败");
            return
        }
	}else{
        var up = Restful.update(hzq_rest+"gasactagreegasflow", actAgreegasFlowId, {"status":"3"})
		var regid = step.ref_no;
		var register=Restful.getByID(hzq_rest+'gascsrbusiregister',regid);
    	if(register){
			register.modifiedTime = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");;
			register.finishDate = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");;
			register.modifiedBy = UserInfo.userId();
			register.billState = "2";
			var ret2 = Restful.update(hzq_rest+"/gascsrbusiregister",regid,register);
    	}
	}
}


