/**
 * Created by alex on 2017/4/19.
 */
var userinfo = JSON.parse(localStorage.getItem('user_info'));
var areaId;
var areas = new Array();
var openBach =  function(bId,bCode,cName,bName,bType){
	$('#wbid').val(bId);
    $('#sldh').val(bCode);
    $('#khmc').val(cName);
    $('#ywmc').val(bName);
    $('#gdlx').val(bType);
	var paramurl = "/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd";
	var param = {
		"cols":"unit_id,unit_name",
      	"froms":"gas_sys_unit",
      	"wheres":"status=1 and area_id in ("+areas+") order by unit_id",
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
			var obj = $("#find_status")
			var sHtmlTest = "";  
			for(var o in data.rows){
			    var listText = data.rows[o].unitName;  
			    var listValue = data.rows[o].unitId;  
			    sHtmlTest+="<option value='" + listValue + "'>" + listText + "</option>";
			    
			}  
			obj.append(sHtmlTest); 
	    } 
	})
};
//分配
$("#agree_btn").click(function(){
	var workBillId=$("#wbid").val();
	var ownUnit=$("#find_status").val();
	console.log(ownUnit)
	var param={
		"ownUnit":ownUnit,
		"billState":"1",
		"modifiedTime":new Date(),
		"modifiedBy":userinfo.userId
	}
	$.ajax({
		headers: {
	      'Accept': 'application/json',
	      'Content-Type': 'application/json'
		},
		async: false,
		type: 'PUT',
		data : JSON.stringify(param),
		url: hzq_rest+"gascsrworkbill/"+workBillId,
		success: function (data) {
			console.log(data)
			if(data.retcode==-1){
				// parent.location.reload();
                business_dispatchingAction.init()
			}
	    } 
	})
	
	
	
})

