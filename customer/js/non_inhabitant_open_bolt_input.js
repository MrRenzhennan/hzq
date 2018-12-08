/**
 * Created by alex on 2017/4/7.
 */

SideBar.init();
SideBar.activeCurByPage("non_inhabitant_open_boltmanagement.html");

// var picture = $.md5(JSON.stringify(document.getElementById('form'))+ new Date().getTime())
// console.log(picture)
$(document).on("click", '.fileinput-upload-button', function () {
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




$("#unboltNo").on("blur",function () {
    if($(this).val()){
        var resss = Restful.findNQ(hzq_rest + 'gascsrunbolt/?query={"unboltNo":"'+$(this).val()+'"}')
        console.log(resss)
        if(resss.length>0 && resss[0].approveStatus !="3" ){
            bootbox.alert("<center><h4>您输入的开栓令编号已经存在，请更换编号。</h4></center>")
            $("#save_btn").attr("disabled",true)
        }else{
            $("#save_btn").attr("disabled",false)
        }
    }
})


$.each(GasModSys.areaHelper.getRawData(), function(idx, row) {
    $('#find_unit').append('<option value="'+row.areaId+'" name="'+row.areaId+'">'+row.areaName+'</option>');

});

var gasTypeHelper;
var GasChangeAction = function () {
    //用气类型
    gasTypeHelper = RefHelper.create({
        ref_url: "gasbizgastype/" + '?query={"parentTypeId":"3"}"',
        ref_col: "gasTypeId",
        ref_display: "gasTypeName"
    });
    var GasTypeFormat = function () {3
        return {
            f: function (val) {
                return gasTypeHelper.getDisplay(val);
            }
        }
    }();
    return {
        init: function () {
            this.initHelper();
            // this.reload();
        },
        initHelper: function () {
            // 用气性质select init
            //var projectType=GasCtmMan.projectTypeHelper.getData();
            $.each(gasTypeHelper.getData(),function(key,value){ //初始化 工程类别 下拉框
                $('#projectType').append('<option value="'+key+'">'+value+'</option>');
            });
            $.map(gasTypeHelper.getData(), function (value, key) {
                $('select[name="gasTypeId"]').append('<option value="' + key + '">' + value + '</option>');
            });

        }

    }

}();
$(function () {
    $('.file-loading').fileinput({
        language: 'zh'
    })
    $('#add_btn').click(function () {
        var item = "" +
            "<tr>" +
            "<td width='15px' class='remove_item'><span class='glyphicon glyphicon-remove'></span></td>" +
            "<td>" +
            "<select name='gasTypeId' class='form-control input-middle select2me' data-placeholder='选择用气类型..'>" +
            "<option value=''></option>" +
            "<option value=\"301\">商服</option>" +
            "<option value=\"302\">公益</option>" +
            "<option value=\"303\">锅炉</option>" +
            "<option value=\"304\">工业</option>" +
            "<option value=\"305\">福利</option>" +
            "<option value=\"306\">动力</option>" +
            "<option value=\"307\">养老机构</option>" +
            "<option value=\"308\">内部用气</option>"+
            "</select>" +
            "<span class='inputclear glyphicon glyphicon-remove-circle hide'></span>" +
            "</td>" +
            "<td><input type='number' name='capacity' class='form-control' placeholder='额定流量'></td>" +
            "<td><input type='number' name='mtrCount'class='form-control' placeholder='数量' readonly value='1'></td>" +
            "</tr>";
        $('#tbody').append(item);
        $('.remove_item').click(function () {
            $(this).parent().remove();
        });
        // $('select[name="gasTypeId"]').html("");
       /* $.map(gasTypeHelper.getData(), function (value, key) {
            $('select[name="gasTypeId"]').append('<option value="' + key + '">' + value + '</option>');
        });*/
    });
});
$("#save_btn").click("on", function () {

    // console.log($("#find_customerstate").val())

    if(!$("#unboltNo").val()){
        bootbox.alert("<center><h4>请输入开栓令编号。</h4></center>")
        return false;
    }
    if(!$("#addProjectNo").val()){
        bootbox.alert("<center><h4>请输入项目编号。</h4></center>")
        return false;
    }


    if(!$("#unboleType").val()){
        bootbox.alert("<center><h4>请选择开栓令类型。</h4></center>")
        return false;
    }

    // console.log("form:" + $.toJSON($("form").serializeObject()));
    var capacity = document.getElementsByName("capacity");
    var mtrCount = document.getElementsByName("mtrCount");
    var gastypeId = document.getElementsByName("gasTypeId");
    var boltdetails = new Array();
    var unboltJson = $("form").serializeObject();
    unboltId = $.md5(JSON.stringify($("form").serializeObject()) + new Date().getTime());
    unboltJson['unboltId'] = unboltId;
    if($("#find_customerstate").val()){
        unboltJson["projectType"] = $("#find_customerstate").val().join();
    }

    if(gpypictureIds){
        unboltJson["fileId"] = gpyphoto;
        // console.log(gpyphoto);
    }
    // console.log(unboltJson)
    unboltJson["operator"] = JSON.parse(localStorage.getItem('user_info')).userId;

    //格式化日期
    if (!unboltJson.projectDate) {
        unboltJson.projectDate = moment().format('YYYY-MM-DDTHH:mm:ss')
    } else {
        unboltJson.projectDate = moment(unboltJson.projectDate, "YYYY-MM-DD").format('YYYY-MM-DDTHH:mm:ss')
    }
    //流程的sql
    var flow_sql = new Array();
    var date = new Date()
    var rdid = [];
    // console.log(capacity)
    for (var i = 0; i < capacity.length; i++) {
        if (capacity[i].value && mtrCount[i].value && gastypeId[i].value) {
            var rsdtDetailId = $.md5($.md5(unboltId)+ Math.random() +new Date().getTime())
            rdid.push(rsdtDetailId);
            if($("#unboleType").val() =="1" || $("#unboleType").val() =="3" ){
                boltdetails.push({
                    "norsdtDetailId":rsdtDetailId,
                    "unboltId": unboltId,
                    "capacity": capacity[i].value, "mtrCount": mtrCount[i].value, "gasTypeId": gastypeId[i].value,
                    "createdTime":date,
                    "modifiedTime":date,
                    "isRel":"0"
                });
            }else{
                boltdetails.push({
                    "norsdtDetailId":rsdtDetailId,
                    "unboltId": unboltId,
                    "capacity": capacity[i].value, "mtrCount": mtrCount[i].value, "gasTypeId": gastypeId[i].value,
                    "createdTime":date,
                    "modifiedTime":date,
                    "isRel":"1"
                });
            }


            flow_sql.push({"fn":mtrCount[i].value,"rc":mtrCount[i].value,"cu":$("#find_countPer").val(),
                "su":$("#find_servicePer").val(),"bid":""+$.md5(unboltId+new Date().getTime()+i),
                "ai":$("#find_unit").val(),
                "bc":"000"+i,"bt":"9"});
            
            sumsti=false;

        }else{
            
            bootbox.alert("<center><h4>开栓令明细输入项不能为空。</h4></center>")
            return false;
        }
    }

    


    var submitJson = {
        "sets": [
            {"txid": "1", "body": unboltJson, "path": "/gascsrunbolt/", "method": "post"},
            {"txid": "2", "body": boltdetails, "path": "/gascsrunboltnorsdtdetail/", "method": "post"}
        ]
    }
    // console.log("submit::" + JSON.stringify(submitJson));
   var result = Restful.insert("/hzqs/dbc/pbtxs.do?fh=SELDBC0000000J00&resp=bd&retobj=1", submitJson)

    // console.log("submit:result:" + JSON.stringify(result));


    if(result.results[0]["result"]['success'] && result.results[1]["result"]['success']){

        flowjson = {"flow_def_id":"NR_PLKX","ref_no":unboltJson.unboltId,"operator":unboltJson.operator,"be_orgs":$("#find_unit").val(),
            "flow_inst_id":unboltId,
            "propstr2048":{"cusotmer":"BATCH","busitype":"非居民批量开栓"},
            "prop1str64":moment().format("YYYY-MM-DD HH:mm:ss"),
            "prop2str64":"非居民批量开栓",
            "propstr128":"营业部系统管理员",
            "propstr256":"0",
            "override_exists":false
        };
        // console.log(JSON.stringify(flowjson))
        var flow_result = Restful.insert("/hzqs/psm/pbisn.do?fh=VFLSCGC000000J00&bd={}&resp=bd",flowjson)

        // console.log("flow_result:"+JSON.stringify(flow_result));
        if(flow_result.retmsg == "SUCCESS:1"){
            bootbox.alert("提交成功",function(){
                window.location.href="customer/non_inhabitant_open_boltmanagement.html"
            });
        }else{
            var submitJson = {"sets":[
                {"txid":"1","body":unboltJson,"path":"/gascsrunbolt/"+unboltJson['unboltId'],"method":"delete"},
                {"txid":"2","body":boltdetails,"path":"/gascsrunboltnorsdtdetail/"+rdid.join(),"method":"delete"}
            ]}
            var result = Restful.insert("/hzqs/dbc/pbtxs.do?fh=SELDBC0000000J00&resp=bd&retobj=1",submitJson);
            // console.log(result)
            if(result.results[0]["result"]['success']){
                bootbox.alert("提交失败");
            }
        }

    }else if(result.success==false){
        bootbox.alert("提交失败");
    }

});
$('#cancel').click(function () {
    window.location = "customer/non_inhabitant_open_boltmanagement.html";
});