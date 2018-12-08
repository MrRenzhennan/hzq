//保险管理
$("#chosedate button").on('click',function(){
    $(this).addClass("blue")
    $(this).parent('div').siblings().find("button").removeClass('blue');
})
var date_now =  moment().format("YYYY-MM-DD HH:mm:ss");//date_format(new Date(),"yyyy-MM-dd hh:mm:ss");
function date_format(date, fmt) {
    var dataJson = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in dataJson)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (dataJson[k]) : (("00" + dataJson[k]).substr(("" + dataJson[k]).length)));
    return fmt;
}
console.log(date_format(new Date(),"yyyy-MM-dd hh:mm:ss"))
console.log(new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00"))
console.log(moment(date_format(new Date(),"yyyy-MM-dd hh:mm:ss")).toDate())
//当日
$("#find_today_sign").click(function(){
    $("#find_start_date").val(date_format(new Date(),"yyyy-MM-dd"));
    $("#find_end_date").val(date_format(new Date(),"yyyy-MM-dd"));
});
//近一周
$("#find_this_week_sign").click(function(){
    var date = new Date();
    $("#find_end_date").val(date_format(date,"yyyy-MM-dd"));
    date.setDate(date.getDate()-6);
    $("#find_start_date").val(date_format(date,"yyyy-MM-dd"));
});
// 近一月
$("#find_this_month_sign").click(function(){
    var date = new Date();
    $("#find_end_date").val(date_format(date,"yyyy-MM-dd"));
    date.setMonth(date.getMonth()-1);
    date.setDate(date.getDate()+1);
    $("#find_start_date").val(date_format(date,"yyyy-MM-dd"));
});
// 近三月
$("#find_three_month_sign").click(function(){
    var date = new Date();
    $("#find_end_date").val(date_format(date,"yyyy-MM-dd"));
    date.setMonth(date.getMonth()-3);
    date.setDate(date.getDate()+1);
    $("#find_start_date").val(date_format(date,"yyyy-MM-dd"));
});
// 近一年
$("#find_this_year_sign").click(function(){
    var date = new Date();
    $("#find_end_date").val(date_format(date,"yyyy-MM-dd"));
    date.setMonth(date.getMonth()-12);
    date.setDate(date.getDate()+1);
    $("#find_start_date").val(date_format(date,"yyyy-MM-dd"));

});
// 不限
$("#find_anyway_sign").click(function(){
    $("#find_start_date").val("");
    $("#find_end_date").val("");
});
$("#chosedate1 button").on('click',function(){
    $(this).addClass("blue")
    $(this).parent('div').siblings().find("button").removeClass('blue');
})

function date_format(date, fmt) {
    var dataJson = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in dataJson)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (dataJson[k]) : (("00" + dataJson[k]).substr(("" + dataJson[k]).length)));
    return fmt;
}
//当日
$("#find_today_endTime").click(function(){
    $("#find_endTime").val(date_format(new Date(),"yyyy-MM-dd"));
    $("#find_endTime1").val(date_format(new Date(),"yyyy-MM-dd"));
});
//近一周
$("#find_this_week_endTime").click(function(){
    var date = new Date();
    $("#find_endTime1").val(date_format(date,"yyyy-MM-dd"));
    date.setDate(date.getDate()-6);
    $("#find_endTime").val(date_format(date,"yyyy-MM-dd"));
});
// 近一月
$("#find_this_month_endTime").click(function(){
    var date = new Date();
    $("#find_endTime1").val(date_format(date,"yyyy-MM-dd"));
    date.setMonth(date.getMonth()-1);
    date.setDate(date.getDate()+1);
    $("#find_endTime").val(date_format(date,"yyyy-MM-dd"));
});
// 近三月
$("#find_three_month_endTime").click(function(){
    var date = new Date();
    $("#find_endTime1").val(date_format(date,"yyyy-MM-dd"));
    date.setMonth(date.getMonth()-3);
    date.setDate(date.getDate()+1);
    $("#find_endTime").val(date_format(date,"yyyy-MM-dd"));
});
// 近一年
$("#find_this_year_endTime").click(function(){
    var date = new Date();
    $("#find_endTime1").val(date_format(date,"yyyy-MM-dd"));
    date.setMonth(date.getMonth()-12);
    date.setDate(date.getDate()+1);
    $("#find_endTime").val(date_format(date,"yyyy-MM-dd"));

});
// 不限
$("#find_anyway_endTime").click(function(){
    $("#find_endTime").val("");
    $("#find_endTime1").val("");
});
//TODO 保险状态
var insuranceStatus = {'1':'启用','2':'停用','3':'已删除'};//1启用 2停用 3已删除
//var contractStatus = {"0": "预签", "1": "新签", "2": "正常","4": "到期", "5": "过期","7":"作废"};
//$.each(contractStatus,function(key,val){
//  $("#find_contractState").append("<option value='"+key+"'>"+val+"</option>")
//})
$('#find_insurance_state').html("<option value=''></option>");
$.each(insuranceStatus,function(key,val){
	$('#find_insurance_state').append("<option value='"+key+"'>"+val+"</option>");
})

