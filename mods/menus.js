var wondpwWidth = window.innerWidth;
var ss = false;
window.onresize = function(){
    wondpwWidth = window.innerWidth;
    if(wondpwWidth>992){
        $(".sub-menu").css({
            "display":"none"
        })
    }
}
$(".page-sidebar-menu.page-sidebar-menu-hover-submenu  li > a").on("click",menus)
function menus(){
    var wondpwWidth = window.innerWidth;
    if(wondpwWidth<992){
        if($(this).next().hasClass("sub-menu")){
            $(this).next(".sub-menu").css({
                "display":"block"
            })
            $(this).parent("li").siblings().find(".sub-menu").css("display","none")
        }
    }
     /* console.log(0)*/
}

