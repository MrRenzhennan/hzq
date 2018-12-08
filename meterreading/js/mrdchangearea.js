/**
 * 调区
 * 客户，或抄表本专区
 */
var MrdChangeAreaAction = function() {
	var xw;
	var gasTypeHelper = RefHelper.create({
		ref_url: "gasbizgastype",
		ref_col: "gasTypeId",
		ref_display: "gasTypeName"
	});
	var gasTypeFormat = function() {
		return {
			f: function(val) {
				return gasTypeHelper.getDisplay(val);
			}
		}
	}();

	var operateFormat = function() {
		return {
			f: function(val) {
				return "<a href='JavaScript:;'  data-id='" + val + "' class='btn_plan'>重新生成抄表计划</a>"
			}
		}
	}();
	return {
		init: function() {
			this.initHelper(),
				this.reload(),
				this.initBtn()
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
				$("#find_countperId").val(UserInfo.item().userId).change();
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
			});

			/* $('#find_serviceperId').on('change',function(e){
			     console.log("change serviceper:"+e+"."+$("#find_serviceperId").val());
			     GasModMrd.bookInService({
			         "areaId":$("#find_areaId").val(),
			         "countperId":$('#find_countperId').val(),
			         "serviceperId":$('#find_serviceperId').val(),
			         "cb":function(data){
			             var inhtml = "<option value=''>全部</option>";
			             if(data){
			                 $.each(data,function(inx,row){
			                     inhtml +='<option value="'+row.bookId+'">'+row.bookCode+':'+row.address+'</option>'
			                 })
			             }
			             $("#find_bookId").html(inhtml);
			             $("#find_bookId").val("").change();
			         }
			     });
			 });*/

			$('#from_areaId').html('<option value="" name="全部"">全部</option>');
			$.each(GasModSys.areaHelper.getRawData(), function(idx, row) {
				if('1' == UserInfo.item().area_id) {
					$('#from_areaId').append('<option value="' + row.areaId + '" name="' + row.areaId + '">' + row.areaName + '</option>');
				} else if(row.areaId == UserInfo.item().area_id) {
					$('#from_areaId').append('<option value="' + row.areaId + '" name="' + row.areaId + '">' + row.areaName + '</option>');
				}
			});

			if(UserInfo.item().station_id == '1') {
				console.log("cahnge")
				var inhtml = "<option value='" + UserInfo.item().userId + "' selected>" + UserInfo.item().employee_name + "</option>";
				$("#from_areaId").val(UserInfo.item().area_id).change();;
				$("#from_areaId").attr({
					disabled: "disabled"
				})

				$("#from_countperId").html(inhtml);
				$("#from_countperId").val(UserInfo.item().userId).change();
				$("#from_countperId").attr({
					disabled: "disabled"
				})

				GasModSys.copyUsersInArea({
					"areaId": $('#from_areaId').val(),
					"countperId": $('#from_countperId').val(),
					"cb": function(data) {
						var inhtml = "<option value=''>全部</option>";
						if(data) {
							$.each(data, function(idx, row) {
								inhtml += '<option value="' + row.userId + '">' + row.employeeName + '</option>';
							})
						}
						$("#from_serviceperId").html(inhtml);
						$("#from_serviceperId").val("").change();

					}
				})

			} else {
				$('#from_countperId').on('change', function(e) {
					console.log("change counter:" + e + "." + $('#from_countperId').val());
					GasModSys.copyUsersInArea({
						"areaId": $('#from_areaId').val(),
						"countperId": $('#from_countperId').val(),
						"cb": function(data) {
							var inhtml = "<option value=''>全部</option>";
							if(data) {
								$.each(data, function(idx, row) {
									inhtml += '<option value="' + row.userId + '">' + row.employeeName + '</option>';
								})
							}
							$("#from_serviceperId").html(inhtml);
							$("#from_serviceperId").val("").change();

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

			$('#from_areaId').on('change', function(e) {
				console.log("change area:" + e + "." + $('#find_areaId').val());
				GasModSys.counterUsersInArea({
					"areaId": $('#from_areaId').val(),
					"cb": function(data) {
						var inhtml = "<option value=''>全部</option>";
						$.each(data, function(idx, row) {
							inhtml += '<option value="' + row.userId + '">' + row.employeeName + '</option>';
						})
						$("#from_countperId").html(inhtml);
						$("#from_countperId").val("").change();

					}
				})
				//   xw.autoResetSearch();
			})

			$('#from_countperId').on('change', function(e) {
				console.log("change counter:" + e + "." + $('#find_countperId').val());
				GasModSys.copyUsersInArea({
					"areaId": $('#from_areaId').val(),
					"countperId": $('#from_countperId').val(),
					"cb": function(data) {
						var inhtml = "<option value=''>全部</option>";
						if(data) {
							$.each(data, function(idx, row) {
								inhtml += '<option value="' + row.userId + '">' + row.employeeName + '</option>';
							})
						}
						$("#from_serviceperId").html(inhtml);
						$("#from_serviceperId").val("").change();
					}
				})
			});
			
			$.map(GasModCtm.enumCustomerKind,function(value,key){
				$('#find_customerkind').append('<option value="' + key + '">' + value + '</option>');
			});

		},
		reload: function() {
			$('#divtable').html('');
			var base_url = '/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=';

			/*  var whereinfo = '1=1';
            if(login_user.station_id && login_user.station_id == '1'){//核算员
                whereinfo += " and b.serviceper_id = '"+login_user_id+"' ";
            }else if(login_user.station_id && login_user.station_id=='2'){//抄表员
                whereinfo +=" and b.countper_id = '"+login_user_id+"' ";
            }else{
                whereinfo +=" and b.area_id in ( select area_id"+
                " from gas_biz_area where parent_area_id='"+area_id+"' and status<>'3' union "+
                " select area_id from gas_biz_area where status<>'3' start with area_id='"+area_id+"' connect by prior area_id=parent_area_id "+
                " ) ";
            }
*/
			/* whereinfo +=" and b.status<>'3' ";
			 whereinfo +=" and a.customer_state<>'99' ";*/
			var bd = {
				"cols": "a.ctm_archive_id,a.bookId,b.areaId,b.countperId,b.serviceperId,b.bookCode," +
					" a.customerCode,a.customerName,a.meterUserName,a.customerAddress,a.gasTypeId,a.mobile,a.customerType," +
					" a.customerKind ", //bs.has_business,
				"froms": " gas_ctm_archive a " +
					" left join gas_mrd_book b on b.book_id = a.book_id ",
				// " left join (select count(1) has_business ,br.ctm_archive_id,br.customer_code " +
				//" from gas_csr_busi_register br where br.bill_state='N' and br.blank_out_sign='N' group by br.ctm_archive_id,br.customer_code ) bs on bs.ctm_archive_id=a.ctm_archive_id ",
				"wheres": "1=0",
				"page": "true",
				"limit": 50
			}
			xw = XWATable.init({
				divname: "divtable",
				//----------------table的选项-------
				pageSize: 10,
				columnPicker: true,
				transition: 'fade',
				checkboxes: true,
				checkAllToggle: true,
				//----------------基本restful地址---
				restURL: base_url + encodeURIComponent(JSON.stringify(bd)),
				key_column: 'ctmArchiveId',
				coldefs: [{
						col: "bookId",
						friendly: "抄表本ID",
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

						col: "customerCode",
						friendly: "客户编号",
						sorting: false,
						index: 6
					},
					{
						col: "customerName",
						friendly: "客户名称",
						sorting: false,
						//inputsource: "select",
						index: 7
					},

					{
						col: "meterUserName",
						friendly: "表户名称",
						sorting: false,
						index: 8
					},
					{
						col: "customerAddress",
						friendly: "客户地址",
						sorting: false,
						index: 9
					},
					{
						col: "hasBusiness",
						friendly: "未完成业务数(暂时不做业务限定)",
						sorting: false,
						index: 10
					},
					{
						col: "gasTypeId",
						friendly: "用气类型",
						// format:GasModBas.gasTypeFormat,
						format: gasTypeFormat,
						sorting: false,
						index: 11
					},
					{
						col: "oldBookNo",
						friendly: "原本号",
						sorting: false,
						hidden: true,
						readonly: "readonly",
						index: 12
					},
					{
						col: "bookType",
						friendly: "本类型",
						format: GasModBas.bookTypeFormat,
						inputsource: "select",
						readonly: "readonly",
						index: 13
					},
					{
						col: "customerKind",
						friendly: "客户种类", //居民还是非居民
						format: GasModCtm.customerKindFormat,
						hidden: true,
						sorting: false,
						index: 14
					},
					{
						col: "mobile",
						friendly: "联系电话",
						sorting: false,
						index: 15
					},
					//MOBILE
					{
						col: "customerType",
						friendly: "客户类型", //IC卡表还是普表
						sorting: false,
						index: 16
					},
					{
						col: "customerKind",
						friendly: "客户类别", //居民还是非居民
						sorting: false,
						index: 17
					},
					{
						col: "ctmArchiveId",
						friendly: "客户档案ID",
						//hidden:true,
						unique: true,
						nonedit: "nosend",
						readonly: "readonly",
						sorting: false,
						index: 18
					},
					/*{
					    col:"ctmArchiveId",
					    friendly:"重新生成抄表计划",
					    format:operateFormat,
					    sorting:false,
					    index:19
					}*/

				],
				findFilter: function() {
					var base_url = '/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=';
					var whereinfo = '1=1';

					if($('#bookNumber').val()) {
						whereinfo += " and b.book_code = '" + $('#bookNumber').val() + "'";
					}
					if($('#bookAddress').val()) {
						whereinfo += " and b.address like '%" + $('#bookAddress').val() + "%'";
					}

					if($('#find_areaId').val()) {
						whereinfo += " and b.area_id='" + $('#find_areaId').val() + "'";
					}
					if($('#find_serviceperId').val()) {
						whereinfo += " and b.serviceper_id='" + $('#find_serviceperId').val() + "'";
					}
					if($('#find_countperId').val()) {
						whereinfo += " and b.countper_id='" + $('#find_countperId').val() + "'";
					}

					if($('#find_booktype option:selected').val()) {
						whereinfo += " and b.book_type='" + $('#find_booktype option:selected').val() + "' ";
					}

					if($('#find_bookcode').val()) {
						whereinfo += " and b.book_code='" + $('#find_bookcode').val() + "' ";
					}
					if($('#find_gasTypeId option:selected').val()) {
						whereinfo += " and a.gas_type_id='" + $('#find_gasTypeId option:selected').val() + "' ";
					}
					if($('#find_customerCode').val()) {
						whereinfo += " and a.customer_code='" + $('#find_customerCode').val() + "' ";
					}
					if($('#find_customerName').val()) {
						whereinfo += " and a.customer_name like '%" + $('#find_customerName').val() + "%' ";
					}

					if($('#find_customerState option:selected').val()) {
						whereinfo += " and a.customer_state='" + $('#find_customerState option:selected').val() + "' ";
					}
					if($('#find_customerAddress').val()) {
						whereinfo += " and a.customer_address like '%" + $('#find_customerAddress').val() + "%' ";
					}
					if($('#find_idcardno').val()) {
						whereinfo += " and a.idcard ='" + $('#find_idcardno').val() + "' ";
					}
					if($('#find_customerkind').val()){
						whereinfo +=" and a.customer_kind='"+$('#find_customerkind').val()+"' ";
					}

					whereinfo += " and b.status<>'3' ";
					whereinfo += " and a.customer_state<>'99' ";
					var bd = {
						"cols": "a.ctm_archive_id,a.bookId,b.areaId,b.countperId,b.serviceperId,b.bookCode," +
							" a.customerCode,a.customerName,a.meterUserName,a.customerAddress,a.gasTypeId,a.mobile,a.customerType," +
							" bs.has_business,a.customerKind ",
						"froms": " gas_ctm_archive a " +
							" left join gas_mrd_book b on b.book_id = a.book_id " +
							" left join (select count(1) has_business ,br.ctm_archive_id,br.customer_code " +
							" from gas_csr_busi_register br where br.bill_state='N' and br.blank_out_sign='N' group by br.ctm_archive_id,br.customer_code ) bs on bs.ctm_archive_id=a.ctm_archive_id ",
						"wheres": whereinfo,
						"page": "true",
						"limit": 50
					};
					xw.setRestURL(base_url + encodeURIComponent(JSON.stringify(bd)));
					return "";
				}
			});
		},
		initBtn: function() {

			//判断-- 是同一区域的 转入另一个供气区域
			//还是 不同供气区域转入一个供气区域？ 
			//还要不要 修改 核算员和客户服务员？
			$('#mark_button').on('click', function(e) {
				var selrows = xw.getTable().getData(true);
				//$('#myModal').attr("aria-hidden","true").css("display","none");
				/*$('#myModal').css({'display':"block",'background':"rgba(0,0,0,0.3)"});
                $('#myModal').attr("aria-hidden","false");
                $('#myModal').addClass('in');
                $('#myModal').removeAttr("disabled");*/
				/**/

				$('#myModal1').modal('show');

				//选择的 change
				$('#from_bookorcustomer').on('change', function(e) {
					if($('#from_bookorcustomer').val() == '2') { //按户生成
						$('#modify_book').show();
						$('#modify_oldbook').hide();
					} else {
						$('#modify_book').hide();
						$('#modify_oldbook').show();
					}

				});

			});
			
			//保存--专区
			$('#save_btn_changearea').on('click', function(e) {
				var selrows = xw.getTable().getData(true);
				//判断 是否选择按本生成
				if(!$('#from_bookorcustomer').val()) {
					bootbox.alert("请选择【是否按抄表本专区】");
					return;
				}
				//如果是按户生成--判断 是否填写目标抄表本号
				if($('#from_bookorcustomer').val() == '2') {
					if(selrows.rows.length == 0) {
						bootbox.alert("<br><center><h4>按户专区，请选择需要专区的客户。</h4></center><br>");
						return;
					}
					if(!$('#from_bookcode').val()) {
						bootbox.alert("请填写【目标抄表本号】");
						return;
					}

				} else { //按本生成
					//判断 现本号是否为空
					if(!$('#old_bookcode').val()){
						bootbox.alert("请填写【现抄表本本编号】");
						return;
					}
				}

				//选择供气区域
				if(!$('#from_areaId').val()) {
					bootbox.alert("请选择【目标供气区域】");
					return;
				}
				if(!$('#from_countperId').val()) {
					bootbox.alert("请选择【目标核算员】");
					return;
				}
				if(!$('#from_serviceperId').val()) {
					bootbox.alert("请选择【目标客户服务员】");
					return;
				}
				var selrows = xw.getTable().getData(true);
				var fdata = {};
				fdata.areaid= $('#from_areaId').val();
				fdata.countperid = $('#from_countperId').val();
				fdata.serviceperid = $('#from_serviceperId').val();
				if($('#from_bookorcustomer').val() == '1'){//按本专区
					fdata.transfertype ='b';//按本转区
					fdata.nowbookcode = $('#old_bookcode').val();//当前抄表本的本号
				}else if($('#from_bookorcustomer').val() == '2'){//按户专区
					
					if(selrows.rows.length == 0) {
						bootbox.alert("<br><center><h4>按户专区，请选择需要专区的客户。</h4></center><br>");
						return;
					}
					fdata.transfertype = 'c'//按户转区
					fdata.frombookcode =$('#from_bookcode').val(); //目标抄表本
					var ctmarchiveids = new Array();
					$.each(selrows.rows,function(idx,row){
						//ctm_archive_id放到
						ctmarchiveids.push(row.ctmArchiveId);
					});
					if(ctmarchiveids == null || ctmarchiveids.length == 0){
						bootbox.alert("<br><center><h4>按户专区，请选择需要专区的客户。</h4></center><br>");
						return;
					}
					fdata.ctmarchiveids = ctmarchiveids.join();
				}
				fdata.servicename = 'TURNAREA';
				// 客户 转区
				var base_url = '/hzqs/pla/pbgpl.do?fh=GPLPLA0000000J00&resp=bd';
				$.ajax({
					type:"POST",
			        url:base_url,
			        data:JSON.stringify(fdata),
			        async:false,
			        dataType: 'json',
			        contentType:"application/json; charset=utf-8;",
			        success:function(resultsm){
			        	if(resultsm.err_code =='1'){
			        		$('#myModal1').modal('hide');
			        		bootbox.alert("转区成功。");
			        		
			        		xw.autoResetSearch();
			        	}else{
			        		if(resultsm.msg){
			        			bootbox.alert("转区失败。原因："+resultsm.msg);
			        		}else{
			        			bootbox.alert("转区失败。");	
			        		}
			        	}
			        },
			        error:function(){
			        	bootbox.alert("转区失败。");
			        }
				});
			});
		}
	}
}();