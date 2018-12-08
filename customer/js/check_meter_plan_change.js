//SideBar.init();
//SideBar.activeCurByPage("check_meter_plan_mgr.html");
var checkPlanId = Metronic.getURLParameter("param");
var factoryHelper = RefHelper.create({
    ref_url: "gasmtrfactory",
    ref_col: "factoryId",
    ref_display: "factoryName"
});
$.map(factoryHelper.getData(), function(key,val) {
	$('#find_factory').append('<option value="'+val+'">'+key+'</option>');
});
var factoryFormat= function () {
    return {
        f: function (val) {
            return factoryHelper.getDisplay(val);
        },
    }
}();
var modelHelper = RefHelper.create({
    ref_url: "gasmtrmeterspec",
    ref_col: "meterModelId",
    ref_display: "meterModelName"
});
$.map(modelHelper.getData(), function(key,val) {
	$('#find_model').append('<option value="'+val+'">'+key+'</option>');
});
var modelFormat= function () {
    return {
        f: function (val) {
            return modelHelper.getDisplay(val);
        },
    }
}();
var typeHelper = RefHelper.create({
    ref_url: "gasmtrmetertype",
    ref_col: "meterTypeId",
    ref_display: "meterTypeName"
});
$.map(typeHelper.getData(), function(key,val) {
	$('#find_type').append('<option value="'+val+'">'+key+'</option>');
});
var typeFormat= function () {
    return {
        f: function (val) {
            return typeHelper.getDisplay(val);
        },
    }
}();

var detailedInfoFormat =function(){
    return{
        f:function(val,row){
            return "<a id='"+val+"' class='addmeter' data-rows='"+JSON.stringify(row)+"'>添加</a>"
        }
    }
}()
    
