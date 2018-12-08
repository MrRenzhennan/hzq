var AppMeterExceptionAction = function(){
	var xw;
	var exceptionTypeEnum = {};
	
	var exceptionTypeFormat ={
		f: function(val){
                return exceptionTypeEnum[val];
        },
	}
	 return {
        init: function () {
            this.initHelper();
            this.reload();
           // this.initBtn();
        },
        initHelper: function () {
    	  
    	  //顺便初始化 array 
            GasModMrd.appMeterErrorList({
                "cb":function(data){
                    var inhtml ="<option value=''>无</option>";
                    if(data){
                        $.each(data,function(idx,row){
                            inhtml += '<option value="'+row.parameterCode+'">'+row.parameterName+'</option>';
                            exceptionTypeEnum[row.parameterCode] = row.parameterName; 
                        })
                        $('#find_appmetererror').html(inhtml);
                    }
                }
            });
            console.log(exceptionTypeEnum);
            $('#find_areaId').html('<option value="" name="全部"">全部</option>');
            $.each(GasModSys.areaHelper.getRawData(), function(idx, row) {
                if('1'==UserInfo.item().area_id)
                {
                    $('#find_areaId').append('<option value="'+row.areaId+'" name="'+row.areaId+'">'+row.areaName+'</option>');
                }else if (row.areaId==UserInfo.item().area_id){
                    $('#find_areaId').append('<option value="'+row.areaId+'" name="'+row.areaId+'">'+row.areaName+'</option>');
                }
            });

            if(UserInfo.item().station_id=='1')
            {
                console.log("cahnge")
                var inhtml = "<option value='"+UserInfo.item().userId+"' selected>"+UserInfo.item().employee_name+"</option>";
                $("#find_areaId").val(UserInfo.item().area_id).change();;
                $("#find_areaId").attr({disabled:"disabled"})

                $("#find_countperId").html(inhtml);
                $("#find_countperId").val(UserInfo.item().userId).change();
                $("#find_countperId").attr({disabled:"disabled"})

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

            }else{
                $('#find_countperId').on('change',function(e){
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
                });
            }

           
            $('#find_areaId').on('change',function(e){
                console.log("change area:"+e+"."+$('#find_areaId').val());
                GasModSys.counterUsersInArea({
                    "areaId":$('#find_areaId').val(),
                    "cb":function(data){
                        var inhtml = "<option value=''>全部</option>";
                        $.each(data,function(idx,row){
                            inhtml += '<option value="'+row.userId+'">'+row.employeeName+'</option>';
                        })
                        $("#find_countperId").html(inhtml);
                        $("#find_countperId").val("").change();

                    }
                })
     
            })

            $('#find_countperId').on('change',function(e){
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
            });

            $('#find_serviceperId').on('change',function(e){
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
            });
            //抄表类型
            $.map(GasModMrd.enumCopyType,function(value,key){
                $('#copy_type').append('<option value="' + key + '">' + value + '</option>');
            });
           	$.map(GasModMrd.enumDataSource,function(value,key){
                $('#data_source').append('<option value="' + key + '">' + value + '</option>');
            });
            $.map(GasModCtm.enumCustomerKind,function(value,key){
                $('#customer_kind').append('<option value="' + key + '">' + value + '</option>');
            });
            $.map(GasModCtm.enumCustomerState, function (value,key) {
                $('#customer_state').append('<option value="' + key + '">' + value + '</option>');
            });
            $.map(GasModCtm.enumCustomerType,function(value,key){
                $('#customer_type').append('<option value="' + key + '">' + value + '</option>');
            });
            $.map(GasModMrd.enumOperate,function(value,key){
            	$('#copy_operate').append('<option value="' + key + '">' + value + '</option>');
            });
            
            
        },
        reload: function () {
            $('#divtable').html('');

            var bd = {
               "cols":"c.copy_type,c.copy_state,c.operate,c.quotiety,m1.meter_kind,m1.meter_id,m1.meter_no,m1.exception_type,c.feedback,"+
               "m1.factory_name,m1.meter_type_name,"+
               "m2.revise_meter_id,m2.revise_meter_no,m2.revise_factory_name,m2.revise_meter_type_name,"+
               "ar.customer_code,ar.ctm_archive_id ,ar.customer_name,ar.customer_address,bo.book_code,bo.area_id,bo.countper_id,bo.serviceper_id,"+
               "ar.customer_kind,ar.customer_state,cm.revise_meter_state",
               
               "froms":"gas_ctm_archive ar inner join gas_ctm_meter cm on cm.ctm_archive_id=ar.ctm_archive_id inner join gas_mrd_book bo on bo.book_id=ar.book_id  "+
            	" left join (select m.meter_id revise_meter_id,m.meter_no revise_meter_no,f.factory_name revise_factory_name,mt.meter_type_name revise_meter_type_name from gas_mtr_factory f,gas_mtr_meter_type mt,gas_mtr_meter m where m.factory_id=f.factory_id and m.meter_type_id=mt.meter_type_id ) m2 on m2.revise_meter_id = cm.revise_meter_id "+
               " left join (select m.meter_id,m.meter_no,f.factory_name,mt.meter_type_name,m.exception_type,m.meter_kind from gas_mtr_factory f,gas_mtr_meter_type mt,gas_mtr_meter m where m.factory_id=f.factory_id and m.meter_type_id=mt.meter_type_id ) m1 on m1.meter_id = cm.meter_id "+
               " inner join (select  b.* from (select  aa.*,  row_number() over ( partition by aa.ctm_archive_id order by aa.copy_time desc) rn "+
               " from ( select  r.ctm_archive_id, r.operate,r.copy_state,r.copy_type, r.area_id,r.countper_id,r.serviceper_id,r.book_code,r.quotiety, r.copy_time,r.feedback from  gas_mrd_meter_reading r "+
               " inner join gas_ctm_meter cm on cm.ctm_archive_id=r.ctm_archive_id  where 1=0 "+
               " ) aa ) b where b.rn =1 ) c on c.ctm_archive_id = ar.ctm_archive_id ",//最近一条抄表记录。
                "wheres": "1=0",
                "page": false,
                /*"limit":50*/
               
               //不需要 二次表位数，一次表位数
               //添加 表厂家，物品种类
            };

            xw = XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize: 10, 			//Initial pagesize
                    columnPicker: true,         //Show the columnPicker button
                    sorting: false,
                    transition: 'fade',  //(bounce, fade, flip, rotate, scroll, slide).
                   // checkboxes: true,           //Make rows checkable. (Note. You need a column with the 'unique' property)
                   checkboxes:false,
                    checkAllToggle: true,        //Show the check-all toggle//+RQLBuilder.like("KEYY", "a").rql()
                    //----------------基本restful地址---
                    restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
                    key_column:'meterReadingId',
                    coldefs: [
                        /*{
                            col: "meterReadingId",
                            friendly: "抄表表ID",
                            unique: true,
                            hidden: true,
                            nonedit: "nosend",
                            readonly: "readonly",
                            sorting: false,
                            index: 1
                        },*/
                        {
                            col: "areaId",
                            friendly: "供气区域",
                            readonly: "readonly",
                            format: GasModSys.areaFormat,
                            sorting: false,
                            index: 3
                        },
                        /*{
                            col: "planCopyTime",
                            friendly: "计划抄表日期",
                            format: dateFormat,
                            sorting: false,
                            index: 4
                        },*/
                        {
                            col:"copyState",
                            friendly:"抄表状态",
                            format:GasModMrd.mrdStateFormat,
                            readonly:"readonly",
                            sorting:false,
                            index:5
                        },
                       
                        {
                            col: "countperId",
                            friendly: "核算员",
                            format: GasModSys.employeeNameFormat,
                            sorting: false,
                            index: 7
                        },
                        {
                            col: "serviceperId",
                            friendly: "客户服务员",
                            format: GasModSys.employeeNameFormat,
                            sorting: false,
                            index: 8
                        },
                        {
                            col: "customerCode",
                            friendly: "客户编号",
                            readonly: "readonly",
                            sorting: false,
                            index: 9
                        },
                        {
                            col: "customerName",
                            friendly: "客户名称",
                            readonly: "readonly",
                            sorting: false,
                            index: 10
                        },
                        {
                            col: "customerKind",
                            friendly: "客户类型",
                            format: GasModCtm.customerKindFormat,
                            sorting: false,
                            index: 11
                        },
                        {
                            col: "bookId",
                            friendly: "抄表本ID",
                            unique: true,
                            hidden: true,
                            nonedit: "nosend",
                            readonly: "readonly",
                            sorting: false,
                            index: 12
                        },
                        {
                            col: "bookCode",
                            friendly: "抄表本编号",
                            sorting: false,
                            index: 13
                        },
                       /* {
                            col: "bookType",
                            friendly: "抄表本类型",
                            format: GasModBas.bookTypeFormat,
                            sorting: false,
                            index: 14
                        },*/
                       /* {
                            col:"dataSource",
                            friendly:"数据来源",
                            format:GasModMrd.dataSourceFormat,
                            sorting:false,
                            index:15
                        },*/
                       {
                       	col:"meterId",
                       	friendly:"燃气表ID",
                       	hidden:true,
                       	sorting:false,
                       	index:14
                       },
                       {
                       	col:"meterNo",
                       	friendly:"燃气表编号",
                       	sorting:false,
                       	index:15
                       },
                        {
                            col: "meterKind",
                            friendly: "表具种类",
                            format: GasModMtr.meterKindFormat,
                            sorting: false,
                            index: 16
                        },
                        {
                        	col:"meterTypeName",
                        	friendly:"燃气表物品种类",
                        	sorting:false,
                        	index:17
                        },
                        {
                            col:"factoryName",
                            friendly:"燃气厂家",
                            readonly:"readonly",
                            sorting:false,
                            index:18
                        },
                        /*{
                            col: "copyTime",
                            friendly: "实际抄表日期",
                            readonly: "readonly",
                            sorting: false,
                            index: 17
                        },*/
                       
                       /* {
                          
                          	col:"gasTypeId",
                            friendly: "用气类型",
                            format:GasModCtm.gasTypeFormat,
                            sorting: false,
                            index:22
                        },*/
                        
                        {
                            col: "customerAddress",
                            friendly: "客户地址",
                            readonly: "readonly",
                            sorting: false,
                            index: 24
                        },
                        {
                            col:"exceptionType",
                            friendly:"表具异常类型",
                            format:exceptionTypeFormat,
                            readonly:"readonly",
                            sorting:false,
                            index:25
                        },
                        {
							col:"quotiety",
							friendly:"修正系数",
							readonly:"readonly",
                            sorting:false,
                            index:26
                        },
                        {
                        	col:"reviseMeterId",
                        	friendly:"修正表ID",
                        	hidden:true,
                        	sorting:false,
                        	index: 27
                        },
                        {
                        	col:"reviseMeterNo",
                        	friendly:"修正表编号",
                        	sorting:false,
                        	index : 28
                        },
                        {
                            col:"reviseFactoryName",
                            friendly:"修正表厂家",
                            readonly:"readonly",
                            sorting:false,
                            index:29
                        },
                        {
                        	col:"reviseMeterTypeName",
                        	friendly:"修正表物品种类",
                        	sorting:false,
                        	readonly:"readonly",
                        	index:30
                        },
                        {
                            col: "feedback",
                            friendly: "反馈信息",
                            readonly: "readonly",
                            sorting: false,
                            index: 33
                        },
                        
                    ],
                    //---------------查询时过滤条件
                    findFilter: function () {//find function

                        var resUrl = "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=";
                        var inwhereinfo = "";
                        var whereinfo =" 1=1 ";
                        if ($('#find_areaId').val()) {
                            inwhereinfo += " and r.area_id='" + $('#find_areaId').val() + "'";
                            whereinfo +=" and bo.area_id='" + $('#find_areaId').val() + "'";
                        }
                        if ($('#find_serviceperId').val()) {
                            inwhereinfo += " and r.serviceper_id='" + $('#find_serviceperId').val() + "'";
                            whereinfo +=" and bo.serviceper_id='" + $('#find_serviceperId').val() + "'";
                        }
                        if ($('#find_countperId').val()) {
                            inwhereinfo += " and r.countper_id='" + $('#find_countperId').val() + "'";
                          	whereinfo +=" and bo.countper_id='" + $('#find_countperId').val() + "'";
                        }
                        if($('#copy_type').val()){
                            inwhereinfo += " and r.copy_type='"+$('#copy_type').val()+"'";
                        }
                        
                        if($('#data_source').val()){
                            whereinfo += " and r.data_source='"+$('#data_source').val()+"'";
                        }
                        if($('#customer_kind').val()){
                            inwhereinfo += " and r.customer_kind='"+$('#customer_kind').val()+"'";
                            whereinfo += " and ar.customer_kind='"+$('#customer_kind').val()+"'";
                        }
                        if($('#customer_state').val()){
                            whereinfo += " and ar.customer_state='"+$('#customer_state').val()+"'";
                        }else{
                            whereinfo +=" and ar.customer_state<>'99' ";
                        }
                        if($('#customer_name').val()){
                            whereinfo += " and ar.customer_name like '%"+$('#customer_name').val()+"%'";
                        }
                        if($('#customer_code').val()){
                            whereinfo += " and ar.customer_code = '"+$('#customer_code').val()+"'";
                        }
                        if($('#customer_address').val()){
                            whereinfo += " and ar.customer_address like '"+$('#customer_address').val()+"'";
                        }
                        if($('#customer_type').val()){
                            whereinfo += " and ar.customer_type='"+$('#customer_type').val()+"'";
                        }
                        if($('#book_code').val()){
                            inwhereinfo +=" and r.book_code ='"+$('#book_code').val()+"'";
                            whereinfo +=" and bo.book_code ='"+$('#book_code').val()+"'";
                            
                        }
                        if($('#copy_operate').val()){
                            inwhereinfo +=" and nvl(r.operate,'P')='"+$('#copy_operate option:selected').val()+"' ";
                        }
                       
                       if($('#find_appmetererror').val()){
                       		whereinfo +=" and m1.exception_type ='"+$('#find_appmetererror').val()+"' ";
                       		
                       }else{
                       		whereinfo +=" and nvl(m1.exception_type,'-1')<>'-1' ";
                       }
                       //最大系数 ，最小系数 超过范围的
                       if($('#min_quotiety').val() && $('#max_quotiety').val()){
                       		inwhereinfo +=" and cm.revise_meter_state<>'09' and (nvl(r.quotiety,1) >"+$('#max_quotiety').val()+" or nvl(r.quotiety,1) < "+$('#min_quotiety').val()+") ";
                       }
                        var bd = {
                           
                            "cols":"c.copy_type,c.copy_state,c.operate,c.quotiety,m1.meter_kind,m1.meter_id,m1.meter_no,m1.exception_type,c.feedback,"+
               				"m1.factory_name,m1.meter_type_name,"+
               				"m2.revise_meter_id,m2.revise_meter_no,m2.revise_factory_name,m2.revise_meter_type_name,"+
			                "ar.customer_code,ar.ctm_archive_id ,ar.customer_name,ar.customer_address,bo.book_code,bo.area_id,bo.countper_id,bo.serviceper_id,"+
			                "ar.customer_kind,ar.customer_state,cm.revise_meter_state",
			                "froms":"gas_ctm_archive ar inner join gas_ctm_meter cm on cm.ctm_archive_id=ar.ctm_archive_id inner join gas_mrd_book bo on bo.book_id=ar.book_id "+
			                /*" left join gas_mtr_meter m on m.meter_id = cm.meter_id "+
			                " left join gas_mtr_meter m2 on m2.meter_id = cm.revise_meter_id "+*/
			                " left join (select m.meter_id revise_meter_id,m.meter_no revise_meter_no,f.factory_name revise_factory_name,mt.meter_type_name revise_meter_type_name from gas_mtr_factory f,gas_mtr_meter_type mt,gas_mtr_meter m where m.factory_id=f.factory_id and m.meter_type_id=mt.meter_type_id ) m2 on m2.revise_meter_id = cm.revise_meter_id "+
               				" left join (select m.meter_id,m.meter_no,f.factory_name,mt.meter_type_name,m.exception_type,m.meter_kind from gas_mtr_factory f,gas_mtr_meter_type mt,gas_mtr_meter m where m.factory_id=f.factory_id and m.meter_type_id=mt.meter_type_id ) m1 on m1.meter_id = cm.meter_id "+
			                " inner join (select  b.* from (select  aa.*,  row_number() over ( partition by aa.ctm_archive_id order by aa.copy_time desc) rn "+
			                " from ( select r.operate,r.feedback,r.ctm_archive_id,r.copy_type,r.copy_state, r.quotiety, r.copy_time from  gas_mrd_meter_reading r "+
			                " inner join gas_ctm_meter cm on cm.ctm_archive_id=r.ctm_archive_id   where r.is_mrd='1' and r.copy_state in('2','3','4','5','6','A') "+inwhereinfo 
			                +") aa ) b where b.rn =1 ) c on c.ctm_archive_id = ar.ctm_archive_id ",
                            "wheres": whereinfo,
                            "page": true,
                            "limit":50
                        };
                        var queryUrl = resUrl + encodeURIComponent(JSON.stringify(bd));

                        xw.setRestURL(queryUrl);
                        return null;
                    }
                });
        },

        
    }

}();
