/**  * Created by anne on 12/14/17.  */
var href = document.location.href;
var meterRepairId = href.split('?')[1];
var customerCode = href.split('?')[2];
var ctmArchiveId = href.split('?')[3];
var customerName = decodeURIComponent(href.split('?')[4]);
var results = Restful.findNQ(hzq_rest + 'gasctmmeter/?query={"ctmArchiveId":"' + ctmArchiveId + '"}');
var meterId = "";
$("#unid_id").hide();

var paramurl = "/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd";
var wheres;
var area_id=UserInfo.init().area_id;
if(area_id=="1"){
	wheres="status=1 order by unit_id";
}else{
	wheres="status=1 and area_id ='"+area_id+"' order by unit_id";
}
var param = {
	"cols":"unit_id,unit_name",
  	"froms":"gas_sys_unit",
  	"wheres":wheres,
  	"page":true,
};
$.ajax({
	headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
	},
	type: 'POST',
	url: paramurl,
	async: false,
	data : JSON.stringify(param),
	success: function (data) {
		var obj = $("#unit")
		var sHtmlTest = "";  
		for(var o in data.rows){
		    var listText = data.rows[o].unitName;  
		    var listValue = data.rows[o].unitId;  
		    sHtmlTest+="<option value='" + listValue + "'>" + listText + "</option>";
		    
		}  
		obj.append(sHtmlTest); 
    } 
})
			
