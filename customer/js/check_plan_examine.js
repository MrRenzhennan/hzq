//SideBar.init();
//SideBar.activeCurByPage("check_meter_plan_mgr.html");
var refno = Metronic.getURLParameter("refno");
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
	        return "<a id='"+val+"' class='querymeter' data-rows='"+JSON.stringify(row)+"' data-toggle='modal' href='#query_modal'>查看详情</a>";
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
        	
			var checkPlanData = Restful.findNQ(hzq_rest+'gasmtrcheckplan?query={"flowInstId":"'+refno+'"}');
			if(checkPlanData&&checkPlanData.length>0){
				checkPlan=checkPlanData[0];
			}
			$("#checkCount").val(checkPlan.checkCount)
			$("#checkYear").val(checkPlan.checkYear)
			$("#areaId").val(checkPlan.areaId)
			$("#remark").val(checkPlan.remark)
        	$('#divtable').html('');
            
            var paramurl = "/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd&bd=";
			
			
			var params = {
				"cols": "b.check_plan_detail_id,b.check_type,b.check_state,b.customer_code,c.meter_id,c.meter_no,c.factory_id,c.meter_model_id,c.meter_type_id,c.last_check_date",
				"froms": "gas_mtr_check_plan a left join gas_mtr_check_plan_detail b on a.check_plan_id=b.check_plan_id left join gas_mtr_meter c on b.meter_id=c.meter_id",
				"wheres": "a.check_plan_id='"+checkPlan.checkPlanId+"'",
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
                            col: "lastCheckDate",
                            friendly: "上次检表时间",
                            sorting: false,
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
$(document).on("click",".querymeter",function(){
	//1、更新检表计划详情状态为实施中
	//2、创建工单，并直接分配部门
    var rows = JSON.parse($(this).attr("data-rows"));
    console.log(rows)
//  var meterNo =rows.meterNo;
	$("#meterTypeId").val(typeHelper.getDisplay(rows.meterTypeId));
	$("#meterModelId").val(modelHelper.getDisplay(rows.meterModelId));
	$("#factoryId").val(factoryHelper.getDisplay(rows.factoryId));
	$("#meterNo").val(rows.meterNo);
	$("#customerCode").val(rows.customerCode);
	$("#checkType").val(checkTypeEmnu[rows.checkType]);
	$("#lastMeterDate").val(rows.lastMeterDate);
	var meterId=rows.meterId;
	var customerCode=rows.customerCode;
	var ctmArchiveData = Restful.findNQ(hzq_rest+'gasctmarchive?query={"customerCode":"'+customerCode+'"}');
	var ctmArchive=ctmArchiveData[0];
	$("#customerName").val(ctmArchive.customerName);
	$("#customerAddress").val(ctmArchive.customerAddress);
})

var doBusi = function(step){
    checkPlan.modifiedTime = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
    checkPlan.modifiedBy = UserInfo.userId();
    checkPlan.status = (step.results==0?"4":"3");
    var ret = Restful.update(hzq_rest+"/gasmtrcheckplan",checkPlan.checkPlanId,checkPlan);
}
