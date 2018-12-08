var xw;
ComponentsPickers.init();
var posDayReportAction = function () {
 var gasTypeHelper = RefHelper.create({
        ref_url: "gasbizgastype",
        ref_col: "gasTypeId",
        ref_display: "gasTypeName"
    });
    var gasTypeFormat = function () {
        return {
            f: function (val) {
                return gasTypeHelper.getDisplay(val);
            }
        }
    }();

    return {
        init: function () {
            //this.initHelper();
            this.reload();
        },


        reload: function () {
            $('#divtable').html('');

            var whereinfo = '';
            var bd =
                {
                    "cols": "a.*,a.money*0.3 agency,c.gas_type_id,c.customer_type",
                     "froms": "vw_chg_day_balance a,gas_ctm_archive c",
                     "wheres":"a.customer_code = c.customer_code",
                    "page": true,
                    "limit": 10
                };
            var basePath = '';
            xw = XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize: 10, 			//Initial pagesize
                    columnPicker: true,         //Show the columnPicker button
                    sorting: true,
                    transition: 'fade',  //(bounce, fade, flip, rotate, scroll, slide).
                    checkboxes: false,           //Make rows checkable. (Note. You need a column with the 'unique' property)
                    checkAllToggle: true,        //Show the check-all toggle//+RQLBuilder.like("KEYY", "a").rql()
                    //----------------基本restful地址---
                    // restbase: 'gasctmarchive/queryArchiveInfo',
                    //      key_column: '',
                    restURL: 'hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd&proxy=VSELDBC000000J00&bd=' + encodeURIComponent(JSON.stringify(bd)),

                    coldefs: [
                        {
                            col: "feeType",
                            friendly: "收费类型",
                            sorting: false,
                            index: 1
                        },
                        {
                            col: "money",
                            friendly: "收费金额",
                            sorting: false,
                            index: 2
                        },
                        {
                            col: "customerCode",
                            friendly: "客户号",
                            readonly: "readonly",
                            sorting: false,
                            index: 4
                        },

                        {
                            col: "customerType",
                            friendly: "客户类型",
                            readonly: "readonly",
                            sorting: false,
                            index: 5
                        },
                        {
                            col: "gasTypeId",
                            friendly: "用气性质",
                            readonly: "readonly",
                            sorting: false,
                            format: gasTypeFormat,
                            index: 6
                        },


                        {
                            col: "createdTime",
                            friendly: "收费时间",
                            readonly: "readonly",
                            index: 7
                        },
                        {
                            col: "employeeName",
                            friendly: "营业员",
                            readonly: "readonly",
                            sorting: false,
                            index: 8
                        },
                        {
                            col: "agency",
                            friendly: "代办费",
                            readonly: "readonly",
                            sorting: false,
                            index: 9
                        }

                    ],
                    //---------------查询时过滤条件
                    findFilter: function () {
                        var whereinfo = '1=1';

                            if ($("#find_start_date").val()&&$("#find_end_date").val()) {

                                whereinfo += "a.customer_code = c.customer_code and created_time between to_date('" + $("#find_start_date").val() + "','yyyy-mm-dd') and to_date('" + $("#find_end_date").val() + "','yyyy-mm-dd')"

                            }

                        var bd = {
                            "cols": "a.*,a.money*0.3 agency,c.gas_type_id,c.customer_type"
                            , "froms": "vw_chg_day_balance a,gas_ctm_archive c",
                            "wheres":whereinfo,
                            "page": true,
                            "limit": 10
                        };
                        xw.setRestURL('hzqs/dbc/pbsel.do?fh=SELDBC0000000J00&resp=bd&proxy=VSELDBC000000J00&bd=' + encodeURIComponent(JSON.stringify(bd)));

                        return null;
                    }

                });
        }

    }

}();