var repairDetailAction = function () {
    var factoryHelper = RefHelper.create({ref_url: "gasmtrfactory", ref_col: "factoryId", ref_display: "factoryName"});
    var modelHelper = RefHelper.create({
        ref_url: "gasmtrmeterspec",
        ref_col: "meterModelId",
        ref_display: "meterModelName"
    });
    return {
        init: function () {
            this.initHelper();
            this.load();
        },
        initHelper: function () {
            var areaId = UserInfo.init().area_id;
            var xwQuery = RQLBuilder.and([RQLBuilder.equal("areaId", areaId)]).rql();
            $.ajax({
                headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
                type: 'get',
                async: false,
                url: hzq_rest + 'gassysuser?query=' + xwQuery,
                success: function (data) {
                    console.log(data)
                    if (data.length > 0) {
                        for (var o in data) {
                            $('#sendPerson').append('<option value="' + data[o].userId + '">' + data[o].employeeName + '</option>');
                        }
                    }
                }
            })
            $.map(factoryHelper.getData(), function (value, key) {
                $('#factoryId').append('<option value="' + key + '">' + value + '</option>');
            });
            $.map(modelHelper.getData(), function (value, key) {
                $('#meterModelId').append('<option value="' + key + '">' + value + '</option>');
            });
        },
        load: function () {
            $.ajax({
                url: hzq_rest + 'gasmtrmeterrepair?query={"meterRepairId":"' + meterRepairId + '"}',
                type: "get",
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                async: false,
                success: function (data) {
                    if (data.length) {
                        $('#customerName').val(customerName);
                        $('#repairMethodResult').val(data[0].repairMethodResult);
                        $('#customerSatisfaction').val(data[0].customerSatisfaction).trigger("change");
                        if(data[0].securityCheck){
                            console.log(data[0].securityCheck)
                            var checks=$('input.fors2');
                            for(var i=0;i<checks.length;i++){
                                checks[i].index=i;
                                if(data[0].securityCheck.indexOf(checks[i].value)>=0){
                                    $(checks[i]).parent("span").attr("class","checked");
                                }

                            }
                        }
                        if(data[0].files){
                            pic(data[0].files)
                        }
                        $("#sendPerson").val(data[0].sendPerson).trigger("change");
                        $('#tab_1_1 input').each(function (index, val) {
                            inputElement = val;
                            $.each(data[0], function (key, val) {
                                if (key == "repairDate" && $(inputElement).attr('name') == key) {
                                    $(inputElement).val(val.substring(0, 10))
                                } else {
                                    if ($(inputElement).attr('name') == key) {
                                        $(inputElement).val(val)
                                    }
                                }
                            })
                        })
                        $('#tab_2_2 input').each(function (index, val) {
                            inputElement = val;
                            $.each(data[0], function (key, val) {
                                if ($(inputElement).attr('name') == key) {
                                    $(inputElement).val(val)
                                }
                            })
                        })
                        $('#tab_3_3 input').each(function (index, val) {
                            inputElement = val;
                            $.each(data[0], function (key, val) {
                                if ($(inputElement).attr('name') == key) {
                                    $(inputElement).val(val)
                                }
                            })
                        })
                        $('#tab_4_4 input').each(function (index, val) {
                            inputElement = val;
                            $.each(data[0], function (key, val) {
                                if (key == "finishTime" && $(inputElement).attr('name') == key) {
                                    $(inputElement).val(val.substring(0, 10))
                                } else {
                                    if ($(inputElement).attr('name') == key) {
                                        $(inputElement).val(val)
                                    }
                                }
                            })
                        })  
                        $("input").attr("disabled",true) 
                        $("select").attr("disabled",true) 
                        $("textarea").attr("disabled",true) 
                         $("#save_btn").css("display", "none"); 
                        $("#cencel_btn").css("display", "none");
                        $("#s_html").hide();  
                    } else {

                    }
                }
            })
            //累积购气量
            $.ajax({
                url: "/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
                type: "POST",
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify({
                    cols: "sum(measure) sumGas",
                    froms: "gasChgIccard",
                    wheres: "ctmArchiveId= '"+ctmArchiveId+"'",
                    page: "false",
                    // limit:1
                }),
                dataType: "json",
                success: function (data) {
                    console.log("data"+data[0])
                    if(data.length){
                        $('#sumGas').val(data[0].sumGas);
                    }else{
                        $('#sumGas').val("0");
                    }
                }
            })
            if (results) {
                meterId = results[0].meterId
            }
            $.ajax({
                url: hzq_rest + 'gasmtrmeter?query={"meterId":"' + meterId + '"}',
                type: "get",
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                async: false,
                success: function (data) {
                    if (data.length) {
                        $('#direction').val(data[0].direction).trigger("change");
                        $('#meterModelId option[value=' + data[0].meterModelId + ']').attr("selected", true);
                        $('#meterModelId').val(data[0].meterModelId).trigger("change");
                        $('#factoryId').val(data[0].factoryId).trigger("change");
                        $('#tab_2_2 input').each(function (index, val) {
                            inputElement = val;
                            $.each(data[0], function (key, val) {
                                if ($(inputElement).attr('name') == key) {
                                    $(inputElement).val(val)
                                }
                            })
                        })
                    } else {
                    }
                }
            })
        }
    }
}();
$('#save_btn').click(function () {
	var changeMeter = $("#changeMeter").val();
	if(!changeMeter){
		bootbox.alert("<br><center>请选择是否需要换表</center></br>");
		return;
	}
    var archive = Restful.findNQ(hzq_rest + 'gasctmarchive/?query={"customerCode":"' + $("#customerCode").val() + '"}');
    if(archive.length){
        var item = "";
        $(".fors2" ).each(function() {
            if ($(this).attr("checked")) {
                item += $(this).val()+",";
            }
        });

        if(gpypictureId){
            filesid = fileId;
        }else{
            filesid="";
        }
        var param = {
            "meterRepairId": GasModService.getUuid(),
            "customerCode": $('#customerCode').val(),
            "customerTel": $('#customerTel').val(),
            "customerAddress": $('#customerAddress').val(),
            "repairContent": $('#repairContent').val(),
            "repairDate": $('#repairDate').val(),
            "sendPerson": $('#sendPerson option:selected').val(),
            "failurePhenomenon": $('#failurePhenomenon').val(),
            "failureReason": $('#failureReason').val(),//userinfo.userId, 
            "repairMethodResult": $('#repairMethodResult').val(),
            "securityCheck": item,
            "finishTime": $('#finishTime').val(),
            "customerAutograph": $('#customerAutograph').val(),
            "factoryRepairor": $('#factoryRepairor').val(),
            "unitRepairor": $('#unitRepairor').val(),
            "examiner": $('#examiner').val(),
            "customerSatisfaction": $('#customerSatisfaction option:selected').val(),
            "remark": $("#remark").val(),
            "status": "1",
            "surGas":$('#surGas').val(),
            "fullGas":$('#fullGas').val(),
            "files":filesid,
            "createdTime": new Date(moment().format('yyyy-MM-dd hh:mm:ss') + "-00:00"),
            "createdBy":  UserInfo.init().userId,
            "modifiedTime": new Date(moment().format('yyyy-MM-dd hh:mm:ss') + "-00:00"),
            "modifiedBy": UserInfo.init().userId,
        }
        
        if(changeMeter==1){
        	param.changeMeter=changeMeter;
        	var unit = $("#unit").val();
        	if(!unit){
        		bootbox.alert("<br><center>请选择所要执行换表的部门</center></br>");
				return;
        	}
        	var workBill={
				"areaId":archive.areaId,
				"ownUnit":unit,
				"billState":"1",
				"billType":"WB_CHANGEM",
				"customerCode":archive.customerCode,
				"customerName":archive.customerName,
				"customerAddress":archive.customerAddress,
				"isBatch":"0",
				"createdBy":UserInfo.userId(),
		        "modifiedBy":UserInfo.userId(),
		        "createdTime":new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00"),
		        "modifiedTime":new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00"),
		        "bizName": "CHANGEMT",
		        "contractName":archive.customerName,
		        "phone":archive.customerTel,
			}
        	var workBillId = $.md5(JSON.stringify(workBill)+new Date().getTime());
			workBill.workBillId=workBillId;
			workBill.billCode=workBillId;
        	
        }
		var submitJson = {"sets":[
	        {"txid":"1","body":param,"path":"/gasmtrmeterrepair/","method":"POST"}
		]}
		if(changeMeter==1){
			submitJson.sets.push({"txid":"2","body":workBill,"path":"/gascsrworkbill/","method":"POST"})
		}
		$.ajax({
	        type: 'POST',
	        url:  "/hzqs/dbc/pbtxs.do?fh=SELDBC0000000J00&resp=bd",
	        dataType: 'json',
	        contentType: "application/json; charset=utf-8",
	        async: false,
	        isMask: true,
	        data: JSON.stringify(submitJson),
	        success: function(data) {
	        	var retFlag = true;
	            for(var i=0;i<data.results.length;i++){
		            if(!data.results[i].result.success){
		                retFlag=false;
		                break;
		            }
		        }
	            if(retFlag){
			        bootbox.alert("<center><h4>提交成功</h4></center>",function(){
			            window.location.reload();
			        });
	            }else{
	            	bootbox.alert("<center><h4>提交失败</h4></center>");
	            }
	        },
	        error: function(err) {
	            bootbox.alert("<center><h4>提交失败</h4></center>");
	            if( err.status==406){
	                //need to login
	                if(window.location.pathname.indexOf('/login.html')<0)
	                {
	                    window.location.replace("/login.html?redirect="+window.location.pathname);
	                }
	            }
	        }
	    });

    }else{
        bootbox.alert("客户不存在");
    }
});

