var detailform;
var selrow_obj;
var moditem_obj;
var updatearray= new Array();
//{ '0':'新生成','1':'下装','2':'录入','3':'分析中','4':'已分析','5':'计费中','6':'计费完成','E':'分析异常','7':'开栓','8':'办业务计费'};
var copyStatusEdit = function(val) {
	if(val == "2") {
		return "<select id='status' name='status' class='form-control chosen-select'>" +
			"<option value='2' selected>已录入</option>" +
			"<option value='3' >分析中</option>" +
			"<option value='4' >已分析</option>" +
			"<option value='E' >分析异常</option></select>";
	} else if(val == "3") {
		return "<select id='status' name='status' class='form-control chosen-select'>" +
			"<option value='2' >已录入</option>" +
			"<option value='3' selected>分析中</option>" +
			"<option value='4' >已分析</option>" +
			"<option value='E' >分析异常</option></select>";
	} else if(val == "4") {
		return "<select id='status' name='status' class='form-control chosen-select'>" +
			"<option value='2' >已录入</option>" +
			"<option value='3' >分析中</option>" +
			"<option value='4' selected>已分析</option>" +
			"<option value='E' >分析异常</option></select>";
	} else {
		return "<select id='status' name='status' class='form-control chosen-select'>" +
			"<option value='2' >已录入</option>" +
			"<option value='3' >分析中</option>" +
			"<option value='4' >已分析</option>" +
			"<option value='E' selected>分析异常</option></select>";
	}
};

var auditTypes = {};

var select_row;
var showpic = false;

var view_recs = new Array();
var view_idx = 0;

var enumCustomerKind = function(val) {
	if(val == '1') return '居民'
	return '非居民'
}

var enumEmployeeName = function(val, rows, cell, cellid) {
	return GasModSys.employeeNameFormat.f(val, rows, cell, cellid, false)
}
var enumMeterUserState = function(val) {

	return GasModCtm.enumMeterUserState[val]
}

var enumGasTypeName = function(val, rows, cell, cellid) {
	return GASModSys.gasTypeIdFromat.f(val, rows, cell, cellid, false);
}

var editcoldefs = [
	"bookCode:抄表本号,customerCode:客户编号,customerKind@enumCustomerKind:客户类型,customerType@FFGasModCtm.customerTypeByArhcidFormat:表类型",
	"customerName:表户名称,customerAddress:用气地址",
	"copyType@FFGasModMrd.copyTypeFormat:抄表类型,meterUserState@enumMeterUserState:表具状态,reviseMeterState@DDGasModCtm.enumChargeMeterRevise:修正表状态,vbt@FFGasModCtm.vbVbtByFormat:vb/vbt",

	"lastMeterReading:上次表读数,meterReading:燃气表读数,chargeMeterReading:计费气量,fileUploadStatus@FFGasModMrd.fileUploadStateFormat:图片上传状态",
	"lastReviseReading:上次修正表读数,reviseReading:修正表读数,photoCount:燃气表图片,isBll@ENGasModMrd.enumIsBll:是否已计费",
	"lastReadingDate:上次抄表日期,planCopyTime:计划抄表时间,copyTime:实抄时间,uploadTime:数据上传时间",
	"quotiety:修正系数,dataSource@FFGasModMrd.dataSourceFormat:数据来源,operate@ENGasModMrd.enumOperate:操作类型,remaingAsnum:表内剩余气量",
	"lastAccumulatedGas:上次表内累计气量,accumulatedGas:表内累计气量,cardBalancEsum:表内剩余余额,accumulatedAmount:表内累计金额",

	"countperId@enumEmployeeName:核算员,serviceperId@enumEmployeeName:抄表员,modifiedBy:变更人,modifiedTime:变更时间",

]

var viewPopEditGroup;
var viewDetail = function(selrows, row_id) {

	if(!selrows) {
		var rows = new Array();
		selrows = xw.getTable().getData()
		$.each(selrows.rows, function(idx, row) {
			if(row.meterReadingId == row_id) {
				rows.push(row);
			}
		});
		selrows.rows = rows;
		selrow_obj = rows[0];
		//console.log(selrow_obj);
	}

	//if(!detailform)
	{
		detailform = Duster.buildArr($('#__dust_simpleform'));
	}
	view_recs = new Array();
	$.each(selrows.rows, function(rowidx, row) {
		var viewdata = new Array();
		var viewGroup;
		$.each(editcoldefs, function(idx, textrow) {
			viewGroup = new Array();
			viewdata.push(viewGroup);
			viewGroup.grp_rows = new Array();
			var grouplength = textrow.split(",").length;
			$.each(textrow.split(","), function(colidx, col) {
				if(col.indexOf(":") < 0) return;
				var coldef = col.split(":")[0];
				var title = col.split(":")[1];
				var colname = coldef;
				var value = row[colname];
				/*if(colname == "meterReading" || colname =="reviseReading" || colname=="quotiety" ){
					updatearray.push((rowidx+"_"+colname));
				}*/
				if(coldef.indexOf("@") >= 0) {
					var colname = coldef.split('@')[0];
					var colfunc = coldef.split('@')[1];
					if(colfunc.startsWith("FF")) {
						console.log("ff==" + colfunc.substr(2))
						value = eval(colfunc.substr(2) + ".f('" + row[colname] + "'," + JSON.stringify(row) +
							",null,'sf_" + rowidx + "_" + colname + "');");
						// console.log(colname)
						// console.log(row[colname])
					} else
					if(colfunc.startsWith("EN")) {
						console.log("EN==" + colfunc.substr(2))
						value = eval(colfunc.substr(2) + "['" + row[colname] + "']");

					} else
					if(colfunc.startsWith("DD")) {
						console.log("DD==" + colfunc.substr(2));
						//var cname = colfunc.substr(2);
						if(colname == 'reviseMeterState') {
							//var display = ""
							$.ajax({
								url: Utils.queryURL(hzq_rest + "gasctmmeter") + 'query={"ctmArchiveId":"' + row.ctmArchiveId + '"}&fields={"reviseMeterState":1}',
								dataType: 'json',
								async: false,
							}).done(function(data, retcode) {
								if(data.length > 0) {
									value = GasModCtm.enumChargeMeterRevise[data[0].reviseMeterState]
									if(!value) {
										value = data[0].reviseMeterState
									}
								}
							});
						} else
						if(colname == 'vbt' || colname == 'vbVbt') {
							$.ajax({
								url: Utils.queryURL(hzq_rest + "gasctmmeter") + 'query={"ctmArchiveId":"' + row.ctmArchiveId + '"}&fields={"vbVbt":1}',
								dataType: 'json',
								async: false,
							}).done(function(data, retcode) {
								if(data.length > 0) {
									value = data[0].vbVbt;
									if(!value) {
										value = '';
									}
								}
							});
						}
					} else {
						
						/*else if(colname =="reviseReading"){
							
						}else if(colname == "quotiety"){
							
						}
						colname
						rowidx*/
						value = eval(colfunc + "('" + row[colname] + "'," + JSON.stringify(row) + ",null,'#sf_" + rowidx + "_" + colname + "');");
					}

				}
				if(row["customerType"] == "P") {
					row["lastAccumulatedGas"] = "";
					row["accumulatedGas"] = "";
				}

				viewGroup.grp_rows.push({
					title: title,
					"value": value,
					"col": 12 / grouplength,
					"colname": rowidx + "_" + colname
				})

			})

		})
		select_row = row;
		viewGroup = new Array();
		viewdata.push(viewGroup);
		viewGroup.grp_rows = new Array();

		var result = ""
		if(row.reservedField1) result = row.reservedField1 + ","
		if(row.failedReason1)
			$.each(row.failedReason1.split(','), function(index, code) {
				if(auditTypes[code]) {
					result += auditTypes[code] + ",";
				}
			})
		if(row.failedReason2)
			$.each(row.failedReason2.split(','), function(index, code) {
				if(auditTypes[code]) {
					result += auditTypes[code] + ",";
				}
			})

		viewGroup.grp_rows.push({
			title: "自动复核结果:",
			"value": result,
			"col": 4,
			type: "textarea",
			tcol: 4,
			vcol: 10,
			cols: 8,
			rows: 2
		})
		viewGroup.grp_rows.push({
			title: "没拍照原因:",
			"value": row.noPhotoReason,
			"col": 4,
			type: "textarea",
			tcol: 4,
			vcol: 10,
			cols: 8,
			rows: 2
		})
		viewGroup.grp_rows.push({
			title: "反馈内容:",
			"value": row.feedback,
			"col": 4,
			type: "textarea",
			tcol: 4,
			vcol: 10,
			cols: 8,
			rows: 2
		})

		showpic = false;

		/* if(row.photoCount>0){
		     var fileurls = Restful.find(hzq_rest+"/gasbasfile",RQLBuilder.equal("busiId",row.meterReadingId).rqlnoenc());
		         //row.meterReadingId).rql())
		     console.log("phtodata=="+JSON.stringify(fileurls));
		 var imgas=new Array()
		     if(fileurls&&fileurls.length>0){
		         $.each(fileurls,function(idx,filerow){
		             var vs=filerow.filePath.split("/");
		             imgas.push({"src":"/hzqs/sys/download.do?fid="+filerow.fileId,"alt":filerow.fileName})
		         })
		         showpic = true;
		         viewGroup = new Array();
		         viewdata.push(viewGroup);
		         viewGroup.grp_rows=new Array();
		         viewGroup.grp_rows.push({title:"照片","col":2,type:"img","imgurls":imgas})
		     }  

		 }else{
		 }*/
		//if(row.photoCount > 0){
		var imgas = new Array();
		var meterphoto = row.meterPhoto;
		var revisephoto = row.revisePhoto;
		var feedbackphoto = row.feedbackPhoto;
		var arrmeterphoto = new Array();
		var arrrevisephoto = new Array();
		var arrfeedbackphoto = new Array();
		if(meterphoto && meterphoto != null && meterphoto != '' && (meterphoto).trim() != '') {
			if(meterphoto.indexOf(",") > 0) {
				arrmeterphoto = meterphoto.split(",");
			} else {
				arrmeterphoto.push(meterphoto);
			}
		}
		if(revisephoto && revisephoto != null && revisephoto != '' && (revisephoto).trim() != '') {
			if(revisephoto.indexOf(",") > 0) {
				arrrevisephoto = revisephoto.split(",");
			} else {
				arrrevisephoto.push(revisephoto);
			}
		}
		if(feedbackphoto && feedbackphoto != null && feedbackphoto != '' && (feedbackphoto).trim() != '') {
			if(feedbackphoto.indexOf(",") > 0) {
				arrfeedbackphoto = feedbackphoto.split(",");
			} else {
				arrfeedbackphoto.push(feedbackphoto);
			}
		}
		if(arrmeterphoto.length <= 0 && arrrevisephoto.length <= 0 && arrfeedbackphoto <= 0) {
			var fileurls = Restful.find(hzq_rest + "/gasbasfile", RQLBuilder.equal("busiId", row.meterReadingId).rqlnoenc());
			//row.meterReadingId).rql())
			console.log("phtodata==" + JSON.stringify(fileurls));
			// var imgas=new Array()
			if(fileurls && fileurls.length > 0) {
				$.each(fileurls, function(idx, filerow) {
					var vs = filerow.filePath.split("/");
					imgas.push({
						"src": "/hzqs/sys/download.do?fid=" + filerow.fileId,
						"alt": filerow.fileName
					})
				})
				showpic = true;
				viewGroup = new Array();
				viewdata.push(viewGroup);
				viewGroup.grp_rows = new Array();
				viewGroup.grp_rows.push({
					title: "照片",
					"col": 2,
					type: "img",
					"imgurls": imgas
				})
			}
		} else {
			if(arrmeterphoto.length > 0) {
				for(var i = 0; i < arrmeterphoto.length; i++) {
					var fileurls = Restful.getByID(hzq_rest + "/gasbasfile", arrmeterphoto[i]);
					imgas.push({
						"src": "/hzqs/sys/download.do?fid=" + arrmeterphoto[i],
						"alt": fileurls.fileName
					})
				}
			}
			if(arrrevisephoto.length > 0) {
				for(var i = 0; i < arrrevisephoto.length; i++) {
					var fileurls = Restful.getByID(hzq_rest + "/gasbasfile", arrrevisephoto[i]);
					imgas.push({
						"src": "/hzqs/sys/download.do?fid=" + arrrevisephoto[i],
						"alt": fileurls.fileName
					})
				}
			}
			if(arrfeedbackphoto.length > 0) {
				for(var i = 0; i < arrfeedbackphoto.length; i++) {
					var fileurls = Restful.getByID(hzq_rest + "/gasbasfile", arrfeedbackphoto[i]);
					imgas.push({
						"src": "hzqs/sys/download.do?fid=" + arrfeedbackphoto[i],
						"alt": fileurls.fileName
					})
				}
			}
			showpic = true;
			viewGroup = new Array();
			viewdata.push(viewGroup);
			viewGroup.grp_rows = new Array();
			viewGroup.grp_rows.push({
				title: "照片",
				"col": 2,
				type: "img",
				"imgurls": imgas
			})

		}

		//}

		console.log("idx==:" + rowidx)
		console.log(row)
		var extprops = {
			cols: [0, 12, 0],
			refId: row.meterReadingId,
			groups: "sf_" + rowidx
		}
		if(rowidx > 0) {
			if(rowidx < selrows.rows.length - 1) {
				extprops = {
					cols: [4, 4, 4],
					prev: true,
					next: true,
					refId: row.meterReadingId,
					groups: "sf_" + rowidx
				}
			} else {
				extprops = {
					cols: [6, 6, 0],
					prev: true,
					refId: row.meterReadingId,
					groups: "sf_" + rowidx
				}
			}
		} else {
			if(rowidx < selrows.rows.length - 1) {
				extprops = {
					cols: [0, 6, 6],
					next: true,
					refId: row.meterReadingId,
					groups: "sf_" + rowidx
				}
			}
		}
		console.log(viewdata)
		console.log(extprops)
		var inhtml = detailform(viewdata, extprops);

		view_recs.push(inhtml);
		
	}) //end loop
	//console.log("inhtml=="+inhtml)
	//bootbox.alert()
	view_idx = 0;

	$('#detail_modal').find('.modal-body').html(view_recs[view_idx]);

	$('#detail_modal').modal('show');
	
	/*if(updatearray!= null && updatearray.length != 0 ){
		for(var i=0;i<updatearray.length;i++){
			console.log("#sf_"+updatearray[i]);
			$('#sf_'+updatearray[i]).removeAttr("disabled");
		}
	}*/
	
	$('#sf_0_meterReading').removeAttr("disabled");
	$('#sf_0_reviseReading').removeAttr("disabled");
	$('#sf_0_quotiety').removeAttr("disabled");
	$('#sf_0_remaingAsnum').removeAttr("disabled");//2017-10-12 增加：剩余气量要修改

};

