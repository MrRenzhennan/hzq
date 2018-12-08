/**
 * Created by Administrator on 2017/8/26.
 */
ComponentsPickers.init();
var href = document.location.href;
var hrefValue = href.split("?");
var invoiceAccount = hrefValue[1];
var InUserId = JSON.parse(localStorage.getItem("user_info")).userId;
var userHelper = RefHelper.create({
    ref_url: 'gassysuser',
    ref_col: 'userId',
    ref_display: 'employeeName'
});
$('#invoiceAmount').val(invoiceAccount);
$('#inOperator').val(userHelper.getDisplay(InUserId));
$('#add_btn').click(function () {
    var item = "" +
        "<tr>" +
        "<td width='15px' class='remove_item'><span class='glyphicon glyphicon-remove'></span></td>" +
        // "<td><input type='text' class='form-control' placeholder='地址'></td>" +
        "<td><input name='boxNumber' type='text'  class='form-control' placeholder='箱号'></td>" +
        "<td><input id='startNumber' name='startNumber' type='text' class='form-control' placeholder='起始号'></td>" +
        "<td><input id='endNumber' name='endNumber' type='text'  class='form-control' placeholder='终止号'></td>" +
        "<td><input id='invoiceCount' name='invoiceCount' type='text' class='form-control' placeholder='份数'></td>" +
        "</tr>";
    $('#tbody').append(item);
    $('.remove_item').click(function () {
        $(this).parent().remove();
    });
});
$("#tab11").delegate("#endNumber", "focusout", function () {
    var $obj = $(this),
        $tr = $obj.closest("tr");
    var startNum = $tr.find('#startNumber').val();
    var endNum = $tr.find('#endNumber').val();
    var invoiceNum=parseInt(endNum)-parseInt(startNum)+parseInt(1);
    console.log(invoiceNum);
    $tr.find("#invoiceCount").attr("value", invoiceNum);

});
$("#tab11").delegate("#invoiceCount", "focus", function () {
    var $obj = $(this),
        $tr = $obj.closest("tr");
    var startNum = $tr.find('#startNumber').val();
    var endNum = $tr.find('#endNumber').val();
    if(!startNum){
        bootbox.alert("请先填写起始号");
        return;
    }else if(!endNum){
        bootbox.alert("请先填写终止号");
        return;
    }
});
$("#save_btn").click("on",function () {
    var boxnumber=document.getElementsByName("boxNumber");
    var startnumber=document.getElementsByName("startNumber");
    var endnumber=document.getElementsByName("endNumber");
    var invoicecount=document.getElementsByName("invoiceCount");
    var inDate=$('#inDate').val();
    var invoiceDetail = new Array();
    var result;
    for(var i=0;i<boxnumber.length;i++){
        if(boxnumber[i].value&&startnumber[i].value){
            var stockid = $.md5($.md5(startnumber[i].value)+ Math.random() +new Date().getTime());
            invoiceDetail.push({
                "stockId": stockid,
                "invoiceAmount": invoiceAccount,
                "boxNumber": boxnumber[i].value,
                "startNumber": startnumber[i].value,
                "endNumber": endnumber[i].value,
                "invoiceCount":invoicecount[i].value,
                "inOperator":InUserId,
                "inDate":inDate,
                "surplusCount":invoicecount[i].value,
                "reservedField2":"1"
            });
        }else if(boxnumber[i].value)
        {
            bootbox.alert("箱号:"+boxnumber[i].value+",对应的值不能为空");
            return;
        }else{
            continue;
        }
    }
    for(var i=0;i<invoiceDetail.length;i++){
        $.ajax({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            url: hzq_rest + "gaschgwasteinvoicestock",
            type: "POST",
            dataType: "json",
            async: false,
            data: JSON.stringify(invoiceDetail[i]),
            success: function (e) {
              if(e.success==true){
                  result=true;
              }
            }
        })
    }
    if(result==true){
        bootbox.alert("提交成功", function () {
            window.location.href="customer/garbage_bill/bill_query.html"
        });
    }
});