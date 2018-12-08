var date = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
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
var execute =  function(bId,cName,baddress,bcreatetime,bphone,bCustomerCode,bookingtime,bType){
	console.log(bId)
	console.log(cName)
	console.log(baddress)
	console.log(bcreatetime)
	console.log(bphone)
	if(!bookingtime||bookingtime=="undefined"||bookingtime==undefined){
		bookingtime="";
	}
	if(!bphone||bphone=="undefined"||bphone==undefined){
		bphone="";
	}
	if(!bphone||baddress=="undefined"||baddress==undefined){
		baddress="";
	}
	var unitId = userinfo.unit_id;
	var unit = Restful.getByID(hzq_rest+"gassysunit",unitId);
	var date = new Date();
	//	保存打印信息
	//	换表hbfwd
	var parameter;
	if(bType=="WB_HBKS"||bType=="WB_ZJV"||bType=="WB_CHANGEM"||bType=="WB_CHANGEGTM"){
		var printcontent={
			"customername":cName ,
	        "customeraddress":baddress,
	        "customertel":bphone,
	        "linktel":bphone,
	        "unitname":unit.unitName,
	        "customercode":bCustomerCode,
	        "createdtime":bcreatetime,
	        "bookingtime":bookingtime,
	        "sendtime":new Date().Format("yyyy-MM-dd hh:mm:ss")
		}
		parameter = {
	        "businesstype": "hbfwd",
	        "printcontent": JSON.stringify(printcontent)
    	};
	}else if(bType=="WB_LSKS"||bType=="WB_REUSEGZB"){
		var custom = Restful.findNQ(hzq_rest+'gasctmarchive?query={"customerCode":"'+bCustomerCode+'"}');
		var idcard=custom[0].idcard;
		if(idcard){
	    	var temp=idcard.substring(0,6);
	    	for(var k = 6;k<idcard.length;k++){
	    		temp+="*"
	    	}
	    	idcard=temp;
	    }else{
	    	idcard="";
	    }
	    var printcontent={
			"customername":cName ,
	        "customeraddress":baddress,
	        "customertel":bphone,
	        "idcard":idcard,
	        "unitname":unit.unitName,
	        "customercode":bCustomerCode,
	        "createdtime":bcreatetime,
	        "bookingtime":bookingtime,
	        "sendtime":new Date().Format("yyyy-MM-dd hh:mm:ss")
		}
		parameter = {
	        "businesstype": "ksfwd",
	        "printcontent": JSON.stringify(printcontent)
    	};
	}else if(bType=="WB_STOPG"||bType=="REMOVEM"||bType=="WB_STOPG"||bType=="WB_STOPGCB"||bType=="WB_CHANGEGT"||bType=="WB_REUSEG"){
		var printcontent={
			"customername":cName ,
	        "customeraddress":baddress,
	        "customertel":bphone,
	        "unitname":unit.unitName,
	        "customercode":bCustomerCode,
	        "createdtime":bcreatetime,
	        "sendtime":new Date().Format("yyyy-MM-dd hh:mm:ss")
		}
		parameter = {
	        "businesstype": "khfwd",
	        "printcontent": JSON.stringify(printcontent)
    	};
	}
    
    var pid = $.md5(JSON.stringify(parameter)+new Date().getTime());
    parameter.pid=pid;
    console.log(parameter)
    
	var parameterRet = Restful.insert('/hzqs/spt/pbprt.do?fh=PRTSPT0000000J00&resp=bd',parameter);
    console.log(parameterRet)
    if(parameterRet.errCode=="1"){
    	var param={
			"billState":"2",
			"modifiedTime":new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00"),
			"sendDate":new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00"),
			"modifiedBy":userinfo.user_id,
			"billContent":pid
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
					window.location.reload()
					
				}
		    } 
		})
    }
}

