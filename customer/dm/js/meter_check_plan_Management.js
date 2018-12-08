
var xw;
// var year = meterCheckPlanAction.xw.;
var meterCheckPlanAction = function () {

    //helper
    var areaIdHelper = RefHelper.create({
        ref_url:'gassysarea',
        ref_col:'areaId',
        ref_display:'areaname'
    });

    //format

    var areaIdFormat = function () {
        return {
            f : function (val) {
                return areaIdHelper.getDisplay(val);
            }
        }
    }();

    var operateFormat = function () {
        return {
            f : function (val,row) {
                return "" +
                    "<a href='customer/dm/add_meter_check_plan_branch.html?planId="+ val + "&areaId="+row.areaId+"'>&nbsp;录入明细&nbsp;</a>" +
                    "<a href='customer/dm/meter_check_plan_detail.html?"+ val + "'>&nbsp;查看明细&nbsp;</a>";
            }
        }
    }();

    return {

        init : function () {
            this.initHelper();
            this.reload();
        },

        initHelper : function () {

            $.map(areaIdHelper.getData(),function (value, key) {
                $('#find_areaId').append('<option value="' + key + '">' + value + '</option>');
            });
        },

        reload:function () {
            $('#divtable').html('');

             xw = XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize:10,
                    columnPicker: true,
                    transition: 'fade',
                    checkboxes: true,
                    checkAllToggle:true,
                    //----------------基本restful地址---
                    restbase: 'gasmtrplan?query={"plantype":"0201"}',
                    key_column:'checkplanid',
                    coldefs:[
                        {
                            col:"checkplanid",
                            friendly:"计划编号",
                            unique:"true",
                            hidden:true,
                            nonedit:"nosend",
                            sorting:false,
                            index:1
                        },
                        {
                            col:"plancode",
                            friendly:"计划编号",
                            sorting:false,
                            index:2
                        },
                        {
                            col:"year",
                            friendly:"年度",
                            inputsource:"monthpicker",
                            date_format:"yyyy",
                            index:3
                        },
                        {
                            col:"areaId",
                            friendly:"供气区域",
                            inputsource:"select",
                            ref_url:"gassysarea",
                            ref_value:"areaId",
                            ref_name:"areaname",
                            format:areaIdFormat,
                            sorting:false,
                            index:4
                        },
                        // {
                        //     col:"plantype",
                        //     friendly:"计划类型", // ‘0101’ 采购计划 '0201' 检表计划 ‘0202’  换表计划 '0203'   维修计划 ‘0204’  报废计划 ‘0205‘  回收计划",
                        // index:9
                        // },
                        {
                            col:"createtime",
                            friendly:"创建时间",
                            nonedit:"nosend",
                            index:5
                        },
                        {
                            col:"quantity",
                            friendly:"数量",
                            nonedit:"nosend",
                            index:7
                        },
                        {
                            col:"checkedQuantity",
                            friendly:"完成数量",
                            nonedit:"nosend",
                            index:8
                        },
                        {
                            col:"operate",
                            friendly:"操作",
                            nonedit:"nosend",
                            format:operateFormat,
                            index:9
                        }
            ],
                    //---------------查询时过滤条件
                    findFilter: function(){//find function

                        var areaId = undefined;
                        if($('#find_areaId').val()){
                            areaId = RQLBuilder.equal('areaId',$('#find_areaId').val());
                        }

                        var plantype = RQLBuilder.equal('plantype','0201');

                        var filter = RQLBuilder.and([
                            areaId, plantype
                        ]);

                        xw.setRestURL(hzq_rest + 'gasmtrplan');

                        return filter.rql();
                    },//--findFilter

                    onAdded: function(ret,jsondata){
                        jsondata.plantype = '0201';
                        console.log("the jsondata is : " + jsondata.year);

                    },

                    onUpdated: function(ret,jsondata){

                    },

                    onDeleted: function(ret,jsondata){
                    },
                }
            )
        }
    }
}();

