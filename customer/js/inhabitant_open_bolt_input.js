/**
 * Created by alex on 2017/3/10.
 */
ComponentsPickers.init();
SideBar.init();
SideBar.activeCurByPage("inhabitant_open_boltManagement.html");


function Audit(){
    window.location="customer/inhabitant_open_boltmanagement.html";
}


$.each(GasModSys.areaHelper.getRawData(), function(idx, row) {
    $('#find_unit').append('<option value="'+row.areaId+'" name="'+row.areaId+'">'+row.areaName+'</option>');
});


$("#unboltNo").on("blur",function () {
    if($(this).val()){
        var ressstatus =false;
        var resss = Restful.findNQ(hzq_rest + 'gascsrunbolt/?query={"unboltNo":"'+$(this).val()+'"}')
        console.log(resss)


        

        if(resss.length>0){


            $.each(resss,function(ind,item){
                if(item.approveStatus!="3"){
                    ressstatus = true;
                }else{
                    ressstatus=false;
                }
            })
            if(ressstatus){
                bootbox.alert("<center><h4>您输入的开栓令编号已经存在，请更换编号。</h4></center>")
                $("#save_btn").attr("disabled",true)
            }
           
        }else{
            $("#save_btn").attr("disabled",false)
        }
    }
})

// var picture = $.md5(JSON.stringify(document.getElementById('form'))+ new Date().getTime());

