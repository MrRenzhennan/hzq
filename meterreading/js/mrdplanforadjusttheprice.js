/**
 * Created by belle on 2017/8/17.
 * 临时抄表计划
 */
console.log(UserInfo);
console.log(UserInfo.item());
console.log(UserInfo.item().area_id);

var user_info_native = UserInfo;
var area_id_native = UserInfo.item().area_id;

var MrdPlanForAdjustThePriceAction = function(){
    //初始化 供气区域
    //初始化 核算员
    //初始化 抄表员
    //初始化 客户状态

    var xw;
    
    /*var handleMultiSelect = function () {
       
    }*/

	/*var handleMultiSelect = function () {
	    $('#my_multi_select1').multiSelect();
	}*/
    
    //供气区域helper
    return {
        init: function () {
            this.initHelper();
            //handleMultiSelect();
            this.initBtn();
            this.reload();

        },
        initHelper:function(){
        	//$('#mymulti_select1').multiSelect();
          //初始化 供气区域
          //初始化 核算员
          //初始化 抄表员
            GasModSys.areaList({
            	
               "areaId":area_id_native,
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
            })

            $('#find_areaId').on('change',function(e){
                console.log("change area:"+e+"."+$('#find_areaId').val());
                if($('#find_areaId').val()){
                	//$('#plan_areaId').append('<option value="'+$('#find_areaId').val()+'" name="'+$('#find_areaId').val()+'">'+$('#find_areaId').text()+'</option>');
                	//areaid  选中
                }
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

            
            
            GasModSys.areaList({
            	
               "areaId":area_id_native,
                "cb":function(data){
                    var inhtml = "<option value=''>全部</option>";
                    if(data){
                        $.each(data,function(idx,row){
                            inhtml += '<option value="'+row.areaId+'">'+row.areaName+'</option>';
                        })
                        $("#plan_areaId").html(inhtml);
                       	$("#plan_countperId").val("").change();
                    }
                }
            })
            
            //初始化 计划的供气区域，计划的核算员，计划的抄表员。
            $('#plan_areaId').html('<option value="" name="全部"">全部</option>');
            $.each(GasModSys.areaHelper.getRawData(), function(idx, row) {
                if('1'==UserInfo.item().area_id)
                {
                    $('#plan_areaId').append('<option value="'+row.areaId+'" name="'+row.areaId+'">'+row.areaName+'</option>');
                }else if (row.areaId==UserInfo.item().area_id){
                    $('#plan_areaId').append('<option value="'+row.areaId+'" name="'+row.areaId+'">'+row.areaName+'</option>');
                }
            });

            if(UserInfo.item().station_id=='1')
            {
                console.log("cahnge")
                var inhtml = "<option value='"+UserInfo.item().userId+"' selected>"+UserInfo.item().employee_name+"</option>";
                $("#plan_areaId").val(UserInfo.item().area_id).change();;
                $("#plan_areaId").attr({disabled:"disabled"})

                $("#plan_countperId").html(inhtml);
                $("#plan_countperId").val(UserInfo.item().userId).change();
                $("#plan_countperId").attr({disabled:"disabled"})

                GasModSys.employeeListForArea({
                    "areaId":$('#plan_areaId').val(),
                    //"countperId":$('#plan_countperId').val(),
                    "cb":function(data){
                        var inhtml = "<option value=''>全部</option>";
                        if(data){
                            $.each(data,function(idx,row){
                                inhtml += '<option value="'+row.userId+'">'+row.employeeName+'</option>';
                            })
                        }
                        $("#plan_serviceperId").html(inhtml);
                        $("#plan_serviceperId").val("").change();

                    }
                })

            }else{
                $('#plan_countperId').on('change',function(e){
                    console.log("change counter:"+e+"."+$('#find_countperId').val());
                    GasModSys.employeeListForArea({
                        "areaId":$('#plan_areaId').val(),
                        //"countperId":$('#plan_countperId').val(),
                        "cb":function(data){
                            var inhtml = "<option value=''>全部</option>";
                            if(data){
                                $.each(data,function(idx,row){
                                    inhtml += '<option value="'+row.userId+'">'+row.employeeName+'</option>';
                                })
                            }
                            $("#plan_serviceperId").html(inhtml);
                            $("#plan_serviceperId").val("").change();

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

            $('#plan_areaId').on('change',function(e){
                console.log("change area:"+e+"."+$('#plan_areaId').val());
                GasModSys.counterUsersInArea({
                    "areaId":$('#plan_areaId').val(),
                    "cb":function(data){
                        var inhtml = "<option value=''>全部</option>";
                        $.each(data,function(idx,row){
                            inhtml += '<option value="'+row.userId+'">'+row.employeeName+'</option>';
                        })
                        $("#plan_countperId").html(inhtml);
                        $("#plan_countperId").val("").change();

                    }
                })
                //   xw.autoResetSearch();
            })

            $('#plan_countperId').on('change',function(e){
                console.log("change counter:"+e+"."+$('#plan_countperId').val());
                GasModSys.employeeListForArea({
                    "areaId":$('#plan_areaId').val(),
                    //"countperId":$('#plan_countperId').val(),
                    "cb":function(data){
                        var inhtml = "<option value=''>全部</option>";
                        if(data){
                            $.each(data,function(idx,row){
                                inhtml += '<option value="'+row.userId+'">'+row.employeeName+'</option>';
                            })
                        }
                        $("#plan_serviceperId").html(inhtml);
                        $("#plan_serviceperId").val("").change();
                    }
                })
            });

            
            //客户状态--下拉列表(查询条件)
            //$('#find_customer_state').html('');
            $.map(GasModCtm.enumCustomerState, function (value,key) {
                $('#find_customer_state').append('<option value="' + key + '">' + value + '</option>');
            });
            
            $('#customer_state').html('');
            var chtml ='生成条件-客户状态：';
			var customerstate = GasModCtm.enumCustomerState;
			for(var key in customerstate){
				if(key =='01'){
					chtml +='<input name="c_checkbox" type="checkbox" checked class="make-switch" data-size="large" data-val="'+key+'">&nbsp'+customerstate[key]+'&nbsp;&nbsp';
				}else if(key == '04'){
					chtml +='<input name="c_checkbox" type="checkbox" checked class="make-switch" data-size="large" data-val="'+key+'">&nbsp'+customerstate[key]+'&nbsp;&nbsp';
				}else{
					chtml +='<input name="c_checkbox" type="checkbox" class="make-switch" data-size="large" data-val="'+key+'">&nbsp'+customerstate[key]+'&nbsp;&nbsp';
				}
				
			}
			$('#customer_state').html(chtml);
			
			
			//选择按本生成还是按户生成
			$('#is_planforbook').on('change',function(e){//选择按本生成还是按户生成 后 
				var planforbookorctm =  $('#is_planforbook').val();
				if(!is_planforbook){
					if(is_planforbook ==''){//按本生成
						
					}
					if(is_planforbook == ''){//按户生成
						
					}
				}
				
			});
			
			//点击查询之后
			
			
        },
        reload: function () {
            $('#divtable').html('');
            var bd={
                "cols":"b.area_id,b.book_id,b.book_code,b.address,b.countper_id,b.serviceper_id," +
                "ar.customer_code,ar.ctm_archive_id,ar.gas_type_id,ar.customer_name,ar.customer_address",
                "froms":"gas_ctm_archive ar left join gas_mrd_book b on b.book_id=ar.book_id ",
               // "wheres":"b.status='1' and ar.customer_state<>'99' " ,
                "wheres":"1=0",
                "page": "true",
                "limit":50
            }
            xw = XWATable.init({
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
                key_column:"ctmArchiveId",

                coldefs: [
                    {
                        col: "ctmArchiveId",
                        friendly: "客户档案ID",
                        unique: true,
                        hidden: true,
                        nonedit: "nosend",
                        readonly: "readonly",
                        sorting: false,
                        index: 1
                    },
                    {
                        col: "bookId",
                        friendly: "抄表本ID",
                        hidden: true,
                        nonedit: "nosend",
                        readonly: "readonly",
                        sorting: false,
                        index: 2
                    },
                    {
                        col: "bookCode",
                        friendly: "抄表本编号",
                        nonedit: "nosend",
                        readonly: "readonly",
                        sorting: false,
                        index: 3
                    }, {
                        col: "customerCode",
                        friendly: "客户编号",
                        nonedit: "nosend",
                        readonly: "readonly",
                        sorting: false,
                        index: 5
                    }, {
                        col: "customerName",
                        friendly: "客户名称",
                        nonedit: "nosend",
                        readonly: "readonly",
                        sorting: false,
                        index: 7
                    },
                    {
                        col: "customerAddress",
                        friendly: "客户地址",
                        nonedit: "nosend",
                        readonly: "readonly",
                        sorting: false,
                        index: 9
                    }, {
                        col: "address",
                        friendly: "抄表本地址",
                        nonedit: "nosend",
                        readonly: "readonly",
                        sorting: false,
                        index: 11
                    }, {
                        col: "areaId",
                        friendly: "供气区域",
                        format:GasModSys.areaFormat,
                        nonedit: "nosend",
                        readonly: "readonly",
                        sorting: false,
                        index: 13
                    },
                    {
                        col: "countperId",
                        friendly: "核算员 ",
                        format:GasModSys.employeeNameFormat,
                        nonedit: "nosend",
                        readonly: "readonly",
                        sorting: false,
                        index: 15
                    },
                    {
                        col: "serviceperId",
                        friendly: "客户服务员",
                        format:GasModSys.employeeNameFormat,
                        nonedit: "nosend",
                        readonly: "readonly",
                        sorting: false,
                        index: 17
                    }
                    /*{
                    	col:"tempnum",
                    	frinedly:"临时抄表计划条数",
                    	hidden:true,
                    	readonly:"readonly",
                    	format:GasModMrd.tempNumStateFormat,
                    	sorting:false,
                    	index:19
                    	
                    }*/

                ],
                //---------------查询时过滤条件
                findFilter:function(){
                    //var resUrl = "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=";
                    var whereinfo = "1=1 ";
                    if($('#find_areaId').val()){
                        whereinfo +=" and b.area_id='"+$('#find_areaId').val()+"' ";
                    }
                    if($('#find_countperId').val()){
                        whereinfo +=" and b.countperId='"+$('#find_countperId').val()+"' ";
                    }
                    if($('#find_serviceperId').val()){
                        whereinfo +=" and b.serviceperId='"+$('#find_serviceperId').val()+"' ";
                    }

                    if($('#book_code').val()){
                        whereinfo +=" and b.book_code='"+$('#book_code').val()+"' ";
                    }
                    if($('#customer_code').val()){
                        whereinfo +=" and ar.customer_code='"+$('#customer_code').val()+"'";
                    }
                    if($('#find_customer_state').val()){
                    	whereinfo += " and ar.customer_state='"+$('#find_customer_state').val()+"' ";
                    }
                    if($('#find_customer_kind').val()){
                    	whereinfo += " and ar.customer_kind='"+$('#find_customer_kind').val()+"' ";
                    }
                   var bd={
		                "cols":"b.area_id,b.book_id,b.book_code,b.address,b.countper_id,b.serviceper_id," +
		                "ar.customer_code,ar.ctm_archive_id,ar.gas_type_id,ar.customer_name,ar.customer_address",
		                "froms":"gas_ctm_archive ar left join gas_mrd_book b on b.book_id=ar.book_id ",
		               // "wheres":"b.status='1' and ar.customer_state<>'99' " ,
		                "wheres":whereinfo,
		                "page": true,
		                "limit":50
            		}
                    xw.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd="+encodeURIComponent(JSON.stringify(bd)));
                    return "";//filter.rql();
                    
                    
                }
            });
        },
        initBtn:function(){
        	
        	//查询btn
        	/*$('#find_button').on('click',function(e){
        		if()
        	})*/
;            
            $('#upda_button').on('click',function(e){//添加抄表计划
            	//判断 计划供气区域是否为空
            	if(!$('#plan_areaId').val()){
            		bootbox.alert("临时计划的供气区域不能为空，请选择【计划供气区域】");
            		return ;
            	}
            	//判断 计划核算员是否为空
            	if(!$('#plan_countperId').val()){
            		bootbox.alert("临时计划的核算员不能为空，请选择【计划核算员】");
            		return ;
            	}
            	//判断 计划客户服务员是否为空
            	if(!$('#plan_serviceperId').val()){
            		bootbox.alert("临时计划的客户服务员不能为空，请选择【计划客户服务员】");
            		return ;
            	}
            	//判断 临时抄表计划时间是否为空
            	if(!$('#find_start_month_date').val()){
            		bootbox.alert("临时计划时间不能为空，请选择【临时计划时间】");
            		return ;
            	}
            	
            	if(!$('#is_planforbook').val()){//选择是否按本生成
            		bootbox.alert("不确定是按本生成还是按户生成，请选择【是否按抄表本生成】");
            		return ;
            	}
            	/*if(!$('#temporary_type').val()){//计划抄表类型
            		bootbox.alert("临时抄表类型为空，请选择【临时抄表类型】");
            		return ;
            	}*/
            	//客户状态
            	if($("#customer_state input[name='c_checkbox']:checked").length == 0){
            		bootbox.alert("客户状态为空，请选择【客户状态】");
            		return ;
            	}
            	//if('#customer_state input')customer_state
            	//判断是按户生成还是按本生成
            	var tempdata = {
            		"areaid":$('#plan_areaId').val(),
            		"countperid":$('#plan_countperId').val(),
            		"serviceperid":$('#plan_serviceperId').val(),		
            		"copytime":$('#find_start_month_date').val(),
            		
            		"temporaryreason":($('temporaryplan_reason').val())?'':$('temporaryplan_reason').val(),
            		"temporarytype": '04'//临时抄表类型---顺价抄表
            	};//按本生成 的 ajaxdata
            	
            	
            	if($('#is_planforbook').val() == '1'){//按抄表本生成
            		//判断输入的 本编号是否为空
            		if(!$('#book_code').val()){
            			bootbox.alert("按本生成【抄表本编号】不能为空，请填写【抄表本编号】");
            			return ;
            		}
            		
            		//按本生成 -- 判断 生成临时抄表计划原因是否为 批量换表前抄表--暂时不校验
            		/*if($('#temporary_type').val()== '01'){//批量换表前抄表
            			//检测 选中日期 前30天是否有抄表计划
            			RQLBuilder.and({
            				RQLBuilder.equal("bookCode",$('#book_code').val()),
            				RQLBuilder.condition_fc("planCopyTime",)//抄表时间 为当前选中时间 moment().add(-30,d).format('YYYY-MM-DD 00:00:00')
            			})
            			
            			Restful.find(hzq_rest+"gasmrdmeterreading",);
            		}*/
             		
            		tempdata.plantype='b';
            		tempdata.bookcode=$('#book_code').val();
            		
            	}else if($('#is_planforbook').val() == '2'){//按户生成
            		var selrows = xw.getTable().getData(true);
			        if (selrows.rows.length == 0) {
			        	alert("添加抄表计划0");
			            bootbox.alert("<br><center><h4>请选择需要的行</h4></center><br>");
			            return;
			        }
	        		var batchids=new Array();
	        		$.each(selrows.rows,function(idx,row){
	        			batchids.push(row.ctmArchiveId);  	
	        		})
	        		tempdata.plantype='c';
	        		tempdata.ctmarchiveids = batchids.join();
            	}
            	
            	//客户状态
            	
            	var id_array=new Array();
				$('input[name="c_checkbox"]:checked').each(function(){
				    id_array.push($(this).attr("data-val"));//向数组中添加元素
				});
				var idstr=id_array.join(',');//将数组元素连接起来以构建一个字符串
				tempdata.customerstate=idstr;
				//alert(1);
				//alert(idstr);
            	
            	/*console.log(selected_customer_state);
            	//function fun(){
				    //obj = document.getElementsByName("test");
				    var selected_customer_state = $("#customer_state input[name='c_checkbox']");
				    check_val = [];
				    for(k in selected_customer_state){
				        if(selected_customer_state[k].is(":checked")){
				        	var customerstateobj = selected_customer_state[k];
				        	var customerstatelog = customerstateobj['data-val'];
				        	console.log(customerstatelog);
				        	console.log(customerstateobj);
				            check_val.push();
				        }
				    }
				    alert(check_val.join());*/
				//}
            	
            	
            	//选中的行--- 判断 	
            	$.ajax({         		
            		url:'hzqs/pla/pbtps.do?fh=TPSPLA0000000J00&resp=bd',
            		type:"POST",
            		data:JSON.stringify(tempdata),
            		dataType: 'json',
                	async: false,
                	contentType:"application/json; charset=utf-8;",
            		success:function(result){
            			if(result && result.err_code=='1'){//成功生成临时抄表计划
            				bootbox.alert("<br><center>临时抄表计划生成<h4>成功</h4></center><br>");
            				
			            	xw.autoResetSearch();
            			}else{
            				if(result.msg){
            					bootbox.alert("<br><center>临时抄表计划生成<h4>失败</h4>原因："+result.msg+"</center><br>");
			            		return;
            				}else{
            					bootbox.alert("<br><center>临时抄表计划生成<h4>失败</h4></center><br>");
			            		return;
            				}
            			}
            		},
            		error :function(){
            			bootbox.alert("<br><center>临时抄表计划生成<h4>失败</h4></center><br>");
			           	return;
            		}
            	});
            	//如果计划抄表类型为 批量换表抄表 --那么判断从选中时间开始前30天是否有抄表计划       	
            });
            //修改临时抄表计划时间
            $('#marka_button').on('click',function(e){//修改临时抄表计划时间
            	
            	if(!$('#find_start_month_date').val()){//目标时间
            		bootbox.alert("<br><center>请选择 【临时抄表时间】（用来确定目标时间）</center><br>");
			        return;
            	}
            	if(!$('#is_planforbook').val()){
            		bootbox.alert("<br><center>请选择 【是否按抄表本（生成、修改、删除）】</center><br>");
			        return;
            	}
            	if((!$('#find_start_date').val()) && (!$('#find_end_date').val())){
            		bootbox.alert("<br><center>请选择 【计划抄表时间】，用来确定需要的 已生成的临时抄表计划的计划时间范围。</center><br>");
			        return;
            	}
            	
            	//按本修改抄表计划时间
            	if($('#is_planforbook').val()){
            		console.log($('#is_planforbook').val());
					if($('#is_planforbook').val() == '1'){//按本修改抄表计划时间
						if(!$('#book_code').val()){
							bootbox.alert("<br><center>请填写抄表本编号</center><br>");
			        		return;
						}
					}else if($('#is_planforbook').val() == '2'){//按户 修改抄表计划时间
						var selrows = xw.getTable().getData(true);
				        if (selrows.rows.length == 0) {
				        	alert("修改："+1);
				            bootbox.alert("<br><center><h4>请选择需要修改的行。</h4></center><br>");
				            return;
				        }
		        		var batchids=new Array();
		        		$.each(selrows.rows,function(idx,row){
		        			batchids.push(row.ctmArchiveId);  	
		        		})
					}
            	}
            	
            	var tdata = {
            		"copytime":$('#find_start_month_date').val(),
            		"starttime":$('#find_start_date').val(),
            		"endtime":$('#find_end_date').val()
            	};
            	if($('#is_planforbook').val() == '1'){
					tdata.bookcode= $('#book_code').val();
					tdata.plantype = 'b';//按本修改抄表计划时间
					tdata.methodname = 'u';//更新临时抄表计划时间
				}else if($('#is_planforbook').val() == '2'){
					//tdata.bookcode= $('#book_code').val();
					tdata.ctmarchiveids = batchids.join();
					tdata.plantype = 'c';//按本修改抄表计划时间
					tdata.methodname = 'u';//更新临时抄表计划时间
				}
				$.ajax({
					dataType: 'json',
                    type: "PUT",
                    async: false,
                    url:'hzqs/pla/pbtpu.do?fh=TPUPLA0000000J00&resp=bd',
                    contentType:"application/json; charset=utf-8;",
					data:JSON.stringify(tdata),
					success:function(result1){
						if(result1 && result1.err_code=='1'){//成功生成临时抄表计划
            				bootbox.alert("<br><center>临时抄表计划修改<h4>成功</h4></center><br>");
			            	//xw.autoResetSearch();
            			}else{
            				if(result1.msg){
            					bootbox.alert("<br><center>临时抄表计划修改<h4>失败</h4>原因："+result1.msg+"</center><br>");
			            		return;
            				}else{
            					bootbox.alert("<br><center>临时抄表计划修改<h4>失败</h4></center><br>");
			            		return;
            				}
            			}
            		},
            		error :function(){
            			bootbox.alert("<br><center>临时抄表计划修改<h4>失败</h4></center><br>");
			           	return;
            		}
				});
            
            });
            //删除临时抄表计划
            $('#mrda_del_btm').on('click',function(e){//删除临时抄表计划
		       /*if(!$('#find_start_month_date').val()){//目标时间
            		bootbox.alert("<br><center>请选择 【临时抄表时间】（用来确定目标时间）</center><br>");
			        return;
            	}*/
            	/*var box = bootbox.confirm({
            		
            	});*/
            	if(confirm("确定删除吗？")==false){
            		return;
            	}
            	
            	if(!$('#is_planforbook').val()){
            		bootbox.alert("<br><center>请选择 【是否按抄表本（生成、修改、删除）】</center><br>");
			        return;
            	}
            	if((!$('#find_start_date').val()) && (!$('#find_end_date').val())){
            		bootbox.alert("<br><center>请选择 【计划抄表时间】，用来确定需要的 已生成的临时抄表计划的计划时间范围。</center><br>");
			        return;
            	}
            	
            	//按本删除抄表计划
            	if($('#is_planforbook').val()){
					if($('#is_planforbook').val() == '1'){//按本删除抄表计划
						if(!$('#book_code').val()){
							bootbox.alert("<br><center>请填写抄表本编号</center><br>");
			        		return;
						}
					}else if($('#is_planforbook').val() == '2'){//按户 修改抄表计划时间
						var selrows = xw.getTable().getData(true);
				        if (selrows.rows.length == 0) {
				        	alert("删除2");
				            bootbox.alert("<br><center><h4>请选择需要删除的行。</h4></center><br>");
				            return;
				        }
		        		var batchids=new Array();
		        		$.each(selrows.rows,function(idx,row){
		        			batchids.push(row.ctmArchiveId);  	
		        		})
					}
            	}
            	
            	var tdata = {
            		"copytime":$('#find_start_month_date').val(),
            		"starttime":$('#find_start_date').val(),
            		"endtime":$('#find_end_date').val()
            	};
            	if($('#is_planforbook').val() == '1'){
					tdata.bookcode= $('#book_code').val();
					tdata.plantype = 'b';
					tdata.methodname = 'd';
				}else if($('#is_planforbook').val() == '2'){
					tdata.ctmarchiveids = batchids.join();
					tdata.plantype = 'c';
					tdata.methodname = 'd';
				}
				$.ajax({
					dataType: 'json',
                    type: "PUT",
                    async: false,
                    url:'hzqs/pla/pbtpu.do?fh=TPUPLA0000000J00&resp=bd',
                    contentType:"application/json; charset=utf-8;",
					data:JSON.stringify(tdata),
					success:function(result1){
						if(result1 && result1.err_code=='1'){//成功删除临时抄表计划
            				bootbox.alert("<br><center>临时抄表计划删除<h4>成功</h4></center><br>");
			            	//xw.autoResetSearch();
            			}else{
            				if(result1.msg){
            					bootbox.alert("<br><center>临时抄表计划删除<h4>失败</h4>原因："+result1.msg+"</center><br>");
			            		return;
            				}else{
            					bootbox.alert("<br><center>临时抄表计划删除<h4>失败</h4></center><br>");
			            		return;
            				}
            			}
            		},
            		error :function(){
            			bootbox.alert("<br><center>临时抄表计划删除<h4>失败</h4></center><br>");
			           	return;
            		}
				});
            });
            
            $('#use_button').on('click',function(e){//临时抄表计划使用说明
            	bootbox.alert("生成临时抄表计划：必选;修改临时抄表计划时间：必选字段; 删除临时计划:必选字段;");
            });
            
            //初始化 -- 左右选择框
           
			//查询
			$('#find_button').on('click',function(e){
				var booksroctms = '';
				$("#searchable").html('');
				$(".ms2side__div").remove();
				//根据条件查询
				//根据
				var rows = '';
				if($('#is_planforbook').val()){//选择是是否按本生成抄表计划，才初始化方式二。
					if($('#is_planforbook').val() == '1'){//按本生成
					var filter = RQLBuilder.and([
						RQLBuilder.equal("areaId",$('#find_areaId').val()),
						RQLBuilder.equal("countperId",$('#find_countperId').val()),
						RQLBuilder.equal("serviceperId",$('#find_serviceperId').val()),
						RQLBuilder.equal("status","1")
						
					]);
					var rows = Restful.findNQ(hzq_rest + 'gasmrdbook?fields={"bookId":1,"bookCode":1,"address":1}&query='+filter.rql());
					if(rows){
						var bookhtml = '';
						console.log(rows);
						if(rows.length > 0){
							$.each(rows,function(idx,row){
								bookhtml +='<option id="'+row.bookId+'">'+row.bookCode+':'+row.address+'</option>';
							});
						}
						
                      	$("#searchable").append(bookhtml);
					}
				}else if($('#is_planforbook').val() == '2'){//按户生成
					/*var filter2 = RQLBuilder.and([
					 	RQLBuilder.equal("areaId"),
					 	RQLBuilder.equal(),
					 	RQLBuilder.equal(),
					 	RQLBuilder.equal()
				 	]);
					var rows = Restful.findNQ(hzq_rest+'gasctmarchive?fields={"ctmArchiveId":1,"customerCode":1,"customerName":1}&query='+filter2.rql());
					*/
					var wheresq = '';
					if($('#find_customer_state').val()){
						wheresq +=" and a.customer_state='"+$('#find_customer_state').val()+"' ";
					}
					var bd = {
						"cols":"a.ctm_archive_id,a.customer_code,a.customer_name",
						"froms":"gas_mrd_book b,gas_ctm_archive a",
						"wheres":" a.book_id=b.book_id and b.status='1' and a.customer_state<>'99' "+
						" and b.book_code='"+$('#book_code').val()+"' and b.area_id='"+$('#find_areaId').val()+"' "+
						"and b.countper_id='"+$('#find_countperId').val()+"' and b.serviceper_id='"+$('#find_serviceperId').val()+"' "+wheresq,
						"page":false
					}
					var burl= "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&bd="+encodeURIComponent(JSON.stringify(bd));
					var find_rows = Restful.findNQ(burl);
					if(find_rows && find_rows.rows ){
						var ctmhtml = ''
						var ctmrows = find_rows.rows;
						console.log(ctmrows);
						if(ctmrows.length > 0){
							$.each(ctmrows,function(idx,row){
								ctmhtml +='<option id="'+row.ctmArchiveId+'">'+row.customerCode+':'+row.customerName+'</option>'	
							});
						}
						$("#searchable").append(ctmhtml);
					}
				}
					
	              	$('#searchable').multiselect2side({
	                //  search: "待选区搜索：" ,
	                  selectedPosition: 'right',
	                  moveOptions: false,
	                  labelsx: '待选区',
	                  labeldx: '已选区'
	          		});
					$('#fun2_1').show();
					$('#fun2').show();
				}
			});
			
			/* $.ajax({
					//url:'/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00',
					url:rows,
	                dataType:'json',
	                type:'GET',
	                contentType:"application/json; charset=utf-8",
	                data:JSON.stringify(sql),
	                async:true,
	                success:function
				});*/
			//按方式二生成临时计划--顺价：
			
			$('#made_by2').on('click',function(e){
				//判断选择的是 按本生成还是按户生成
				var isbook = '';
				var fdata = {};
				if($('#is_planforbook').val()){
					if($('#is_planforbook').val() == '1'){//按抄表本生成
						isbook ='1';
						fdata.plantype='b';
					}else if ($('#is_planforbook').val() =='2'){//按 用户生成
						isbook ='2';
						fdata.plantype ='c';
					}
					
				}else{
					bootbox.alert("<br><center>请选择是否按本生成顺价抄表计划。</center><br>");
					return;
				}
				//获取已选区域的 bookid 和 ctmarchiveid
				//searchablems2side__dx
				var selectoptions = $('#searchablems2side__dx').find("option");
				console.log(selectoptions);
				console.log(typeof selectoptions);
				var ids = new Array();
				if(selectoptions && selectoptions.length>0){
					for(var i=0;i<selectoptions.length;i++){
						ids.push(selectoptions[i].id);
					}
				}
				if(!$('#plan_areaId').val()){
            		bootbox.alert("临时计划的供气区域不能为空，请选择【计划供气区域】");
            		return ;
            	}
            	//判断 计划核算员是否为空
            	if(!$('#plan_countperId').val()){
            		bootbox.alert("临时计划的核算员不能为空，请选择【计划核算员】");
            		return ;
            	}
            	//判断 计划客户服务员是否为空
            	if(!$('#plan_serviceperId').val()){
            		bootbox.alert("临时计划的客户服务员不能为空，请选择【计划客户服务员】");
            		return ;
            	}
            	//判断 临时抄表计划时间是否为空
            	if(!$('#find_start_month_date').val()){
            		bootbox.alert("临时计划时间不能为空，请选择【临时计划时间】");
            		return ;
            	}
            	if(!$('#is_planforbook').val()){//选择是否按本生成
            		bootbox.alert("不确定是按本生成还是按户生成，请选择【是否按抄表本生成】");
            		return ;
            	}
            	//客户状态
            	if($("#customer_state input[name='c_checkbox']:checked").length == 0){
            		bootbox.alert("客户状态为空，请选择【客户状态】");
            		return ;
            	}
            	//if('#customer_state input')customer_state
            	//判断是按户生成还是按本生成
            	fdata.areaid = $('#plan_areaId').val();
            	fdata.countperid = $('#plan_countperId').val();
            	fdata.serviceperid = $('#plan_serviceperId').val();
            	fdata.copytime = $('#find_start_month_date').val();
            	fdata.temporaryreason =($('temporaryplan_reason').val())?'':$('temporaryplan_reason').val();
            	fdata.temporarytype ='04';
            	/*var fdata = {
            		"areaid":$('#plan_areaId').val(),
            		"countperid":$('#plan_countperId').val(),
            		"serviceperid":$('#plan_serviceperId').val(),		
            		"copytime":$('#find_start_month_date').val(),
            		
            		"temporaryreason":($('temporaryplan_reason').val())?'':$('temporaryplan_reason').val(),
            		"temporarytype": '04'//临时抄表类型---顺价抄表
            	};//按本生成 的 ajaxdata*/
            	//客户状态
            	var id_array=new Array();
				$('input[name="c_checkbox"]:checked').each(function(){
				    id_array.push($(this).attr("data-val"));//向数组中添加元素
				});
				var idstr=id_array.join(',');//将数组元素连接起来以构建一个字符串
				fdata.customerstate=idstr;
				
				if(isbook == '1' ){
					//fdata.bookcodes = bookarr.join();
					fdata.bookids = ids.join();
				}else if(isbook =='2'){
					fdata.ctmarchiveids = ids.join();
				}
				console.log(ids);
				$.ajax({//用方式二生成计划
					url:'hzqs/pla/pbtbs.do?fh=TBSPLA0000000J00&resp=bd',
            		type:"POST",
            		data:JSON.stringify(fdata),
            		dataType: 'json',
                	async: false,
                	contentType:"application/json; charset=utf-8;",
            		success:function(result_2){
            			if(result_2 && result_2.err_code == '1'){
            				bootbox.alert("<br><center>顺价抄表计划生成<h4>成功</h4></center><br>");
			            	xw.autoResetSearch();
            			}else{
        					bootbox.alert("<br><center>顺价抄表计划生成<h4>失败</h4>，原因："+result_2.msg+"</center><br>");
		            		return;
            			}
            		},
            		error:function(){
            			bootbox.alert("<br><center>顺价抄表计划生成<h4>失败</h4></center><br>");
		            	return;
            		}
				});
			});
        },
    }

}();

