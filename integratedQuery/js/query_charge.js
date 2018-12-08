var ChargeAction = function () {
    var areaSum;
    var areas;
    var loginarea = new Array();

    return {
        init: function () {
            // this.reload();
            this.initHelper();
            this.reloadTable();
            this.find();
        },

        initHelper: function () {
            var userInfo = JSON.parse(localStorage.getItem('user_info'));
            GasModSys.areaList({
                "areaId": userInfo.area_id,
                "cb": function (data) {
                    $.each(data, function (key, val) {
                        loginarea.push(val);
                        $('#find_unit').append('<option value="' + val.areaId + '" name="' + val.areaId + '">' + val.areaName + '</option>');
                    })
                }
            });
        },

        reloadTable: function () {
            function sortAreaId(Object1, Object2) {
                return Object1.posCode - Object2.posCode;
            }
            var queryStr = RQLBuilder.and([
                RQLBuilder.or(
                    [
                        RQLBuilder.equal("status", "1"),
                        RQLBuilder.equal("status", "2"),
                    ]
                )
            ]).rql();

            var tbody = "";
            for (var i = 0; i < loginarea.length; i++) {//j:居民；f:非居民;x:销售量;s:实收额
                tbody = tbody + '<tr align="center">' +
                    '<td>' + Number(i + 1) + '</td>' +
                    '<td id="r_' + loginarea[i].areaId + '_name" rowspan="1" colspan="1" class="areaName">' + loginarea[i].areaName + '</td>' +
                    '<td id="r_' + loginarea[i].areaId + '_jx" rowspan="1" colspan="1">0</td>' +
                    '<td id="r_' + loginarea[i].areaId + '_js" rowspan="1" colspan="1">0</td>' +
                    '<td id="r_' + loginarea[i].areaId + '_fx" rowspan="1" colspan="1">0</td>' +
                    '<td id="r_' + loginarea[i].areaId + '_fs" rowspan="1" colspan="1">0</td>' +
                    '</tr>';
            }

            tbody = tbody + '<tr align="center">' +
                '<td id="sum_c0"></td>' +
                '<td id="sum_c10" class="areaName">总计</td>' +
                '<td id="sum_c1"></td>' +
                '<td id="sum_c2"></td>' +
                '<td id="sum_c3"></td>' +
                '<td id="sum_c4"></td>' +
                '</tr>'
            tbody = tbody + '<tr align="left">' +
                '<td id="tbody_r19_c1" rowspan="2" colspan="21">&nbsp;&nbsp;&nbsp;&nbsp;注：</td>' +
                '</tr>';
            $("#tbody").html(tbody);
        },

        find: function () {
            $('#find_button').click(function () {
                $("#btn_down_detail").removeClass("disabled");
                $("#btn_down_detail").removeClass("gray");
                $("#btn_down_detail").addClass("green");

                $("#btn_print_page").removeClass("disabled");
                $("#btn_print_page").removeClass("gray");
                $("#btn_print_page").addClass("green");

                /*****************清除开始***********************/
                for (var i = 0; i < loginarea.length; i++) {//j:居民；f:非居民;x:销售量;s:实收额
                    $('#r_' + loginarea[i].areaId + '_jx').html('');
                    $('#r_' + loginarea[i].areaId + '_js').html('');
                    $('#r_' + loginarea[i].areaId + '_fx').html('');
                    $('#r_' + loginarea[i].areaId + '_fs').html('');
                }
                $('#sum_c1, #sum_c2, #sum_c3, #sum_c4, #sum_c5').html('');
                /*****************清除结束***********************/

                /*****************居民开始***********************/
                var whereClause1 = "";
                var startDate = $('input[name=from]').val();
                var endDate = moment($('input[name=to]').val()).add("day", 1).format("YYYY-MM-DD");

                if ($('#find_unit').val()) {
                    whereClause1 += " areaId = '" + $('#find_unit').val() + "'";
                }

                if ($('input[name=from]').val() && $('input[name=to]').val()) {
                    if (whereClause1 != "") {
                        whereClause1 += " and ";
                    }
                    whereClause1 += " tradeDate between to_date('" + startDate + "','yyyy-MM-dd') and to_date('" + endDate + "','yyyy-MM-dd') ";
                }

                // 取非居民应收量
                $.ajax({
                    url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
                    type: "POST",
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify({
                        cols: "sum(gas) gas,areaId,customerKind",
                        froms: "gasReportYslNew a",
                        wheres: whereClause1 + " group by areaId,customerKind",
                        page: "false",
                        // limit:1
                    }),
                    dataType: "json",
                    success: function (data) {
                        if (data.rows) {
                            var rows = data.rows;
                            for (var i = 0; i < rows.length; i++) {
                                if (rows[i].customerKind == "1") {
                                    var gas = rows[i].gas ? parseFloat(rows[i].gas).toFixed(4) : 0.0000;
                                    var fx = parseFloat($.unformatMoney($('#r_' + rows[i].areaId + '_jx').html()));
                                    if (isNaN(fx)) {
                                        fx = 0.0000;
                                    } else {
                                        fx = fx.toFixed(4);
                                    }
                                    $('#r_' + rows[i].areaId + '_jx').html($.formatMoney(fx * 1 + gas * 1, 2));//销售量
                                } else {
                                    var gas = rows[i].gas ? parseFloat(rows[i].gas).toFixed(4) : 0.0000;
                                    var fx = parseFloat($.unformatMoney($('#r_' + rows[i].areaId + '_fx').html()));
                                    if (isNaN(fx)) {
                                        fx = 0.0000;
                                    } else {
                                        fx = fx.toFixed(4);
                                    }
                                    $('#r_' + rows[i].areaId + '_fx').html($.formatMoney(fx * 1 + gas * 1, 2));//销售量
                                }
                            }
                        }

                        $("td[id$=_jx]").each(function (index, element) {
                            var subVal = parseFloat($.unformatMoney($(element).html()));
                            if (isNaN(subVal)) {
                                subVal = 0.0000;
                            } else {
                                subVal = subVal.toFixed(4);
                            }
                            var cellVal = parseFloat($.unformatMoney($('#sum_c1').html()));
                            if (isNaN(cellVal)) {
                                cellVal = 0.0000;
                            } else {
                                cellVal = cellVal.toFixed(4);
                            }
                            $('#sum_c1').html($.formatMoney(cellVal * 1 + subVal * 1));
                        });
                        $("td[id$=_fx]").each(function (index, element) {
                            var subVal = parseFloat($.unformatMoney($(element).html()));
                            if (isNaN(subVal)) {
                                subVal = 0.0000;
                            } else {
                                subVal = subVal.toFixed(4);
                            }
                            var cellVal = parseFloat($.unformatMoney($('#sum_c3').html()));
                            if (isNaN(cellVal)) {
                                cellVal = 0.0000;
                            } else {
                                cellVal = cellVal.toFixed(4);
                            }
                            $('#sum_c3').html($.formatMoney(cellVal * 1 + subVal * 1));
                        });
                    }
                });

                // 取居民实收额
                $.ajax({
                    url: "hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd",
                    type: "POST",
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify({
                        cols: "sum(money) money,areaId,customerKind",
                        froms: "gasReportSseNew",
                        wheres: whereClause1 + " group by areaId,customerKind",
                        page: "false",
                        // limit:1
                    }),
                    dataType: "json",
                    success: function (data) {
                        if (data.rows) {
                            var rows = data.rows;
                            for (var i = 0; i < rows.length; i++) {
                                var money = rows[i].money ? parseFloat(rows[i].money).toFixed(4) : 0.0000;
                                if (rows[i].customerKind == "1") {
                                    var fx = parseFloat($.unformatMoney($('#r_' + rows[i].areaId + '_js').html()));
                                    if (isNaN(fx)) {
                                        fx = 0.0000;
                                    } else {
                                        fx = fx.toFixed(4);
                                    }
                                    $('#r_' + rows[i].areaId + '_js').html($.formatMoney(fx * 1 + money * 1, 2));//销售量

                                } else {
                                    var fx = parseFloat($.unformatMoney($('#r_' + rows[i].areaId + '_fs').html()));
                                    if (isNaN(fx)) {
                                        fx = 0.0000;
                                    } else {
                                        fx = fx.toFixed(4);
                                    }
                                    $('#r_' + rows[i].areaId + '_fs').html($.formatMoney(fx * 1 + money * 1, 2));//销售量

                                }

                            }


                            $("td[id$=_js]").each(function (index, element) {
                                var subVal = parseFloat($.unformatMoney($(element).html()));
                                if (isNaN(subVal)) {
                                    subVal = 0.0000;
                                } else {
                                    subVal = subVal.toFixed(4);
                                }
                                var cellVal = parseFloat($.unformatMoney($('#sum_c2').html()));
                                if (isNaN(cellVal)) {
                                    cellVal = 0.0000;
                                } else {
                                    cellVal = cellVal.toFixed(4);
                                }
                                $('#sum_c2').html($.formatMoney(cellVal * 1 + subVal * 1));
                            });

                            $("td[id$=_fs]").each(function (index, element) {
                                var subVal = parseFloat($.unformatMoney($(element).html()));
                                if (isNaN(subVal)) {
                                    subVal = 0.0000;
                                } else {
                                    subVal = subVal.toFixed(4);
                                }
                                var cellVal = parseFloat($.unformatMoney($('#sum_c4').html()));
                                if (isNaN(cellVal)) {
                                    cellVal = 0.0000;
                                } else {
                                    cellVal = cellVal.toFixed(4);
                                }
                                $('#sum_c4').html($.formatMoney(cellVal * 1 + subVal * 1));
                            });
                        }
                    }
                });
            });
        }
    }
}();
