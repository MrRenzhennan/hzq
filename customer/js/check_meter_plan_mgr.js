SideBar.init();
SideBar.activeCurByPage("check_meter_plan_mgr.html");
var areaHelper = RefHelper.create({
    ref_url: "gasbizarea",
    ref_col: "areaId",
    ref_display: "areaName"
});
var areaFormat= function () {
    return {
        f: function (val) {
            return areaHelper.getDisplay(val);
        },
    }
}();
var planStatus={"1":"计划拟定中","2":"计划审核中","3":"计划已驳回","4":"计划制定完成"}
$.map(planStatus,function(key,val){
	$('#find_status').append('<option value="' + val + '">' + key + '</option>');
})
var planStatusFormat= function () {
    return {
        f: function (val) {
            return planStatus[val];
        },
    }
}();

var btnFormat= function () {
    return {
        f: function (val,row) {
        	var retStr='<a class="pull-left btn btn-sm btn-circle blue" data-toggle="modal" href="customer/check_meter_plan_excute.html?param='+row.checkPlanId+'">详情</a> ';
        	if(row.status==1){
        		retStr+=('<a class="pull-left btn btn-sm btn-circle blue" data-toggle="modal" href="customer/check_meter_plan_detail.html?param='+row.checkPlanId+'">拟定</a> ');
        	}else if(row.status==4){
        		retStr+=('<a class="pull-left btn btn-sm btn-circle blue" data-toggle="modal" href="customer/check_meter_plan_change.html?param='+row.checkPlanId+'">变更</a> ');
        	}
            return retStr;
        },
    }
}();
var meterPlanAction = function () {
    return {
        init: function () {
        	this.initData();
            this.reload();
        },
        initData: function () {
        	
        	var areas=new Array();
        	var areaId = UserInfo.init().area_id;
        	if(areaId==1){
        		var areaData = Restful.getByID(hzq_rest+"gasbizarea",areaId);
				console.log(areaData)
				$('#find_area').append('<option value="' + areaData.areaId + '">' + areaData.areaName + '</option>');
				var xwQuery = RQLBuilder.and([
				    RQLBuilder.equal("parentAreaId", areaId),RQLBuilder.equal("status","1")
				]).rql();
				$.ajax({
					headers: {
				      'Accept': 'application/json',
				      'Content-Type': 'application/json'
					},
					type: 'get',
					async: false,
					url: hzq_rest+"gasbizarea?query="+xwQuery,
					success: function (data) {
						for(var i=0;i<data.length;i++){
							areas.push(data[i].areaId);
							if(data[i].areaId!=23){
								$('#checkArea').append('<option  value="' + data[i].areaId + '">' + data[i].areaName + '</option>');
								$('#find_area').append('<option  value="' + data[i].areaId + '">' + data[i].areaName + '</option>');
							}
						}
				    } 
				})
        	}
        	
        	$(document).on('click','#submit_btn',function(){
        		var checkArea = $('#checkArea').val();
        		var checkYear = $('#checkYear').val();
        		var checkCount = $('#checkCount').val();
        		var remark = $('#remark').val();
        		var xwQuery = RQLBuilder.and([
				    RQLBuilder.equal("areaId",checkArea),RQLBuilder.equal("checkYear",checkYear)
				]).rql();	
				var checkPlanData = Restful.findNQ(hzq_rest+'gasmtrcheckplan?query='+xwQuery);
				if(checkPlanData&&checkPlanData.length>0){
					bootbox.alert("<center><h4>"+areaHelper.getDisplay(checkArea)+"已创建"+checkYear+"年度检表计划</h4></center>");
					return;
				}
        		var param={
        			"areaId":checkArea,
        			"checkYear":checkYear,
        			"checkCount":checkCount,
        			"createdBy":UserInfo.userId(),
        			"createdTime":new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00"),
        			"modifiedBy":UserInfo.userId(),
        			"modifiedTime":new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00"),
        			"remark":remark,
        			"status":"1",
        			"reservedField1":"0"
        		}
        		if(checkArea=="1"){
        			param.status="4";
        		}
        		
        		Restful.insert(hzq_rest+'gasmtrcheckplan',param);
        		bootbox.alert("<center><h4>提交成功</h4></center>",function(){
		            window.location.reload();
		        });
        	})
			
        },
        reload: function () {
            $('#divtable').html('');
//          select a.*,round(a.reserved_field1/a.check_count,4)*100||'%' as point from gas_mtr_check_plan a
            var paramurl = "/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd&bd=";
			var wheres="";
			
			var queryUr;
			if(UserInfo.init().area_id!=1){
				wheres="a.area_id='"+UserInfo.init().area_id+"'";
			}
			var params = {
				"cols": "a.*,round(a.reserved_field1/a.check_count,4)*100||'%' as point",
				"froms": "gas_mtr_check_plan a",
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
//                  restbase: queryUr,
                    key_column: "checkPlanId",
                    //---------------行定义
                    coldefs: [
                        {
                            col: "checkPlanId",
                            friendly: "计划id",
                            unique: true,
                            hidden:true,
                            readonly: "readonly",
                            sorting: false,
                            index: 1
                        },
                        {
                            col: "areaId",
                            friendly: "检表单位",
                            unique: true,
                            readonly: "readonly",
                            format:areaFormat,
                            sorting: false,
                            index: 2
                        },
                        {
                            col: "checkYear",
                            friendly: "检表年份",
                            sorting: false,
                            index: 3
                        },
                        {
                            col: "checkCount",
                            friendly: "检表数量",
                            sorting: false,
                            index: 4
                        },
                        {
                            col: "refuseReason",
                            friendly: "审批意见",
                            sorting: false,
                            index: 5
                        },
                        {
                            col: "status",
                            friendly: "状态",
                            sorting: false,
                            format:planStatusFormat,
                            index: 6
                        },
                        {
                            col: "remark",
                            friendly: "备注",
                            sorting: false,
                            index: 7
                        },
                        {
                            col: "point",
                            friendly: "完成率",
                            sorting: false,
                            index: 7
                        },
                        {
                            col: "modifiedTime",
                            friendly: "操作",
                            sorting: false,
                            format:btnFormat,
                            index: 8
                        }
                    ],
                    // 查询过滤条件
                    findFilter: function () {
                    	if(!$('#find_area').val()){
                    		bootbox.alert("<center><h4>请选择检表单位</h4></center><br>");
    						return;
                    	}
						var wheres2="1=1";
                    	
                        if($('#find_area').val()!=1){
                            wheres2=" and a.area_id='"+$('#find_area').val()+"'";
                        }
                        if ($('#find_year').val()) {
                        	wheres2=" and a.check_year='"+$('#find_year').val()+"'";
                        }
                        if ($('#find_status').val()) {
                        	wheres2=" and a.status='"+$('#find_status').val()+"'";
                        }
                        
                        var params2 = {
							"cols": "a.*,round(a.reserved_field1/a.check_count,4)*100||'%' as point",
							"froms": "gas_mtr_check_plan a",
							"wheres": wheres2,
							"page": true,
							"limit": 50
						}
                        
				        xw.setRestURL(paramurl+encodeURIComponent(JSON.stringify(params2)));
				        return  "";
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
