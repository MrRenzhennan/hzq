/**
 * Created by alex on 2017/5/25.
 */
SideBar.init();
SideBar.activeCurByPage("contract_noninhabitant.html");
ComponentsPickers.init();
$('.file-loading').fileinput({
    language: 'zh'
});
var gasTypeHelper = RefHelper.create({
    ref_url: "gasbizgastype/" + '?query={"parentTypeId":"2"}"',
    ref_col: "gasTypeId",
    ref_display: "gasTypeName"
});
$.map(gasTypeHelper.getData(), function (value, key) {
    $('#gasType').append('<option value="' + key + '">' + value + '</option>');
});
var href = document.location.href;
var queryArry = href.split("?");
var contractId = queryArry[1];
console.log(contractId)
$.ajax({
    url: hzq_rest + "gasctmcontract/" + contractId,
    type: "GET",
    dateType: "json"
})
    .done(function (data) {
       console.log(data)
        $('#picture').attr("hidden", true);
        $('input,textarea,select').each(function (index) {
            if($(this).attr("name") == 'agreement'){
                var select = $(this).find('option');
                for(var i=0;i<select.length;i++){
                    if(select.eq(i).val()== data[$(this).attr('name')]){
                        $(this).find('option').eq(i).attr("selected","selected");
                    }
                }
            }else if($(this).attr("name") == 'gasType'){
                console.log(data[$(this).attr('name')]);
                var select = $(this).find('option');
                for(var i=0;i<select.length;i++){
                    if(select.eq(i).val()== data[$(this).attr('name')]){
                        console.log(data[$(this).attr('name')]);
                        $(this).find('option').eq(i).attr("selected",true);
                    }
                }
            }else{
                $(this).val(data[$(this).attr('name')]);
            }
        });
        for (var i = 0; i < $('.time').length; i++) {
            console.log($('.time').eq(i).val())
            $('.time').eq(i).val($('.time').eq(i).val().split("T")[0]);
        }

        $('#save_btn').click("on", function () {
            $('#contractState').val("3");

            $('#ctmArchiveId').val(data.ctmArchiveId);
            var form = $('form').serializeObject();
            console.log(form)
            bootbox.confirm("确定提交？", function (result) {
                if (result) {
                    $.ajax({
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        url: hzq_rest + 'gasctmcontract/',
                        type: 'put',
                        data: $.toJSON(form),
                        async: false
                    })
                        .done(function (data) {
                            if (data.success) {
                                window.location.href = "customer/contract_noninhabitant.html"
                            } else {
                                bootbox.alert("失败");
                            }
                        })
                } else {

                }
            });

        });
    });
