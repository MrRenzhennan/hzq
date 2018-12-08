//非居民新换表销售量统计
$(".export-excel").attr("data-table", ".tabPrint");
		$(".export-excel").attr("data-filename", $("#find_date").val() + "&nbsp;&nbsp;新换表非居民用户在" + $("#find_date").val() + "应收量统计明细");
		$(".export-excel").on("click", function(e) {
			e.preventDefault();
			var exportTable = $(this).data("table");
			var filename = $(this).data("filename");
			var ignoreColumn = ""; //$(this).data("ignorecolumn");
			$(exportTable).tableExport({
				fileName: filename,
				type: 'excel',
				escape: 'false',
				excelstyles: ['border-bottom', 'border-top', 'border-left', 'border-right'],
				ignoreColumn: '[' + ignoreColumn + ']'
			});
		});

		$.fn.datetimepicker.dates['zh-CN'] = {
			days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
			daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
			daysMin: ["日", "一", "二", "三", "四", "五", "六", "日"],
			months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
			monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
			today: "今天",
			suffix: [],
			meridiem: ["上午", "下午"]
		};


		/*document.onkeydown = function () {
		    keydown();
		};
		function keydown() {
		    //P 空格 会车 event.keyCode==80 || event.keyCode==32 || event.keyCode==13
		    if (event.keyCode == 13) {
		        window.print();
		    }
		}*/

		function getQueryString(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
			var r = window.location.search.substr(1).match(reg);
			if(r != null) return decodeURIComponent(r[2]);
			return null;
		}

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
			if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
			for(var k in dataJson)
				if(new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (dataJson[k]) : (("00" + dataJson[k]).substr(("" + dataJson[k]).length)));
			return fmt;
		}

		function edit(id) {
			var v = $("#" + id).html();
			$("#" + id).html("<input type='number' id='" + id + "_text' oldid='" + id + "' oldvalue='" + v + "' value='" + v + "' onblur='outEdit(this.id)'/>");
			$("#" + id + "_text").focus();
			$("#" + id).attr("onblur", "")
		}

		function outEdit(id) {
			var ov = $("#" + id).attr("oldvalue");
			var oid = $("#" + id).attr("oldid");
			$("#" + oid).html($("#" + id).val());
		}

		function operationData(operationDataJson) {
			for(var i = 0; i < operationDataJson.length; i++) {
				var inputCols = operationDataJson[i].ic;
				var operator = operationDataJson[i].op;
				var out = $("#tbody_" + inputCols[0]).html() * 1;
				for(var j = 1; j < inputCols.length; j++) {
					var value = $("#tbody_" + inputCols[j]).html() * 1;
					if(operator == "+") {
						out = out + value;
					}
				}
				var outputColType = operationDataJson[i].ty;
				var outputCol = operationDataJson[i].oc;
				if(outputColType && outputColType == "f") {
					$("#tbody_" + outputCol).html(toAmount(out + ""));
				} else {
					$("#tbody_" + outputCol).html(out);
				}

			}
		}

		$(function() {});
		
		

		jQuery(document).ready(function() {
			ComponentsPickers.init();
			
			
			$("#find_date").val(date_format(new Date(), "yyyy年"));
			$("#title").html($("#find_date").val() + "&nbsp;&nbsp;新换表非居民用户在" + $("#find_date").val() + "应收量统计明细");
			//查询按钮时间
			// ComponentsDropdowns.init();

			if(UserInfo.item().station_id == '1') {
				console.log("cahnge")
				var inhtml = "<option value='" + UserInfo.item().userId + "' selected>" + UserInfo.item().employee_name + "</option>";
				$("#find_areaId").val(UserInfo.item().area_id).change();;
				$("#find_areaId").attr({
					disabled: "disabled"
				})
			}
			$('#find_areaId').html('<option value="" name="全部"">全部</option>');
			$.each(GasModSys.areaHelper.getRawData(), function(idx, row) {
				if('1' == UserInfo.item().area_id) {
					$('#find_areaId').append('<option value="' + row.areaId + '" name="' + row.areaId + '">' + row.areaName + '</option>');
				} else if(row.areaId == UserInfo.item().area_id) {
					$('#find_areaId').append('<option value="' + row.areaId + '" name="' + row.areaId + '">' + row.areaName + '</option>');
				}
			});

			if('1' != UserInfo.item().area_id) {
				$("#find_areaId").val(UserInfo.item().area_id).change();;
				$("#find_areaId").attr({
					disabled: "disabled"
				})
			}

			var month_arr = {1: "onedata", 2: "twodata", 3: "threedata", 4: "fourdata", 5: "fivedata",
				6: "sixdata", 7: "sevendata", 8: "eightdata", 9: "ninedata", 10: "tendata",
				11: "elevendata", 12: "twelvedata"
			};
			//Restful.find

			$('#find_sign').on('click', function(e) {
				if(!$('#find_areaId').val()) {
					bootbox.alert("请选择供气区域。");
					return;
				}
				if($("#find_date").val() == "") {
					bootbox.alert("请您选择要查询的年份！");
					return;
				}
				$("#title").html($("#find_date").val() + "&nbsp;&nbsp;新换表非居民用户在" + $("#find_date").val() + "应收量统计明细");
				var userInfo = JSON.parse(localStorage.getItem("user_info"));
				if(userInfo.employee_name) {
					$("#foot_r0_c2").html(userInfo.employee_name);
				} else {
					$("#foot_r0_c2").html("管理员");
				}
				$("#foot_r0_c13").html(date_format(new Date(), "yyyy-MM-dd"));

				$("#btn_down_detail").removeClass("disabled");
				$("#btn_down_detail").removeClass("gray");
				$("#btn_down_detail").addClass("green");

				$("#btn_print_page").removeClass("disabled");
				$("#btn_print_page").removeClass("gray");
				$("#btn_print_page").addClass("green");

$('#detail_for_new').html("");

var search_year_h = $('#find_date').val();
var search_year =search_year_h.substring(0,4);//选择的年份
var search_year_month_day = [];
var datayearmonthday = GasModMrd.enumStatisticsMonth;
var totalyear = GasModMrd.enumOneYear;
console.log(datayearmonthday);
var sqlcols = "";

for(var j=0;j<12;j++){//12个月
	if(j==0){
		sqlcols += " sum(case when ( y.trade_date >=to_date('"+((parseInt(search_year) -1))+"-"+datayearmonthday[(j+1)][0]+"','yyyy-mm-dd hh24:mi:ss') and y.trade_date<=to_date('"+search_year+"-"+datayearmonthday[(j+1)][1]+"','yyyy-mm-dd hh24:mi:ss')"+
		" ) then y.gas  else 0 end ) over(partition by a.customer_code) as "+month_arr[(j+1)]+",";
	}else{
		sqlcols += " sum(case when ( y.trade_date >=to_date('"+search_year+"-"+datayearmonthday[(j+1)][0]+"','yyyy-mm-dd hh24:mi:ss') and y.trade_date<=to_date('"+search_year+"-"+datayearmonthday[(j+1)][1]+"','yyyy-mm-dd hh24:mi:ss')"+
		" ) then y.gas  else 0 end ) over(partition by a.customer_code) as "+month_arr[(j+1)]+",";
	}
}

var whereinfo ="";
if($('#find_flow_min').val() && $('#find_flow_max').val()){
	whereinfo +=" and to_number(nvl(d.rating_flux,'-1'))>=to_number('"+$('#find_flow_min').val()+"') and to_number(nvl(d.rating_flux,'-1'))<=to_number('"+$('#find_flow_max').val()+"') ";
}
if($('#find_charge_meter_min').val() && $('#find_charge_meter_max').val()){
	whereinfo +=" and (mr.copy_time between to_date('"+$('#find_charge_meter_min').val()+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and to_date('"+$('#find_charge_meter_max').val()+" 23:59:59','yyyy-mm-dd hh24:mi:ss')) ";
}
whereinfo +=" and a.area_id='"+$('#find_areaId').val()+"' ";
var datalength =0;

var bd = {
	"cols":" distinct a.customer_code,a.customer_name,a.customer_address,"
	+"g.gas_type_name,a.gas_type_id,d.rating_flux,mr.copy_time,"
	+sqlcols+""
	+"sum( case when( y.trade_date >=to_date('"+((parseInt(search_year) -1))+"-"+totalyear[0]+"','yyyy-mm-dd hh24:mi:ss')  and y.trade_date<=to_date('"+search_year+"-"+totalyear[1]+"','yyyy-mm-dd hh24:mi:ss') "+
		" ) then y.gas else 0 end ) over(partition by y.customer_code) as totaldata ",
	"froms":" gas_ctm_archive a inner join gas_mrd_meter_reading mr on mr.ctm_archive_id = a.ctm_archive_id "
	+" inner join gas_biz_gas_type g on g.gas_type_id=a.gas_type_id left join gas_report_ysl_new y on y.customer_code=a.customer_code left join gas_mtr_meter_flow d on d.meter_flow_id=y.meter_flow_id ",
	"wheres":" a.customer_kind='9' and mr.copy_type='72' and (mr.copy_time between to_date('"+((parseInt(search_year) -1))+"-"+totalyear[0]+"','yyyy-mm-dd hh24:mi:ss')  and to_date('"+search_year+"-"+totalyear[1]+"','yyyy-mm-dd hh24:mi:ss'))"
	+""+whereinfo,
	"page":false
};
				
				$.ajax({
					url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
					type: "POST",
					contentType: "application/json;charset=utf-8",
					data: JSON.stringify(bd),
					dataType: "json",
					success: function (results) {
						console.log("result",results);
						if(results && results.rows && results.rows.length > 0) {
							
							var rows = results.rows;
							var tablebodyhtml = '';
							var ct = 2;
							datalength = rows.length;
							for(var i = 0; i < rows.length; i++) {
								/*console.log("--------");
								console.log(rows[i]);*/
								ct += i;
								tablebodyhtml += '<tr align="center">';
								for(var s = 1; s <= 21; s++) {
									var rowsc = rows[i];
									var rowutime = (rows[i].copyTime).split("T");
									if(s == 1) {
										tablebodyhtml += '<td id="tbody_r' + ct + '_cc' + (s) + '" rowspan="" colspan="1">' + (i + 1) + '</td>';
									} else
									if(s == 2) {
										tablebodyhtml += '<td id="tbody_r' + ct + '_cc' + (s) + '" rowspan="" colspan="1">' + rows[i].customerCode + '</td>';
									} else
									if(s == 3) {
										tablebodyhtml += '<td id="tbody_r' + ct + '_cc' + (s) + '" rowspan="" colspan="1">' + rows[i].customerName + '</td>';
									} else
									if(s == 4) {
										tablebodyhtml += '<td id="tbody_r' + ct + '_cc' + (s) + '" rowspan="" colspan="1">' + rows[i].customerAddress + '</td>';
									} else
									if(s == 5) {
										tablebodyhtml += '<td id="tbody_r' + ct + '_cc' + (s) + '" rowspan="" colspan="1">' + rows[i].gasTypeName + '</td>';
									} else
									if(s == 6) {
										tablebodyhtml += '<td id="tbody_r' + ct + '_cc' + (s) + '" rowspan="" colspan="1">'+(rows[i].ratingFlux?rows[i].ratingFlux:'--')+'</td>';
									} else
									if(s == 7) {
										tablebodyhtml += '<td id="tbody_r' + ct + '_cc' + (s) + '" rowspan="" colspan="1">--</td>';
									}else if(s == 8){//statistics_noresidents_new_gas_meter
										tablebodyhtml += '<td id="tbody_r' + ct + '_cc' + (s) + '" rowspan="" colspan="1">' + rowutime + '</td>';
									}
									else if(s >= 9 && s <= 20) {
										tablebodyhtml += '<td id="tbody_r' + ct + '_cc' + (s) + '" rowspan="" colspan="1">' + rowsc[(month_arr[s-8])] + '</td>';
									}
									if(s == 21) { //totaldata
										tablebodyhtml += '<td id="tbody_r' + ct + '_cc' + (s) + '" rowspan="" colspan="1">' + rowsc.totaldata + '</td>';
									}
								}
								tablebodyhtml += "</tr>";
							}
							$('#detail_for_new').append(tablebodyhtml);
							
							console.log(datalength);
				var sum1 =0,sum2 =0,sum3 =0,sum4 =0,sum5 =0,sum6 =0,sum7 =0,sum8 =0,sum9 =0;
				var sum10=0,sum11=0,sum12=0,sumt =0;
				//2开始
				console.log($('#detail_for_new .tbody_r2_c8'));
				console.log($('#detail_for_new .tbody_r'+(2+i)+'_c8'));
				var start_num = 2;
				/*for(var i=0;i<datalength;i++){
					var sum_1 = $('#detail_for_new .tbody_r'+(2+i)+'_c8').innerHTML;
					console.log(sum_1);
					sum1 = Number(sum_1)+sum1;
				}*/
				//var cdt = 8;
				console.log($('#tbody').find("td[id$='_cc9']"));
				
				
				$("#detail_for_new").find("td[id$='_cc9']").each(function(i){                                
                	if(i>=0)sum1+=parseInt($(this).text());
            	});
				$("#detail_for_new").find("td[id$='_cc10']").each(function(i){                                
                    if(i>=0)sum2+=parseInt($(this).text());
                });
                $("#detail_for_new").find("td[id$='_cc11']").each(function(i){                                
                    if(i>=0)sum3+=parseInt($(this).text());
                });
                $("#detail_for_new").find("td[id$='_cc12']").each(function(i){                                
                    if(i>=0)sum4+=parseInt($(this).text());
                });
                $("#detail_for_new").find("td[id$='_cc13']").each(function(i){                                
                    if(i>=0)sum5+=parseInt($(this).text());
                });
                 $("#detail_for_new").find("td[id$='_cc14']").each(function(i){                                
                    if(i>=0)sum6+=parseInt($(this).text());
                });
                 $("#detail_for_new").find("td[id$='_cc15']").each(function(i){                                
                    if(i>=0)sum7+=parseInt($(this).text());
                });
                 $("#detail_for_new").find("td[id$='_cc16']").each(function(i){                                
                    if(i>=0)sum8+=parseInt($(this).text());
                });
                 $("#detail_for_new").find("td[id$='_cc17']").each(function(i){                                
                    if(i>=0)sum9+=parseInt($(this).text());
                });
                 $("#detail_for_new").find("td[id$='_cc18']").each(function(i){                                
                    if(i>=0)sum10+=parseInt($(this).text());
                });
                 $("#detail_for_new").find("td[id$='_cc19']").each(function(i){                                
                    if(i>=0)sum11+=parseInt($(this).text());
                });
                $("#detail_for_new").find("td[id$='_cc20']").each(function(i){                                
                    if(i>=0)sum12+=parseInt($(this).text());
                });
				$("#detail_for_new").find("td[id$='_cc21']").each(function(i){                                
                    if(i>=0)sumt+=parseInt($(this).text());
                });
				console.log(sum1);
				var tctablebodyhtml = '<tr align="center" style="background-color:#eee;">'
									+'<td id="tbody_r0_c1" rowspan="1" colspan="1">合计：</td>'
									+'<td id="tbody_r0_c2" rowspan="1" colspan="1"></td>'
									+'<td id="tbody_r0_c3" rowspan="1" colspan="1"></td>'
									+'<td id="tbody_r0_c4" rowspan="1" colspan="1"></td>'
									+'<td id="tbody_r0_c5" rowspan="1" colspan="1"></td>'
									+'<td id="tbody_r0_c6" rowspan="1" colspan="1"></td>'
									+'<td id="tbody_r0_c7" rowspan="1" colspan="1"></td>'
									+'<td id="tbody_r0_c8" rowspan="1" colspan="1"></td>'
									+'<td id="tbody_r0_c9" rowspan="1" colspan="1">'+sum1+'</td>'
									+'<td id="tbody_r0_c10" rowspan="1" colspan="1">'+sum2+'</td>'
									+'<td id="tbody_r0_c11" rowspan="1" colspan="1">'+sum3+'</td>'
									+'<td id="tbody_r0_c12" rowspan="1" colspan="1">'+sum4+'</td>'
									+'<td id="tbody_r0_c13" rowspan="1" colspan="1">'+sum5+'</td>'
									+'<td id="tbody_r0_c14" rowspan="1" colspan="1">'+sum6+'</td>'
									+'<td id="tbody_r0_c15" rowspan="1" colspan="1">'+sum7+'</td>'
									+'<td id="tbody_r0_c16" rowspan="1" colspan="1">'+sum8+'</td>'
									+'<td id="tbody_r0_c17" rowspan="1" colspan="1">'+sum9+'</td>'
									+'<td id="tbody_r0_c18" rowspan="1" colspan="1">'+sum10+'</td>'
									+'<td id="tbody_r0_c19" rowspan="1" colspan="1">'+sum11+'</td>'
									+'<td id="tbody_r0_c20" rowspan="1" colspan="1">'+sum12+'</td>'
									+'<td id="tbody_r0_c21" rowspan="1" colspan="1">'+sumt+'</td>'
								+'</tr>';
				$('#detail_for_new').append(tctablebodyhtml);
							
						}     
					}
				});
				
				
			});

		});