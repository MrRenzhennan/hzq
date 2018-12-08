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
var loginarea = [];
var areaId = JSON.parse(localStorage.getItem("user_info")).area_id
GasModSys.areaList({
    "areaId":areaId,
    "cb":function(data){
        console.log(data)
        $.each(data,function(key,val){
            loginarea.push(val.areaId);
            $('#find_unit').append('<option value="'+val.areaId+'" name="'+val.areaId+'">'+val.areaName+'</option>');
            $('#find_units').append('<option value="'+val.areaId+'" name="'+val.areaId+'">'+val.areaName+'</option>');
        })
    }
});
var areaHelper=RefHelper.create({
    ref_url:"gasbizarea",
    ref_col:"areaId",
    ref_display:"areaName"
});
var areaFormat=function(){
    return {
        f: function(val){
            return areaHelper.getDisplay(val);
        }
    }
}();

var deviceSaleAction = function () {

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


            var bd = {
                "cols": "archive.customer_name,archive.link_mantel,archive.areaId,detail.*,c.device_name",
                "froms": "gas_ctm_archive archive inner join gas_ctm_nonrsdt_device_detail detail " +
                    "on archive.customer_code = detail.customer_code " +
                    "inner join gas_biz_device c on c.device_code=detail.device_code",
                "wheres":"1=1 and archive.area_id in ("+loginarea.join()+")",
                "pade": true,
                "limit":50
            }
            // var openButton = function() {
            //     return {
            //         f: function() {
            //             return "<a id='d_button' href='meterreading/project/meterreading9.html'>详情&nbsp;<span class='glyphicon glyphicon-pencil'></span></a> ";
            //         }
            //     }
            // }();

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
                            col:"customerCode",
                            friendly:"客户编号",
                            validate:"required",
                            index:1
                        },
                        {
                            col:"areaId",
                            friendly:"供气区域",
                            format:areaFormat,
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
                            col:"name",
                            friendly: "设备名称",
                            validate:"required",
                            index:4
                        },
                        {
                            col:"count",
                            friendly:"设备数量",
                            nonedit:"nosend",
                            index:5
                        },
                        {
                            col:"position",
                            friendly:"设备安装位置",
                            validate:"required",
                            index:6
                        },
                        {
                            col:"brand",
                            friendly:"设备品牌",
                            validate:"required",
                            index:7
                        },
                        {
                            col:"model",
                            friendly:"设备型号",
                            validate:"required",
                            index:8
                        },
                        {
                            col:"type",
                            validate:"required",
                            friendly:"设备类型",
                            format: typeFormat,
                            index:9
                        },
                        {
                            col:"createdTime",
                            validate:"required",
                            friendly:"创建时间",
                            format: dateFormat,
                            index:10
                        }

                    ],

                    // 查询过滤条件

                    findFilter: function(){
                        var customerCode =  $('#customerCode').val();
                        var name = $('#name option:selected').val();

                        var whereinfo = "";
                        if (customerCode) {
                            whereinfo += " detail.customer_code =" + customerCode + " and ";
                        }
                        if (name) {
                            whereinfo += "detail.device_code = '" + name + "' and ";
                        }

                        if ($("#find_unit").val()) {
                            whereinfo += " archive.area_id = '" + $("#find_unit").val() + "' and ";
                        }
                        if ($("#find_start_date").val() && $("#find_end_date").val()) {
                            whereinfo += " to_char(detail.created_time,'yyyy-mm-dd')  between '" + $('#find_start_date').val() + "' and '" + $("#find_end_date").val() + "' and ";
                        } else if ($("#find_start_date").val() && !$("#find_end_date").val()) {
                            bootbox.alert("请输入截止日期")
                        } else if (!$("#find_start_date").val() && $("#find_end_date").val()) {
                            bootbox.alert("请输入起始日期")
                        }

                        bd = {
                            "cols": "archive.customer_name,archive.link_mantel,detail.*,c.device_name",
                            "froms": "gas_ctm_archive archive inner join gas_ctm_nonrsdt_device_detail detail " +
                            "on archive.customer_code = detail.customer_code " +
                            "inner join gas_biz_device c on c.device_code=detail.device_code",
                            "wheres": whereinfo+"1=1 and archive.area_id in ("+loginarea.join()+")",
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




