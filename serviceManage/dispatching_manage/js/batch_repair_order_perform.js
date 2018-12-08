var date = new Date();
// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

var time2 = new Date().Format("yyyy-MM-dd HH:mm:ss");
var UnitHelper = RefHelper.create({
    ref_url: "gassysunit",
    ref_col: "unitId",
    ref_display: "unitName"
});
var printbill = function(pid,bId){
	var workbill=Restful.getByID(hzq_rest+"gascsrworkbill",bId)
	console.log(workbill);
	var custom = Restful.findNQ(hzq_rest+'gasctmarchive?query={"customerCode":"'+workbill.customerCode+'"}');
    
    var idcard=custom[0].idcard;
    var name=custom[0].customerName;
    if(idcard){
    	var temp=idcard.substring(0,6);
    	for(var k = 6;k<idcard.length;k++){
    		temp+="*"
    	}
    	idcard=temp;
    }else{
    	idcard="";
    }
    if(!name){
    	name="";
    }
    var tel=custom[0].tel;
    if(!tel){
    	tel="";
    }
    var parameter;
    if(workbill.billType=="B_LSKS"){
    	parameter = {
            "businesstype": "pksfwd",
            "printcontent": "{\"customername\":\"" + name + "\",\
	         \"customeraddress\":\"" + custom[0].customerAddress + "\",\
	         \"customertel\":\"" + tel + "\",\
	         \"idcard\":\"" + idcard + "\",\
	         \"unitname\":\"" + UnitHelper.getDisplay(workbill.ownUnit) + "\",\
	         \"customercode\":\"" + custom[0].customerCode + "\",\
	         \"sendtime\":\"" + new Date().Format("yyyy-MM-dd hh:mm:ss") + "\"}",
            "pid": "" + "" + ""
        };
    }else if(workbill.billType=="B_CHANGEM"){
    	parameter = {//hbfwd
            "businesstype": "phbfwd",
            "printcontent": "{\"customername\":\"" + name + "\",\
	         \"customeraddress\":\"" + custom[0].customerAddress + "\",\
	         \"customertel\":\"" + tel + "\",\
	         \"linktel\":\"" + tel + "\",\
	         \"unitname\":\"" + UnitHelper.getDisplay(workbill.ownUnit) + "\",\
	         \"customercode\":\"" + custom[0].customerCode + "\",\
	         \"createdtime\":\"" + new Date().Format("yyyy-MM-dd hh:mm:ss") + "\",\
	         \"bookingtime\":\"" + "" + "\",\
	         \"sendtime\":\"" + new Date().Format("yyyy-MM-dd hh:mm:ss") + "\"}",
            "pid": "" + "" + ""
        };
    }else if(workbill.billType=="B_REMOVEM"){
    	var printcontent={
			"customername":name ,
	        "customeraddress":custom[0].customerAddress,
	        "customertel":tel,
	        "unitname":UnitHelper.getDisplay(workbill.ownUnit),
	        "customercode":custom[0].customerCode,
	        "createdtime":new Date().Format("yyyy-MM-dd hh:mm:ss"),
	        "sendtime":new Date().Format("yyyy-MM-dd hh:mm:ss"),
	        "pid":""
		}
		parameter = {
	        "businesstype": "khfwd",
	        "printcontent": JSON.stringify(printcontent)
    	};
    }

    var pid = $.md5(JSON.stringify(parameter)+new Date().getTime());
    parameter.pid=pid;
    var printRet = Restful.insert('/hzqs/spt/pbprt.do?fh=PRTSPT0000000J00&resp=bd',parameter);
    if (printRet.errCode == '1'){
    	var urll = 'http://127.0.0.1:9000/';
	    var data = {
	        "cmdheader": {
	            "cmdtype": "17"
	        },
	        "param": {
	            "data": [{"ptid": pid}]
	        }
	    };
	    $.ajax({
			type: 'get',
			url: urll,
			async: false,
			dataType: "JSONP",
			data:"data=" + JSON.stringify(data),
			jsonp: "callfuncname",
			success: function (ret) {
				console.log(ret)
				if (ret.result.resultcode == "0") {
					var param={
						"billState":"8",
						"modifiedTime":date,
						"modifiedBy":userinfo.user_id
					}
				
					$.ajax({
						headers: {
					      'Accept': 'application/json',
					      'Content-Type': 'application/json'
						},
						async: false,
						type: 'PUT',
						data : JSON.stringify(param),
						url: hzq_rest+"gascsrworkbill/"+bId,
						success: function (data) {
							if(data.retcode==-1){
								bootbox.alert("<br><center><h4>打印成功！</h4></center><br>",function(){
									window.location.reload();
								});
							}
					    } 
					})
			        
			    } else {
			        bootbox.alert("<br><center><h4>打印失败</h4></center><br>");
			    }
		    },
		    error:function(e){
		   		bootbox.alert("<br><center><h4>打印失败</h4></center><br>");
		    }
		})
    }else{
    	bootbox.alert("<br><center><h4>生成打印信息错误,打印失败</h4></center><br>");
    }
}

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

