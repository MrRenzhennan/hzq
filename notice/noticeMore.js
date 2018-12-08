
var NoticeMore = function () {
	return {
		noticeView:$("#notice_view"),
    	mainView:$("#main_view"), 
		limit:20,
		skip:0,
		total:0,
		pageSize:0,
		currentPage:1,
		prevPage:$("#notice_more_prev"),
		nextPage:$("#notice_more_next"),
		noticePagin:$("#notice_pagin"),		
	    init: function () {
	    	dust.loadSource(dust.compile($("#__dust_newslist").html(),"news"));
	    	NoticeView.noticeViewCloseClick=this.noticeViewCloseClick;
	    	NoticeView.init();
	       	this.bind();
	       	this.reload();
	       	this.reloadTopNews();
	       	NoticeMore.setPaginInfo();
	    },
	    bind:function(){ 
	    	this.prevPage.on('click',this.prevPageClick);
	    	this.nextPage.on('click',this.nextPageClick);
	    },	    
	    reload:function(){
	    	var restURL = wpfrest + "fcnoticenew/queryLastNews";
            $.ajax({
                type: 'post',
                contentType: 'application/json; charset=utf-8',
                url: restURL,
                dataType: 'json',
                data:JSON.stringify({"skip":NoticeMore.skip,"limit":NoticeMore.limit}),
                async: false,
                success: function(data, textStatus, xhr) {
                    if(xhr.status == 200){
                   		var result=data.retObj;
                   		NoticeMore.pageSize=data.description;
                   		NoticeMore.total=data.retcode;

                      dust.render("news", {"data":result}, function(err, res) {
                         $("#_news").html(res);   
                        });
                   	
                    } else if(xhr.status == 403){
                         bootbox.alert("载入通知清單错误，请通知系统管理员");  
                    }
                },
                error: function(err) {
                    if(err.status == 403){
                         bootbox.alert("载入通知清單错误，请通知系统管理员");  
                    }
                }
            }); 
	    },
	    reloadTopNews:function(){ 
	    	var restURL = wpfrest + "fcnoticenew/queryLastNews";
            $.ajax({
                type: 'post',
                contentType: 'application/json; charset=utf-8',
                url: restURL,
                dataType: 'json',
                data:JSON.stringify({"skip":0,"limit":5}),
                async: false,
                success: function(data, textStatus, xhr) {
                    if(xhr.status == 200){
                   		var result=data.retObj;                   		
                      	NoticeView.setTopNews(result);
                   	
                    } else if(xhr.status == 403){
                         bootbox.alert("载入通知清單错误，请通知系统管理员");  
                    }
                },
                error: function(err) {
                    if(err.status == 403){
                         bootbox.alert("载入通知清單错误，请通知系统管理员");  
                    }
                }
            }); 
	    },
	    noticeViewCloseClick:function(){ 
			NoticeMore.noticeView.fadeOut(500,'swing');
        	NoticeMore.mainView.delay(300).fadeIn(1000);
        },
        prevPageClick:function(){ 
        	NoticeMore.currentPage=NoticeMore.currentPage-1;
        	if(NoticeMore.currentPage >=1){ 
	        	NoticeMore.skip=NoticeMore.skip-NoticeMore.limit;
	        	NoticeMore.reload();
	        	NoticeMore.setPaginInfo();
		    }else{ 
		    	NoticeMore.currentPage=1;
		     }
        },
        nextPageClick:function(){ 
        	NoticeMore.currentPage=NoticeMore.currentPage+1;
        	if(NoticeMore.currentPage <=NoticeMore.pageSize) {
	        	NoticeMore.skip=NoticeMore.skip+NoticeMore.limit;
	        	NoticeMore.reload();
	       		NoticeMore.setPaginInfo();
    		}else{ 
    			NoticeMore.currentPage=NoticeMore.pageSize;
    		}
        },
        setPaginInfo:function(){ 
        	var lastIndex=NoticeMore.skip+NoticeMore.limit;
	       	if(lastIndex >= NoticeMore.total) lastIndex=NoticeMore.total
	       	NoticeMore.noticePagin.html((NoticeMore.skip+1)+"-"+lastIndex+" of "+NoticeMore.total);
        },
	    showNews:function(noticeId){    
        	NoticeView.loadNoticeData(noticeId);
        	NoticeMore.mainView.fadeOut(500,'swing');
        	NoticeMore.noticeView.delay(300).fadeIn(1000);
        }
	};
}();
