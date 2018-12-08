/**
 * Created by alex on 2017/6/26.
 */
/**
 * Created by alex on 2017/3/14.
 */
SideBar.init();
var href = document.location.href;
var applyId = Metronic.getURLParameter("refno");
var stepid = Metronic.getURLParameter("stepid");
var direction = {
    "L": "左",
    "R": "右"
};
//规格型号
var meterSpecIdHelper = RefHelper.create({
    ref_url: 'gasmtrmeterspec',
    ref_col: 'meterModelId',
    ref_display: 'meterModelName'
});
if (stepid) {
    $("#delete").show();
    $("#agree").show();
    $("#opinion").show();
    SideBar.activeCurByPage();
} else {
    SideBar.activeCurByPage("inhabitant_open_boltManagement.html");
}
console.log("applyId=" + applyId)
var step_result;


outDepositoryApplyDetailAction = function () {
    return {
        init: function () {

            this.findFilter()

            // //获取流程任务
            // step_result = Restful.insert("/hzqs/psm/pbget.do?fh=VFLSCGC000000J00&bd={}&resp=bd", {
            //     "be_role": "YINGYEBU", "flow_inst_id": applyId, "step_status": "2",
            //     "do_operator": UserInfo.userId()
            // })
            // console.log("step_result==" + JSON.stringify(step_result) + "::" + step_result.rowcount)
            //
            // if (step_result.rowcount == 0) {
            //     step_result = Restful.insert("/hzqs/psm/pbget.do?fh=VFLSCGC000000J00&bd={}&resp=bd", {
            //         "be_role": "YINGYEBU", "flow_inst_id": applyId, "step_status": "1",
            //         "do_operator": UserInfo.userId()
            //     })
            // }
            // if (step_result.rowcount && step_result.rowcount == 1) {
            //
            // } else {
            //     if (Metronic.getURLParameter("stepid")) {
            //         console.log("未找到对应的审批流程");
            //         bootbox.alert("未找到对应的审批流程");
            //     }
            // }
            // http://localhost:8000/hzqs/psm/pbget.do?fh=VFLSCGC000000J00&bd={}&resp=bd

        },
        findFilter: function () {
            $(function () {
                $.ajax(
                    {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        type: 'get',
                        url: hzq_rest + 'gasmtrmeterapply/' + applyId,
                        dataType: 'json',
                        data: "",
                        success: function (data) {
                            var areaHelper = RefHelper.create({
                                ref_url: "gasbizarea",
                                ref_col: "areaId",
                                ref_display: "areaName",
                            });
                            console.log(data);
                            var json = eval(data);
                            $("#areaId").val(areaHelper.getDisplay(json.areaId));
                            $("#applyCode").val(json.applyCode);
                            $("#applyPerson").val(json.applyUserName);
                            var lastUseDate = json.lastUseDate;
                            if (lastUseDate) {
                                $("#lastUseDate").val(lastUseDate.substring(0, 10));
                            }
                            var sourceDepositoryHelper = RefHelper.create({
                                ref_url: "gasmtrdepository",
                                ref_col: 'depositoryId',
                                ref_display: 'depositoryName'
                            });
                            $("#sourceDepositoryId").val(sourceDepositoryHelper.getDisplay(json.sourceDepositoryId));
                            $("#remark").val(json.remark);
                            if (json.fileId) {
                                $("#picture").css("display", "block");
                                pic(json.fileId);
                            } else {
                                $("#picture").css("display", "none")
                            }

                        },
                        error: function (err) {
                            //console.log("error:"+JSON.stringify(err))
                            if (err.status == 401) {
                                //need to login
                                if (window.location.pathname.indexOf('/login.html') < 0) {
                                    window.location.replace("/login.html?redirect=" + window.location.pathname);
                                }

                            }

                        }
                    }
                )
                $.ajax(
                    {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        type: 'get',
                        url: hzq_rest + 'gasmtrmeterapplydetail/?query={"applyId":"' + applyId + '"}',
                        dataType: 'json',
                        data: "",
                        success: function (data) {
                            console.log(data);
                            var json = eval(data);
                            for (var i = 0; i < json.length; i++) {
                                $('#outDepositoryDetail').append('<tr>' +
                                    '<td>' + "" + '</td>' +
                                    '<td>' + meterTypeIdHelper.getDisplay(json[i].meterTypeId) + '</td>' +
                                    '<td>' + factoryHelper.getDisplay(json[i].factoryId) + '</td>' +
                                    '<td>' + meterSpecIdHelper.getDisplay(json[i].meterModelId) + '</td>' +
                                    '<td>' + direction[json[i].direction] + '</td>' +
                                    '<td>' + json[i].meterCount + '</td>' +
                                    '</tr>'
                                );
                            }
                        }
                    }
                )
            });
        }
    }
}();
var doBusi=function(step){
    var applyStateJson = {
        "applyId": applyId,
        "approveState": "2"
    };
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: hzq_rest + "gasmtrmeterapply/",
        type: "PUT",
        dataType: "json",
        async: false,
        data: JSON.stringify(applyStateJson),
        success: function (e) {
            console.log(e);
        }
    })
};