$("#save_code").on("blur",function(){
    console.log($(this).val())
    var resultq = Restful.findNQ( hzq_rest +'gasctminsurance/?query={"code":"'+$(this).val()+'"}');
    console.log(resultq);
    if(resultq != 'undefined' && resultq != null && resultq.length>0){
        bootbox.alert("<center><h4>该保险编号已经存在，请更换保险编号。</h4></center>");
        $("#addsubmit").attr("disabled","disabled")
    }else{
        $("#addsubmit").attr("disabled",false)
    }
})

$("#save_customer_code").hide();
//$("#contractType").on("change",function(){
//  console.log($(this).val())
//  if($(this).val() == "1"){
//      $("#contracrtCustomer").hide();
//  }else if($(this).val() == "8"){
//      $("#contracrtCustomer").show();
//  }
//})
$("#save_customer_code").on("blur",function(){
    console.log($(this).val())
    var resultq = Restful.findNQ( hzq_rest +'gasctmarchive/?query={"customerCode":"'+$(this).val()+'"}');
    console.log(resultq);
    if(!resultq.length){
        bootbox.alert("<center><h4>该客户不存在，请更换保险编号。</h4></center>");
        $("#addsubmit").attr("disabled","disabled")
    }else{
        $("#addsubmit").attr("disabled",false)
    }
})

var loginarea = [];
var areaId = JSON.parse(localStorage.getItem("user_info")).area_id

GasModSys.areaList({
    "areaId":areaId,
    "cb":function(data){
        console.log(data)
        $.each(data,function(key,val){
            loginarea.push(val.areaId);
            $('#find_areaId').append('<option value="' + val.areaId + '">' + val.areaName + '</option>');
        })
    }
});