var handleFancybox = function() {
	if(!jQuery.fancybox) {
		return;
	}

	jQuery(".fancybox-fast-view").fancybox();

	if(jQuery(".fancybox-button").size() > 0) {
		jQuery(".fancybox-button").fancybox({
			groupAttr: 'data-rel',
			prevEffect: 'none',
			nextEffect: 'none',
			closeBtn: true,
			helpers: {
				title: {
					type: 'inside'
				}
			}
		});

		$('.fancybox-video').fancybox({
			type: 'iframe'
		});
	}
}
//判断是否过周--返回过周后读数
var getTurnaround = function(reading, lastreading, meterdigit) {
	if(parseInt(reading) >= parseInt(lastreading)) {
		return reading - lastreading;
	} else {
		var metermax = "";
		for(var i = 0; i < meterdigit; i++) {
			metermax = String(metermax) + String("9");
		}
		var nummetermax = parseInt(metermax);
		var chargemeterreading = nummetermax - parseInt(lastreading) + parseInt(reading) + parseInt(1);
		return chargemeterreading;
	}

}
var getWheres = function(isForStat) {
	var wheres = " 1=1 ";
	// var find_areaId , find_countperId,find_serviceperId,find_customerId,copystate,book_code;
	//var createtimefrom,createtimeto,errortype,biztype;
	if($('#find_areaId').val()) {
		//find_areaId=RQLBuilder.equal("areaId",$('#find_areaId').val());
		wheres += " and mr.areaId='" + $('#find_areaId').val() + "'"
	}

	if(UserInfo.item().station_id == '1') {
		//find_countperId=RQLBuilder.equal("countperId",UserInfo.userId());   
		wheres += " and mr.countperId='" + UserInfo.userId() + "'"
	} else {
		if($('#find_countperId').val()) {
			//find_countperId=RQLBuilder.equal("countperId",$('#find_countperId').val());
			wheres += " and mr.countperId='" + $('#find_countperId').val() + "'"
		}
	}

	if($('#find_serviceperId').val()) {
		//find_countperId=RQLBuilder.equal("countperId",$('#find_countperId').val());
		wheres += " and mr.serviceperId='" + $('#find_serviceperId').val() + "'"
	}

	if(isForStat) {

		return wheres;
	}

	var cp = $('ul.copystate > li.active').attr('cp')

	if($('#createtimefrom').val()) {
		if(cp == 'all') {
			wheres += "and mr.planCopyTime >= to_date('" + $('#createtimefrom').val() + " 00:00:00','YYYY-MM-DD HH24:MI:SS')"
		} else {
			wheres += "and mr.copyTime >= to_date('" + $('#createtimefrom').val() + " 00:00:00','YYYY-MM-DD HH24:MI:SS')"
		}

		//createtimefrom=RQLBuilder.condition("copyTime","$gte","to_date('"+$('#createtimefrom').val()+" 00:00:00','YYYY-MM-DD HH24:MI:SS')");
	}
	if($('#createtimeto').val()) {
		if(cp == 'all') {
			wheres += "and mr.planCopyTime <= to_date('" + $('#createtimeto').val() + " 23:59:59','YYYY-MM-DD HH24:MI:SS')"
		} else {
			wheres += "and mr.copyTime <= to_date('" + $('#createtimeto').val() + " 23:59:59','YYYY-MM-DD HH24:MI:SS')"
		}

		//   createtimeto=RQLBuilder.condition("copyTime","$lte","to_date('"+$('#createtimeto').val()+" 23:59:59','YYYY-MM-DD HH24:MI:SS')");
	}
	if($('#find_operate').val()){
		wheres +=" and mr.operate ='"+$('#find_operate').val()+"' ";
	}

	if($('#data_biztype').val() && $('#data_biztype').val() != "0") {
		//biztype=RQLBuilder.equal("customerKind",$('#data_biztype').val());

		wheres += "and ar.customerKind='" + $('#data_biztype').val() + "'"
	}

	if($('#find_customerType').val() && $('#find_customerType').val() != "0") {
		wheres += "and ar.customerType='" + $('#find_customerType').val() + "'"
		//wheres +=" and mr.customerType='"+$('#find_customerType').val()+"' "
	}

	if($('#find_has_picture').val()) {
		/*if($('#find_has_picture').val()=='0'){
		    wheres += " and mr.fileUploadStatus is null "
		}else{
		    wheres += " and mr.fileUploadStatus is not null "            
		}*/

		if($('#find_has_picture').val() == '0') {
			wheres += " and nvl(mr.meter_photo,'0')='0' and nvl(mr.revise_photo,'0')='0' and nvl(mr.feedback_photo,'0')='0' "; //没照片
		} else {
			wheres += " and nvl(mr.meter_photo,'0')<>'0' and nvl(mr.revise_photo,'0')<>'0' and nvl(mr.feedback_photo,'0')<>'0' "; //有照片
		}
	}
	if($('#book_code').val()) {
		//book_code=RQLBuilder.like("bookCode",$('#book_code').val());
		wheres += "and mr.bookCode='" + $('#book_code').val() + "'"
	}

	if(cp != 'all') {
		wheres += "and mr.copyState='" + cp + "'"
		//copystate = RQLBuilder.equal("copyState",cp);                            
	}
	if(cp == 'E') {
		var error_selected = $('#exception_type').val();
		console.log("EE:" + error_selected);
		if(error_selected == 'OTHER') {
			// errortype = RQLBuilder.like("reservedField1",":");
			wheres += "and mr.reservedField1 like '%:%'"
		} else if(error_selected != 'ALL') {
			if(error_selected.startsWith("hzq.aud.sql")) {
				//       errortype = RQLBuilder.like("failedReason1",error_selected+",");
				wheres += "and mr.failedReason1 like '%" + error_selected + "%'"
			} else {
				//errortype = RQLBuilder.like("failedReason2",error_selected+",");
				wheres += "and mr.failedReason2 like '%" + error_selected + "%'"
			}

		}
		//console.log("search::"+errortype)
	}
	var find_arch_Id;
	if($('#custom_code').val()) {
		wheres += "and ar.customerCode='" + $('#custom_code').val() + "'"
		// $.ajax({
		//     url: Utils.queryURL(hzq_rest+ "gasctmarchive")+'fields={"ctmArchiveId":1}&query={"customerCode":"'+$('#custom_code').val()+'"}',
		//     dataType: 'json',
		//     async: false,
		// }).done(function(data,retcode) {
		//     console.log("getdata::"+JSON.stringify(data))
		//     if(data&&data.length>0){
		//         find_arch_Id = RQLBuilder.equal('ctmArchiveId',data[0].ctmArchiveId);
		//     }else{
		//         bootbox.alert("未找到客户档案："+$('#custom_code').val())
		//     }
		// });                            
	}

	//用气性质
	if($('#find_gasTypeId').val() && !$('#find_gasTypeId1').val() && !$('#find_gasTypeId2').val()) {

		if($('#find_gasTypeId').val() == "2") {
			wheres += " and ar.customer_kind='1' ";
		} else {
			wheres += " and ar.customer_kind='9' ";
		}

	} else if($('#find_gasTypeId').val() && $('#find_gasTypeId1').val() && !$('#find_gasTypeId2').val()) {
		console.log($('#find_gasTypeId1').val())
		wheres += " and ar.gas_type_id like '" + $('#find_gasTypeId1').val() + "%'  ";
	} else if($('#find_gasTypeId').val() && $('#find_gasTypeId1').val() && $('#find_gasTypeId2').val()) {
		console.log($('#find_gasTypeId2').val())
		wheres += " and ar.gas_type_id = '" + $('#find_gasTypeId2').val() + "' ";
	}

	return wheres;

}

var meterstatusEdit = function(val, row) {
	console.log("meterstatusEdit::row=" + row)
	if(row) {
		var display = ""
		$.ajax({
			url: Utils.queryURL(hzq_rest + "gasctmmeter") + 'query={"ctmArchiveId":"' + row.ctmArchiveId + '"}&fields={"meterUserState":1}',
			dataType: 'json',
			async: false,
		}).done(function(data, retcode) {
			if(data.length > 0) {
				display = GasModCtm.enumMeterUserState[data[0].meterUserState]
				if(!display) {
					display = data[0].meterUserState
				}
			}
		});

		return display;

	} else {
		return ""
	}
}

var reviseMeterstatusEdit = function(val, row) {
	console.log("meterstatusEdit::row=" + row)
	if(row) {
		var display = ""
		$.ajax({
			url: Utils.queryURL(hzq_rest + "gasctmmeter") + 'query={"ctmArchiveId":"' + row.ctmArchiveId + '"}&fields={"reviseMeterState":1}',
			dataType: 'json',
			async: false,
		}).done(function(data, retcode) {
			if(data.length > 0) {
				display = GasModCtm.enumReviseMeterState[data[0].reviseMeterState]
				if(!display) {
					display = data[0].reviseMeterState
				}
			}
		});

		return display;

	} else {
		return ""
	}
}

var auditReasonFormat = {
	f: function(val, row, cell) {
		if(row.copyState == 'E') {
			var result = ""
			if(row.reservedField1) result = row.reservedField1 + ","
			if(row.failedReason1)
				$.each(row.failedReason1.split(','), function(index, code) {
					if(auditTypes[code]) {
						result += auditTypes[code] + ",";
					}
				})
			if(row.failedReason2)
				$.each(row.failedReason2.split(','), function(index, code) {
					if(auditTypes[code]) {
						result += auditTypes[code] + ",";
					}
				})

			return result;
		}
	}
}

