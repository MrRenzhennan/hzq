
var NoticeView = function () {
	return {
		noticeViewTitle:$("#notice_view_title"), 
    	noticeViewContent:$("#notice_view_content"),
    	noticeViewClose:$("#notice_view_close"), 
    	noticeViewType:$("#notice_view_type"), 
    	noticeViewTime:$("#notice_view_time"),
    	topNews:$("#_topNews"), 
    	noticeTopViewColor:["green","yellow","red","blue","purple"],
    	noticeViewCloseClick:null,
	    init: function () {
	    	dust.loadSource(dust.compile($("#__dust_topNewslist").html(),"_dust_topNews"));  
	    	this.bind();
	    },	    
	    bind:function(){ 
	    	this.noticeViewClose.on('click',this.noticeViewCloseClick);
	    },
	    setTopNews:function(source){ 
	    	var data=[];
            for(var i=0;i<source.length;++i){
                if(i==5) break;
                var news=source[i];
                news.color=NoticeView.noticeTopViewColor[i]
                data.push(news);
			}
            dust.render("_dust_topNews", {"data":data}, function(err, res) {
                NoticeView.topNews.html(res);   
            });
	    },
	    loadNoticeData:function(noticeId){ 
	    	var restURL = "../../json/notice/notice.json";
            $.ajax({
                type: 'get',
                url: restURL,
                dataType: 'json',
                data:{"key":noticeId},
                async: false,
                success: function(data, textStatus, xhr) {
                    if(xhr.status == 200){
	                   	if(data.success==true){ 
	                   		var result=data.retObj;
	                   		NoticeView.noticeViewTitle.html(result.noticeTitle)
	                   		NoticeView.noticeViewContent.html(result.noticeContent);
	                   		NoticeView.noticeViewType.html(result.noticeTypeName)
	                   		NoticeView.noticeViewTime.html(result.showStartTime)
	                   	}
                    } else if(xhr.status == 403){
                       bootbox.alert("载入通知內文错误，请通知系统管理员");    
                    }
                },
                error: function(err) {
                    bootbox.alert("载入通知內文错误，请通知系统管理员");    
                }
            });
	    }
	};
}();
