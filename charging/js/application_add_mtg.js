
var applicationAdd = function () {
    var xwdata ;
    return {
        init: function () {
            this.initFnc();
        },
		initFnc:function(){
			$('#submit_btn').click(function(){
				$('#submit_btn').addClass("disabled");
				var startDate=$("#find_day").val();
				if(!startDate){
					bootbox.alert("<br><center><h4>请填写生效日期</h4></center><br>");
					$('#submit_btn').removeClass("disabled");
			    	return;
				}
				xwdata =xw.getTable().getData(true);
			    if(!xwdata.rows.length){
			    	xwdata =xw.getTable().getData();
			    	if(!xwdata.rows.length||xwdata.rows.length>1){
			    		bootbox.alert("<br><center><h4>请选择一个客户</h4></center><br>");
			    		$('#submit_btn').removeClass("disabled");
			    		return;
			    	}
			    }
			    
				var occurrencetime = new Date().toLocaleString();
				var customerCode = xwdata.rows[0].customerCode;
				var customerAddress = xwdata.rows[0].customerAddress;
				var customerName =xwdata.rows[0].customerName;
				var customerKind =xwdata.rows[0].customerKind;
				var customerTel =xwdata.rows[0].tel;
				var ctmArchiveId =xwdata.rows[0].ctmArchiveId;
				var idcard = xwdata.rows[0].idcard;
				var remark=$('#remark').val();
				
				if(gpypictureId){
        			filesid = fileId;
			    }else{
			        filesid="";
			    }
			    var submitJson={
			    	"sets":[]
			    };
			    
			    //发流程
			    var busiData={
			    	"customerCode":customerCode,
			    	"customerName":customerName,
			    	"customerTel":customerTel,
			    	"customerAddress":customerAddress,
			    	"idcard":idcard,
			    	"customerKind":customerKind,
			    	"busitype":"煤改气用户登记申请",
			    	"remark":(remark?remark:""),
			    	"fileId":filesid,
			    	"treatyStartTime":startDate
			    }
			    var flowInstId=$.md5(JSON.stringify(busiData)+new Date().getTime());
			    flowjson = {
			        "flow_def_id":"MTGSQ",
			        "ref_no":flowInstId,
			        "be_orgs":UserInfo.init().area_id,
			        "operator":UserInfo.init().userId,
			        "flow_inst_id":flowInstId,
			        "prop1str64":moment().format("YYYY-MM-DD HH:mm:ss"),
			        "prop2str64":customerName+"("+customerCode+")",
			        "propstr128":"营业部",
			        "propstr2048":busiData,
			        "override_exists":false
			    }
			    //创建业务受理
			    var gascsrbusiregister ={};
			    gascsrbusiregister.busiRegisterId=flowInstId;//业务登记ID
			    gascsrbusiregister.businessTypeId = "MTGSQ";
			    gascsrbusiregister.ctmArchiveId=ctmArchiveId;//档案ID
			    $.ajax({
			        type: 'get',
			        url: hzq_rest + 'gasctmmeter/?query={"ctmArchiveId":"'+ctmArchiveId+'"}' ,
			        dataType: 'json',
			        contentType: "application/json; charset=utf-8",
			        async: false,
			        success: function (data) {
			            if (data[0]) {
			                gascsrbusiregister.ctmMeterId=data[0].bookId;
			            }
			        }
			    });
			    gascsrbusiregister.areaId=UserInfo.init().area_id;
			    gascsrbusiregister.customerCode=customerCode;//客户编号
			    gascsrbusiregister.customerName=customerName;//客户姓名
			    gascsrbusiregister.customerAddr=customerAddress;//客户地址
			    gascsrbusiregister.linkMan=customerName;//联系人
			    gascsrbusiregister.linkPhone=customerTel;//联系人电话
			    gascsrbusiregister.acceptDate=new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");//受理时间
			    gascsrbusiregister.flowInstance=flowInstId;//流程实例ID
			    gascsrbusiregister.blankOutSign="N";
			    gascsrbusiregister.busiAcceptCode=flowInstId.substring(20);//受理单号 暂定
			    gascsrbusiregister.billState="0";
			    gascsrbusiregister.createdTime=new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");//创建时间
			    gascsrbusiregister.createdBy=UserInfo.userId();//创建人
			    gascsrbusiregister.modifiedTime=new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");//变更时间
			    gascsrbusiregister.reservedField1=JSON.stringify(busiData);//预留字段1当初状态
			    gascsrbusiregister.reservedField2=filesid;//预留字段2当成业务中文件busiid
			    
			    submitJson.sets.push({"txid":"1","body":gascsrbusiregister,"path":"/gascsrbusiregister/","method":"POST"});
			    
			    //创建煤改气登记流程信息
			    var nonRsdtDct={};
			    nonRsdtDct.nonRsdtDctId=flowInstId;
			    nonRsdtDct.customerName=customerName;
			    nonRsdtDct.discountType="2";
			    nonRsdtDct.customerTel=customerTel;
			    nonRsdtDct.customerAddress=customerAddress;
			    nonRsdtDct.measureFrom1=0;
			    nonRsdtDct.measureTo1=9999999999;
			    nonRsdtDct.createdTime = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
			    nonRsdtDct.createdBy=UserInfo.userId();
			    nonRsdtDct.modifiedTime = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
			    nonRsdtDct.modifiedBy=UserInfo.userId();
			    nonRsdtDct.treatyStartTime= new Date(startDate);
			    nonRsdtDct.treatyEndTime= new Date("3099-01-01 00:00:00"+"-00:00");
			    nonRsdtDct.nonrsdtType="2";
			    nonRsdtDct.status = "2";
			    
			    submitJson.sets.push({"txid":"2","body":nonRsdtDct,"path":"/gasbllnonrsdtdct/","method":"POST"});
			    
			    var nonRsdtDctCtm={};
			    nonRsdtDctCtm.nonrsdtDctCtmId=flowInstId;
			    nonRsdtDctCtm.nonRsdtDctId=flowInstId;
			    nonRsdtDctCtm.nonRsdtDctFlowId=flowInstId;
			    nonRsdtDctCtm.ctmArchiveId=ctmArchiveId;
			    nonRsdtDctCtm.status = "2";
			    nonRsdtDctCtm.createdTime = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
			    nonRsdtDctCtm.createdBy=UserInfo.userId();
			    nonRsdtDctCtm.modifiedTime = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
			    nonRsdtDctCtm.modifiedBy=UserInfo.userId();

				submitJson.sets.push({"txid":"3","body":nonRsdtDctCtm,"path":"/gasbllnonrsdtdctctm/","method":"POST"});
				
			    var nonRstdtDctFlow ={};
                nonRstdtDctFlow.nonRsdtDctFlowId = flowInstId;
                nonRstdtDctFlow.nonRsdtDctId = flowInstId;
                nonRstdtDctFlow.status = "1";
                nonRstdtDctFlow.createdBy=UserInfo.userId();
                nonRstdtDctFlow.areaId=UserInfo.init().area_id;
                nonRstdtDctFlow.treatyEndTime = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
                nonRstdtDctFlow.createdTime = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
                nonRstdtDctFlow.archiveids =ctmArchiveId;
			    
			    submitJson.sets.push({"txid":"4","body":nonRstdtDctFlow,"path":"/gasbllnonrsdtdctflow/","method":"POST"});
			    
			    $.ajax({
			        type: 'POST',
			        url:  "/hzqs/dbc/pbtxs.do?fh=SELDBC0000000J00&resp=bd",
			        dataType: 'json',
			        contentType: "application/json; charset=utf-8",
			        async: false,
			        isMask: true,
			        data: JSON.stringify(submitJson),
			
			        success: function(data) {
						var retFlag=true;
				        for(var i=0;i<data.results.length;i++){
				            if(!data.results[i].result.success){
				                retFlag=false;
				                break;
				            }
				        }
					    if(retFlag){
					    	var flow_result = Restful.insert("/hzqs/psm/pbisn.do?fh=VFLSCGC000000J00&bd={}&resp=bd",flowjson);
						    if(flow_result.retmsg == "SUCCESS:1"){
						    	bootbox.alert("<br><center><h4>流程提交成功</h4></center><br>",function(){
						    		window.location.reload();
//						    		window.location.replace("/serviceManage/dispatching_manage/repair_order_perform.html");
						    	})
						    }else{
						    	$("#submit_btn").removeClass("disabled");
						        var ss = Restful.delByIDR(hzq_rest + "/gascsrbusiregister",flowInstId);
						        var ss2 = Restful.delByIDR(hzq_rest + "/gasbllnonrsdtdct",flowInstId);
						        var ss3 = Restful.delByIDR(hzq_rest + "/gasbllnonrsdtdctctm",flowInstId);
						        var ss4 = Restful.delByIDR(hzq_rest + "/gasbllnonrsdtdctflow",flowInstId);
						        bootbox.alert("<br><center><h4>流程提交失败</h4></center><br>")
						    }
					    }else{
					    	$("#submit_btn").removeClass("disabled");
					        bootbox.alert("<br><center><h4>提交失败</h4></center><br>");
					    }
			        },
			        error: function(err) {
			        	$("#submit_btn").removeClass("disabled");
			            bootbox.alert("<br><center><h4>提交失败</h4></center><br>");
			            if( err.status==406){
			                //need to login
			                if(window.location.pathname.indexOf('/login.html')<0)
			                {
			                    window.location.replace("/login.html?redirect="+window.location.pathname);
			                }
			            }
			        }
			    });
			    
			    
			    
			});
			$('#back_btn').click(function(){
				window.location = "/charging/dis_cus_register2.html";
			});
		},
    }
}();