var xw;
var xwLogs;
var resetSearch = function() {
	var cp = $('ul.copystate > li.active').attr('cp')
	if(cp == 'all') {
		BaseAction.initCharts()
		BaseAction.initAccessLogs();
	} else {
		xw.autoResetSearch();
	}
}

var modlist = {}
var BaseAction = function() {

	function setStartEnd(startdiff, timed) {
		console.log(startdiff);
		console.log(timed);
		$('#createtimefrom').val(moment().add(startdiff, timed).format('YYYY-MM-DD'))
		$('#createtimeto').val(moment().format('YYYY-MM-DD'));
		resetSearch(); //xw.autoResetSearch();
	}

	// var extprops = "customerKind@enumCustomerKind:客户类型,lastReviseReading:上次修正表读数,photoCount:图片总数,cardBalancEsum:表内累计剩余余额,remaingAsnum:表内累计剩余气量,accumulatedGas:表内累计气量,accumulatedAmount:表内累计金额,chargeMeterReading:计费气量,countperId@enumEmployeeName:核算员,serviceperId@enumEmployeeName:抄表员,modifiedTime:变更时间,lastReadingDate:上次抄表日期,planCopyTime:计划抄表时间,feedback:反馈内容";
	var extprops = "customerKind@enumCustomerKind:客户类型,lastReviseReading:上次修正表读数,photoCount:图片总数,cardBalancEsum:表内累计剩余余额,remaingAsnum:表内累计剩余气量,accumulatedGas:表内累计气量,accumulatedAmount:表内累计金额,countperId@enumEmployeeName:核算员,serviceperId@enumEmployeeName:抄表员,modifiedTime:变更时间,lastReadingDate:上次抄表日期,planCopyTime:计划抄表时间,feedback:反馈内容";

	$('#mark_button').on('click', function() {
		var selrows = xw.getTable().getData(true);
		if(selrows.rows.length == 0) {
			bootbox.alert("<br><center><h4>请选择需要预览的行</h4></center><br>");
			return;
		}
		var batchids = new Array();
		var businessids = new Array();
		var normalnobll = new Array();
		//var readingisnull = new Array();

		$.each(selrows.rows, function(idx, row) {
			if(row.copyState == '2' || row.copyState == 'E' || row.copyState == '3' || row.copyState == 'A' || row.copyState=='4') //已录入，待分析，异常，
			{
				batchids.push(row.meterReadingId);
			}
			if(row.customerKind == '9' && row.chargeMeterReading < 0) { //非居民计费读数为负不允许修改为正常
				businessids.push(row.meterReadingId);
			}
			console.log(row);

			if((!row.hasOwnProperty("chargeMeterReading")) || row.chargeMeterReading == undefined || row.chargeMeterReading == null || row.chargeMeterReading === '') {
				normalnobll.push(row.meterReadingId);
			}
			/*if(row.reviseMeterState && (row.reviseMeterState =='01' || row.reviseMeterState == '06')){
				if((!row.hasOwnProperty("reviseReading")) || row.reviseReading == undefined || row.reviseReading==null || row.reviseReading ===''){
					readingisnull.push(row.meterReadingId);
				}
			}
			if((row.customerKind && row.customerKind =='1' )||(row.reviseMeterState && row.reviseMeterState == '07' || row.reviseMeterState == '09')){
				if((!row.hasOwnProperty("meterReading")) || row.meterReading == undefined || row.meterReading == null || row.meterReading ===''){
					readingisnull.push(row.meterReadingId);
				}
			}*/
			/*if(row.customerKind && row.customerKind == '1' ){//居民 燃气表 为空
				if((!row.hasOwnProperty("meterReading")) || row.meterReading == undefined || row.meterReading == null || row.meterReading ===''){
					readingisnull.push(row.meterReadingId);
				}
			}else{//非居民的 _根据ctm_archive_id 去查看
				//Restful.find('hzq_rest'+gasctmmeter,);
				//Restful.getByID()
				//var 
			}*/
		})
		if(batchids.length == selrows.rows.length) {//</option><option value='2'>录入(重新自动分析)
			var box = bootbox.confirm({
				title: "批量修改状态",
				message: "<form class='bootbox-form form-horizontal form-bordered form-label-stripped'><div class='form-body'>" +
					"<div class='form-group'> <label class='col-md-2 control-label'>新状态</label>" +
					"<div class='col-md-10'><select id='form_copyState' name='copyState' class='form-control select2me chosen-select'><option value='4'>正常（待计费）</option><option  value='E'>异常(待修改)</option><option value='A'>正常（不计费）</option></select>" +
					"</div></div>" +
					"<div class='form-group'><label class='col-md-2 control-label'>修改原因</label><div class='col-md-10'><input type=text id='failed_reason_input' class='bootbox-input bootbox-input-text form-control' name = 'failed_reason_input'/>" +
					"</div></div>" +
					"</div></form>",
				buttons: {
					cancel: {
						label: '<i class="fa fa-times"></i> 取消'
					},
					confirm: {
						label: '<i class="fa fa-check"></i> 确认'
					}
				},
				callback: function(result) {
					if(result) {
						var formcopystate = $('#form_copyState').val();
						if(formcopystate && formcopystate == '4' && businessids != null && businessids.length > 0) {
							bootbox.alert("<h1>计费读数为负的非居民不能标记为正常。</h1>");
							// e.preventDefault();
							return;
						}
						/*if(formcopystate && formcopystate=='4' &&  readingisnull!= null && readingisnull.length > 0){
							bootbox.alert("<h1>表读数为空</h1>。");
							return;
						}*/
						if(normalnobll != null && normalnobll.length > 0 && formcopystate && formcopystate == '4') {
							bootbox.alert("<h1>计费读数为空不能标记为正常,请判断数据来源，然后选择是否为【正常（不计费）】。</h1>");
							//e.preventDefault();
							return;
						}
						if(!$('#failed_reason_input').val() || $('#failed_reason_input').val().trim().length < 0) {
							bootbox.alert("<h1>请写修改原因才能提交！</h1>");
							//e.preventDefault();
							return;
						}
						if($('#form_copyState').val() && $('#form_copyState').val() =='2'){
							bootbox.alert("<h1>如果您想要重抄本计划，请并告知客户服务员上传数据和图片，然后等您生成临时计划后，请客户服务员联网重新登录。即可重抄本户。</h1>");
							return ;
						}
						console.log("update to :" + $('#form_copyState').val())

						if($('#form_copyState').val() == 'E') {

						}
						var result = Restful.updateRNQ(hzq_rest + "gasmrdmeterreading", batchids.join(','), {
							copyState: $('#form_copyState').val(),
							reservedField1: "人为修改:" + $('#failed_reason_input').val(),
							failedReason1: "",
							failedReason2: "",
							modifiedBy: UserInfo.userId(),
							modifiedTime: moment().format('YYYY-MM-DD'),

						})
						if(result && result.success) {
							bootbox.alert("<h3>修改成功：共（" + result.retObj + "）条</h3>")
							xw.autoResetSearch();
						} else {
							bootbox.alert("网络故障～修改失败～")
						}
						//console.log("result=="+JSON.stringify(result));
					}
				}
			})
			box.on("shown.bs.modal", function() {
				//$(".chosen-select").select2()
			});
		} else {
			console.log(";;");
			bootbox.alert("不能修改已计费数据")
		}
	})

	$('#detail_modal').on('shown.bs.modal', function(e) {

		if(showpic) {
			//new CBPGridGallery(document.getElementById('grid-gallery'));
			// $('.carousel').carousel();
			handleFancybox();
		}
		initDetailButton();

		//      if (!data) return e.preventDefault() // stops modal from being shown
	})

	$('#detail_modal').on("hidden.bs.modal", function() {
		$(this).find(".modal-body").html("");
	});

	var initDetailButton = function() {
		$('#detail_prev').on('click', function() {
			console.log("prev")
			if(view_idx > 0) {
				//  setTimeout(function(e){
				$('#detail_modal').find('.modal-body').html(view_recs[view_idx - 1]);
				view_idx--;
				initDetailButton();

				//$('#detail_modal').modal('show')
				//  },500)
			}
		})

		$('#detail_next').on('click', function() {
			console.log("next")
			console.log(view_idx)
			if(view_idx < view_recs.length - 1) {
				//  setTimeout(function(e){
				$('#detail_modal').find('.modal-body').html(view_recs[view_idx + 1]);
				view_idx++;
				initDetailButton();

				// $('#detail_modal').modal('show')
				// },500)
			}
		})

		/*$('#info_mod').on('click', function(e) {
			console.log("mod in diag:" + $(e.target).attr("data-ref"));
			viewPopEditGroup = null;
			$.each(xw.getTable().getData().rows, function(idx, row) {
				if($(e.target).attr("data-ref") == row.meterReadingId) {
					if(row.copyState == 'E' || row.copyState == '2' || row.copyState == '3') {//数据分析完成
						console.log("getMOD:" + row.meterReadingId)
						viewPopEditGroup = $(e.target).attr("data-group");
						console.log(row)
						xw.updForRow(row);
					} else {
						bootbox.alert("数据不允许修改");
					}
				}
			})
			//bootbox.alert("OOK");
			//xw.updForRow
		})*/

		//重新获取上次表读数，并重新计算计费气量
		$('#info_last').on('click', function(e) {
			console.log("last in diag:" + $(e.target).attr("data-ref"));
			viewPopEditGroup = null;
			$.each(xw.getTable().getData().rows, function(idx, row) {
				if($(e.target).attr("data-ref") == row.meterReadingId) {
					if(row.copyState == 'E' || row.copyState == '2' || row.copyState == '3') {
						console.log("getMOD:" + row.meterReadingId)
						viewPopEditGroup = null;
						//viewDetail(selrows);
						viewPopEditGroup = $(e.target).attr("data-group");
						console.log(row);

						//重新获取上次表读数
						bootbox.confirm("确定重新获取上次表读数吗?", function(result) {
							if(result == false) {
								return;
							} else {
								var bd = {};
								bd.meterreadingid = row.meterReadingId;
								$.ajax({
									url: "/hzqs/pla/pbmul.do?fh=MULPLA0000000J00&resp=bd&bd=" + JSON.stringify(bd),
									dataType: 'json',
									async: true,
									type: "GET",
									//	data:JSON.stringify(bd),
									contentType: "application/json; charset=utf-8;",
									success: function(results_3) {
										//var results_3 = '';
										/*if(resultsa.body != null) {
											results_3 = resultsa.body;
										}*/
										if(results_3 != '' && results_3.err_code == "1") {
											//成功更新上次表读数 并且 重新计算计费读数
											/*$('#sf_'+view_idx+'_lastMeterReading').val(results_3.lastmeterreading);
											$('#sf_'+view_idx+'_lastReviseReading').val(results_3.lastrevisereading);
											$('#sf_'+view_idx+'_lastReadingDate').val(results_3.lastreadingdate);
											$('#sf_'+view_idx+'_chargeMeterReading').val(results_3.chargemeterreading);
											//$('#sf_'+view_idx+'_lastReviseReading').val(results_3.lastremaingasnum);
											$('#sf_'+view_idx+'_lastAccumulatedGas').val(results_3.lastaccumulatedgas);
											$('#sf_'+view_idx+'_quotiety').val(results_3.quotiety);*/
											if(results_3.lastmeterreading != 'undefined' && results_3.lastmeterreading != null && results_3.lastmeterreading != '') {
												row.lastMeterReading = results_3.lastmeterreading;
											}
											if(results_3.lastrevisereading != 'undefined' && results_3.lastrevisereading != null && results_3.lastrevisereading != '') {
												row.lastReviseReading = results_3.lastrevisereading;
											}
											if(results_3.lastreadingdate != 'undefined' && results_3.lastreadingdate != null && results_3.lastreadingdate != '') {
												row.lastReadingDate = results_3.lastreadingdate;
											}
											if(results_3.chargemeterreading != 'undefined' && results_3.chargemeterreading != null && results_3.chargemeterreading != '') {
												row.chargeMeterReading = results_3.chargemeterreading;
											}
											if(results_3.lastaccumulatedgas != 'undefined' && results_3.lastaccumulatedgas != null && results_3.lastaccumulatedgas != '') {
												row.lastAccumulatedGas = results_3.lastaccumulatedgas;
											}
											if(results_3.quotiety != 'undefined' && results_3.quotiety != null && results_3.quotiety != '') {
												row.quotiety = results_3.quotiety;
											}
											//xw.updForRow(row);
											if(viewPopEditGroup) {
												modlist[viewPopEditGroup] = {};
												(modlist[viewPopEditGroup]).lastMeterReading = row.lastMeterReading;
												(modlist[viewPopEditGroup]).lastReviseReading = row.lastReviseReading;
												(modlist[viewPopEditGroup]).chargeMeterReading = row.chargeMeterReading;
												(modlist[viewPopEditGroup]).quotiety = row.quotiety;
												(modlist[viewPopEditGroup]).lastAccumulatedGas = row.lastAccumulatedGas;
												(modlist[viewPopEditGroup]).lastAccumulatedAmount = row.lastAccumulatedAmount;
												$('#' + viewPopEditGroup + "_lastAccumulatedGas").val(row.lastAccumulatedGas);
												$('#' + viewPopEditGroup + "_lastAccumulatedAmount").val(row.lastAccumulatedAmount);
												$('#' + viewPopEditGroup + "_lastMeterReading").val(row.lastMeterReading);
												$('#' + viewPopEditGroup + "_lastReviseReading").val(row.lastReviseReading);
												$('#' + viewPopEditGroup + "_chargeMeterReading").val(row.chargeMeterReading);
												$('#' + viewPopEditGroup + "_quotiety").val(row.quotiety);
											}
											bootbox.alert("成功获取上次表读数");
										} else {
											bootbox.alert("获取上次表读数失败。"+results_3.msg);
											return;
										}
									},
									error: function(e) {
										bootbox.alert("获取上次表读数失败。");
										return;
									}
								})
							}
						});

					} else {
						bootbox.alert("数据不允许修改");
					}
				}
			})
		});

		console.log(view_idx)
		if(modlist["sf_" + view_idx]) {
			var moditem = modlist["sf_" + view_idx]
			console.log(moditem);
			$('#sf_' + view_idx + "_meterReading").val(moditem.meterReading)
			$('#sf_' + view_idx + "_reviseReading").val(moditem.reviseReading)
			$('#sf_' + view_idx + "_chargeMeterReading").val(moditem.chargeMeterReading)
			$('#sf_' + view_idx + "_copyState").val(moditem.copyState)
			$('#sf_' + view_idx + "_quotiety").val(moditem.quotiety)
			$('#sf_' + view_idx + "_accumulatedGas").val(moditem.accumulatedGas)
			$('#sf_' + view_idx + "_accumulatedAmount").val(moditem.accumulatedAmount)
			$('#sf_' + view_idx + "_remaingAsnum").val(moditem.remaingAsnum)

			$('#sf_' + view_idx + "_lastAccumulatedGas").val(row.lastAccumulatedGas)
			$('#sf_' + view_idx + "_lastAccumulatedAmount").val(row.lastAccumulatedAmount)
			$('#sf_' + view_idx + "_lastMeterReading").val(row.lastMeterReading)
			$('#sf_' + view_idx + "_lastReviseReading").val(row.lastReviseReading)
			$('#sf_' + view_idx + "_chargeMeterReading").val(row.chargeMeterReading)
			$('#sf_' + view_idx + "_quotiety").val(row.quotiety)

		}
		if($('#sf_' + view_idx + '_quotiety').val()) {
			if($('#sf_' + view_idx + '_customerKind').val() == '1' || $('#sf_' + view_idx + '_customerKind').val() == '居民') {
				$('#sf_' + view_idx + '_quotiety').addClass("hidden");
			} else {
				$('#sf_' + view_idx + '_quotiety').addClass("btn red");
			}
		}

	}

	$('#view_button').on('click', function() {
		var selrows = xw.getTable().getData(true);
		if(selrows.rows.length == 0) {
			bootbox.alert("<br><center><h4>请选择需要预览的行</h4></center><br>");
		} else {
			viewPopEditGroup = null;
			viewDetail(selrows);
		}
	});

	/*$(document).on('click','.btn.btn-primary',function(e){
		alert(1);
	});*/
	var stopCountFormat = {
		f: function(val, row, cell, key) {
			var wheres = " "
			wheres += "mr.countper_id='" + row.countperId + "' "
			wheres += "and mr.serviceper_id='" + row.serviceperId + "' "
			wheres += " and ar.customer_state='02' and  mr.book_id = ar.book_id " //是否仅仅考虑计划抄表

			var bd = {
				"cols": "count(1) as cnt1",
				"froms": " gas_ctm_archive ar,gas_mrd_book mr ",
				"wheres": wheres,
				"page": false
			};
			//xw.setRestURL();
			var v = RefHelper.getRef({
				ref_url: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
				ref_col: "status",
				ref_display: "cnt1",
				ref_id: val,
				ref_div: cell,
				dataformat: {
					format: function(ref_id, value, ref_col, data) {
						// console.log("dataformatJSON:key="+key+",cell="+cell+":"+JSON.stringify(data)+"")
						var totalv = 0;
						if(data.rows) {
							$.each(data.rows, function(id, row) {
								totalv += row.cnt1;
							})
							return totalv;
						} else {
							return 0;
						}
					},
				}
			});
			//if (v)return v;
			return "--";
		}

	}
	var statFormat = {
		f: function(val, row, cell, key) {
			var wheres = " mr.area_id='" + row.areaId + "' "
			wheres += "and mr.countper_id='" + row.countperId + "' "
			wheres += "and mr.serviceper_id='" + row.serviceperId + "' "
			wheres += "and mr.operate='P' " //是否仅仅考虑计划抄表

			if($('#createtimefrom').val()) {
				wheres += "and mr.planCopyTime >= to_date('" + $('#createtimefrom').val() + " 00:00:00','YYYY-MM-DD HH24:MI:SS')"
				//createtimefrom=RQLBuilder.condition("copyTime","$gte","to_date('"+$('#createtimefrom').val()+" 00:00:00','YYYY-MM-DD HH24:MI:SS')");
			}
			if($('#createtimeto').val()) {
				wheres += "and mr.planCopyTime <= to_date('" + $('#createtimeto').val() + " 23:59:59','YYYY-MM-DD HH24:MI:SS')"
			}

			var bd = {
				"cols": "copy_state, count(mr.meter_reading_id) as cnt1",
				"froms": " gas_mrd_meter_reading mr ",
				"wheres": wheres,
				"groupby": "copy_state",
				"page": false
			};
			//xw.setRestURL();
			console.log("request:" + val + ",cell=" + cell + ",key=" + key)
			var v = RefHelper.getRef({
				ref_url: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
				ref_col: "serviceper_id",
				ref_display: "cnt1",
				ref_id: val,
				ref_div: cell,
				dataformat: {
					format: function(ref_id, value, ref_col, data) {
						console.log("dataformatJSON:key=" + key + ",cell=" + cell + ":" + JSON.stringify(data) + "")
						var totalv = 0;
						var cntMap = {
							"0": 0,
							"1": 0,
							"2": 0,
							"3": 0,
							"4": 0,
							"5": 0,
							"6": 0,
							"E": 0,
							"7": 0,
							"8": 0
						}
						if(data.rows) {
							$.each(data.rows, function(id, row) {
								totalv += row.cnt1;
								cntMap[row.copyState] += row.cnt1;
							})
							if('copyProcess' == key) { //抄表进度
								return(100.0 * (cntMap[2] + cntMap[3] + cntMap[4] + cntMap[5] + cntMap[6] + cntMap['E']) / totalv).toFixed(2) + "%";
							}
							if('notCopy' == key) { //抄表进度
								return cntMap[0] + cntMap[1];
							}
							if('copyReady' == key) { //已抄户数
								return cntMap[2] + cntMap[3] + cntMap[4] + cntMap[5] + cntMap[6] + cntMap['E'];
							}
							if('copyBllCount' == key) { //已计费户数
								return cntMap[6];
							}
							if('downloadCnunt' == key) { //已下装
								return cntMap[1];
							}

							if('planCount' == key) { //已计费户数
								return cntMap[0] + cntMap[1] + cntMap[2] + cntMap[3] + cntMap[4] + cntMap[5] + cntMap[6] + cntMap['E'];
							} else {
								return 0;
							}

						} else {
							return 0;
						}
					},
				}
			});
			//if (v)return v;
			return "--";
		}
	};

	var gasTypeHelper = RefHelper.create({
		ref_url: "gasbizgastype",
		ref_col: "gasTypeId",
		ref_display: "gasTypeName",
	});

	var gasTypeFormat = function() {
		return {
			f: function(val) {
				return gasTypeHelper.getDisplay(val);
			},
		}
	}();
	return {

		init: function() {
			// 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)
			this.initHelper();
			this.reload();
			this.initAccessLogs();
			handleFancybox();
			//this.initCharts();
		},

		initHelper: function() {
			// 供气区域 select init
			console.log("initHelper")
			$('#find_areaId').html('<option value="" name="全部"">全部</option>');
			$.each(GasModSys.areaHelper.getRawData(), function(idx, row) {
				if('1' == UserInfo.item().area_id) {
					$('#find_areaId').append('<option value="' + row.areaId + '" name="' + row.areaId + '">' + row.areaName + '</option>');
				} else if(row.areaId == UserInfo.item().area_id) {
					$('#find_areaId').append('<option value="' + row.areaId + '" name="' + row.areaId + '">' + row.areaName + '</option>');
				}
			});

			$.ajax({
				url: Utils.queryURL(hzq_rest + "gassysparameter") + 'query=' + RQLBuilder.rlike("parameterModel", "hzq.aud.filter.").rql(),
				dataType: 'json',
				async: false,
			}).done(function(data, retcode) {
				//console.log("getdata::"+JSON.stringify(data))
				$.each(data, function(id, row) {
					auditTypes[row.parameterCode] = row.parameterName;
					$('#exception_type').append('<option value="' + row.parameterCode + '">' + row.parameterName + '</option>');

				})
				$('#exception_type').append('<option value="OTHER">其他</option>');

				$('#exception_type').on('change', function(e) {
					xw.autoResetSearch();
				})
			});

//清除此类错误
			$('#fixbugs_button').on('click', function(e) {
				var rows = xw.getTable().getData(true).rows;
				if(!rows || rows.length <= 0) {
					bootbox.alert("请选择需要修改的行");
					return;
				}
				if(error_selected == 'ALL'){
					var reason_return = new Array();
					//遍历选中的行的错误记录
					for(var i=0;i<rows.length;i++){
						var reason_not_arr = new Array();
						var freason = rows[i].failedReason2;
	
						if(freason){
							reason_not_arr = freason.split(",");
						}
						if(reason_not_arr && reason_not_arr.length > 0){
							for(var j=0;j<reason_not_arr.length;j++){
								if(reason_not_arr[j]){
									if(reason_not_arr[j] == 'hzq.aud.filter.all.10' || reason_not_arr[j] =='hzq.aud.filter.all.11'){
										reason_return.push(1);
									}
								}
							}
						}
					}
					if(reason_return && reason_return.length > 0){
						bootbox.alert("选中客户中有包含本次表读数小于上次表读数或本次修正表读数小于上次修正表读数的，请检查后使用标识数据。");
						return;
					}
				}
				//console.log("xw="+xw.);
				var clearAllList = new Array();
				var clearOneList = new Array();
				var error_selected = $('#exception_type').val();
				console.log("EE:" + error_selected);
				var errortype = "reservedField1";
				if(error_selected == 'OTHER') {
					errortype = "reservedField1";
				} else if(error_selected != 'ALL') {
					if(error_selected.startsWith("hzq.aud.sql")) {
						errortype = "failedReason1";
					} else {
						errortype = "failedReason2";
					}
				}
				
				if(errortype == "failedReason2"){
					if(error_selected == 'hzq.aud.filter.all.10' || error_selected =='hzq.aud.filter.all.11'){
						bootbox.alert("本次燃气表读数小于上次燃气表读数，或 本次修正表读数小于上次修正表读数不能使用清除此类错误，请使用“标识”");
						return;
					}
				}
				
				var submitSets = new Array();
				var allClearCount = 0,
					clearCount = 0;
				$.each(rows, function(id, row) {
					if(row.copyState == 'E') {
						var finalv = row[errortype];
						if(errortype == 'reservedField1') {
							finalv = ""
							row['reservedField1'] = "";
						} else {
							finalv = finalv.replace(error_selected + ",", "")
							row[errortype] = finalv;
						}
						console.log("finalv==" + row[errortype] + ",to==>" + finalv + "@" + errortype);
						if(error_selected == 'ALL') {
							allClearCount++;
							submitSets.push({
								"txid": "1",
								"body": {
									reservedField1: "",
									failedReason1: "",
									failedReason2: "",
									copyState: "3"
								},
								"path": "/gasmrdmeterreading/" + row.meterReadingId,
								"method": "put"
							})
						} else if((!row.reservedField1 || row.reservedField1.length == 0) &&
							(!row.failedReason1 || row.failedReason1.replace(/,/g, '').length == 0) &&
							(!row.failedReason2 || row.failedReason2.replace(/,/g, '').length == 0)
						) {
							var body = '{"' + errortype + '":"","copyState":"3"}';
							allClearCount++;
							submitSets.push({
								"txid": "1",
								"body": JSON.parse(body),
								"path": "/gasmrdmeterreading/" + row.meterReadingId,
								"method": "put"
							})
						} else {
							clearCount++;
							var body = '{"' + errortype + '":"' + finalv + '"}';
							submitSets.push({
								"txid": "1",
								"body": JSON.parse(body),
								"path": "/gasmrdmeterreading/" + row.meterReadingId,
								"method": "put"
							})

						}
					}
				})

				var submitJson = {
					"sets": submitSets
				}

				console.log("submit::" + JSON.stringify(submitJson));

				bootbox.confirm("<h2>确定清除选中记录的错误吗?<br><br><center><font color='red'>{0}</font>条将更新为已分析<br><font color='red'>{1}</font>条因有其他错误需要处理</center></h2>".format(allClearCount, clearCount), function(result) {
					if(result) {
						var result = Restful.insert("/hzqs/dbc/pbtxs.do?fh=SELDBC0000000J00&resp=bd&retobj=1", submitJson);
						console.log("result==:" + JSON.stringify(result));
						//result.results
						//if(result.results[0]["result"]['success'] && result.results[1]["result"]['success']) {                        
						//}
						xw.autoResetSearch();
						bootbox.alert("清除成功！");
					}
				});
			})

			$('#find_today_sign').on('click', function(e) {
				setStartEnd(0, 'd')
			})
			$('#find_this_week_sign').on('click', function(e) {
				setStartEnd(-7, 'd')
			})
			$('#find_this_month_sign').on('click', function(e) {
				setStartEnd(-1, 'M')
			})
			$('#find_three_month_sign').on('click', function(e) {
				setStartEnd(-3, 'M')
			})
			$('#find_this_year_sign').on('click', function(e) {
				setStartEnd(-1, 'y')
			})

			/* $('#createtimefrom').val(moment().format('YYYY-01-01'));
			 $('#createtimeto').val(moment().format('YYYY-12-31'));*/

			//设置默认时间——一年 变成 本 抄表月 （上月26号到本月25号）
			//判断当前时间的月份 和 日期

			//Restful.find(hzq_rest+"gassysparameter",);

			/*  var copymonthdefined= RQLBuilder.equal(
			 		RQLBuilder.and()
			  ).rqlnoenc();*/
			var copydefined = '26';
			var copycyclemonthfilter = RQLBuilder.and([
				RQLBuilder.equal("status", "1"),
				RQLBuilder.equal("parameterCode", "mrd.copycycle")
			]).rqlnoenc();
			var copycyclemonth = Restful.find(hzq_rest + "gassysparameter", copycyclemonthfilter);
			if(copycyclemonth && copycyclemonth.success) {
				copydefined = copycyclemonth.parameterValue;
			}

			var momentdate = moment().format("YYYY-MM-DD");
			var marr = momentdate.split("-");
			if(parseInt(marr[2]) >= parseInt(copydefined)) {
				var endmonth = String(parseInt(marr[1]) + 1);
				var year =0;
				if(endmonth == '13'){
					endmonth ='01';
					year = parseInt(marr[0])+1;
				}else{
					if((parseInt(marr[1]) + 1) < 10) {
						endmonth = '0' + String(endmonth);
					}
				}
				$('#createtimefrom').val(moment().format('YYYY-MM-26'));
				var dm = moment().format('YYYY-' + endmonth + '-25');
				if(year > 0){
					var c = dm.split("-");
					$('#createtimeto').val(year+"-"+c[1]+"-"+c[2]);
				}else{
					$('#createtimeto').val(dm);
				}
				//$('#createtimefrom').val(moment().add(startdiff, timed).format('YYYY-MM-DD'))
				
			} else if(parseInt(marr[2]) < parseInt(copydefined)) {
				//if(endmonth == 01)
				var endmonth = String(parseInt(marr[1]) - 1);
				var year2 = 0;
				if(endmonth == '0'){
					endmonth = '12';
					year2 = parseInt(marr[0]) -1;
				}else{
					if((parseInt(marr[1]) - 1) < 10) {
						endmonth = '0' + String(endmonth);
					}
				}
				if(year2 > 0){
					var cd = moment().format('YYYY-' + endmonth + '-26');
					var cc = cd.split("-");
					$('#createtimefrom').val(year2+"-"+cc[1]+"-"+cc[2]);
				}else{
					$('#createtimefrom').val(moment().format('YYYY-' + endmonth + '-26'));
				}
				
				$('#createtimeto').val(moment().format('YYYY-MM-25'));
			}

			$('#find_this_year_this').on('click', function(e) {
				$('#createtimefrom').val(moment().format('YYYY-01-01'))
				$('#createtimeto').val(moment().format('YYYY-12-31'));
				if(xw) {
					resetSearch(); //xw.autoResetSearch();
				}
			})
			$('#find_anyway_sign').on('click', function(e) {
				$('#createtimeto').val("");
				$('#createtimefrom').val("");
			})

			$('ul.copystate').on('click', function(e) {
				console.log("change!:" + $('ul.copystate > li.active').attr('cp') + ",,to >>" + $(e.target).parent().attr('cp'))
				setTimeout(function(e) {
					var cp = $('ul.copystate > li.active').attr('cp')
					if(cp == 'all') {
						$('#divtable').css({
							display: "none"
						})
					} else {
						$('#divtable').css({
							display: "block"
						})
						xw.autoResetSearch();
					}
				}, 100)
			})

			//客户类型-用气性质
			$.map(gasTypeHelper.getData(), function(value, key) {
				//console.log(key)
				$('#find_gasTypeId').append('<option value="' + key + '">' + value + '</option>');
			});
			$("#find_gasTypeId").on("change", function() {
				//console.log($(this).val())
				$('#find_gasTypeId1').html('<option value="">请选择</option>').trigger("change")
				var gasType1Helper = RefHelper.create({
					ref_url: 'gasbizgastype/?query={"parentTypeId":"' + $(this).val() + '"}',
					ref_col: "gasTypeId",
					ref_display: "gasTypeName",
				});
				$.map(gasType1Helper.getData(), function(value, key) {
					console.log(key)
					$('#find_gasTypeId1').append('<option value="' + key + '">' + value + '</option>');
				});
			});
			$("#find_gasTypeId1").on("change", function() {
				console.log($(this).val())
				$('#find_gasTypeId2').html('<option value="">请选择</option>').trigger("change")
				var gasType1Helper = RefHelper.create({
					ref_url: 'gasbizgastype/?query={"parentTypeId":"' + $(this).val() + '"}',
					ref_col: "gasTypeId",
					ref_display: "gasTypeName",
				});
				$.map(gasType1Helper.getData(), function(value, key) {
					console.log(key)
					$('#find_gasTypeId2').append('<option value="' + key + '">' + value + '</option>');
				});
			});

			/* $('#info_last').on('click',function(e){//点击时重新获取上次表读数，上次修正表读数，并修改计费气量
			 	console.log(e);
			 	alert(1);
			 });*/

		},

		reload: function() {

			$('#divtable').html('');
			var wheres = "";

			var bd = {
				"cols": "mr.operate,mr.meterReadingId,mr.bookCode,mr.areaId,mr.ctmArchiveId,mr.meterReading,mr.reviseReading,mr.customer_kind,mr.countper_id,mr.serviceper_id," +
					"mr.quotiety,mr.copyType,mr.copyTime,mr.uploadTime,mr.copyState,mr.gasTypeId,mr.isBll,mr.meter_photo,mr.revise_photo,mr.feedback_photo," +
					"mr.lastReadingDate,mr.lastMeterReading,mr.lastReviseReading,mr.chargeMeterReading,mr.fileUploadStatus,mr.accumulatedGas,mr.lastAccumulatedGas," +
					"mr.accumulatedAmount,mr.remaingAsnum,mr.reservedField1,mr.failedReason1,mr.data_source,mr.created_time,mr.modified_time," +
					"mr.modifiedBy,mr.failedReason2,mr.feedback,mr.reservedField2,mr.failedReason2," + //,mr.lastAccumulatedAmount
					"ar.customerAddress,ar.customerCode,ar.customerName,ar.customerNo,ar.customerType",

				// "cols":"mr.*,ar.customerAddress,ar.customerCode,ar.customerName,ar.customerNo",//ar.customerType
				"froms": " gas_mrd_meter_reading mr left join gas_ctm_archive ar on " +
					" ar.ctm_archive_id = mr.ctm_archive_id ",

				"wheres": wheres,
				"orderby": "mr.countperId,mr.serviceperId",
				//"groupby":"mr.counterper_id",
				"page": true
			};

			//xw.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd="+);

			xw = XWATable.init({
				divname: "divtable",
				//----------------table的选项-------
				pageSize: 10,
				columnPicker: true,
				transition: 'fade',
				checkboxes: true,
				checkAllToggle: true,
				//----------------基本restful地址---
				//restbase: 'gasmrdmeterreading',
				restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify({
					cols: "status",
					froms: "gas_sys_parameter_type",
					wheres: "1=0"
				})),
				key_column: 'meterReadingId',
				rowDblClicked: function(e) {
					console.log("dblclickedd::" + JSON.stringify(e.row));
					//updForRow(e.row);
				},
				onPreUpdated: function(selrow, moditem) {
					if(selrow.isBll == '1') {
						bootbox.alert("<center><h1>已计费数据无法修改</h1></center>");
						return false;
					}
					if(selrow.copyState == '0' || selrow.copyState == '1') {
						bootbox.alert("<center><h1>未抄表数据无法修改</h1><center>");
						return false;
					}
					if(selrow.copyState == '5' || selrow.copyState == '6') {
						bootbox.alert("<center><h1>正在计费数据无法修改</h1></center>");
						return false;
					}
					//selrow_obj = selrow;
					//moditem_obj = moditem;
					return true;
				},

				coldefs: [{
						col: "meterReadingId",
						friendly: "抄表序列ID",
						unique: true,
						hidden: true,
						nonedit: "nonedit",
						readonly: "readonly",
						index: 12
					}, {
						col: "bookCode",
						friendly: "抄表本号",
						readonly: "readonly",
						index: 1
					},
					{
						col: "customerCode",
						friendly: "客户编号",
						nonedit: "readonly",
						format: {
							f: function(val, row) {
								return '<a href=javascript:viewDetail(null,"' + row.meterReadingId + '")>' + val + '</a>'
							}
						},
						index: 2
					},

					{
						col: "areaId",
						friendly: "供气区域",
						format: GasModSys.areaFormat,
						inputsource: "select",
						validate: "required",
						ref_url: "gasbizarea",
						ref_name: "areaName",
						ref_value: "areaId",
						readonly: "readonly",
						nonedit: "nosend",
						index: 4
					},
					{
						col: "ctmArchiveId",
						friendly: "档案ID",
						nonedit: "nonedit",
						readonly: "readonly",
						hidden: "hidden",
						index: 4
					},
					{
						col: "meterReading",
						friendly: "燃气表读数",
						inputsource: "number",
						index: 5
					},

					{
						col: "reviseReading",
						friendly: "修正表读数",
						inputsource: "number",
						index: 6
					},
					// {
					//     col:"dailyMeasure",
					//     friendly:"日均用气量",
					//     inputsource:"positive-numeric",
					//     np:3,
					//     hidden:"hidden",
					//     nonedit: "nonedit",
					//     index:7
					// },
					{
						col: "quotiety",
						friendly: "修正系数",
						inputsource: "positive-numeric",
						hidden: "hidden",
						index: 7
					},
					{
						col: "copyType",
						friendly: "抄表类型",
						format: GasModMrd.copyTypeFormat,
						readonly: "readonly",
						nonedit: "nosend",
						index: 8
					},
					{
						col: "copyTime",
						friendly: "抄表时间",
						readonly: "readonly",
						nonedit: "nosend",
						index: 9
					},
					{
						col: "uploadTime",
						friendly: "数据上传时间",
						readonly: "readonly",
						nonedit: "nosend",
						index: 10
					},

					{
						col: "copyState",
						friendly: "抄表状态",
						format: GasModMrd.mrdStateFormat,
						readonly: "readonly",
						nonedit: "nosend",
						inputsource: "custom",
						inputbuilder: "copyStatusEdit",
						index: 11
					},
					{
						col: "customerName",
						friendly: "表户名称",
						readonly: "readonly",
						type: "string",
						nonedit: "nosend",
						index: 12
					},
					{
						col: "gasTypeId",
						friendly: "用气性质",
						readonly: "readonly",
						nonedit: "nosend",
						format: gasTypeFormat,
						type: "string",
						"sorting": false,
						inputbuilder: "copyStatusEdit",
						index: 13
					},
					{
						col: "customerAddress",
						friendly: "用气地址",
						readonly: "readonly",
						type: "string",
						nonedit: "nosend",
						index: 14
					},
					{
						col: "customerType",
						friendly: "表类型",
						format: GasModCtm.customerTypeByArhcidFormat,
						readonly: "readonly",
						type: "string",
						"sorting": false,
						nonedit: "nosend",
						index: 16
					},
					{
						col: "failedReasons",
						friendly: "异常类型",
						readonly: "readonly",
						nonedit: "nosend",
						format: auditReasonFormat,
						index: 17
					},

					{
						col: "isBll",
						friendly: "是否已经计费",
						readonly: "readonly",
						hidden: "hidden",
						nonedit: "nosend",
						index: 20
					},
					{
						col:"operate",
						friendly:"记录类型",
						//hidden:"hidden",
						format:GasModMrd.operateFormat,
						nonedit:"nosend",
						index:21
					},
					{
						col: "lastMeterReading",
						friendly: "上次表读数",
						readonly: "readonly",
						hidden: true,
						nonedit: "nosend",
						index: 24
					},
					{
						col: "chargeMeterReading",
						friendly: "计费气量",
						readonly: "readonly",
						//nonedit: "nosend",
						index: 30
					},
					{
						col: "fileUploadStatus",
						friendly: "图片上传状态",
						readonly: "readonly",
						format: GasModMrd.fileUploadStateFormat,
						hidden: "hidden",
						nonedit: "nosend",
						index: 31
					},

					{
						col: "accumulatedGas",
						friendly: "累计气量",
						hidden: "hidden",
						index: 32
					},
					{
						col: "lastAccumulatedGas",
						friendly: "上次累计气量",
						format: {
							f: function(val, row) {
								console.log(row);
								if(row.customerType == "P") {
									return " ";
								}
							}
						},
						readonly: "readonly",
						hidden: "hidden",
						index: 33
					},

					{
						col: "accumulatedAmount",
						friendly: "累计金额",
						hidden: "hidden",
						index: 34
					},

					/*{
					    col:"lastAccumulatedAmount",
					    friendly:"上次累计金额",
					    readonly: "readonly",
					    hidden:"hidden",
					    index:35
					},*/
					{
						col: "remaingAsnum",
						friendly: "表内余量",
						hidden: true,
						index: 36
					},
					{
						col: "vbt",
						friendly: "vb/vbt",
						type: "string",
						format: GasModCtm.vbVbtByFormat,
						readonly: "readonly",
						hidden: true,
						index: 40
					},
					{
						col: "meterState",
						friendly: "表具状态",
						readonly: "readonly",
						inputsource: "custom",
						inputbuilder: "meterstatusEdit",
						hidden: "hidden",
						index: 45
					},
					{
						col: "reviseMeterState",
						friendly: "修正表状态",
						format: GasModCtm.reviseMeterStateFormat,
						readonly: "readonly",
						inputsource: "custom",
						inputbuilder: "reviseMeterstatusEdit",
						hidden: "hidden",
						index: 46
					},
					{
						col: "reservedField1",
						hidden: true,
						nonedit: "nonedit",
						readonly: "readonly",
						index: 50
					},
					{
						col: "failedReason1",
						hidden: true,
						nonedit: "nonedit",
						readonly: "readonly",
						index: 50
					},
					{
						col: "modifiedBy",
						nonedit: "nosend",
						friendly: "变更人",
						readonly: "readonly",
						format: GasModSys.employeeNameFormat,
						index: 52
					},
					{
						col: "failedReason2",
						hidden: true,
						nonedit: "nonedit",
						readonly: "readonly",
						index: 51
					},
					{
						col: "lastReviseReading",
						hidden: true,
						nonedit: "nonedit",
						readonly: "readonly",
						index: 52
					},
					{
						col: "feedback",
						friendly: "反馈内容",
						readonly: "readonly",
						nonedit: "nonedit",
						hidden: "hidden",
						index: 60
					}

				].concat(extendCols(extprops, {
					readonly: "readonly",
					hidden: "hidden",
					nonedit: "nosend"
				}, 14)),

				/*onUpdated: function(selrow, moditem) {
				
					var ret = Restful.updateRNQ(hzq_rest + "gasmrdmeterreading", selrow['meterReadingId'], {
						meterReading: moditem.meterReading,
						reviseReading: moditem.reviseReading,
						chargeMeterReading:moditem.chargeMeterReading,
						copyState: moditem.status,
						quotiety: moditem.quotiety,
						accumulatedGas: moditem.accumulatedGas,
						accumulatedAmount: moditem.accumulatedAmount,
						remaingAsnum: moditem.remaingAsnum
						//chargeMeterReading: mchargemeterreading
					});
					// 2015-05-14 RYO
					if(ret.success) {
						bootbox.alert("<br><center><h4>修改成功！</h4><center><br>", function() {
							
							
							//$('.modal-backdrop fade in')
							if(viewPopEditGroup) {
								modlist[viewPopEditGroup] = {
									meterReading: moditem.meterReading,
									reviseReading: moditem.reviseReading,
									chargeMeterReading:moditem.chargeMeterReading,
									copyState: moditem.copyState,
									quotiety: moditem.quotiety,
									accumulatedGas: moditem.accumulatedGas,
									accumulatedAmount: moditem.accumulatedAmount,
									remaingAsnum: moditem.remaingAsnum

								}
								$('#' + viewPopEditGroup + "_accumulatedGas").val(moditem.accumulatedGas)
								$('#' + viewPopEditGroup + "_accumulatedAmount").val(moditem.accumulatedAmount)
								$('#' + viewPopEditGroup + "_meterReading").val(moditem.meterReading)
								$('#' + viewPopEditGroup + "_reviseReading").val(moditem.reviseReading)
								$('#'+viewPopEditGroup+"_chargeMeterReading").val(moditem.chargeMeterReading)
								$('#' + viewPopEditGroup + "_copyState").val(moditem.copyState)
								$('#' + viewPopEditGroup + "_quotiety").val(moditem.quotiety)
								$('#' + viewPopEditGroup + "_remaingAsnum").val(moditem.remaingAsnum)
							}

							modlist = {};
						});
						/*$('.modal').hide();
						$('.modal-backdrop').removeClass("in");
						$('.modal-dialog').removeClass("in");
						$('.bootbox .bootbox .modal').removeClass("in");

					} else {
						bootbox.alert("<br><center><h4>修改失败！<BR>" + ret.description + "</h4><center><br>");
					}

					//alert(ret.success);
					// 2015-05-19 成功才刷新画面
					if(!ret.success) {
						return 1;
					}
					resetSearch()
					return 1;
				},*/
				// 查询过滤条件
				findFilter: function() {

					var cp = $('ul.copystate > li.active').attr('cp')
					if(cp == 'all') {
						BaseAction.initCharts();
						return ""
						//copystate = RQLBuilder.equal("copyState",cp);                            
					}
					var wheres = getWheres();
					var bd = {
						"cols": "mr.operate,mr.meterReadingId,mr.bookCode,mr.areaId,mr.ctmArchiveId,mr.meterReading,mr.reviseReading,mr.customer_kind,mr.countper_id,mr.serviceper_id," +
							"mr.quotiety,mr.copyType,mr.copyTime,mr.uploadTime,mr.copyState,mr.gasTypeId,mr.isBll,mr.meter_photo,mr.revise_photo,mr.feedback_photo," +
							"mr.lastReadingDate,mr.lastMeterReading,mr.lastReviseReading,mr.chargeMeterReading,mr.fileUploadStatus,mr.accumulatedGas,mr.lastAccumulatedGas,mr.data_source,mr.created_time,mr.modified_time," +
							"mr.accumulatedAmount,mr.remaingAsnum,mr.reservedField1,mr.failedReason1,mr.reservedField2,mr.failedReason2," +
							"mr.modifiedBy,mr.feedback," + //mr.lastAccumulatedAmount,
							"ar.customerAddress,ar.customerCode,ar.customerName,ar.customerNo,ar.customerType",

						//"cols":"mr.*,ar.customerAddress,ar.customerCode,ar.customerName,ar.customerNo",//,ar.customerType
						"froms": " gas_mrd_meter_reading mr left join gas_ctm_archive ar on " +
							" ar.ctm_archive_id = mr.ctm_archive_id  ",
						"wheres": wheres,
						"page": true
					};

					xw.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)));
					return ""; //filter.rql();
				},

			}) //--initwtable

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
				resetSearch(); //xw.autoResetSearch();
			} else {
				BaseAction.initCharts();
			}

			$('#find_areaId').on('change', function(e) {
				console.log("change area:" + e + "." + $('#find_areaId').val());
				if(UserInfo.item().station_id == '1') return;
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
				resetSearch(); //  xw.autoResetSearch();
			}); 
			if('1' != UserInfo.item().area_id) {
				$("#find_areaId").val(UserInfo.item().area_id).change();;
				$("#find_areaId").attr({
					disabled: "disabled"
				})
			}

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
				resetSearch(); //xw.autoResetSearch();
			}); 
			$('#find_serviceperId').on('change', function(e) {
				resetSearch(); //xw.autoResetSearch();
			});
			$('#search_button').on('click', function(e) {
				resetSearch(); //xw.autoResetSearch();
			});

			$('#data_biztype').on('change', function(e) {
				resetSearch(); //xw.autoResetSearch();
			});
			$('.stat').on('change', function(e) {
				BaseAction.initCharts();
			});

			$('#find_customerType').on('change', function(e) {
				resetSearch(); //xw.autoResetSearch();
			});

			$('#divtable').css({
				display: "none"
			});
			
			/*for(var i=0;i<updatearray.length;i++){
				
			}*/
			$(document).on('blur','#sf_0_meterReading',function(e){//燃气表读数失去焦点--重新计算计费气量
				
				/*$('#meterReading').val();
				$('#reviseReading').val();
				$('#quotiety').val();*/
			
				var mreading = $('#sf_0_meterReading').val();
					var mrevisereading = $('#sf_0_reviseReading').val();
					var mquotiety = $('#sf_0_quotiety').val();
					var lastrevisereading = selrow_obj.lastReviseReading;
					var lastreading = selrow_obj.lastMeterReading;
					var ctmarchiveid = selrow_obj.ctmArchiveId; //客户档案id
					var chargemeterreading = "";
					var meterid = "",
						revisemeterid = "";
					var meterdigit = "",
						revisemeterdigit = "";
					//表户——二次表状态和计费表标记
					var queryCondion = RQLBuilder.and([
						RQLBuilder.equal("ctmArchiveId", ctmarchiveid),
						RQLBuilder.condition_fc("meterUserState", "$ne", "99")
					]).rql()
					var queryUrl_2 = hzq_rest + 'gasctmmeter?fields={"reviseMeterState":"1","meterFlag":"1","meterId":"1","reviseMeterId":"1"}&query=' + queryCondion; //计费表，

					if(ctmarchiveid) {
						var ctmobj = Restful.getByID(hzq_rest + "gasctmarchive", ctmarchiveid);

						var ctmmeterobj = Restful.findNQ(queryUrl_2)[0];
						console.log(ctmmeterobj);

						if( !ctmmeterobj||!ctmmeterobj.meterId) {
							bootbox.alert("<br><center><h4>未找到对应燃气表。</h4><center><br>");
							resetSearch();
							return 1;
						} else {
							meterid = ctmmeterobj.meterId;
							revisemeterid = ctmmeterobj.reviseMeterId;
							//表具—— 燃气表位数
							if(meterid) {
								var meterobj = Restful.getByID(hzq_rest + "gasmtrmeter", meterid);
								if(meterobj) {
									meterdigit = meterobj.meterDigit;
								}
							}
							//表具—— 修正表位数
							if(revisemeterid) {
								var revisemeterobj = Restful.getByID(hzq_rest + "gasmtrmeter", revisemeterid);
								if(revisemeterobj) {
									revisemeterdigit = revisemeterobj.meterDigit;
								}
							}
						}
						if(ctmobj) {
							/*if(ctmobj.customerType && ctmobj.customerType == 'I') { //ic卡表
								if(meterdigit) {
									chargemeterreading = getTurnaround(mreading, lastreading, meterdigit);
								} else {
									bootbox.alert("<br><center><h4>燃气表位数为空。</h4><center><br>");
									resetSearch();
									return 1;
								}

							} else*/ if(ctmobj.customerType && ctmobj.customerKind &&  ctmobj.customerKind == '1') { //居民普表
								if(meterdigit) {
									chargemeterreading = getTurnaround(mreading, lastreading, meterdigit);
								} else {
									bootbox.alert("<br><center><h4>燃气表位数为空。</h4><center><br>");
									resetSearch();
									return 1;
								}
							} else if(ctmobj.customerType && ctmobj.customerKind && ctmobj.customerKind == '9') { //非居民普表
								if(ctmmeterobj && ctmmeterobj.reviseMeterState && (ctmmeterobj.reviseMeterState == '01' || ctmmeterobj.reviseMeterState == '06')) { //二次表正常
									if(revisemeterdigit) {
										chargemeterreading = getTurnaround(mrevisereading, lastrevisereading, revisemeterdigit);
									} else if(meterdigit){
										chargemeterreading = getTurnaround(mrevisereading, lastrevisereading, meterdigit);
										
									}else{
										bootbox.alert("<br><center><h4>修正表位数为空。</h4><center><br>");
										return;
									}
								} else if(ctmmeterobj && ctmmeterobj.reviseMeterState && (ctmmeterobj.reviseMeterState == '07' || ctmmeterobj.reviseMeterState == '09')) { //二次表损坏或没有二次表
									if(meterdigit) {
										chargemeterreading = Math.round((getTurnaround(mreading, lastreading, meterdigit)) * parseFloat(mquotiety));
									//	alert(chargemeterreading);
									} else {
										bootbox.alert("<br><center><h4>燃气表位数为空。</h4><center><br>");
										resetSearch()
										return 1;
									}
								}
							}
						}
					} else {
						bootbox.alert("<br><center><h4>未找到客户档案。</h4><center><br>");
						
						resetSearch()
						return 1;
					}

					//获取当前状态下的 表户状态
					//console.log("submit::" + JSON.stringify(moditem));
					var mchargemeterreading = "";
					if(chargemeterreading) {
						mchargemeterreading = chargemeterreading;
					}
					//alert(mchargemeterreading);
					var bd = {};
					bd.meterreading = mreading;
					bd.meterreadingid= selrow_obj.meterReadingId;
					bd.revisereading = mrevisereading;
					bd.quotiety = mquotiety;
					$.ajax({
						type:"GET",
						url:"hzqs/pla/pbsjj.do?fh=SJJPLA0000000J00&resp=bd&bd="+encodeURIComponent(JSON.stringify(bd)),
						async:false,
						contentType: "application/json; charset=utf-8",
						dataType:"json",
						success:function(result_charge){//校验，前后端计算的是否一致-- 按后台计算为主
							if(result_charge && result_charge.err_code=='1'){
								if(result_charge.chargemeterreading){
									console.log(result_charge.chargemeterreading);
									console.log(mchargemeterreading);
									if(result_charge.chargemeterreading == mchargemeterreading){
										//显示
										//$('#chargeMeterReading').removeAttr("readonly").val(mchargemeterreading).attr("readonly","readonly");
										$('#sf_0_chargeMeterReading').val(mchargemeterreading);
									}else{
										bootbox.alert("前后端校验不一致：前端计算计费气量="+mchargemeterreading+";后台计算计费气量="+result_charge.chargemeterreading);
										$('#sf_0_chargeMeterReading').val(result_charge.chargemeterreading);
									}
								}else{
									$('#sf_0_chargeMeterReading').val(mchargemeterreading);
								}
							}else{
								bootbox.alert(result_charge.msg);
							}
						},
						error:function(e){
							bootbox.alert("计算计费气量失败。");
						}
					});
			});
			$(document).on('blur','#sf_0_reviseReading',function(e){//修正表读数失去焦点--重新计算计费气量
			
				var mreading = $('#sf_0_meterReading').val();
					var mrevisereading = $('#sf_0_reviseReading').val();
					var mquotiety = $('#sf_0_quotiety').val();
					var lastrevisereading = selrow_obj.lastReviseReading;
					var lastreading = selrow_obj.lastMeterReading;
					var ctmarchiveid = selrow_obj.ctmArchiveId; //客户档案id
					var chargemeterreading = "";
					var meterid = "",
						revisemeterid = "";
					var meterdigit = "",
						revisemeterdigit = "";
					//表户——二次表状态和计费表标记
					var queryCondion = RQLBuilder.and([
						RQLBuilder.equal("ctmArchiveId", ctmarchiveid),
						RQLBuilder.condition_fc("meterUserState", "$ne", "99")
					]).rql()
					var queryUrl_2 = hzq_rest + 'gasctmmeter?fields={"reviseMeterState":"1","meterFlag":"1","meterId":"1","reviseMeterId":"1"}&query=' + queryCondion; //计费表，

					if(ctmarchiveid) {
						var ctmobj = Restful.getByID(hzq_rest + "gasctmarchive", ctmarchiveid);

						var ctmmeterobj = Restful.findNQ(queryUrl_2)[0];
						console.log(ctmmeterobj);

						if( !ctmmeterobj||!ctmmeterobj.meterId) {
							bootbox.alert("<br><center><h4>未找到对应燃气表。</h4><center><br>");
							resetSearch();
							return 1;
						} else {
							meterid = ctmmeterobj.meterId;
							revisemeterid = ctmmeterobj.reviseMeterId;
							//表具—— 燃气表位数
							if(meterid) {
								var meterobj = Restful.getByID(hzq_rest + "gasmtrmeter", meterid);
								if(meterobj) {
									meterdigit = meterobj.meterDigit;
								}
							}
							//表具—— 修正表位数
							if(revisemeterid) {
								var revisemeterobj = Restful.getByID(hzq_rest + "gasmtrmeter", revisemeterid);
								if(revisemeterobj) {
									revisemeterdigit = revisemeterobj.meterDigit;
								}
							}
						}
						if(ctmobj) {
							/*if(ctmobj.customerType && ctmobj.customerType == 'I') { //ic卡表
								if(meterdigit) {
									chargemeterreading = getTurnaround(mreading, lastreading, meterdigit);
								} else {
									bootbox.alert("<br><center><h4>燃气表位数为空。</h4><center><br>");
									resetSearch();
									return 1;
								}

							} else */if(ctmobj.customerType && ctmobj.customerKind  && ctmobj.customerKind == '1') { //居民普表
								if(meterdigit) {
									chargemeterreading = getTurnaround(mreading, lastreading, meterdigit);
								} else {
									bootbox.alert("<br><center><h4>燃气表位数为空。</h4><center><br>");
									resetSearch();
									return 1;
								}
							} else if(ctmobj.customerType && ctmobj.customerKind && ctmobj.customerKind == '9') { //非居民普表
								if(ctmmeterobj && ctmmeterobj.reviseMeterState && (ctmmeterobj.reviseMeterState == '01' || ctmmeterobj.reviseMeterState == '06')) { //二次表正常
									if(revisemeterdigit) {
										chargemeterreading = getTurnaround(mrevisereading, lastrevisereading, revisemeterdigit);
									} else if(meterdigit){
										chargemeterreading = getTurnaround(mrevisereading, lastrevisereading, meterdigit);
										
									}else{
										bootbox.alert("<br><center><h4>修正表位数为空。</h4><center><br>");
										return;
									}
								} else if(ctmmeterobj && ctmmeterobj.reviseMeterState && (ctmmeterobj.reviseMeterState == '07' || ctmmeterobj.reviseMeterState == '09')) { //二次表损坏或没有二次表
									if(meterdigit) {
										chargemeterreading =  Math.round((getTurnaround(mreading, lastreading, meterdigit))* parseFloat(mquotiety));;
									} else {
										bootbox.alert("<br><center><h4>燃气表位数为空。</h4><center><br>");
										resetSearch()
										return 1;
									}
								}
							}
						}
					} else {
						bootbox.alert("<br><center><h4>未找到客户档案。</h4><center><br>");
						
						resetSearch()
						return 1;
					}

					//获取当前状态下的 表户状态
					//console.log("submit::" + JSON.stringify(moditem));
					var mchargemeterreading = "";
					if(chargemeterreading) {
						mchargemeterreading = chargemeterreading;
					}
					//alert(mchargemeterreading);
					var bd = {};
					bd.meterreading = mreading;
					bd.meterreadingid= selrow_obj.meterReadingId;
					bd.revisereading = mrevisereading;
					bd.quotiety = mquotiety;
					$.ajax({
						type:"GET",
						url:"hzqs/pla/pbsjj.do?fh=SJJPLA0000000J00&resp=bd&bd="+encodeURIComponent(JSON.stringify(bd)),
						async:false,
						contentType: "application/json; charset=utf-8",
						dataType:"json",
						success:function(result_charge){//校验，前后端计算的是否一致-- 按后台计算为主
							if(result_charge && result_charge.err_code=='1'){
								if(result_charge.chargemeterreading){
									console.log(result_charge.chargemeterreading);
									console.log(mchargemeterreading);
									if(result_charge.chargemeterreading == mchargemeterreading){
										//显示
										//$('#chargeMeterReading').removeAttr("readonly").val(mchargemeterreading).attr("readonly","readonly");
										$('#sf_0_chargeMeterReading').val(mchargemeterreading);
									}else{
										bootbox.alert("前后端校验不一致：前端计算计费气量="+mchargemeterreading+";后台计算计费气量="+result_charge.chargemeterreading);
										$('#sf_0_chargeMeterReading').val(result_charge.chargemeterreading);
									}
								}else{
									$('#sf_0_chargeMeterReading').val(mchargemeterreading);
								}
							}else{
								bootbox.alert(result_charge.msg);
							}
						},
						error:function(e){
							bootbox.alert("计算计费气量失败。");
						}
					});
			});
			
			$(document).on('blur','#sf_0_quotiety',function(e){//修正系数--失去焦点--重新计算计费气量
				var mreading = $('#sf_0_meterReading').val();
					var mrevisereading = $('#sf_0_reviseReading').val();
					var mquotiety = $('#sf_0_quotiety').val();
					var lastrevisereading = selrow_obj.lastReviseReading;
					var lastreading = selrow_obj.lastMeterReading;
					var ctmarchiveid = selrow_obj.ctmArchiveId; //客户档案id
					var chargemeterreading = "";
					var meterid = "",
						revisemeterid = "";
					var meterdigit = "",
						revisemeterdigit = "";
					//表户——二次表状态和计费表标记
					var queryCondion = RQLBuilder.and([
						RQLBuilder.equal("ctmArchiveId", ctmarchiveid),
						RQLBuilder.condition_fc("meterUserState", "$ne", "99")
					]).rql()
					var queryUrl_2 = hzq_rest + 'gasctmmeter?fields={"reviseMeterState":"1","meterFlag":"1","meterId":"1","reviseMeterId":"1"}&query=' + queryCondion; //计费表，

					if(ctmarchiveid) {
						var ctmobj = Restful.getByID(hzq_rest + "gasctmarchive", ctmarchiveid);

						var ctmmeterobj = Restful.findNQ(queryUrl_2)[0];
						console.log(ctmmeterobj);

						if( !ctmmeterobj||!ctmmeterobj.meterId) {
							bootbox.alert("<br><center><h4>未找到对应燃气表。</h4><center><br>");
							resetSearch();
							return 1;
						} else {
							meterid = ctmmeterobj.meterId;
							revisemeterid = ctmmeterobj.reviseMeterId;
							//表具—— 燃气表位数
							if(meterid) {
								var meterobj = Restful.getByID(hzq_rest + "gasmtrmeter", meterid);
								if(meterobj) {
									meterdigit = meterobj.meterDigit;
								}
							}
							//表具—— 修正表位数
							if(revisemeterid) {
								var revisemeterobj = Restful.getByID(hzq_rest + "gasmtrmeter", revisemeterid);
								if(revisemeterobj) {
									revisemeterdigit = revisemeterobj.meterDigit;
								}
							}
						}
						if(ctmobj) {
							/*if(ctmobj.customerType && ctmobj.customerType == 'I') { //ic卡表
								if(meterdigit) {
									chargemeterreading = getTurnaround(mreading, lastreading, meterdigit);
								} else {
									bootbox.alert("<br><center><h4>燃气表位数为空。</h4><center><br>");
									resetSearch();
									return 1;
								}

							} else*/ if(ctmobj.customerType && ctmobj.customerKind && ctmobj.customerKind == '1') { //居民普表
								if(meterdigit) {
									chargemeterreading = getTurnaround(mreading, lastreading, meterdigit);
								} else {
									bootbox.alert("<br><center><h4>燃气表位数为空。</h4><center><br>");
									resetSearch();
									return 1;
								}
							} else if(ctmobj.customerType && ctmobj.customerKind && ctmobj.customerKind == '9') { //非居民普表
								if(ctmmeterobj && ctmmeterobj.reviseMeterState && (ctmmeterobj.reviseMeterState == '01' || ctmmeterobj.reviseMeterState == '06')) { //二次表正常
									if(revisemeterdigit) {
										chargemeterreading = getTurnaround(mrevisereading, lastrevisereading, revisemeterdigit);
									} else if(meterdigit){
										chargemeterreading = getTurnaround(mrevisereading, lastrevisereading, meterdigit);
										
									}else{
										bootbox.alert("<br><center><h4>修正表位数为空。</h4><center><br>");
										return;
									}
								} else if(ctmmeterobj && ctmmeterobj.reviseMeterState && (ctmmeterobj.reviseMeterState == '07' || ctmmeterobj.reviseMeterState == '09')) { //二次表损坏或没有二次表
									if(meterdigit) {
										chargemeterreading = Math.round((getTurnaround(mreading, lastreading, meterdigit))* parseFloat(mquotiety));
									} else {
										bootbox.alert("<br><center><h4>燃气表位数为空。</h4><center><br>");
										resetSearch()
										return 1;
									}
								}
							}
						}
					} else {
						bootbox.alert("<br><center><h4>未找到客户档案。</h4><center><br>");
						
						resetSearch()
						return 1;
					}

					//获取当前状态下的 表户状态
					//console.log("submit::" + JSON.stringify(moditem));
					var mchargemeterreading = "";
					if(chargemeterreading) {
						mchargemeterreading = chargemeterreading;
					}
					//alert(mchargemeterreading);
					var bd = {};
					bd.meterreading = mreading;
					bd.meterreadingid= selrow_obj.meterReadingId;
					bd.revisereading = mrevisereading;
					bd.quotiety = mquotiety;
					$.ajax({
						type:"GET",
						url:"hzqs/pla/pbsjj.do?fh=SJJPLA0000000J00&resp=bd&bd="+encodeURIComponent(JSON.stringify(bd)),
						async:false,
						contentType: "application/json; charset=utf-8",
						dataType:"json",
						success:function(result_charge){//校验，前后端计算的是否一致-- 按后台计算为主
							if(result_charge && result_charge.err_code=='1'){
								if(result_charge.chargemeterreading){
									console.log(result_charge.chargemeterreading);
									console.log(mchargemeterreading);
									if(result_charge.chargemeterreading == mchargemeterreading){
										//显示
										//$('#chargeMeterReading').removeAttr("readonly").val(mchargemeterreading).attr("readonly","readonly");
										$('#sf_0_chargeMeterReading').val(mchargemeterreading);
									}else{
										bootbox.alert("前后端校验不一致：前端计算计费气量="+mchargemeterreading+";后台计算计费气量="+result_charge.chargemeterreading);
										$('#sf_0_chargeMeterReading').val(result_charge.chargemeterreading);
									}
								}else{
									$('#sf_0_chargeMeterReading').val(mchargemeterreading);
								}
							}else{
								bootbox.alert(result_charge.msg);
							}
						},
						error:function(e){
							bootbox.alert("计算计费气量失败。");
						}
					});
			});
			
			$(document).on('click',"#info_mod",function(e){//点击修改后
				//保存燃气表读数
				//保存修正表读数
				//保存修正系数
				//保存计费读数
				var meterreading = $('#sf_0_meterReading').val();
				var revisereading = $('#sf_0_reviseReading').val();
				var quotiety =$('#sf_0_quotiety').val();
				var chargemeterreading = $('#sf_0_chargeMeterReading').val();
				var remaingasnum = $('#sf_0_remaingAsnum').val();
				
				$.each(xw.getTable().getData().rows, function(idx, row) {
					if($(e.target).attr("data-ref") == row.meterReadingId) {
						if(row.copyState == 'E' || row.copyState == '2' || row.copyState == '3') {
							var result_update = Restful.update(hzq_rest+"gasmrdmeterreading",row.meterReadingId,{"meterReading":meterreading,"reviseReading":revisereading,"quotiety":quotiety,"chargeMeterReading":chargemeterreading,"remaingAsnum":remaingasnum});
							if(result_update){
								bootbox.alert("修改成功。");
								resetSearch();
							}else{
								bootbox.alert("修改失败。");
							}
						}
					}
				});
				
			});

		},

		initAccessLogs: function() {

			var wheres = getWheres(true);

			var bd = {
				"cols": "area_id,countper_id,serviceper_id,count(1) as book_count,sum(door_count) as door_count",
				"froms": " gas_mrd_book mr",
				"wheres": wheres += " and status='1' ",
				"groupby": "area_id,countper_id,serviceper_id",
				"orderby": "area_id,countper_id,serviceper_id",
				"page": false
			};
			$('#divtable_accesslogs').html('');

			xwLogs = XWATable.init({
				divname: "divtable_accesslogs",
				//----------------table的选项-------
				pageSize: 10,
				columnPicker: true,
				transition: 'fade',
				checkboxes: false,
				checkAllToggle: true,
				saveColumn: false,
				columnPicker: false,
				exportxls: {
					hidden: true
				},
				updbtn: "hidden",
				tableId: "002_resident_i",
				//----------------基本restful地址---
				//restbase: 'gassysaccesslog',                    
				restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
				coldefs: [{
						col: "areaId",
						friendly: "供气区域",
						format: GasModSys.areaFormat,
						ref_url: "gasbizarea",
						ref_name: "areaName",
						ref_value: "areaId",
						index: 1
					},
					{
						col: "countperId",
						friendly: "核算员",
						format: GasModSys.employeeNameFormat,
						index: 4
					},
					{
						col: "serviceperId",
						friendly: "抄表员",
						unique: "true",
						format: GasModSys.employeeNameFormat,
						index: 8
					},
					{
						col: "bookCount",
						friendly: "抄表本数",
						nonedit: "nosend",
						index: 10
					},
					{
						col: "doorCount",
						friendly: "户数",
						nonedit: "nosend",
						index: 15
					},
					{
						col: "status_2",
						friendly: "暂停户数",
						nonedit: "nosend",
						format: stopCountFormat,
						index: 16
					},
					{
						col: "planCount",
						friendly: "计划数",
						nonedit: "nosend",
						format: statFormat,
						index: 20
					},
					{
						col: "copyProcess",
						friendly: "抄表进度",
						nonedit: "nosend",
						format: statFormat,
						index: 25
					},
					{
						col: "notCopy",
						friendly: "未抄数",
						nonedit: "nosend",
						format: statFormat,
						index: 30
					},
					{
						col: "downloadCnunt",
						friendly: "下装未录入",
						nonedit: "nosend",
						format: statFormat,
						index: 35
					},
					{
						col: "copyReady",
						friendly: "已抄数",
						nonedit: "nosend",
						format: statFormat,
						index: 35
					},
					{
						col: "copyBllCount",
						friendly: "已计费数",
						nonedit: "nosend",
						format: statFormat,
						index: 40
					},

				],

			}) //--init
		},

		initCharts: function() {

			var wheres = getWheres();

			var bd = {
				"cols": "mr.copy_state,count(mr.meter_reading_id) as cnt",
				"froms": " gas_mrd_meter_reading mr left join gas_ctm_archive ar on " +
					" ar.ctm_archive_id = mr.ctm_archive_id ",
				"wheres": wheres,
				"groupby": "mr.copy_state",
				"page": false
			};

			$('#chart_a').html('<center><img src="assets/global/img/ajax-loader1.gif" id="loading-indicator" style="width: 68px;position: relative;align-items: center;marginTop:120px" /></center>')
			console.log("OK1")
			$('#loading-indicator').show();
			$.ajax({
					url: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
					dataType: 'json',
					async: true
				})
				.done(function(data) {
					$('#loading-indicator').hide();
					console.log("OK2")
					if(data) {
						console.log("data==" + JSON.stringify(data))
						var chartData = new Array();
						var totalCount = 0;
						var totalNotCopy = 0;
						$.map(GasModMrd.enumCopyState,
							function(k, v) {
								var _cnt = 0;
								if(data.rows) {
									$.each(data.rows, function(idx, row) {
										if(row.copyState == v) {
											_cnt = row.cnt;
										}
									})
								}
								totalCount += _cnt;

								if(v == '0' || v == '1') {
									totalNotCopy += _cnt;
								}
								if(!$('#stat_computed').prop('checked') && v == '6') {
									return;
								}
								if(!$('#stat_new').prop('checked') && v == '0') {
									return;
								}

								chartData.push({
									copyStateName: k,
									copyState: v,
									pulled: false,
									cnt: _cnt
								})
							}) //map copystate
						if(!data.rows || data.rows.length == 0) {
							$('#chart_a').html("<h4><center>该区域无数据</center></h4>")
						} else {
							var chart = AmCharts.makeChart("chart_a", {
								"type": "pie",
								"theme": "light",
								"fontFamily": 'Open Sans',
								"color": '#888',
								"dataProvider": chartData,
								"valueField": "cnt",
								"titles": [{
									"text": $('#find_areaId').find('option:selected').attr("name") + ". 抄表进度:" + ((totalCount - totalNotCopy + 0.0) * 100.0 / totalCount).toFixed(2) + "%"
								}],
								autoMargins: true,
								marginTop: 0,
								marginBottom: 20,
								marginLeft: 0,
								marginRight: 0,
								"pulledField": "pulled",

								"titleField": "copyStateName",
								"outlineAlpha": 0.4,
								"depth3D": 15,
								"balloonText": "[[copyStateName]]<br>共<span style='font-size:14px'><b>[[cnt]]条</b> ([[percents]]%)</span>",
								"angle": 30

							});
						}
					}
				})
		}
	}
}();