$(document).on("click", '.fileinput-upload-button', function (e) {
    e.preventDefault();
    var form = new FormData(document.getElementById('form'));
    console.log(form.get("files[]"));
    $.ajax({
        url: "/hzqs/sys/upload.do?busiId="+gpyphoto,
        data: form,
        dataType: 'text',
        processData: false,
        contentType: false,
        async: false,
        type: 'POST',
        success: function (data) {
            console.log(JSON.stringify(data));
            console.log(JSON.parse(data));

            if (JSON.parse(data).length != 0) {
                bootbox.alert('导入成功！');
                gpypictureIds = true;
            } else {
                bootbox.alert("导入失败！");
            }
        },
        error: function (data) {
            console.log(data);
            if(data.status == '413'){
                bootbox.alert("文件不能超过1M");
            }
            $("#fileId").val('');
        }
    });
});
// console.log(picture)
$("#save_btn").click("on",function () {

    if(!$("#unboltNo").val()){
        bootbox.alert("<center><h4>请输入开栓令编号。</h4></center>")
        return false;
    }
     if(!$("#addProjectNo").val()){
        bootbox.alert("<center><h4>请输入项目编号。</h4></center>")
        return false;
    }
    console.log("form:"+$.toJSON($("form").serializeObject()));
    var floornum=document.getElementsByName("floorNum");
    var roomcount=document.getElementsByName("roomCount");
    var boltdetails = new Array();
    var unboltJson = $("form").serializeObject();
    if(gpypictureIds){
        unboltJson["fileId"] = gpyphoto;
        console.log(gpyphoto);
    }
    console.log(unboltJson)
    unboltJson["operator"] = JSON.parse(localStorage.getItem('user_info')).userId;
    //生产UUID
    unboltId = $.md5(JSON.stringify($("form").serializeObject())+new Date().getTime());
    unboltJson['unboltId'] = unboltId;
    //格式化日期
    if(!unboltJson.projectDate){
        unboltJson.projectDate=moment().format('YYYY-MM-DDTHH:mm:ss')
    }else{
        unboltJson.projectDate=moment(unboltJson.projectDate,"YYYY-MM-DD").format('YYYY-MM-DDTHH:mm:ss')
    }
    //流程的sql
    var flow_sql = new Array();
    var rdid = [];
    for(var i=0;i<floornum.length;i++){
        if(floornum[i].value&&roomcount[i].value){
            if(floornum[i].value.indexOf(" ") != "-1"){
                bootbox.alert("输入框中不能有空格。");
                return ;
            }


            var rsdtDetailId = $.md5($.md5(unboltId)+ Math.random() +new Date().getTime())
            rdid.push(rsdtDetailId);
            boltdetails.push({
                "rsdtDetailId":rsdtDetailId,
                "unboltId":unboltId,
                "floorNum":floornum[i].value,
                "roomCount":roomcount[i].value
            });

            //"su":$("#find_servicePer").val(),"cu":$("#find_countPer").val(),"fn":floornum[i].value,
            flow_sql.push({"rc":roomcount[i].value,
                "bid":""+$.md5(unboltId+new Date().getTime()+i),
                "ai":$("#find_unit").val(),
                "bt":"1"
            });

        }else if(floornum[i].value)
        {
            bootbox.alert("楼号:"+floornum[i].value+",对应的房间号不能为空");
            return;
        }else{
            continue;
        }

    }
    if(!$("#find_oldnew").val()){
        bootbox.alert("<center><h4>请选择类型。</h4></center>")
        return false;
    }

    if(boltdetails.length == 0){
        bootbox.alert("<center><h4>输入项不能为空！</h4></center>");
        return false;
    }
    console.log("flow_sql=="+JSON.stringify(flow_sql));
    var submitJson = {"sets":[
        {"txid":"1","body":unboltJson,"path":"/gascsrunbolt/","method":"post"},
        {"txid":"2","body":boltdetails,"path":"/gascsrunboltrsdtdetail/","method":"post"}
        ]}
    console.log("submit::"+JSON.stringify(submitJson));
    var result = Restful.insert("/hzqs/dbc/pbtxs.do?fh=SELDBC0000000J00&resp=bd&retobj=1",submitJson)

    console.log("submit:result:"+JSON.stringify(result));
    if(result.results[0]["result"]['success']){
        flowjson = {"flow_def_id":"R_PLKX","ref_no":unboltJson.unboltId,"operator":JSON.parse(localStorage.getItem("user_info")).userId,"be_orgs":$("#find_unit").val(),
            "flow_inst_id":unboltId,
            "propstr2048":{"cusotmer":"BATCH","busitype":"批量开栓","oldornew":$("#find_oldnew").val()},
            "prop1str64":moment().format("YYYY-MM-DD HH:mm:ss"),
            "prop2str64":"批量开栓",
            "propstr128":"营业部系统管理员",
            "propstr256":flow_sql,
            "override_exists":false
        }

        console.log(flowjson)
        var flow_result = Restful.insert("/hzqs/psm/pbisn.do?fh=VFLSCGC000000J00&bd={}&resp=bd",flowjson);

        console.log("flow_result:"+JSON.stringify(flow_result));
        //"retmsg":""
        if(flow_result.retmsg=="SUCCESS:1"){
            bootbox.alert("提交成功",function () {
                window.location.href="customer/inhabitant_open_boltmanagement.html"
            });
        }else{
            var submitJson = {"sets":[
                {"txid":"1","body":unboltJson,"path":"/gascsrunbolt/"+unboltJson['unboltId'],"method":"delete"},
                {"txid":"2","body":boltdetails,"path":"/gascsrunboltrsdtdetail/"+rdid.join(),"method":"delete"}
            ]}
            var result = Restful.insert("/hzqs/dbc/pbtxs.do?fh=SELDBC0000000J00&resp=bd&retobj=1",submitJson);
            console.log(result)
            if(result.results[0]["result"]['success']){
                bootbox.alert("提交",function () {
                    window.location.href="customer/inhabitant_open_boltmanagement.html"
                });
            }
        }


    }else{
        bootbox.alert("提交失败");
    }


});


$(function () {
    $('.file-loading').fileinput({
        language: 'zh'
    })
    $('#add_btn').click(function () {
        var item = "" +
            "<tr>" +
            "<td width='15px' class='remove_item'><span class='glyphicon glyphicon-remove'></span></td>" +
            // "<td><input type='text' class='form-control' placeholder='地址'></td>" +
            "<td><input name='floorNum' type='text'  class='form-control' placeholder='楼号'></td>" +
            "<td><input name='roomCount' type='number' class='form-control' placeholder='户数'></td>" +
            "</tr>";
        $('#tbody').append(item);
        $('.remove_item').click(function () {
            $(this).parent().remove();
        });
    });
});