var MeterPlanDetailAction = function () {
    //用气类型
    
    return {
        init: function () {
//          this.initHelper();
            this.reload();
        },
        reload: function () {
        	
			var checkPlan = Restful.getByID(hzq_rest+"gasmtrcheckplan",checkPlanId);			
			$("#checkCount").val(checkPlan.checkCount)
			$("#checkYear").val(checkPlan.checkYear)
			$("#areaId").val(checkPlan.areaId)
			$("#remark").val(checkPlan.remark)
        	$('#divtable').html('');
            
            var paramurl = "/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd&bd=";
            
            var dparams = {
				"cols": "a.*,b.meter_no,b.factory_id,b.meter_type_id,b.meter_model_id",
				"froms": "gas_mtr_check_plan_detail a left join gas_mtr_meter b on a.meter_id=b.meter_id",
				"wheres": "a.check_plan_id='"+checkPlanId+"'",
				"page": true,
				"limit": 50
			}
            var checkPlanDetails = Restful.insert(paramurl,dparams);
            console.log(checkPlanDetails)
            $.each(checkPlanDetails.rows, function(key,val) {
            	var tabletbody = "";
			    tabletbody += "<tr id='"+val.meterId+"' name='trMeterId'>" +
			    "<td width='15px' class=''><span class=''><input name='meterId' type='hidden'  class='form-control' readonly value='"+val.checkPlanDetailId+"'></span></td>" +
			    "<td><input name='customerCode' type='text'  class='form-control' readonly value='"+val.customerCode+"'></td>" +
			    "<td><input name='meterNo' type='text'  class='form-control' readonly value='"+val.meterNo+"'></td>" +
			    "<td><input name='factoryId' type='text'  class='form-control' readonly value='"+factoryHelper.getDisplay(val.factoryId)+"'></td>" +
			    "<td><input name='meterModelId' type='text'  class='form-control' readonly value='"+modelHelper.getDisplay(val.meterModelId)+"'></td>" +
			    "<td><input name='meterTypeId' type='text'  class='form-control' readonly value='"+typeHelper.getDisplay(val.meterTypeId)+"'></td>";
			    if(val.checkType==1){
			    	tabletbody+="<td><select name='checkType' type='select' class='form-control'><option value='1' selected>计划内</option><option value='2'>计划外</option></select></td>";
			    }else{
			    	tabletbody+="<td><select name='checkType' type='select' class='form-control'><option value='1' >计划内</option><option value='2' selected>计划外</option></select></td>";
			    }
			    tabletbody+="<td><input name='checkInst' type='hidden'  class='form-control' readonly value='0'></td>"+
			    "</tr>";
			    
			    $('#tbody2').append(tabletbody);
            });
            var wheres = "b.meter_user_state ='01' and a.customer_kind='9' and a.area_id='"+UserInfo.init().area_id+"'";
			var params = {
				"cols": "c.meter_id,a.customer_code,c.meter_no,c.factory_id,c.meter_model_id,c.meter_type_id",
				"froms": "gas_ctm_archive a left join gas_ctm_meter b on a.ctm_archive_id=b.ctm_archive_id left join gas_mtr_meter c on b.meter_id=c.meter_id",
				"wheres": wheres,
				"page": true,
				"limit": 50
			}
			
            xw = XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize: 10, 			//Initial pagesize
                    columnPicker: true,         //Show the columnPicker button
                    sorting: true,
                    transition: 'fade',  //(bounce, fade, flip, rotate, scroll, slide).
                    checkboxes: false,           //Make rows checkable. (Note. You need a column with the 'unique' property)
                    checkAllToggle: false,        //Show the check-all toggle//+RQLBuilder.like("KEYY", "a").rql()
                    //----------------基本restful地址---
                    restURL: paramurl+encodeURIComponent(JSON.stringify(params)),
//                  restbase: 'gasmtrcheckplan',
                    key_column: "meterId",
                    //---------------行定义
                    coldefs: [
                        {
                            col: "customerCode",
                            friendly: "客户号",
                            unique: true,
                            readonly: "readonly",
                            sorting: false,
                            index: 2
                        },
                        {
                            col: "meterNo",
                            friendly: "表编号",
                            sorting: false,
                            index: 3
                        },
                        {
                            col: "factoryId",
                            friendly: "生产厂家",
                            sorting: false,
                            format:factoryFormat,
                            index: 4
                        },
                        {
                            col: "meterModelId",
                            friendly: "规格型号",
                            sorting: false,
                            format:modelFormat,
                            index: 5
                        },
                        {
                            col: "meterTypeId",
                            friendly: "表类型",
                            sorting: false,
                            format:typeFormat,
                            index: 6
                        },
                        {
                            col: "meterId",
                            friendly: "操作",
                            sorting: false,
                            format:detailedInfoFormat,
                            index: 8
                        }
                    ],
                    // 查询过滤条件
                    findFilter: function () {
                    	var wheres2="b.meter_user_state ='01' and a.customer_kind='9' and a.area_id='"+UserInfo.init().area_id+"'";
                    	var params2 = {
							"cols": "c.meter_id,a.customer_code,c.meter_no,c.factory_id,c.meter_model_id,c.meter_type_id",
							"froms": "gas_ctm_archive a left join gas_ctm_meter b on a.ctm_archive_id=b.ctm_archive_id left join gas_mtr_meter c on b.meter_id=c.meter_id",
							"wheres": wheres2,
							"page": true,
							"limit": 50
						}
                        if($('#find_customerCode').val()){
                        	params2.wheres+=(" and a.customer_code='"+$('#find_customerCode').val()+"'");
                        }
                        if($('#find_meterNo').val()){
                        	params2.wheres+=(" and c.meter_no='"+$('#find_meterNo').val()+"'");
                        }
                        if ($('#find_factory').val()) {
                        	params2.wheres+=(" and c.factory_id='"+$('#find_factory').val()+"'");
                        }
                        if ($('#find_model').val()) {
                        	params2.wheres+=(" and c.meter_model_id='"+$('#find_model').val()+"'");
                        }
                        if ($('#find_type').val()) {
                        	params2.wheres+=(" and c.meter_type_id='"+$('#find_type').val()+"'");
                        }
                        
				        xw.setRestURL(paramurl+encodeURIComponent(JSON.stringify(params2)));
                    	return "";
                    },

                    onAdded: function (ret, jsondata) {

                    },

                    onUpdated: function (ret, jsondata) {

                    },

                    onDeleted: function (ret, jsondata) {
                    },
                }//--init
            );//--end init
        }

    }

}();

