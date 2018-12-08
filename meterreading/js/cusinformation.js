/**
 * Created by Administrator on 2017/4/17 0017.
 */
var MrdPlanManagerAction = function(){
    var wx;
    var str =location.search;
    var  list = str.slice(1);
    var gasTypeHelper=RefHelper.create({
        ref_url:"gasbizgastype",
        ref_col:"gastypeId",
        ref_display:"gastypename"
    });
// console.log(gasTypeHelper);

    var gasTypeFormat = function () {
        return {
            f : function (val) {
                return gasTypeHelper.getDisplay(val);
            }
        }
    }();
    return {
        init : function(){
            this.reload();
            //this
        },
        reload : function(){
            $('#divtable').html('');

            wx = XWATable.init({
                divname : 'divtable',
                //----------------table的选项-------
                pageSize : 10,
                columnPicker : true,
                transition : 'fade',
                checkboxes : false,
                checkAllToggle : true,
                //----------------基本restful地址---
                restbase :'gasmrdplan/listplandetailArchive'+list,
                key_column: 'RN',
                coldefs:[
                    {
                        col : 'ctmArchiveId',
                        friendly : '客户档案ID',
                        unique : true,
                        nonendit : 'nosend',
                        readonly : 'readonly',
                        sorting : false,
                        index : 1
                    },
                    {
                        col : 'cusromername',
                        friendly : '客户名称',
                        sorting:false,
                        index : 2
                    },
                    {
                        col : 'gastypeid',
                        friendly : '用气类型',
                        format:gasTypeFormat,
                        ref_url:  "gasbizgastype",
                        ref_name: "gastypename",
                        ref_value: "gastypeId",
                        sorting:false,
                        index : 3
                    },
                    {
                        col : 'copytime',
                        friendly : '上次抄表日期',
                        sorting:false,
                        index : 4
                    },
                    {
                        col : 'meterreading',
                        friendly : '燃气表读数',
                        sorting:false,
                        index : 5
                    },
                    {
                        col : 'revisereading',
                        friendly : '修正表读数',
                        sorting:false,
                        index : 6
                    },
                    {
                        col : 'chargingmeter',
                        friendly : '计费表',
                        format:enumReverse("enumctrl/chargingMeterEnum"),
                        ref_url:"enumctrl/chargingMeterEnum",
                        ref_name:"enumName",
                        ref_value:"enumVal",
                        sorting:false,
                        index : 7
                    }/*,
                    {
                        col : 'count_business_book',
                        friendly : '非居民本数',
                        sorting:false,
                        index : 8
                    },
                    {
                        col : 'sum_b_doorcount',
                        friendly : '非居民户数',
                        sorting:false,
                        index : 9
                    },*/
                    /*,
                     {
                     col:"operate",
                     friendly:"操作",
                     format:details,
                     sorting:false,
                     index : 9
                     }*/
                ]
            }); // --init

        },
        /*details:function(){
         $('.but_details').on('click',function(){
         console.log($(this));
         location.href = "detailsofsupply_area.html?areaId=";
         })
         }*/
    }
}();