/**
 * Created by Administrator on 2017/5/20 0020.
 */

SideBar.init();

var href = document.location.href;
var unboltId = href.split('?')[1];
noInhabitantOpenBoltDetailAction = function () {
    return {
        init: function () {

            this.findFilter()
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
                        url: hzq_rest + 'gascsrunbolt/' + unboltId,
                        dataType: 'json',
                        data: "",
                        success: function (data) {
                            var areaHelper=RefHelper.create({
                                ref_url:"gasbizarea",
                                ref_col:"areaId",
                                ref_display:"areaName",
                            });
                            console.log(data);
                            var json = eval(data);
                            $("#unbolt_no").val(json.unboltNo);
                            $("#project_no").val(json.projectNo);
                            var projectDate=json.projectDate
                            $("#project_date").val(projectDate.substring(0,10));
                            $("#project_name").val(json.projectName);
                            $("#find_area").val(areaHelper.getDisplay(json.areaId));
                            $("#link_man").val(json.linkMan);
                            $("#link_tel").val(json.linkTel);
                            $("#build_unit").val(json.buildUnit);
                            var projectType = json.projectType;
                            if (projectType == 1) {
                                $("#projectType").val("工业");
                            }
                            if (projectType == 2) {
                                $("#projectType").val("商服");
                            }
                            if (projectType == 3) {
                                $("#projectType").val("公益");
                            }
                            if (projectType == 4) {
                                $("#projectType").val("锅炉");
                            }
                            if (projectType == 5) {
                                $("#projectType").val("福利");
                            }
                            $("#project_address").val(json.projectAddress);
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
                        url: hzq_rest + 'gascsrunboltnorsdtdetail/?query={"unboltId":"' + unboltId + '"}',
                        dataType: 'json',
                        data: "",
                        success: function (data) {
                            var gasTypeHelper=RefHelper.create({
                                ref_url:"gasbizgastype",
                                ref_col:"gasTypeId",
                                ref_display:"gasTypeName"
                            });
                            console.log(data);
                            var json = eval(data);
                            var totalCount = 0;
                            var totalCapacity = 0;
                            for (var i = 0; i < json.length; i++) {
                                $('#unboltDetail').append('<tr>' +
                                    '<td>' + gasTypeHelper.getDisplay(json[i].gasTypeId) + '</td>' +
                                    '<td>' + json[i].capacity + '</td>' +
                                    '<td>' + json[i].mtrCount + '</td>' +
                                    // '<td>' + '<input type="text" class="form-control" placeholder="输入抄表本号">' + '</td>' +
                                    '</tr>'
                                );
                                totalCount += json[i].mtrCount;
                                totalCapacity += json[i].capacity;
                                $('#totalCapacity').text("总流量:" + totalCapacity);
                                $('#totalCount').text("总数量:" + totalCount);

                            }

                        }

                    }
                )
            });
        }
    }


}();
$('#cancel').click(function () {
    window.location = "customer/non_inhabitant_open_boltManagement.html";
});