var customerInsuranceAction = function(){
//var nonContractAction = function () {
    //供气区域
    var AreaHelper = RefHelper.create({
        ref_url:"gasbizarea",
        ref_col:"areaId",
        ref_display:"areaName",
    });
    var gasTypeHelper = RefHelper.create({
        ref_url: "gasbizgastype/"+'?query={"parentTypeId":"3"}"',
        ref_col: "gasTypeId",
        ref_display: "gasTypeName"
    });
    var CompanyHelper = RefHelper.create({
    		ref_url:"gasctminsurancecompany/"+'?query={"status":"1"}"',
    		ref_col:"insuranceCompanyId",
    		ref_display:"companyName"
    });
    var companyFormat = function(){
    		return {
    			f:function(val){
    				return CompanyHelper.getDisplay(val);
    			}
    		}
    }();
    var gasTypeFormat=function(){
        return {
            f: function(val){
                var str = "";
                for(var i=0;i<val.split(",").length;i++){
                    str+= gasTypeHelper.getDisplay(val.split(",")[i]) +" ";
                }
                return str;
            }
        }
    }();
    var AreaFormat = function () {
        return {
            f: function (val) {
                return AreaHelper.getDisplay(val);
            }
        }
    }();
    var dateFormat1 = function () {
        return {
            f: function (val) {
                if(val){
                    return val.split("T")[0] + " "+val.split("T")[1]
                }
            }
        }
    }();
    
    //
    var hasInsuranceFromat = function(){//是否有保险
    		return {
    			f:function (val){
    				if(val){
    					var query ={
        					"cols":"count(1) as num_insurance",
        					"froms":"gas_ctm_insurance",
        					"wheres":" and ctm_archive_id ='"+val+"' and status ='1' and begin_time < to_date('"+date_now+"','yyyy-mm-dd hh24:mi:ss') and end_time >  to_date('"+date_now+"','yyyy-mm-dd hh24:mi:ss')" ,
        					"pages":"false"
        				};
	        			$.ajax({
	                //url: Utils.queryURL(hzq_rest+ "gassysuser")+'fields={"userId":1,"employeeName":1,'+
	                //'"stationId":1,"chargeUnitId":1}&query='+query,
		                url:'/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00',
		                dataType: 'json',
		                type: 'POST',
		                contentType: "application/json; charset=utf-8",
		                data:JSON.stringify(query),
		                async: true,
		            }).done(function(data,retcode) {
		                //jsOpts['cb'](data.rows);
		                if(data.rows){
		                		if(data.rows[0].numInsurance > 0){
		                			return  "有保险";
		                		}else{
		                			return "无保险";
		                		}
		                }else{
		                		return "无保险";
		                }
		            });
    				}else{
    					return "无保险";
    				}
    			}
    		}
    }();

//  var detailFormat=function(){
//      return{
//          f: function(val,row){
//              console.log(row)
//              if(row.contractState == "0"){
//                  return "<a href='customer/non_inhabitant_contract_detail.html?refno=" + val + "'>详情</a>";
//
//              }else if(row.contractState == "1" && row.reservedField1 !="1" || row.contractState == "2"){
//                  return "<a href='customer/non_inhabitant_contract_detail.html?refno=" + val + "'>详情</a> ";
//              }else if(row.contractState == "1" && row.reservedField1 =="1"){
//                  return "<a href='customer/contract_noninhabitant_input.html?refno=" + val + "'>补录</a>";
//              }else if(row.contractState == "9" && row.reservedField1 =="1"){
//                  return "<a href='customer/contract_noninhabitant_input.html?refno=" + val + "'>补录</a>";
//              }else if(row.contractState == "9" && row.reservedField1 =="3"){
//                  return "<a href='customer/contract_noninhabitant_input.html?refno=" + val + "'>补录</a>";
//              }else if(row.contractState == "9" && row.reservedField1 =="4"){
//                  return "<a href='customer/contractnonrenew.html?refno=" + val + "'>补录</a>";
//              }else if(row.contractState == "6" && row.reservedField1 =="4"){
//                  return "<a href='customer/contract_noninhabitant_input.html?refno=" + val + "'>补录</a>";
//              }else if( row.contractState == "3" || row.contractState == "4" || row.contractState == "5"  ){
//                  if(row.status =="1"){
//                      return "<a href='customer/non_inhabitant_contract_detail.html?refno=" + val + "'>详情</a>"+" "+
//                          "<a href='customer/renewcontract.html?" +val+"'>续签</a>";
//                  }else{
//                      return "<a href='customer/non_inhabitant_contract_detail.html?refno=" + val + "'>详情</a>";
//                  }
//              }else if(row.contractState == "6"){
//                  return "<a href='customer/non_inhabitant_contract_detail.html?refno=" + val + "'>详情</a>";
//              }else{
//                  return "<a href='customer/non_inhabitant_contract_detail.html?refno=" + val + "'>详情</a>";
//              }
//
//          }
//      }
//  }();
    return {

        init: function () {
            this.reload();
            this.initHelper();
        },
        initHelper: function () {
            // 用气性质select init
            $('#find_gasTypeId').html('<option value=""></option>');
            $.map(gasTypeHelper.getData(), function (value, key) {
                $('#find_gasTypeId').append('<option value="' + key + '">' + value + '</option> ');
            });
            $('#find_company_id').html('<option value=""></option>');
            console.log(CompanyHelper.getData());
            $.map(CompanyHelper.getData(),function(value,key){
            	
            		$('#find_company_id').append('<option value="'+key+'">'+value+'</option>');
            });
             $('#insuranceCompanyId').html('<option value=""></option>');
            $.map(CompanyHelper.getData(), function(value,key) {
            		$('#insuranceCompanyId').append('<option value="'+key+'">'+value+'</option>');
            });
//          GasModCtm.insuranceCompanyList({
//              "cb":function(data){
//                  var inhtml = "<option value=''>全部</option>";
//                  if(data){
//                      $.each(data,function(idx,row){
//                          inhtml += '<option value="'+row.userId+'">'+row.employeeName+'</option>';
//                      })
//                  }
//                  $("#find_company").html(inhtml);
//                  $("#find_company").val("").change();
//              }
//           });
            
            //保险单位
//          $.map(insuranceCompanyList, function(value,key) {
//          		$('#find_company').append('<option value="'+key+'">'+value+'</option>');
//          });

           /* $.map(AreaHelper.getData(), function(value, key) {
                $('#find_areaId').append('<option value="'+key+'">'+value+'</option>');
            });*/
        },
        reload:function(){
        	var key_co = "arCtmArchiveId";
            $('#divtable').html('');
//          var queryCondion = RQLBuilder.and([
//              RQLBuilder.equal("gasKind","9"),
//              RQLBuilder.condition_fc("areaId","$in",JSON.stringify(loginarea))
//          ]).rql()
			var bd = {
				   "cols":"cin.ctm_insurance_id,cin.ctm_archive_id as hasinsurance,cin.begin_time,cin.end_time,cin.name,cin.content,cin.file_id,cin.code,cin.status,cin.charge_unit_id,cin.user_id,ar.area_id as arAreaId,ar.customer_code as arCustomerCode,ar.customer_name as arCustomerName,ar.ctm_archive_id as arCtmArchiveId,ar.customer_address ",
				//"cols":" distinct cin.ctm_archive_id as hasinsurance,cin.begin_time,cin.end_time,cin.name,cin.content,cin.file_id,cin.code,cin.status,cin.charge_unit_id,cin.user_id,ar.area_id,ar.customer_code as ar_customer_code,ar.customer_name as ar_customer_name,ar.ctm_archive_id as ar_ctm_archive_id,ar.customer_address ",
				"froms":"gas_ctm_archive ar inner join gas_ctm_insurance cin on cin.ctm_archive_id=ar.ctm_archive_id ",
				"wheres":"1=0",
				"page":false
			};
			
			
            xw=XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize:10,
                    columnPicker: true,
                    transition: 'fade',
                    checkAllToggle:true,
                    //----------------基本restful地址---
                    //restbase: 'gasctmcontract/?query='+queryCondion,
                    restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
                   // key_column:'meterReadingId',
                    key_column: 'ctmInsuranceId',
                    coldefs: [
                    		{
                    			col:"ctmInsuranceId",
                    			friendly:"id",
                    			hidden:true,
                    			readonly: "readonly",
                            sorting: false,
                            unique:true,
                    			index:1
                    		},
                        {
                            col: "arAreaId",
                            friendly: "供气区域",
                            sorting: false,
                            format: AreaFormat,
                            index: 4
                        },
                        	{
                        		col:"chargeUnitId",
                        		friendly:"营业网点",
                        		sorting: false,
                    			index: 8
                        },
                        {
                        		col:"userId",
                        		friendly:"营业员",
                        		sorting: false,
                    			index:12
                        },
                        {
                        		col:"beginTime",
                        		friendly:"生效时间",
                        		sorting: false,
                    			index:16
                        		
                        },
                        {
                        		col:"endTime",
                        		friendly:"失效时间",
                        		sorting: false,
                    			index:20
                        },
                        {
                        		col:"insuranceCompanyId",
                        		friendly:"保险公司",
                        		//format:GasModCtm.insuranceCompanyFormat,
                        		format:companyFormat,
                        		sorting:false,
                        		index:21
                        },
                        {
                        		col:"name",
                        		friendly:"保险名称",
                        		sorting: false,
                    			index:24
                        },
//                      {
//                      		col:"content",
//                      		friendly:"保单内容",
//                      		sorting: false,
//                  			index:28
//                      },
                        {
                        		col:"fileId",
                        		friendly:"附件id",
                        		hidden:true,
                        		sorting: false,
                    			index:30
                        },
                        {
                        		col:"code",
                        		friendly:"保单号",
                        		sorting: false,
                    			index:32
                        },
                        {
                        	 	col:"arCustomerName",
                        	 	friendly:"客户名称",
                        	 	sorting: false,
                    			index:34
                        },
                        {
                        		col:"arCustomerCode",
                        		friendly:"客户编号",
                        		sorting: false,
                    			index:36
                        },
                        {
                        		col:"arCtmArchiveId",
                        		friendly:"客户档案ID",
                        		hidden:true,
                        		sorting: false,
                    			index:38
                        },
                        {
                        		col:"hasinsurance",
                        		friendly:"当前是否有保险",
                        		format:hasInsuranceFromat,
                        		sorting: false,
                    			index:39
                        },
//                      {
//                      		col:"createdTime",
//                      		friendly:"创建时间",
//                      		sorting: false,
//                  			index:40
//                      },
//                      {	
//                      		col:"modifiedTime",
//                      		friendly:"修改时间",
//                      		sorting: false,
//                  			index:42
//                      }
                        
//                      {
//                          col: "gasType",
//                          friendly: "用气类型",
//                          format:gasTypeFormat,
//                          sorting: false,
//                          index: 2
//                      },
//                      {
//                          col: "contractNo",
//                          friendly: "合同编号:",
//                          sorting: false,
//                          index: 3
//                      },
//                      {
//                          col: "useGasPerson",
//                          friendly: "客户名称",
//                          sorting: false,
//                          index: 4
//                      },
//                      {
//                          col: "signupTime",
//                          friendly: "签约日期",
//                          inputsource: "datetimepicker",
//                          date_format: "yyyy-mm-dd",
//                          format: dateFormat,
//                          readonly: "readonly",
//                          sorting: false,
//                          index: 6
//                      },
//                      {
//                          col: "beginDate",
//                          friendly: "生效日期",
//                          inputsource: "datetimepicker",
//                          date_format: "yyyy-mm-dd",
//                          format: dateFormat,
//                          readonly: "readonly",
//                          sorting: false,
//                          index: 7
//                      },
//                      {
//                          col: "endDate",
//                          friendly: "到期日期",
//                          inputsource: "datetimepicker",
//                          date_format: "yyyy-mm-dd",
//                          format: dateFormat,
//                          readonly: "readonly",
//                          sorting: false,
//                          index: 8
//                      },
//                      {
//                          col: "contractType",
//                          friendly: "合同类别",
//                          format:contractTypeFormat,
//                          sorting: false,
//                          index: 9
//                      },
//                      {
//                          col: "contractState",
//                          friendly: "合同状态",
//                          sorting: false,
//                          format:GasModCtm.contractStatusFormat,
//                          index: 10
//                      },
//                      {
//                          col: "createdTime",
//                          friendly: "创建时间",
//                          sorting: true,
//                          format:dateFormat1,
//                          index: 10
//                      },
//                      {
//                          col: "contractId",
//                          friendly: "操作",
//                          readonly: "readonly",
//                          format: detailFormat,
//                          sorting: false,
//                          index: 11
//                      },
//                      {
//                          col: "remark",
//                          friendly: "备注",
//                          sorting: false,
//                          hidden: true,
//                          index: 12
//                      },
                    ],
                    // 查询过滤条件
                    findFilter: function () {
                    		var whereinfo = " 1=1 ";
                        if($('#find_areaId').val()){
                        		whereinfo +=" and ar.area_id='"+$('#find_areaId').val()+"' ";
                        }
                        if($('#find_gasTypeId').val()){
                        		whereinfo +=" and ar.gas_type_id='"+$('#find_gasTypeId').val()+"' ";
                        }
                        if($('#find_company_id').val()){
                        		whereinfo +=" and cin.insurance_company_id='"+$('#find_company_id').val()+"' ";
                        }
                        if($('#find_customer_code').val()){
                        		whereinfo +=" and ar.customer_code='"+$('#find_customer_code').val()+"' ";
                        }
                        if($('#find_customer_name').val()){
                        		whereinfo +=" and ar.customer_name like '%"+$('#find_customer_name').val()+"%' ";
                        }
                        if($('#find_customer_address').val()){
                        		whereinfo +=" and ar.customer_address like '%"+$('#find_customer_address').val()+"%' ";
                        }
                        if($('#find_insurance_code').val()){//保险编号
                        		whereinfo +=" and cin.code ='"+$('#find_insurance_code').val()+"' ";
                        }
                        if($('#find_insurance_name').val()){
                        		whereinfo +=" and cin.name='"+$('#find_insurance_name').val()+"' ";
                        }
                        if($('#find_start_date').val() && $('#find_end_date').val()){
                        		whereinfo +=" and cin.begin_time between to_date('"+$('#find_start_date').val()+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and  to_date('"+$('#find_end_date').val()+" 23:59:59','yyyy-mm-dd hh24:mi:ss')"
                        }
                        if($('#find_endTime').val() && $('#find_endTime1s').val()){
                        		whereinfo +=" and cin.end_time between to_date('"+$('#find_endTime').val()+"','yyyy-mm-dd hh24:mi:ss') and to_date('"+$('#find_endTime1').val()+"','yyyy-mm-dd hh24:mi:ss')"
                        }
                        
                        if($('#find_company_state').val()){
                        		whereinfo +=" and cin.status='"+$('#find_company_state')+"' ";
                        }
                        var fromsinfo = "";
                        
                        if($('#find_between_end_time').val()){//截止日期的天数
                        	//当前时间距离 保险截止时间距离的天数
                        		whereinfo +=" and turnc(ndate - cin.end_time)= "+$('#find_between_end_time').val()+"";
                        }

                        
                        if($('#find_hasinsurance').val()){
                        		if($('#find_hasinsurance').val() == '1'){//有保险
                        			whereinfo +=" and nvl(cin.ctm_archive_id,'-1')<>'-1' ";
                        		}else if($('#find_hasinsurance').val() == '2' ){//无保险
                        			whereinfo +=" and nvl(cin.ctm_archive_id,'-1')='-1' "
                        		}else{//全部
                        		}
                        }
                        var ndate = new Date();
                        //left join (select ctm_archive_id from gas_ctm_insurance where begin_time < to_date('"+date_now+"','yyyy-mm-dd hh24:mi:ss') and end_time > to_date('"+date_now+"','yyyy-mm-dd hh24:mi:ss') and status='1') cc on cc.ctm_archive_id = ar.ctm_archive_id
                        var bd ={
                        "cols":"cin.ctm_insurance_id,cin.ctm_archive_id as hasinsurance,cin.begin_time,cin.end_time,cin.name,cin.content,cin.file_id,cin.code,cin.status,cin.charge_unit_id,cin.user_id,ar.area_id as arAreaId,ar.customer_code as arCustomerCode,ar.customer_name as arCustomerName, ar.ctm_archive_id as arCtmArchiveId,ar.customer_address ",
					//	"cols":" distinct cc.ctm_archive_id as hasinsurance,cin.begin_time,cin.end_time,cin.name,cin.content,cin.file_id,cin.code,cin.status,cin.charge_unit_id,cin.user_id,ar.area_id,ar.customer_code as ar_customer_code,ar.customer_name as ar_customer_name,ar.ctm_archive_id as ar_ctm_archive_id,ar.customer_address ",
						"froms":"gas_ctm_archive ar inner join gas_ctm_insurance cin on cin.ctm_archive_id=ar.ctm_archive_id  ",
						"wheres": whereinfo ,
						"page":true,
						"limit":"50"
                        };
                       var base_url = '/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=';
                    	 	xw.setRestURL(base_url+ encodeURIComponent(JSON.stringify(bd)));
                    		 return "";
                    }
                })
        }
    }
}();