$("#changeMeter").change(function(){
	if($("#changeMeter").val()==0){
		$("#unid_id").hide();
	}else if($("#changeMeter").val()==1){
		$("#unid_id").show();
	}
})

$("#customerCode").blur(function(){
	var customerCode = $("#customerCode").val();
	var ctmArchiveData = Restful.findNQ(hzq_rest+'gasctmarchive?query={"customerCode":"'+customerCode+'"}');
	if(ctmArchiveData&&ctmArchiveData.length>0){
		var ctmArchive = ctmArchiveData[0];
		var xwQuery = RQLBuilder.and([
			RQLBuilder.equal("ctmArchiveId", ctmArchive.ctmArchiveId),
			RQLBuilder.equal("meterUserState", "01")
		]).rql();
		var ctmMeterData = Restful.findNQ(hzq_rest+'gasctmmeter?query='+xwQuery);
		if(ctmMeterData&&ctmMeterData.length>0){
			var ctmMeter = ctmMeterData[0];
			var meter = Restful.getByID(hzq_rest+'gasmtrmeter',ctmMeter.meterId);
			if(meter){
				$.each(meter, function(key,val) {
	            	$("form[name='oldMeterForm'] input[name='"+key+"']").val(val);
	            	$("form[name='oldMeterForm'] select[name='"+key+"']").val(val).trigger("change");
	            });
			}else{
				$("#save_btn").addClass("disabled");
				bootbox.alert("<center><h4>系统无此关联的表具信息</h4></center>");	
			}
		}else{
			$("#save_btn").addClass("disabled");
			bootbox.alert("<center><h4>该档案没有关联表具关系</h4></center>");	
		}
	}else{
		$("#save_btn").addClass("disabled");
		bootbox.alert("<center><h4>客户档案不存在</h4></center>");
	}
})
