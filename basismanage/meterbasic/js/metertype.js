

var factoryHelper = RefHelper.create({
    ref_url:'gasmtrfactory',
    ref_col:'factoryId',
    ref_display:'factoryName'
});

var factoryFormat = function () {
    return {
        f : function (val) {
            return factoryHelper.getDisplay(val);
        }
    }
}();

var BaseAction = function () {


    return {

        init: function () {
            // 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)
            this.reload();
        },


        reload:function(){

            $('#divtable').html('');

            this.xw=XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize:10,
                    columnPicker: true,
                    transition: 'fade',
                    checkboxes: true,
                    checkAllToggle:true,
                    //----------------基本restful地址---
                    restbase: 'gasmtrmetertype',
                    key_column:'meterTypeId',
                    coldefs:[
                        {
                            col:"meterTypeId",
                            friendly:"表具类型ID",
                            unique:"true",
                            index:1
                        },
                        {
                            col:"modelNumber",
                            friendly:"型号",
                            validate:"required",
                            index:2
                        },
                        {
                            col:"funcLevel",
                            friendly:"级别",
                            validate:"required",
                            index:3
                        },
                        {
                            col:"isDir",
                            friendly:"是否目录",
                            format:GasSysBasic.isDirFormat,
                            index:4
                        },
                        {
                            col:"meterTypeCode",
                            friendly:"表具类型代码",
                            validate:"required",
                            index:5
                        },
                        {
                            col:"meterTypeName",
                            friendly:"表具类型名称",
                            validate:"required",
                            index:6
                        },
                        {
                            col:"factory",
                            friendly:"厂家",
                            format:factoryFormat,
                            inputsource: "select",
                            ref_url:  "gasmtrfactory",
                            ref_name: "factoryName",
                            ref_value: "factoryId",
                            validate:"required",
                            index:7
                        },
                        {
                            col:"displayMode",
                            friendly:"显示方式",
                            validate:"required",
                            index:8
                        },
                        {
                            col:"capacity",
                            friendly:"额定流量",
                            index:9
                        },
                        {
                            col:"flowOrder",
                            friendly:"进气方向",
                            format:GasSysBasic.directionFormat,
                            validate:"required",
                            index:10
                        },
                        // {
                        //     col:"meterKind",
                        //     friendly:"表种类",
                        //     index:6
                        // },



                        {
                            col:"parentMeterTypeId",
                                friendly:"上级ID",
                            index:11
                        },
                        {
                            col:"measureScope",
                                friendly:"测量范围",
                            index:12
                        },

                        {
                            col:"precision",
                            friendly:"精度",
                            index:13
                        },
                        {
                            col:"checkCycle",
                            friendly:"检表周期",
                            index:13
                        }


                    ],

                    // 查询过滤条件
                    findFilter: function(){
                        var find_unitname /*, find_unitname*/;

                        if($('#find_unitname').val())
                        {
                            find_unitname=RQLBuilder.equal("modelNumber",$('#find_unitname').val());
                        }

                       /* if($('#find_unitname').val())
                        {
                            find_unitname=RQLBuilder.like("unitname",$('#find_unitname').val());
                        }*/

                        var filter=RQLBuilder.and([
                            find_unitname /*, find_unitname*/
                        ]);
                        return filter.rql();
                    },

                    onAdded: function(ret,jsondata){
                        return  validateForm(jsondata);
                    },
                    onUpdated: function(ret,jsondata){
                        return  validateForm(jsondata);
                    },
                    onDeleted: function(ret,jsondata){
                    }
                }) //--init
        },

    }
}();
