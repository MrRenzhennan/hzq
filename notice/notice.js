var Notice = function () {
	var NoticeStatus=function(){ 
		return {
		        f: function(val,row){    
		        	if(row.status==1)    	
		            	return '<span class="label label-primary">已发布</span>';
		        	else
		        		return '<span class="label label-danger">未发布</span>';
		        }
		    }
	}();
	var NoticeAction=function(){ 
			return {
			        f: function(val,row){        	
			            return "<button type='button' class='btn btn-sm yellow' onclick='Notice.updatebtnClick(\""+row.noticeId+"\")'>修改</button>";
			        }
			    }
	}();
	return {
		noticeInsertOrUpdate:$("#notice_insert_update"),
		noticeList:$("#notice_list"),
		noticeView:$("#notice_view"),
		addbtn:$("#addbtn"),
		noticeCancelBtn:$("#notice_cancel"),
		noticeUpdateBtn:$("#notice_update"),	
		noticeInsertBtn:$("#notice_insert"),
		noticeIUtitleTxt:$("#notice_title"),
		noticeIUpstatusCk:$("#notice_status"),
		noticeIUshowTimeTxt:$("#notice_show_time"),
		noticeIUendTimeTxt:$("#notice_end_time"),
		noticeListTitleTxt:$("#notice_list_title"),	
		noticeIUtypeSel:$("#notice_iu_type"),	
		noticeListtypeSel:$("#notice_list_type"),		
		noticeIUid:$("#notice_id"),	
		noticeIUstatus:false,
		noticetable:null,
	    init: function () {
	    	dust.loadSource(dust.compile($("#__dust_iu_noticeType").html(),"iuNoticeType"));
	    	dust.loadSource(dust.compile($("#__dust_list_noticeType").html(),"listNoticeType"));
	    	this.initDatetimepicker();
	    	this.initNoticeType();
	    	this.reload();
	       	this.bind();
	    },
	    initDatetimepicker:function(){
	    	if (jQuery().datetimepicker) {
	            $(".form_datetime").datetimepicker({
	            autoclose: true,
	            isRTL: Metronic.isRTL(),
	            format: "yyyy-mm-dd hh:ii",
	            pickerPosition: (Metronic.isRTL() ? "bottom-right" : "bottom-left")
       		 });
        	} 
	    },
	    initNoticeType:function(){ 
	    	var restURL = wpfrest + "fcnoticetype/queryAll";
	    	$.ajax({
				type : 'Get',
				url : restURL,
				dataType : 'json',				
				cache : false,
				async : true,
				success : function(data, textStatus, xhr) {
					if(data.success==true){ 
						var result =data.retObj;
						dust.render("iuNoticeType", { "data":result}, function(err, out) { 							
							Notice.noticeIUtypeSel.append(out);			
						});
						 dust.render("listNoticeType", { "data":result}, function(err, out) { 							
							Notice.noticeListtypeSel.append(out);			
						});
					}else{ 
						bootbox.alert("载入通知类型错误，请通知系统管理员");    
					}
				},
				error : function(err) {
					bootbox.alert("载入通知类型错误，请通知系统管理员");    
				}
			});
	    },	    
	    bind:function(){ 
	    	this.addbtn.on('click',this.addbtnClick);
	    	this.noticeCancelBtn.on('click',this.noticeCancelBtnClick);
	    	this.noticeInsertBtn.on('click',this.noticeInsertBtnClick);
	    	this.noticeUpdateBtn.on('click',this.noticeUpdateBtnClick);
	    	this.noticeIUpstatusCk.on('ifChecked', function(event){
			  Notice.noticeIUstatus=true;
			});
	    	this.noticeIUpstatusCk.on('ifUnchecked', function(event){
			  Notice.noticeIUstatus=false;
			});
	    },
	    addbtnClick:function(){
	    	Notice.resetInsertOrUpdateView();
	    	Notice.noticeUpdateBtn.css('display','none');
	    	Notice.noticeInsertBtn.css('display','inline-block');
	    	Notice.noticeList.fadeOut(500,'swing');
	    	Notice.noticeInsertOrUpdate.delay(500).fadeIn(1000);
	    },
	    updatebtnClick:function(noticeId){	    	
	    	Notice.loadNoticeData(noticeId);
	    	Notice.noticeUpdateBtn.css('display','inline-block');
	    	Notice.noticeInsertBtn.css('display','none');
	    	Notice.noticeList.fadeOut(500,'swing');
	    	Notice.noticeInsertOrUpdate.delay(500).fadeIn(1000);
	    },	    
	    noticeCancelBtnClick:function(){
	    	Notice.noticeInsertOrUpdate.fadeOut(500,'swing');
	    	Notice.noticeList.delay(500).fadeIn(1000);
	    },
	    reload:function(){ 
	    	$('#divtable1').html('');
	        this.noticetable=XWATable.init(
        	{
		        divname: "divtable1", 

		        //----------------table的选项-------
		        pageSize:20,               //Initial pagesize
		        pageSizes:[20,30, 50,100], 
		        columnPicker: false,         //Show the columnPicker button
		        transition: 'fade',  //(bounce, fade, flip, rotate, scroll, slide).		          
		        //----------------基本restful地址---
		        restbase: wpfrest+'fcnoticenew/queryByPar?noticeTypeId='+Notice.noticeListtypeSel.val()+'&noticeTitle='+escape(escape(Notice.noticeListTitleTxt.val())),
		        hidePagerOnEmpty: true, //removes pager if no rows: false,
		        coldefs:[	                        
		                    {
		                        col:"noticeTypeName",
		                        friendly: "类别名称",
		                        sorting:false
		                    },
		                    {
		                        col:"noticeTitle",
		                        friendly: "新闻标题",
		                        sorting:false
		                    },
		                    {
		                        col:"status",
		                        friendly: "状态",
		                        sorting:false,
		                        format: NoticeStatus		                       
		                    },
		                    { 
		                        col:"noticeId",
		                        friendly: "修改",
		                        sorting:false,
		                        format: NoticeAction
		                    }		                       
		                ],
                findFilter: function(){ 
               	 Notice.noticetable.setRestURL( wpfrest+'fcnoticenew/queryByPar?noticeTypeId='+Notice.noticeListtypeSel.val()+'&noticeTitle='+escape(escape(Notice.noticeListTitleTxt.val())));

                
                var filter=RQLBuilder.and([
                        
                    ]);
                return filter.rql();
            },

		    }) //--init
	    },
	    resetInsertOrUpdateView:function(){ 
	    	Notice.noticeIUtitleTxt.val('');
	    	Notice.noticeIUpstatusCk.iCheck('uncheck');
	    	Notice.noticeIUshowTimeTxt.val('');
	    	Notice.noticeIUendTimeTxt.val('');
	    	Notice.noticeIUid.val('');
	    	CKEDITOR.instances.noticeContent.setData('');
	    	$('.Metronic-alerts').remove();
	    },	    
	    loadNoticeData:function(noticeId){ 
	    	$('.Metronic-alerts').remove();
	    	var restURL = wpfrest + "fcnoticenew/queryNewByKey";
            $.ajax({
                type: 'post',
                url: restURL,
                dataType: 'json',
                data:{"key":noticeId},
                async: false,
                success: function(data, textStatus, xhr) {
                    if(xhr.status == 200){
	                   	if(data.success==true){ 
	                   		var result=data.retObj;
	                   		Notice.noticeIUtypeSel.val(result.noticeTypeId);
	                   		Notice.noticeIUtitleTxt.val(result.noticeTitle);
					    	Notice.noticeIUpstatusCk.iCheck((result.status==1)?'check':'uncheck');
					    	Notice.noticeIUshowTimeTxt.val(result.showStartTime);
					    	Notice.noticeIUendTimeTxt.val(result.showEndTime);
					    	Notice.noticeIUid.val(result.noticeId);
					    	CKEDITOR.instances.noticeContent.setData(result.noticeContent);
	                   	}
                    } else if(xhr.status == 403){
                       bootbox.alert("载入通知內文错误，请通知系统管理员");    
                    }
                },
                error: function(err) {
                    bootbox.alert("载入通知內文错误，请通知系统管理员");    
                }
            });
	    },
	    resetListView:function(){ 
	    	Notice.noticeListTitleTxt.val('');
	    },
	    noticeInsertBtnClick:function(){ 
	    	if(Notice.isValidate()==false)return;
	    	$('.Metronic-alerts').remove();
	    	var restURL = wpfrest + "fcnoticenew";
	    	$.ajax({
				contentType: 'application/json; charset=utf-8',
				type : 'post',
				url : restURL,
				dataType : 'json',
				data:Notice.createJsonData(),				
				cache : false,
				async : true,
				success : function(data, textStatus, xhr) {
					if(data.success==true){
						var result=data.retObj;
						Notice.noticeIUid.val(result.noticeId); 
						Notice.noticeUpdateBtn.css('display','inline-block');
	    				Notice.noticeInsertBtn.css('display','none');
	    				Notice.showToastr("新增成功");
						Notice.noticetable.autoResetSearch();
					}else{ 
						   Notice.showToastr("新增失败");
					}
				},
				error : function(err) {
					 Notice.showToastr("新增失败");
				}
			});
	    },
	    noticeUpdateBtnClick:function(){ 
	    	if(Notice.isValidate()==false)return;
	    	$('.Metronic-alerts').remove();
	    	var restURL = wpfrest + "fcnoticenew/"+Notice.noticeIUid.val();
	    	$.ajax({
				contentType: 'application/json; charset=utf-8 ',
				type : 'put',
				url : restURL,
				dataType : 'json',
				data:Notice.createJsonData(),				
				cache : false,
				async : true,
				success : function(data, textStatus, xhr) {
					if(data.success==true){
						var result=data.retObj;
						Notice.noticeIUid.val(result.noticeId); 
						Notice.noticeUpdateBtn.css('display','inline-block');
	    				Notice.noticeInsertBtn.css('display','none');
	    				Notice.showToastr("更新成功");
	    				Notice.noticetable.autoResetSearch();
					}else{ 
						  Notice.showToastr("更新失败");
					}
				},
				error : function(err) {
					 Notice.showToastr("更新失败");
				}
			});
	    },	    
	    createJsonData:function(){ 
	    	
	    	return JSON.stringify({	 "noticeTitle":Notice.noticeIUtitleTxt.val(),
									 "noticeContent":CKEDITOR.instances.noticeContent.getData(),
									 "noticeTypeId":Notice.noticeIUtypeSel.val(),
									 "showStartTime":new Date(Notice.noticeIUshowTimeTxt.val()),
									 "showEndTime":new Date(Notice.noticeIUendTimeTxt.val()),
									 "status": (Notice.noticeIUstatus==true)?1:0})
	    },
	    isValidate:function(){ 
	    	var showStartTime=new Date(Notice.noticeIUshowTimeTxt.val());
	    	var showEndTime=new Date(Notice.noticeIUendTimeTxt.val());
	    	if(Notice.noticeIUtitleTxt.val()==''){ 
	    		Notice.showAlert("讯息标题,请勿空白");
	    		return false;
	    	}else if(Notice.noticeIUshowTimeTxt.val()==''){ 
	    		Notice.showAlert("开始时间,请勿空白");
	    		return false;
	    	}else if(Notice.noticeIUendTimeTxt.val()==''){ 
	    		Notice.showAlert("结束时间,请勿空白");
	    		return false;
	    	}else if(CKEDITOR.instances.noticeContent.getData()==''){ 
	    		Notice.showAlert("讯息内文,请勿空白");
	    		return false;
	    	}	    	
	    	else if(showStartTime >= showEndTime){ 
	    		Notice.showAlert("开始时间不能大于或等于结束时间");
	    		return false;
	    	}
	    	return true;
	    },
	    showToastr:function(msg){ 
				toastr.options = {
				  "closeButton": true,
				  "debug": false,
				  "positionClass": "toast-bottom-right",
				  "onclick": null,
				  "showDuration": "1000",
				  "hideDuration": "1000",
				  "timeOut": "5000",
				  "extendedTimeOut": "1000",
				  "showEasing": "swing",
				  "hideEasing": "linear",
				  "showMethod": "fadeIn",
				  "hideMethod": "fadeOut"
				}
				toastr["info"](msg, "Information");
		},
		showAlert:function(msg){ 
			Metronic.alert({
               container:'#notice_msg',// alerts parent container(by default placed after the page breadcrumbs)
                place:'prepend', // append or prepent in container 
                type: 'danger',  // alert's type
                message:msg,  // alert's message
                close: false, // make alert closable  
                reset: true,         
                cssStyle:'padding: 5px;margin-bottom: 10px;color:#C0334A',
                icon: 'none' // put icon before the message
            });	    	
		}
	};
}();
