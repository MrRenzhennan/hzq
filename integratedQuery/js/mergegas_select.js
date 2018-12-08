/**
 * Created by anne on 2017/12/5.
 */
ComponentsPickers.init();
var xw;
var userInfo = JSON.parse(localStorage.getItem('user_info'));
var area_id = userInfo.area_id;
var user_id = userInfo.userId;
var areaHelper = RefHelper.create({
    ref_url: "gasbizarea",
    ref_col: "areaId",
    ref_display: "areaName"
});
var deviceHelper = RefHelper.create({
    ref_url:'gasbizdevice',
    ref_col:'deviceCode',
    ref_display:'deviceName'
});

function getHour(s1,s2) {
    s1 = new Date(s1.replace(/-/g, '/'));
    s2 = new Date(s2.replace(/-/g, '/'));
    var ms = Math.abs(s1.getTime() - s2.getTime());
    return ms / 1000 / 60 / 60;
}
// alert( getHour('2017-8-23 12:05:05', '2017-8-23 13:05:05'))
var mergeGasAction = function () {

    var dateFormat = function () {
        return {
            f: function (val) {
                var date = val.substring(0, 10);
                return date;
            }
        }
    }()
    var subDateFormat = function () {
        return {
            f: function (val) {
                var date;
                if($("#find_start_date").val() && $("#find_end_date").val()){
                    date = getHour($('#find_start_date').val(), $("#find_end_date").val())/24;
                } else if ($("#find_start_date").val() && !$("#find_end_date").val()) {
                    bootbox.alert("请输入截止日期")
                } else if (!$("#find_start_date").val() && $("#find_end_date").val()) {
                    bootbox.alert("请输入起始日期")
                }else if (!$("#find_start_date").val() && !$("#find_end_date").val()){
                    date = 0;
                }

                return date;
            }
        }
    }()
    return {
        init: function () {
            this.initHelper();
            this.reload();
        },
        initHelper: function () {
        },
        reload:function(){

            $('#divtable').html('');
            var  cols=" sum(gas) xsl ,c.merge_address,c.merge_name,c.merge_tel";
            var froms=" gas_report_ysl_new d right join (select a.merge_id , merge_address,  merge_tel, merge_name, b.customer_code from gas_ctm_archive_merge a" +
                " left join gas_ctm_archive_merge_detail b on a.merge_id = b.merge_id) c on c.customer_code = d.customer_code " +
                "  group by c.merge_address,c.merge_name,c.merge_tel";

            var bd = {
                "cols": cols,
                "froms": froms,
                "wheres": "",
                "pade": true,
                "limit":50
            }

            xw=XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize:10,
                    columnPicker: true,
                    transition: 'fade',
                    checkboxes: true,
                    checkAllToggle:true,
                    //----------------基本restful地址---
                    restURL: "/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
                    key_column: "ctmArchiveId",
                    //---------------行定义
                    coldefs: [
                        {
                            col:"mergeName",
                            friendly:"名称",
                            validate:"required",
                            index:1
                        },
                        {
                            col:"mergeAddress",
                            friendly:"地址",
                            sort:true,
                            validate:"required",
                            index:2
                        },
                        {
                            col:"mergeTel",
                            friendly:"电话",
                            validate:"required",
                            index:3
                        },
                        {
                            col: "xsl",
                            validate: "required",
                            friendly: "销售量",
                            sort:true,
                            index: 12
                        }


                    ],

                    // 查询过滤条件

                    findFilter: function(){

                        var mergeName =  $('#mergeName').val();
                        var sales =  $('#sales').val();
                        var mergeAddress =  $('#mergeAddress').val();

                        var whereinfo = "";
                        if (mergeName) {
                            whereinfo +=" c.merge_name like  '%" + mergeName + "%' and ";   //   " cusCode =" + customerCode + " and ";
                        }
                        if (mergeAddress) {
                            whereinfo +=" c.merge_address like  '%" + mergeAddress + "%' and ";   //   " cusCode =" + customerCode + " and ";
                        }
                        // if (sales) {
                        //     whereinfo += "xsl = '" + sales + "' and ";
                        // }





                        bd = {
                            "cols": cols,
                            "froms": " gas_report_ysl_new d right join (select a.merge_id , merge_address,  merge_tel, merge_name, b.customer_code from gas_ctm_archive_merge a" +
                            " left join gas_ctm_archive_merge_detail b on a.merge_id = b.merge_id) c on c.customer_code = d.customer_code " ,
                            "wheres":  whereinfo+" 1=1 group by c.merge_address,c.merge_name,c.merge_tel",
                            "pade": true,
                            "limit":50
                        }

                        xw.setRestURL("/hzqs/dbc/pbsel.do?fh=VDBCSEL000000J00&resp=bd&proxy=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)));
                        return "";
                    }


                })
        }

    }
}();




