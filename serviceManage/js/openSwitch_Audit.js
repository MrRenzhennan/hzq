/**
 * Created by Alex on 2017/3/16.
 */
var openSwitch_AuditAction = function () {
    return {
        init: function () {
            this.showHuShu()
            this.selectMeterNo()
        },

        selectMeterNo: function () {
            /*$(function () {
                    $.ajax({
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        url: hzq_rest + "gasbizarea",
                        type: 'get',
                        dataType: 'json',
                        data: "",
                        error: function () {
                            alert('Error');
                        },
                        success: function (data) {
                            $("#areaId").empty();
                            $.each(eval(data), function (key, value) {
                                $('#areaId').append('<option value="' + data[key]["areaId"] + '">' + data[key]["areaName"] + '</option>');
                            });
                            //  loadCity($("#province").val());
                        }
                    });
                    $("#areaId").change(function () {
                        loadAccountingPerson($("#areaId").val());
                    });

                    function loadAccountingPerson(parentId) {
                        $.ajax({
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            // url: hzq_rest +'fcsysuser?query={"stationid":"1","areaId":"1"}',
                            url:hzq_rest+"gassysuser/"+'?query={"areaId":"'+parentId+'"}',
                            // url: hzq_rest+'fcsysuser?query={"areaId":'+parentid+"}",
                            //
                            type: 'get',
                            dataType: 'JSON',
                            data: "",
//                timeout: 5000,
                            error: function () {
                                alert('Error');
                            },
                            success: function (data) {

                                $("#accountingPerson").empty();
                                console.log(data);
                                $.each(eval(data), function (key, value) {
                                    $('#accountingPerson').append('<option value="' + data[key]["userId"] + '">' + data[key]["employeeName"] + '</option>');

                                });
                            }
                        });
                        $("#accountingPerson").change(function () {
                            // for(i=0;i<$('#personCount tr').length;i++){
                            //
                            //     Math.floor(Math.random()*100000)
                            // }
                        });
                    }
                }
            )*/
        },
        showHuShu: function () {
            $.ajax({
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                url: hzq_rest + "gascsrunboltrsdtdetail",
                type: 'get',
                dataType: 'json',
                data: "",
//            timeout: 5000,
                error: function () {
                    alert('Error');
                },
                success: function (data) {
                    var sum = 0;
                    do {
                        var meterNo = Math.floor(Math.random() * 1000000);
                    } while (meterNo < 100000);
                    $.each(eval(data), function (key) {
                        var floorNum = data[key]["floorNum"];
                        var roomCount = data[key]["roomCount"];
                        sum = sum + roomCount;
                        meterNo+=1;
                        $('#personCount').append('<tr>' +
                            '<td>' + floorNum + '</td>' +
                            '<td>' + roomCount + '</td>' +
                           /* '<td>' + meterNo + '</td>' +*/
                            '</tr>'
                        );
                    });
                    $('#sumPerson').html("总户数:" + sum);
                    //  loadCity($("#province").val());
                }
            });
        }
    }

}();

