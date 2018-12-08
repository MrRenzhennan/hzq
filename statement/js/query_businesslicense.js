var queryAction = function () {
    var xw;
    //helper
    var areahelper = RefHelper.create({
        ref_url:"gasbizarea",
        ref_col:"areaId",
        ref_display:"areaName"
    })

    return {
        init : function () {
            this.reload();
            this.initHelper();
        },
        initHelper : function () {
            $.map(areahelper.getData(),function (value, key) {
                $('#find_area').append('<option value="'+key+'">'+value+'</option>')
            })
            $('#find_area').change(function () {
                initSelect('find_chargeUnitId');
                initSelect('find_employeeName');
                var unitHelper=RefHelper.create({
                    ref_url:"gasbizchargeunit?query={\"areaId\" : "+ $('#find_area').val() + "}",
                    ref_col:"chargeUnitId",
                    ref_display:"chargeUnitName",
                });

                $.map(unitHelper.getData(), function (value, key) {
                    $('#find_chargeUnitId').append('<option value="'+key+'">'+value+'</option>');
                })
            });

            $('#find_chargeUnitId').change(function () {
                initSelect('find_employeeName')
                var userHelper = RefHelper.create({
                    ref_url:"gassysuser?query={\"unitId\":" + $('#find_chargeUnitId').val() + "}",
                    ref_col:"userId",
                    ref_display:"employeeName"
                });

                $.map(userHelper.getData(), function (value,key) {
                    $('#find_employeeName').append('<option value="' + key + '">' + value + '</option>');
                })
            });

            function initSelect(elem) {
                $('#' + elem).children().remove();
                $('#' + elem).append('<option value="" selected="selected">全部</option>');
                $('#' + elem).select2().placeholder = '全部'
            }
        },
        reload : function () {
            var cols = "userId, chargeUnitId,chargeUnitName,employeeName,chargeTypeName,feeType,sum(money) money";
            var bd = {"cols":cols,
                "froms":" vwChgDayBalanceAll " +
                " group by " +
                " userId,employeeName,chargeTypeName,feeType,chargeUnitId,chargeUnitName having sum(money) > 0 order by chargeUnitId, userId " ,
                "page":"true",
                "limit":50};
            xw=XWATable.init(
                {
                    //----------------table的选项-------
                    divname:"divtable",
                    pageSize: 20, 			//Initial pagesize
                    columnPicker: true,         //Show the columnPicker button
                    sorting: true,
                    transition: 'fade',  //(bounce, fade, flip, rotate, scroll, slide).
                    checkboxes: false,           //Make rows checkable. (Note. You need a column with the 'unique' property)
                    checkAllToggle: false,        //Show the check-all toggle//+RQLBuilder.like("KEYY", "a").rql()
                    rowClicked: function (data) {
                    },
                    //----------------基本restful地址---
                    //restbase: '../json/collectfee/gasdayreportdetail.json',
                    restURL : "/hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd&proxy=VSELDBC000000J00&bd="+encodeURIComponent(JSON.stringify(bd)),
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
                            col: "feeType",
                            friendly: "收费类型",
                            readonly: "readonly",
                            index: 4
                        },
                        {
                            col: "money",
                            friendly: "金额",
                            readonly: "readonly",
                            index: 5
                        }
                    ],
                    //---------------查询时过滤条件
                    findFilter: function () {//find function
                        var sql= " 1=1 ";
                        if($('#find_area').val()) {
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
                            sql += " and chargeUnitId in (" + unitArray.join() + ")";
                        }
                        if ($('#find_chargeUnitId').val()) {
                            sql+=" and chargeUnitId = '"+$('#find_chargeUnitId').val()+"'";
                        }
                        if ($('#find_employeeName').val()) {
                            sql+= " and userId = '"+$('#find_employeeName').val()+"'"
                        }
                        if ($('#find_start_date').val()) {
                            sql+= " and createdTime > to_date('"+ $('#find_start_date').val() +"','yyyy-MM-dd') "
                        }

                        if ($('#find_end_date').val()) {
                            sql+= " and createdTime < to_date('"+ $('#find_end_date').val() +"','yyyy-MM-dd') "
                        }


                        var bd={
                            "cols":cols,
                            "froms":" vwChgDayBalanceAll ",
                            "wheres":sql +
                            " group by " +
                            " userId,employeeName,chargeTypeName,feeType,chargeUnitId,chargeUnitName having sum(money) > 0 " +
                            " order by chargeUnitId, userId ",
                            "page":true
                        };

                        xw.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd="+encodeURIComponent(JSON.stringify(bd)));
                        return null;

                        // var filter = "keyy=" + $('#find_key').val();
                        // return filter;
                    }//--findFilter
                }//--init
            );//--end init
        }
    }
}