/**
 * Created by belle on 2017/8/15.
 */
var MrdShowPlanDetailAction = function () {

    var xw;
    var auditTypes = {};
    var gasTypeHelper = RefHelper.create({
        ref_url: "gasbizgastype",
        ref_col: "gasTypeId",
        ref_display: "gasTypeName",
    });
    var auditReasonFormat = {
        f: function(val,row,cell){
            if(row.copyState=='E'){
                var result=""
                if(row.reservedField1) result = row.reservedField1+","
                if(row.failedReason1)
                    $.each(row.failedReason1.split(','),function(index,code){
                        if(auditTypes[code]){
                            result += auditTypes[code]+",";
                        }
                    })
                if(row.failedReason2)
                    $.each(row.failedReason2.split(','),function(index,code){
                        if(auditTypes[code]){
                            result += auditTypes[code]+",";
                        }
                    })

                return result;
            }
        }
    }
    
    /*function setStartEnd(startdiff,timed){
        $('#find_start_month_date').val(moment().add(startdiff,timed).format('YYYY-MM-DD'))
        $('#find_end_month_date').val(moment().format('YYYY-MM-DD'));
        //resetSearch();//xw.autoResetSearch();
    }*/


    //供气区域helper
    return {
        init: function () {
            this.initHelper();
            this.reload();
            this.initBtn();
        },
        initHelper: function () {
        	//当日
$("#find_u_today_sign").click(function(){
    $("#find_u_start_date").val(date_format(new Date(),"yyyy-MM-dd"));
    $("#find_u_end_date").val(date_format(new Date(),"yyyy-MM-dd"));
});
//近一周
$("#find_u_this_week_sign").click(function(){
    var date = new Date();
    $("#find_u_start_date").val(date_format(date,"yyyy-MM-dd"));
    date.setDate(date.getDate()-6);
    $("#find_u_end_date").val(date_format(date,"yyyy-MM-dd"));
});
// 近一月
$("#find_u_this_month_sign").click(function(){
    var date = new Date();
    $("#find_u_end_date").val(date_format(date,"yyyy-MM-dd"));
    date.setMonth(date.getMonth()-1);
    date.setDate(date.getDate()+1);
    $("#find_u_start_date").val(date_format(date,"yyyy-MM-dd"));
});
// 近三月
$("#find_u_three_month_sign").click(function(){
    var date = new Date();
    $("#find_u_end_date").val(date_format(date,"yyyy-MM-dd"));
    date.setMonth(date.getMonth()-3);
    date.setDate(date.getDate()+1);
    $("#find_u_start_date").val(date_format(date,"yyyy-MM-dd"));
});
// 近一年
$("#find_u_this_year_sign").click(function(){
    var date = new Date();
    $("#find_u_end_date").val(date_format(date,"yyyy-MM-dd"));
    date.setMonth(date.getMonth()-12);
    date.setDate(date.getDate()+1);
    $("#find_u_start_date").val(date_format(date,"yyyy-MM-dd"));

});
// 不限
$("#find_u_anyway_sign").click(function(){
    $("#find_u_start_date").val("");
    $("#find_u_end_date").val("");
});

    	  /*  var queryCondion = RQLBuilder.and([
                        RQLBuilder.equal("status", "1"), //1启用
                        RQLBuilder.equal("parameterCode", "mrd.copycycle")
                    ]).rqlnoenc();
        	//获取计划抄表周期开始时间
        	var copymp = Restful.find(hzq_rest+"gassysparameter",queryCondion);
        	var copympdate = 26;
        	if(copymp && copymp.success){
        		copympdate = copymp[0].parameterValue; 
        	}
        	
        	
        	//判断当前日期，初始化起始日期
        	var nd = moment().format('YYYY-MM-DD');
        	var nd_arr =nd.split("-");
        	var copy_start_date = '',copy_end_date='';
        	var cd = '',md1 ='',md1ate='';
        	
        	if(copympdate.length ==1){
        		cd = String('0'+String(copympdate));
        	}
        	
        	if(nd_arr && nd_arr.length > 0 ){
        		if(nd_arr[1] && nd_arr[1].length==1){
        			md1 = String('0'+String(nd_arr[1]));
        		}
        		if(nd_arr[2] >= copympdate){//本月中
        			
        			copy_start_date = nd_arr[0] +"-"+ md1+ "-"+cd;
        			var md2 = String(parseInt(md1)+1);
        			if(md2.lenth == 1){
        				md2 = String('0'+md2);
        			}
        			copy_end_date =  nd_arr[0] +"-"+ md2+"-" +'25';
        		}else if(nd_arr[2]< copympdate){//下个月
        			//copy_start_date = $('#find_start_month_date').val(moment().add(-1,'M').add(-1,'d').format('YYYY-MM-DD'))
        			//copy_end_date = nd_arr[0] +"-"+ md1+ cd;
        			var md2 = String(parseInt(md1)-1);
        			if(md2.lenth == 1){
        				md2 = String('0'+md2);
        			}
        			copy_start_date = nd_arr[0]+"-"+
        			copy_end_date=nd_arr[0]+"-"+md1+"-"+'25';
        		}
        		$('#find_start_month_date').val(copy_start_date);
        		$('#find_end_month_date').val(copy_end_date);
        	}*/
        	
            var login_user = JSON.parse(localStorage.getItem("user_info"));
            console.log(login_user);
            GasModMrd.appMeterErrorList({
                "cb":function(data){
                    var inhtml ="<option value=''>无</option>";
                    if(data){
                        $.each(data,function(idx,row){
                            inhtml += '<option value="'+row.parameterCode+'">'+row.parameterName+'</option>';
                        })
                        $('#find_appmetererror').html(inhtml);
                    }
                }
            });
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
                //   xw.autoResetSearch();
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
            //历史核算员
          //  $('#find_history_countperId').on('change',function(e){
				console.log();
				GasModMrd.historyCountperList({
					"cb":function(data){
						var inhtml = "<option value=''>全部</option>";
						if(data){
							$.each(data,function(inx,row){
								inhtml +='<option value="'+row.userId+'">'+row.employeeCode+":"+row.employeeName+'</option>'
							})
						}
						$('#find_history_countperId').html(inhtml);
						$("#find_history_countperId").val("").change();
					}
				});
            //});
            //历史抄表员
           // $('#find_history_serviceperId').on('change',function(e){
            	GasModMrd.historyServiceperList({
					"cb":function(data){
						var inhtml = "<option value=''>全部</option>";
						if(data){
							$.each(data,function(inx,row){
								inhtml +='<option value="'+row.userId+'">'+row.employeeCode+":"+row.employeeName+'</option>'
							})
						}
						$('#find_history_serviceperId').html(inhtml);
						$("#find_history_serviceperId").val("").change();
					}
				});
				
				//在职核算员姓名查询
				GasModMrd.currentCountperList({
					"cb":function(data){
						var inhtml = "<option value=''>全部</option>";
						if(data){
							$.each(data,function(inx,row){
								inhtml +='<option value="'+row.userId+'">'+row.employeeCode+":"+row.employeeName+'</option>'
							})
						}
						$('#find_now_countperId').html(inhtml);
						$("#find_now_countperId").val("").change();
					}
				});
				GasModMrd.currentServiceperList({
					"cb":function(data){
						var inhtml = "<option value=''>全部</option>";
						if(data){
							$.each(data,function(inx,row){
								inhtml +='<option value="'+row.userId+'">'+row.employeeCode+":"+row.employeeName+'</option>'
							})
						}
						$('#find_now_serviceperId').html(inhtml);
						$("#find_now_serviceperId").val("").change();
					}
				});
				//在职客户服务员姓名查询
           // });
            //抄表类型
            $.map(GasModMrd.enumCopyType,function(value,key){
                $('#copy_type').append('<option value="' + key + '">' + value + '</option>');
            });
            //是否计费
            $.map(GasModMrd.enumIsBll,function(value,key){
                $('#is_bll').append('<option value="' + key + '">' + value + '</option>');
            });
            //是否抄表
            $.map(GasModMrd.enumIsMrd,function(value,key){
                $('#is_mrd').append('<option value="' + key + '">' + value + '</option>');
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
            /*('#copy_operate').html('');*/
            $.map(GasModMrd.enumOperate,function(value,key){
            	$('#copy_operate').append('<option value="' + key + '">' + value + '</option>');
            });
            //临时抄表类型
            $.map(GasModMrd.enumTemporayType,function(value,key){
            	$('#temporary_type').append('<option value="'+key+'">'+value+'</option>');
            });

            $.map(gasTypeHelper.getData(), function (value, key) {
                //console.log(key)
                $('#find_gasTypeId').append('<option value="' + key + '">' + value + '</option>');
            });
            $("#find_gasTypeId").on("change", function () {
                //console.log($(this).val())
                $('#find_gasTypeId1').html('<option value="">请选择</option>').trigger("change")
                var gasType1Helper = RefHelper.create({
                    ref_url: 'gasbizgastype/?query={"parentTypeId":"' + $(this).val() + '"}',
                    ref_col: "gasTypeId",
                    ref_display: "gasTypeName",
                });
                $.map(gasType1Helper.getData(), function (value, key) {
                    console.log(key)
                    $('#find_gasTypeId1').append('<option value="' + key + '">' + value + '</option>');
                });
            });
            $("#find_gasTypeId1").on("change", function () {
                console.log($(this).val())
                $('#find_gasTypeId2').html('<option value="">请选择</option>').trigger("change")
                var gasType1Helper = RefHelper.create({
                    ref_url: 'gasbizgastype/?query={"parentTypeId":"' + $(this).val() + '"}',
                    ref_col: "gasTypeId",
                    ref_display: "gasTypeName",
                });
                $.map(gasType1Helper.getData(), function (value, key) {
                    console.log(key)
                    $('#find_gasTypeId2').append('<option value="' + key + '">' + value + '</option>');
                });
            });

            $.ajax({
                url: Utils.queryURL(hzq_rest+ "gassysparameter")+'query='+RQLBuilder.rlike("parameterModel","hzq.aud.filter.").rql(),
                dataType: 'json',
                async: false,
            }).done(function(data,retcode) {
                //console.log("getdata::"+JSON.stringify(data))
                $.each(data,function(id,row){
                    auditTypes[row.parameterCode]=row.parameterName;
                })
            });

        },
        reload: function () {
            $('#divtable').html('');

            var bd = {
               
                "cols": "distinct mr.meter_reading_id,mr.charge_meter_reading,mr.book_id,mr.ctm_archive_id,mr.meter_id,mr.revise_meter_id," +
                "mr.customer_kind,mr.meter_reading,mr.revise_reading,mr.last_meter_reading,mr.last_revise_reading," +
                "mr.copy_type,mr.copy_time,mr.plan_copy_time,mr.quotiety,mr.area_id,mr.serviceper_id,mr.countper_id," +
                "ar.customer_code,ar.customer_name,mr.copy_state,b.book_code,b.book_type,mr.remark,mr.address," +
                /*"mr.failed_reason1,mr.failed_reason2," +*/
                "mr.failed_reason1,mr.failed_reason2,mr.feedback,mr.reserved_field1,mr.reserved_field2," +
                "m_1.exception_type,cm.revise_meter_state," +
                "mr.data_source," +
                "m_1.meter_digit,m_2.meter_digit revise_meter_digit,m_1.meter_kind,m_2.meter_kind revise_meter_kind,"+
                "gd.created_time as bllcreatedtime",
                "froms": "gas_mrd_meter_reading mr " +
                " inner join gas_ctm_archive ar on ar.ctm_archive_id=mr.ctm_archive_id" +
                " left join gas_mrd_book b on b.book_id=mr.book_id " +
               // " left join gas_biz_gas_type g on g.gas_type_id= mr.gas_type_id " +
                " inner join gas_ctm_meter cm on cm.ctm_archive_id=ar.ctm_archive_id " +
                " left join gas_mtr_meter m_1 on m_1.meter_id=cm.meter_id " +
                " left join gas_mtr_meter m_2 on m_2.meter_id=cm.revise_meter_id "+
                " left join gas_bll_detail gd on gd.meter_reading_id=mr.meter_reading_id ",
                "wheres": "1=0",
                "page": false,
                /*"limit":50*/
            };

            xw = XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize: 10, 			//Initial pagesize
                    columnPicker: true,         //Show the columnPicker button
                    sorting: false,
                    transition: 'fade',  //(bounce, fade, flip, rotate, scroll, slide).
                    checkboxes: true,           //Make rows checkable. (Note. You need a column with the 'unique' property)
                    checkAllToggle: true,        //Show the check-all toggle//+RQLBuilder.like("KEYY", "a").rql()
                    //----------------基本restful地址---
                    restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
                    key_column:'meterReadingId',
                    coldefs: [
                        {
                            col: "meterReadingId",
                            friendly: "抄表表ID",
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
                            readonly: "readonly",
                            format: GasModSys.areaFormat,
                            sorting: false,
                            index: 3
                        },
                        {
                            col: "planCopyTime",
                            friendly: "计划抄表日期",
                            format: dateFormat,
                            sorting: false,
                            index: 4
                        },
                        {
                            col:"copyState",
                            friendly:"抄表状态",
                            format:GasModMrd.mrdStateFormat,
                            readonly:"readonly",
                            sorting:false,
                            index:5
                        },
                        {
                            col:"copyTime",
                            friendly:"实际抄表时间",
                            readonly: "readonly",
                            sorting:false,
                            index:6
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
                        	col:"mobiletel",
                        	friendly:"联系电话",
                        	readonly:"readonly",
                        	sorting:false,
                        	index:11
                        },
                        {
                            col: "customerKind",
                            friendly: "客户类型",
                            format: GasModCtm.customerKindFormat,
                            sorting: false,
                            index: 12
                        },
                        {
                            col: "bookId",
                            friendly: "抄表本ID",
                            unique: true,
                            hidden: true,
                            nonedit: "nosend",
                            readonly: "readonly",
                            sorting: false,
                            index: 13
                        },
                        {
                            col: "bookCode",
                            friendly: "抄表本编号",
                            sorting: false,
                            index: 14
                        },
                        {
                            col: "bookType",
                            friendly: "抄表本类型",
                            format: GasModBas.bookTypeFormat,
                            sorting: false,
                            index: 15
                        },
                        {
                            col:"dataSource",
                            friendly:"数据来源",
                            format:GasModMrd.dataSourceFormat,
                            sorting:false,
                            index:16
                        },
                        {
                            col: "meterKind",
                            friendly: "表具种类",
                            format: GasModMtr.meterKindFormat,
                            sorting: false,
                            index: 18
                        },
                        {
                            col: "copyTime",
                            friendly: "实际抄表日期",
                            readonly: "readonly",
                            sorting: false,
                            index: 20
                        },
                        {
                            col: "meterReading",
                            friendly: "燃气表读数",
                            readonly: "readonly",
                            sorting: false,
                            index: 22
                        },
                        {
                            col:"lastMeterReading",
                            friendly:"上次燃气表读数",
                            readonly:"readonly",
                            sorting:false,
                            index:24
                        },
                        {
                            col: "reviseReading",
                            friendly: "修正表读数",
                            readonly: "readonly",
                            sorting: false,
                            index: 26
                        },
                        {
                            col:"lastReviseReading",
                            friendly:"上次修正表读数",
                            readonly:"readonly",
                            sorting:false,
                            index:28
                        },
                        {
                            col: "gasTypeName",
                          	//col:"gasTypeId",
                            friendly: "用气类型",
                            format:GasModCtm.gasTypeFormat,
                            sorting: false,
                            index:30
                        },
                        {
                            col:"chargeMeterReading",
                            friendly:"计费气量",
                            sorting:false,
                            index:32
                        },
                        {
                            col: "address",
                            friendly: "地址",
                            readonly: "readonly",
                            sorting: false,
                            index: 34
                        },
                        {
                            col:"exceptionType",
                            friendly:"表具异常类型",
                            readonly:"readonly",
                            hidden:true,
                            sorting:false,
                            index:36
                        },
                        {
                            col:"meterDigit",
                            friendly:"燃气表位数",
                            readonly:"readonly",
                            hidden:true,
                            sorting:false,
                            index:38
                        },
                        {
                            col:"reviseMeterDigit",
                            friendly:"二次表位数",
                            readonly:"readonly",
                            hidden:true,
                            sorting:false,
                            index:40
                        },
                        {
                            col: "failedReason1",
                            friendly: "标识正常原因",
                            hidden: true,
                            nonedit: "nonedit",
                            readonly: "readonly",
                            index: 42
                        },
                        {
                            col:"failedReasons",
                            friendly:"异常类型",
                            readonly: "readonly",
                            hidden:true,
                            nonedit: "nosend",
                            format:auditReasonFormat,
                            index:44
                        },
                        {
                            col: "failedReason2",
                            friendly: "异常类型0",
                            hidden: true,
                            nonedit: "nonedit",
                            readonly: "readonly",
                            index: 46
                        },
                        {
                            col:"reservedField1",
                            friendly:"置为正常原因1",
                            readonly:"readonly",
                            sorting:false,
                            index:48
                        },
                        {
                            col:"reservedField2",
                            friendly:"(异常或置为正常)原因2",
                            hidden:true,
                            readonly:"readonly",
                            sorting:false,
                            index:50
                        },
                        {
                            col: "feedback",
                            friendly: "反馈信息",
                            hidden:true,
                            readonly: "readonly",
                            sorting: false,
                            index: 52
                        },
                        {
                        	col:"bllcreatedtime",
                        	friendly:"计费时间",
                        	hidden:true,
                        	readonly:"readonly",
                        	sorting:false,
                        	index:53
                        },
                        {
                            col: "exceptionType",
                            friendly: "异常信息",
                            hidden:true,
                            readonly: "readonly",
                            sorting: false,
                            index: 54
                        },
                        {
                        	col:"createdTime",
                        	friendly:"创建时间",
                        	readonly:true,
                        	sorting:false,
                        	index:55
                        },
                        {
                        	col:"modifiedTime",
                        	friendly:"记录修改时间",
                        	readonly:true,
                        	sorting:false,
                        	index:56
                        },
                        {
                            col:'remark',
                            friendly:"备注",
                            hidden:true,
                            sorting: false,
                            index: 57
                        }
                    ],
                    //---------------查询时过滤条件
                    findFilter: function () {//find function

                        var resUrl = "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=";
                        var whereinfo = "1=1 ";
                        if($('#find_history_countperId').val()){
                        	whereinfo +=" and mr.countper_id='"+$('#find_history_countperId').val()+"' ";
                        }
                        if($('#find_history_serviceperId').val()){
                        	whereinfo +=" and mr.serviceper_id='"+$('#find_history_serviceperId').val()+"' ";
                        }
                        if($('#find_now_countperId').val()){
                        	whereinfo +=" and mr.countper_id='"+$('#find_now_countperId').val()+"' ";
                        }
                        if($('#find_now_serviceperId').val()){
                        	whereinfo +=" and mr.serviceper_id='"+$('#find_now_serviceperId').val()+"' ";
                        }
                        if ($('#find_areaId').val()) {
                            whereinfo += " and mr.area_id='" + $('#find_areaId').val() + "'";
                        }
                        if ($('#find_serviceperId').val()) {
                            whereinfo += " and mr.serviceper_id='" + $('#find_serviceperId').val() + "'";
                        }
                        if ($('#find_countperId').val()) {
                            whereinfo += " and mr.countper_id='" + $('#find_countperId').val() + "'";
                        }
                        if($('#find_charging_meter').val()){
                        	whereinfo +=" and mr.charging_meter='"+$('#find_charging_meter').val()+"' ";
                        }
                        if($('#copy_type').val()){
                        	whereinfo += " and mr.copy_type='"+$('#copy_type').val()+"'";
                        	if($('#copy_type').val() !='60' ){
                        		if( $('#find_start_date').val() && $('#find_end_date').val()){
                            		whereinfo += " and mr.copy_time between to_date('" + $("#find_start_date").val() + " 00:00:00','yyyy-mm-dd hh24:mi:ss') and to_date('" + $('#find_end_date').val() + " 23:59:59','yyyy-mm-dd hh24:mi:ss')";
                            	}
                        		if($('#find_start_month_date').val() && $('#find_end_month_date').val()) {
		                            whereinfo += " and ( mr.copy_time between to_date('" + $("#find_start_month_date").val() + " 00:00:00','yyyy-mm-dd hh24:mi:ss') and to_date('" + $('#find_end_month_date').val() + " 23:59:59','yyyy-mm-dd hh24:mi:ss') ) ";
		                        }
                           	}else if ($('#find_start_date').val() && $('#find_end_date').val()) {
                            	whereinfo += " and nvl(mr.plan_copy_time,mr.copy_time) between to_date('" + $("#find_start_date").val() + " 00:00:00','yyyy-mm-dd hh24:mi:ss') and to_date('" + $('#find_end_date').val() + " 23:59:59','yyyy-mm-dd hh24:mi:ss')";
                        	}else if($('#find_start_month_date').val() && $('#find_end_month_date').val()) {
                            	whereinfo += " and ( nvl(mr.plan_copy_time,mr.copy_time) between to_date('" + $("#find_start_month_date").val() + " 00:00:00','yyyy-mm-dd hh24:mi:ss') and to_date('" + $('#find_end_month_date').val() + " 23:59:59','yyyy-mm-dd hh24:mi:ss') ) ";
                        	}
                        }else{
                        	if ($('#find_start_date').val() && $('#find_end_date').val()) {
                            	whereinfo += " and nvl(mr.plan_copy_time,mr.copy_time) between to_date('" + $("#find_start_date").val() + " 00:00:00','yyyy-mm-dd hh24:mi:ss') and to_date('" + $('#find_end_date').val() + " 23:59:59','yyyy-mm-dd hh24:mi:ss')";
                        	}
                        	if($('#find_start_month_date').val() && $('#find_end_month_date').val()) {
                            	whereinfo += " and ( nvl(mr.plan_copy_time,mr.copy_time) between to_date('" + $("#find_start_month_date").val() + " 00:00:00','yyyy-mm-dd hh24:mi:ss') and to_date('" + $('#find_end_month_date').val() + " 23:59:59','yyyy-mm-dd hh24:mi:ss') ) ";
                        	}
                        }
                        
                        if($('#find_copy_start_month_date').val() && $('#find_copy_end_month_date').val()){
                        	whereinfo +=" and (mr.copy_time between to_date('"+$('#find_copy_start_month_date').val()+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and to_date('"+$('#find_copy_end_month_date').val()+" 23:59:59','yyyy-mm-dd hh24:mi:ss') ) ";
                        }
                        if($('#is_bll').val()){
                            whereinfo += " and mr.is_bll='"+$('#is_bll').val()+"' ";
                        }
                        if($('#is_mrd').val()){
                            whereinfo += " and mr.is_mrd='"+$('#is_mrd').val()+"'";
                        }
                        if($('#data_source').val()){
                            whereinfo += " and mr.data_source='"+$('#data_source').val()+"'";
                        }
                        if($('#customer_kind').val()){
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
                            whereinfo +=" and b.book_code ='"+$('#book_code').val()+"'";
                        }
                        
                        //抄表月---一月~12月
                        if($('#copy_state').val()){
                        	whereinfo +=" and nvl(mr.copy_state,'0') ='"+$('#copy_state').val()+"' ";
                        }else{
                            whereinfo +=" and nvl(mr.copy_state,'0') <> '9' ";
                        }

                        if($('#copy_operate').val()){
                        	//alert($('#copy_operate').val());
                            whereinfo +=" and nvl(mr.operate,'P')='"+$('#copy_operate').val()+"' ";
                        }
                        //用气性质
                        if ($('#find_gasTypeId').val() && !$('#find_gasTypeId1').val() && !$('#find_gasTypeId2').val()) {

                            if ($('#find_gasTypeId').val() == "2") {
                                whereinfo += " and ar.customer_kind='1' ";
                            } else {
                                whereinfo += " and ar.customer_kind='9' ";
                            }


                        } else if ($('#find_gasTypeId').val() && $('#find_gasTypeId1').val() && !$('#find_gasTypeId2').val()) {
                            console.log($('#find_gasTypeId1').val())
                            whereinfo += " and ar.gas_type_id like '" + $('#find_gasTypeId1').val() + "%'  ";
                        } else if ($('#find_gasTypeId').val() && $('#find_gasTypeId1').val() && $('#find_gasTypeId2').val()) {
                            console.log($('#find_gasTypeId2').val())
                            whereinfo += " and ar.gas_type_id = '" + $('#find_gasTypeId2').val() + "' ";
                        }

                        if($('#find_feedback').val()){
                            if($('#find_feedback').val() =='1'){
                                whereinfo+=" and nvl(mr.feedback,'0')<>'0' ";
                            }
                            if($('#find_feedback').val() =='2'){
                                whereinfo +=" and nvl(mr.feedback,'0')='0' ";
                            }
                        }

                        if($('#find_errortoallow').val()){
                            if($('#find_errortoallow').val() =='1'){//人为标记为正常
                                whereinfo +=" and nvl(mr.reservedField1,'0')<>'0' ";
                            }
                            if($('#find_errortoallow').val()=='2'){//非人为标记为正常
                                whereinfo +=" and nvl(mr.reservedField1,'0')='0' ";
                            }
                        }
                        if($('#find_revisemeterstate').val()){
                            whereinfo +=" and cm.revise_meter_state='"+$('#find_revisemeterstate').val()+"' ";
                        }
                        var plan2copycha = $('#find_plantimetocopytime').val();
                            //typeof obj === 'number'
                        if(plan2copycha && typeof plan2copycha === 'number' ){
                            whereinfo +=" and nvl(mr.copy_time,0)<>0 and nvl(mr.plan_copy_time,0)<>0 and trunc(nvl(mr.copy_time,0))-trunc(nvl(mr.plan_copy_time,0)) ="+plan2copycha+" ";
                        }
                        if($('#temporary_type').val()){
                        	whereinfo +=" and mr.temporary_type='"+$('#temporary_type').val()+"' ";
                        }
                        if($('#find_u_start_date').val() && $('#find_u_end_date').val()){//客户开栓日期
                        	//1924年2月5日
                        	whereinfo +=" and to_char(nvl(ar.unbolt_time,to_date('1924-04-04 00:00:00','yyyy-mm-dd hh24:mi:ss')),'yyyy-mm-dd')<>'1924-04-04'  ";
                        	whereinfo +=" and (ar.unbolt_time between to_date('"+$('#find_u_start_date').val()+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and to_date('"+$('#find_u_end_date').val()+" 23:59:59','yyyy-mm-dd hh24:mi:ss')) ";
                        }
                        if($('#find_bll_start_date').val()  && $('#find_bll_end_date').val()){//计费时间
                        	whereinfo +=" and (gd.created_time between to_date('"+$('#find_bll_start_date').val()+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and to_date('"+$('#find_bll_end_date').val()+" 23:59:59','yyyy-mm-dd hh24:mi:ss')) ";
                        }
                        //计划创建时间
                        if($('#find_p_start_date').val() && $('#find_p_end_date').val()){
                        	//whereinfo +=" and to_char(nvl(ar.created_time,to_date('')))";
                        	whereinfo +=" and (mr.created_time between to_date('"+$('#find_p_start_date').val()+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and to_date('"+$('#find_p_end_date').val()+" 23:59:59','yyyy-mm-dd hh24:mi:ss')) ";
                        	
                        }
                        //抄表计划，抄表记录最后一次修改时间
                        if($('#find_l_start_date').val() && $('#find_l_end_date').val()){
                        	whereinfo +=" and (mr.modified_time between to_date('"+$('#find_l_start_date').val()+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and to_date('"+$('#find_l_end_date').val()+" 23:59:59','yyyy-mm-dd hh24:mi:ss')) ";
                        }
                        //计费器量 查询
                        if($('#find_charge_meter_reading_min').val() && $('#find_charge_meter_reading_max').val()){
                        	whereinfo +=" and (mr.charge_meter_reading >="+$('#find_charge_meter_reading_min').val()+"  and mr.charge_meter_reading <="+$('#find_charge_meter_reading_max').val()+" ) ";
                        }
                       	whereinfo +=" and cm.meter_user_state<>'99' and ar.customer_state<>'99' ";
                        var bd = {
                           
                           "cols": "gt.gas_type_name,mr.gas_type_id,mr.charge_meter_reading,mr.book_id,mr.ctm_archive_id,mr.meter_reading_id,mr.meter_id,mr.revise_meter_id," +
			                "mr.customer_kind,mr.meter_reading,mr.revise_reading,mr.last_meter_reading,mr.last_revise_reading," +
			                "mr.copy_type,mr.copy_time,mr.plan_copy_time,mr.quotiety,mr.area_id,mr.serviceper_id,mr.countper_id," +
			              // "cols":"mr.*,gt.gas_type_name,"+
			                "ar.customer_code,ar.customer_name,mr.copy_state,b.book_code,b.book_type,mr.remark,mr.address,nvl(ar.mobile,nvl(ar.link_mantel,ar.tel)) as mobiletel," +
			                /*"mr.failed_reason1,mr.failed_reason2," +*/
			                "mr.failed_reason1,mr.failed_reason2,mr.feedback,mr.reserved_field1,mr.reserved_field2," +
			                "m_1.exception_type,cm.revise_meter_state," +
			                "mr.data_source," +
			                "m_1.meter_digit,m_2.meter_digit revise_meter_digit,m_1.meter_kind,m_2.meter_kind revise_meter_kind,"+
			                "gd.created_time as bllcreatedtime ",
			                
                            "froms": "gas_mrd_meter_reading mr " +
                            " inner join gas_biz_gas_type gt on gt.gas_type_id=mr.gas_type_id "+
                            " left join gas_ctm_archive ar on ar.ctm_archive_id=mr.ctm_archive_id" +
                            " left join gas_mrd_book b on b.book_id=mr.book_id " +
                            " left join gas_biz_gas_type g on g.gas_type_id= mr.gas_type_id " +
                            " left join gas_ctm_meter cm on mr.ctm_archive_id=cm.ctm_archive_id " +
                            " left join gas_mtr_meter m_1 on m_1.meter_id=cm.meter_id " +
                            " left join gas_mtr_meter m_2 on m_2.meter_id=cm.revise_meter_id "+
                            " left join gas_bll_detail gd on gd.meter_reading_id=mr.meter_reading_id ",
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

        initBtn :function(){

            $(document).on("click",'.btn-default,.close',function(){
                $('#modify').css({'display':"none",'background':"none"});
                $('#modify').attr("aria-hidden","true");
                $('#modify').removeClass('in');
            });

            $('#mrd_upd_button').on('click',function(e){
                var selrows = xw.getTable().getData(true);
                if (selrows.rows.length == 0) {
                    bootbox.alert("<br><center><h4>请选择需要预览的行</h4></center><br>");
                } else if (selrows.rows.length > 1) {
                    bootbox.alert("<br><center><h4>只能修改一行</h4></center><br>");
                }else{
                    $('#modify div.modal-body').css({"margin-bottom":"-40px"})

                    var selectedrow = xw.getTable().getData(true).rows[0];
                    if(!selectedrow)
                    {
                        bootbox.alert("<br><center><h4>未找到相关数据</h4></center><br>");
                        return;

                    }
                    if(selectedrow.isMrd == '1'){
                        bootbox.alert("<br><center><h4>该抄表计划已抄,不能修改</h4></center><br>");
                        return ;
                    }
                    if(selectedrow.isBll =='1'){
                        bootbox.alert("<br><center><h4>已计费不能修改</h4></center><br>");
                        return;
                    }
                    if(selectedrow.copyState != '0' && selectedrow.copyState !='1'){
                        bootbox.alert("<br><center><h4>非新生成的抄表计划不能修改</h4></center><br>");
                        return;
                    }
                    console.log(selectedrow.areaId);
                    // console.log()
                    var area_name =  GasModSys.areaHelper.getDisplay(selectedrow.areaId);
                    $('#modify_area').html('');
                    $('#modify_area').append('<option value="'+selectedrow.areaId+'">'+area_name+'</option>');

                    GasModSys.counterUsersInArea({
                        "areaId":selectedrow.areaId,
                        "cb":function(data){
                            //console.log("data=="+JSON.stringify(data));
                            var inhtml = "";
                            if(data){
                                $.each(data,function(idx,row){
                                    inhtml += '<option value="'+row.userId+'">'+row.employeeName+'</option>';
                                })
                            }
                            $("#modify_countper").html(inhtml);
                            $("#modify_countper").val(selectedrow.countperId).attr("selected",true);

                            setTimeout(function(){

                            },100);
                            //$("#modify_countper").val("").change();

                        }
                    });
                    GasModSys.copyUsersInArea({
                        "areaId": selectedrow.areaId,
                        "countperId": selectedrow.countperId,
                        "cb": function (data) {
                            var inhtml = "";
                            $.each(data, function (idx, row) {
                                inhtml += '<option value="' + row.userId + '">' + row.employeeName + '</option>';

                            })
                            $("#modify_serviceper").html(inhtml);
                            $("#modify_serviceper").val(selectedrow.serviceperId).attr("selected",true);
                            setTimeout(function(){

                            },100);
                        }
                    });

                    $('#modify').css({'display':"block",'background':"rgba(0,0,0,0.3)"});
                    $('#modify').attr("aria-hidden","false");
                    $('#modify').addClass('in');

                    $('#modify_remark').val(selectedrow.remark);
                    $('#modify_address').val(selectedrow.address);
                    $('#modify_plancopytime').val(selectedrow.planCopyTime);

                }
            });

            $('#select_copy_month').on('click','.btn',function(e){
            	$('#select_copy_month button').removeClass("bg-blue-chambray");
                var mydate = new Date();
                var fullyear = mydate.getFullYear();
                var copyids2 = this.id;
                var copyids = $(this)[0].id;
                $('#'+copyids).addClass("bg-blue-chambray");
                console.log(copyids);
                var copydatetofrom  = GasModMrd.enumSelectCopyMonth[copyids];

                for (var x in copydatetofrom ) {
                   // console.log(x,a[x]);
                    if(x=='12-26'){
                        var yyear = (parseInt(fullyear)-1);
                        $('#find_start_month_date').val(yyear+"-"+x);

                    }else{
                        $('#find_start_month_date').val(fullyear+"-"+x);
                    }
                    $('#find_end_month_date').val(fullyear+"-"+copydatetofrom[x]);
                }

                console.log(copydatetofrom);
            })
            
            $('#select_copy_month_1').on('click','.btn',function(e){
            	
            	$('#select_copy_month_1 button').removeClass("bg-purple-medium");
                var mydate = new Date();
                var fullyear = mydate.getFullYear();
                var copyids2 = this.id;
                var copyids = $(this)[0].id;
                
                $('#'+copyids).addClass("bg-purple-medium");
                console.log(copyids);
                var copydatetofrom  = GasModMrd.enumSelectTrueCopyMonth[copyids];

                for (var x in copydatetofrom ) {
                   // console.log(x,a[x]);
                    if(x=='12-26'){
                        var yyear = (parseInt(fullyear)-1);
                        $('#find_copy_start_month_date').val(yyear+"-"+x);

                    }else{
                        $('#find_copy_start_month_date').val(fullyear+"-"+x);
                    }
                    $('#find_copy_end_month_date').val(fullyear+"-"+copydatetofrom[x]);
                }

                console.log(copydatetofrom);
            })

        },
    }

}();

