/**
 * Created by jack on 2017/3/13.
 */

ComponentsPickers.init();
SideBar.init();
SideBar.activeCurByPage("non_inhabitant_contractManagement.html");

var gasTypeHelper = RefHelper.create({
    ref_url: 'gasbizgastype?query={"parentTypeId":"1"}',
    ref_col: "gasTypeId",
    ref_display: "gasTypeName"
});
$.map(gasTypeHelper.getData(), function (value, key) {
    $('#gasType').append('<option value="' + key + '">' + value + '</option>');
});

var href = document.location.search;
console.log(href)
if(href != "") {
    $("#save_btn").click("on",function () {//点击的时候调用from表单序列化
        console.log("form:"+$.toJSON($("form").serializeObject()));
        $.ajax({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            url: hzq_rest + 'gasctmcontract',
            dataType: 'json',
            type: "PUT",
            data: $.toJSON($("form").serializeObject()),
            async: false
        })
            .done(function(data) {
                console.log(JSON.stringify(data))
                if(data.success){
                    //window.location = "customer/non_inhabitant_contract_input.html";
                    bootbox.alert("<br><center><h4>添加成功!!</h4></center><br>");
                }else{
                    bootbox.alert("<br><center><h4>添加失败!!</h4></center><br>");
                }
            })
            .error(function() {
                bootbox.alert("<br><center><h4>添加失败!!</h4></center><br>");

            });

    });
}else{
    console.log(0)
    $("#save_btn").click("on",function () {//点击的时候调用from表单序列化
        console.log("form:"+$.toJSON($("form").serializeObject()));

        for(var key in $("form").serializeObject()){
            if(!$("form").serializeObject()[key]){
                console.log(0)
                bootbox.alert("输入项不能为空！");
                return false;
            }
        }

        $.ajax({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            url: hzq_rest + 'gasctmcontract',
            dataType: 'json',
            type: "POST",
            data: $.toJSON($("form").serializeObject()),
            async: false
        })
            .done(function(data) {
                console.log(JSON.stringify(data))
                if(data.success){
                    //window.location = "customer/non_inhabitant_contract_input.html";
                    bootbox.alert("<br><center><h4>添加成功!!</h4></center><br>");
                }else{
                    bootbox.alert("<br><center><h4>添加失败!!</h4></center><br>");
                }
            })
            .error(function() {
                bootbox.alert("<br><center><h4>添加失败!!</h4></center><br>");

            });

    });
}

