/**
 * Created by anne on 2017/6/8.
 */
SideBar.init();
var href = document.location.href;
var correctFlowId = Metronic.getURLParameter("refno");
var fromDetailPage = Metronic.getURLParameter("fromDetailPage");
var userIdss = JSON.parse(localStorage.getItem("user_info")).userId;

var step_result ;
var jsonData;
var correctApprovalStep = function () {
    var areaHelper=RefHelper.create({
        ref_url:"gasbizarea",
        ref_col:"areaId",
        ref_display:"areaName",
    });
    return {
        init: function () {
            this.initPage();
        },
        initPage: function () {
            var correctFlow =  Restful.findNQ(hzq_rest + "gasactbadatl/"+ correctFlowId);
            console.log(correctFlow)
            
            console.log("result"+correctFlowId);
            if(correctFlow.wfId ==undefined){
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
                        url: hzq_rest + 'gasctmarchive/?query={"customerCode":"'+ correctFlow.customerCode+'"}',
                        dataType: 'json',
                        success: function (data) {
                            data = data[0];

                            console.log(data);
                            jsonData = eval(data);

                            $('#customerCode').val(jsonData.customerCode);
                            $('#customerName').val(jsonData.customerName);
                            if(jsonData.customerKind=='1'){
                                $('#customerKind').val("居民");
                                $("#customerMation").html("<a class=\"btn btn-md btn-circle blue information\" data-kind='" + JSON.stringify(jsonData)+"' href=\"javascript:;\">客户详细信息</a>");
                                $('#navtab li').data({
                                    'ctmArchiveId': jsonData.ctmArchiveId,
                                    'customerCode': jsonData.customerCode,
                                    'customerKind': "1"
                                });
                            }else{
                                $('#customerKind').val("非居民");
                                $("#customerMation").html("<a class=\"btn btn-md btn-circle blue noninformation\" data-kind='" + JSON.stringify(jsonData)+"' href=\"javascript:;\">客户详细信息</a>");
                                $('#navtab1 li').data({
                                    'ctmArchiveId': jsonData.ctmArchiveId,
                                    'customerCode': jsonData.customerCode,
                                    'customerKind': "9",
                                });
                            }
                            $('#userTel1').val(jsonData.tel);
                            $('#idCard').val(jsonData.idcard);
                            $('#btName').val("呆账坏账");
                            $('#customerAddress').val(jsonData.customerAddress);
                            
                            if(correctFlow.fileId){
                                pic(correctFlow.fileId);
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
        },

    }
}();


// var doBusi = function(step){
// 	if(step.results==0){
// 		var flow_sql = JSON.parse(step.propstr2048);
// 	    var queryCondion = RQLBuilder.and([
// 	        RQLBuilder.equal("ctmArchiveId",flow_sql.flow_sql.ctmArchiveId),
// 	        RQLBuilder.equal("status","1"),
// 	    ]).rql()
// 	    var queryUrl =  hzq_rest + 'gaschgaccount?fields={"chgAccountId":"1"}&query='+ queryCondion;
	
// 	    var chgAccountId =  Restful.findNQ(queryUrl)[0].chgAccountId;
	
// 	    var queryCondion1 = RQLBuilder.and([
// 	        RQLBuilder.equal("chgAccountId",chgAccountId),
// 	        RQLBuilder.equal("status","1"),
// 	    ]).rql()
// 	    var queryUrl1 =  hzq_rest + 'gasactgasfeeaccount?fields={"gasfeeAccountId":"1"}&query='+ queryCondion1;
// 	    var queryUrl2 =  hzq_rest + 'gasactwastefeeaccount?fields={"wastefeeAccountId":"1"}&query='+ queryCondion1;
	
// 	    var gasfeeAccountId =  Restful.findNQ(queryUrl1)[0].gasfeeAccountId;
// 	    var wastefeeAccountId =  Restful.findNQ(queryUrl2)[0].wastefeeAccountId;
// 	    var submitJson;
	
// 	    var upCorrectFlowStatus = Restful.findNQ(hzq_rest + "gasbllcorrectflow/"+ correctFlowId);
// 	    upCorrectFlowStatus.status="2";
// 	    // upAgreeFlowStatus.status="2";
// 	    var clrTag = "0";
// 	    var correctMon=0;
// 	    if(flow_sql.flow_sql.correctMon){
// 	        correctMon=flow_sql.flow_sql.correctMon
// 	    }else{
// 	        correctMon=0
	
// 	    }
// 	    var tradeType;
// 	    if(jsonData.customerType&&jsonData.customerType=="I"){
// 	    	tradeType="ICB";
// 	    }else{
// 	    	tradeType="BLL";
// 	    }
// 	    if($('#correcttype').val() == "2"){
// 	        var wastefeeatl ={
// 	            "wastefeeAtlId":flow_sql.flow_sql.atlId,
// 	            "wastefeeAccountId":wastefeeAccountId,
// 	            "customerCode":flow_sql.flow_sql.customerCode,
// 	            "areaId":flow_sql.flow_sql.areaId,
// 	            "userId":flow_sql.flow_sql.userId,
// 	            "gasTypeId":flow_sql.flow_sql.gasTypeId,
// 	            "customerKind":flow_sql.flow_sql.customerKind,
// 	            "customerType":jsonData.customerType,
// 	            "chargeUnitId":flow_sql.flow_sql.chargeUnitId,
// 	            "chgAccountId":chgAccountId,
// 	            "tradeType":"BLL",
// 	            "tradeDate":new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00"),
// 	            "clrTag":clrTag,
// 	            // "gas":flow_sql.flow_sql.correctGas,
// 	            "money":correctMon,
// 	            "tradeTypeDesc":"BLLCORRECT",
// 	            "createdBy":flow_sql.flow_sql.createdBy
// 	        };
// 	        submitJson = {"sets":[
// 	            {"txid":"1","body":wastefeeatl,"path":"/gasactwastefeeatl/","method":"POST"},
// 	            {"txid":"2","body":upCorrectFlowStatus,"path":"/gasbllcorrectflow/","method":"PUT"}
// 	        ]}
// 	    }else{
// 	        var gasfeeatl ={
// 	            "gasfeeAtlId":flow_sql.flow_sql.atlId,
// 	            "gasfeeAccountId":gasfeeAccountId,
// 	            "customerCode":flow_sql.flow_sql.customerCode,
// 	            "areaId":flow_sql.flow_sql.areaId,
// 	            "userId":flow_sql.flow_sql.userId,
// 	            "gasTypeId":flow_sql.flow_sql.gasTypeId,
// 	            "customerKind":flow_sql.flow_sql.customerKind,
// 	            "customerType":jsonData.customerType,
// 	            "chargeUnitId":flow_sql.flow_sql.chargeUnitId,
// 	            "chgAccountId":chgAccountId,
// 	            "tradeType":tradeType,
// 	            "tradeDate":new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00"),
// 	            "clrTag":clrTag,
// 	            "gas":flow_sql.flow_sql.correctGas,
// 	            "money":correctMon,
// 	            "tradeTypeDesc":"BLLCORRECT",
// 	            "createdBy":flow_sql.flow_sql.createdBy
// 	        };
// 	        submitJson = {"sets":[
// 	            {"txid":"1","body":gasfeeatl,"path":"/gasactgasfeeatl/","method":"POST"},
// 	            {"txid":"2","body":upCorrectFlowStatus,"path":"/gasbllcorrectflow/","method":"PUT"}
// 	        ]}
// 	    }
// 		var regid = step.ref_no;
// 		var register=Restful.getByID(hzq_rest+'gascsrbusiregister',regid);
// 		console.log(register);
// 		if(register){
// 			register.modifiedTime = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");;
// 			register.finishDate = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");;
// 			register.billState = "3";
// 			submitJson.sets.push({"txid":"3","body":register,"path":"/gascsrbusiregister/","method":"PUT"});
// 			//var ret = Restful.update(hzq_rest+"/gascsrbusiregister",regid,register);
// 		}
	
// 	    var submitResult = Restful.insert("/hzqs/dbc/pbtxs.do?fh=SELDBC0000000J00&resp=bd",submitJson);
// 	    var retFlag=true;
	
// 	    if(submitResult.success==false){
// 	        retFlag=false;
// 	    }else{
// 	        for(var i=0;i<submitResult.results.length;i++){
// 	            if(!submitResult.results[i].result.success){
// 	                retFlag=false;
// 	                break;
// 	            }
// 	        }
// 	    }
	
// 	    if(retFlag){
	
// 	    }else{
// 	        bootbox.alert("提交失败");
// 	        return
// 	    }
// 	}else{
//         var up = Restful.update(hzq_rest+"gasbllcorrectflow", correctFlowId, {
//             "status":"3"
//         })

// 		var regid = step.ref_no;
// 		var register=Restful.getByID(hzq_rest+'gascsrbusiregister',regid);
//     	if(register){
// 			register.modifiedTime = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");;
// 			register.billState = "2";
// 			var ret = Restful.update(hzq_rest+"/gascsrbusiregister",regid,register);
//     	}
// 	}
// }
var doBusi = function(step){
    if(step.results == 1){
        var up = Restful.update(hzq_rest+"gasactbadatl", correctFlowId, {
            "modifiedTime": new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00"),
            "wfStatus":"2",
            "modifiedBy": userIdss
        })
    }else{
        var up = Restful.update(hzq_rest+"gasactbadatl", correctFlowId, {
            "modifiedTime": new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00"),
            "wfStatus":"1",
            "modifiedBy": userIdss
        })
    }
}

var doNext = function(step){
	if(step.results==1){
		var up = Restful.update(hzq_rest+"gasactbadatl", correctFlowId, {
            "modifiedTime": new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00"),
            "modifiedBy": userIdss
        })
	}
}


