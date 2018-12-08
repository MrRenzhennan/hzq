/**
 * Created by Administrator on 2017/6/10 0010.
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
        console.log(data);
        if(data.reservedField2){
            pic(data.reservedField2)
        }else{
            $('.picture').attr("hidden", true);
        }
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


        if(data.activityInstanceId && data.contractState == "6"){
            $('.opinion').attr("hidden", false);
            var result = Restful.getByID(hzq_rest + "psmstepinst",data.activityInstanceId)
            console.log(result)
            $("#opinion_msg").html(result.propstr256);
            trialbatch();
        }else{
            $('.opinion').attr("hidden", true);
            modifycontract();
        }

    });

var busiId;

$(document).on("click", '.fileinput-upload-button', function (e) {
    e.preventDefault();
    busiId = $.md5(JSON.stringify(document.getElementById('form'))+ new Date().getTime())
    var form = new FormData(document.getElementById('form'));
    console.log(form.get("files[]"));
    $.ajax({
        url: "/hzqs/sys/upload.do?busiId="+busiId,
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





function modifycontract(){
    $('#form').on("submit", function (e) {
        e.preventDefault()
        // $('#ctmArchiveId').val(data.ctmArchiveId);
        var form = $('form').serializeObject();
        form["reservedField2"] = busiId;
        console.log(form)
        bootbox.confirm("确定提交？", function (result) {
            if (result) {
                $.ajax({
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    url: hzq_rest + 'gasctmcontract/'+contractId,
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
                return ;
            }
        });

    });
}
  //重新发起流成
function trialbatch(){
    $('#form').on("submit", function (e) {
        e.preventDefault();
        var contrac = $.md5(JSON.stringify($("form").serializeObject()) + new Date().getTime());
        console.log(contrac);
        var form = $('form').serializeObject();
        form["reservedField2"] = busiId;
        var Num = "";
        for (var i = 0; i < 6; i++) {
            Num += Math.floor(Math.random() * 10);
        }
        bootbox.confirm("确定提交？", function (result) {
            if (result) {
                $.ajax({
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    url: hzq_rest + 'gasctmcontract/' + contractId,
                    type: 'put',
                    data: $.toJSON(form),
                    async: false
                })
                    .done(function (data) {
                        if (data.success) {
                            console.log(data)
                            //var flow_sql = form;
                            console.log(form)
                            flowjson = {
                                "flow_def_id": "FJMHT",
                                "ref_no": contractId + Num,
                                "be_orgs": JSON.parse(localStorage.getItem("user_info")).area_id,
                                "operator": JSON.parse(localStorage.getItem("user_info")).userId,
                                "flow_inst_id": contractId + Num,
                                "propstr2048": {"cusotmer": "BATCH", "busitype": "非居民合同审批", "contractId": contractId},
                                "prop1str64": moment().format("YYYY-MM-DD HH:mm:ss"),
                                "prop2str64": "非居民合同",
                                "propstr128": "营业部",
                                // "propstr256":flow_sql,
                                "override_exists": false
                            }

                            var flow_result = Restful.insert("/hzqs/psm/pbisn.do?fh=VFLSCGC000000J00&bd={}&resp=bd", flowjson);

                            console.log("flow_result:" + JSON.stringify(flowjson));
                            console.log("flow_result:" + JSON.stringify(flow_result));
                            if (flow_result.retmsg == "SUCCESS:1") {
                                window.location.href = "customer/contract_noninhabitant.html"
                            } else {
                                var ss = Restful.delByIDR(hzq_rest + "gasctmcontract", data.contractId);
                                var ss1 = Restful.delByIDR("/hzqs/psm/pbisn.do?fh=VFLSCGC000000J00&bd={}&resp=bd", data.contractId);
                                console.log(ss)
                                console.log(ss1)
                            }
                        } else {
                            bootbox.alert("修改失败");
                        }
                    })
            } else {
                return;
            }
        });
    })
}