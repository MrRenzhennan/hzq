var disCusRegisterAction = function () {

    var xw ;
    var nonRsdtDctId;
	var areaId;
	var areas = new Array();
	var statusFm= function () {
	    return {
	        f: function (val) {
	        	if(val==1){
	        		return "审批中";
	        	}else if(val==2){
	        		return "审批通过";
	        	}else if(val==3){
	        		return "审批不通过";
	        	}else{
	        		return "-";
	        	}
	        },
	    }
	}();
	var areaHelper = RefHelper.create({
        ref_url: "gasbizarea",
        ref_col: "areaId",
        ref_display: "areaName"
    });
    var areaFormat= function () {
        return {
            f: function (val) {
                return areaHelper.getDisplay(val);
            },
        }
    }();
    var gotoDetail = function () {
        return {
            f : function (val,row) {
                var jsonStr = JSON.stringify(row);
                return "&nbsp <a href='charging/dis_cus_register_info.html?nonRsdtDctId=" +  row["nonRsdtDctId"] + "\'>" + "&nbsp修改"+ "</a>" +
                        "<a href='#' onclick='renewed(" + jsonStr + ")' data-target='#' data-toggle='modal' \>&nbsp删除</a> &nbsp";
                //window.location.href='charging/application_add.html?nonRsdtDctId='+row["nonRsdtDctId"] ;
            }
        }
    }();
	
	$("#apply_button").on("click",function (e) {
        window.location.href='charging/application_add_mtg.html';
    })


    return {
		


        init: function () {
            // 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)
            this.reload();
        },


        reload:function(){
			areaId = UserInfo.init().area_id;
			areas.push(areaId)
			//查询areaId下级areaId
			var areaData = Restful.getByID(hzq_rest+"gasbizarea",areaId);
			console.log(areaData)
			$('#find_area').append('<option  value="' + areaData.areaId + '">' + areaData.areaName + '</option>');
			var xwQuery = RQLBuilder.and([
			    RQLBuilder.equal("parentAreaId", areaId),RQLBuilder.equal("status","1")
			]).rql();
			$.ajax({
				headers: {
			      'Accept': 'application/json',
			      'Content-Type': 'application/json'
				},
				type: 'get',
				async: false,
				url: hzq_rest+"gasbizarea?query="+xwQuery,
				success: function (data) {
					for(var i=0;i<data.length;i++){
						areas.push(data[i].areaId);
						$('#find_area').append('<option  value="' + data[i].areaId + '">' + data[i].areaName + '</option>');
					}
			    } 
			})
			var gasTypeData=Restful.findNQ(hzq_rest+'gasbizgastype?query={"posCode":"1"}&sort=gasTypeId');
		    //用气性质select
		    for(var i=0; i<gasTypeData.length;i++){
		    	$('#find_gastype').append('<option value="' + gasTypeData[i].gasTypeId + '">' + gasTypeData[i].gasTypeName + '</option>');
		    }
		    $('#find_area').val(areaId).trigger("change");
		    

            $('#divtable').html('');
			
			var sel="a.non_rsdt_dct_id,a.customer_name,a.customer_tel,a.customer_address,b.ctm_archive_id,a.price1,c.status,d.customer_code,d.area_id,a.treaty_start_time";
			var froms="gas_bll_nonrsdt_dct a"+
					" left join gas_bll_nonrsdt_dct_ctm b on a.non_rsdt_dct_id=b.non_rsdt_dct_id"+
					" left join gas_bll_nonrsdt_dct_flow c on a.non_rsdt_dct_id=c.non_rsdt_dct_id"+
					" left join gas_ctm_archive d on b.ctm_archive_id=d.ctm_archive_id";
			var wheres="a.nonrsdt_type='2'"+ (areaId==1?"": " and d.area_id='"+areaId+"'");
			
			var paramurl = "/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd&bd=";
			var params = {
				"cols": sel,
				"froms": froms,
				"wheres": wheres,
				"page": true,
				"limit": 50
			}
			
            xw=XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize:10,
                    columnPicker: true,
                    transition: 'fade',
                    checkboxes: true,
                    checkAllToggle:true,
                    //----------------基本restful地址---
                    restURL: paramurl+encodeURIComponent(JSON.stringify(params)),
                    key_column:"nonRsdtDctId",
                    coldefs:[
                        {
                            col:"nonRsdtDctId",
                            friendly:"非居民优惠ID",
                            unique:true,
                            hidden:true,
                            readonly:"readonly",
                            nonedit:"nosend",
                            index:1
                        },
                        {
                            col:"customerName",
                            friendly:"客户名称",
                           // format:bigCusInfoFormat,
                            index:2
                        },
                        {
                            col:"customerCode",
                            friendly:"客户号",
                            index:3
                        },
                        {
                            col:"areaId",
                            friendly:"所属单位",
                            format:areaFormat,
                            index:4
                        },
                        {
                            col:"customerTel",
                            friendly:"客户电话",
                            validate:"required,onlyNumber,length[0-12]",
                            index:5
                        },
                        {
                            col:"customerAddress",
                            friendly:"客户地址",
                            hidden:true,
                            index:6
                        },
                        {
                            col:"price1",
                            friendly:"用气单价（单位元）",
                            //format:operateFormat,
                            hidden:true,
                            validate:"required,money,length[0-20]",
                            index:7
                        },
                        {
                            col:"treatyStartTime",
                            friendly:"生效时间",
                            nonedit: "noeidt",
                            hidden:true,
                            format:GasModBil.dateFormat,
                            index:8
                        },
                        {
                            col:"status",
                            friendly:"状态",
                            hidden:true,
                            format:GasModBil.approvalStatusFormat,
//                          format:statusFm,
                            nonedit:'nosend',
                            index:9
                        },
//                      {
//                          col:"ctmArchiveId",
//                          friendly:"操作",
//                          nonedit: "noeidt",
//                          format:statusFm,
//                          index:13
//                      }
                        
                    ],
                    // 查询过滤条件
                    findFilter: function(){
						wheres="a.nonrsdt_type='2' ";
                        if ($('#find_customerName').val()) {
                        	wheres+=(" and d.customer_name like'%"+$('#find_customerName').val()+"%'");
                        }
                        if ($('#find_customerCode').val()) {
                            wheres+=(" and d.customer_code='"+$('#find_customerCode').val()+"'");
                        }
                        if ($('#find_state').val()) {
                            wheres+=(" and c.status='"+$('#find_state').val()+"'");
                        }
                        if ($('#find_area').val()) {
                        	if(areaId!=1){
                        		wheres+=(" and d.area_id='"+areaId+"'");
                        	}
                        }else{
                        	bootbox.alert("请选择供气区域");
                        	return;
                        }
						var params2 = {
							"cols": sel,
							"froms": froms,
							"wheres": wheres,
							"page": true,
							"limit": 50
						}
                        xw.setRestURL(paramurl+encodeURIComponent(JSON.stringify(params2)));
                        return "";
                    },

                    onAdded: function(ret,jsondata){
                        return  validateForm(jsondata);
                    },

                    onUpdated: function(ret,jsondata){
                        xw.setRestURL(hzq_rest+"gasbllnonrsdtdct");
                        return  validateForm(jsondata);
                    },

                    onDeleted: function(ret,jsondata){
                    },
                }) //--init
        },


    }
}();
