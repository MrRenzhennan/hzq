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
var gasAction = function () {

    var typeFormat = function () {
        return {
            f: function (val) {
                if (val == "01") {
                    return "热福射采暖"
                } else if (val == "02") {
                    return "熔炼炉"
                } else if (val == "03") {
                    return "蒸汽发生炉"
                }else if (val == "04") {
                    return "膨化炉"
                }else if (val == "05") {
                    return "巡检"
                }else if (val == "06") {
                    return "烤漆设备"
                }else if (val == "07") {
                    return "强制排风设施"
                }else {
                    return "异常"
                }
            }
        }
    }()
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
            $.map(deviceHelper.getData(),function(value,key){
                $('#name').append('<option value="' + key + '">' + value + '</option>');
            });
        },
        reload:function(){

            $('#divtable').html('');
            var  cols=" a.position,b.customer_code cusCode,b.customer_name,b.link_mantel,b.average_use_time,c.device_name,c.device_type,c.gas_min gasMin," +
                "c.gas_max gasMax,c.device_code dCode,d.ysl";
            var froms="gas_ctm_nonrsdt_device_detail a inner join gas_ctm_archive b on b.customer_code=a.customer_code " +
                " inner join gas_biz_device c on c.device_code=a.device_code  " +
                " inner join (select sum(gas) ysl,customer_code from gas_report_ysl_new   " +
                " group by customer_code  ) d on a.customer_code=d.customer_code";

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
                            col:"cusCode",
                            friendly:"客户编号",
                            validate:"required",
                            index:1
                        },
                        {
                            col:"customerName",
                            friendly:"客户名称",
                            validate:"required",
                            index:2
                        },
                        {
                            col:"linkMantel",
                            friendly:"联系电话",
                            validate:"required",
                            index:3
                        },
                        {
                            col:"deviceName",
                            friendly: "设备名称",
                            validate:"required",
                            index:4
                        },
                        {
                            col:"position",
                            friendly:"设备安装位置",
                            validate:"required",
                            index:6
                        },
                        {
                            col:"deviceType",
                            validate:"required",
                            friendly:"设备类型",
                            hidden:true,
                            nonedit:"nosend",
                            format: typeFormat,
                            index:9
                        },
                        {
                            col:"gasMin",
                            validate:"required",
                            friendly:"耗气量最小值",
                            index:10
                        },
                        {
                            col:"gasMax",
                            validate:"required",
                            friendly:"耗气量最大值",
                            index:11
                        },
                        {
                            col: "ysl",
                            validate: "required",
                            friendly: "销售量",
                            index: 12
                        }
                        ,
                        {
                            col:"ctmArchiveId",
                            validate:"required",
                            friendly:"天数",
                            format:subDateFormat,
                            index:13
                        }

                    ],

                    // 查询过滤条件

                    findFilter: function(){
                        var hour = 1;
                        var customerCode =  $('#customerCode').val();
                        var name = $('#name option:selected').val();

                        var whereinfo = "";
                        if (customerCode) {
                            whereinfo +=" b.customer_code like  '%" + customerCode + "%' and ";   //   " cusCode =" + customerCode + " and ";
                        }
                        if (name) {
                            whereinfo += "c.device_code = '" + name + "' and ";
                        }


                        if ($("#find_start_date").val() && $("#find_end_date").val()) {
                            hour = getHour($('#find_start_date').val(), $("#find_end_date").val());
                            cols = cols
                            // froms = "gas_ctm_nonrsdt_device_detail a inner join gas_ctm_archive b on b.customer_code=a.customer_code " +
                            //     " inner join gas_biz_device c on c.device_code=a.device_code  " +
                            //     " inner join (select sum(gas) ysl,customer_code from gas_report_ysl_new   " +
                            //     "where trade_date>=to_date('"+$("#find_start_date").val()+"','yyyy-mm-dd') and trade_date<to_date('"+$("#find_end_date").val()+"','yyy-mm-dd')" +
                            //     " group by customer_code  ) d on a.customer_code=d.customer_code" ;


                            froms ="gas_ctm_nonrsdt_device_detail a inner join gas_ctm_archive b on b.customer_code=a.customer_code " +
                            " inner join gas_biz_device c on c.device_code=a.device_code  " +
                            " inner join (select sum(gas) ysl,customer_code from gas_report_ysl_new   " +
                                "where trade_date >= to_date('"+$("#find_start_date").val()+"','yyyy-mm-dd') and trade_date <= to_date( '"+$("#find_end_date").val()+"','yyyy-mm-dd'）"+
                            " group by customer_code  ) d on a.customer_code=d.customer_code";
                            //" to_char(damage.created_time,'yyyy-mm-dd')  between '" + $('#find_start_date').val() + "' and '" + $("#find_end_date").val() + "' and ";
                            // alert(hour)
                        } else if ($("#find_start_date").val() && !$("#find_end_date").val()) {
                            bootbox.alert("请输入截止日期")
                        } else if (!$("#find_start_date").val() && $("#find_end_date").val()) {
                            bootbox.alert("请输入起始日期")
                        }



                        bd = {
                            "cols": cols,
                            "froms": froms,
                            "wheres":  whereinfo+" 1=1",
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