//  文件上传。。。
// var busiId= $.md5(JSON.stringify(document.getElementById('form'))+ new Date().getTime());
//var gpypic =false;
//$(document).on("click", '.fileinput-upload-button', function (e) {
//  e.preventDefault();
//  var form = new FormData(document.getElementById('form'));
//  $.ajax({
//      url: "/hzqs/sys/upload.do?busiId="+gpyphoto,
//      data: form,
//      dataType: 'text',
//      processData: false,
//      contentType: false,
//      async: false,
//      type: 'POST',
//      success: function (data) {
//          console.log(JSON.stringify(data));
//          console.log(JSON.parse(data));
//          if (JSON.parse(data).length != 0) {
//              bootbox.alert('导入成功！');
//              gpypic =true;
//          } else {
//              bootbox.alert("导入失败！");
//          }
//      },
//      error: function (data) {
//          console.log(data);
//          if(data.status == '413'){
//              bootbox.alert("文件不能超过1M");
//          }
//          $("#fileId").val('');
//      }
//  });
//});
$(document).on("click", '#fileuploadsss .fileinput-upload-button', function (e) {
        e.preventDefault();
        var form = new FormData(document.getElementById('fileuploadsss'));
        console.log(form.get("files[]"));
        $.ajax({
            url: "/hzqs/sys/upload.do?busiId="+gpyphoto,
            data: form,
            dataType: 'text',
            processData: false,
            contentType: false,
            async: false,
            type: 'POST',
            success: function (data) {
                console.log(JSON.stringify(data));
                console.log(JSON.parse(data));

                if (JSON.parse(data).length != 0) {
                    bootbox.alert('导入成功！');
                    gpypictureIds = true;
                } else {
                    bootbox.alert("导入失败！");
                }
            },
            error: function (data) {
                console.log(data);
                if(data.status == '413'){
                    bootbox.alert("文件不能超过1M");
                }
                $("#fileId").val('');
            }
        });
    });


