var queryAction = function () {
    var xw;
    //helper
    var areahelper = RefHelper.create({
        ref_url: "gasbizarea",
        ref_col: "areaId",
        ref_display: "areaName"
    });
    var global_remap = {
        "chargeTypeName": "1:现金,2:POS机,3:银行转账,4:支票",
        "feeTypeId": "1:燃气费,2:垃圾费",
        "customerType": "P:普表,I:IC卡表"
    };
    var feeTypeFormat = function () {
        return {
            f: function (data, row) {
                if (data == "0") {
                    return "IC卡";
                } else if (data == "1") {
                    return "普表";
                } else {
                    return "";
                }
            }
        }
    }();
    var customerTypeFormat = function () {
        return {
            f: function (data, row) {
                if (data == "I") {
                    return "IC卡表";
                } else if (data == "P") {
                    return "普表";
                } else {
                    return "";
                }
            }
        }
    }();
    var feeTypeIdFormat = function () {
        return {
            f: function (data, row) {
                if (data == "1") {
                    return "燃气费";
                } else if (data == "2") {
                    return "垃圾费";
                } else {
                    return "";
                }
            }
        }
    }();
    var customerTypeFormat = function () {
        return {
            f: function (data, row) {
                if (data == "1") {
                    return "居民";
                } else if (data == "P") {
                    return "非居民";
                } else {
                    return "";
                }
            }
        }
    }();
    var isFormat = function () {
        return {
            f: function (data, row) {
                if (data == "1") {
                    return "是";
                } else {
                    return "否";
                }
            }
        }
    }();

    return {
        init: function () {
            this.reload();
            this.initHelper();
        },
        initHelper: function () {

            GasModSys.areaList({
                "areaId": userInfo.area_id,
                "cb": function (data) {
                    $.each(data, function (key, val) {
                        $('#find_area').append('<option value="' + val.areaId + '" name="' + val.areaId + '">' + val.areaName + '</option>');
                    })
                }
            });
            $('#find_area').change(function () {
                initSelect('find_chargeUnitId');
                initSelect('find_employeeName');
                var unitHelper = RefHelper.create({
                    ref_url: "gasbizchargeunit?query={\"areaId\" : " + $('#find_area').val() + "}",
                    ref_col: "chargeUnitId",
                    ref_display: "chargeUnitName",
                });

                $.map(unitHelper.getData(), function (value, key) {
                    $('#find_chargeUnitId').append('<option value="' + key + '">' + value + '</option>');
                })
            });

            $('#find_chargeUnitId').change(function () {

                var f_u_s = RQLBuilder.and([
                    RQLBuilder.equal("chargeUnitId", $(this).val())
                    , RQLBuilder.or([
                        RQLBuilder.equal("stationId", "5")
                        , RQLBuilder.equal("stationId", "4")
                    ])
                ]).rql();
                initSelect('find_employeeName')
                var userHelper = RefHelper.create({
                    ref_url: "gassysuser?query=" + f_u_s,
                    ref_col: "userId",
                    ref_display: "employeeName"
                });
                console.log(userHelper)

                $.map(userHelper.getData(), function (value, key) {
                    $('#find_employeeName').append('<option value="' + key + '">' + value + '</option>');
                })
            });

            function initSelect(elem) {
                $('#' + elem).children().remove();
                $('#' + elem).append('<option value="" selected="selected">全部</option>');
                $('#' + elem).select2().placeholder = '全部'
            }
        },
        reload: function () {
            var wheres ="";
            //var wheres = "select gas_chg_gas_detail a left join gas_chg_waste_detail b on a.customer_code = b.customer_code where a.created_time >b.created_time";
            var cols = "a.*,c.charge_unit_name,d.customerAddress";
            
            if ($('#find_chargeUnitId').val()) {
                wheres += " and b.chargeUnitId = '" + $('#find_chargeUnitId').val() + "'";
            } else {
                if ($('#find_area').val()) {
                    //查询一下此供气区域中的所有chargeUnit
                    //sql + " and charUnitId in ()
                    var unitHelper = RefHelper.create({
                        ref_url: "gasbizchargeunit?query={\"areaId\" : " + $('#find_area').val() + "}",
                        ref_col: "chargeUnitId",
                        ref_display: "chargeUnitName",
                    })
                    var unitArray = [];
                    $.map(unitHelper.getData(), function (value, key) {
                        unitArray.push(key)
                    })
                    wheres += " and b.chargeUnitId in ('" + unitArray.join('\',\'') + "')";
                }
            }


            if ($('#find_employeeName').val()) {
                wheres += " and b.userId = '" + $('#find_employeeName').val() + "'"
            }
            if ($('#find_start_date').val()) {
                wheres += " and to_date(to_char(a.createdTime,'yyyy-MM-dd'),'yyyy-MM-dd') >= to_date('" + $('#find_start_date').val() + "','yyyy-MM-dd') "
            }
            if ($('#find_end_date').val()) {
                wheres += " and to_date(to_char(a.createdTime,'yyyy-MM-dd'),'yyyy-MM-dd') <= to_date('" + $('#find_end_date').val() + "','yyyy-MM-dd') "
            }


            if ($("#customer_kind").val()) {
                wheres += " and d.customerKind='" + $('#customer_kind').val() + "' ";
            }

            wheres += " order by a.createdTime desc";            

            //wheres += " order by a.createdTime desc";
            $("#divtable").html("");

            var bd = {
                "cols": cols,
                "froms": " gas_chg_gas_detail a left join gas_chg_waste_detail w on a.customer_code =w.customer_code inner join gas_sys_user b on a.created_by = b.user_id inner join gas_biz_charge_unit c on c.charge_unit_id = b.charge_unit_id inner join gas_ctm_archive d on a.customer_code = d.customer_code ",
                "wheres": " a.unpayWaste=1 and c.status='1' and a.created_time >w.created_time  " + wheres,
                "page": "true",
                "pageSize": "50",
                "limit": 0
            };
            //总户数
            var b = {
                "cols": "count(1)  count",
                "froms": " gas_chg_gas_detail a left join gas_chg_waste_detail w on a.customer_code =w.customer_code inner join gas_sys_user b on a.created_by = b.user_id inner join gas_biz_charge_unit c on c.charge_unit_id = b.charge_unit_id inner join gas_ctm_archive d on a.customer_code = d.customer_code ",
                "wheres": " a.unpayWaste=1 and c.status='1' and a.created_time >w.created_time  " + wheres,
                "page": false
            };
            
            $.ajax({
                type: 'get',
                url: '/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd&bd=' + JSON.stringify(b),
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                success: function (data, textStatus, xhr) {
                    $("#all_count").val("");
                    if (xhr.status == 200) {
                        var rows = data.rows;
                        if (!data.rows || !rows.length || rows.length == 0) {


                        } else {

                            var all_count = 0;
                            for (var i = 0; i < rows.length; i++) {
                                try {
                                    all_count = all_count + rows[i].count;
                                } catch (e) {
                                    bootbox.alert("数据类型转换异常：" + JSON.stringify(rows[i]));
                                }
                            }
                            $("#all_count").val(all_count);
                        }

                    } else if (xhr.status == 403) {

                    }
                },
                error: function (err) {
                    if (err.status == 403) {

                    }
                }
            });

            xw = XWATable.init(
                {
                    //----------------table的选项-------
                    divname: "divtable",
                    pageSize: 50, 			//Initial pagesize
                    columnPicker: true,         //Show the columnPicker button
                    sorting: true,
                    transition: 'fade',  //(bounce, fade, flip, rotate, scroll, slide).
                    checkboxes: false,           //Make rows checkable. (Note. You need a column with the 'unique' property)
                    checkAllToggle: false,        //Show the check-all toggle//+RQLBuilder.like("KEYY", "a").rql()
                    rowClicked: function (data) {
                    },
                    //----------------基本restful地址---
                    //restbase: '../json/collectfee/gasdayreportdetail.json',
                    restURL: "/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd&bd=" + encodeURIComponent(JSON.stringify(bd)),
                    //---------------行定义 
                    coldefs: [
                        {
                            col: "detailId",
                            //friendly: "客户编号",
                            unique: true,
                            readonly: "readonly",
                            hidden: true,
                            index: 1

                        },
                        {
                            col: "customerCode",
                            friendly: "客户编号",
                            readonly: "readonly",
                            index: 2
                        },
                        {
                            col: "customerName",
                            friendly: "客户姓名",
                            readonly: "readonly",
                            index: 3
                        },
                        {
                            col: "chargeUnitName",
                            friendly: "营业网点",
                            inputsource: "select",
                            index: 5

                        },
                        {
                            col: "feeType",
                            friendly: "表具类型",
                            inputsource: "select",
                            index: 6,
                            format: feeTypeFormat

                        },

                        {
                            col: "customerAddress",
                            friendly: "客户地址",
                            readonly: "readonly",
                            index: 7
                        },
                        {
                            col: "unpayWaste",
                            friendly: "是否拒缴垃圾费",
                            readonly: "readonly",
                            index: 8,
                            format: isFormat
                        }
                        ,
                        {
                            col: "createdTime",
                            friendly: "拒缴时间",
                            readonly: "readonly",
                            format :timeFormat,
                            index: 9
                        }
                    ],
                    //---------------查询时过滤条件
                    findFilter: function () {//find function 
                        $("#all_count").val("0");
                        //总户数
                        var wheres = "";
                        if ($('#find_chargeUnitId').val()) {
                            wheres += " and b.chargeUnitId = '" + $('#find_chargeUnitId').val() + "'";
                        } else {
                            if ($('#find_area').val()) {
                                //查询一下此供气区域中的所有chargeUnit
                                //sql + " and charUnitId in ()
                                var unitHelper = RefHelper.create({
                                    ref_url: "gasbizchargeunit?query={\"areaId\" : " + $('#find_area').val() + "}",
                                    ref_col: "chargeUnitId",
                                    ref_display: "chargeUnitName",
                                })
                                var unitArray = [];
                                $.map(unitHelper.getData(), function (value, key) {
                                    unitArray.push(key)
                                })
                                wheres += " and b.chargeUnitId in ('" + unitArray.join('\',\'') + "')";
                            }
                        }


                        if ($('#isornot').val()) {
                            //wheres += " and  unpayWaste ='1'"
                            //console.log("aa");
                            if ($('#isornot').val() == '1') {
                                //console.log("bb");
                                wheres += " and  unpayWaste ='1' "
                            } else if ($('#isornot').val() == '0') {
                                wheres += " and  unpayWaste != '1' "
                            }
                        }

                        if ($('#find_employeeName').val()) {
                            wheres += " and b.userId = '" + $('#find_employeeName').val() + "'"
                        }
                        if ($('#find_start_date').val()) {
                            wheres += " and to_date(to_char(a.createdTime,'yyyy-MM-dd'),'yyyy-MM-dd') >= to_date('" + $('#find_start_date').val() + "','yyyy-MM-dd') "
                        }

                        if ($('#find_end_date').val()) {
                            wheres += " and to_date(to_char(a.createdTime,'yyyy-MM-dd'),'yyyy-MM-dd') <= to_date('" + $('#find_end_date').val() + "','yyyy-MM-dd') "
                        }

                        if ($("#customer_type").val()) {
                            wheres += " and a.feeType='" + $('#customer_type').val() + "' ";
                        }

                        if ($("#customer_kind").val()) {
                            wheres += " and a.customerKind='" + $('#customer_kind').val() + "' ";
                        }

                        wheres += " order by a.createdTime desc";

                        var cols = "a.*,c.charge_unit_name,d.customerAddress";
                        var bd = {
                            "cols": cols,
                            "froms": " gas_chg_gas_detail a left join gas_chg_waste_detail w on a.customer_code =w.customer_code inner join gas_sys_user b on a.created_by = b.user_id inner join gas_biz_charge_unit c on c.charge_unit_id = b.charge_unit_id inner join gas_ctm_archive d on a.customer_code = d.customer_code ",
                            "wheres": " a.unpayWaste=1 and c.status='1' and a.created_time >w.created_time  " + wheres,
                            "page": "true",
                            "pageSize": "50",
                            "limit": 0
                        };
                        var b = {
                            "cols": "count(1)  count",
                            "froms": " gas_chg_gas_detail a left join gas_chg_waste_detail w on a.customer_code =w.customer_code inner join gas_sys_user b on a.created_by = b.user_id inner join gas_biz_charge_unit c on c.charge_unit_id = b.charge_unit_id inner join gas_ctm_archive d on a.customer_code = d.customer_code ",
                            "wheres": " a.unpayWaste=1 and c.status='1' and a.created_time >w.created_time  " + wheres,
                            "page": false
                        };
                        xw.setRestURL("/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd&bd=" + encodeURIComponent(JSON.stringify(bd)));
                        $.ajax({
                            type: 'get',
                            url: '/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd&bd=' + JSON.stringify(b),
                            dataType: 'json',
                            contentType: "application/json; charset=utf-8",
                            success: function (data, textStatus, xhr) {
                                $("#all_count").val("");
                                if (xhr.status == 200) {
                                    var rows = data.rows;
                                    if (!data.rows || !rows.length || rows.length == 0) {


                                    } else {

                                        var all_count = 0;
                                        for (var i = 0; i < rows.length; i++) {
                                            try {
                                                all_count = all_count + rows[i].count;
                                            } catch (e) {
                                                bootbox.alert("数据类型转换异常：" + JSON.stringify(rows[i]));
                                            }
                                        }
                                        $("#all_count").val(all_count);
                                    }

                                } else if (xhr.status == 403) {

                                }
                            },
                            error: function (err) {
                                if (err.status == 403) {

                                }
                            }
                        });
                        return null;
                    }//--findFilter
                }//--init
            );//--end init
        }
    }
}
var timeFormat = function () {
    return {
        f: function (data, row) {
            if (data == "" || data == undefined) {
                return "—";
            } else {
                return moment(data).format("YYYY-MM-DD HH:mm:ss");
            }
            return "";
        }
    }
}();
var userInfo = JSON.parse(localStorage.getItem("user_info"));
var isNotYYY = true;
if (userInfo.station_id && (userInfo.station_id == "4" || userInfo.station_id == "5")) {
    isNotYYY = false;
    var opts = '';
    if (userInfo.station_id == "4") {
        $("#find_employeeName").html('<option selected="selected" value="' + userInfo.userId + '">班长-' + userInfo.employee_name + '</option>');
        $("#find_employeeName").val(userInfo.userId).trigger('change');
    } else {
        $("#find_employeeName").html('<option selected="selected" value="' + userInfo.userId + '">营业员-' + userInfo.employee_name + '</option>');
        $("#find_employeeName").val(userInfo.userId).trigger('change');
    }
    //$("#find_employeeName").attr("disabled", true);
    $.ajax({
        type: 'get',
        url: '/hzq_rest/gasbizchargeunit?query={"chargeUnitId":"' + userInfo.charge_unit_id + '"}', //?page=true&limit=10&skip=0
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (data, textStatus, xhr) {
            if (xhr.status == 200) {
                console.log(JSON.stringify(data));
                var rows = data;
                var opts = "";
                for (var i = 0; i < rows.length; i++) {
                    opts += '<option selected="selected"  value="' + rows[i].chargeUnitId + '">' + rows[i].chargeUnitName + '</option>';
                    $("#find_chargeUnitId").html(opts);
                    $("#find_employeeName").val(rows[i].chargeUnitId).trigger('change');
                }
                //$("#find_chargeUnitId").attr("disabled", true);
            } else if (xhr.status == 403) {

            }
        },
        error: function (err) {
            if (err.status == 403) {

            }
        }
    });
}
