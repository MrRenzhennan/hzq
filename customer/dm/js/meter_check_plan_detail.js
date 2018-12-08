
SideBar.init();
SideBar.activeCurByPage("meter_check_plan_Management.html");

var xw;
var href = document.location.href;
var checkplanid = href.substring(href.indexOf('?')+1,href.length);

var meterCheckPlanDetailAction = function () {

    //helper

    var metertypeIdHelper = RefHelper.create({
        ref_url:'gasmtrmetertype',
        ref_col:'metertypeId',
        ref_display:'metertypename'
    });

    var reskindIdHelper = RefHelper.create({
        ref_url:'gasmtrreskind',
        ref_col:'reskindId',
        ref_display:'reskindname'
    });

    var meterspecIdHelper = RefHelper.create({
        ref_url:'gasmtrmeterspec',
        ref_col:'meterspecId',
        ref_display:'name'
    });

    var factoryHelper = RefHelper.create({
        ref_url:'gasmtrfactory',
        ref_col:'factoryId',
        ref_display:'name'
    });

    var areaIdHelper = RefHelper.create({
        ref_url:'gassysarea',
        ref_col:'areaId',
        ref_display:'areaname'
    });

    //format

    var metertypeIdFormat = function () {
        return {
            f : function (val) {
                return metertypeIdHelper.getDisplay(val);
            }
        }
    }();

    var reskindIdFormat = function () {
        return {
            f : function (val) {
                return reskindIdHelper.getDisplay(val);
            }
        }
    }();

    var meterspecIdFormat = function () {
        return {
            f : function (val) {
                return meterspecIdHelper.getDisplay(val);
            }
        }
    }();

    var factoryFormat = function () {
        return {
            f : function (val) {
                return factoryHelper.getDisplay(val);
            }
        }
    }();

    var areaIdFormat = function () {
        return {
            f : function (val) {
                return areaIdHelper.getDisplay(val);
            }
        }
    }();
    return {

        init : function () {
            this.initHelper();
            this.reload();
        },

        initHelper : function () {

            $.map(metertypeIdHelper.getData(),function (value, key) {
                $('#find_metertypeId').append('<option value="' + key + '">' + value + '</option>');
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
                    restbase: 'gasmtrplandetail?query={"checkplanid":"'+checkplanid+'"}',
                    key_column:'planDetailId',
                    coldefs:[
                        {
                            col:"planDetailId",
                            friendly:"表具计划详情",
                            unique:"true",
                            hidden:true,
                            sorting:false,
                            index:1
                        },
                        {
                            col:"checkplanid",
                            friendly:"检表计划",
                            hidden:true,
                            sorting:false,
                            index:2
                        },
                        {
                            col:"bookId",
                            friendly:"抄表本",
                            sorting:false,
                            index:3
                        },
                        {
                            col:"meterId",
                            friendly:"表具编号",
                            sorting:false,
                            index:4
                        },
                        {
                            col:"metertypeId",
                            friendly:"表具类型",
                            format:metertypeIdFormat,
                            sorting:false,
                            index:5
                        },
                        {
                            col:"reskindId",
                            friendly:"物品种类",
                            format:reskindIdFormat,
                            sorting:false,
                            index:6
                        },
                        {
                            col:"meterspecId",
                            friendly:"表具规格型号",
                            format:meterspecIdFormat,
                            sorting:false,
                            index:7
                        },
                        {
                            col:"leavefactorydate",
                            friendly:"出厂日期",
                            index:8
                        },
                        {
                            col:"factoryId",
                            friendly:"厂家",
                            format:factoryFormat,
                            sorting:false,
                            index:9
                        },
                        {
                            col:"areaId",
                            friendly:"供气区域",
                            format:areaIdFormat,
                            sorting:false,
                            index:10
                        },
                        {
                            col:"meterAddress",
                            friendly:"地址",
                            sorting:false,
                            index:11
                        },
                        {
                            col:"operator",
                            friendly:"操作人员",
                            sorting:false,
                            index:12
                        },
                        {
                            col:"state",
                            friendly:"状态",
                            sorting:false,
                            index:13
                        }

                    ],
                    //---------------查询时过滤条件
                    findFilter: function(){//find function

                        var metertypeId = undefined;
                        if($('#find_metertypeId').val()){
                            metertypeId = RQLBuilder.equal('metertypeId',$('#find_areaId').val());
                        }

                        var checkplanid = RQLBuilder.equal('checkplanid',document.location.href.split('?')[1]);

                        var filter = RQLBuilder.and([
                            metertypeId, checkplanid
                        ]);

                        xw.setRestURL(hzq_rest + 'gasmtrplandetail');

                        return filter.rql();
                    },//--findFilter

                    onAdded: function(ret,jsondata){

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