var userinfo = JSON.parse(localStorage.getItem('user_info'));

$(document).on("click","#addsubmit",function(){
	if(!$('#code').val()){
		bootbox.alert("<center><h4>请填写保险编号。</h4></center>")
        return false;
	}
	if(!$('#customerCode').val()){
		bootbox.alert("<center><h4>请填写客户编号。</h4></center>")
        return false;
	}
	
	if(!$('#name').val()){
		bootbox.alert("<center><h4>请填写保险名称。</h4></center>");
		return false;
	}
//	if(!$('#chargeUnitId').val()){
//		bootbox.alert("<center><h4>请选择营业网点</h4></center>");
//		return false;
//	}
//	if(!$('#userId').val()){
//		bootbox.alert("<center><h4>请选择营业员</h4></center>");
//		return false;
//	}
	//根据客户编号去客户户表中查询客户
	//var customerresult = Restful.findNQ('')
	var resultq = Restful.findNQ( hzq_rest +'gasctmarchive/?query={"customerCode":"'+$('#customerCode').val()+'"}');
    console.log(resultq);
    var customerid = new Array();
    if(resultq == 'undefined' || resultq == null || resultq.length==0){
    		bootbox.alert("<center><h4>为查询到该客户，请填写正确的客户编号。</h4></center>")
        return false;
    }else if(resultq.length > 0){
    		
    		for(var i = 0;i< resultq.length ;i++){
    			if(resultq[i].customerState && resultq[i].ctmArchiveId && resultq[i].customerState != '99' && resultq[i].ctmArchiveId != 'undefined' && resultq[i].ctmArchiveId != 'null'){
    				customerid.push(resultq[i]);
    			}
    		}
    }
    if(customerid == null || customerid == '' || customerid.length ==0){
    		bootbox.alert("<center><h4>为查询到该客户信息，请填写正确的客户编号。</h4></center>");
        return false;
    }
    $('#customerName').val(customerid[0].customerName);
    console.log(customerid);
    var date = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
    var ctmInsuranceId = $.md5(Math.random()*100000000000 + new Date().getTime());
    var data_submit = {
    		"ctmInsuranceId":ctmInsuranceId,
    		"code":$('#code').val(),
    		"name":$('#name').val(),
    		"areaId":customerid[0].areaId,
    		"ctmArchiveId":customerid[0].ctmArchiveId,
    		"customerCode":customerid[0].customerCode,
    		"customerName":customerid[0].customerName,
    		"userId":JSON.parse(localStorage.getItem("user_info")).userId,
    		"createdBy":JSON.parse(localStorage.getItem("user_info")).userId,
		"modifiedBy":JSON.parse(localStorage.getItem("user_info")).userId,
		"chargeUnitId":JSON.parse(localStorage.getItem("user_info")).charge_unit_id,
		//"userId":$('#userId').val(),
		"endTime":$('#saveEndTime').val()+" 00:00:00",
		"beginTime":$('#saveBeginTime').val() +" 00:00:00",
		"fileId":gpyphoto
    };
    var result = Restful.insert(hzq_rest+"gasctminsurance",data_submit);
    if(result && result.success){
    		bootbox.alert("添加成功。");
    		window.location.reload();
    }
});
//$(document).on("click","#addsubmit",function(){
//  if(!$("#contractType").val()){
//      bootbox.alert("<center><h4>请选择合同类别。</h4></center>")
//      return false;
//  }
//
//  //发流程
//  var contractId = $.md5(Math.random()*100000000000 + new Date().getTime());
//  var date = new Date(moment().format("YYYY-MM-DD HH:mm:ss")+"-00:00");
//  console.log(date)
//  var form={};
//  var str ="";
//  form["contractId"] = contractId;
//
//  form["contractNo"] = $("#contractNo").val();
//  form["useGasPerson"] = $("#useGasPerson").val();
//  if( $("#contractType").val() == "2"){
//      str="增容预签"
//  }else if( $("#contractType").val() == "3"){
//      str="减容预签"
//  }else{
//      str="预签"
//  }
//  form["contractState"] = "0";
//  form["reservedField1"] = "1";
//  form["contractType"] = $("#contractType").val();
//  form["gasKind"] = "9";
//  form["areaId"] = JSON.parse(localStorage.getItem("user_info")).area_id;
//  form["createdBy"] = JSON.parse(localStorage.getItem("user_info")).userId;
//  form["sysTime"] = date;
//  form["createdTime"] = date;
//  form["modifiedBy"] = JSON.parse(localStorage.getItem("user_info")).userId;
//  form["modifiedTime"] = date;
//  if(gpypictureIds || gpypic){
//      form["reservedField2"] = gpyphoto;
//  }
//
//  var result = Restful.postDataR( hzq_rest +"gasctmcontract",JSON.stringify(form));
//  console.log(form);
//  var busiData={
//      "contractId":contractId,
//      "reservedField2":gpyphoto
//  }
//  flowjson = {
//      "flow_def_id":"FJMHT",
//      "ref_no":contractId,
//      "be_orgs":userinfo.area_id,
//      "operator":userinfo.userId,
//      "flow_inst_id":contractId,
//      "prop1str64":moment().format("YYYY-MM-DD HH:mm:ss"),
//      "prop2str64":$("#useGasPerson").val()+"(合同编号:"+$("#contractNo").val()+") — "+str,
//      "propstr128":"营业部合同管理员",
//      "propstr2048":busiData,
//      "override_exists": false
//  }
//
//  var flow_result = Restful.insert("/hzqs/psm/pbisn.do?fh=VFLSCGC000000J00&bd={}&resp=bd",flowjson);
//  console.log(flow_result)
//  if(flow_result.retmsg == "SUCCESS:1"){
//      bootbox.alert("<center><h4>提交成功。</h4></center>",function(){
//          window.location.reload();
//      });
//  }else{
//      var result = Restful.delByID( hzq_rest +"gasctmcontract",form.contractId);
//      console.log(result)
//      bootbox.alert("<center><h4>提交失败。</h4></center>",function(){
//          window.location.reload();
//      })
//  }
//});


