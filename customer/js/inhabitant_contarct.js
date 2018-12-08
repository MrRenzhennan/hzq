/**
 * Created by jack on 3/16/17.
 */


ComponentsPickers.init();
SideBar.init();
SideBar.activeCurByPage("non_inhabitant_contractManagement.html");

var href = document.location.href;
var contractid = href.substring(href.indexOf("?")+1, href.lenth);

$('.contractId').val(archiveid);

$.ajax({
    url:hzq_rest + "gasctmcontract/"+contractid,
    type:"GET",
    dateType:"json",
})
    .done(function (data) {
//                console.log(data.rows[0]);
//                $.each(data.rows[0],function (name, value) {
//                    console.log('the name is : ' + name + '; and the value is : ' + value);
//                });
        $('input, textarea').each(function (index) {
            if(data.rows[0].hasOwnProperty($(this).attr('name'))){
                $(this).val(data.rows[0][$(this).attr('name')]);
            }
        });
    });


$('#add_contract').click("on",function () {
    console.log('form' + $.toJSON($('form').serializeObject()));
    $.ajax({
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url:hzq_rest + 'gasctmcontractmeter',
        type:'POST',
        data:$.toJSON($('form').serializeObject()),
        async:false
    })
        .done(function (data) {
            if(data.success){
                bootbox.alert("成功");
                location.reload();
            }else{
                bootbox.alert("失败");
            }
        })
});

$('#add_meter').click("on",function () {
    console.log('form' + $.toJSON($('form').serializeObject()));
    $.ajax({
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url:hzq_rest + 'gasctmmeter',
        type:'POST',
        data:$.toJSON($('form').serializeObject()),
        async:false
    })
        .done(function (data) {
            if(data.success){
                bootbox.alert("成功");
                location.reload();
            }else{
                bootbox.alert("失败")
            }
        })
});

var meterIdHelper = RefHelper.create({
    ref_url:"gasmtrmeter",
    ref_col:"meterId",
    ref_display:"meterId"
});

var contractHelper = RefHelper.create({
    ref_url:"gasctmcontract",
    ref_col:"contractId",
    ref_display:"contractId"
});

$.map(meterIdHelper.getData(),function (value, key) {
    $('#meter_select').append('<option value="' + key + '">' + key + '</option>');
});

$.map(contractHelper.getData(),function (value, key) {
    $('#contract_select').append('<option value="' + key + '">' + key + '</option>');
});