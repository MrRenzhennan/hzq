//SideBar.init();
//SideBar.activeCurByPage("check_meter_plan_mgr.html");
var checkPlanId = Metronic.getURLParameter("param");
var checkPlan;
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

var checkTypeEmnu={"1":"计划内","2":"计划外"};

var checkStateNmnu={"0":"未检","1":"准备送检","2":"送检中","3":"准备回装","4":"检测完成"}
var checkStateFormat= function () {
    return {
        f: function (val) {
            return checkStateNmnu[val];
        },
    }
}();



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
        	var state = row.checkState;
        	if(checkPlan.status=="4"){
        		if(state=="0"){
	        		return "<a id='"+val+"' class='addmeter' data-rows='"+JSON.stringify(row)+"' data-toggle='modal' href='#allot'>送检</a>";
	        	}else if(state=="2"){
	        		return "<a id='"+val+"' class='addmeter' data-rows='"+JSON.stringify(row)+"' data-toggle='modal' href='#allot'>回装</a>";
	        	}else{
	        		return "";
	        	}
        	}else{
        		return "";
        	}
        }
    }
}()
    
var MeterPlanDetailAction = function () {
    //用气类型
    
    return {
        init: function () {
            this.initHelper();
            this.reload();
        },
        initHelper: function () {
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
					var obj = $("#select_unit")
					var sHtmlTest = "";  
					for(var o in data.rows){
					    var listText = data.rows[o].unitName;  
					    var listValue = data.rows[o].unitId;  
					    sHtmlTest+="<option value='" + listValue + "'>" + listText + "</option>";
					    
					}  
					obj.append(sHtmlTest); 
			    } 
			})
        },
        reload: function () {
        	
			checkPlan = Restful.getByID(hzq_rest+"gasmtrcheckplan",checkPlanId);			
			$("#checkCount").val(checkPlan.checkCount)
			$("#checkYear").val(checkPlan.checkYear)
			$("#areaId").val(checkPlan.areaId)
			$("#remark").val(checkPlan.remark)
        	$('#divtable').html('');
            
            var paramurl = "/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd&bd=";
			
			
			var params = {
				"cols": "b.check_plan_detail_id,b.check_type,b.check_state,b.customer_code,c.meter_id,c.meter_no,c.factory_id,c.meter_model_id,c.meter_type_id",
				"froms": "gas_mtr_check_plan a left join gas_mtr_check_plan_detail b on a.check_plan_id=b.check_plan_id left join gas_mtr_meter c on b.meter_id=c.meter_id",
				"wheres": "a.check_plan_id='"+checkPlanId+"'",
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
                    key_column: "checkPlanDetailId",
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
                            col: "checkType",
                            friendly: "检表类型",
                            sorting: false,
                            format: {
						        f: function (val) {
						            return checkTypeEmnu[val];
						        },
						    },
                            index: 7
                        },
                        {
                            col: "checkState",
                            friendly: "检表状态",
                            sorting: false,
                            format:checkStateFormat,
                            index: 8
                        },
                        {
                            col: "checkPlanDetailId",
                            friendly: "操作",
                            sorting: false,
                            format:detailedInfoFormat,
                            index: 9
                        }
                    ],
                    // 查询过滤条件
                    findFilter: function () {
                    	var params2 = {
							"cols": "c.meter_id,a.customer_code,c.meter_no,c.factory_id,c.meter_model_id,c.meter_type_id",
							"froms": "gas_ctm_archive a left join gas_ctm_meter b on a.ctm_archive_id=b.ctm_archive_id left join gas_mtr_meter c on b.meter_id=c.meter_id",
							"wheres": "b.meter_user_state ='01' and a.area_id='18'",
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
var rowsinfo;
$(document).on("click",".addmeter",function(){
	//1、更新检表计划详情状态为实施中
	//2、创建工单，并直接分配部门
    rowsinfo = JSON.parse($(this).attr("data-rows"));
})
$(document).on("click","#agree_btn",function(){
	
	var unit = $("#select_unit").val();
	if(!unit){
		bootbox.alert("<center><h4>请选择所要分配的部门</h4></center>");
		return;
	}
	//1、更新检表计划详情状态为实施中
	var checkPlanDetailId = rowsinfo.checkPlanDetailId;
	var checkPlanDetail = Restful.getByID(hzq_rest+'gasmtrcheckplandetail',checkPlanDetailId);
	if(checkPlanDetail){
		checkPlanDetail.modifiedBy=UserInfo.userId();
		checkPlanDetail.modifiedTime=new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
		if(checkPlanDetail.checkState=='0'){
			checkPlanDetail.checkState='1';
		}else if(checkPlanDetail.checkState=='2'){
			checkPlanDetail.checkState='3';
		}
		
	}
	console.log(checkPlanDetail)
	//2、创建工单，并直接分配部门
	var customerCode=rowsinfo.customerCode;
	var archiveData=Restful.findNQ(hzq_rest+'gasctmarchive?query={"customerCode":"'+customerCode+'"}');
	var ctmArchive;
	if(archiveData&&archiveData.length>0){
		ctmArchive=archiveData[0];
	}else{
		bootbox.alert("档案信息错误")
		return;
	}
	
	var workBill={
		"areaId":ctmArchive.areaId,
		"ownUnit":unit,
		"billState":"1",
		"billType":"WB_CHANGEM",
		"customerCode":ctmArchive.customerCode,
		"customerName":ctmArchive.customerName,
		"customerAddress":ctmArchive.customerAddress,
		"isBatch":"2",
		"batchId":checkPlanDetailId,
		"createdBy":UserInfo.userId(),
        "modifiedBy":UserInfo.userId(),
        "createdTime":new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00"),
        "modifiedTime":new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00"),
        "bizName": "CHANGEMT",
        "contractName":ctmArchive.customerName,
        "phone":ctmArchive.customerTel,
	}
	var workBillId = $.md5(JSON.stringify(workBill)+new Date().getTime());
	workBill.workBillId=workBillId;
	workBill.billCode=workBillId;
	
	var submitJson = {"sets":[
        {"txid":"1","body":checkPlanDetail,"path":"/gasmtrcheckplandetail/","method":"PUT"},
        {"txid":"2","body":workBill,"path":"/gascsrworkbill/","method":"POST"}
	]}
	
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
})