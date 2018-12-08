/**
 * Created by alex on 2017/8/21.
 */
var href = document.location.href;
var applyId = Metronic.getURLParameter("refno");
var area_id = JSON.parse(localStorage.getItem("user_info")).area_id;
var syMeterNo = 0;
var targetDepositoryId;
//厂家Helper
var factoryHelper = RefHelper.create({
    ref_url: 'gasmtrfactory',
    ref_col: 'factoryId',
    ref_display: 'factoryName'
});
//表具规格型号
var meterSpecIdHelper = RefHelper.create({
    ref_url: 'gasmtrmeterspec',
    ref_col: 'meterModelId',
    ref_display: 'meterModelName'
});
//表具类型
var meterTypeIdHelper = RefHelper.create({
    ref_url: 'gasmtrmetertype',
    ref_col: 'meterTypeId',
    ref_display: 'meterTypeName'
});
var direction = {
    "L": "左",
    "R": "右"
};
$(document).ready(function () {
    $('#scanning_writeMod').on('shown.bs.modal', function (e) {
        $("#meterNo").focus().select();
    });
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: 'get',
        url: hzq_rest + 'gasmtrmeterapply/' + applyId + '',
        dataType: 'json',
        data: "",
        success: function (data) {
            targetDepositoryId=data.targetDepositoryId;
        }
    });
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: 'get',
        url: hzq_rest + 'gasmtrmeterapplydetail/?query={"applyId":"' + applyId + '"}',
        dataType: 'json',
        data: "",
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                var num = 0;
                var bd = {
                    "cols": "count(*) as num",
                    "froms": "gas_mtr_meter",
                    "wheres": "reserved_field2='" + data[i].applyDetailId + "'",
                    "page": false
                };
                console.log(JSON.stringify(bd));
                $.ajax({
                    type: 'get',
                    url: '/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd&bd=' + JSON.stringify(bd),
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8",
                    async: false,
                    success: function (data) {
                        if (data.rows) {
                            num = data.rows[0].num;
                        }
                    }
                });
                syMeterNo = data[i].meterCount - num;
                if (syMeterNo <= 0) {
                    $('#applyDetail').append('<tr>' +
                        '<td>' + '<input disabled  id="factoryId" type="text"  value="' + factoryHelper.getDisplay(data[i].factoryId) + '">' + '</td>' +
                        '<td>' + '<input disabled  id="meterModelId" type="text"  value="' + meterSpecIdHelper.getDisplay(data[i].meterModelId) + '">' + '</td>' +
                        '<td>' + '<input disabled  id="meterTypeId" type="text"  value="' + meterTypeIdHelper.getDisplay(data[i].meterTypeId) + '">' + '</td>' +
                        '<td>' + '<input disabled  id="direction" type="text"  value="' + direction[data[i].direction] + '">' + '</td>' +
                        '<td>' + '<input disabled id="meterCount" name="meterCount" type="text"  value="' + data[i].meterCount + '">' + '</td>' +
                        '<td>' + '<input disabled id="syMeterCount" name="syMeterCount" type="text"  value="' + syMeterNo + '">' + '</td>' +
                        // '<td>' + '<button id="inDepository" class="btn blue" data-target="#scanning_writeMod"data-toggle="modal">入库</button> ' + '</td>' +
                        "<td>" + '<input  id="applyDetailId" type="hidden" name="applyDetailId"  value="' + data[i].applyDetailId + '">' + "</td>" +
                        '</tr>'
                    );
                }
                else {
                    $('#applyDetail').append('<tr>' +
                        '<td>' + '<input disabled  id="factoryId" type="text"  value="' + factoryHelper.getDisplay(data[i].factoryId) + '">' + '</td>' +
                        '<td>' + '<input disabled  id="meterModelId" type="text"  value="' + meterSpecIdHelper.getDisplay(data[i].meterModelId) + '">' + '</td>' +
                        '<td>' + '<input disabled  id="meterTypeId" type="text"  value="' + meterTypeIdHelper.getDisplay(data[i].meterTypeId) + '">' + '</td>' +
                        '<td>' + '<input disabled  id="direction" type="text"  value="' + direction[data[i].direction] + '">' + '</td>' +
                        '<td>' + '<input disabled id="meterCount" type="text" name="meterCount"  value="' + data[i].meterCount + '">' + '</td>' +
                        '<td>' + '<input disabled id="syMeterCount" name="syMeterCount" type="text"  value="' + syMeterNo + '">' + '</td>' +
                        '<td>' + '<button id="inDepository" class="btn blue" data-target="#scanning_writeMod"data-toggle="modal">出库</button> ' + '</td>' +
                        "<td>" + '<input  id="applyDetailId" type="hidden" name="applyDetailId"  value="' + data[i].applyDetailId + '">' + "</td>" +
                        '</tr>'
                    );
                }
            }
        }
    });
});
// var meterInfoId = new Array();
var meterNo = new Array();
var applyDetailId
$('#scanning_writeMod').on('show.bs.modal', function (e) {
    $('#tbody').html("");
    console.log(e);
    applyDetailId = $(e.relatedTarget).closest("tr").find("td").find("#applyDetailId").val();
    var sy=$(e.relatedTarget).closest("tr").find("td").find("#syMeterCount").val();
    console.log(sy);
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: 'get',
        url: hzq_rest + 'gasmtrmeterapplydetail/' + applyDetailId,
        dataType: 'json',
        success: function (applyDetail) {
            // var meterCount = applyDetail.meterCount;
            var i = 0;
            document.onkeypress = function (e) {
                var code;
                if (!e) {
                    e = window.event;
                }
                if (e.keyCode) {
                    code = e.keyCode;
                }
                else if (e.which) {
                    code = e.which;
                }
                if (code == 13) {
                    console.log(i);
                    var meter = 0;
                    if (i < sy) {
                        var value = $("#meterNo").attr("value");
                        for (var m = 0; m < meterNo.length; m++) {
                            if (value == meterNo[m]) {
                                meter = 1;
                                break;
                            }
                        }
                        if (meter == 0) {
                            $.ajax({
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                type: 'get',
                                url: hzq_rest + 'gasmtrmeter/?query={"meterNo":"' + value + '"}',
                                dataType: 'json',
                                success: function (meterInfo) {
                                    console.log(meterInfo);
                                    if (meterInfo.length > 0) {
                                        if (meterInfo[0].factoryId == applyDetail.factoryId && meterInfo[0].meterModelId == applyDetail.meterModelId && meterInfo[0].meterTypeId == applyDetail.meterTypeId && meterInfo[0].direction == applyDetail.direction) {
                                            var productionDate = meterInfo[0].productionDate;
                                            var item = "" +
                                                "<tr>" +
                                                "<td>" + meterInfo[0].meterNo + "</td>" +
                                                "<td>" + meterTypeIdHelper.getDisplay(meterInfo[0].meterTypeId) + "</td>" +
                                                "<td>" + factoryHelper.getDisplay(meterInfo[0].factoryId) + "</td>" +
                                                "<td>" + meterSpecIdHelper.getDisplay(meterInfo[0].meterModelId) + "</td>" +
                                                "<td>" + direction[meterInfo[0].direction] + "</td>" +
                                                "<td>" + (productionDate ? productionDate.substring(0, 7) : "") + "</td>" +
                                                "<td>" + meterInfo[0].meterDigit + "</td>" +
                                                "<td>" + '<input style="text-align: right;" type="hidden"   name="meterId" class="form-control" value="' + meterInfo[0].meterId + '">' + "</td>" +
                                                // "<td>" + '<input style="text-align: right;" type="hidden"   name="applyDetailId" value="' + applyDetailId + '">' + "</td>" +
                                                "</tr>";
                                            $('#tbody').append(item);
                                            meterNo.push(meterInfo[0].meterNo);
                                            $('#meterNo').val("");
                                            i = i + 1;
                                            console.log(i);
                                        }
                                        // if (meter == 1)
                                        else {
                                            $('#meterNo').val("");

                                            bootbox.alert("<br><center><h4>扫描的表具与单据上的信息不符合</h4></center><br>");
                                        }
                                    }
                                }
                            });
                            return false;
                        } else {
                            $('#meterNo').val("");
                            $("#meterNo").focus();
                            bootbox.alert("<br><center><h4>您已经扫描过该表</h4></center><br>");
                            return false;
                        }
                    }
                    else {
                        bootbox.alert("<br><center><h4>您已经领取了该类型所有的表</h4></center><br>");
                        $('#meterNo').val("");
                        return false;
                    }
                }
            };
        }
    });
    $('#cancelId').click(function () {

    });
    $('#saveId').click(function () {
        // var $obj = $(e.relatedTarget),
        //     $tr = $obj.closest("tr");
        var meterInfoId = new Array();
        for (var i = 0; i < $('input[name="meterId"]').map(function () {
            return this.value
        }).get().length; i++) {
            meterInfoId.push($('input[name="meterId"]').map(function () {
                return this.value
            }).get()[i]);
        }
        console.log("applyDetailId11111111111111++++" + applyDetailId);
        var result = "";
        var stockState = new Array();
        var stockHistory = new Array();
        for (var i = 0; i < meterInfoId.length; i++) {
            stockState.push({
                "stockState": "3",
                "meterId": meterInfoId[i],
                "depositoryId": targetDepositoryId,
                "reservedField2": applyDetailId
            });
            stockHistory.push({
                "meterId": meterInfoId[i],
                "stockStatus": "3",
                "lastStockStatus": "1",
                "applyId": applyId,
                "areaId": area_id,
                "changeDate": moment().format('YYYY-MM-DDTHH:mm:ss'),
                "createdTime": moment().format('YYYY-MM-DDTHH:mm:ss'),
                "depositoryId": targetDepositoryId
            });
            console.log("stockState" + stockState);
            $.ajax({
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                url: hzq_rest + "gasmtrmeter/",
                type: "PUT",
                dataType: "json",
                async: false,
                data: JSON.stringify(stockState),
                success: function (e) {

                }
            });
            $.ajax({
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                url: hzq_rest + "gasmtrstockhistory",
                type: "POST",
                dataType: "json",
                async: false,
                data: JSON.stringify(stockHistory),
                success: function (e) {
                    result = e.success;
                }
            })
        }
        console.log(result);
        if(result==true){
            location.reload();
        }
        // var MeterNoCount = $(e.relatedTarget).closest("tr").find("td").find("#meterCount").val();
        // $(e.relatedTarget).closest("tr").find('input[name="meterCount"]').val();
        // console.log("MeterNoCount" + MeterNoCount)
        // var num = 0;
        // var bd = {
        //     "cols": "count(*) as num",
        //     "froms": "gas_mtr_meter",
        //     "wheres": "reserved_field2='" + applyDetailId + "'",
        //     "page": false
        // };
        // $.ajax({
        //     type: 'get',
        //     url: '/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd&bd=' + JSON.stringify(bd),
        //     dataType: 'json',
        //     contentType: "application/json; charset=utf-8",
        //     async: false,
        //     success: function (data) {
        //         if (data.rows) {
        //             num = data.rows[0].num;
        //         }
        //     }
        // });
        // var sy = MeterNoCount - num;
        // // $(e.relatedTarget).closest("tr").find('input[name="syMeterCount"]').val(sy);
        // console.log("sy" + sy)
        // $(e.relatedTarget).closest("tr").find("td").find("#syMeterCount").val(sy);
        // if (sy <= 0) {
        //     $(e.relatedTarget).attr({"disabled": "disabled"});
        // }
        // $(this).removeData("bs.modal");
    });
});

$('#scanning_writeMod').on('hide.bs.modal', function () {
    $(this).removeData("bs.modal");
});
$('#ok').click(function () {
    var flag = 1;
    $("input[name='syMeterCount']").each(
        function () {
            console.log("syMeterCount"+$(this).val());
            if ($(this).val() > 0) {
                flag = 0;
                return;
            }
        }
    )
    console.log(flag);
    if (flag == 1) {
        var useState = new Array();
        useState.push({"useState": "2", "applyId": applyId});
        $.ajax({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            url: hzq_rest + "gasmtrmeterapply/",
            type: "PUT",
            dataType: "json",
            async: false,
            data: JSON.stringify(useState),
            success: function (e) {
                if (e.success == true) {
                    window.location.href = "customer/dm/level2_out.html"
                    console.log(true);
                }
            }
        })
    } else {
        window.location.href = "customer/dm/level2_out.html"
        console.log(false);
    }

});