var billTypeEnum = {"B_LSKS":"批量开栓","B_CHANGEM":"批量换表","B_REMOVEM":"批量拆除"};
var billTypeFormat= function () {
    return {
        f: function (val) {
            return billTypeEnum[val];
        },
    }
}();
var billStateEnum = {"2":"已派工","7":"已驳回","8":"已打印"};
$.map(billStateEnum, function (key, val) {
	$('#billState').append('<option  value="' + val + '">' + key + '</option>');
});
var billStateFormat= function () {
    return {
        f: function (val) {
            return billStateEnum[val];
        },
    }
}();
var billTypeRd = {
	"B_LSKS":"scattered_serve.html",
	"B_CHANGEM":"replace_serve.html",
	"B_REMOVEM":"customer_serve.html"
};

var userinfo = JSON.parse(localStorage.getItem('user_info'));
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
                var baddress = row.customerAddress;
                var bcreatetime = row.createdTime;
                var bookingtime = row.bookingTime;
                var bphone = row.phone;
                var pid=row.billContent;
                if(bState==2){
					return'<a class="pull-left btn btn-sm btn-circle blue" data-toggle="modal" href="serviceManage/dispatching_manage/'+billTypeRd[bType]+'?param='+bId+'">结果录入</a> ' + '<a class="pull-left btn btn-sm btn-circle blue" data-toggle="modal" onclick="printbill(\''+pid+'\',\''+bId+'\');">打印</a> ';
                }else if(bState==8){
					return'<a class="pull-left btn btn-sm btn-circle blue" data-toggle="modal" href="serviceManage/dispatching_manage/'+billTypeRd[bType]+'?param='+bId+'">结果录入</a> ' + '<a class="pull-left btn btn-sm btn-circle red" data-toggle="modal" onclick="printbill(\''+pid+'\',\''+bId+'\');">打印</a> ';
                }
                else if(bState==7){
					return'<a class="pull-left btn btn-sm btn-circle red" data-toggle="modal" href="serviceManage/dispatching_manage/'+billTypeRd[bType]+'?param='+bId+'">结果录入</a> ' + '<a class="pull-left btn btn-sm btn-circle red" data-toggle="modal" onclick="printbill(\''+pid+'\',\''+bId+'\');">打印</a> ';
                }else{
                	return ''
                }
            }
        }
    }();
    
	return {
        init: function () {
            this.reload();
        },
         
        reload: function () {
            $('#divtable').html('');
			
			var paramurl = "/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd&bd=";
			var wheres="own_unit='"+userinfo.unit_id+"' and is_batch='1'";
			var params = {
				"cols": "*",
				"froms": "gas_csr_work_bill",
				"wheres": wheres + " order by bill_state,customer_code,customer_address",
				"page": true,
				"limit": 50
			}
//			var xwQuery = RQLBuilder.and([
//			    RQLBuilder.equal("ownUnit",userinfo.unit_id),RQLBuilder.equal("isBatch","1")
//			]).rql();
//			console.log(xwQuery)
            xw = XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize: 10, 			//Initial pagesize
                    columnPicker: true,         //Show the columnPicker button
                    sorting: true,
                    transition: 'fade',  //(bounce, fade, flip, rotate, scroll, slide).
                    checkboxes: true,           //Make rows checkable. (Note. You need a column with the 'unique' property)
                    checkAllToggle: true,        //Show the check-all toggle//+RQLBuilder.like("KEYY", "a").rql()
                    //----------------基本restful地址---
                    restURL: paramurl+encodeURIComponent(JSON.stringify(params)),
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
						var wheres2=wheres;
                        if ($('#find_billcode').val()) {
                            wheres2=wheres2+ " and bill_code like '%"+$('#find_billcode').val()+"%'";
                        }
                        if ($('#find_billtype').val()) {
                            wheres2=wheres2+" and bill_type='"+ $('#find_billtype').val()+"'";

                        }
                        if ($('#billState').val()) {
                            wheres2=wheres2+ " and bill_state='"+ $('#billState').val()+"'";
                        }
                        if ($('#find_customercode').val()) {
                            wheres2+=" and customer_code like '%"+ $('#find_customercode').val() +"%'";
                        }
                        if ($('#find_customername').val()) {
                            wheres2+=" and customer_name like '%"+ $('#find_customername').val() +"%'";
                        }

                        if ($('#find_fromtime').val()) {
                            wheres2+=" and created_time >= to_date('"+  $('#find_fromtime').val()+" 00:00:00" +"','yyyy-MM-dd HH24:mi:ss')" ;
                        }
                        if ($('#find_totime').val()) {
                        	wheres2+=" and created_time <= to_date('"+  $('#find_totime').val()+" 23:59:59" +"','yyyy-MM-dd HH24:mi:ss')" ;
                        }
                        if ($('#find_bookid').val()) {
                        	var resData = Restful.findNQ(hzq_rest+'gascsrworkbillbatch?query={"bookId":"'+$('#find_bookid').val()+'"}')
							var arrs="";
							console.log(resData)
							if(resData){
								for(var i in resData){
									if(i==resData.length-1){
										arrs= arrs + "'" + resData[i].workBillBatchId + "'";
									}else{
										arrs= arrs + "'" + resData[i].workBillBatchId + "',";
									}
								}
							}
							console.log(resData)
							if(arrs){
								wheres2+=" and batch_id in (" + arrs +")";
							}
                        }
						var params2 = {
							"cols": "*",
							"froms": "gas_csr_work_bill",
							"wheres": wheres2 + " order by bill_state,customer_code,customer_address",
							"page": true,
							"limit": 50
						}
                        xw.setRestURL(paramurl + encodeURIComponent(JSON.stringify(params2)));
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
        },

    }
}();