var addData= new Array();
$(document).on("click",".addmeter",function(){
    var rowsinfo = JSON.parse($(this).attr("data-rows"));
    var meterNo =rowsinfo.meterNo;
    var meterNoInput=document.getElementsByName("meterNo");
    if(meterNoInput.length != 0){
        var meterNoArr=[];
        $.each(meterNoInput, function (indx,val) {
            meterNoArr.push(val.value);
        })
        if($.inArray(meterNo, meterNoArr) != -1){
            bootbox.alert("<br><center><h4>不能重复添加同一个表！</h4></center><br>");
            return false;
        }
    }
    var break_status = false;
    var tabletbody = "";
    tabletbody += "<tr id='"+rowsinfo.meterId+"' name='trMeterId'>" +
    "<td width='15px' class='remove_item'><span class='glyphicon glyphicon-remove'><input name='meterId' type='hidden'  class='form-control' readonly value='"+rowsinfo.meterId+"'></span></td>" +
    "<td><input name='customerCode' type='text'  class='form-control' readonly value='"+rowsinfo.customerCode+"'></td>" +
    "<td><input name='meterNo' type='text'  class='form-control' readonly value='"+rowsinfo.meterNo+"'></td>" +
    "<td><input name='factoryId' type='text'  class='form-control' readonly value='"+factoryHelper.getDisplay(rowsinfo.factoryId)+"'></td>" +
    "<td><input name='meterModelId' type='text'  class='form-control' readonly value='"+modelHelper.getDisplay(rowsinfo.meterModelId)+"'></td>" +
    "<td><input name='meterTypeId' type='text'  class='form-control' readonly value='"+typeHelper.getDisplay(rowsinfo.meterTypeId)+"'></td>" +
    "<td><select name='checkType' type='select' class='form-control'><option value='1' selected>计划内</option><option value='2'>计划外</option></select></td>" +
    "<td><input name='checkInst' type='hidden'  class='form-control' readonly value='1'></td>" +
    "</tr>";
    
    $('#tbody2').append(tabletbody);
    
})
$(document).on("click",".remove_item",function () {
    $(this).parent().remove();
});

