
var AccountMonthOutAction = function () {

    var xw;
    var gasType1DataLength = 0;
    var gasType2DataLength = 0;
    var gasType3DataLength = 0;
    var gasType2DataArray = [];
    var gasType3DataArray = [];
    var percentageFormat = function () {
        return {
            f: function (val, row) {
                var percentageStr;
                var p = Math.round((row.successOfAccont / row.numberOfAccont) * 10000) / 100;
                if (p == 100) {
                    percentageStr = '<div class="progress" style="margin-bottom:0"><div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="' + p + '" aria-valuemin="0" aria-valuemax="100" style="min-width: 2em;width: ' + p + '%">' + p + '%</div></div>';
                } else if (p < 50) {
                    percentageStr = $('<div class="progress" style="margin-bottom:0"><div class="progress-bar progress-bar-danger" role="progressbar" aria-valuenow="' + p + '" aria-valuemin="0" aria-valuemax="100" style="min-width: 2em;width: ' + p + '%">' + p + '%</div></div>');
                    // setInterval(function () {
                    //     refreshPercentage(row.icChargeLogId, percentageStr);
                    // }, 10000);
                } else {
                    percentageStr = $('<div class="progress" style="margin-bottom:0"><div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="' + p + '" aria-valuemin="0" aria-valuemax="100" style="min-width: 2em;width: ' + p + '%">' + p + '%</div></div>');
                }
                return percentageStr;
            }
        }
    }();
    var refreshPercentage = function (icChargeLogId, container) {
        $.ajax({
            url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            type: "POST",
            data: JSON.stringify({
                cols: "a.numberOfAccont, a.successOfAccont",
                froms: "gasActIcChargeLog a",
                wheres: "a.icChargeLogId = '" + icChargeLogId + "'",
                page: "false",
                limit: 1
            }),
            success: function (data) {
                if (data && data.rows) {
                    var p = Math.round((data.rows[0].successOfAccont / data.rows[0].numberOfAccont) * 10000) / 100;
                    container.find("div[aria-valuenow]").attr("aria-valuenow", p);
                    container.find("div[aria-valuenow]").css("width:" + p + "px");
                    container.find("div[aria-valuenow]").html(p + "%");
                }
            },
            error: function () {
            }
        });
    };
    var openButton = function () {
        return {
            f: function (val, row) {
                var icChargeLogId = row['icChargeLogId'];
                return '<a onclick=\"retry(\'' + row["icChargeLogId"] + '\')"><span class="fa fa-refresh"></span>&nbsp;重试</a>';
            }
        }
    }();

    return {
        init: function () {
            this.initHelper();
            this.reload();
            this.initPage();
            setInterval(this.refresh, 10000);
        },

        refresh: function () {
            // window.location.reload();
            $('#divtable').html('');
            AccountMonthOutAction.reload();
        },



        initHelper: function () {

            // 供气区域 select init
            $.map(GasModSys.areaHelper.getData(), function (value, key) {
                $('#find_areaId').append('<option value="' + key + '">' + value + '</option>');
            });

            $('#find_areaId').on('change', function (e) {
                GasModSys.counterUsersInArea({
                    "areaId": $('#find_areaId').val(),
                    "cb": function (data) {
                        console.log('the areaiddata is ;;;', data);
                        var inhtml = "<option value=''>全部</option>";
                        $.each(data, function (idx, row) {
                            inhtml += '<option value="' + row.userId + '">' + row.employeeName + '</option>';
                            console.log('the inhtml is :::', inhtml);
                        })
                        $("#find_countperId").html(inhtml);
                        $("#find_countperId").val("").change();

                    }
                })
                //xw.autoResetSearch();
            })

            $('#find_countperId').on('change', function (e) {
                GasModSys.copyUsersInArea({
                    "areaId": $('#find_areaId').val(),
                    "countperId": $('#find_countperId').val(),
                    "cb": function (data) {
                        var inhtml = "<option value=''>全部</option>";
                        if (data) {
                            $.each(data, function (idx, row) {
                                inhtml += '<option value="' + row.userId + '">' + row.employeeName + '</option>';
                            })
                        }
                        $("#find_serviceperId").html(inhtml);
                        $("#find_serviceperId").val("").change();

                    }
                })
                //xw.autoResetSearch();
            });

            $('#find_serviceperId').on('change', function (e) {
                GasModMrd.bookInService({
                    "areaId": $("#find_areaId").val(),
                    "countperId": $('#find_countperId').val(),
                    "serviceperId": $('#find_serviceperId').val(),
                    "cb": function (data) {
                        var inhtml = "<option value=''>全部</option>";
                        if (data) {
                            $.each(data, function (inx, row) {
                                inhtml += '<option value="' + row.bookId + '">' + row.bookCode + ':' + row.address + '</option>'
                            })
                        }
                        $("#find_bookId").html(inhtml);
                        $("#find_bookId").val("").change();
                    }
                });
                //$('#find_bookId').val("").change();
                //xw.autoResetSearch();
            });

            /*************用气性质级联开始*************/
            var gasType1Helper = RefHelper.create({
                ref_url: "gasbizgastype?query={\"parentTypeId\":\"1\"}",
                ref_col: "gasTypeId",
                ref_display: "gasTypeName",
            });

            $.map(gasType1Helper.getData(), function (value, key) {
                gasType1DataLength += 1;
                $('#gasType1').append('<option value="' + key + '">' + value + '</option>');
            });

            // console.log('the gasType3 length is ::: ', $('#gasType3 option').size());

            $('#gasType1').on("change", function () {
                var gasType2Helper = RefHelper.create({
                    ref_url: 'gasbizgastype?query={"parentTypeId":' + $('#gasType1').val() + '}',
                    ref_col: "gasTypeId",
                    ref_display: "gasTypeName",
                });

                gasType2DataLength = 0;
                gasType2DataArray = [];
                gasType3DataArray = [];
                $.map(gasType2Helper.getData(), function (value, key) {
                    gasType2DataArray.push(key);
                    gasType2DataLength = gasType2DataLength + 1;
                })

                if (gasType2DataLength > 0) {//如果根据一级查出数据，则二级显示，并赋值
                    $('#gasType2Div').removeClass('hide');
                    initSelect('gasType2');

                    if (!$('#gasType3Div').hasClass('hide')) $('#gasType3Div').addClass('hide')
                    initSelect('gasType3')

                    $.map(gasType2Helper.getData(), function (value, key) {
                        $('#gasType2').append('<option value="' + key + '">' + value + '</option>');
                    });
                } else {
                    if (!$('#gasType2Div').hasClass('hide')) $('#gasType2Div').addClass('hide')
                    initSelect('gasType2');

                    if (!$('#gasType3Div').hasClass('hide')) $('#gasType3Div').addClass('hide')
                    initSelect('gasType3');
                }
            });

            $('#gasType2').on("change", function () {
                var gasType3Helper = RefHelper.create({
                    ref_url: 'gasbizgastype?query={"parentTypeId":' + $('#gasType2').val() + '}',
                    ref_col: "gasTypeId",
                    ref_display: "gasTypeName",
                });

                gasType3DataLength = 0;
                gasType3DataArray = [];
                $.map(gasType3Helper.getData(), function (value, key) {
                    gasType3DataArray.push(key);
                    gasType3DataLength = gasType3DataLength + 1;
                })

                if (gasType3DataLength > 0) {
                    $('#gasType3Div').removeClass('hide');
                    initSelect('gasType3');

                    $.map(gasType3Helper.getData(), function (value, key) {
                        $('#gasType3').append('<option value="' + key + '">' + value + '</option>');
                    });
                } else {
                    // console.log('gasType3DateLength is 0');
                    if (!$('#gasType3Div').hasClass('hide')) $('#gasType3Div').addClass('hide')
                    initSelect('gasType3');
                }
            });

            function initSelect(elem) {
                $('#' + elem).children().remove();
                $('#' + elem).append('<option value="" selected="selected">请选择...</option>');
                $('#' + elem).select2().placeholder = '请选择...'
            }

            /*************用气性质级联结束*************/
        },

        reload: function () {
            xw = XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize: 20, 			//Initial pagesize
                    columnPicker: true,         //Show the columnPicker button
                    sorting: false,
                    transition: 'fade',  //(bounce, fade, flip, rotate, scroll, slide).
                    checkboxes: true,           //Make rows checkable. (Note. You need a column with the 'unique' property)
                    checkAllToggle: true,        //Show the check-all toggle//+RQLBuilder.like("KEYY", "a").rql()
                    rowClicked: function (data) {
                        console.log('row clicked');   //data.event holds the original jQuery event.
                        console.log(data);            //data.row holds the underlying row you supplied.
                    },
                    //----------------基本restful地址---
                    restbase: 'gasacticchargelog?sort=-createdTime',
                    key_column: "icChargeLogId",
                    //---------------行定义
                    coldefs: [
                        {
                            col: "icChargeLogId",
                            friendly: "Id",
                            unique: true,
                            hidden: true,
                            readonly: "readonly",
                            index: 1
                        },
                        {
                            col: "reservedField1",
                            friendly: "出账设置",
                            index: 1
                        },
                        {
                            col: "chargeDate",
                            friendly: "出账时间",
                            format: dateFormat,
                            inputsource: 'datepicker',
                            index: 2,
                            width: "100px"

                        },
                        {
                            col: "numberOfAccont",
                            friendly: "出账总数",
                            readonly: "readonly",
                            index: 3,
                            width: "100px"
                        },
                        {
                            col: "successOfAccont",
                            friendly: "已执行数",
                            readonly: "readonly",
                            index: 4,
                            width: "100px"
                        },
                        {
                            col: "allDeductionCount",
                            friendly: "足额扣划数",
                            readonly: "readonly",
                            index: 5,
                            width: "100px"
                        },
                        {
                            col: "partDeductionCount",
                            friendly: "部分扣划数",
                            readonly: "readonly",
                            index: 6,
                            width: "100px"
                        },
                        {
                            col: "zeroDeductionCount",
                            friendly: "未扣划数",
                            readonly: "readonly",
                            index: 7,
                            width: "100px"
                        },
                        {
                            col: "chargeAmount",
                            friendly: "出账总额",
                            readonly: "readonly",
                            index: 8,
                            width: "100px"
                        },
                        {
                            col: "percentage",
                            friendly: "执行百分比",
                            readonly: "readonly",
                            format: percentageFormat,
                            index: 9
                        }
                        // ,
                        // {
                        //     col: "createdBy",
                        //     friendly: "执行人",
                        //     readonly: "readonly",
                        //     index: 10,
                        //     width: "120px"
                        // }
                        // ,
                        // {
                        //     col: "icChargeLogId",
                        //     friendly: "操作",
                        //     format: openButton,
                        //     readonly: "readonly",
                        //     index: 11,
                        //     width: "100px"
                        // }
                    ],
                    //---------------查询时过滤条件
                    findFilter: function () {
                        var datefrom = undefined;
                        if ($('input[name=from]').val()) {
                            datefrom = RQLBuilder.condition('chargeDate', '$gte', "to_date('" + $("#find_start_date").val() + " 00:00:00','yyyy-MM-dd HH24:mi:ss')");
                        }

                        var dateend = undefined;
                        if ($('input[name=to]').val()) {
                            dateend = RQLBuilder.condition('chargeDate', '$lte', "to_date('" + $("#find_end_date").val() + " 00:00:00','yyyy-MM-dd HH24:mi:ss')");
                        }
                        var filter = RQLBuilder.and([
                            datefrom, dateend
                        ]);
                        return filter.rql();
                    },
                }//--init
            );//--end init
        },

        initPage: function () {
            /* $('#find_provincename').on('input',function(e){
                 console.log("changing::"+e.target.value)
                 if(!e.target.value){
                     XWATable.autoResetSearch();
                 }
             });*/

            $('#exc_button').on('click', function (e) {
                var data = {};
                var json_str = {};
                var message = "";
                if (!$('#areaDiv').hasClass('hide')) {
                    message += "<h3>按供气区域创建月出账任务</h3>";
                    if ($('#find_areaId').val()) {
                        json_str.areaId = $('#find_areaId').val()
                        json_str.areaName = $('#find_areaId').select2('data').text;
                        message += "<p><h4>供气区域：" + $('#find_areaId').select2('data').text + "</h4></p>";
                    }
                    if ($('#find_countperId').val()) {
                        json_str.countperId = $('#find_countperId').val()
                        json_str.countperName = $('#find_countperId').select2('data').text;
                        message += "<p><h4>核算员：" + $('#find_countperId').select2('data').text + "</h4></p>";
                    }
                    if ($('#find_serviceperId').val()) {
                        json_str.serviceperId = $('#find_serviceperId').val()
                        json_str.serviceperName = $('#find_serviceperId').select2('data').text;
                        message += "<p><h4>客户服务员：" + $('#find_serviceperId').select2('data').text + "</h4></p>";
                    }
                    if ($('#find_bookId').val()) {
                        json_str.bookId = $('#find_bookId').val()
                        json_str.bookName = $('#find_bookId').select2('data').text;
                        message += "<p><h4>抄表本：" + $('#find_bookId').select2('data').text + "</h4></p>";
                    }
                }
                if (!$('#gasTypeDiv').hasClass('hide')) {
                    message += "<h3>按用气性质创建月出账任务</h3>";
                    var gasTypeId;
                    message += "<p><h4>用气性质：";
                    if ($('#gasType1').val()) {//一级有值
                        message += $('#gasType1').select2('data').text;
                        json_str.gasTypeName = $('#gasType1').select2('data').text;
                        if ($('#gasType2').val()) {//判断二级是否有值
                            message += " / " + $('#gasType2').select2('data').text;
                            json_str.gasTypeName = $('#gasType2').select2('data').text;
                            if ($('#gasType3').val()) {//判断三级是否有值
                                message += " / " + $('#gasType3').select2('data').text;
                                gasTypeId = $('#gasType3').val();
                                json_str.gasTypeName = $('#gasType3').select2('data').text;
                            } else {
                                gasTypeId = $('#gasType2').val();
                            }
                        } else {
                            gasTypeId = $('#gasType1').val();
                        }
                    }
                    message += "</h4></p>";
                    json_str.gasTypeId = gasTypeId;
                }
                data.json_str = json_str;
                if (!$('#codeDiv').hasClass('hide')) {
                    message += "<h3>按客户编号创建月出账任务</h3>";
                    if ($('#find_customer_code').val()) {
                        message += "<p><h4>客户编号：" + $('#find_customer_code').val() + "</h4></p>";
                        data = {} //如果填写了客户编号,只需要根据客户编号进行查询档案
                        data.customer_code = $('#find_customer_code').val()
                    } else {
                        bootbox.alert("请输入客户编号...")
                        return;
                    }
                }
                if ($('#find_end_time').val()) {
                    data.bll_date = $('#find_end_time').val()
                    message += "<p><h4>出账日期：" + $('#find_end_time').val() + "</h4></p>";
                } else {
                    bootbox.alert("请输入截止时间...")
                    return;
                }

                bootbox.confirm({
                    message: message,
                    buttons: {
                        confirm: {
                            label: '确认执行月出账',
                            className: 'btn-success'
                        },
                        cancel: {
                            label: '取消',
                            className: 'btn-default'
                        }
                    },
                    callback: function (result) {
                        if (result) {
                            var dialog = bootbox.dialog({
                                message: '<p class="text-center">正在创建月出账任务，请稍后...</p>',
                                closeButton: false
                            });
                            $.ajax({
                                url: "/hzqs/bil/pbicb.do?fh=ICBBIL0000000J00&resp=bd",
                                dataType: "json",
                                data: JSON.stringify(data),
                                contentType: "application/json;charset=utf-8",
                                type: "POST",
                                success: function (result) {
                                    dialog.modal('hide');
                                    $("#generate").show();
                                    if (result.ret_code == "1") {
                                        bootbox.alert("<br><center><h3>月出账任务提交成功，请稍后查看任务执行情况...</h3></center><br>");
                                    } else {
                                        bootbox.alert("<br><center><h3>" + result.msg + "!</h3></center><br>");
                                    }
                                    //更新查询
                                    xw.update();
                                },
                                error: function (err) {
                                    dialog.modal('hide');
                                    $("#generate").show();
                                    console.log(err);
                                }
                            });
                        }
                    }
                });
            });
        }

    }
}()
var dateFormat = function () {
    return {
        f: function (data, row) {
            return moment(data).format("YYYY-MM-DD");
        }
    }
}();
function retry(icChargeLogId) {
    var json_str = {};
    json_str.icChargeLogId = icChargeLogId;

    var data = {};
    data.json_str = json_str;
    console.log('the data is :::', data);

    $.ajax({
        url: "hzqs/bil/pbibr.do?fh=IBRBIL0000000J00&resp=bd",
        dataType: "json",
        async: false,
        data: JSON.stringify(data),
        contentType: "application/json;charset=utf-8",
        type: "POST",
        success: function (result) {
            if (result.ret_code == "1") {
                setTimeout(function () {
                    bootbox.alert("<br><center><h4>执行成功...</h4></center><br>");
                }, 1000)
            } else {
                bootbox.alert("<br><center><h4>" + result.msg + "</h4></center><br>");
            }
            //更新查询
            // xw.update();
        },
        error: function (err) {
            $("#generate").show();
            console.log(err);
        }
    })
}

