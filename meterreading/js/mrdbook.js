/*reated by Administrator on 2017/4/20 0020.
 */

/*var getwheres = function(flag){
    var whereinfo = '1=1';
    if(stationid == '2' && userid){//抄表员
        whereinfo +=" and b.serviceper_id='"+userid+"' ";
        whereinfo +=" and b.area_id='"+areaid+"' ";
        vinfo +=" and r.area_id='"+areaid+"' and r.serviceper_id='"+userid+"' ";
        ainfo +=" and area_id='"+areaid+"' ";
    }else if(stationid == '1' && userid){//核算员
        whereinfo +=" and b.countper_id='"+userid+"' ";
        whereinfo +=" and b.area_id='"+areaid+"' ";
        vinfo +=" and r.area_id='"+areaid+"' and r.countper_id='"+userid+"' ";
        ainfo +=" and area_id='"+areaid+"' ";
    }else{
        whereinfo +=" and b.area_id in ( select area_id "+
            " from gas_biz_area where parent_area_id='"+areaid+"' and status<>'3' union "+
            " select area_id from gas_biz_area where status<>'3' start with area_id='"+areaid+"' connect by prior area_id=parent_area_id "+
            " )  and b.status<>'3' ";
        vinfo +=" and r.area_id in ( select area_id "+
            " from gas_biz_area where parent_area_id='"+areaid+"' and status<>'3' union "+
            " select area_id from gas_biz_area where status<>'3' start with area_id='"+areaid+"' connect by prior area_id=parent_area_id "+
            " )  ";
        ainfo +=" and area_id in ( select area_id "+
            " from gas_biz_area where parent_area_id='"+areaid+"' and status<>'3' union "+
            " select area_id from gas_biz_area where status<>'3' start with area_id='"+areaid+"' connect by prior area_id=parent_area_id "+
            " )  ";
    }
}*/
var MrdBookAction = function() {
	var xw;

	var login_user = JSON.parse(localStorage.getItem("user_info"));
	var areaid = login_user.area_id;
	var stationid = login_user.station_id;
	var userid = login_user.userId;
	var operateFormat = function() {
		return {
			f: function(val) {
				return "<a href='JavaScript:;'  data-id='" + val + "' class='btn_modify'>修改</a>"
			}
		}
	}();

	/*var find_btn = function(){

	}*/

	//global

	// _remap.countperId ="db@GAS_SYS_USER,userId,employeeName";
	/* global_remap.serviceperId="db@GAS_SYS_USER,userId,employeeName";
	 global_remap.countperId="db@GAS_SYS_USER,userId,employeeName";
	 global_remap.bookType="1:居民,2:非居民";*/
	return {
		init: function() {

			this.reload();
			this.initHelper();
			this.initBookTree();
			this.linkage();
		},
		initHelper: function() {
			var login_user = JSON.parse(localStorage.getItem("user_info"));
			console.log(login_user);
			$('#find_areaId').html('<option value="" name="全部"">全部</option>');
			$.each(GasModSys.areaHelper.getRawData(), function(idx, row) {
				if('1' == UserInfo.item().area_id) {
					$('#find_areaId').append('<option value="' + row.areaId + '" name="' + row.areaId + '">' + row.areaName + '</option>');
				} else if(row.areaId == UserInfo.item().area_id) {
					$('#find_areaId').append('<option value="' + row.areaId + '" name="' + row.areaId + '">' + row.areaName + '</option>');
				}
			});

			if(UserInfo.item().station_id == '1') {
				console.log("cahnge")
				var inhtml = "<option value='" + UserInfo.item().userId + "' selected>" + UserInfo.item().employee_name + "</option>";
				$("#find_areaId").val(UserInfo.item().area_id).change();;
				$("#find_areaId").attr({
					disabled: "disabled"
				})

				$("#find_countperId").html(inhtml);
				$("#find_countperId").val(UserInfo.item().userId).change();;
				$("#find_countperId").attr({
					disabled: "disabled"
				})

				GasModSys.copyUsersInArea({
					"areaId": $('#find_areaId').val(),
					"countperId": $('#find_countperId').val(),
					"cb": function(data) {
						var inhtml = "<option value=''>全部</option>";
						if(data) {
							$.each(data, function(idx, row) {
								inhtml += '<option value="' + row.userId + '">' + row.employeeName + '</option>';
							})
						}
						$("#find_serviceperId").html(inhtml);
						$("#find_serviceperId").val("").change();

					}
				})

			} else {
				$('#find_countperId').on('change', function(e) {
					console.log("change counter:" + e + "." + $('#find_countperId').val());
					GasModSys.copyUsersInArea({
						"areaId": $('#find_areaId').val(),
						"countperId": $('#find_countperId').val(),
						"cb": function(data) {
							var inhtml = "<option value=''>全部</option>";
							if(data) {
								$.each(data, function(idx, row) {
									inhtml += '<option value="' + row.userId + '">' + row.employeeName + '</option>';
								})
							}
							$("#find_serviceperId").html(inhtml);
							$("#find_serviceperId").val("").change();

						}
					})
					// xw.autoResetSearch();
				});
			}

			/*GasModSys.areaList({
			    "areaId":login_user.area_id,
			    "cb":function(data){
			        var inhtml = "<option value=''>全部</option>";
			        if(data){
			            $.each(data,function(idx,row){
			                inhtml += '<option value="'+row.areaId+'">'+row.areaName+'</option>';
			            })
			            $("#find_areaId").html(inhtml);
			            $("#find_countperId").val("").change();
			        }
			    }
			})*/

			$('#find_areaId').on('change', function(e) {
				console.log("change area:" + e + "." + $('#find_areaId').val());
				GasModSys.counterUsersInArea({
					"areaId": $('#find_areaId').val(),
					"cb": function(data) {
						var inhtml = "<option value=''>全部</option>";
						$.each(data, function(idx, row) {
							inhtml += '<option value="' + row.userId + '">' + row.employeeName + '</option>';
						})
						$("#find_countperId").html(inhtml);
						$("#find_countperId").val("").change();

					}
				})
				//   xw.autoResetSearch();
			})

			/* $('#find_countperId').on('change',function(e){
			     console.log("change counter:"+e+"."+$('#find_countperId').val());
			     GasModSys.copyUsersInArea({
			         "areaId":$('#find_areaId').val(),
			         "countperId":$('#find_countperId').val(),
			         "cb":function(data){
			             var inhtml = "<option value=''>全部</option>";
			             if(data){
			                 $.each(data,function(idx,row){
			                     inhtml += '<option value="'+row.userId+'">'+row.employeeName+'</option>';
			                 })
			             }
			             $("#find_serviceperId").html(inhtml);
			             $("#find_serviceperId").val("").change();

			         }
			     })
			     // xw.autoResetSearch();
			 });*/

		},
		reload: function() { //添加 —— 正常户数，总户数，暂停用气户数,长期不用户数

			$('#divtable').html('');
			var base_url = '/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=';
			var vinfo = '';
			var ainfo = ' where 1=1';
			if(stationid == '2' && userid) { //抄表员
				vinfo += " and r.area_id='" + areaid + "' and r.serviceper_id='" + userid + "' ";
				ainfo += " and area_id='" + areaid + "' ";
			} else if(stationid == '1' && userid) { //核算员
				vinfo += " and r.area_id='" + areaid + "' and r.countper_id='" + userid + "' ";
				ainfo += " and area_id='" + areaid + "' ";
			} else {
				vinfo += " and r.area_id in ( select area_id " +
					" from gas_biz_area where parent_area_id='" + areaid + "' and status<>'3' union " +
					" select area_id from gas_biz_area where status<>'3' start with area_id='" + areaid + "' connect by prior area_id=parent_area_id " +
					" )  ";
				ainfo += " and area_id in ( select area_id " +
					" from gas_biz_area where parent_area_id='" + areaid + "' and status<>'3' union " +
					" select area_id from gas_biz_area where status<>'3' start with area_id='" + areaid + "' connect by prior area_id=parent_area_id " +
					" )  ";
			}
			var bd = {
				"cols": "b.reserved_field1,b.reserved_field2,b.bookId,b.bookCode,b.areaId,b.countperId,b.serviceperId,b.copyCycle,b.copyMonth,b.copyRuleday," +
					"b.propertyUnit,b.doorCount,s.normal_count,s.suspended_count,s.long_suspended_count,cc.plancount," +
					"s.all_customer_count,s.un_unbolt_count," +
					"b.oldBookNo,b.bookType,b.boosterCode,b.dailyMeasure,b.address,b.remark",
				"froms": "gas_mrd_book b " +
					" left join (select count(1) plancount,r.book_id from gas_mrd_meter_reading r where r.copy_state in ('0','1') " + vinfo + " group by r.book_id) cc on cc.book_id = b.book_id " +
					"left join (select distinct book_id,sum(case when customer_state='01' then 1 else 0 end) over(partition by book_id) as normal_count, " +
					" sum(case when customer_state='02' then 1 else 0 end) over(partition by book_id) as suspended_count, " +
					" sum(case when customer_state='04' then 1 else 0 end) over(partition by book_id) as long_suspended_count, " +
					" sum(case when customer_state='03' then 1 else 0 end) over(partition by book_id) as dismantle_count, " +
					" sum(case when customer_state<>'99' then 1 else 0 end) over(partition by book_id) as all_customer_count, " +
					" sum(case when customer_state='00' then 1 else 0 end) over(partition by book_id) as un_unbolt_count " +
					" from gas_ctm_archive " + ainfo +
					") s on s.book_id = b.book_id ",
				"wheres": " 1=0 ",
				"page": "true",
				"limit": 50
			};

			xw = XWATable.init({
				divname: "divtable",
				//----------------table的选项-------
				pageSize: 10,
				columnPicker: true,
				transition: 'fade',
				//checkboxes : true,
				checkAllToggle: true,
				//----------------基本restful地址---
				restURL: base_url + encodeURIComponent(JSON.stringify(bd)),
				//  key_column:'bookId',
				coldefs: [{
						col: "bookId",
						friendly: "抄表本ID",
						unique: true,
						hidden: true,
						nonedit: "nosend",
						readonly: "readonly",
						sorting: false,
						index: 1
					},
					{
						col: "areaId",
						friendly: "供气区域",
						format: GasModSys.areaFormat,
						inputsource: "select",
						readonly: "readonly",
						// disabled:true,
						sorting: false,
						index: 2
					},
					{
						col: "countperId",
						friendly: "核算员",
						format: GasModSys.employeeNameFormat,
						sorting: false,
						index: 3
					},
					{
						col: "serviceperId",
						friendly: "客户服务员",
						format: GasModSys.employeeNameFormat,
						sorting: false,
						index: 4
					},
					{
						col: "bookCode",
						friendly: "抄表本编号",
						nonedit: "nosend",
						//  hidden:true,
						readonly: "readonly",
						index: 5
					},
					{
						col: "copyCycle",
						friendly: "抄表周期",
						format: GasModBas.copyCycleFormat,
						sorting: false,
						inputsource: "select",
						index: 6
					},
					{
						col: "copyMonth",
						friendly: "抄表月份",
						sorting: false,
						index: 7
					},
					{
						col: "copyRuleday",
						orgCol: "bookType",
						friendly: "抄表例日",
						format: GasModMrd.copytyperuledayFormat,
						sorting: false,
						index: 8
					},
					{
						col: "plancount",
						friendly: "生成抄表记录条数",
						sorting: false,
						index: 9
					},
					{
						col:"reservedField2",
						friendly:"例日",
						sorting:false,
						index:30
					},
					{
						col:"reservedField1",
						friendly:"抄表月份",
						sorting:false,
						index:31
					},
					{
						col: "propertyUnit",
						friendly: "产权单位",
						hidden: true,
						sorting: false,
						index: 10
					},
					{
						col: "doorCount",
						friendly: "抄表本定义户数",
						readonly: "readonly",
						sorting: false,
						index: 11
					},
					{
						col: "allCustomerCount",
						friendly: "总户数",
						readonly: "readonly",
						sorting: false,
						index: 12
					},
					{
						col: "normalCount",
						friendly: "正常户数",
						readonly: "readonly",
						sorting: false,
						index: 13
					},
					{
						col: "suspendedCount",
						friendly: "暂停用气户数",
						readonly: "readonly",
						sorting: false,
						index: 14
					},
					{
						col: "longSuspendedCount",
						friendly: "长期不用气户数",
						readonly: "readonly",
						sorting: false,
						index: 15
					},
					{
						col: "unUnboltCount",
						friendly: "未开栓户数",
						sorting: false,
						index: 16
					},
					{
						col: "dismantleCount",
						friendly: "拆除户数",
						sorting: false,
						index: 17
					},
					{
						col: "oldBookNo",
						friendly: "原本号",
						sorting: false,
						hidden: true,
						readonly: "readonly",
						index: 18
					},
					{
						col: "bookType",
						friendly: "本类型",
						format: GasModBas.bookTypeFormat,
						inputsource: "select",
						readonly: "readonly",
						index: 19
					},
					{
						col: "boosterCode",
						friendly: "调压箱编号",
						hidden: true,
						sorting: false,
						index: 20
					},
					{
						col: "dailyMeasure",
						friendly: "户日均用气量",
						sorting: false,
						index: 21
					},
					{
						col: "address",
						friendly: "抄表本地址",
						sorting: false,
						//validate:""
						index: 22
					},
					{
						col: "remark",
						friendly: "备注",
						validate: "length[0-200]",
						sorting: false,
						index: 23
					},
					{
						col: "bookId",
						friendly: "操作",
						format: operateFormat,
						sorting: false,
						index: 50
					}

				],
				findFilter: function() { //find function
					var base_url = '/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=';
					var whereinfo = '1=1 ';
					var ainfo = ' where 1=1';
					var binfo = '';
					if($('#find_areaId').val()) {
						whereinfo += " and b.area_id ='" + $('#find_areaId').val() + "' ";
						binfo += " and r.area_id='" + $('#find_areaId').val() + "' ";
						ainfo + " and area_id='" + $('#find_areaId').val() + "' ";
					} else {

						if(stationid == '2' && userid) { //抄表员

							whereinfo += " and b.area_id='" + areaid + "' ";
							binfo += " and r.area_id='" + areaid + "' ";
							ainfo += " and area_id='" + areaid + "' ";
						} else if(stationid == '1' && userid) { //核算员
							whereinfo += " and b.countper_id='" + userid + "' ";
							whereinfo += " and b.area_id='" + areaid + "' ";
							binfo += " and r.area_id='" + areaid + "' and r.countper_id='" + userid + "' ";
							ainfo += " and area_id='" + areaid + "' ";
						} else {
							whereinfo += " and b.area_id in ( select area_id " +
								" from gas_biz_area where parent_area_id='" + areaid + "' and status<>'3' union " +
								" select area_id from gas_biz_area where status<>'3' start with area_id='" + areaid + "' connect by prior area_id=parent_area_id " +
								" )  and b.status<>'3' ";
							binfo += " and r.area_id in ( select area_id " +
								" from gas_biz_area where parent_area_id='" + areaid + "' and status<>'3' union " +
								" select area_id from gas_biz_area where status<>'3' start with area_id='" + areaid + "' connect by prior area_id=parent_area_id " +
								" )  ";
							ainfo += " and area_id in ( select area_id " +
								" from gas_biz_area where parent_area_id='" + areaid + "' and status<>'3' union " +
								" select area_id from gas_biz_area where status<>'3' start with area_id='" + areaid + "' connect by prior area_id=parent_area_id " +
								" )  ";
						}
					}
					if($('#find_countperId option:selected').val()) {
						whereinfo += " and b.countper_id ='" + $('#find_countperId option:selected').val() + "' ";
						binfo += " and r.countper_id='" + $('#find_countperId option:selected').val() + "' ";
						//ainfo +=" and area_id='"+areaid+"' ";
					} else {
						if(stationid == '1' && userid) { //核算员
							whereinfo += " and b.countper_id='" + userid + "' ";
							binfo += " and r.countper_id='" + $('#find_countperId option:selected').val() + "' ";
							ainfo += " and area_id='" + areaid + "' ";
						}
					}
					if($('#find_serviceperId option:selected').val()) {
						whereinfo += " and b.serviceper_id='" + $('#find_serviceperId option:selected').val() + "' ";
						binfo += " and r.serviceper_id='" + $('#find_serviceperId option:selected').val() + "' ";

					} else {
						if(stationid == '2' && userid) { //抄表员
							whereinfo += " and b.serviceper_id='" + userid + "' ";
							binfo += " and r.serviceper_id='" + $('#find_serviceperId option:selected').val() + "' ";
							ainfo += " and area_id='" + areaid + "' ";
						}
					}

					if($('#bookNumber').val()) {
						whereinfo += " and b.book_code = '" + $('#bookNumber').val() + "'";
					}
					if($('#bookAddress').val()) {
						//whereinfo +=" and b.address like '%"+$('#bookAddress').val()+"%' ";
						whereinfo += " and instr(b.address,'" + $('#bookAddress').val() + "') > 0 ";
					}
					if($("#newBook").is(":checked")) {
						whereinfo += " and (b.countper_id is null or b.serviceper_id is null) ";
					}
					if($('#find_iscreate option:selected').val() == '1') {
						whereinfo += " and nvl(cc.plancount,0) > 0 ";
					} else if($('#find_iscreate option:selected').val() == '2') {
						whereinfo += " and nvl(cc.plancount,0) = 0 ";
					}
					if($('#find_copycycle option:selected').val()) {
						whereinfo += " and b.copyCycle = '" + $('#find_copycycle option:selected').val() + "' ";
					}
					/* if($('#find_month option:selected').val()){
					     var m_s = $('#find_month option:selected').val();
					     whereinfo +=" and ( instr(b.copyMonth,'"+m_s+"')=1) or (instr(b.copyMonth,'"+m_s+",')>=1 or instr(b.copyMonth,',"+m_s+"' )>=1) ";
					     //whereinfo +=" and instr(b.copyMonth,'')"

					 }*/
					if($('#find_month option:selected').val()) {
						//alert(1);
						var m_s = $('#find_month option:selected').val();
						if(m_s == '1') {
							//包含 1 or（1,&&不为11） or（,1 && 不为11&&不为12）or（,1,）
							//b.servedField='1' or  (instr(b.reservedField1,'"+m_s+",')=1 and instr(b.reservedField1,'11,')<=0 ) or (instr(b.reservedField1,',"+m_s+"')=1 and instr(b.reservedField1,',11')<=0 and instr(b.reservedField1,',12')<=0)
							whereinfo +=" and (b.reservedField1='1' or  (instr(b.reservedField1,'"+m_s+",')=1 and instr(b.reservedField1,'11,')<=0 ) or (instr(b.reservedField1,',"+m_s+"')=1 and instr(b.reservedField1,',11')<=0 and instr(b.reservedField1,',12')<=0)) ";
						//	whereinfo += " and (( instr(b.reservedField1,'" + m_s + "')=1 and instr(b.reservedField1,'12')<=0 and instr(b.reservedField1,'11')<=0 and instr(b.reservedField1,'10')<=0 ) or (instr(b.reservedField1,'" + m_s + ",')>=1 ) or (instr(b.reservedField1,',"+m_s+"')>=1) ) ";
						} else if(m_s == '2') {
							//alert(1);
							whereinfo += " and (( instr(b.reservedField1,'" + m_s + "')=1 "+
							"and instr(b.reservedField1,'12')<=0) or (instr(b.reservedField1,'" + m_s + ",')>=1 or (instr(b.reservedField1,'" + m_s + ",')>=1 "+
							"or (instr(b.reservedField1,'," + m_s + "')>=1 and instr(b.reservedField1,'1,') >=1 )))) ";
						} else {
							whereinfo += " and (( instr(b.reservedField1,'" + m_s + "')=1) or (instr(b.reservedField1,'" + m_s + ",')>=1 or instr(b.reservedField1,'," + m_s + "' )>=1)) ";
						}

						//whereinfo +=" and instr(b.copyMonth,'')"

					}
					whereinfo += " order by b.serviceper_id ";
					var bd = {
						"cols": "b.reserved_field1,b.reserved_field2,b.bookId,b.bookCode,b.areaId,b.countperId,b.serviceperId,b.copyCycle,b.copyMonth,b.copyRuleday," +
							"b.propertyUnit,b.doorCount,s.normal_count,s.suspended_count,s.long_suspended_count,cc.plancount," +
							"s.all_customer_count,s.un_unbolt_count," +
							"b.oldBookNo,b.bookType,b.boosterCode,b.dailyMeasure,b.address,b.remark",
						"froms": "gas_mrd_book b " +
							"left join (select distinct book_id,sum(case when customer_state='01' then 1 else 0 end) over(partition by book_id) as normal_count," +
							" sum(case when customer_state='02' then 1 else 0 end) over(partition by book_id) as suspended_count," +
							" sum(case when customer_state='04' then 1 else 0 end) over(partition by book_id) as long_suspended_count," +
							" sum(case when customer_state='03' then 1 else 0 end) over(partition by book_id) as dismantle_count," +
							" sum(case when customer_state<>'99' then 1 else 0 end) over(partition by book_id) as all_customer_count," +
							" sum(case when customer_state='00' then 1 else 0 end) over(partition by book_id) as un_unbolt_count" +
							" from gas_ctm_archive " + ainfo +
							") s on s.book_id = b.book_id " +
							" left join (select count(1) plancount,r.book_id from gas_mrd_meter_reading r where  r.copy_state in ('0','1') " + binfo + " group by r.book_id) cc on cc.book_id = b.book_id ",
						"wheres": whereinfo,
						"page": "true",
						"limit": 50
					};
					xw.setRestURL(base_url + encodeURIComponent(JSON.stringify(bd)));
					return "";
				}
			});

			//--init
		},
		linkage: function() {
			var bookId;

			$('.yearpicker').datepicker({
				startView: 'decade',
				minView: 'decade',
				format: 'yyyy',
				maxViewMode: 2,
				minViewMode: 2,
				autoclose: true
			});

			//抄表周期

			var cyclehtml = '';
			// $('#find_copycycle').html('<option value="">全部</option>');
			$('#find_copycycle').html('');
			cyclehtml += '<option value="">全部</option>';
			$.map(GasModMrd.enumCopyCycle, function(idx, row) {
				/* console.log(idx);
				 console.log(row);*/
				cyclehtml += '<option value="' + row + '">' + idx + '</option>';
			});
			$('#find_copycycle').html(cyclehtml);

			//清除所有抄表例日
			$('#clear_all_btn').on('click', function(e) {
				$('#modify_copymonth>div ul').empty(); //初始化表单内容
			});
			$(document).on('click', '.btn_modify', function(e) {

				//初始化日历选择器
				//抄表周期

				var mydate = new Date();
				$('#modify_planyear #modify_calendar').val((mydate.getMonth() + 1) + '-' + mydate.getDate());

				$('#modify div.modal-body').css({
					"margin-bottom": "-40px"
				})

				/* $("#copymonth_select").select2({////初始化抄表月份 下拉框
				 tags: ["1", "2", "3", "4", "5","6","7","8","9","10","11","12"]
				 });*/
				//初始化表单内容
				$('#modify_copymonth>div ul').empty();
				bookId = $(this).attr('data-id');

				var rows = xw.getTable().getData(false).rows;
				var selectedrow;
				rows.forEach(function(row) {
					if(row.bookId == bookId) {
						selectedrow = row;
					}
				});
				if(!selectedrow) {
					alert("未找到相关数据");
					return;

				}
				if(selectedrow.bookType == '9') {
					$('#modify_box').hide();
				} else {
					$('#modify_box').show();
				}
				var area_name = GasModSys.areaHelper.getDisplay(selectedrow.areaId);
				$('#modify_area').html('');
				$('#modify_area').append('<option value="' + selectedrow.areaId + '">' + area_name + '</option>');

				console.log(selectedrow.areaId);
				//GasModMrd.counterUsersListInArea({
				GasModMrd.counterUsersListInArea({
					"areaId": selectedrow.areaId,
					"cb": function(data) {
						var inhtml = '';
						$.each(data, function(idx, row) {
							inhtml += '<option value="' + row.userId + '">' + row.employeeCode + ':' + row.employeeName + '</option>'
						})
						$("#modify_countper").html(inhtml);
						// $("#modify_countper").val(selectedrow.countperId).attr("selected",'selected');
						$("#modify_countper").val(selectedrow.countperId).trigger("change");
						setTimeout(function() {

						}, 100);
					}
				});

				GasModMrd.copyUsersListInArea({

					"areaId": selectedrow.areaId,
					"cb": function(data) {
						var inhtml = "";
						$.each(data, function(idx, row) {
							inhtml += '<option value="' + row.userId + '">' + row.employeeCode + ':' + row.employeeName + '</option>';

						})
						$("#modify_serviceper").html(inhtml);
						// $("#modify_serviceper").val(selectedrow.serviceperId).attr("selected", 'selected');
						$("#modify_serviceper").val(selectedrow.serviceperId).trigger("change");
						setTimeout(function() {

						}, 100);
					}

				});

				$('#modify').css({
					'display': "block",
					'background': "rgba(0,0,0,0.3)"
				});
				$('#modify').attr("aria-hidden", "false");
				$('#modify').addClass('in');
				$('#modify').find("#modify_add").removeAttr("disabled");
				var copyMonthList, copyRuledayList;
				if(selectedrow.copyMonth && selectedrow.copyMonth.indexOf(",") < 0) { 	
					$("#modify_copymonth ul").append('<li class="select2-search-choice"><div>' + selectedrow.copyMonth + "-" + selectedrow.copyRuleday + '</div><a href="javascript:;" class="select2-search-choice-close"></a></li>');
				}
				if(selectedrow.copyMonth && selectedrow.copyMonth.indexOf(",") >= 0 && selectedrow.copyRuleDay && selectedrow.copyRuleDay.indexOf(",") < 0) { //月份多个，例日1个
					copyMonthList = selectedrow.copyRuleDay.split(',');
					for(var i = 0; i < copyMonthList.length; i++) {
						//判断是 12还是 小于12
						
//						if(selectedrow.copyMonthList[i]==12 && selectedrow.copyRuleday ){
//							
//						}
						//$("#modify_copymonth ul").append('<li class="select2-search-choice"><div>' + selectedrow.copyMonthList[i] + "-" + selectedrow.copyRuleday + '</div><a href="javascript:;" class="select2-search-choice-close"></a></li>');
					}
				}
				if(selectedrow.copyMonth) {
					copyMonthList = selectedrow.copyMonth.split(',');
				}
				if(selectedrow.copyRuleday) {
					copyRuledayList = selectedrow.copyRuleday.split(',');
				}
				if(selectedrow.copyMonth && selectedrow.copyRuleday) {
					for(var i = 0; i < copyMonthList.length; i++) {
						if(!copyMonthList[i]) {
							continue;
						}
						if(!copyRuledayList[i]) {
							continue;
						}
						// console.log(copyMonth[i]+"-"+copyRuleday[i]);
						$("#modify_copymonth ul").append('<li class="select2-search-choice"><div>' + copyMonthList[i] + "-" + copyRuledayList[i] + '</div><a href="javascript:;" class="select2-search-choice-close"></a></li>');

					}
				}

				$('#modify_doorcount').val(selectedrow.doorCount);
				$("#modify_propertyunit").val(selectedrow.propertyUnit);
				$("#modify_oldbookno").val(selectedrow.oldBookNo);
				$("#modify_boostercode").val(selectedrow.boosterCode);
				$("#modify_daymeasure").val(selectedrow.dailyMeasure);
				$('#modify_remark').val(selectedrow.remark);
				$('#modify_address').val(selectedrow.address);
				// $("#modify_booktype option[value='"+selectedrow.bookType+"']").attr("selected",true);
				$("#modify_booktype").val(selectedrow.bookType).trigger("change");
				var countperindex = $('#modify_countper option').length;
				var serviceperindex = $("#modify_serviceper option").length;

				for(var i = 0; i < $('#modify_copycycle option').length; i++) {
					if($("#modify_copycycle option").eq(i).val() == selectedrow.copyCycle) {
						$("#modify_copycycle option").eq(i).attr("selected", 'selected')
					}
				}

			}); //end==update

			$(document).on("click", '.btn-default,.close', function() {
				$('#modify').css({
					'display': "none",
					'background': "none"
				});
				$('#modify').attr("aria-hidden", "true");
				$('#modify').removeClass('in');
			});
			$('.close,.modal-footer .btn-default').on('click', function() {
				$('#copymonth_ul>div ul li').remove();
			});
			$("#modify_copycycle").on('change', function(e) { //抄表本类型和抄表周期联动
				//居民：月抄，季抄，半年超，年超； 非居民：日抄，周抄，月抄
				//1年抄 2半年抄 4季抄 7月抄 8周抄 9日抄
				var twolevel_linkage = $('#modify_copycycle option:selected').val();
				// $('#copymonth_ul>div ul li').remove();
				if(twolevel_linkage != 7) {
					$('#modify_copymonth>div').css('height', '36px')
				} else {
					$('#modify_copymonth>div').css('height', '102px')
				}
			});
			//抄表例日选择
			var mydate = new Date();
			$('#select_planyear #calendar').val((mydate.getMonth() + 1) + '-' + mydate.getDate());
			var i = 0;
			//选择日期添加到抄表日期
			$('#modify_calendar').on('change', function() {
				console.log(0)
				i++;
				var twolevel_linkage = $('#modify_copycycle option:selected').val();
				console.log(twolevel_linkage);
				console.log(i);
				//年抄
				console.log($('#modify_calendar').val());
				if(twolevel_linkage == 1 && i % 3 == 0) {
					var str = '<li class="select2-search-choice"><div>' + $(this).val() + '</div><a href="javascript:;" class="select2-search-choice-close"></a></li>';
					$('#modifyUl').append(str);
					var readDate = $('.reading-data li').length;
					console.log(readDate);
					for(var j = 0; j < readDate; j++) {
						console.log(j)
						if(j >= 1) {
							$('#modifyUl li').eq(j).remove();
							alert('年抄只能选择一个日期');
						}
					}
				}
				//半年抄
				if(twolevel_linkage == 2 && i % 3 == 0) {
					var str = '<li class="select2-search-choice"><div>' + $(this).val() + '</div><a href="javascript:;" class="select2-search-choice-close"></a></li>';
					$('#modifyUl').append(str);
					var readDate = $('#modifyUl li').length;
					console.log(readDate);
					for(var j = 0; j < readDate; j++) {
						console.log(j)
						if(j >= 2) {
							$('#modifyUl li').eq(j).remove();
							alert('半年抄只能选择两个日期');
						}
					}
				}
				//季抄
				if(twolevel_linkage == 4 && i % 3 == 0) {
					var str = '<li class="select2-search-choice"><div>' + $(this).val() + '</div><a href="javascript:;" class="select2-search-choice-close"></a></li>';
					$('#modifyUl').append(str);
					var readDate = $('#modifyUl li').length;
					console.log(readDate);
					for(var j = 0; j < readDate; j++) {
						console.log(j)
						if(j >= 4) {
							$('#modifyUl li').eq(j).remove();
							alert('季抄只能选择四个日期');
						}
					}
				}
				//月抄
				if(twolevel_linkage == 7 && i % 3 == 0) {
					var str = '<li class="select2-search-choice"><div>' + $(this).val() + '</div><a href="javascript:;" class="select2-search-choice-close"></a></li>';
					$('#modifyUl').append(str);
					var readDate = $('#modifyUl li').length;
					console.log(readDate);
					for(var j = 0; j < readDate; j++) {
						console.log(j)
						if(j >= 12) {
							$('#modifyUl li').eq(j).remove();
							alert('最多能选12个');
						}
					}

				}
			});
			//删除添加的抄表日期
			$(document).on('click', '.select2-search-choice-close', function() {
				$(this).closest('li').remove();
			});
//TODO 添加 抄表月份和例日
			$('#modify_add').removeAttr("disabled");
			$("#modify_add").on('click', function() {
				var $btn = $(event.currentTarget);
				console.log($btn);
				$btn.attr("disabled", "disabled");

				if(!$('#modify_area option:selected').val()) {
					$btn.removeAttr("disabled");
					bootbox.alert("<br><center><h4>供气区域为空,请重试</h4></center><br>");

					return;
				}
				if(!$('#modify_countper option:selected').val()) {
					$btn.removeAttr("disabled");
					bootbox.alert("<br><center><h4>请选择核算员,请重试</h4></center><br>");

					return;
				}
				if(!$('#modify_serviceper option:selected').val()) {
					$btn.removeAttr("disabled");
					bootbox.alert("<br><center><h4>请选择客户服务员,请重试</h4></center><br>");

					return;
				}

				var copyyear_select = $('.yearpicker input').val();
				if(!copyyear_select && $('#modify_booktype option:selected').val()) {
					$btn.removeAttr("disabled");
					alert("请选择计划年份");
					return;
				}
				var data = {};
				var datearr = [];
				var monthArr = [];
				var dateArr = [];
				console.log($('.reading-data li').length);
				for(var i = 0; i < $('.reading-data li').length; i++) {
					var date = $('.reading-data li').eq(i).text();
					datearr.push(date);
					var a = datearr[i].split('-');
					monthArr.push(a[0]);
					dateArr.push(a[1]);
				}
				var li_length = $('.reading-data li').length;
				for(var j = 0; j < li_length - 1; j++) { //12个月,datearr进行切分，然后 根据顺序排序
					for(var i = 0; i < 11 - li_length - 1; i++) {
						if(parseInt(monthArr[i]) > parseInt(monthArr[(i + 1)])) {
							var t = monthArr[(i + 1)];
							var o = dateArr[(i + 1)];
							monthArr[(i + 1)] = monthArr[i];
							dateArr[(i + 1)] = dateArr[i];
							monthArr[i] = t;
							dateArr[i] = o;
						} else {
							continue;
						}
					}
				}
				//遍历 copy_month和copy_ruleday 然后 生成抄表月份
				var copymonthstrarr = new Array();
				for(var s=0;s<monthArr.length;s++){
					if(monthArr[s]==12 && Number(dateArr[s])>=26){
						copymonthstrarr.push('1');
					}else if (monthArr[s]==12 && Number(dateArr[s]< 26)){
						copymonthstrarr.push('12');
					}else if (monthArr[s]!=12 && Number(dateArr[s] >=26)){
						copymonthstrarr.push(Number(monthArr[s])+1);
					}else if( monthArr[s]!= 12 && Number(dateArr[s]< 26)){
						copymonthstrarr.push(monthArr[s]);
					}
				}
				console.log(data.reserved_field1);
				console.log(data.reserved_field2);
				console.log(monthArr.join());
				console.log(dateArr.join());
				// return;
				data.areaId = $('#modify_area option:selected').val();
				data.countperId = $('#modify_countper option:selected').val();
				data.serviceperId = $('#modify_serviceper option:selected').val();

				data.copyMonth = monthArr.join();
				data.copyRuleday = dateArr.join();
				
				data.reservedField1= copymonthstrarr.join();
				data.reservedField2= datearr.join();


				data.copyCycle = $('#modify_copycycle option:selected').val();
				if($('#modify_booktype option:selected').val() && $('#modify_booktype option:selected').val() == '1') { //居民
					if(!monthArr.join() || monthArr.join() == 'null' || typeof(monthArr.join()) == 'undefined') {
						$(this).attr("disabled", "false");
						bootbox.alert("<br><center><h4>请选择抄表月份与例日</h4></center><br>");
						return;
					}
				} else if($('#modify_booktype option:selected').val() && $('#modify_booktype option:selected').val() == '9') { //非居民
					if(!monthArr.join() || monthArr.join() == 'null' || typeof(monthArr.join()) == 'undefined') {
						// data.copyMonth = "1,2,3,4,5,6,7,8,9,10,11,12";
						// data.copyRuleday = "";
					}
				}

				data.propertyUnit = $('#modify_propertyunit').val();
				data.doorCount = $('#modify_doorcount').val();
				data.oldBookNo = $('#modify_oldbookno').val();
				data.bookType = $('#modify_booktype option:selected').val();
				data.boosterCode = $('#modify_boostercode').val();
				data.dailyMeasure = $('#modify_daymeasure').val();
				data.remark = $('#modify_remark').val();
				data.address = $('#modify_address').val();
				data.modifiedTime = new Date(moment().format('YYYY-MM-DD HH:mm:ss') + "-00:00");
				data.modifiedBy = UserInfo.item().userId;
				// console.log(data);
				//console.log(bookId)
				$.ajax({
					dataType: 'json',
					type: "PUT",
					async: false,
					url: hzq_rest + "gasmrdbook/" + bookId,
					data: JSON.stringify(data),
					contentType: "application/json; charset=utf-8;",
					success: function(data) {
						console.log(data); //
						if(data.success && $('#modify_booktype option:selected').val() == '9') {
							bootbox.alert("<br><center><h4>抄表本修改成功.</h4></center><br>");
							//修改
							var bd = {
								"countperid": $('#modify_countper option:selected').val(),
								"serviceperid": $('#modify_serviceper option:selected').val(),
								"bookid": bookId
							};
							$.ajax({
								dataType: 'json',
								type: "GET",
								async: false,
								url: "/hzqs/pla/pbguc.do?fh=GUCPLA0000000J00&resp=bd&bd=" + JSON.stringify(bd),
								// data:JSON.stringify(data),
								success: function(result) {
									$(this).attr("disabled", "false");
									if(result.err_code == "1") {
										bootbox.alert("<br><center><h4>成功更新已生成抄表计划中的核算员与抄表员</h4></center><br>");

										$('#modify').css({
											'display': "none",
											'background': "none"
										});
										$('#modify').attr("aria-hidden", "true");
										$('#modify').removeClass('in');

										xw.update();
									} else {
										var msg = result.msg;

										if(msg) {
											bootbox.alert("<br><center><h4>更新抄表计划失败：" + msg + "</h4></center><br>");

										} else {
											bootbox.alert("<br><center><h4>失败(更新已生成抄表计划中的核算员与抄表员)</h4></center><br>");

										}
									}
								},
							});
							$('#modify').css({
								'display': "none",
								'background': "none"
							});
							$('#modify').attr("aria-hidden", "true");
							$('#modify').removeClass('in');

							xw.update();
						} else if(data.success && $('#modify_booktype option:selected').val() == '1') { //居民本修改，会修改抄表计划
							//调用 抄表计划生成
							$('#planyear').val();
							var bd = {
								"areaid": $('#modify_area option:selected').val(),
								"countperid": $('#modify_countper option:selected').val(),
								"planyear": copyyear_select,
								"serviceperid": $('#modify_serviceper option:selected').val(),
								"bookid": bookId
							};
							$.ajax({
								dataType: 'json',
								type: "GET",
								async: false,
								url: "/hzqs/pla/pbisp.do?fh=ISPPLA0000000J00&resp=bd&bd=" + JSON.stringify(bd),
								// data:JSON.stringify(data),
								success: function(result) {
									$btn.removeAttr("disabled");
									if(result.err_code == "1") {
										bootbox.alert("<br><center><h4>成功修改抄表本,并生成抄表计划</h4></center><br>");
										$('#modify').css({
											'display': "none",
											'background': "none"
										});
										$('#modify').attr("aria-hidden", "true");
										$('#modify').removeClass('in');

										xw.update();
									} else {
										var msg = result.msg;
										if(msg) {
											bootbox.alert("<br><center><h4>抄表计划生成失败," + msg + "</h4></center><br>");
										} else {
											bootbox.alert("<br><center><h4>抄表计划生成失败</h4></center><br>");
										}

									}
								},
								error: function(err) {
									console.log(err)

									bootbox.alert("<br><center><h4>修改失败!</h4></center><br>");
								}

							});
							//bootbox.alert("<br><center><h4>修改成功!</h4></center><br>");
							$('#modify').css({
								'display': "none",
								'background': "none"
							});
							$('#modify').attr("aria-hidden", "true");
							$('#modify').removeClass('in');

							xw.update();
						}
					},
					error: function(err) {
						$btn.removeAttr("disabled");
						console.log(err)
						bootbox.alert("<br><center><h4>修改失败!</h4></center><br>");
					}
				});
			});

			//抄表本-抄表计划变更审批
			$('#modify_submit').on('click', function() {

				//校验
				var $btn = $(event.currentTarget);
				console.log($btn);
				$btn.attr("disabled", "disabled");

				if(!$('#modify_area option:selected').val()) {
					$btn.removeAttr("disabled");
					bootbox.alert("<br><center><h4>供气区域为空,请重试</h4></center><br>");

					return;
				}
				if(!$('#modify_countper option:selected').val()) {
					$btn.removeAttr("disabled");
					bootbox.alert("<br><center><h4>请选择核算员,请重试</h4></center><br>");

					return;
				}
				if(!$('#modify_serviceper option:selected').val()) {
					$btn.removeAttr("disabled");
					bootbox.alert("<br><center><h4>请选择客户服务员,请重试</h4></center><br>");

					return;
				}

				var copyyear_select = $('.yearpicker input').val();
				if(!copyyear_select && $('#modify_booktype option:selected').val()) {
					$btn.removeAttr("disabled");
					alert("请选择计划年份");
					return;
				}
				var data = {};
				var datearr = [];
				var monthArr = [];
				var dateArr = [];
				console.log($('.reading-data li').length);
				for(var i = 0; i < $('.reading-data li').length; i++) {
					var date = $('.reading-data li').eq(i).text();
					datearr.push(date);
					var a = datearr[i].split('-');
					monthArr.push(a[0]);
					dateArr.push(a[1]);
				}
				var li_length = $('.reading-data li').length;
				for(var j = 0; j < li_length - 1; j++) { //12个月,datearr进行切分，然后 根据顺序排序
					for(var i = 0; i < 11 - li_length - 1; i++) {
						if(parseInt(monthArr[i]) > parseInt(monthArr[(i + 1)])) {
							var t = monthArr[(i + 1)];
							var o = dateArr[(i + 1)];
							monthArr[(i + 1)] = monthArr[i];
							dateArr[(i + 1)] = dateArr[i];
							monthArr[i] = t;
							dateArr[i] = o;
						} else {
							continue;
						}
					}
				}

				console.log(monthArr.join());
				console.log(dateArr.join());
				// return;
				data.areaId = $('#modify_area option:selected').val();
				data.countperId = $('#modify_countper option:selected').val();
				data.serviceperId = $('#modify_serviceper option:selected').val();

				data.copyMonth = monthArr.join();
				data.copyRuleday = dateArr.join();

				data.copyCycle = $('#modify_copycycle option:selected').val();
				if($('#modify_booktype option:selected').val() && $('#modify_booktype option:selected').val() == '1') { //居民
					if(!monthArr.join() || monthArr.join() == 'null' || typeof(monthArr.join()) == 'undefined') {
						$(this).attr("disabled", "false");
						bootbox.alert("<br><center><h4>请选择抄表月份与例日</h4></center><br>");
						return;
					}
				} else if($('#modify_booktype option:selected').val() && $('#modify_booktype option:selected').val() == '9') { //非居民
					if(!monthArr.join() || monthArr.join() == 'null' || typeof(monthArr.join()) == 'undefined') {
						// data.copyMonth = "1,2,3,4,5,6,7,8,9,10,11,12";
						// data.copyRuleday = "";
					}
				}

				data.propertyUnit = $('#modify_propertyunit').val();
				data.doorCount = $('#modify_doorcount').val();
				data.oldBookNo = $('#modify_oldbookno').val();
				data.bookType = $('#modify_booktype option:selected').val();
				data.boosterCode = $('#modify_boostercode').val();
				data.dailyMeasure = $('#modify_daymeasure').val();
				data.remark = $('#modify_remark').val();
				data.address = $('#modify_address').val();
				data.modifiedTime = new Date(moment().format('YYYY-MM-DD HH:mm:ss') + "-00:00");
				data.modifiedBy = UserInfo.item().userId;
				// console.log(data);
				//console.log(bookId)

				//抄表计划变更审批
				//提交审批
				//审批详情表
				//以前的数据
				var changelogdata = {
					"createdTime":new Date(moment().format('YYYY-MM-DD HH:mm:ss') + "-00:00") ,
					"modifiedTime": new Date(moment().format('YYYY-MM-DD HH:mm:ss') + "-00:00"),
					"createdBy":UserInfo.item().userId ,
					"modifiedBy": UserInfo.item().userIds,
					"status":"1"

				};
				changelogdata.beforeChange = JSON.stringify(data);

				var oldbook = Restful.getByID(hzq_rest + 'gasmrdbook', bookId);
				if(oldbook) {
					changelogdata.afterChange = JSON.stringify(oldbook);
				}

				changelogdata.planType = "P1book";
				changelogdata.changeItem = "gas_mrd_book,gas_mrd_meter_reading";

				var flow_inst_id = $.md5(Math.random() * 100000000000 + new Date().getTime());
				console.log(flow_inst_id)
				var date = new Date(moment().format("YYYY-MM-DD HH:mm:ss") + "-00:00");

				changelogdata.changeLogId = flow_inst_id;
				changelogdata.wfId=flow_inst_id;

				flowjson = {
					"flow_def_id": "CBJHBG",//抄表计划变更
					"ref_no": flow_inst_id,
					"be_orgs": UserInfo.item().area_id,
					"operator": UserInfo.item().userId,
					"flow_inst_id": flow_inst_id,
					"prop1str64": moment().format("YYYY-MM-DD HH:mm:ss"),
					"prop2str64": "抄表本&计划变更", //抄表本编号-核算员
					// "prop2str64":$("#useGasPerson").val()+"(合同编号:"+$("#contractNo").val()+") — "+str,
					// "propstr128":"营业部合同管理员",
					"propstr2048": flow_inst_id, //change_log_id
					"override_exists": false,
					"createTime":moment().format("YYYY-MM-DD HH:mm:ss"),
					"modifyTime":moment().format("YYYY-MM-DD HH:mm:ss")	
				};

//				$.ajax({
//					type: "POST",
//					url: "hzqs/dbc/pbtxs.do?fh=SELDBC0000000J00&resp=bd&limit=3&retobj=2",
//					data: JSON.stringify({
//						"sets": [{
//							"txid": "1",
//							"body": JSON.stringify(flowjson),
//							"path": "/psmflowinst/",
//							"method": "post"
//						}, {
//							"txid": "2",
//							"body": JSON.stringify(changelogdata),
//							"path": "/gasmrdplanchagelog/",
//							"method": "post"
//						}]
//					}),
//					async: false,
//					contentType: "application/json; charset=utf-8",
//					dataType: "json",
//					success: function(result) {
//						var res = true;
//						if(result) {
//							for(var i = 0; i < (result.results).length; i++) {
//								//if(!((result.results)[i]).success){
//								res = res & (((result.results)[i]).success);
//								//}
//							}
//						}
//						if(res) {
//							bootbox.alert("申请已提交。");
//							$('#modify').css({
//								'display': "none",
//								'background': "none"
//							});
//							$('#modify').attr("aria-hidden", "true");
//							$('#modify').removeClass('in');
//
//						} else {
//							bootbox.alert("审批提交失败，请重试。");
//						}
//					}
//				});
//流程不能用组合接口
//先提交业务
var busi_result = Restful.insert(hzq_rest+"gasmrdplanchagelog",changelogdata);
console.log(busi_result);
if(busi_result && busi_result.success){
	//然后提交流程
	var flow_result = Restful.insert("/hzqs/psm/pbisn.do?fh=VFLSCGC000000J00&bd={}&resp=bd",flowjson);
    console.log(flow_result)
    if(flow_result.retmsg == "SUCCESS:1"){
        bootbox.alert("<center><h4>提交成功。</h4></center>",function(){
           $('#modify').css({
				'display': "none",
				'background': "none"
			});
			$('#modify').attr("aria-hidden", "true");
			$('#modify').removeClass('in');
			xw.update();
        });
    }else{
       // var result = Restful.delByID( hzq_rest +"",form.contractId);
       var result = Restful.update(hzq_rest+'gasmrdplanchagelog',flow_inst_id,JSON.stringify({"status":"3"}));
        console.log(result)
        //update 业务表 -- status = ‘3’
        bootbox.alert("<center><h4>提交失败。</h4></center>" );
    }
}else{
	bootbox.alert("<center><h4>提交失败。</h4></center>");
}


//流程提交失败——删除业务信息



				//流程表——数据
				//Restful.insert
				//          		if(oldbook && oldbook.success){
				//          			
				//          		}
				//选择完之后的数据
			});
		},

		initBookTree: function() { //初始化tree的时候只加载供气区域

			var restURL = "hzqs/pla/pbmyt.do?fh=MYTPLA0000000J00&resp=bd&bd={}";
			$.ajax({
				type: 'POST',
				url: restURL,
				cache: false,
				async: true,
				contentType: "application/json; charset=utf-8",
				data: JSON.stringify({
					"operator": "admin"
				}),
				success: function(data, textStatus, xhr) {
					//console.log("okokfor tree");
					var trform = Duster.buildArr($('#__dust_pbooktree'));
					var tables = trform(data.myroot.nodes);
					//console.log("tree="+tables)
					$('#treetable').html(tables);
					$('#tree_1').jstree({
						"core": {
							"themes": {
								"responsive": false
							}
						},
						"types": {
							"default": {
								"icon": "fa fa-folder icon-state-warning icon-lg"
							},
							"file": {
								"icon": "fa fa-file icon-state-warning icon-lg"
							}
						},
						"plugins": ["types"]
					});

					$("#tree_1").on('click', 'ul li a', function(e) {
						//判断是供气区域，核算员还是抄表员

						var code_text = $(this).context.innerText;
						console.log(code_text);
						var middle_url = "";
						var code_id = $(this).attr("data-id");
						//var query_Url =hzq_rest+ "gasmrdbook/?";
						var base_url = '/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=';
						var whereinfo = '1=1';
						var ainfo = " where 1=1 ";
						var binfo = "";
						whereinfo += ' and b.area_id in ( select area_id' +
							" from gas_biz_area where parent_area_id='" + areaid + "' and status<>'3' union " +
							" select area_id from gas_biz_area where status<>'3' start with area_id='" + areaid + "' connect by prior area_id=parent_area_id" +
							" )  and b.status<>'3' ";

						/* if(stationid == '2' && userid){//抄表员
						     whereinfo +=" and b.serviceper_id='"+userid+"' "
						 }
						 if(stationid == '1' && userid){//核算员
						     whereinfo +=" and b.countper_id='"+userid+"' ";
						 }*/
						if(code_text.indexOf("核算员") >= 0) {
							whereinfo += " and b.countperId='" + code_id + "' ";
							binfo += " and r.countperId='" + code_id + "' ";

						} else if(code_text.indexOf("客户服务员") >= 0) {
							whereinfo += " and b.serviceperId='" + code_id + "' ";
							binfo += " and r.serviceperId='" + code_id + "' ";
						} else {
							whereinfo += " and b.areaId ='" + code_id + "' ";
							binfo += " and r.area_id='" + code_id + "' ";
							ainfo += " and area_id='" + code_id + "' ";
						}
						if($('#find_iscreate option:selected').val() == '1') {
							whereinfo += " and nvl(cc.plancount,0) > 0 ";
						} else if($('#find_iscreate option:selected').val() == '2') {
							whereinfo += " and nvl(cc.plancount,0) = 0 ";
						}
						if($('#find_copycycle option:selected').val()) {
							whereinfo += " and b.copyCycle = '" + $('#find_copycycle option:selected').val() + "' ";
						}
						if($('#find_month option:selected').val()) {
							var m_s = $('#find_month option:selected').val();
							if(m_s == '1') {
								whereinfo += " and (( instr(b.copyMonth,'" + m_s + "')=1 and instr(b.copyMonth,'12')<=0 ) or (instr(b.copyMonth,'" + m_s + ",')>=1 )) ";
							} else if(m_s == '2') {
								whereinfo += " and (( instr(b.copyMonth,'" + m_s + "')=1 and instr(b.copyMonth,'12')<=0) or (instr(b.copyMonth,'" + m_s + ",')>=1  or (instr(b.copyMonth,'" + m_s + ",')>=1 or (instr(b.copyMonth,'," + m_s + "')>=1 and instr(b.copyMonth,'1,') >=1))) ";
							} else {
								whereinfo += " and ( ( instr(b.copyMonth,'" + m_s + "')=1) or (instr(b.copyMonth,'" + m_s + ",')>=1 or instr(b.copyMonth,'," + m_s + "' )>=1) ) ";
							}

							//whereinfo +=" and instr(b.copyMonth,'')"

						}
						whereinfo += " order by b.serviceper_id "
						var bd = {
							"cols": "b.bookId,b.bookCode,b.areaId,b.countperId,b.serviceperId,b.copyCycle,b.copyMonth,b.copyRuleday," +
								"b.propertyUnit,b.doorCount,s.normal_count,s.suspended_count,s.long_suspended_count,cc.plancount," +
								"s.all_customer_count,s.un_unbolt_count," +
								"b.oldBookNo,b.bookType,b.boosterCode,b.dailyMeasure,b.address,b.remark",
							"froms": "gas_mrd_book b " +
								"left join (select distinct book_id,sum(case when customer_state='01' then 1 else 0 end) over(partition by book_id) as normal_count," +
								" sum(case when customer_state='02' then 1 else 0 end) over(partition by book_id) as suspended_count," +
								" sum(case when customer_state='04' then 1 else 0 end) over(partition by book_id) as long_suspended_count," +
								" sum(case when customer_state='03' then 1 else 0 end) over(partition by book_id) as dismantle_count," +
								" sum(case when customer_state<>'99' then 1 else 0 end) over(partition by book_id) as all_customer_count," +
								" sum(case when customer_state='00' then 1 else 0 end) over(partition by book_id) as un_unbolt_count" +
								" from gas_ctm_archive " + ainfo +
								") s on s.book_id = b.book_id " +
								" left join (select count(1) plancount,r.book_id from gas_mrd_meter_reading r where  r.copy_state in ('0','1') " + binfo + " group by r.book_id) cc on cc.book_id = b.book_id ",
							"wheres": whereinfo,
							"page": "true",
							"limit": 50
						};
						xw.setRestURL(base_url + encodeURIComponent(JSON.stringify(bd)));
						xw.update();
						$('#book_tree').css({
							'display': 'none'
						}).removeClass("active");

					})

				},
				error: function(err) {}
			});
			$(".ca_select_book").on('click', function(e) {
				console.log("llloo")
				if(!$('#book_tree').hasClass("active")) {
					$('#book_tree').css({
						'position': 'absolute',
						'width': 'auto',
						'z-index': 3,
						'display': 'block'
					}).addClass("active");
				} else {
					$('#book_tree').css({
						'display': 'none'
					}).removeClass("active");
				}
				e.stopImmediatePropagation()
			});

			$(document).on('click', function(e) {
				console.log("!!!e.target.id==" + e.target.id)
				if(e.target && e.target.id != 'btn_select_book' && e.target.id != 'i_select_book') {
					var isinside = (e.target.id == 'book_tree');
					$(e.target).parents().each(function(id, row) {
						if(row.id == 'book_tree' || $(row).hasClass('jstree-ocl') || $(row).hasClass('jstree-icon') || $(row).hasClass('jstree-node')) {
							isinside = true;
						}
					})
					if(!isinside) {
						console.log("not inside")

						$(".select2-chosen").each(function(dx, f) {
							$(f).select2("close")
						})
						if($('#book_tree').hasClass("active")) {
							$('#book_tree').css({
								'display': 'none'
							}).removeClass("active");
						}
					}
					//console.log("e.target.id=="+e.target.id)
				}

			});

		},
	};
}();