
var areaId = JSON.parse(localStorage.getItem("user_info")).area_id;
var userId = JSON.parse(localStorage.getItem("user_info")).userId;
GasModSys.areaList({
    "areaId":"1",
    "cb":function(data){
        console.log(data)
        $.each(data,function(key,val){
            if(val.areaId!= "1"){
                $('#movebefore').append('<option value="' + val.areaId + '">' + val.areaName + '</option>');
                if(val.areaId == areaId){
                    $('#moveafter').append('<option value="' + val.areaId + '">' + val.areaName + '</option>');
                }
            }
            
        })
    }
});

var areaHelper = RefHelper.create({
    ref_url: 'gasbizarea?query={"status":"1"}',
    ref_col: "areaId",
    sort:"posCode",
    ref_display: "areaName",
});

// $.map(areaHelper.getData(), function (value, key) {
//     // $('#moveafter').append('<option value="' + key + '">' + value + '</option>');
//     if(key != "1"){
//         $('#movebefore').append('<option value="' + key + '">' + value + '</option>');
//     }
    
// });



$("#moveafter").val(areaId).trigger("change");


//表厂家Helper
var factoryHelper = RefHelper.create({
    ref_url: 'gasmtrfactory',
    ref_col: 'factoryId',
    ref_display: 'factoryName'
});
//表具规格型号Helper
var meterModelHelper = RefHelper.create({
    ref_url: 'gasmtrmeterspec',
    ref_col: 'meterModelId',
    ref_display: 'meterModelName'
});

$.map(factoryHelper.getData(), function (value, key) {
    $('select[name="factoryId"]').append('<option value="' + key + '">' + value + '</option>');
});
$.map(meterModelHelper.getData(), function (value, key) {
    $('select[name="meterModelId"]').append('<option value="' + key + '">' + value + '</option>');
});
$(function () {
    
    $('#add_btn').click(function () {
        console.log("safdsa")
        var item = "" +
            "<tr>" +
            "<td width='15px' class='remove_item'><span class='glyphicon glyphicon-remove'></span></td>" +
            "<td>" +
            "<select name='factoryId' class='form-control input-middle select2me' data-placeholder='生产厂家..'>" +
            "<option value=''></option>" +
            "</select>" +
            "<span class='inputclear glyphicon glyphicon-remove-circle hide'></span>" +
            "</td>" +
            "<td>" +
            "<select name='meterModelId' class='form-control input-middle select2me' data-placeholder='规格型号..'>" +
            "<option value=''></option>" +
            "</select>" +
            "<span class='inputclear glyphicon glyphicon-remove-circle hide'></span>" +
            "</td>" +
            "<td>" +
            "<select name='direction' class='form-control input-middle select2me' data-placeholder='进气方向..'>" +
            "<option value=''></option>" +
            "<option value='L'>左</option>" +
            "<option value='R'>右</option>" +
            "</select>" +
            "<span class='inputclear glyphicon glyphicon-remove-circle hide'></span>" +
            "</td>" +
            "<td><input type='number' name='meterCount'class='form-control' placeholder='数量'></td>" +
            "</tr>";
        $('#tbody').append(item);
        $('.remove_item').click(function () {
            $(this).parent().remove();
        });
        $.map(factoryHelper.getData(), function (value, key) {
            $('select[name="factoryId"]').append('<option value="' + key + '">' + value + '</option>');
        });
        $.map(meterModelHelper.getData(), function (value, key) {
            $('select[name="meterModelId"]').append('<option value="' + key + '">' + value + '</option>');
        });
    });
});



$("#save_btn").on("click",function(){
    if(!$('#movebefore').val()){
        bootbox.alert("请选择提供方。",function(){
            
        })
        return;
    }
    if(!$('#moveafter').val()){
        bootbox.alert("请选择借用方。")
        return;
    }
    var submit={
        "moveBefore":$('#movebefore').val(),
        "moveAfter":$('#moveafter').val(),
        "remark":$("#remark").val(),
        "status":"0"
    }

    var moveParam=[];
    var styless = false;
    $("#tbody").find("tr").each(function(){
        var tdArr = $(this).children();
        if(tdArr.eq(1).find("select").val()&&tdArr.eq(2).find("select").val()&&tdArr.eq(3).find("select").val()&&tdArr.eq(4).find("input").val()){
            moveParam.push({
                "factoryId":tdArr.eq(1).find("select").val(),//生产厂家
                "meterModelId":tdArr.eq(2).find("select").val(),//规格型号
                "direction":tdArr.eq(3).find("select").val(),//近气方向
                "count":tdArr.eq(4).find("input").val(),//数量
    
            })
            styless = false;
        }else{
            styless = true;
            return;
        }
        
    });
    if(styless){
        bootbox.alert("<center><h4>输入项不能为空。</h4></center>")
        return;
    }

    submit["moveParam"]=JSON.stringify(moveParam);
    submit["createdBy"] = userId;
    submit["createdTime"] = new Date(new Date()+"-00:00");

    console.log(JSON.stringify(submit))
    var result =  Restful.insert(hzq_rest+"gasmtrmetermove",submit)
    console.log(result)

    if(result.success){
        bootbox.alert("<h3><center>申请成功。</center></h3>",function(){
            window.location.href='metermanage/warehouse_management.html';
            // history.go("-1")
        })
    }else{
        bootbox.alert("<h3><center>申请失败。</center></h3>",function(){
            window.location.href='metermanage/warehouse_management.html';
        })
    }



})



$("#cancel").on("click",function(){
    history.go("-1");
})