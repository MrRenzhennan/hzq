var SideBar = function() {
    return {
        init: function() {
            // 初始化用户名
		    var username = $.cookie('username');
		    $("#showloginname").html($.cookie('accountname'));
        }, //--End ofinit
        activeCurByPage: function(curpageName){
            console.log("activeCurByPage");
            var pages=window.location.pathname.split('/');
            var pageName=pages[pages.length-1];
            console.log("pages::"+pageName);
            if(curpageName){
                pageName=curpageName;//"inhabitant_archivemanagement.html";
            }

            if(pageName==""||pageName=="index.html"){ 
                var pp= $("#__sidebar>li.start");
                pp.addClass('active');
                pp.children('a').children('span.arrow').removeClass('arrow').addClass('selected')
                return;
            }
            $(".page-sidebar-menu .active").removeClass("active");
            var links = $("#__sidebar").find("a[href$='/"+pageName+"']");
            if(links){
                links.parent("li").addClass("active");
                var pp=links.parentsUntil('sub-menu').parent('li');
                pp.addClass('active')
                pp.children('a').children('span.arrow').removeClass('arrow').addClass('selected')
            }
        }
    };
}();

function btnOkFun(){
    console.log("ok");
    window.location = "/login.html";
}

function btnCloseFun(){
    console.log("close");
    window.opener = null;
    window.close();
    $('#checkbasic').modal('hide');
}