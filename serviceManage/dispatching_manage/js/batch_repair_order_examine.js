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
//根据登录人unit查询所属该单位的批量任务，找到抄表本
var paramurl = "/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd";
var params = {
	"cols": "distinct a.book_id,b.book_code",
	"froms": "gas_csr_work_bill_batch a,gas_mrd_book b",
	"wheres": "own_unit='"+userinfo.unit_id+"' and a.book_id=b.book_id",
	"page": true,
	"limit": 1000
}
var readingData = Restful.insert(paramurl,params);
console.log(readingData.rows)
for(var i in readingData.rows){
	$('#find_bookid').append('<option  value="' + readingData.rows[i].bookId + '">' + readingData.rows[i].bookCode + '</option>');
}
var billTypeEnum = {"B_LSKS":"批量开栓","B_CHANGEM":"批量换表","B_REMOVEM":"批量拆除"};
var billTypeFormat= function () {
    return {
        f: function (val) {
            return billTypeEnum[val];
        },
    }
}();
var billStateEnum = {"0":"未处理","1":"已分配","2":"已派工","3":"已完成","4":"已审核","7":"已驳回","8":"已打印","9":"已作废"};
var billStateFormat= function () {
    return {
        f: function (val) {
            return billStateEnum[val];
        },
    }
}();
var billTypeRd = {
	"B_LSKS":"accounter_scattered.html",
	"B_CHANGEM":"accounter_replace_new.html",
	"B_REMOVEM":"accounter_customer_new.html"
};
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
						return'<a class="pull-left btn btn-sm btn-circle blue" data-toggle="modal" href="serviceManage/dispatching_manage/'+billTypeRd[bType]+'?param='+bId+'">审核</a> ';
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
			
//			var effectTime = RQLBuilder.condition("effectTime","$gt","to_date('"+ formatTime +"','yyyy-MM-dd')");
//
			var state=["3","4"]
			var xwQuery = RQLBuilder.and([
			    RQLBuilder.condition_fc("areaId","$in", JSON.stringify(areas)),RQLBuilder.condition_fc("isBatch","$in","1"),RQLBuilder.condition_fc("billState","$in", JSON.stringify(state))
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
                    restbase: 'gascsrworkbill/?sort=billState&query='+xwQuery,
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
						var querys = new Array();
                        if ($('#find_billcode').val()) {
                            querys.push(RQLBuilder.like("billCode", $('#find_billcode').val()));
                        }
                        if ($('#find_billtype').val()) {
                        	querys.push(RQLBuilder.equal("billType", $('#find_billtype').val()));
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
                        if ($('#find_bookid').val()) {
                        	var resData = Restful.findNQ(hzq_rest+'gascsrworkbillbatch?query={"bookId":"'+$('#find_bookid').val()+'"}')
							var arrs=[];
							console.log(resData)
							if(resData){
								for(var i in resData){
									arrs.push(resData[0].workBillBatchId)
								}
							}
							console.log(resData)
							if(arrs){
								querys.push(RQLBuilder.condition_fc("batchId","$in",JSON.stringify(arrs)));
							}
                            
                        }
                        
                        querys.push(RQLBuilder.condition_fc("areaId","$in", JSON.stringify(areas)));
                        querys.push(RQLBuilder.condition_fc("billState","$in", JSON.stringify(state)));
                        querys.push(RQLBuilder.condition_fc("isBatch","$in","1"));
				        xw.setRestURL(hzq_rest + 'gascsrworkbill');
				        return  RQLBuilder.and(querys).rql()+"&sort=billState";
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