$("#p_print").click(function(){
	var data = xw.getTable().getData(true);
    if (!data.rows.length) {
        bootbox.alert("请选择至少一个工单！");
        return;
    }
    console.log(data)
    var pids=[];
    var ids=[];
    var error_msg;
    for(var i=0;i<data.rows.length;i++){
    	if(data.rows[i].billType=="B_REMOVEM"){
    		bootbox.alert("批量拆除业务暂不支持批量打印,请单张打印.",function(){
    		});
    		return;
    	}
    	var workbill=Restful.getByID(hzq_rest+"gascsrworkbill",data.rows[i].workBillId)
	
		var custom = Restful.findNQ(hzq_rest+'gasctmarchive?query={"customerCode":"'+workbill.customerCode+'"}');
	    var idcard=custom[0].idcard;
	    var name=custom[0].customerName;
	    if(idcard){
	    	var temp=idcard.substring(0,6);
	    	for(var k = 6;k<idcard.length;k++){
	    		temp+="*"
	    	}
	    	idcard=temp;
	    }else{
	    	idcard="";
	    }
	    if(!name){
	    	name="";
	    }
	    var tel=custom[0].tel;
	    if(!tel){
	    	tel="";
	    }
	    var parameter;
	    if(workbill.billType=="B_LSKS"){
	    	parameter = {
	            "businesstype": "pksfwd",
	            "printcontent": "{\"customername\":\"" + name + "\",\
		         \"customeraddress\":\"" + custom[0].customerAddress + "\",\
		         \"customertel\":\"" + tel + "\",\
		         \"idcard\":\"" + idcard + "\",\
		         \"unitname\":\"" + UnitHelper.getDisplay(workbill.ownUnit) + "\",\
		         \"customercode\":\"" + custom[0].customerCode + "\",\
		         \"sendtime\":\"" + new Date().Format("yyyy-MM-dd hh:mm:ss") + "\"}",
	            "pid": "" + "" + ""
	        };
	    }else if(workbill.billType=="B_CHANGEM"){
	    	parameter = {//hbfwd
	            "businesstype": "phbfwd",
	            "printcontent": "{\"customername\":\"" + name + "\",\
		         \"customeraddress\":\"" + custom[0].customerAddress + "\",\
		         \"customertel\":\"" + tel + "\",\
		         \"linktel\":\"" + tel + "\",\
		         \"unitname\":\"" + UnitHelper.getDisplay(workbill.ownUnit) + "\",\
		         \"customercode\":\"" + custom[0].customerCode + "\",\
		         \"createdtime\":\"" + new Date().Format("yyyy-MM-dd hh:mm:ss") + "\",\
		         \"bookingtime\":\"" + "" + "\",\
		         \"sendtime\":\"" + new Date().Format("yyyy-MM-dd hh:mm:ss") + "\"}",
	            "pid": "" + "" + ""
	        };
	    }
	    var pid = $.md5(JSON.stringify(parameter)+new Date().getTime());
	    parameter.pid=pid;
	    var printRet = Restful.insert('/hzqs/spt/pbprt.do?fh=PRTSPT0000000J00&resp=bd',parameter);
	    if (printRet.errCode == '1'){
//	    	var pid = data.rows[i].billContent;
	    	var a ={
	    		"ptid":pid
	    	}
	    	pids.push(a)
	    	ids.push(data.rows[i].workBillId)
	    }else{
	    	if(error_msg){
	    		error_msg+=(","+custom[0].customerCode);
	    	}else{
	    		error_msg+=custom[0].customerCode;
	    	}
	    }
    }
    //打印
    var urll = 'http://127.0.0.1:9000/';
    var data = {
        "cmdheader": {
            "cmdtype": "17"
        },
        "param": {
            "data": pids
        }
    };
    $.ajax({
		type: 'get',
		url: urll,
		async: false,
		dataType: "JSONP",
		data:"data=" + JSON.stringify(data),
		jsonp: "callfuncname",
		success: function (ret) {
			console.log(ret)
			if (ret.result.resultcode == "0") {
				var param={
					"billState":"8",
					"modifiedTime":date,
					"modifiedBy":userinfo.user_id
				}
			
				$.ajax({
					headers: {
				      'Accept': 'application/json',
				      'Content-Type': 'application/json'
					},
					async: false,
					type: 'PUT',
					data : JSON.stringify(param),
					url: hzq_rest+"gascsrworkbill/"+ids.join(),
					success: function (data) {
						if(data.retcode==-1){
							if(error_msg){
								bootbox.alert("<br><center><h4>打印完成,以下客户号打印失败:</br></h4></center><br>"+error_msg,function(){
									window.location.reload();
								});
							}else{
								bootbox.alert("<br><center><h4>打印成功！</h4></center><br>",function(){
									window.location.reload();
								});
							}
							
						}
				    } 
				})
		        
		    } else {
		        bootbox.alert("<br><center><h4>打印失败！</h4></center><br>");
		    }
	    },
	    error:function(e){
	   		console.log(e)
	    }
	})
})