$('#useArea').click(function () {
    if (!$('#codeDiv').hasClass('hide')) {
        $('#codeDiv').addClass('hide');
    }

    if (!$('#gasTypeDiv').hasClass('hide')) {
        $('#gasTypeDiv').addClass('hide');
    }

    if ($('#areaDiv').hasClass('hide')) {
        $('#areaDiv').removeClass('hide');
    }

    $('#execDiv').removeClass('hide');
    $('#useCode').removeClass("yellow");
    $('#useGasType').removeClass("yellow");
    $('#useArea').addClass("yellow");
});

$('#useGasType').click(function () {
    if (!$('#codeDiv').hasClass('hide')) {
        $('#codeDiv').addClass('hide');
    }

    if (!$('#areaDiv').hasClass('hide')) {
        $('#areaDiv').addClass('hide');
    }

    if ($('#gasTypeDiv').hasClass('hide')) {
        $('#gasTypeDiv').removeClass('hide');
    }

    $('#execDiv').removeClass('hide');
    $('#useCode').removeClass("yellow");
    $('#useGasType').addClass("yellow");
    $('#useArea').removeClass("yellow");
});

$('#useCode').click(function () {
    if (!$('#areaDiv').hasClass('hide')) {
        $('#areaDiv').addClass('hide');
    }

    if (!$('#gasTypeDiv').hasClass('hide')) {
        $('#gasTypeDiv').addClass('hide');
    }

    if ($('#codeDiv').hasClass('hide')) {
        $('#codeDiv').removeClass('hide');
    }

    $('#execDiv').removeClass('hide');
    $('#useCode').addClass("yellow");
    $('#useGasType').removeClass("yellow");
    $('#useArea').removeClass("yellow");
});