var printbill = function(pid,bId,bState){
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
				if(bState==2){
					var param={
						"billState":"8",
						"modifiedTime":new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00"),
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
				}else{
					bootbox.alert("<br><center><h4>打印成功！</h4></center><br>",function(){
						window.location.reload();
					});
				}
		    } else {
		        bootbox.alert("<br><center><h4>打印失败！</h4></center><br>");
		    }
	    },
	    error:function(e){
	   		console.log(e)
	    }
	})
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
	"WB_LSKS":"scattered_serve.html",
	"WB_HBKS":"replace_lsks_serve.html",
	"WB_ZJV":"replace_serve.html",
	"WB_STOPG":"customer_serve.html",
	"WB_STOPGCB":"customer_serve.html",
	"WB_REUSEG":"customer_serve.html",
	"WB_REUSEGZB":"scattered_serve.html",
	"WB_CHANGEM":"replace_serve.html",
	"WB_CHANGEGTM":"replace_serve.html",
	"WB_CHANGEGT":"customer_serve.html",
	"REMOVEM":"customer_serve.html"
};
var userinfo = JSON.parse(localStorage.getItem('user_info'));
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
                if(bState==1){
                	return '<a class="pull-left btn btn-sm btn-circle blue exec" data-toggle="modal" onclick="execute(\''+bId+'\',\''+cName+'\',\''+baddress+'\',\''+bcreatetime+'\',\''+bphone+'\',\''+bCustomerCode+'\',\''+bookingtime+'\',\''+bType+'\');">执行</a> '
                }else if(bState==2){
                	if(bType=="WB_LSKS"||bType=="WB_REUSEGZB"){
                		var customerKind;
                		$.ajax({
							headers: {
						      'Accept': 'application/json',
						      'Content-Type': 'application/json'
							},
							async: false,
							type: 'get',
							url: hzq_rest+'gasctmarchive?query={"customerCode":"'+bCustomerCode+'"}',
							success: function (data) {
								if(data.length>0){
									customerKind = data[0].customerKind;
								}
						    } 
						})
                		if(customerKind=="9"){
							return'<a class="pull-left btn btn-sm btn-circle blue" data-toggle="modal" href="serviceManage/dispatching_manage/nonresident_serve.html?param='+bId+'">结果录入</a> ' + '<a class="pull-left btn btn-sm btn-circle blue" data-toggle="modal" onclick="printbill(\''+pid+'\',\''+bId+'\',\''+bState+'\');">打印</a> ';
						}else{
							return'<a class="pull-left btn btn-sm btn-circle blue" data-toggle="modal" href="serviceManage/dispatching_manage/'+billTypeRd[bType]+'?param='+bId+'">结果录入</a> ' + '<a class="pull-left btn btn-sm btn-circle blue" data-toggle="modal" onclick="printbill(\''+pid+'\',\''+bId+'\',\''+bState+'\');">打印</a> ';
						}
                	}else{
                		return'<a class="pull-left btn btn-sm btn-circle blue" data-toggle="modal" href="serviceManage/dispatching_manage/'+billTypeRd[bType]+'?param='+bId+'">结果录入</a> '+ '<a class="pull-left btn btn-sm btn-circle blue" data-toggle="modal" onclick="printbill(\''+pid+'\',\''+bId+'\',\''+bState+'\');">打印</a> ';
                	}
                }else if(bState==8){
                	if(bType=="WB_LSKS"||bType=="WB_REUSEGZB"){
                		var customerKind;
                		$.ajax({
							headers: {
						      'Accept': 'application/json',
						      'Content-Type': 'application/json'
							},
							async: false,
							type: 'get',
							url: hzq_rest+'gasctmarchive?query={"customerCode":"'+bCustomerCode+'"}',
							success: function (data) {
								if(data.length>0){
									customerKind = data[0].customerKind;
								}
						    } 
						})
                		if(customerKind=="9"){
							return'<a class="pull-left btn btn-sm btn-circle blue" data-toggle="modal" href="serviceManage/dispatching_manage/nonresident_serve.html?param='+bId+'">结果录入</a> ' + '<a class="pull-left btn btn-sm btn-circle red" data-toggle="modal" onclick="printbill(\''+pid+'\',\''+bId+'\',\''+bState+'\');">打印</a> ';
						}else{
							return'<a class="pull-left btn btn-sm btn-circle blue" data-toggle="modal" href="serviceManage/dispatching_manage/'+billTypeRd[bType]+'?param='+bId+'">结果录入</a> ' + '<a class="pull-left btn btn-sm btn-circle red" data-toggle="modal" onclick="printbill(\''+pid+'\',\''+bId+'\',\''+bState+'\');">打印</a> ';
						}
                	}else{
                		return'<a class="pull-left btn btn-sm btn-circle blue" data-toggle="modal" href="serviceManage/dispatching_manage/'+billTypeRd[bType]+'?param='+bId+'">结果录入</a> '+ '<a class="pull-left btn btn-sm btn-circle red" data-toggle="modal" onclick="printbill(\''+pid+'\',\''+bId+'\',\''+bState+'\');">打印</a> ';
                	}
                }else if(bState==7){
                	if(bType=="WB_LSKS"||bType=="WB_REUSEGZB"){
                		var customerKind;
                		$.ajax({
							headers: {
						      'Accept': 'application/json',
						      'Content-Type': 'application/json'
							},
							async: false,
							type: 'get',
							url: hzq_rest+'gasctmarchive?query={"customerCode":"'+bCustomerCode+'"}',
							success: function (data) {
								if(data.length>0){
									customerKind = data[0].customerKind;
								}
						    } 
						})
                		if(customerKind=="9"){
							return'<a class="pull-left btn btn-sm btn-circle red" data-toggle="modal" href="serviceManage/dispatching_manage/nonresident_serve.html?param='+bId+'">结果录入</a> ' + '<a class="pull-left btn btn-sm btn-circle red" data-toggle="modal" onclick="printbill(\''+pid+'\',\''+bId+'\',\''+bState+'\');">打印</a> ';
						}else{
							return'<a class="pull-left btn btn-sm btn-circle red" data-toggle="modal" href="serviceManage/dispatching_manage/'+billTypeRd[bType]+'?param='+bId+'">结果录入</a> ' + '<a class="pull-left btn btn-sm btn-circle red" data-toggle="modal" onclick="printbill(\''+pid+'\',\''+bId+'\',\''+bState+'\');">打印</a> ';
						}
                	}else{
                		return'<a class="pull-left btn btn-sm btn-circle red" data-toggle="modal" href="serviceManage/dispatching_manage/'+billTypeRd[bType]+'?param='+bId+'">结果录入</a> '+ '<a class="pull-left btn btn-sm btn-circle red" data-toggle="modal" onclick="printbill(\''+pid+'\',\''+bId+'\',\''+bState+'\');">打印</a> ';
                	}
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
            $('#divtable').html('');
			
			var paramurl = "/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd&bd=";
			var wheres="own_unit='"+userinfo.unit_id+"' and is_batch='0' and bill_state in ('1','2','3','7','8')";
			var params = {
				"cols": "*",
				"froms": "gas_csr_work_bill",
				"wheres": wheres + " order by bill_state,customer_code,customer_address",
				"page": true,
				"limit": 50
			}
//			var xwQuery = RQLBuilder.and([
//			    RQLBuilder.equal("ownUnit",userinfo.unit_id),
//			    RQLBuilder.equal("isBatch","0"),
//			    RQLBuilder.condition_fc("billState","$in",JSON.stringify(["1","2","7","8"]))
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
//                  restbase: 'gascsrworkbill?query='+ xwQuery+'&sort=-billState',
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
//                      var queryUrl = hzq_rest +"gascsrworkbill";
//                      var find_billcode,find_billtype,find_customercode,find_customername,find_fromtime,find_totime,unit_id,billState;
//						var querys = new Array();
//                      if ($('#find_billcode').val()) {
//                          find_billcode = RQLBuilder.like("billCode", $('#find_billcode').val());
//                      }
//                      if ($('#find_billtype').val()) {
//                          find_billtype = RQLBuilder.equal("billType", $('#find_billtype').val());
//
//                      }
//                      if ($('#billState').val()) {
//                          billState = RQLBuilder.equal("billState", $('#billState').val());
//                      }
//                      if ($('#find_customercode').val()) {
//                          find_customercode = RQLBuilder.like("customerCode", $('#find_customercode').val());
//                      }
//                      if ($('#find_customername').val()) {
//                          find_customername = RQLBuilder.like("customerName", $('#find_customername').val());
//                      }
//
//                      if ($('#find_fromtime').val()) {
//                          find_fromtime = RQLBuilder.condition("createdTime","$gte","to_date('"+  $('#find_fromtime').val()+" 00:00:00" +"','yyyy-MM-dd HH24:mi:ss')");
//                      }
//                      if ($('#find_totime').val()) {
//                          find_totime = RQLBuilder.condition("createdTime","$lte","to_date('"+  $('#find_totime').val()+" 23:59:59" +"','yyyy-MM-dd HH24:mi:ss')");
//                      }
//
//                      unit_id = RQLBuilder.equal("ownUnit",userinfo.unit_id);
//						var isbatch = RQLBuilder.condition_fc("isBatch","$ne","1");
//                      var filter=RQLBuilder.and([
//                          find_billcode,find_billtype,find_customercode,find_customername,find_fromtime,find_totime,unit_id,billState,isbatch
//                      ]);
//                      xw.setRestURL(hzq_rest + 'gascsrworkbill');
//                      return filter.rql()+"&sort=billState";
						
						
						
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