//查询条件
/*
var find_areaId,find_gasTypeId,find_useGasPerson,find_contractState,find_contractCode,status,find_start_date,find_end_date,find_endTime,find_endTime1,find_contractType;
                        if ($('#find_areaId').val()) {
                            find_areaId = RQLBuilder.equal("areaId", $('#find_areaId').val());
                        }else{
                            find_areaId = RQLBuilder.condition_fc("areaId","$in",JSON.stringify(loginarea));
                        }
                      if ($('#find_gasTypeId').val()) {
                          find_gasTypeId = RQLBuilder.like("gasType", $('#find_gasTypeId').val());
//                      }
//                      if ($('#find_contractState').val()) {
//                          console.log($('#find_contractState').val());
//                          find_contractState = RQLBuilder.equal("contractState", $('#find_contractState').val());
//                      }
//                      console.log(find_contractState)
//                      if ($('#find_useGasPerson').val()) {
//                          find_useGasPerson = RQLBuilder.like("useGasPerson", $('#find_useGasPerson').val());
//                      }
//                      if ($('#find_contractCode').val()) {
//                          find_contractCode = RQLBuilder.like("contractNo", $('#find_contractCode').val());
//                      }
//                      if ($('#find_contractType').val()) {
//                          find_contractType = RQLBuilder.equal("contractType", $('#find_contractType').val());
//                      }

                        if ($('#status').val()) {
                            status = RQLBuilder.equal("status", $('#status').val());
                        }
//                      if($("#find_start_date").val()){
//                          find_start_date = RQLBuilder.condition("signupTime","$gte","to_date('"+ $("#find_start_date").val()+" 00:00:00','yyyy-MM-dd HH24:mi:ss')");
//                      }
//                      if($("#find_end_date").val()){
//                          find_end_date = RQLBuilder.condition("signupTime","$lte","to_date('"+ $("#find_end_date").val()+" 23:59:59','yyyy-MM-dd HH24:mi:ss')");
//                      }
                        if($("#find_endTime").val()){
                            find_endTime = RQLBuilder.condition("endDate","$gte","to_date('"+ $("#find_endTime").val()+" 00:00:00','yyyy-MM-dd HH24:mi:ss')");
                        }
                        if($("#find_endTime1").val()){
                            find_endTime1 = RQLBuilder.condition("endDate","$lte","to_date('"+ $("#find_endTime1").val()+" 23:59:59','yyyy-MM-dd HH24:mi:ss')");
                        }
                      //  var contractType = RQLBuilder.equal("gasKind","9");
                        var filter = RQLBuilder.and([
                            contractType,find_areaId,find_gasTypeId,find_useGasPerson,find_contractState,find_contractCode,status,find_start_date,find_end_date,find_endTime,find_endTime1,find_contractType
                        ]);
*/