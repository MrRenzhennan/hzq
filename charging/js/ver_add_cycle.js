/**
 * Created by anne on 2017/3/22.
 */


ComponentsPickers.init();

SideBar.init();
SideBar.activeCurByPage("gascost.html");

$('#cancel').click(function () {
    window.location = "../gascost.html";
});

var href = decodeURIComponent(document.location.href);
var gastypeId = href.split('?')[2];
var display_gastype =  href.split('?')[1];
$('#display_gastype').val(display_gastype);
$('#display_gastypeId').val(gastypeId);
$('#pricetype').val(href.split('?')[3]);
$('#gaskindid').val(href.split('?')[4]);



$("#save_btn").click("on",function () {
    console.log("form:"+$.toJSON($("form").serializeObject()));
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: hzq_rest + 'gasbllgasprice',
        dataType: 'json',
        type: "POST",
        data: $.toJSON($("form").serializeObject()),
        async: false,

    })
        .done(function(data) {
            if(data.success){
                bootbox.alert("<br><center><h4>添加成功!!</h4></center><br>");
            }else{
                bootbox.alert("<br><center><h4>添加失败!!</h4></center><br>");
            }
        })
        .error(function() {
            bootbox.alert("<br><center><h4>添加失败!!</h4></center><br>");

        });
});


