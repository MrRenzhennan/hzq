/**
 * Created by Administrator on 2017/6/5 0005.
 */
SideBar.init();
SideBar.activeCurByPage("contract_noninhabitant.html");
/*$('input').attr("disabled", "disabled");*/

var href = document.location.href;
/*  var contractId = href.substring(href.indexOf("?") + 1, href.lenth);
 var href = document.location.href;*/
var contractId = Metronic.getURLParameter("refno");
var stepid = Metronic.getURLParameter("stepid");
$("input").attr("readonly","readonly");

console.log(stepid)
console.log(contractId)
console.log($('.time').length);
$('.contractId').val(contractId);



var GasModCtm = function () {

    var contractStatus = {"0": "预签", "1": "新签", "2": "正常", "3": "即将到期", "4": "到期", "5": "过期","6":"续签","7":"作废","8":"增减容"};
    return {
        contractStatusFormat:function (val) {
                return contractStatus[val];
        },
        init: function (xwajson) {

        }
    }
}();



$.ajax({
    url: hzq_rest + "gasctmcontract/" + contractId,
    type: "GET",
    dateType: "json"
})
    .done(function (data) {
        console.log(data);
        $('input, textarea').each(function (index) {
            console.log($(this).attr("placeholder"))
            $(this).attr("name")
            if (data.hasOwnProperty($(this).attr('name'))) {
                $(this).val(data[$(this).attr('name')]);
            }
        });
        var gastypeHelper = RefHelper.create({
            ref_url: "gasbizgastype",
            ref_col: "gasTypeId",
            ref_display: "gasTypeName",
        });
        // $("#contractState").val("已生效");
        if(data.contractState){
            $("#contractState").val(GasModCtm.contractStatusFormat(data.contractState))
        }

        $("#gasType").val(gastypeHelper.getDisplay(data.gasType));
        if (data.agreement === "0") {
            $("#agreement").val("有");
        }
        else if (data.agreement === "1") {
            $("#agreement").val("无");
        }

        if(data.contractType == '1'){
            $("#contractType").val("居民")
        }else if(data.contractType == '9'){
            $("#contractType").val("非居民")
        }
        console.log(data.customerType)
        if(data.customerType == 'I'){
            $("#customerType").val("IC卡表")
        }else if(data.customerType == 'P'){
            $("#customerType").val("普表")
        }

        for (var i = 0; i < $('.time').length; i++) {
            console.log($('.time').eq(i).val())
            $('.time').eq(i).val($('.time').eq(i).val().split("T")[0])
        }
        console.log(data.reservedField2)
        if(data.reservedField2){
            pic(data.reservedField2)
        }


    });