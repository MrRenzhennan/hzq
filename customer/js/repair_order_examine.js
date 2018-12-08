var userinfo = JSON.parse(localStorage.getItem('user_info'));
var areaId;
var areas = new Array();
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

var billStateEnum = {"1":"已分配","2":"已派工","3":"已完成","4":"已审核","6":"审批中","7":"已驳回","8":"已打印","9":"已作废"};
var billStateFormat= function () {
    return {
        f: function (val) {
            return billStateEnum[val];
        },
    }
}();
var repair_order_performAction = function () {
	
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
                var bName = row.bizName;
                var bType =row.billType;
                var bState =row.billState;
                var bCustomerCode = row.customerCode;
                if(bState==3){
                	return'<a class="pull-left btn btn-sm btn-circle blue" data-toggle="modal" href="customer/accounter_replace.html?param='+bId+'">审核</a> ';
                }else{
                	return '';
                }
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
			var state=["3","4","6"]
			var xwQuery = RQLBuilder.and([
			    RQLBuilder.condition_fc("areaId","$in", JSON.stringify(areas)),RQLBuilder.equal("isBatch","2"),RQLBuilder.condition_fc("billState","$in", JSON.stringify(state))
			]).rql();
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
                    restbase: 'gascsrworkbill/?query='+xwQuery+'&sort=billState',
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
						var querys = new Array();
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
                        querys.push(RQLBuilder.condition_fc("billState","$in", JSON.stringify(state)));
                        querys.push(RQLBuilder.equal("isBatch","2"));
				        xw.setRestURL(hzq_rest + 'gascsrworkbill?sort=-billState');
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


