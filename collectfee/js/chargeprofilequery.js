var queryAction = function () {
    var xw;
    //helper
    var areahelper = RefHelper.create({
        ref_url: "gasbizarea",
        ref_col: "areaId",
        ref_display: "areaName"
    })

    return {
        init: function () {
            //this.reload();
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
                initSelect('find_employeeName')
                var f_u_s = RQLBuilder.and([
                    RQLBuilder.equal("chargeUnitId", $("#find_chargeUnitId").val())
                    , RQLBuilder.or([
                        RQLBuilder.equal("stationId", "5")
                        , RQLBuilder.equal("stationId", "4")
                    ])
                ]);
                $.ajax({
                    type: 'get',
                    url: '/hzq_rest/gassysuser?query=' + f_u_s.rql(),
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8",
                    async: false,
                    success: function (data, textStatus, xhr) {
                        if (xhr.status == 200) {
                            var opts = '';
                            var rows = data;
                            if (!rows.length || rows.length == 0) {
                                opts = '<option value="" >无</option>';
                            } else {
                                opts = '<option value="" >全部</option>';
                                for (var i = 0; i < rows.length; i++) {
                                    if (rows[i].stationId == "4") {
                                        opts += '<option value="' + rows[i].userId + '">班长-' + rows[i].employeeName + '</option>';
                                    } else {
                                        opts += '<option value="' + rows[i].userId + '">营业员-' + rows[i].employeeName + '</option>';
                                    }
    
                                }
                            }
                            $("#find_employeeName").html(opts);
                            $("#find_employeeName").select2("open");
                        } else if (xhr.status == 403) {
    
                        }
                    },
                    error: function (err) {
                        if (err.status == 403) {
    
                        }
                    }
                });

                // var userHelper = RefHelper.create({
                //     ref_url: "gassysuser?query={\"chargeUnitId\":" + $('#find_chargeUnitId').val() + "}",
                //     ref_col: "userId",
                //     ref_display: "employeeName"
                // });

                // $.map(userHelper.getData(), function (value, key) {
                //     $('#find_employeeName').append('<option value="' + key + '">' + value + '</option>');
                // })
            });

            function initSelect(elem) {
                $('#' + elem).children().remove();
                $('#' + elem).append('<option value="" selected="selected">全部</option>');
                $('#' + elem).select2().placeholder = '全部'
            }
        },
        reload: function () {
            var wheres = "";
            

            if ($('#find_employeeName').val()) {
                wheres += " and a.userId = '" + $('#find_employeeName').val() + "'"
            }else{
            	if ($('#find_chargeUnitId').val()) {
                	wheres += " and a.chargeUnitId = '" + $('#find_chargeUnitId').val() + "'";
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
	                    wheres += " and a.chargeUnitId in (" + unitArray.join() + ")";
	                }
            	}
            }
            if ($('#find_start_date').val()) {
                wheres += " and a.createdTime > to_date('" + $('#find_start_date').val() + "','yyyy-MM-dd') "
            }
            if ($("#find_fee_type").val() != "") {
                wheres += "and a.feeTypeId='" + $("#find_fee_type").val() + "' ";
            }

            if ($('#find_end_date').val()) {
                wheres += " and a.createdTime < to_date('" + $('#find_end_date').val() + "','yyyy-MM-dd') "
            }

            if ($("#is_Local").val()!="") {
                wheres += " and a.isLocal='" + $('#is_Local').val() + "' ";
            }

            if ($("#customer_type").val()) {
                wheres += " and a.customerType='" + $('#customer_type').val() + "' ";
            }

            if ($("#customer_kind").val()) {
                wheres += " and a.customerKind='" + $('#customer_kind').val() + "' ";
            }

            if ($("#find_chg_type").val()) {
                wheres += " and a.chargeTypeId='" + $('#find_chg_type').val() + "' ";
            }


            var cols = "a.pi,a.isLocal,a.customerKind,a.userId,a.customerType,a.chargeUnitName,a.employeeName,a.chargeTypeName,a.feeType,a.feeTypeId,sum(a.money) money,count(1) count";
            var bd = {
                "cols": cols,
                "froms": " vwChgDayBalanceAll a",
                "wheres": "1=1 " + wheres + " group by a.pi,a.isLocal,a.userId,a.customerKind,a.customerType,a.employeeName,a.chargeTypeName,a.feeType,a.chargeUnitName,a.feeTypeId",
                "page": "true",
                "pageSize": "50",
                "limit": 0
            };
            $("#divtable").html("");
            
            RFTable.init(
            //xw = XWATable.init(
                {
                    //----------------table的选项-------
                    //divname: "divtable",
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
                    //restURL: "/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd&bd=" + encodeURIComponent(JSON.stringify(bd)),
                    restbase: "/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd&bd=" + encodeURIComponent(JSON.stringify(bd)),
                    //---------------行定义
                    coldefs: [
                        {
                            col: "chargeUnitName",
                            friendly: "营业网点",
                            readonly: "readonly",
                            index: 1
                        },
                        {
                            col: "employeeName",
                            friendly: "营业员",
                            readonly: "readonly",
                            index: 2
                        },
                        {
                            col: "chargeTypeName",
                            friendly: "收费方式",
                            inputsource: "select",
                            index: 3
                        },
                        {
                            col: "customerType",
                            friendly: "表具类型",
                            readonly: "readonly",
                            format: customerTypeFormat,
                            index: 4
                        },
                        {
                            col: "customerKind",
                            friendly: "客户类别",
                            readonly: "readonly",
                            format: customerKindFormat,                            
                            index: 5
                        },
                        {
                            col: "feeTypeId",
                            friendly: "收费类型",
                            readonly: "readonly",
                            format: feeTypeIdFormat,
                            index: 10
                        },
                        {
                            col: "isLocal",
                            friendly: "本地/异地",
                            readonly: "readonly",
                            format: isLocalFormat,
                            index: 10
                        },
                        {
                            col: "count",
                            friendly: "总笔数",
                            readonly: "readonly",
                            index: 5
                        },
                        {
                            col: "money",
                            friendly: "总金额",
                            readonly: "readonly",
                            index: 6
                        }
                    ],
                    //---------------查询时过滤条件
                    findFilter: function () {//find function
                        // var wheres = "";
                        //  if ($("#is_Local").val()) {//是否为本供气区域收费
                        //     wheres += " and a.isLocal='" + $('#is_Local').val() + "' ";
                        // }
                     	// if ($('#find_chargeUnitId').val()) {
                        // 	wheres += " and a.chargeUnitId = '" + $('#find_chargeUnitId').val() + "'";
                        // } else {
                        //     if ($('#find_area').val()) {
                        //         //查询一下此供气区域中的所有chargeUnit
                        //         //sql + " and charUnitId in ()
                        //         var unitHelper = RefHelper.create({
                        //             ref_url: "gasbizchargeunit?query={\"areaId\" : " + $('#find_area').val() + "}",
                        //             ref_col: "chargeUnitId",
                        //             ref_display: "chargeUnitName",
                        //         })
                        //         var unitArray = [];
                        //         $.map(unitHelper.getData(), function (value, key) {
                        //             unitArray.push(key)
                        //         })
                        //         wheres += " and a.chargeUnitId in ('" + unitArray.join("','") + "')";
                        //     }
                        // }
                        // if ($("#find_fee_type").val() != "") {
                        //     wheres += "and a.feeTypeId='" + $("#find_fee_type").val() + "' ";
                        // }
                        // if ($('#find_employeeName').val()) {
                        //     wheres += " and a.userId = '" + $('#find_employeeName').val() + "'"
                        // }
                        // if ($('#find_start_date').val()) {
                        //     wheres += " and to_date(to_char(a.createdTime,'yyyy-MM-dd'),'yyyy-MM-dd') >= to_date('" + $('#find_start_date').val() + "','yyyy-MM-dd') "
                        // }

                        // if ($('#find_end_date').val()) {
                        //     wheres += " and to_date(to_char(a.createdTime,'yyyy-MM-dd'),'yyyy-MM-dd') <= to_date('" + $('#find_end_date').val() + "','yyyy-MM-dd') "
                        // }

                        // if ($("#is_Local").val()) {//是否为本供气区域收费
                        //     wheres += " and a.isLocal='" + $('#is_Local').val() + "' ";
                        // }

                        // if ($("#customer_type").val()) {
                        //     wheres += " and a.customerType='" + $('#customer_type').val() + "' ";
                        // }

                        // if ($("#customer_kind").val()) {
                        //     wheres += " and a.customerKind='" + $('#customer_kind').val() + "' ";
                        // }

                        // var cols = "a.pi,a.isLocal,a.customerKind,a.userId,a.customerType,a.chargeUnitName,a.employeeName,a.chargeTypeName,a.feeType,sum(a.money) money,count(1) count";
                        // var bd = {
                        //     "cols": cols,
                        //     "froms": " vwChgDayBalanceAll a",
                        //     "wheres": "1=1 " + wheres + " group by a.isLocal,a.userId,a.customerKind,a.customerType,a.employeeName,a.chargeTypeName,a.feeType,a.chargeUnitName",
                        //     "page": "true",
                        //     "pageSize": "50",
                        //     "limit": 0
                        // };

                        // xw.setRestURL("/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd&bd=" + encodeURIComponent(JSON.stringify(bd)));
                        return null;
                    }//--findFilter
                }//--init
            );//--end init
        }
    }
}
var feeTypeIdFormat = function () {
    return {
        f: function (data, row) {
            if (data == "1") {
                if(row.pi=="0") {
                    return "IC卡表收费";
                } else if (row.pi=="1") {
                    return "普表收费";
                }
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
            if (data == "P") {
                return "普表";
            } else if (data == "I") {
                return "IC卡表";
            } else {
                return "";
            }
        }
    }
}();
var customerKindFormat = function () {
    return {
        f: function (data, row) {
            if (data == "1") {
                return "居民";
            } else if (data == "9") {
                return "非居民";
            } else {
                return "";
            }
        }
    }
}();
var isLocalFormat = function () {
    return {
        f: function (data, row) {
            if (data == "1") {
                return "本地";
            } else if (data == "0") {
                return "异地";
            } else {
                return "";
            }
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
    $("#find_employeeName").attr("disabled", true);
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
                $("#find_chargeUnitId").attr("disabled", true);
            } else if (xhr.status == 403) {

            }
        },
        error: function (err) {
            if (err.status == 403) {

            }
        }
    });
}