function setStartEnd(startdiff,timed){
    $('#find_fromtime').val(moment().add(startdiff,timed).format('YYYY-MM-DD'))
    $('#find_totime').val(moment().format('YYYY-MM-DD'));
}
$('#find_today_sign').on('click',function(e){setStartEnd(0,'d')})
$('#find_this_week_sign').on('click',function(e){setStartEnd(-7,'d')})
$('#find_this_month_sign').on('click',function(e){setStartEnd(-1,'M')})
$('#find_three_month_sign').on('click',function(e){setStartEnd(-3,'M')})
$('#find_this_year_sign').on('click',function(e){setStartEnd(-1,'y')})
$('#find_anyway_sign').on('click',function(e){
        $('#find_fromtime').val("");
        $('#find_totime').val("");
})
// ComponentsPickers.init();
var billTypeEnum = {"WB_LSKS":"零散开栓","WB_HBKS":"换表开栓","WB_CHANGEM":"用户换表","WB_ZJV":"增减容","WB_STOPG":"暂停用气","WB_STOPGCB":"暂停用气拆表","WB_REUSEG":"重新用气","WB_REUSEGZB":"重新用气装表","WB_CHANGEGTM":"用气性质变更换表","WB_CHANGEGT":"用气性质变更","REMOVEM":"拆除"};
$.map(billTypeEnum, function (key, val) {
	$('#find_billtype').append('<option  value="' + val + '">' + key + '</option>');
});
var billTypeFormat= function () {
    return {
        f: function (val) {
            return billTypeEnum[val];
        },
    }
}();
var billStateEnum = {"0":"未分配","1":"已分配","2":"已派工","3":"已完成","4":"已审核","6":"审批中","7":"已驳回","8":"已打印","9":"已作废"};
var billStateFormat= function () {
    return {
        f: function (val) {
            return billStateEnum[val];
        },
    }
}();
var business_dispatchingAction = function () {
    var businessTypeHelper = RefHelper.create({
        ref_url: "gascsrbusinesstype",
        ref_col: "businessTypeId",
        ref_display: "name"
    });
    var businessTypeFormat= function () {
        return {
            f: function (val) {
                return businessTypeHelper.getDisplay(val);
            },
        }
    }();
    
    var detailedInfoFormat = function () {
        return {
            f: function (val,row){
            	var bId =row.workBillId;
                var bCode =row.billCode;
                var cName =row.customerName;
                var  bName = row.bizName;
                var bType =row.billType;
                var bState =row.billState;
                if(bState==0){
                	return '<a class="pull-right btn btn-sm btn-circle blue" data-toggle="modal" href="#allot" onclick="openBach(\''+bId+'\',\''+bCode+'\',\''+cName+'\',\''+bName+'\',\''+bType+'\');">分派</a> '
                }else{
                	return ''
                }
                //return '<a id="todetail" href="customer/inhabitant_open_bolt_detail.html?' + val + '">详情</a>';
                
            }
        }
    }();
    return {
        init: function () {
            
            this.reload();
        },
         
        reload: function () {
        	areaId=userinfo.area_id;
			areas.push(areaId)
			//查询areaId下级areaId
			$.ajax({
				headers: {
			      'Accept': 'application/json',
			      'Content-Type': 'application/json'
				},
				type: 'get',
				async: false,
				url: hzq_rest+"gasbizarea?query={\"parentAreaId\":\""+areaId+"\"}",
				success: function (data) {
					for(var i=0;i<data.length;i++){
						areas.push(data[i].areaId);
					}
			    } 
			})
            $('#divtable').html('');
//          query={"areaId":{"$in":'+JSON.stringify(areas)+'}}'
//          var xwQuery = RQLBuilder.and([
//			    RQLBuilder.in("areaId",areas)
//			]).rql();
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
                    restbase: 'gascsrworkbill/?sort=billState&query={"areaId":{"$in":'+JSON.stringify(areas)+'}}',
                    key_column: "workBillId",
                    //---------------行定义
                    coldefs: [
                        {
                            col: "workBillId",
                            friendly: "工单id",
                            unique: true,
                            hidden:true,
                            readonly: "readonly",
                            sorting: false,
                            index: 1
                        },
                        {
                            col: "billCode",
                            friendly: "受理登记单号",
                            unique: true,
                            readonly: "readonly",
                            sorting: false,
                            index: 1
                        },
                        {
                            col: "customerCode",
                            friendly: "客户编号",
                            sorting: false,
                            index: 2
                        },
                        {
                            col: "customerName",
                            friendly: "客户名称",
                            sorting: false,
                            index: 3
                        },
                        {
                            col: "customerAddress",
                            friendly: "客户地址",
                            sorting: false,
                            index: 4
                        },
                        {
                            col: "bizName",
                            friendly: "业务名称",
                            sorting: false,
                            format:businessTypeFormat,
                            inputsource: "select",
                            index: 5
                        },
                        {
                            col: "billType",
                            friendly: "工单类型",
                            sorting: false,
                            format:billTypeFormat,
                            inputsource: "select",
                            index: 5
                        },{
                            col: "billState",
                            friendly: "工单状态",
                            sorting: false,
                            format:billStateFormat,
                            inputsource: "select",
                            index: 5
                        },
                        {
                            col: "modifiedTime",
                            friendly: "操作",
                            sorting: false,
                            format: detailedInfoFormat,
                            index: 13
                        }
                    ],
                    // 查询过滤条件
                    findFilter: function () {
                    	var queryUrl = hzq_rest +"gascsrworkbill";
                        var find_billcode, find_billtype, find_customercode, find_customername,find_fromtime,find_totime,billState;
						var querys = new Array();
                        if ($('#find_billcode').val()) {
                            querys.push(RQLBuilder.like("billCode", $('#find_billcode').val()));
                        }
                        if ($('#find_billtype').val()) {
                        	querys.push(RQLBuilder.equal("billType", $('#find_billtype').val()));
                        }
                         if ($('#billState').val()) {
                        	querys.push(RQLBuilder.equal("billState", $('#billState').val()));
                        }
                        if ($('#find_customercode').val()) {
                        	querys.push(RQLBuilder.like("customerCode", $('#find_customercode').val()));
                        }
                        if ($('#find_customername').val()) {
                        	querys.push(RQLBuilder.like("customerName", $('#find_customername').val()));
                        }
                        
                        if ($('#find_fromtime').val()) {
                        	querys.push(RQLBuilder.condition("createdTime","$gte","to_date('"+  $('#find_fromtime').val()+" 00:00:00" +"','yyyy-MM-dd HH24:mi:ss')"));
                        }
                        if ($('#find_totime').val()) {
                        	querys.push(RQLBuilder.condition("createdTime","$lte","to_date('"+  $('#find_totime').val()+" 23:59:59" +"','yyyy-MM-dd HH24:mi:ss')"));
                        }
                        querys.push(RQLBuilder.condition_fc("areaId","$in", JSON.stringify(areas)));
				        xw.setRestURL(hzq_rest + 'gascsrworkbill');
				        return  RQLBuilder.and(querys).rql();
                    },

                    onAdded: function (ret, jsondata) {

                    },

                    onUpdated: function (ret, jsondata) {

                    },

                    onDeleted: function (ret, jsondata) {
                    },
                }//--init
            );//--end init
        },

    }
}();