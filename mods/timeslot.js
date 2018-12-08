/**
 * Created by Administrator on 2017/5/19 0019.
 */


$("#chosedate button").on('click',function(){
    $(this).addClass("blue")
    $(this).parent('div').siblings().find("button").removeClass('blue');
})

function date_format(date, fmt) {
    var dataJson = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in dataJson)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (dataJson[k]) : (("00" + dataJson[k]).substr(("" + dataJson[k]).length)));
    return fmt;
}
//当日
$("#find_today_sign").click(function(){
    $("#find_start_date").val(date_format(new Date(),"yyyy-MM-dd"));
    $("#find_end_date").val(date_format(new Date(),"yyyy-MM-dd"));
});
//近一周
$("#find_this_week_sign").click(function(){
    var date = new Date();
    $("#find_end_date").val(date_format(date,"yyyy-MM-dd"));
    date.setDate(date.getDate()-6);
    $("#find_start_date").val(date_format(date,"yyyy-MM-dd"));
});
// 近一月
$("#find_this_month_sign").click(function(){
    var date = new Date();
    $("#find_end_date").val(date_format(date,"yyyy-MM-dd"));
    date.setMonth(date.getMonth()-1);
    date.setDate(date.getDate()+1);
    $("#find_start_date").val(date_format(date,"yyyy-MM-dd"));
});
// 近三月
$("#find_three_month_sign").click(function(){
    var date = new Date();
    $("#find_end_date").val(date_format(date,"yyyy-MM-dd"));
    date.setMonth(date.getMonth()-3);
    date.setDate(date.getDate()+1);
    $("#find_start_date").val(date_format(date,"yyyy-MM-dd"));
});
// 近一年
$("#find_this_year_sign").click(function(){
    var date = new Date();
    $("#find_end_date").val(date_format(date,"yyyy-MM-dd"));
    date.setMonth(date.getMonth()-12);
    date.setDate(date.getDate()+1);
    $("#find_start_date").val(date_format(date,"yyyy-MM-dd"));

});
// 不限
$("#find_anyway_sign").click(function(){
    $("#find_start_date").val("");
    $("#find_end_date").val("");
});
$("#find_today_sign1").click(function(){
    $("#find_start_date1").val(date_format(new Date(),"yyyy-MM-dd"));
    $("#find_end_date1").val(date_format(new Date(),"yyyy-MM-dd"));
});
//近一周
$("#find_this_week_sign1").click(function(){
    var date = new Date();
    $("#find_end_date1").val(date_format(date,"yyyy-MM-dd"));
    date.setDate(date.getDate()-6);
    $("#find_start_date1").val(date_format(date,"yyyy-MM-dd"));
});
// 近一月
$("#find_this_month_sign1").click(function(){
    var date = new Date();
    $("#find_end_date1").val(date_format(date,"yyyy-MM-dd"));
    date.setMonth(date.getMonth()-1);
    date.setDate(date.getDate()+1);
    $("#find_start_date1").val(date_format(date,"yyyy-MM-dd"));
});
// 近三月
$("#find_three_month_sign1").click(function(){
    var date = new Date();
    $("#find_end_date1").val(date_format(date,"yyyy-MM-dd"));
    date.setMonth(date.getMonth()-3);
    date.setDate(date.getDate()+1);
    $("#find_start_date1").val(date_format(date,"yyyy-MM-dd"));
});
// 近一年
$("#find_this_year_sign1").click(function(){
    var date = new Date();
    $("#find_end_date1").val(date_format(date,"yyyy-MM-dd"));
    date.setMonth(date.getMonth()-12);
    date.setDate(date.getDate()+1);
    $("#find_start_date1").val(date_format(date,"yyyy-MM-dd"));

});
// 不限
$("#find_anyway_sign1").click(function(){
    $("#find_start_date1").val("");
    $("#find_end_date1").val("");
});