$('#submit_btn2').click(function () {
    $(this).button('loading');
    var factoryIds = "";
    var meterModelIds ="";
    var directions="";
    var substate = false;
    var checkCount = $("#checkCount").val();
    var checkTypes=document.getElementsByName("checkType");
//  if(checkTypes.length > 0){
//      var num=0;
//      $.each(checkTypes, function (indx,val) {
//      	if(val.value=="1"){
//      		num++;
//      	}
//      })
//      if(num!=checkCount){
//      	bootbox.alert("<br><center><h4>计划内检表数不等于检表计划检表数量</h4></center><br>");
//          $("#submit_btn2").button('reset');
//          return;
//      }
//  }else{
//  	bootbox.alert("<br><center><h4>请添加检表明细</h4></center><br>");
//  	$("#submit_btn2").button('reset');
//  	return;
//  }
    
    //获取明细列表
    var trMeterIds=document.getElementsByName("trMeterId");
    
    var planDetails = [];
    var planDetails2 = [];
    var checkPlanDetailIds = [];
    var checkPlanDetailIds2 = [];
    $.each(trMeterIds,function(ind,item){
    	var td=item.children;
    	var meterId=td[0].children[0].children[0].value;
    	var customerCode=td[1].children[0].value;
    	var checkType=td[6].children[0].value;
    	var checkInst=td[7].children[0].value;
    	console.log(meterId);
    	console.log(checkType);
    	if(checkInst==0){
    		var planDetail = {
	    		"checkPlanDetailId":meterId,
	    		"checkType":checkType,
	            "modifiedTime":new Date(new Date()+"-00:00"),
	            "modifiedBy":UserInfo.userId(),
	    	}
	    	planDetails2.push(planDetail);
	    	checkPlanDetailIds2.push(checkPlanDetailId)
    	}else if(checkInst==1){
    		var planDetail = {
	    		"checkPlanId":checkPlanId,
	    		"meterId":meterId,
	    		"checkType":checkType,
	    		"createdTime":new Date(new Date()+"-00:00"),
	            "createdBy":UserInfo.userId(),
	            "modifiedTime":new Date(new Date()+"-00:00"),
	            "modifiedBy":UserInfo.userId(),
	            "status":"1",
	            "checkState":"0",
	            "customerCode":customerCode
	    	}
	    	var checkPlanDetailId = $.md5(JSON.stringify(planDetail)+new Date().getTime());
	    	planDetail.checkPlanDetailId = checkPlanDetailId;
	    	planDetails.push(planDetail);
	    	checkPlanDetailIds.push(checkPlanDetailId)
    	}
    	
    })
    
    var flowInstId = $.md5(JSON.stringify(planDetails)+new Date().getTime());
    var flowInfo={
            "checkPlanId":checkPlanId,
        };
    //创建流程
    var flowJson = {
        "flow_def_id":"JBJHC",
        "ref_no":flowInstId,
        "operator":UserInfo.userId(),
        "be_orgs":UserInfo.init().area_id,
        "flow_inst_id":flowInstId,
        "prop1str64":moment().format("YYYY-MM-DD HH:mm:ss"),
        "prop2str64":"检表计划变更申请",
        "propstr128":"检表计划变更申请计量中心",
        "propstr2048":flowInfo,
        "override_exists":false
    }
	var checkPlanParam={
		"status":"2",
		"modifiedTime":new Date(new Date()+"-00:00"),
		"modifiedBy":UserInfo.userId(),
		"flowInstId":flowInstId
	}

    var submitJson = {"sets":[
        {"txid":"1","body":checkPlanParam,"path":"/gasmtrcheckplan/"+checkPlanId,"method":"PUT"},
        {"txid":"2","body":planDetails,"path":"/gasmtrcheckplandetail/","method":"POST"},
        {"txid":"3","body":planDetails2,"path":"/gasmtrcheckplandetail/","method":"PUT"}
    ]};

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
                var flow_result = Restful.insert("/hzqs/psm/pbisn.do?fh=VFLSCGC000000J00&bd={}&resp=bd",flowJson)
                console.log(flow_result)
                if(flow_result.retmsg == "SUCCESS:1"){
                    bootbox.alert("<center><h4>提交成功</h4></center>",function(){
                        $("#submit_btn2").button('reset');
                        window.location.replace("/customer/check_meter_plan_mgr.html");
                    });
                }else{
                    var submitJsons = {"sets":[
                        {"txid":"1","body":{"status":"1","reservedField1":"","modifiedTime":new Date(new Date()+"-00:00"),"modifiedBy":UserInfo.userId()},"path":"/gasmtrcheckplan/"+checkPlanId,"method":"PUT"},
                        {"txid":"2","body":"{}","path":"/gasmtrcheckplandetail/"+checkPlanDetailIds.join(),"method":"DELETE"},
                    ]};
                    var resultss = Restful.insert("/hzqs/dbc/pbtxs.do?fh=SELDBC0000000J00&resp=bd",submitJsons)

                    bootbox.alert("提交失败",function(){
                        $("#submit_btn2").button('reset');
                        window.location.replace("/customer/check_meter_plan_mgr.html");
                    })
                }
                
            }else{
                bootbox.alert("<center><h4>提交失败</h4></center>",function(){
                    $("#submit_btn2").button('reset');
                });
                
            }
        },
        error: function(err) {
            bootbox.alert("<center><h4>提交失败</h4></center>",function(){
                $("#submit_btn2").button('reset');
            });
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