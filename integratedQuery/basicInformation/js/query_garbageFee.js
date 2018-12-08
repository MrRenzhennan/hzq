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

var areaFormat = function () {
    return {
        f: function (val) {
            return areaHelper.getDisplay(val);
        },
    }
}();
//用户helper
var userHelper=RefHelper.create({
    ref_url:"gassysuser",
    ref_col:"userId",
    ref_display:"employeeName",
});

var userHelperFormat=function () {
    return{
        f:function(val){
            return userHelper.getDisplay(val)
        }
    }
}();
var loginarea = [];
var areaId = JSON.parse(localStorage.getItem("user_info")).area_id
GasModSys.areaList({
    "areaId":areaId,
    "cb":function(data){
        console.log(data)
        $.each(data,function(key,val){
            loginarea.push(val.areaId);
            $('#find_unit').append('<option value="'+val.areaId+'" name="'+val.areaId+'">'+val.areaName+'</option>');
        })
    }
});

function getHour(s1,s2) {
    s1 = new Date(s1.replace(/-/g, '/'));
    s2 = new Date(s2.replace(/-/g, '/'));
    var ms = Math.abs(s1.getTime() - s2.getTime());
    return ms / 1000 / 60 / 60;
}
// alert( getHour('2017-8-23 12:05:05', '2017-8-23 13:05:05'))
var garbageFeeAction = function () {
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
            // $.map(deviceHelper.getData(),function(value,key){
            //     $('#name').append('<option value="' + key + '">' + value + '</option>');
            // });
        },
        reload:function(){

            $('#divtable').html('');

            var bd = {
                "cols": "c.*,b.last_paydate",
                "froms": "( select count(*) times,customer_code,customer_name,area_id,created_by from gas_chg_gas_detail where unpay_waste = '1' group by customer_code,customer_name,area_id,created_by) c " +
                         "left join (select max(created_time) last_paydate ,customer_code from gas_chg_gas_detail group by  customer_code  ) b on c.customer_code = b.customer_code" ,
                "wheres": "1=1 and area_id in ("+loginarea.join()+")  order by c.times desc",
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
                            col:"customerCode",
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
                            col:"areaId",
                            friendly:"供气区域",
                            format:areaFormat,
                            validate:"required",
                            index:3
                        },
                        {
                            col:"times",
                            friendly: "拒交次数",
                            validate:"required",
                            index:4
                        },
                        {
                            col:"lastPaydate",
                            friendly:"最后一次交费日期",
                            format:GasModBil.dateFormat,
                            validate:"required",
                            index:6
                        },
                        {
                            col:"createdBy",
                            validate:"required",
                            friendly:"收费人",
                            format:userHelperFormat,
                            nonedit:"nosend",
                            index:7
                        }

                    ],

                    // 查询过滤条件

                    findFilter: function(){
                        var customerCode =  $('#customerCode').val();
                        var customerName =  $('#customerName').val();
                        var times =  $('#times').val();
                        var areaId_select = $('#find_unit option:selected').val();

                        var whereinfo = "";
                        if (customerCode) {
                            whereinfo +=" c.customer_code like  '%" + customerCode + "%' and ";
                        }
                        if (customerName) {
                            whereinfo += "customer_name like '%" + customerName + "%' and ";
                        }
                        if (times) {
                            whereinfo +=" c.times  ='" + times + "' and ";
                        }
                        if (areaId_select) {
                            whereinfo += " c.area_id = '" + areaId_select + "' and ";
                        }

                        bd = {
                            "cols": "c.*,b.last_paydate",
                            "froms": "( select count(*) times,customer_code,customer_name,area_id,created_by from gas_chg_gas_detail where unpay_waste = '1' group by customer_code,customer_name,area_id,created_by) c " +
                            "left join (select max(created_time) last_paydate ,customer_code from gas_chg_gas_detail group by  customer_code  ) b on c.customer_code = b.customer_code" ,
                            "wheres": whereinfo+"1=1 and area_id in ("+loginarea.join()+")",
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




